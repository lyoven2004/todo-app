"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TLoginFormValues, loginSchema } from "../_config/login.schema";
import { getAuthErrorMessage, useLogin } from "../_hooks/use-login";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: 'onChange'
  });

  const { mutate: login, isPending } = useLogin({
    onSuccess: () => {
      toast.success(`Sign in successfully`, {
        description: "Welcome back!",
      });
    },
    onError: (error) => {
      toast.error("Sign in failed", {
        description: getAuthErrorMessage(error.code),
      });
    },
    redirectTo: "/",
  });

  const onSubmit = (values: TLoginFormValues) => {
    login(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  className="h-11 text-base placeholder:text-muted-foreground/60"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-foreground">
                  Password
                </FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-11 text-base placeholder:text-muted-foreground/60 pr-10"
                    disabled={isPending}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}