import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const res = await api.post('/auth/login', data);
      if (res.data && res.data.token && res.data.user) {
        setAuth(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-xl tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span>Promptfolio</span>
          </Link>
          <p className="text-sm text-slate-400">Sign in to your Career Operating System</p>
        </div>

        <Card className="border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="engineer@company.com"
                    className="pl-9"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-5 mt-2"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t border-slate-800/60 pt-4 flex justify-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-400 font-medium ml-1 hover:underline">
              Register now
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
