import type { SiteContent } from "@/data/siteContent"
import { FlowerLayer } from "@/features/home/components/FlowerLayer"
import { RichContent } from "@/features/home/richText"

type UeberNakiSectionProps = {
  content: SiteContent
  imageSrc: string
}

export function UeberNakiSection({ content, imageSrc }: UeberNakiSectionProps) {
  return (
    <section id="naki" className="bg-[#f8f5ef] py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[#e2d8c9] bg-[#f1eadc] shadow-[0_24px_70px_rgba(32,45,38,0.12)] sm:min-h-[440px] lg:min-h-[560px]">
          <img
            src={imageSrc}
            alt="Naki Öztürk, Masseur in Pramet"
            className="absolute inset-0 size-full object-cover object-center"
          />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#f8f5ef]/44 to-transparent" />
          <FlowerLayer />
        </div>
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9b6040]">
            {content.about.eyebrow}
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#18221e] sm:text-5xl">
            {content.about.title}
          </h2>
          <RichContent value={content.about.body} className="mt-5 text-base leading-8 text-[#52625a]" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {content.about.stats.map((stat) => (
              <div className="rounded-lg bg-white p-5" key={stat.value}>
                <p className="text-3xl font-semibold text-[#28594a]">{stat.value}</p>
                <RichContent value={stat.text} className="mt-2 text-sm leading-6 text-[#5b6b63]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
