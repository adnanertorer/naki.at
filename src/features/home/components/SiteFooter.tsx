import type { SiteContent } from "@/data/siteContent"

export function SiteFooter({ content }: { content: SiteContent }) {
  return (
    <footer className="border-t border-[#e7dfd4] bg-[#f8f5ef] px-5 py-8 text-sm text-[#66746d] sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>{content.footer.copyright}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p>{content.footer.imprint}</p>
          <a href="#/admin" className="font-medium text-[#28594a]">
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}
