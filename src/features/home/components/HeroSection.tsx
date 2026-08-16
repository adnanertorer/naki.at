import { ArrowRight, Check } from "lucide-react"

import type { SiteContent } from "@/data/siteContent"
import { FlowerLayer } from "@/features/home/components/FlowerLayer"
import { RichContent } from "@/features/home/richText"

type HeroSectionProps = {
  content: SiteContent
  imageSrc: string
}

export function HeroSection({ content, imageSrc }: HeroSectionProps) {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 inline-flex rounded-md border border-[#d7c9b9] bg-white/62 px-3 py-1 text-sm font-medium text-[#7a4b35]">
            {content.hero.eyebrow}
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-[#18221e] sm:text-6xl lg:text-7xl">
            {content.hero.title}
          </h1>
          <RichContent value={content.hero.body} className="mt-6 max-w-xl text-lg leading-8 text-[#52625a]" />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#termin"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#28594a] px-5 text-sm font-medium text-white transition hover:bg-[#214a3e] hover:text-white"
            >
              {content.hero.primaryCta}
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#leistungen"
              className="inline-flex h-11 items-center justify-center rounded-md border border-[#cfc4b6] bg-white/70 px-5 text-sm font-medium text-[#28594a] transition hover:bg-white hover:text-[#214a3e]"
            >
              {content.hero.secondaryCta}
            </a>
          </div>
          <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2">
            {content.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm text-[#43534b]">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#dfe8df] text-[#28594a]">
                  <Check className="size-4" />
                </span>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/55 shadow-[0_28px_80px_rgba(31,48,39,0.18)] lg:min-h-[680px]">
          <img
            src={imageSrc}
            alt="Naki Öztürk"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10251d]/42 via-transparent to-transparent" />
          <FlowerLayer />
          <div className="absolute bottom-5 left-5 right-5 rounded-md bg-white/86 p-5 shadow-xl backdrop-blur-md sm:left-auto sm:max-w-sm">
            <p className="text-sm font-medium text-[#7a4b35]">{content.hero.contactLabel}</p>
            <p className="mt-2 text-2xl font-semibold text-[#18221e]">
              {content.contact.phone}
            </p>
            <RichContent value={content.hero.contactBody} className="mt-2 text-sm leading-6 text-[#52625a]" />
          </div>
        </div>
      </div>
    </section>
  )
}
