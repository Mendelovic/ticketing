import AuthForm from "@/components/auth-form";

export default function Signin() {
  return <AuthForm apiUrl="/api/users/signin" method="post" title="Sign In" />;
}
