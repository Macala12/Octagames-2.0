import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";
import epic from "../../images/epic.png";
import friendImg from "../../images/friends.png";
import cash from "../../images/cash.png";
import "../../style.css";

/* ------------------ MOCK DATA ------------------ */
const games = [
  { id: "1", name: "Subway Run", image: "/games/game1.png" },
  { id: "2", name: "Speed Ball", image: "/games/game2.png" },
  { id: "3", name: "Stack Rush", image: "/games/game3.png" },
];

const friends = [
  { id: "1", name: "Michael Alaoma", avatar: "/games/game1.png" },
  { id: "2", name: "Chisom Alaoma", avatar: "/games/game2.png" },
  { id: "3", name: "Princess Vera", avatar: "/games/game3.png" },
];

const onboardingSlides = [
  {
    image: epic,
    title: "Create Epic Tournaments",
    description: "Set up custom gaming tournaments with your own rules and rewards"
  },
  {
    image: friendImg,
    title: "Compete with Friends",
    description: "Invite friends and compete for amazing prizes in your favorite games"
  },
  {
    image: cash,
    title: "Win Real Rewards",
    description: "Climb the leaderboard and win from pooled wagers and prizes"
  }
];

type ValidationErrors = {
  minPlayers?: string;
  maxPlayers?: string;
  duration?: string;
  startTime?: string;
};

type User = {
  id: string;
  name: string;
  avatar?: string;
};

type Game = {
  id: string;
  name: string;
  image: string;
};

type Props = {
  users: User[];
  onSelect: (selectedIds: string[]) => void;
};

/* ------------------ HELPERS ------------------ */
const calculateEndTime = (start: string | number | Date, duration: number) => {
  if (!start || !duration) return "";
  const startDate = new Date(start);
  const end = new Date(startDate.getTime() + duration * 60000);
  return end.toISOString().slice(0, 16);
};

const formatDateTime = (dateTimeString: string | number | Date) => {
  if (!dateTimeString) return "";
  const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    };
  return date.toLocaleDateString('en-US', options);
};

const calculatePrizePool = (min: number, max: number, wager: number | undefined) => {
  if (!min || !max || wager === undefined) return null;
  const minPool = min * wager;
  const maxPool = max * wager;
  const fee = 0.3;
  return {
    minPool,
    maxPool,
    minActual: Math.floor(minPool * (1 - fee)),
    maxActual: Math.floor(maxPool * (1 - fee)),
  };
};

const validateDetails = (form: { minPlayers: any; maxPlayers: any; duration: any; startTime: any; wager?: number; }) => {
  const errors: ValidationErrors = {};
  if (!form.minPlayers || form.minPlayers < 2) {
    errors.minPlayers = "Minimum players must be at least 2";
  }
  if (!form.maxPlayers || form.maxPlayers < form.minPlayers) {
    errors.maxPlayers = "Max players must be ≥ min players";
  }
  if (!form.duration || form.duration <= 0) {
    errors.duration = "Enter a valid duration";
  }
  if (!form.startTime || new Date(form.startTime) <= new Date()) {
    errors.startTime = "Start time must be in the future";
  }
  return errors;
};

