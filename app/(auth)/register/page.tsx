import RegisterForm from "./registerForm";

export default function RegisterPage() {
  return (
    <div className="auth-container">
      <h1 className="auth-title">
        Create your account
      </h1>
      <p className="auth-subtitle">
        Start learning with a few quick details.
      </p>
      <div className="auth-card">
        <RegisterForm />
      </div>
    </div>
  );
}

