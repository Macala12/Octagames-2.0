"use client"

import { useState } from "react"
import Switch from "../../form/switch/Switch"
import Label from "../../form/Label"

interface Setting {
  id: string
  label: string
  description?: string
}

const settingsList: Setting[] = [
  {
    id: "pin",
    label: "Require OTP for Withdrawals",
    description: "Adds extra security to your withdrawals",
  },
  {
    id: "notifications",
    label: "Withdrawal Notifications",
    description: "Get alerts when withdrawals update",
  },
  {
    id: "confirmWager",
    label: "Confirm Before Wager",
    description: "Prevent accidental bets",
  },
  {
    id: "lockWithdraw",
    label: "Disable Withdrawals",
    description: "Temporarily lock your account withdrawals",
  },
]

export default function WalletQuickSettings() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    pin: true,
    notifications: true,
    confirmWager: true,
    lockWithdraw: false,
  })

  const toggleSwitch = (id: string) => {
    setToggles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="flex flex-col gap-3">
      {settingsList.map((setting) => (
        <div
          key={setting.id}
          className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-1 py-3"
        >
          <div className="flex flex-col gap-0.5">
            <Label
              htmlFor={setting.id}
              className="text-sm text-white font-medium leading-none cursor-pointer"
            >
              {setting.label}
            </Label>
            {setting.description && (
              <span className="text-xs text-white text-muted-foreground">
                {setting.description}
              </span>
            )}
          </div>

          <Switch
            label=""
            defaultChecked={false}
          />
        </div>
      ))}
    </div>
  )
}
