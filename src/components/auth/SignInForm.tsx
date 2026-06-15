import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Illustration Section */}
      <div className="flex-1 bg-gradient-to-br from-green-300 via-green-200 to-yellow-200 dark:from-green-400 dark:via-green-300 dark:to-yellow-300 px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-sm">
          {/* Illustration Placeholder - You can replace with actual SVG */}
          <div className="relative h-64 mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Game Controller Illustration (simplified) */}
              <div className="relative">
                {/* Trophy */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl animate-bounce">
                  🏆
                </div>
                
                {/* Controller */}
                <div className="text-9xl filter drop-shadow-xl">
                  🎮
                </div>

                {/* Players */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-5xl animate-pulse">
                  🧑
                </div>
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-5xl animate-pulse" style={{ animationDelay: '0.5s' }}>
                  👨
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-900 mb-3 leading-tight">
            Trade games and<br />play with friends
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-800 font-medium">
            Connect with a social account or email.
          </p>
        </div>
      </div>

      {/* Auth Section */}
      <div className="bg-white dark:bg-gray-900 px-6 py-8 rounded-t-3xl -mt-6 relative z-10 shadow-2xl">
        <div className="w-full max-w-sm mx-auto">
          {!showEmailForm ? (
            // Social Login Buttons
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-700 rounded-2xl font-semibold text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-gray-750 active:scale-[0.98]">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
                  <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/>
                  <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/>
                  <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/>
                </svg>
                Continue with Google
              </button>

              <button className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-700 rounded-2xl font-semibold text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-gray-750 active:scale-[0.98]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </button>

              <button 
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white rounded-2xl font-semibold text-white dark:text-gray-900 transition-all hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2"/>
                  <path d="M3 7l9 6 9-6"/>
                </svg>
                Continue with email
              </button>

              {/* Bottom Indicator */}
              <div className="flex justify-center pt-4">
                <div className="w-32 h-1.5 bg-gray-900 dark:bg-white rounded-full"></div>
              </div>
            </div>
          ) : (
            // Email Form
            <div className="space-y-6">
              <button 
                onClick={() => setShowEmailForm(false)}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4"
              >
                <ChevronLeftIcon className="size-5" />
                Back
              </button>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your credentials to continue
                </p>
              </div>

              <form className="space-y-5">
                <div>
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="name@example.com" 
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label>Password <span className="text-red-500">*</span></Label>
                  <div className="relative mt-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-12 rounded-xl pr-12"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                      Remember me
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm font-semibold text-brand-600 hover:text-purple-700 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900">
                  Sign in
                </Button>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-brand-600 hover:text-purple-700 dark:text-brand-400"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}