import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-header-row">
        <div>
          <h1 className="auth-title">Welcome back to Learning Studio</h1>
          <p className="auth-subtitle">
            Continue your Python, C++, ML and more – your progress and watch
            history are saved across all devices.
          </p>
        </div>
        <div className="auth-pill">Lifelong learning</div>
      </div>

      <div className="auth-layout">
        <div className="auth-highlight">
          <div className="auth-highlight-title">All-in-one LMS</div>
          <ul className="auth-highlight-list">
            <li>Strict course order, like a real bootcamp</li>
            <li>Resume YouTube lessons exactly where you left off</li>
            <li>Track completion across Python, C/C++, Java, ML, DSA and more</li>
          </ul>
        </div>

        <div className="auth-card bg-neutral-900 text-white border border-neutral-700">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}