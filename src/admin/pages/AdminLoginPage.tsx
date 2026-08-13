import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { signIn, resetPassword, getAdminClaims, signOut } from '../../lib/auth';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setLoginError(null);

    try {
      const userCredential = await signIn(data.email, data.password);
      const claims = await getAdminClaims(userCredential.user);

      if (!claims.isAdmin) {
        await signOut();
        setLoginError('Access denied. This account does not have administrative privileges.');
        toast.error('Access denied.');
        setLoading(false);
        return;
      }

      toast.success('Signed in successfully.');
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      console.error('Login error:', err);
      setLoginError('Invalid email address or password.');
      toast.error('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues('email');
    if (!email || !email.includes('@')) {
      toast.error('Please enter your email address in the field above first.');
      return;
    }

    try {
      await resetPassword(email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch {
      toast.error('Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4 font-sans text-neutral-900">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#003DA5] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            N
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-neutral-900">
            NEISSR Administration
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Sign in to access the campus content management panel.
          </p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs font-semibold text-red-700 rounded-xl text-center">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email')}
                placeholder="admin@neissr.ac.in"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] text-[#003DA5] hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C8102E] hover:bg-[#9A0C24] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100">
          <p className="text-[11px] text-neutral-400">
            Authorized administrative access only. System activity is logged.
          </p>
        </div>
      </div>
    </div>
  );
}
