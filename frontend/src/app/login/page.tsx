'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LayoutDashboard, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { login } from '@/services/authService';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back! Logging you in...');
      window.location.href = '/dashboard';
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to login. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50/50 p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <LayoutDashboard className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-1">
              Trucker<span className="text-blue-600">Finance</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Advanced Fleet Management</p>
          </div>
        </div>

        <Card className="border-none shadow-2xl shadow-blue-100/50 rounded-2xl">
          <CardHeader className="space-y-1 pb-8 pt-8 px-8">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">Email or Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="email" 
                    placeholder="Email or Username" 
                    type="text" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</Label>
                  <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Checkbox id="remember" className="rounded-md border-gray-300 data-[state=checked]:bg-blue-600" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                >
                  Remember me for 30 days
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 px-8 pb-8 pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-base shadow-lg shadow-blue-200 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-sm text-center text-gray-500">
                Don't have an account?{" "}
                <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700">Create an account</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-gray-400">© 2024 TruckerFinance. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
