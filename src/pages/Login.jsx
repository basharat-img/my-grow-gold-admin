import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../config/routes";
import { Formik } from "formik";
import { object, string } from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = useMemo(
    () =>
      object({
        email: string().email("Enter a valid email address").required("Email is required"),
        password: string().required("Password is required"),
      }),
    [],
  );

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Grow Gold Admin</CardTitle>
          <CardDescription>Sign in with your admin email to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              setStatus(null);
              const success = await login(values);
              if (!success) {
                setStatus("Invalid credentials. Try admin@gmail.com / 12345678");
                setSubmitting(false);
                return;
              }
              navigate(ROUTES.DASHBOARD);
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status }) => (
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="admin@gmail.com"
                    autoComplete="email"
                    required
                  />
                  {touched.email && errors.email && <p className="text-sm text-rose-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="12345678"
                      autoComplete="current-password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-slate-500 transition hover:text-slate-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                    </button>
                  </div>
                  {touched.password && errors.password && <p className="text-sm text-rose-500">{errors.password}</p>}
                </div>
                {status && <p className="text-sm text-rose-500">{status}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            )}
          </Formik>
          <p className="mt-6 text-center text-xs text-slate-500">
            Tip: default credentials are <span className="font-semibold">admin@gmail.com</span> / <span className="font-semibold">12345678</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
