import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import {
  ArrowRight,
  Check,
  Eye,
  Gift,
  HeartPulse,
  Home,
  Leaf,
  MapPin,
  Menu,
  Phone,
  Plus,
  Save,
  Sparkles,
  Timer,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import nakiLogo from "@/assets/images/logo_naki.svg"
import nakiPortrait from "@/assets/images/naki.jpg"
import type { ServiceIcon, SiteContent } from "@/data/siteContent"
import {
  loadSiteContentFromApi,
  loginAdmin,
  logoutAdmin,
  saveSiteContentToApi,
  uploadHeroImage,
  type AdminSession,
} from "@/lib/nakiApi"

const serviceIcons = {
  heart: HeartPulse,
  timer: Timer,
  leaf: Leaf,
  sparkles: Sparkles,
}

const iconLabels: Record<ServiceIcon, string> = {
  heart: "Herz",
  timer: "Zeit",
  leaf: "Blatt",
  sparkles: "Glanz",
}

function listToText(items: string[]) {
  return items.join("\n")
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`
}

function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [status, setStatus] = useState("API icerigi yukleniyor...")

  useEffect(() => {
    let isMounted = true

    loadSiteContentFromApi()
      .then((apiContent) => {
        if (isMounted) {
          setContent(apiContent)
          setStatus("")
        }
      })
      .catch((error) => {
        if (isMounted) {
          setStatus(error instanceof Error ? error.message : "API icerigi yuklenemedi.")
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { content, setContent, status } as const
}

function useAdminRoute() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return window.location.hash === "#/admin" || window.location.pathname.endsWith("/admin")
  })

  useEffect(() => {
    const handleRoute = () => {
      setIsAdmin(window.location.hash === "#/admin" || window.location.pathname.endsWith("/admin"))
    }

    window.addEventListener("hashchange", handleRoute)
    window.addEventListener("popstate", handleRoute)

    return () => {
      window.removeEventListener("hashchange", handleRoute)
      window.removeEventListener("popstate", handleRoute)
    }
  }, [])

  return isAdmin
}

function FlowerLayer() {
  return (
    <div className="flower-field" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, index) => (
        <span className="flower-bloom" key={index} />
      ))}
    </div>
  )
}

export function App() {
  const { content, setContent, status } = useSiteContent()
  const isAdmin = useAdminRoute()

  if (!content) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f8f5ef] px-5 text-[#1c2621]">
        <div className="max-w-md rounded-lg border border-[#e7dfd4] bg-white p-6 text-center shadow-sm">
          <img src={nakiLogo} alt="Naki" className="mx-auto mb-5 h-20 object-contain" />
          <p className="text-sm font-medium text-[#52625a]">{status}</p>
        </div>
      </main>
    )
  }

  if (isAdmin) {
    return <AdminPanel content={content} setContent={setContent} />
  }

  return <PublicSite content={content} />
}

function PublicSite({ content }: { content: SiteContent }) {
  const serviceTitles = useMemo(
    () => content.services.map((service) => service.title),
    [content.services]
  )
  const heroImageSrc = content.hero.imageUrl?.trim() || nakiPortrait

  return (
    <main className="min-h-svh bg-[#f8f5ef] text-[#1c2621]">
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

      <section id="top" className="relative overflow-hidden pt-16">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-5 inline-flex rounded-md border border-[#d7c9b9] bg-white/62 px-3 py-1 text-sm font-medium text-[#7a4b35]">
              {content.hero.eyebrow}
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-[#18221e] sm:text-6xl lg:text-7xl">
              {content.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#52625a]">
              {content.hero.body}
            </p>
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
              src={heroImageSrc}
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
              <p className="mt-2 text-sm leading-6 text-[#52625a]">
                {content.hero.contactBody}
              </p>
            </div>
          </div>
        </div>
      </section>

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
                  <p className="mt-3 min-h-20 text-[15px] leading-7 text-[#5b6b63]">
                    {service.text}
                  </p>
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
                    <a
                      href="#gutschein"
                      className="inline-flex h-8 items-center justify-center rounded-md border border-[#d9d1c5] bg-white px-3 text-sm font-medium text-[#28594a] transition hover:bg-[#eef3ec]"
                    >
                      Gutschein
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="praxis" className="bg-[#eef3ec] py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9b6040]">
              {content.practice.eyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#18221e] sm:text-5xl">
              {content.practice.title}
            </h2>
          </div>
          <div className="grid gap-5 text-base leading-8 text-[#52625a] md:grid-cols-2">
            {content.practice.cards.map((card) => (
              <div className="rounded-lg bg-white p-6" key={card.title}>
                <h3 className="text-xl font-semibold text-[#18221e]">{card.title}</h3>
                <p className="mt-3">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="naki" className="bg-[#f8f5ef] py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[#e2d8c9] bg-[#f1eadc] shadow-[0_24px_70px_rgba(32,45,38,0.12)] sm:min-h-[440px] lg:min-h-[560px]">
            <img
              src={heroImageSrc}
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
            <p className="mt-5 text-base leading-8 text-[#52625a]">{content.about.body}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {content.about.stats.map((stat) => (
                <div className="rounded-lg bg-white p-5" key={stat.value}>
                  <p className="text-3xl font-semibold text-[#28594a]">{stat.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5b6b63]">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="termin" className="bg-[#1e2b25] py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6a276]">
              {content.appointment.eyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              {content.appointment.title}
            </h2>
            <p className="mt-5 max-w-md leading-8 text-white/72">
              {content.appointment.body}
            </p>
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
                <select className="h-12 rounded-md border border-[#d9d1c5] bg-[#fbfaf7] px-3">
                  <option>Bitte auswählen</option>
                  {serviceTitles.map((title) => (
                    <option key={title}>{title}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Dauer
                <select className="h-12 rounded-md border border-[#d9d1c5] bg-[#fbfaf7] px-3">
                  <option>Bitte auswählen</option>
                  <option>25 Minuten</option>
                  <option>50 Minuten</option>
                  <option>60 Minuten</option>
                  <option>80 Minuten</option>
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

      <section id="gutschein" className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-[#e7dfd4] bg-[#fbfaf7] p-7">
            <Gift className="size-10 text-[#9b6040]" />
            <h2 className="mt-5 text-4xl font-semibold text-[#18221e]">
              {content.vouchers.title}
            </h2>
            <p className="mt-4 leading-8 text-[#5b6b63]">{content.vouchers.body}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {content.vouchers.values.map((value) => (
                <span key={value} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#28594a]">
                  {value}
                </span>
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
              <p>{content.contact.address}</p>
              <p>
                <a href={phoneHref(content.contact.phone)}>{content.contact.phone}</a>
              </p>
              <p>
                <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
              </p>
            </div>
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
    </main>
  )
}

function AdminPanel({
  content: savedContent,
  setContent,
}: {
  content: SiteContent
  setContent: (content: SiteContent) => void
}) {
  const [draft, setDraft] = useState(savedContent)
  const [status, setStatus] = useState("Degisiklikler taslakta bekler; Kaydet butonuna basinca API'ye yazilir.")
  const [session, setSession] = useState<AdminSession | null>(null)
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [isSaving, setIsSaving] = useState(false)
  const draftHeroImageSrc = draft.hero.imageUrl?.trim() || nakiPortrait

  useEffect(() => {
    setDraft(savedContent)
  }, [savedContent])

  const saveDraft = async () => {
    if (!session) {
      setStatus("Kaydetmek icin once admin girisi yapmalisin.")
      return
    }

    setIsSaving(true)
    setStatus("API'ye kaydediliyor...")

    try {
      const syncedContent = await saveSiteContentToApi(draft, session.token)
      setDraft(syncedContent)
      setContent(syncedContent)
      setStatus("Taslak API'ye kaydedildi ve site icerigi yenilendi.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "API kaydi sirasinda hata olustu.")
    } finally {
      setIsSaving(false)
    }
  }

  const login = async () => {
    setIsSaving(true)
    setStatus("Admin girisi yapiliyor...")

    try {
      const loginSession = await loginAdmin(credentials.email, credentials.password)
      setSession(loginSession)
      setCredentials({ email: "", password: "" })
      setStatus(`${loginSession.fullName} olarak giris yapildi.`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Giris basarisiz.")
    } finally {
      setIsSaving(false)
    }
  }

  const logout = async () => {
    if (session) {
      await logoutAdmin(session)
    }

    setSession(null)
    setStatus("Oturum kapatildi.")
  }

  const uploadHeroVisual = async (file: File | undefined) => {
    if (!file) {
      return
    }

    if (!session) {
      setStatus("Görsel yüklemek için önce admin girişi yapmalısın.")
      return
    }

    setIsSaving(true)
    setStatus("Hero görseli API'ye yükleniyor...")

    try {
      const imageUrl = await uploadHeroImage(file, session.token)
      setDraft((current) => ({ ...current, hero: { ...current.hero, imageUrl } }))
      setStatus("Hero görseli yüklendi. Kalıcı olması için Kaydet butonuna bas.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Görsel yüklenirken hata oluştu.")
    } finally {
      setIsSaving(false)
    }
  }

  if (!session) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f4efe6] px-5 text-[#1c2621]">
        <section className="w-full max-w-md rounded-lg border border-[#ded4c4] bg-white p-6 shadow-sm">
          <img src={nakiLogo} alt="Naki" className="mb-6 h-20 object-contain object-left" />
          <h1 className="text-2xl font-semibold text-[#18221e]">Admin Girisi</h1>
          <p className="mt-2 text-sm leading-6 text-[#52625a]">{status}</p>
          <div className="mt-6 grid gap-4">
            <Field
              label="E-posta"
              value={credentials.email}
              onChange={(value) => setCredentials((current) => ({ ...current, email: value }))}
            />
            <label className="grid gap-2 text-sm font-medium text-[#43534b]">
              Sifre
              <input
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((current) => ({ ...current, password: event.target.value }))
                }
                className="h-11 rounded-md border border-[#d1c5b7] bg-white px-3"
              />
            </label>
            <button
              type="button"
              onClick={login}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#28594a] px-4 text-sm font-medium text-white"
            >
              {isSaving ? "Giris yapiliyor" : "Giris yap"}
            </button>
            <a href="#top" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#d1c5b7] bg-white px-4 text-sm font-medium text-[#28594a]">
              <Home className="size-4" />
              Siteye don
            </a>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-[#f4efe6] text-[#1c2621]">
      <header className="sticky top-0 z-40 border-b border-[#ded4c4] bg-[#f8f5ef]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9b6040]">
              API Yonetimi
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#18221e]">
              Naki Admin Panel
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="#top"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-[#28594a] shadow-sm"
            >
              <Home className="size-4" />
              Siteye dön
            </a>
            <button
              type="button"
              onClick={saveDraft}
              disabled={isSaving || !session}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#28594a] px-4 text-sm font-medium text-white"
            >
              <Save className="size-4" />
              {isSaving ? "Kaydediliyor" : "Kaydet"}
            </button>
            {session ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#d1c5b7] bg-white px-4 text-sm font-medium"
              >
                Oturumu kapat
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[16rem_1fr]">
        <aside className="h-max rounded-lg border border-[#ded4c4] bg-white p-4">
          <nav className="grid gap-1 text-sm font-medium text-[#52625a]">
            {[
              ["#admin-hero", "Hero"],
              ["#admin-services", "Hizmetler"],
              ["#admin-practice", "Praxis"],
              ["#admin-about", "Über Naki"],
              ["#admin-appointment", "Termin"],
              ["#admin-contact", "Kontakt"],
            ].map(([href, label]) => (
              <a className="rounded-md px-3 py-2 hover:bg-[#eef3ec]" href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
          <p className="mt-4 rounded-md bg-[#eef3ec] p-3 text-xs leading-5 text-[#52625a]">
            {status}
          </p>
          {session ? (
            <p className="mt-3 rounded-md border border-[#ded4c4] bg-[#fbfaf7] p-3 text-xs leading-5 text-[#52625a]">
              {session.fullName}
            </p>
          ) : null}
        </aside>

        <div className="grid gap-6">
          <AdminSection id="admin-hero" title="Hero ve Menü">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hero üst etiket" value={draft.hero.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, eyebrow: value } }))} />
              <Field label="Başlık" value={draft.hero.title} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, title: value } }))} />
              <TextArea label="Açıklama" value={draft.hero.body} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, body: value } }))} />
              <Field label="Hero görsel URL" value={draft.hero.imageUrl ?? ""} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, imageUrl: value.trim() || null } }))} />
              <label className="grid gap-2 text-sm font-medium text-[#43534b]">
                Hero görsel yükle
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    void uploadHeroVisual(event.target.files?.[0])
                    event.target.value = ""
                  }}
                  disabled={isSaving}
                  className="h-11 rounded-md border border-[#d1c5b7] bg-white px-3 py-2"
                />
              </label>
              <div className="min-h-44 overflow-hidden rounded-lg border border-[#ded4c4] bg-[#fbfaf7]">
                <img src={draftHeroImageSrc} alt="Hero görsel önizleme" className="h-full min-h-44 w-full object-cover" />
              </div>
              <TextArea label="Faydalar (her satır bir madde)" value={listToText(draft.benefits)} onChange={(value) => setDraft((current) => ({ ...current, benefits: textToList(value) }))} />
              <Field label="Ana buton" value={draft.hero.primaryCta} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, primaryCta: value } }))} />
              <Field label="İkinci buton" value={draft.hero.secondaryCta} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, secondaryCta: value } }))} />
              <Field label="İletişim kart etiketi" value={draft.hero.contactLabel} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, contactLabel: value } }))} />
              <TextArea label="İletişim kart metni" value={draft.hero.contactBody} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, contactBody: value } }))} />
            </div>
          </AdminSection>

          <AdminSection id="admin-services" title="Hizmetler ve Fiyatlar">
            <div className="grid gap-4">
              {draft.services.map((service, index) => (
                <div className="rounded-lg border border-[#ded4c4] bg-[#fbfaf7] p-4" key={`service-${index}`}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-[#18221e]">{service.title || `Hizmet ${index + 1}`}</h3>
                    <button
                      type="button"
                      onClick={() => setDraft((current) => ({ ...current, services: current.services.filter((_, serviceIndex) => serviceIndex !== index) }))}
                      className="grid size-9 place-items-center rounded-md border border-[#d1c5b7] bg-white text-[#9b6040]"
                      aria-label="Hizmeti sil"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Başlık" value={service.title} onChange={(value) => setDraft((current) => ({ ...current, services: current.services.map((item, serviceIndex) => serviceIndex === index ? { ...item, title: value } : item) }))} />
                    <Field label="Fiyat etiketi" value={service.price} onChange={(value) => setDraft((current) => ({ ...current, services: current.services.map((item, serviceIndex) => serviceIndex === index ? { ...item, price: value } : item) }))} />
                    <label className="grid gap-2 text-sm font-medium text-[#43534b]">
                      İkon
                      <select
                        value={service.icon}
                        onChange={(event) => setDraft((current) => ({ ...current, services: current.services.map((item, serviceIndex) => serviceIndex === index ? { ...item, icon: event.target.value as ServiceIcon } : item) }))}
                        className="h-11 rounded-md border border-[#d1c5b7] bg-white px-3"
                      >
                        {Object.entries(iconLabels).map(([value, label]) => (
                          <option value={value} key={value}>{label}</option>
                        ))}
                      </select>
                    </label>
                    <TextArea label="Süreler / paketler (her satır bir etiket)" value={listToText(service.times)} onChange={(value) => setDraft((current) => ({ ...current, services: current.services.map((item, serviceIndex) => serviceIndex === index ? { ...item, times: textToList(value) } : item) }))} />
                    <TextArea label="Açıklama" value={service.text} onChange={(value) => setDraft((current) => ({ ...current, services: current.services.map((item, serviceIndex) => serviceIndex === index ? { ...item, text: value } : item) }))} />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDraft((current) => ({ ...current, services: [...current.services, { title: "Neue Massage", price: "ab 0€", text: "Beschreibung ergänzen.", times: ["50 Min · 0€"], icon: "sparkles" }] }))}
                className="inline-flex h-11 w-max items-center justify-center gap-2 rounded-md bg-[#28594a] px-4 text-sm font-medium text-white"
              >
                <Plus className="size-4" />
                Hizmet ekle
              </button>
            </div>
          </AdminSection>

          <AdminSection id="admin-practice" title="Praxis İçeriği">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Etiket" value={draft.practice.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, practice: { ...current.practice, eyebrow: value } }))} />
              <Field label="Başlık" value={draft.practice.title} onChange={(value) => setDraft((current) => ({ ...current, practice: { ...current.practice, title: value } }))} />
              {draft.practice.cards.map((card, index) => (
                <div className="grid gap-4 rounded-lg border border-[#ded4c4] bg-[#fbfaf7] p-4" key={`practice-card-${index}`}>
                  <Field label="Kart başlığı" value={card.title} onChange={(value) => setDraft((current) => ({ ...current, practice: { ...current.practice, cards: current.practice.cards.map((item, cardIndex) => cardIndex === index ? { ...item, title: value } : item) } }))} />
                  <TextArea label="Kart metni" value={card.text} onChange={(value) => setDraft((current) => ({ ...current, practice: { ...current.practice, cards: current.practice.cards.map((item, cardIndex) => cardIndex === index ? { ...item, text: value } : item) } }))} />
                </div>
              ))}
            </div>
          </AdminSection>

          <AdminSection id="admin-about" title="Über Naki">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Etiket" value={draft.about.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, eyebrow: value } }))} />
              <Field label="Başlık" value={draft.about.title} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, title: value } }))} />
              <TextArea label="Metin" value={draft.about.body} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, body: value } }))} />
              {draft.about.stats.map((stat, index) => (
                <div className="grid gap-4 rounded-lg border border-[#ded4c4] bg-[#fbfaf7] p-4" key={`about-stat-${index}`}>
                  <Field label="Vurgu değeri" value={stat.value} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, stats: current.about.stats.map((item, statIndex) => statIndex === index ? { ...item, value } : item) } }))} />
                  <TextArea label="Vurgu metni" value={stat.text} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, stats: current.about.stats.map((item, statIndex) => statIndex === index ? { ...item, text: value } : item) } }))} />
                </div>
              ))}
            </div>
          </AdminSection>

          <AdminSection id="admin-appointment" title="Termin ve Gutschein">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Termin etiketi" value={draft.appointment.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, appointment: { ...current.appointment, eyebrow: value } }))} />
              <Field label="Termin başlığı" value={draft.appointment.title} onChange={(value) => setDraft((current) => ({ ...current, appointment: { ...current.appointment, title: value } }))} />
              <TextArea label="Termin metni" value={draft.appointment.body} onChange={(value) => setDraft((current) => ({ ...current, appointment: { ...current.appointment, body: value } }))} />
              <Field label="Form butonu" value={draft.appointment.submitLabel} onChange={(value) => setDraft((current) => ({ ...current, appointment: { ...current.appointment, submitLabel: value } }))} />
              <Field label="Gutschein başlığı" value={draft.vouchers.title} onChange={(value) => setDraft((current) => ({ ...current, vouchers: { ...current.vouchers, title: value } }))} />
              <TextArea label="Gutschein metni" value={draft.vouchers.body} onChange={(value) => setDraft((current) => ({ ...current, vouchers: { ...current.vouchers, body: value } }))} />
              <TextArea label="Gutschein değerleri (her satır bir değer)" value={listToText(draft.vouchers.values)} onChange={(value) => setDraft((current) => ({ ...current, vouchers: { ...current.vouchers, values: textToList(value) } }))} />
            </div>
          </AdminSection>

          <AdminSection id="admin-contact" title="Kontakt ve Footer">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kontakt başlığı" value={draft.contact.title} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, title: value } }))} />
              <Field label="Ad" value={draft.contact.name} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, name: value } }))} />
              <Field label="Adres" value={draft.contact.address} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, address: value } }))} />
              <Field label="Telefon" value={draft.contact.phone} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, phone: value } }))} />
              <Field label="E-posta" value={draft.contact.email} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, email: value } }))} />
              <Field label="Harita URL" value={draft.contact.mapUrl} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, mapUrl: value } }))} />
              <Field label="Harita butonu" value={draft.contact.mapLabel} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, mapLabel: value } }))} />
              <Field label="Footer sol" value={draft.footer.copyright} onChange={(value) => setDraft((current) => ({ ...current, footer: { ...current.footer, copyright: value } }))} />
              <Field label="Footer sağ" value={draft.footer.imprint} onChange={(value) => setDraft((current) => ({ ...current, footer: { ...current.footer, imprint: value } }))} />
            </div>
          </AdminSection>

          <a
            href="#top"
            className="inline-flex h-11 w-max items-center justify-center gap-2 rounded-md bg-[#1e2b25] px-4 text-sm font-medium text-white hover:text-white"
          >
            <Eye className="size-4" />
            Canlı site önizlemesine dön
          </a>
        </div>
      </div>
    </main>
  )
}

function AdminSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="rounded-lg border border-[#ded4c4] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-2xl font-semibold text-[#18221e]">{title}</h2>
      {children}
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#43534b]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-[#d1c5b7] bg-white px-3"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#43534b]">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 rounded-md border border-[#d1c5b7] bg-white p-3 leading-6"
      />
    </label>
  )
}

export default App
