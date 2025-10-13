import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const isSingleWord = /^\S+$/.test(formState.username) && /^\S+$/.test(formState.password);
    if (!isSingleWord) {
      setError("Please enter single-word credentials without spaces.");
      setIsSubmitting(false);
      return;
    }

    const success = await login(formState);
    if (!success) {
      setError("Invalid credentials. Try admin / growgold");
      setIsSubmitting(false);
      return;
    }

    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-background)] via-white to-[var(--color-muted)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Grow Gold Admin</CardTitle>
          <CardDescription>Enter your single-word admin credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Admin ID</Label>
              <Input
                id="username"
                name="username"
                value={formState.username}
                onChange={handleChange}
                required
                pattern="^\\S+$"
                title="Use a single word without spaces"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
                required
                pattern="^\\S+$"
                title="Use a single word without spaces"
                placeholder="growgold"
              />
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-400">
            Tip: default credentials are <span className="font-semibold">admin</span> / <span className="font-semibold">growgold</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
