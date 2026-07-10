import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-xl tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span>Promptfolio</span>
          </Link>
          <p className="text-sm text-slate-400">Password recovery studio</p>
        </div>

        <Card className="border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Reset password</CardTitle>
            <CardDescription>Enter your email to receive recovery instructions</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-5 h-5" /> Recovery Email Sent
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If an account exists for <span className="font-mono text-white">{email}</span>, we have sent instructions to reset your password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="engineer@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-semibold py-5">
                  Send Recovery Link
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-800/60 pt-4 flex justify-center text-sm text-slate-400">
            <Link to="/login" className="inline-flex items-center text-blue-400 font-medium hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
