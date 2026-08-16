import { Menu, Phone } from "lucide-react"

import nakiLogo from "@/assets/images/logo_naki.svg"
import type { SiteContent } from "@/data/siteContent"
import { phoneHref } from "@/features/home/homeUtils"

export function SiteHeader({ content }: { content: SiteContent }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/35 bg-[#f8f5ef]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center font-semibold">
          <span className="mt-3 flex h-14 w-44 items-center sm:w-56 lg:w-64">
            <img
              src={nakiLogo}
              alt="Naki Öztürk Massagezentrum Pramet"
              className="max-h-24 w-full object-contain object-left"
            />
          </span>
          <span className="sr-only">Naki Öztürk Massagezentrum Pramet</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#52625a] md:flex">
          <a href="#leistungen">{content.nav.services}</a>
          <a href="#naki">{content.nav.about}</a>
          <a href="#praxis">{content.nav.practice}</a>
          <a href="#termin">{content.nav.appointment}</a>
          <a href="#kontakt">{content.nav.contact}</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={phoneHref(content.contact.phone)}
            className="hidden h-9 items-center justify-center gap-2 rounded-md bg-[#28594a] px-3 text-sm font-medium text-white transition hover:bg-[#214a3e] hover:text-white md:inline-flex"
          >
            <Phone className="size-4" />
            {content.nav.call}
          </a>
          <button
            aria-label="Navigation öffnen"
            className="grid size-10 place-items-center rounded-md border border-[#d9d1c5] text-[#28594a] md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
