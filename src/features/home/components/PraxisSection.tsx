import type { SiteContent } from "@/data/siteContent"
import { RichContent } from "@/features/home/richText"

export function PraxisSection({ content }: { content: SiteContent }) {
  return (
    <section id="praxis" className="bg-[#eef3ec] py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9b6040]">
            {content.practice.eyebrow}
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#18221e] sm:text-5xl">
            {content.practice.title}
          </h2>
        </div>
        <div className="grid gap-5 text-base leading-8 text-[#52625a]">
          {content.practice.cards.map((card) => (
            <div className="rounded-lg bg-white p-6" key={card.title}>
              <h3 className="text-xl font-semibold text-[#18221e]">{card.title}</h3>
              <RichContent value={card.text} className="mt-3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
