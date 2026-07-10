import { GoogleGenAI } from '@google/genai';

export class GeminiService {
  private static getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables.');
    }
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Exponential backoff retry logic for transient API rate limits and network glitches
   */
  public static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelayMs: number = 1000
  ): Promise<T> {
    let lastError: any;
    let delay = initialDelayMs;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        // Check if error is retryable (429 Rate Limit, 503 Service Unavailable, network error)
        const isRateLimitOrTransient =
          error?.status === 429 ||
          error?.status === 503 ||
          error?.message?.includes('429') ||
          error?.message?.includes('503') ||
          error?.message?.includes('network') ||
          error?.message?.includes('timeout');

        if (attempt === maxRetries || !isRateLimitOrTransient) {
          throw error;
        }

        console.warn(`[GeminiService] Attempt ${attempt} failed (${error?.message || error}). Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
    throw lastError;
  }

  /**
   * Parse and validate structured JSON output from Gemini response buffer
   */
  public static parseAndValidateJson<T = any>(rawText: string, requiredKeys: string[] = []): T {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Empty response received from AI model.');
    }

    // Strip markdown code fences if present (e.g., ```json ... ```)
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
    }

    // Attempt parsing
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e: any) {
      // Try to find JSON object substring if extra conversational text is present
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
        } catch {
          throw new Error(`AI generated malformed JSON: ${e.message}`);
        }
      } else {
        throw new Error(`AI generated malformed JSON: ${e.message}`);
      }
    }

    // Validate required top-level keys if specified
    if (requiredKeys.length > 0 && typeof parsed === 'object' && parsed !== null) {
      for (const key of requiredKeys) {
        if (!(key in parsed)) {
          throw new Error(`AI JSON response is missing required key: "${key}"`);
        }
      }
    }

    return parsed as T;
  }

  /**
   * Generate structured JSON using Gemini model
   */
  public static async generateJson<T = any>(
    prompt: string,
    requiredKeys: string[] = [],
    modelName: string = 'gemini-2.5-flash'
  ): Promise<T> {
    const client = this.getClient();

    return this.retryWithBackoff(async () => {
      const response = await client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
          maxOutputTokens: 4096,
        },
      });

      const text = response.text || '';
      return this.parseAndValidateJson<T>(text, requiredKeys);
    });
  }

  /**
   * Generate standard formatted markdown or text
   */
  public static async generateText(
    prompt: string,
    modelName: string = 'gemini-2.5-flash',
    temperature: number = 0.5
  ): Promise<string> {
    const client = this.getClient();

    return this.retryWithBackoff(async () => {
      const response = await client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature,
          maxOutputTokens: 4096,
        },
      });

      const text = response.text || '';
      if (!text.trim()) {
        throw new Error('AI returned empty content.');
      }
      return text.trim();
    });
  }

  /**
   * Helper to load and interpolate variable placeholders into prompt templates
   */
  public static loadPromptTemplate(template: string, variables: Record<string, any>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      const replacement = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? '');
      result = result.replace(placeholder, replacement);
    }
    return result;
  }
}

export default GeminiService;
