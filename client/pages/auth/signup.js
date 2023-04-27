import AuthForm from "@/components/auth-form";

export default function Signup() {
  return <AuthForm apiUrl="/api/users/signup" method="post" title="Sign Up" />;
}
