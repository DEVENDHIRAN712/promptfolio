import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import api from '@/lib/axios';

const forgotSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      await api.post('/auth/forgot-password', data);
      setSuccessMsg('If an account exists with that email, we have sent password reset instructions.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex items-center justify-center p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#111827]">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Promptfolio</span>
          </Link>
          <p className="text-sm text-[#64748B]">Recover access to your account</p>
        </div>

        <Card className="bg-white border-[#E2E8F0] shadow-md rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-[#111827]">Forgot password</CardTitle>
            <CardDescription className="text-[#64748B]">Enter your registered email and we&apos;ll send recovery instructions</CardDescription>
          </CardHeader>
          <CardContent>
            {successMsg ? (
              <div className="p-5 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
                <h4 className="font-bold text-[#111827] text-base">Check your email</h4>
                <p className="text-sm text-[#64748B] leading-relaxed">{successMsg}</p>
                <div className="pt-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full border-[#E2E8F0] font-semibold">
                      Return to login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] flex items-center gap-2.5 text-[#EF4444] text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-[#111827]">Email address</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#64748B]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="engineer@company.com"
                      className="pl-10"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-[#EF4444]">{errors.email.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-5 mt-2 shadow-sm"
                >
                  {isSubmitting ? 'Sending link...' : 'Send Recovery Link'} <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="border-t border-[#F1F5F9] pt-4 flex justify-center text-sm text-[#64748B]">
            Remember your password?{' '}
            <Link to="/login" className="text-[#4F46E5] font-semibold ml-1 hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Sign in
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
