import React, { useState, useEffect } from "react";
import { SignIn, SignUp, useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user } = useUser();
  const { loaded, signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profile-setup");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? "Join JobHire" : "Welcome Back"}
          </h1>
          <p className="text-gray-400">
            {isSignUp
              ? "Create your account to get started"
              : "Sign in to your account to continue"}
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          {isSignUp ? (
            <SignUp appearance={clerkAppearance} />
          ) : (
            <SignIn appearance={clerkAppearance} />
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: "#3B82F6",
    colorBackground: "#111827",
    colorInputBackground: "#1F2937",
    colorInputText: "#F9FAFB",
    colorText: "#F9FAFB",
    colorTextSecondary: "#9CA3AF",
  },
  elements: {
    formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
    card: "bg-gray-900 border-gray-800",
    headerTitle: "text-white",
    headerSubtitle: "text-gray-400",
    socialButtonsBlockButton: "border-gray-700 text-white hover:bg-gray-800",
    formFieldInput: "bg-gray-800 border-gray-700 text-white",
    formFieldLabel: "text-gray-300",
    footerActionLink: "text-blue-400 hover:text-blue-300",
  },
};

export default Login;
