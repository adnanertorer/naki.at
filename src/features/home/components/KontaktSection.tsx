import { ArrowRight, Gift, MapPin } from "lucide-react"

import type { SiteContent } from "@/data/siteContent"
import { phoneHref } from "@/features/home/homeUtils"
import { RichContent } from "@/features/home/richText"

type KontaktSectionProps = {
  content: SiteContent
  onValueVoucher: (value?: string) => void
}

export function KontaktSection({ content, onValueVoucher }: KontaktSectionProps) {
  const mapUrl = content.contact.mapUrl.trim()
  const addressLines = content.contact.address
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <section id="gutschein" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-[#e7dfd4] bg-[#fbfaf7] p-7">
          <Gift className="size-10 text-[#9b6040]" />
          <h2 className="mt-5 text-4xl font-semibold text-[#18221e]">
            {content.vouchers.title}
          </h2>
          <RichContent value={content.vouchers.body} className="mt-4 leading-8 text-[#5b6b63]" />
          <div className="mt-6 flex flex-wrap gap-2">
            {content.vouchers.values.map((value) => (
              <button
                type="button"
                onClick={() => onValueVoucher(value)}
                key={value}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#28594a] transition hover:bg-[#eef3ec]"
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div id="kontakt" className="rounded-lg bg-[#eef3ec] p-7">
          <MapPin className="size-10 text-[#28594a]" />
          <h2 className="mt-5 text-4xl font-semibold text-[#18221e]">
            {content.contact.title}
          </h2>
          <div className="mt-5 space-y-3 text-lg text-[#43534b]">
            <p className="font-semibold text-[#18221e]">{content.contact.name}</p>
            <div className="space-y-1">
              {addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p>
              <a href={phoneHref(content.contact.phone)}>{content.contact.phone}</a>
            </p>
            <p>
              <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
            </p>
          </div>
          {mapUrl ? (
            <div className="mt-7 overflow-hidden rounded-lg border border-white/70 bg-white shadow-sm">
              <iframe
                title={`${content.contact.name} Google Maps`}
                src={mapUrl}
                width="600"
                height="450"
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : null}
          <a
            href={content.contact.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex h-8 items-center justify-center gap-2 rounded-md bg-[#28594a] px-3 text-sm font-medium text-white transition hover:bg-[#214a3e] hover:text-white"
          >
            {content.contact.mapLabel}
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
