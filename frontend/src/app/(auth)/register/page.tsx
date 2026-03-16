"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, TRegisterSchema } from "@/zod/auth.zod";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/auth.services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

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
    <div className="flex h-screen w-full bg-[#FDFDFD] overflow-hidden font-inter">
      {/* Left Section: Register Form */}
      <div className="w-full lg:w-[45%] flex flex-col p-8 md:p-12 lg:p-16 h-full overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/login" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-white/80" />
            </div>
            <span className="font-onest font-bold text-2xl text-[#1F232A]">Obliq</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto">
          <div className="w-full bg-white rounded-[32px] p-8 md:p-10 shadow-[0px_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center">
            <div className="text-center mb-8">
              <h1 className="font-onest text-[32px] font-bold text-[#1F232A] mb-2 tracking-tight">Create Account</h1>
              <p className="text-[#9BA0AB] text-[16px]">Join our platform today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[#404857] font-medium ml-1">Full Name</Label>
                <Input
                  {...register("name")}
                  id="name"
                  placeholder="John Doe"
                  className={cn(
                    "h-12 rounded-xl border-gray-200 bg-[#F9FAFB] px-4 font-inter focus-visible:ring-brand-primary focus-visible:bg-white transition-all",
                    errors.name && "border-red-500"
                  )}
                />
                {errors.name && (
                  <span className="text-xs text-red-500 ml-1">{errors.name.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[#404857] font-medium ml-1">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className={cn(
                    "h-12 rounded-xl border-gray-200 bg-[#F9FAFB] px-4 font-inter focus-visible:ring-brand-primary focus-visible:bg-white transition-all",
                    errors.email && "border-red-500"
                  )}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[#404857] font-medium ml-1">Password</Label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className={cn(
                      "h-12 rounded-xl border-gray-200 bg-[#F9FAFB] px-4 font-inter focus-visible:ring-brand-primary focus-visible:bg-white transition-all pr-12",
                      errors.password && "border-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[#404857] font-medium ml-1">Confirm Password</Label>
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className={cn(
                    "h-12 rounded-xl border-gray-200 bg-[#F9FAFB] px-4 font-inter focus-visible:ring-brand-primary focus-visible:bg-white transition-all",
                    errors.confirmPassword && "border-red-500"
                  )}
                />
                {errors.confirmPassword && (
                  <span className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</span>
                )}
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-14 bg-brand-primary hover:bg-[#E85B2F] text-white rounded-2xl text-lg font-bold shadow-[0px_10px_20px_rgba(253,109,63,0.2)] transition-all transform active:scale-[0.98] disabled:opacity-70 mt-4"
              >
                {mutation.isPending ? "Creating Account..." : "Sign up"}
              </Button>
            </form>

            <div className="mt-8 flex gap-2 text-sm">
              <span className="text-[#666C79]">Already have an account?</span>
              <Link href="/login" className="text-[#1F232A] font-bold hover:underline">Login</Link>
            </div>
          </div>
        </div>

        {/* Footer info placeholder */}
        <div className="mt-8 pt-8 pb-4 text-center text-xs text-[#9BA0AB]">
          © 2024 Obliq Platform. All rights reserved.
        </div>
      </div>

      {/* Right Section: Large Visual Area */}
      <div className="hidden lg:block w-[55%] h-[calc(100%-40px)] m-5 rounded-[40px] relative overflow-hidden bg-[#F5F5F5]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/image 1.webp" 
            alt="Design Background" 
            fill 
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-x-[10%] bottom-0 top-[15%] z-10 rounded-t-[32px] bg-white shadow-[0px_-20px_100px_rgba(0,0,0,0.1)] overflow-hidden border-t border-x border-gray-100 flex flex-col">
          <div className="h-14 bg-[#F9FAFB] border-b border-gray-100 flex items-center px-6 gap-4">
             <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
               <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
               <div className="w-3 h-3 rounded-full bg-[#28C840]" />
             </div>
             <div className="flex-1 max-w-sm h-7 bg-white rounded-md border border-gray-200 flex items-center px-3">
               <span className="text-[10px] text-gray-400">obliq.io/register</span>
             </div>
          </div>
          
          <div className="flex-1 relative">
            <Image 
              src="/images/Frame.webp" 
              alt="Dashboard Preview" 
              fill 
              className="object-top object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
