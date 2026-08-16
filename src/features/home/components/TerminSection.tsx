import { ArrowRight, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { SiteContent } from "@/data/siteContent"
import { phoneHref } from "@/features/home/homeUtils"
import { RichContent } from "@/features/home/richText"

type AppointmentForm = {
  serviceTitle: string
  duration: string
}

type TerminSectionProps = {
  content: SiteContent
  serviceTitles: string[]
  appointmentForm: AppointmentForm
  appointmentTimes: string[]
  onServiceChange: (serviceTitle: string) => void
  onDurationChange: (duration: string) => void
}

export function TerminSection({
  content,
  serviceTitles,
  appointmentForm,
  appointmentTimes,
  onServiceChange,
  onDurationChange,
}: TerminSectionProps) {
  return (
    <section id="termin" className="bg-[#1e2b25] py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6a276]">
            {content.appointment.eyebrow}
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            {content.appointment.title}
          </h2>
          <RichContent value={content.appointment.body} className="mt-5 max-w-md leading-8 text-white/72" />
          <a
            href={phoneHref(content.contact.phone)}
            className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-medium text-[#1e2b25] transition hover:bg-[#f4efe6] hover:text-[#1e2b25]"
          >
            <Phone className="size-4" />
            {content.contact.phone}
          </a>
        </div>
        <form className="grid gap-4 rounded-lg bg-white p-5 text-[#1c2621] shadow-2xl sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Massageart
              <select
                value={appointmentForm.serviceTitle}
                onChange={(event) => onServiceChange(event.target.value)}
                className="h-12 rounded-md border border-[#d9d1c5] bg-[#fbfaf7] px-3"
              >
                <option value="">Bitte auswählen</option>
                {serviceTitles.map((title) => (
                  <option value={title} key={title}>{title}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Dauer
              <select
                value={appointmentForm.duration}
                onChange={(event) => onDurationChange(event.target.value)}
                disabled={!appointmentForm.serviceTitle || appointmentTimes.length === 0}
                className="h-12 rounded-md border border-[#d9d1c5] bg-[#fbfaf7] px-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Bitte auswählen</option>
                {appointmentTimes.map((time) => (
                  <option value={time} key={time}>{time}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Dein Name
              <input className="h-12 rounded-md border border-[#d9d1c5] bg-[#fbfaf7] px-3" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Tel. Nr.
              <input className="h-12 rounded-md border border-[#d9d1c5] bg-[#fbfaf7] px-3" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Anregungen / Wünsche
            <textarea className="min-h-28 rounded-md border border-[#d9d1c5] bg-[#fbfaf7] p-3" />
          </label>
          <Button type="button" className="h-12 rounded-md bg-[#28594a]">
            {content.appointment.submitLabel}
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </div>
    </section>
  )
}
