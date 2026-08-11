export type AdminPageId =
  | "hero"
  | "services"
  | "practice"
  | "about"
  | "appointment"
  | "gutschein-requests"
  | "contact"

export const adminPages: Array<{ id: AdminPageId; label: string }> = [
  { id: "hero", label: "Hero" },
  { id: "services", label: "Hizmetler" },
  { id: "practice", label: "Praxis" },
  { id: "about", label: "Über Naki" },
  { id: "appointment", label: "Termin" },
  { id: "gutschein-requests", label: "Gutschein Kayıtları" },
  { id: "contact", label: "Kontakt" },
]

export function adminPageFromHash(): AdminPageId {
  const hashPage = window.location.hash.replace("#/admin/", "") as AdminPageId
  return adminPages.some((page) => page.id === hashPage) ? hashPage : "hero"
}
