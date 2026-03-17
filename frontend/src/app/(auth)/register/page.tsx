"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { registerUser } from "@/services/auth.services";
import { registerSchema, TRegisterSchema } from "@/zod/auth.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const { settings } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });

  const onSubmit = (data: TRegisterSchema) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex h-screen w-full bg-[#FCFCFD] overflow-hidden">
      {/* Left Section - Register Form */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-12 overflow-y-auto">
        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <Link href="/login" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FD6D3F] flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <div className="w-5 h-5 rounded-full border-2 border-white/90" />
            </div>
            <span className="font-onest font-extrabold text-2xl text-[#1F232A] tracking-tight">
              {settings?.site_name || "Obliq"}
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="w-full max-w-[480px] my-12 animate-fade-in">
          <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0px_4px_30px_rgba(0,0,0,0.03),0px_20px_60px_rgba(194,194,194,0.1)] border border-gray-50">
            <div className="text-center mb-10">
              <h1 className="text-[32px] font-bold font-onest text-[#1F232A] mb-2 tracking-tight">
                Create Account
              </h1>
              <p className="text-[#9BA0AB] font-inter text-[16px]">
                Join our platform today
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[#404857] ml-1"
                >
                  Full Name
                </label>
                <div
                  className={cn(
                    "flex h-12 items-center px-4 bg-white rounded-xl border border-gray-200 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all",
                    errors.name && "border-red-500",
                  )}
                >
                  <input
                    {...register("name")}
                    id="name"
                    placeholder="John Doe"
                    className="flex-1 h-full bg-transparent border-none outline-none text-[#1F232A] placeholder:text-gray-400 text-sm font-medium"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#404857] ml-1"
                >
                  Email
                </label>
                <div
                  className={cn(
                    "flex h-12 items-center px-4 bg-white rounded-xl border border-gray-200 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all",
                    errors.email && "border-red-500",
                  )}
                >
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className="flex-1 h-full bg-transparent border-none outline-none text-[#1F232A] placeholder:text-gray-400 text-sm font-medium"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#404857] ml-1"
                >
                  Password
                </label>
                <div
                  className={cn(
                    "flex h-12 items-center px-4 bg-white rounded-xl border border-gray-200 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all",
                    errors.password && "border-red-500",
                  )}
                >
                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="flex-1 h-full bg-transparent border-none outline-none text-[#1F232A] placeholder:text-gray-400 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-[#404857] ml-1"
                >
                  Confirm Password
                </label>
                <div
                  className={cn(
                    "flex h-12 items-center px-4 bg-white rounded-xl border border-gray-200 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all",
                    errors.confirmPassword && "border-red-500",
                  )}
                >
                  <input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="flex-1 h-full bg-transparent border-none outline-none text-[#1F232A] placeholder:text-gray-400 text-sm font-medium"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-14 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-6"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Sign up"
                )}
              </button>
            </form>

            <div className="text-center mt-8">
              <p className="text-[15px] text-[#666C79]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#1F232A] hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Decorative Mockup */}
      <div className="hidden lg:flex flex-1 p-6 items-center justify-center">
        <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-[linear-gradient(135deg,#FD6D3F_0%,#FFB48F_100%)] flex items-center justify-center p-12">
          <Image
            src="/images/Frame.webp"
            alt="Wavy background"
            fill
            className="object-cover opacity-80"
            priority
          />

          {/* Dashboard Mockup Overlay */}
                    <div className="absolute right-0 w-full max-w-[600px] aspect-[1.3] rounded-l-3xl overflow-hidden shadow-2xl animate-fade-up">
                      <Image
                        src="/images/dashboard.webp"
                        alt="Dashboard Mockup"
                        fill
                        className="object-cover"
                      />
                    </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
