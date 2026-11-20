"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Activity,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Stethoscope,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { authService } from "@/services/api";
import { useAuthStore } from "@/store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleName, setGoogleName] = useState("SM SIAM");
  const [googleEmail, setGoogleEmail] = useState("siam.patient@gmail.com");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);

      if (response.success && response.data) {
        const { user, token } = response.data;
        setAuth(user, token);
        toast.success(`Welcome back, ${user.name}!`, {
          description: `Logged in successfully as ${user.role}`,
        });
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Invalid credentials. Please verify your email and password.";
      toast.error("Login Failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (name: string, email: string) => {
    try {
      setIsGoogleLoading(true);
      const response = await authService.googleAuth({ name, email });

      if (response.success && response.data) {
        const { user, token } = response.data;
        setAuth(user, token);
        setShowGoogleModal(false);
        toast.success(`Welcome, ${user.name}!`, {
          description: "Logged in via Google (Patient Portal)",
        });
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Google authentication failed";
      toast.error("Google Sign In Failed", {
        description: message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setValue("email", "dr.siam@medicore.com");
    setValue("password", "SecurePassword123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/20 to-sky-50/30 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/30">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            MediCore HMS
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hospital Management System Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200/80 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign In to Your Account</CardTitle>
            <CardDescription>
              Enter your hospital credentials to access the portal
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Quick Google Sign In */}
            <Button
              variant="outline"
              type="button"
              disabled={isGoogleLoading}
              onClick={() => setShowGoogleModal(true)}
              className="w-full h-11 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 font-medium"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-teal-600" />
                  Connecting with Google...
                </>
              ) : (
                <>
                  <svg className="mr-2.5 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google (Instant Access)
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-slate-400">Or sign in with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@medicore.com"
                    className="pl-9"
                    autoComplete="email"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info("Password Reset", {
                        description: "Please contact your hospital IT administrator.",
                      });
                    }}
                    className="text-xs text-teal-600 hover:underline dark:text-teal-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  {...register("rememberMe")}
                />
                <Label htmlFor="rememberMe" className="text-xs text-slate-600 dark:text-slate-400">
                  Keep me signed in on this device
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Credentials Box */}
            <div className="rounded-lg border border-teal-200/60 bg-teal-50/50 p-3 text-xs dark:border-teal-900/40 dark:bg-teal-950/20">
              <div className="flex items-center justify-between font-medium text-teal-800 dark:text-teal-300">
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5" />
                  Test Doctor Account (MongoDB Atlas)
                </span>
                <button
                  type="button"
                  onClick={fillTestCredentials}
                  className="rounded bg-teal-600 px-2 py-0.5 text-[11px] text-white hover:bg-teal-700"
                >
                  Auto Fill
                </button>
              </div>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Email: <span className="font-mono text-slate-700 dark:text-slate-300">dr.siam@medicore.com</span>
                <br />
                Pass: <span className="font-mono text-slate-700 dark:text-slate-300">SecurePassword123</span>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-center dark:border-slate-800/50 dark:bg-slate-900/30">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="font-medium text-teal-600 hover:underline dark:text-teal-400"
              >
                Register as Patient
              </Link>
            </p>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>HIPAA Compliant & End-to-End Encrypted</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Google Authentication Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Sign in with Google
                </h3>
                <p className="text-xs text-slate-500">
                  Choose or enter your Google account to proceed
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="googleName">Full Name</Label>
                <Input
                  id="googleName"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="googleEmail">Google Email</Label>
                <Input
                  id="googleEmail"
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => setShowGoogleModal(false)}
                disabled={isGoogleLoading}
              >
                Cancel
              </Button>
              <Button
                className="w-1/2 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => handleGoogleAuth(googleName, googleEmail)}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Continue
                    <Sparkles className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
