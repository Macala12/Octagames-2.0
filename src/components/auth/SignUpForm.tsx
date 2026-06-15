import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";

// Avatar seeds for the carousel
const AVATAR_SEEDS = [
  "felix", "aneka", "bailey", "bella", "chloe", "coco", 
  "cuddles", "dusty", "felix", "garfield", "gizmo", "jasper",
  "leo", "lily", "lucky", "max", "mia", "midnight"
];

// Validation helpers
const validateEmail = async (email: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return !email.includes("taken"); // Mock: emails with "taken" are duplicate
};

const validatePhone = async (phone: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return !phone.includes("111"); // Mock: phones with "111" are duplicate
};

const validateUsername = async (username: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return !username.toLowerCase().includes("admin"); // Mock: "admin" is taken
};

export default function SignUpForm() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    avatar: AVATAR_SEEDS[8],
    password: "",
    confirmPassword: "",
    otp: "",
  });

  // Validation states
  const [validationState, setValidationState] = useState({
    email: { checking: false, valid: null as boolean | null },
    phone: { checking: false, valid: null as boolean | null },
    username: { checking: false, valid: null as boolean | null },
  });

  // Avatar carousel
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(8);
  const avatarScrollRef = useRef<HTMLDivElement>(null);

  // Load saved step from localStorage
  useEffect(() => {
    const savedStep = localStorage.getItem("signupStep");
    const savedData = localStorage.getItem("signupData");
    if (savedStep) setCurrentStep(parseInt(savedStep));
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  // Save step and data to localStorage
  useEffect(() => {
    localStorage.setItem("signupStep", currentStep.toString());
    localStorage.setItem("signupData", JSON.stringify(formData));
  }, [currentStep, formData]);

  // Email validation
  useEffect(() => {
    if (!formData.email || formData.email.length < 3) return;
    
    setValidationState(prev => ({ ...prev, email: { checking: true, valid: null } }));
    
    const timeout = setTimeout(async () => {
      const isValid = await validateEmail(formData.email);
      setValidationState(prev => ({ ...prev, email: { checking: false, valid: isValid } }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.email]);

  // Phone validation
  useEffect(() => {
    if (!formData.phone || formData.phone.length < 3) return;
    
    setValidationState(prev => ({ ...prev, phone: { checking: true, valid: null } }));
    
    const timeout = setTimeout(async () => {
      const isValid = await validatePhone(formData.phone);
      setValidationState(prev => ({ ...prev, phone: { checking: false, valid: isValid } }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.phone]);

  // Username validation
  useEffect(() => {
    if (!formData.username || formData.username.length < 3) return;
    
    setValidationState(prev => ({ ...prev, username: { checking: true, valid: null } }));
    
    const timeout = setTimeout(async () => {
      const isValid = await validateUsername(formData.username);
      setValidationState(prev => ({ ...prev, username: { checking: false, valid: isValid } }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.username]);

  // Avatar carousel scroll handler
  const handleAvatarScroll = () => {
    if (!avatarScrollRef.current) return;
    const scrollLeft = avatarScrollRef.current.scrollLeft;
    const itemWidth = 100; // 80px width + 20px gap
    const centerIndex = Math.round(scrollLeft / itemWidth);
    setSelectedAvatarIndex(centerIndex);
    setFormData(prev => ({ ...prev, avatar: AVATAR_SEEDS[centerIndex] }));
  };

  const canProceedStep1 = formData.firstName && formData.lastName && 
    formData.email && formData.phone && 
    validationState.email.valid === true && 
    validationState.phone.valid === true;

  const canProceedStep2 = formData.username && validationState.username.valid === true;

  const canProceedStep3 = formData.password && 
    formData.confirmPassword && 
    formData.password === formData.confirmPassword &&
    formData.password.length >= 8;

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowEmailForm(false);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    localStorage.removeItem("signupStep");
    localStorage.removeItem("signupData");
    // Handle signup
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 dark:from-blue-400 dark:via-purple-300 dark:to-pink-300 px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl animate-bounce">
                  ✨
                </div>
                <div className="text-9xl filter drop-shadow-xl">
                  🎯
                </div>
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-5xl animate-pulse">
                  🎮
                </div>
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-5xl animate-pulse" style={{ animationDelay: '0.5s' }}>
                  👾
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-900 mb-3 leading-tight">
            Join the gaming<br />revolution!
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-800 font-medium">
            Create your account and start playing.
          </p>
        </div>
      </div>

      {/* Auth Section with Dynamic Height */}
      <div 
        className="bg-white dark:bg-gray-900 px-6 py-8 rounded-t-3xl -mt-6 relative z-10 shadow-2xl transition-all duration-500 ease-in-out"
        style={{
          height: showEmailForm ? '80vh' : 'auto',
          overflowY: showEmailForm ? 'auto' : 'visible'
        }}
      >
        <div className="w-full max-w-sm mx-auto">
          {!showEmailForm ? (
            // Social Signup Buttons
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-700 rounded-2xl font-semibold text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-gray-750 active:scale-[0.98]">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
                  <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/>
                  <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/>
                  <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/>
                </svg>
                Sign up with Google
              </button>

              <button className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-700 rounded-2xl font-semibold text-gray-900 dark:text-white transition-all hover:bg-gray-50 active:scale-[0.98]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Sign up with Apple
              </button>

              <button 
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white rounded-2xl font-semibold text-white dark:text-gray-900 transition-all hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2"/>
                  <path d="M3 7l9 6 9-6"/>
                </svg>
                Sign up with email
              </button>

              <div className="flex justify-center pt-4">
                <div className="w-32 h-1.5 bg-gray-900 dark:bg-white rounded-full"></div>
              </div>
            </div>
          ) : (
            // Multi-Step Form
            <div className="space-y-6">
              <button 
                onClick={handleBack}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 mb-2"
              >
                <ChevronLeftIcon className="size-5" />
                Back
              </button>

              {/* Step Indicator */}
              <div className="flex items-center align-center w-full pl-10">
                <div className="flex items-center w-full align-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
                        currentStep >= step 
                          ? 'bg-purple-600 text-white scale-110' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}>
                        {step}
                      </div>
                      {step < 4 && (
                        <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                          currentStep > step ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentStep === 1 && "Personal Information"}
                  {currentStep === 2 && "Game Profile"}
                  {currentStep === 3 && "Security"}
                  {currentStep === 4 && "Verification"}
                </h2>
              </div>

              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>First Name *</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        placeholder="John"
                        className="mt-2 h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label>Last Name *</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Doe"
                        className="mt-2 h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="mt-2 h-12 rounded-xl"
                    />
                    {validationState.email.checking && (
                      <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                        <span className="animate-spin">⏳</span> Checking availability...
                      </p>
                    )}
                    {validationState.email.valid === false && (
                      <p className="text-xs text-red-500 mt-1">❌ This email is already taken</p>
                    )}
                    {validationState.email.valid === true && (
                      <p className="text-xs text-green-500 mt-1">✅ Email is available</p>
                    )}
                  </div>

                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+234 800 000 0000"
                      className="mt-2 h-12 rounded-xl"
                    />
                    {validationState.phone.checking && (
                      <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                        <span className="animate-spin">⏳</span> Checking availability...
                      </p>
                    )}
                    {validationState.phone.valid === false && (
                      <p className="text-xs text-red-500 mt-1">❌ This phone number is already registered</p>
                    )}
                    {validationState.phone.valid === true && (
                      <p className="text-xs text-green-500 mt-1">✅ Phone number is available</p>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!canProceedStep1}
                    className={`w-full h-12 rounded-xl font-semibold transition-all ${
                      canProceedStep1
                        ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-[0.98]'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Game Profile */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <Label>Username *</Label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="gamer123"
                      className="mt-2 h-12 rounded-xl"
                    />
                    {validationState.username.checking && (
                      <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                        <span className="animate-spin">⏳</span> Checking availability...
                      </p>
                    )}
                    {validationState.username.valid === false && (
                      <p className="text-xs text-red-500 mt-1">❌ This username is already taken</p>
                    )}
                    {validationState.username.valid === true && (
                      <p className="text-xs text-green-500 mt-1">✅ Username is available</p>
                    )}
                  </div>

                  <div>
                    <Label>Choose Your Avatar</Label>
                    <div 
                      ref={avatarScrollRef}
                      onScroll={handleAvatarScroll}
                      className="flex gap-5 overflow-x-auto py-6 px-2 snap-x snap-mandatory scroll-smooth no-scrollbar mt-2"
                      style={{ scrollPaddingLeft: 'calc(50% - 50px)' }}
                    >
                      {AVATAR_SEEDS.map((seed, index) => {
                        const isCenter = index === selectedAvatarIndex;
                        const distance = Math.abs(index - selectedAvatarIndex);
                        const scale = isCenter ? 1 : Math.max(0.7, 1 - distance * 0.15);
                        const opacity = isCenter ? 1 : Math.max(0.4, 1 - distance * 0.2);

                        return (
                          <div
                            key={seed}
                            className="flex-shrink-0 snap-center transition-all duration-300"
                            style={{
                              transform: `scale(${scale})`,
                              opacity: opacity,
                            }}
                          >
                            <img
                              src={`https://api.dicebear.com/9.x/big-smile/svg?seed=${seed}&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                              alt={seed}
                              className={`w-24 h-24 rounded-full border-4 transition-all ${
                                isCenter 
                                  ? 'border-purple-600 shadow-lg shadow-purple-500/50' 
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Scroll to select your avatar
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 h-12 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-[0.98]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!canProceedStep2}
                      className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                        canProceedStep2
                          ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-[0.98]'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Security */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <Label>Password *</Label>
                    <div className="relative mt-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Enter password"
                        className="h-12 rounded-xl pr-12"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 size-5" />
                        )}
                      </span>
                    </div>
                    {formData.password && formData.password.length < 8 && (
                      <p className="text-xs text-orange-500 mt-1">⚠️ Password must be at least 8 characters</p>
                    )}
                  </div>

                  <div>
                    <Label>Confirm Password *</Label>
                    <div className="relative mt-2">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        placeholder="Confirm password"
                        className="h-12 rounded-xl pr-12"
                      />
                      <span
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="fill-gray-500 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 size-5" />
                        )}
                      </span>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">❌ Passwords don't match</p>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="text-xs text-green-500 mt-1">✅ Passwords match</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 h-12 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 active:scale-[0.98]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!canProceedStep3}
                      className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                        canProceedStep3
                          ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-[0.98]'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: OTP Verification */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📧</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Verify Your Email
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We've sent a code to<br />
                      <span className="font-semibold">{formData.email}</span>
                    </p>
                  </div>

                  <div>
                    <Label>Enter OTP</Label>
                    <input
                      value={formData.otp}
                      onChange={(e) => setFormData({...formData, otp: e.target.value})}
                      placeholder="000000"
                      maxLength={6}
                      type="text"
                      inputMode="numeric"
                      className="mt-2 h-12 rounded-xl text-center text-2xl font-bold tracking-widest border-none outline-none"
                    />
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Didn't receive code? <button className="text-purple-600 font-semibold">Resend</button>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 h-12 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 active:scale-[0.98]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={formData.otp.length !== 6}
                      className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                        formData.otp.length === 6
                          ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-[0.98]'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}

              <p className="text-sm text-center text-gray-600 dark:text-gray-400 pt-4">
                Already have an account?{" "}
                <Link to="/signin" className="font-semibold text-purple-600 hover:text-purple-700">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}