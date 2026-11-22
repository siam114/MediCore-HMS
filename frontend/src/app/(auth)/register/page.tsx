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
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { registerSchema, type RegisterFormValues } from "@/lib/validations";
import { authService } from "@/services/api";
import { useAuthStore } from "@/store";

export default function RegisterPage() {
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
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "PATIENT",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);

      if (response.success && response.data) {
        const { user, token } = response.data;
        setAuth(user, token);
        toast.success("Registration Successful!", {
          description: `Account created for ${user.name}`,
        });
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create account. Please try again.";
      toast.error("Registration Failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async (name: string, email: string) => {
    try {
      setIsGoogleLoading(true);
      const response = await authService.googleAuth({
        name,
        email,
        avatar: "",
      });

      if (response.success && response.data) {
        const { user, token } = response.data;
        setAuth(user, token);
        setShowGoogleModal(false);
        toast.success(`Welcome to MediCore, ${user.name}!`, {
          description: "Signed up and logged in with Google (Patient Portal)",
        });
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Google authentication failed";
      toast.error("Google Sign Up Failed", {
        description: message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/20 to-sky-50/30 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <Link
          href="/"
          title="Back to MediCore Homepage"
          className="block text-center space-y-2 group cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/30 group-hover:bg-teal-700 transition-colors">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            MediCore HMS
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Patient & Staff Registration Portal
          </p>
        </Link>

        {/* Register Card */}
        <Card className="border-slate-200/80 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Create Your Account</CardTitle>
            <CardDescription>
              Join MediCore to manage appointments and medical records
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Quick Google Sign Up Option */}
            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading}
              onClick={() => setShowGoogleModal(true)}
              className="w-full h-11 border-slate-200 hover:bg-slate-50 shadow-sm dark:border-slate-800 dark:hover:bg-slate-900 font-medium"
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
                  Sign up with Google (Instant Access)
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-slate-400">Or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    placeholder="e.g. Sarah Jenkins"
                    className="pl-9"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@email.com"
                      className="pl-9"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+8801567898506"
                      className="pl-9"
                      {...register("phone")}
                    />
                  </div>
                </div>
              </div>

              {/* Password Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-10"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9"
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
                  )}
                </div>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-center dark:border-slate-800/50 dark:bg-slate-900/30">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already have a MediCore account?{" "}
              <Link
                href="/login"
                className="font-medium text-teal-600 hover:underline dark:text-teal-400"
              >
                Sign In
              </Link>
            </p>
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
                  Sign up with Google
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
                onClick={() => handleGoogleSignUp(googleName, googleEmail)}
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