function TellFriend({ users, onSelect }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

    const toggle = (id: string) => {
    setSelected((prev) =>
        prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
    };

  return (
    <div className="p-2 text-white">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Invite Friends</h2>
        <p className="text-gray-400 text-sm">Select friends to join your tournament</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {users.map((u) => (
          <button
            key={u.id}
            onClick={() => toggle(u.id)}
            className="flex flex-col items-center transition-transform active:scale-95"
          >
            <div className="relative">
              <img
                src={u.avatar}
                alt={u.name}
                className={`w-14 h-14 rounded-full object-cover transition-all ${
                  selected.includes(u.id)
                    ? "ring-4 ring-green-500 ring-offset-2 ring-offset-[#0b0f14]"
                    : "ring-2 ring-gray-700"
                }`}
              />
              {selected.includes(u.id) && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-xs text-center mt-2 line-clamp-2">{u.name}</p>
          </button>
        ))}
      </div>

      <button
        onClick={() => onSelect(selected)}
        disabled={selected.length === 0}
        className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
          selected.length === 0
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-green-500 text-black active:scale-98"
        }`}
      >
        Send Invite ({selected.length})
      </button>
    </div>
  );
}

/* ------------------ MAIN COMPONENT ------------------ */
export default function CreateTournament() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [open, setOpen] = useState(false);
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [form, setForm] = useState({
    minPlayers: 0,
    maxPlayers: 0,
    duration: 0,
    startTime: "",
    wager: 0,
  });

  const next = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const nextOnboarding = () => {
    if (onboardingIndex < onboardingSlides.length - 1) {
      setOnboardingIndex(onboardingIndex + 1);
    } else {
      next();
    }
  };

  const skipOnboarding = () => {
    setOnboardingIndex(0);
    next();
  };

  const errors = validateDetails(form);
  const isValid = Object.keys(errors).length === 0;
  const endTime = calculateEndTime(form.startTime, form.duration);
  const prize = calculatePrizePool(
    Number(form.minPlayers),
    Number(form.maxPlayers),
    Number(form.wager || 0)
  );

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  return (
    <div className="h-screen text-white flex flex-col overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 flex flex-col"
        >
          {/* STEP 0 — ONBOARDING */}
          {step === 0 && (
            <div className="flex flex-col h-full p-6">
              <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div
                  key={onboardingIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-8xl mb-6">
                    <img src={onboardingSlides[onboardingIndex].image} alt="" />
                  </div>
                  <h1 className="text-3xl font-bold mb-4 px-4">
                    {onboardingSlides[onboardingIndex].title}
                  </h1>
                  <p className="text-gray-400 text-base px-8 leading-relaxed">
                    {onboardingSlides[onboardingIndex].description}
                  </p>
                </motion.div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mb-8">
                {onboardingSlides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === onboardingIndex
                        ? "w-8 bg-brand-500"
                        : "w-2 bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={nextOnboarding}
                  className="w-full py-4 bg-brand-500 text-black rounded-xl font-semibold text-lg active:scale-98 transition-transform"
                >
                  {onboardingIndex === onboardingSlides.length - 1
                    ? "Get Started"
                    : "Continue"}
                </button>
                {onboardingIndex < onboardingSlides.length - 1 && (
                  <button
                    onClick={skipOnboarding}
                    className="w-full py-4 text-gray-400 font-medium"
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 1 — SELECT GAME */}
          {step === 1 && (
            <div className="flex flex-col h-full p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Select Game</h2>
                <p className="text-gray-400 text-sm">Choose a game for your tournament</p>
              </div>

              <div className="grid grid-cols-3 gap-4 flex-1">
                {games.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGame(g)}
                    className={`p-3 h-[fit-content] rounded-2xl transition-all active:scale-95 ${
                      selectedGame?.id === g.id
                        ? "bg-brand-500/20 border-2 border-brand-500 shadow-lg shadow-green-500/20"
                        : "bg-white/5 border-2 border-transparent"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={g.image}
                        alt={g.name}
                        className="w-full h-20 rounded-xl object-cover mb-2"
                      />
                      {selectedGame?.id === g.id && (
                        <div className="absolute top-1 right-1 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-center">{g.name}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-6">
                <button onClick={back} className="flex-1">
                  Back
                </button>
                <button
                  disabled={!selectedGame}
                  onClick={next}
                  className={`flex-1 btn-primary ${!selectedGame && "opacity-50"}`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — DETAILS */}
          {step === 2 && (
            <div className="flex flex-col h-full p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Tournament Details</h2>
                <p className="text-gray-400 text-sm">Configure your tournament settings</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {/* Game Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Game
                  </label>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl">
                    <img
                      src={selectedGame?.image}
                      alt={selectedGame?.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <span className="font-medium">{selectedGame?.name}</span>
                  </div>
                </div>

                {/* Player Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Min Players
                    </label>
                    <input
                      type="number"
                      placeholder="2"
                      className="input bg-white/5"
                      value={form.minPlayers}
                      onChange={(e) =>
                        setForm({ ...form, minPlayers: Number(e.target.value) })
                      }
                    />
                    {errors.minPlayers && (
                      <p className="error">{errors.minPlayers}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Max Players
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      className="input bg-white/5"
                      value={form.maxPlayers}
                      onChange={(e) =>
                        setForm({ ...form, maxPlayers: Number(e.target.value) })
                      }
                    />
                    {errors.maxPlayers && (
                      <p className="error">{errors.maxPlayers}</p>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    className="input bg-white/5"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: Number(e.target.value) })
                    }
                  />
                  {errors.duration && <p className="error">{errors.duration}</p>}
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input bg-white/5"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                  />
                  {errors.startTime && <p className="error">{errors.startTime}</p>}
                </div>

                {/* End Time Display */}
                {endTime && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      End Time
                    </label>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <p className="text-sm font-medium">
                        {formatDateTime(endTime)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6">
                <button onClick={back} className="flex-1">
                  Back
                </button>
                <button
                  disabled={!isValid}
                  onClick={next}
                  className={`flex-1 btn-primary ${!isValid && "opacity-50"}`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — WAGER */}
          {step === 3 && (
            <div className="flex flex-col h-full p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Set Wager</h2>
                <p className="text-gray-400 text-sm">Entry fee for participants (or play for free)</p>
              </div>

              <div className="flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Entry Amount (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="input text-2xl font-bold bg-white/5"
                    value={form.wager}
                    onChange={(e) =>
                      setForm({ ...form, wager: Number(e.target.value) })
                    }
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter 0 to play for free
                  </p>
                </div>

                {prize && form.wager > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="relative p-5 rounded-[20px]">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 190"
                            preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                                <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
                                </pattern>
                            </defs>
                            <rect width="360" height="190" fill="url(#dots)" />
                            <ellipse cx="300" cy="30" rx="110" ry="90" fill="#09f2a6" opacity="0.08" />
                            <ellipse cx="320" cy="50" rx="70" ry="55" fill="#09f2a6" opacity="0.1" />
                            <ellipse cx="40" cy="170" rx="90" ry="70" fill="#7C3AED" opacity="0.12" />
                            <ellipse cx="60" cy="160" rx="50" ry="40" fill="#7C3AED" opacity="0.1" />
                            <circle cx="310" cy="190" r="120" fill="none" stroke="#09f2a6" strokeWidth="0.6" opacity="0.15" />
                            <circle cx="310" cy="190" r="90"  fill="none" stroke="#09f2a6" strokeWidth="0.6" opacity="0.12" />
                            <circle cx="310" cy="190" r="60"  fill="none" stroke="#09f2a6" strokeWidth="0.6" opacity="0.1" />
                            <line x1="0" y1="130" x2="180" y2="0" stroke="rgba(9,242,166,0.06)" strokeWidth="40" />
                            <rect x="24" y="95" width="36" height="28" rx="5" fill="none"
                                stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                            <line x1="24" y1="109" x2="60" y2="109" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                            <line x1="42" y1="95"  x2="42" y2="123" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        </svg>
                        
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🏆</span>
                        <h3 className="font-semibold text-lg">Prize Pool</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Pool:</span>
                          <span className="font-bold text-xl">
                            ₦{prize.minPool.toLocaleString()} - ₦{prize.maxPool.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-px bg-gray-700"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">After 30% fee:</span>
                          <span className="font-bold text-xl text-green-400">
                            ₦{prize.minActual.toLocaleString()} - ₦{prize.maxActual.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 p-4 rounded-xl">
                      <p className="text-xs text-yellow-400">
                        Platform fee: 30% of total pool
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6">
                <button onClick={back} className="flex-1">
                  Back
                </button>
                <button onClick={next} className="flex-1 btn-primary">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — SUMMARY */}
          {step === 4 && (
            <div className="flex flex-col h-full p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Review Details</h2>
                <p className="text-gray-400 text-sm">Confirm your tournament settings</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {/* Game Card */}
                <div className="bg-white/5 p-5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedGame?.image}
                      alt={selectedGame?.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Game</p>
                      <h3 className="text-xl font-bold">{selectedGame?.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Players</p>
                    <p className="text-lg font-bold">
                      {form.minPlayers} - {form.maxPlayers}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Duration</p>
                    <p className="text-lg font-bold">{form.duration} mins</p>
                  </div>
                </div>

                {/* Time Details */}
                <div className="bg-white/5 p-5 rounded-xl space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Starts</p>
                    <p className="font-semibold text-green-400">
                      {formatDateTime(form.startTime)}
                    </p>
                  </div>
                  <div className="h-px bg-gray-700"></div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Ends</p>
                    <p className="font-semibold text-red-400">
                      {formatDateTime(endTime)}
                    </p>
                  </div>
                </div>

                {/* Wager Card */}
                <div className={`p-5 rounded-xl ${"bg-white/5"}`}>
                  <p className="text-xs text-gray-400 mb-1">Entry Fee</p>
                  <p className="text-2xl font-bold">
                    {form.wager > 0 ? `₦${form.wager.toLocaleString()}` : "Free"}
                  </p>
                  {prize && form.wager > 0 && (
                    <p className="text-xs mt-2">
                      Prize: ₦{prize.minActual.toLocaleString()} - ₦{prize.maxActual.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button onClick={back} className="flex-1">
                  Edit
                </button>
                <button
                  onClick={() => {
                    next();
                    setOpen(true);
                  }}
                  className="flex-1 btn-primary"
                >
                  Create Tournament
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 — CREATED */}
          {step === 5 && (
            <div className="flex flex-col h-full p-6 items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-center"
              >
                <div className="text-8xl mb-6">🎉</div>
                <h2 className="text-3xl font-bold mb-3">
                  Tournament Created!
                </h2>
                <p className="text-gray-400 mb-8">
                  Your tournament is ready. Share with friends!
                </p>

                <div className="bg-white/5 p-6 rounded-2xl mb-6">
                  <p className="text-xs text-gray-400 mb-2">Tournament Code</p>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl font-bold tracking-wider text-green-400">
                      OCTA123
                    </span>
                  </div>
                  <button className="w-full py-3 bg-brand-500/20 text-green-400 rounded-xl font-medium border border-brand-500/30 active:scale-95 transition-transform">
                    Copy Code
                  </button>
                  <button className="mt-2 w-full py-3 text-white rounded-xl font-medium active:scale-95 transition-transform">
                    Share Link
                  </button>
                </div>

                <button
                  onClick={() => {
                    setStep(0);
                    setOnboardingIndex(0);
                    setSelectedGame(null);
                    setForm({
                      minPlayers: 0,
                      maxPlayers: 0,
                      duration: 0,
                      startTime: "",
                      wager: 0,
                    });
                  }}
                  className="w-full py-4 text-gray-400 font-medium mt-4"
                >
                  Create Another
                </button>                

                <button
                  onClick={() => setOpen(true)}
                  className="w-full py-4 bg-brand-500 text-black rounded-xl font-semibold text-lg active:scale-98 transition-transform"
                >
                  Invite Friends
                </button>

                <button className="btn- mt-6 font-semibold px-2 py-3 w-full text-red rounded-[20px]">
                    Click to close
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <BottomSheet isOpen={open} onClose={() => setOpen(false)}>
        <TellFriend
          users={friends}
          onSelect={(selected: any) => {
            console.log("Selected friends:", selected);
            setOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
}