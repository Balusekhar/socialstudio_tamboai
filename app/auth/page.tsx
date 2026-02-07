"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { login, signup } from "@/app/lib/auth";

interface SignInForm {
  email: string;
  password: string;
}

interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [signInForm, setSignInForm] = useState<SignInForm>({
    email: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
  });

  const updateSignIn = (field: keyof SignInForm, value: string) => {
    setSignInForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSignUp = (field: keyof SignUpForm, value: string) => {
    setSignUpForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(signInForm.email, signInForm.password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Sign in failed.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signup(signUpForm.name, signUpForm.email, signUpForm.password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Sign up failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-[34px] h-[34px] rounded-full border-[6px] border-brand flex items-center justify-center">
          <div className="w-[6px] h-[6px] bg-brand rounded-full"></div>
        </div>
        <span className="font-bold text-[22px] tracking-tight text-foreground">
          IG Studio
        </span>
      </Link>

      <Tabs
        value={activeTab}
        onValueChange={(v) => { setActiveTab(v); setError(""); }}
        className="w-full max-w-md"
      >
        <TabsList className="grid w-full grid-cols-2 h-12 bg-muted rounded-xl p-1">
          <TabsTrigger
            value="signin"
            className="rounded-lg text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="rounded-lg text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Sign In Tab */}
        <TabsContent value="signin">
          <form onSubmit={handleSignIn}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue creating.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && activeTab === "signin" && (
                  <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signInForm.email}
                    onChange={(e) => updateSignIn("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInForm.password}
                    onChange={(e) => updateSignIn("password", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand/90 text-white gap-2"
                  disabled={loading}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="text-brand font-medium hover:underline"
                    onClick={() => setActiveTab("signup")}
                  >
                    Sign up
                  </button>
                </p>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Sign Up Tab */}
        <TabsContent value="signup">
          <form onSubmit={handleSignUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                  Get started with IG Studio for free.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && activeTab === "signup" && (
                  <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signUpForm.name}
                    onChange={(e) => updateSignUp("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signUpForm.email}
                    onChange={(e) => updateSignUp("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpForm.password}
                    onChange={(e) => updateSignUp("password", e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand/90 text-white gap-2"
                  disabled={loading}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Account"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-brand font-medium hover:underline"
                    onClick={() => setActiveTab("signin")}
                  >
                    Sign in
                  </button>
                </p>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-sm">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
