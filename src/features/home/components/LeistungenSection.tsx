import type { SiteContent } from "@/data/siteContent"
import { RichContent } from "@/features/home/richText"
import { serviceIcons } from "@/features/home/serviceIcons"

type Service = SiteContent["services"][number]

type LeistungenSectionProps = {
  content: SiteContent
  onMassageVoucher: (service: Service) => void
}

export function LeistungenSection({ content, onMassageVoucher }: LeistungenSectionProps) {
  return (
    <section id="leistungen" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9b6040]">
              {content.nav.services}
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-[#18221e] sm:text-5xl">
              Massagen mit klaren Preisen und ruhigem Ablauf
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#66746d]">
            Wähle die passende Behandlung und Dauer. Gutscheine und 10+1 Pakete
            sind direkt für jede Massageart möglich.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {content.services.map((service) => {
            const Icon = serviceIcons[service.icon]

            return (
              <article
                key={service.title}
                className="rounded-lg border border-[#e7dfd4] bg-[#fbfaf7] p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(32,45,38,0.1)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-md bg-[#e4eee5] text-[#28594a]">
                    <Icon className="size-6" />
                  </span>
                  <span className="rounded-md bg-[#28594a] px-3 py-1 text-sm font-semibold text-white">
                    {service.price}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-[#18221e]">
                  {service.title}
                </h3>
                <RichContent value={service.text} className="mt-3 min-h-20 text-[15px] leading-7 text-[#5b6b63]" />
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.times.map((time) => (
                    <span
                      key={time}
                      className="rounded-md border border-[#d9d1c5] bg-white px-3 py-2 text-sm text-[#43534b]"
                    >
                      {time}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <a
                    href="#termin"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-[#28594a] px-3 text-sm font-medium text-white transition hover:bg-[#214a3e] hover:text-white"
                  >
                    Buchen
                  </a>
                  <button
                    type="button"
                    onClick={() => onMassageVoucher(service)}
                    className="inline-flex h-8 items-center justify-center rounded-md border border-[#d9d1c5] bg-white px-3 text-sm font-medium text-[#28594a] transition hover:bg-[#eef3ec]"
                  >
                    Gutschein
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
