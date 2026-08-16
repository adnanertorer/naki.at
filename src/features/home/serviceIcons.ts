import { HeartPulse, Leaf, Sparkles, Timer } from "lucide-react"

import type { ServiceIcon } from "@/data/siteContent"

export const serviceIcons = {
  heart: HeartPulse,
  timer: Timer,
  leaf: Leaf,
  sparkles: Sparkles,
}

export const iconLabels: Record<ServiceIcon, string> = {
  heart: "Herz",
  timer: "Zeit",
  leaf: "Blatt",
  sparkles: "Glanz",
}
