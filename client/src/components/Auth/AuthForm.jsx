import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import "./authPage.css";

export default function AuthForm() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}>

        {/* Sign Up Panel */}
        <div className="auth-panel sign-up-panel">
          <SignUp />
        </div>

        {/* Sign In Panel */}
        <div className="auth-panel sign-in-panel">
          <Login />
        </div>

        {/* Overlay */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">

            <div className="auth-overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>Already have an account? Login with your personal info</p>
              <button className="auth-ghost-btn" onClick={() => setIsRightPanelActive(false)}>
                Sign In
              </button>
            </div>

            <div className="auth-overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Don't have an account? Register and start your journey</p>
              <button className="auth-ghost-btn" onClick={() => setIsRightPanelActive(true)}>
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}