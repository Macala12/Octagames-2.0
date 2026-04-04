"use client"

import { useState } from "react"
import { Gamepad2, Coins, Swords, Trophy, ChevronDown } from "lucide-react"

const steps = [
  {
    icon: Gamepad2,
    title: "Choose a Game",
    desc: "Pick from available games and challenges.",
  },
  {
    icon: Coins,
    title: "Place a Wager",
    desc: "Select how many Octacoins you want to stake.",
  },
  {
    icon: Swords,
    title: "Play & Compete",
    desc: "Get matched and play against another player.",
  },
  {
    icon: Trophy,
    title: "Win & Earn",
    desc: "Win matches and earn Octacoins or cash rewards.",
  },
]

const faqs = [
  {
    question: "How do I earn money?",
    answer:
      "You earn by playing games and winning matches against other players.",
  },
  {
    question: "How do withdrawals work?",
    answer:
      "You can withdraw your earnings directly to your bank account anytime.",
  },
  {
    question: "Is this real money?",
    answer:
      "Yes, your winnings can be converted and withdrawn as real cash.",
  },
]

export default function HowItWorksContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40" />
        <img
          src="/images/how-it-works.jpg"
          alt="How it works"
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            How It Works
          </h1>
        </div>
      </div>

      {/* Steps */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Get Started in 4 Steps
        </h2>

        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary shrink-0">
                <step.icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-muted-foreground">
                  Step {i + 1}
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl transition-colors ${
                openFaq === index ? "bg-muted" : "bg-muted/50"
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                aria-expanded={openFaq === index}
                aria-controls={`faq-content-${index}`}
              >
                <span className="text-sm font-medium text-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={`faq-content-${index}`}
                className={`grid transition-all duration-200 ease-in-out ${
                  openFaq === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-3 text-sm text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
