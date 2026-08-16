import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import {
  Bold,
  Check,
  Eye,
  Home,
  Italic,
  Link2,
  List,
  ListOrdered,
  Plus,
  RemoveFormatting,
  Save,
  Trash2,
  X,
} from "lucide-react"

import nakiLogo from "@/assets/images/logo_naki.svg"
import nakiPortrait from "@/assets/images/naki.jpg"
import { adminPageFromHash, adminPages, type AdminPageId } from "@/admin/adminNavigation"
import type { ServiceIcon, SiteContent } from "@/data/siteContent"
import { HeroSection } from "@/features/home/components/HeroSection"
import { KontaktSection } from "@/features/home/components/KontaktSection"
import { LeistungenSection } from "@/features/home/components/LeistungenSection"
import { PraxisSection } from "@/features/home/components/PraxisSection"
import { SiteFooter } from "@/features/home/components/SiteFooter"
import { SiteHeader } from "@/features/home/components/SiteHeader"
import { TerminSection } from "@/features/home/components/TerminSection"
import { UeberNakiSection } from "@/features/home/components/UeberNakiSection"
import { sanitizeRichText } from "@/features/home/richText"
import { iconLabels } from "@/features/home/serviceIcons"
import {
  createMassageVoucherRequest,
  createValueVoucherRequest,
  loadGutscheinRequests,
  loadSiteContentFromApi,
  loginAdmin,
  logoutAdmin,
  saveSiteContentModuleToApi,
  uploadAboutImage,
  uploadHeroImage,
  type AdminSession,
  type MassageVoucherRequestDto,
  type SiteContentModule,
  type ValueVoucherRequestDto,
} from "@/lib/nakiApi"

const adminSessionStorageKey = "naki.admin.session"

function readStoredAdminSession(): AdminSession | null {
  const rawSession = window.sessionStorage.getItem(adminSessionStorageKey)

  if (!rawSession) {
    return null
  }

  try {
    const session = JSON.parse(rawSession) as AdminSession
    const expirationTime = new Date(session.expiration).getTime()

    if (!session.token || Number.isNaN(expirationTime) || expirationTime <= Date.now()) {
      window.sessionStorage.removeItem(adminSessionStorageKey)
      return null
    }

    return session
  } catch {
    window.sessionStorage.removeItem(adminSessionStorageKey)
    return null
  }
}

function storeAdminSession(session: AdminSession) {
  window.sessionStorage.setItem(adminSessionStorageKey, JSON.stringify(session))
}

function clearStoredAdminSession() {
  window.sessionStorage.removeItem(adminSessionStorageKey)
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

type GutscheinKind = "value" | "massage"

type GutscheinFormState = {
  kind: GutscheinKind
  serviceTitle: string
  duration: string
  value: string
  name: string
  phone: string
}

function firstService(content: SiteContent) {
  return content.services[0]
}

function initialGutscheinForm(content: SiteContent, service = firstService(content)): GutscheinFormState {
  return {
    kind: "massage",
    serviceTitle: service?.title ?? "",
    duration: service?.times[0] ?? "",
    value: content.vouchers.values[0] ?? "",
    name: "",
    phone: "",
  }
}

function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [status, setStatus] = useState("Loading...")

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
          setStatus(error instanceof Error ? error.message : "Failed to load API content.")
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
      setIsAdmin(window.location.hash.startsWith("#/admin") || window.location.pathname.endsWith("/admin"))
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
  const aboutImageSrc = content.about.imageUrl?.trim() || nakiPortrait
  const defaultAppointmentService = firstService(content)
  const [appointmentForm, setAppointmentForm] = useState(() => ({
    serviceTitle: defaultAppointmentService?.title ?? "",
    duration: defaultAppointmentService?.times[0] ?? "",
  }))
  const [isGutscheinOpen, setIsGutscheinOpen] = useState(false)
  const [gutscheinForm, setGutscheinForm] = useState(() => initialGutscheinForm(content))
  const [gutscheinStatus, setGutscheinStatus] = useState("")
  const [isSendingGutschein, setIsSendingGutschein] = useState(false)
  const selectedAppointmentService =
    content.services.find((service) => service.title === appointmentForm.serviceTitle) ??
    defaultAppointmentService
  const appointmentTimes = selectedAppointmentService?.times ?? []

  const changeAppointmentService = (serviceTitle: string) => {
    const nextService = content.services.find((service) => service.title === serviceTitle)

    setAppointmentForm({
      serviceTitle,
      duration: nextService?.times[0] ?? "",
    })
  }

  useEffect(() => {
    const currentService = content.services.find((service) => service.title === appointmentForm.serviceTitle)

    if (!currentService) {
      const nextService = firstService(content)
      const nextForm = {
        serviceTitle: nextService?.title ?? "",
        duration: nextService?.times[0] ?? "",
      }

      if (
        appointmentForm.serviceTitle !== nextForm.serviceTitle ||
        appointmentForm.duration !== nextForm.duration
      ) {
        setAppointmentForm(nextForm)
      }
      return
    }

    const nextDuration = currentService.times[0] ?? ""
    if (appointmentForm.duration !== nextDuration && !currentService.times.includes(appointmentForm.duration)) {
      setAppointmentForm((current) => ({
        ...current,
        duration: nextDuration,
      }))
    }
  }, [appointmentForm.duration, appointmentForm.serviceTitle, content])

  const openMassageGutschein = (service = firstService(content)) => {
    setGutscheinForm((current) => ({
      ...current,
      kind: "massage",
      serviceTitle: service?.title ?? current.serviceTitle,
      duration: service?.times[0] ?? current.duration,
    }))
    setIsGutscheinOpen(true)
  }

  const openValueGutschein = (value = content.vouchers.values[0] ?? "") => {
    setGutscheinForm((current) => ({
      ...current,
      kind: "value",
      value,
    }))
    setIsGutscheinOpen(true)
  }

  const sendGutscheinRequest = async () => {
    setIsSendingGutschein(true)
    setGutscheinStatus("Anfrage wird gespeichert...")

    try {
      if (gutscheinForm.kind === "value") {
        await createValueVoucherRequest({
          value: gutscheinForm.value,
          customerName: gutscheinForm.name,
          phone: gutscheinForm.phone,
        })
      } else {
        await createMassageVoucherRequest({
          serviceTitle: gutscheinForm.serviceTitle,
          duration: gutscheinForm.duration,
          customerName: gutscheinForm.name,
          phone: gutscheinForm.phone,
        })
      }

      setGutscheinStatus("Danke, deine Anfrage wurde gespeichert.")
      setGutscheinForm((current) => ({ ...current, name: "", phone: "" }))
    } catch (error) {
      setGutscheinStatus(error instanceof Error ? error.message : "Anfrage konnte nicht gespeichert werden.")
    } finally {
      setIsSendingGutschein(false)
    }
  }

  return (
    <main className="min-h-svh bg-[#f8f5ef] text-[#1c2621]">
      <SiteHeader content={content} />
      <HeroSection content={content} imageSrc={heroImageSrc} />
      <LeistungenSection content={content} onMassageVoucher={openMassageGutschein} />
      <PraxisSection content={content} />
      <UeberNakiSection content={content} imageSrc={aboutImageSrc} />
      <TerminSection
        content={content}
        serviceTitles={serviceTitles}
        appointmentForm={appointmentForm}
        appointmentTimes={appointmentTimes}
        onServiceChange={changeAppointmentService}
        onDurationChange={(duration) => setAppointmentForm((current) => ({ ...current, duration }))}
      />
      <KontaktSection content={content} onValueVoucher={openValueGutschein} />

      {isGutscheinOpen ? (
        <GutscheinDrawer
          content={content}
          form={gutscheinForm}
          onChange={setGutscheinForm}
          onClose={() => setIsGutscheinOpen(false)}
          onSubmit={sendGutscheinRequest}
          status={gutscheinStatus}
          isSubmitting={isSendingGutschein}
        />
      ) : null}

      <SiteFooter content={content} />
    </main>
  )
}
function GutscheinDrawer({
  content,
  form,
  onChange,
  onClose,
  onSubmit,
  status,
  isSubmitting,
}: {
  content: SiteContent
  form: GutscheinFormState
  onChange: (value: GutscheinFormState) => void
  onClose: () => void
  onSubmit: () => void
  status: string
  isSubmitting: boolean
}) {
  const selectedService = content.services.find((service) => service.title === form.serviceTitle) ?? firstService(content)
  const serviceTimes = selectedService?.times ?? []

  const updateForm = (patch: Partial<GutscheinFormState>) => {
    onChange({ ...form, ...patch })
  }

  const chooseKind = (kind: GutscheinKind) => {
    if (kind === "massage") {
      updateForm({
        kind,
        serviceTitle: form.serviceTitle || selectedService?.title || "",
        duration: form.duration || serviceTimes[0] || "",
      })
      return
    }

    updateForm({ kind, value: form.value || content.vouchers.values[0] || "" })
  }

  const handleServiceChange = (serviceTitle: string) => {
    const nextService = content.services.find((service) => service.title === serviceTitle)
    updateForm({
      serviceTitle,
      duration: nextService?.times[0] ?? "",
    })
  }

  const canSubmit =
    form.name.trim().length > 1 &&
    form.phone.trim().length > 3 &&
    (form.kind === "value"
      ? form.value.trim().length > 0
      : form.serviceTitle.trim().length > 0 && form.duration.trim().length > 0)

  return (
    <div className="fixed inset-0 z-[80] bg-[#1b130e]/68">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="Gutschein Fenster schließen"
      />
      <section className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white text-[#1c2621] shadow-2xl sm:max-w-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 grid size-9 place-items-center rounded-md text-[#8a8a8a] transition hover:bg-[#f1f1f1] hover:text-[#1c2621]"
          aria-label="Gutschein Fenster schließen"
        >
          <X className="size-5" />
        </button>

        <div className="overflow-y-auto px-6 pb-6 pt-16 sm:px-8">
        <h2 className="text-2xl font-medium text-[#202422] sm:text-3xl">Gutschein Kaufen</h2>
        <p className="mt-5 max-w-xl text-base leading-6 text-[#7d817f] sm:text-lg">
          Gutscheine können täglich von 18:00-19:00 in Grosspiesenham 49, 4925 Pramet abgeholt werden
        </p>

        <div className="mt-7 grid gap-3">
          <button
            type="button"
            onClick={() => chooseKind("value")}
            className={`flex h-11 items-center gap-3 rounded-md px-3 text-left text-lg transition ${
              form.kind === "value" ? "bg-[#d7e3db] text-[#52625a]" : "bg-[#e7e7e7] text-[#52625a]"
            }`}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-[3px] bg-white text-[#688466]">
              {form.kind === "value" ? <Check className="size-5 stroke-[3]" /> : null}
            </span>
            Wertgutschein
          </button>
          <button
            type="button"
            onClick={() => chooseKind("massage")}
            className={`flex h-11 items-center gap-3 rounded-md px-3 text-left text-lg transition ${
              form.kind === "massage" ? "bg-[#d7e3db] text-[#52625a]" : "bg-[#e7e7e7] text-[#52625a]"
            }`}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-[3px] bg-white text-[#688466]">
              {form.kind === "massage" ? <Check className="size-5 stroke-[3]" /> : null}
            </span>
            Massagegutschein
          </button>
        </div>

        <form
          className="mt-7 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            if (canSubmit) {
              onSubmit()
            }
          }}
        >
          {form.kind === "value" ? (
            <label className="grid gap-2 text-xl font-medium text-[#666a68]">
              Wert:
              <select
                value={form.value}
                onChange={(event) => updateForm({ value: event.target.value })}
                className="h-12 rounded-md border border-[#d1d1d1] bg-white px-3 text-xl font-normal text-black"
              >
                {content.vouchers.values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <>
              <label className="grid gap-2 text-xl font-medium text-[#666a68]">
                Massageart:
                <select
                  value={form.serviceTitle}
                  onChange={(event) => handleServiceChange(event.target.value)}
                  className="h-12 rounded-md border border-[#d1d1d1] bg-white px-3 text-xl font-normal text-black"
                >
                  {content.services.map((service) => (
                    <option key={service.title} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-xl font-medium text-[#666a68]">
                Dauer:
                <select
                  value={form.duration}
                  onChange={(event) => updateForm({ duration: event.target.value })}
                  className="h-12 rounded-md border border-[#d1d1d1] bg-white px-3 text-xl font-normal text-black"
                >
                  {serviceTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          <div className="grid gap-5">
            <label className="grid gap-2 text-xl font-medium text-[#666a68]">
              Dein Name
              <input
                value={form.name}
                onChange={(event) => updateForm({ name: event.target.value })}
                className="h-12 rounded-md border border-[#d1d1d1] bg-white px-3 text-xl font-normal text-black"
              />
            </label>
            <label className="grid gap-2 text-xl font-medium text-[#666a68]">
              Tel. Nr.
              <input
                value={form.phone}
                onChange={(event) => updateForm({ phone: event.target.value })}
                className="h-12 rounded-md border border-[#d1d1d1] bg-white px-3 text-xl font-normal text-black"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="h-12 rounded-md bg-[#63885f] text-xl font-semibold text-white transition hover:bg-[#557852] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isSubmitting ? "Wird gespeichert" : "Absenden"}
          </button>
          {status ? (
            <p className="rounded-md bg-[#eef3ec] p-3 text-sm leading-5 text-[#52625a]">
              {status}
            </p>
          ) : null}
        </form>
        </div>
      </section>
    </div>
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
  const [status, setStatus] = useState("")
  const [session, setSession] = useState<AdminSession | null>(() => readStoredAdminSession())
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [valueVoucherRequests, setValueVoucherRequests] = useState<ValueVoucherRequestDto[]>([])
  const [massageVoucherRequests, setMassageVoucherRequests] = useState<MassageVoucherRequestDto[]>([])
  const [activePage, setActivePage] = useState<AdminPageId>(() => adminPageFromHash())
  const draftHeroImageSrc = draft.hero.imageUrl?.trim() || nakiPortrait
  const draftAboutImageSrc = draft.about.imageUrl?.trim() || nakiPortrait

  useEffect(() => {
    setDraft(savedContent)
  }, [savedContent])

  useEffect(() => {
    const handleRoute = () => {
      setActivePage(adminPageFromHash())
    }

    window.addEventListener("hashchange", handleRoute)

    return () => {
      window.removeEventListener("hashchange", handleRoute)
    }
  }, [])

  useEffect(() => {
    if (!session) {
      setValueVoucherRequests([])
      setMassageVoucherRequests([])
      return
    }

    loadGutscheinRequests(session.token)
      .then(({ valueRequests, massageRequests }) => {
        setValueVoucherRequests(valueRequests)
        setMassageVoucherRequests(massageRequests)
      })
      .catch((error) => {
        if (error instanceof Error && error.message.includes("401")) {
          clearStoredAdminSession()
          setSession(null)
        }

        setStatus(error instanceof Error ? error.message : "Gutschein kayıtları yüklenemedi.")
      })
  }, [session])

  const saveDraft = async () => {
    if (!session) {
      setStatus("Kaydetmek icin once admin girisi yapmalisin.")
      return
    }

    if (activePage === "gutschein-requests") {
      setStatus("Gutschein kayıtları sadece görüntülenir; kaydedilecek içerik değişikliği yok.")
      return
    }

    setIsSaving(true)
    setStatus("Aktif modül API'ye kaydediliyor...")

    try {
      const syncedContent = await saveSiteContentModuleToApi(
        draft,
        session.token,
        activePage as SiteContentModule
      )
      setDraft(syncedContent)
      setContent(syncedContent)
      setStatus("Aktif modül API'ye kaydedildi ve site içeriği yenilendi.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Modül kaydı sırasında hata oluştu.")
    } finally {
      setIsSaving(false)
    }
  }

  const login = async () => {
    setIsSaving(true)
    setStatus("Admin girisi yapiliyor...")

    try {
      const loginSession = await loginAdmin(credentials.email, credentials.password)
      storeAdminSession(loginSession)
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
    clearStoredAdminSession()
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

  const uploadAboutVisual = async (file: File | undefined) => {
    if (!file) {
      return
    }

    if (!session) {
      setStatus("Görsel yüklemek için önce admin girişi yapmalısın.")
      return
    }

    setIsSaving(true)
    setStatus("Über Naki görseli API'ye yükleniyor...")

    try {
      const imageUrl = await uploadAboutImage(file, session.token)
      setDraft((current) => ({ ...current, about: { ...current.about, imageUrl } }))
      setStatus("Über Naki görseli yüklendi. Kalıcı olması için Kaydet butonuna bas.")
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
          <h1 className="text-2xl font-semibold text-[#18221e]">Login</h1>
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
            {adminPages.map((page) => (
              <a
                className={`rounded-md px-3 py-2 hover:bg-[#eef3ec] ${
                  activePage === page.id ? "bg-[#eef3ec] text-[#28594a]" : ""
                }`}
                href={`#/admin/${page.id}`}
                key={page.id}
              >
                {page.label}
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
          {activePage === "hero" ? (
          <AdminSection id="admin-hero" title="Hero ve Menü">
            <div className="grid gap-4">
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
          ) : null}

          {activePage === "services" ? (
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
                    <ListTextArea label="Süreler / paketler (her satır bir etiket)" items={service.times} onChange={(items) => setDraft((current) => ({ ...current, services: current.services.map((item, serviceIndex) => serviceIndex === index ? { ...item, times: items } : item) }))} />
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
          ) : null}

          {activePage === "practice" ? (
          <AdminSection id="admin-practice" title="Praxis İçeriği">
            <div className="grid gap-4">
              <Field label="Etiket" value={draft.practice.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, practice: { ...current.practice, eyebrow: value } }))} />
              <Field label="Başlık" value={draft.practice.title} onChange={(value) => setDraft((current) => ({ ...current, practice: { ...current.practice, title: value } }))} />
              {draft.practice.cards.map((card, index) => (
                <div className="grid gap-4 rounded-lg border border-[#ded4c4] bg-[#fbfaf7] p-4" key={`practice-card-${index}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-[#18221e]">
                      {card.title || `Praxis kartı ${index + 1}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setDraft((current) => ({ ...current, practice: { ...current.practice, cards: current.practice.cards.filter((_, cardIndex) => cardIndex !== index) } }))}
                      className="grid size-9 place-items-center rounded-md border border-[#d1c5b7] bg-white text-[#9b6040]"
                      aria-label="Praxis kartını sil"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <Field label="Kart başlığı" value={card.title} onChange={(value) => setDraft((current) => ({ ...current, practice: { ...current.practice, cards: current.practice.cards.map((item, cardIndex) => cardIndex === index ? { ...item, title: value } : item) } }))} />
                  <TextArea label="Kart metni" value={card.text} onChange={(value) => setDraft((current) => ({ ...current, practice: { ...current.practice, cards: current.practice.cards.map((item, cardIndex) => cardIndex === index ? { ...item, text: value } : item) } }))} />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDraft((current) => ({ ...current, practice: { ...current.practice, cards: [...current.practice.cards, { title: "Neue Praxis Info", text: "Beschreibung ergänzen." }] } }))}
                className="inline-flex h-11 w-max items-center justify-center gap-2 rounded-md bg-[#28594a] px-4 text-sm font-medium text-white"
              >
                <Plus className="size-4" />
                Praxis kartı ekle
              </button>
            </div>
          </AdminSection>
          ) : null}

          {activePage === "about" ? (
          <AdminSection id="admin-about" title="Über Naki">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Etiket" value={draft.about.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, eyebrow: value } }))} />
              <Field label="Başlık" value={draft.about.title} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, title: value } }))} />
              <TextArea label="Metin" value={draft.about.body} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, body: value } }))} />
              <Field label="Über Naki görsel URL" value={draft.about.imageUrl ?? ""} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, imageUrl: value.trim() || null } }))} />
              <label className="grid gap-2 text-sm font-medium text-[#43534b]">
                Über Naki görsel yükle
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    void uploadAboutVisual(event.target.files?.[0])
                    event.target.value = ""
                  }}
                  disabled={isSaving}
                  className="h-11 rounded-md border border-[#d1c5b7] bg-white px-3 py-2"
                />
              </label>
              <div className="min-h-44 overflow-hidden rounded-lg border border-[#ded4c4] bg-[#fbfaf7]">
                <img src={draftAboutImageSrc} alt="Über Naki görsel önizleme" className="h-full min-h-44 w-full object-cover" />
              </div>
              {draft.about.stats.map((stat, index) => (
                <div className="grid gap-4 rounded-lg border border-[#ded4c4] bg-[#fbfaf7] p-4" key={`about-stat-${index}`}>
                  <Field label="Vurgu değeri" value={stat.value} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, stats: current.about.stats.map((item, statIndex) => statIndex === index ? { ...item, value } : item) } }))} />
                  <TextArea label="Vurgu metni" value={stat.text} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, stats: current.about.stats.map((item, statIndex) => statIndex === index ? { ...item, text: value } : item) } }))} />
                </div>
              ))}
            </div>
          </AdminSection>
          ) : null}

          {activePage === "appointment" ? (
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
          ) : null}

          {activePage === "contact" ? (
          <AdminSection id="admin-contact" title="Kontakt ve Footer">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kontakt başlığı" value={draft.contact.title} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, title: value } }))} />
              <Field label="Ad" value={draft.contact.name} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, name: value } }))} />
              <PlainTextArea label="Adres" value={draft.contact.address} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, address: value } }))} />
              <Field label="Telefon" value={draft.contact.phone} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, phone: value } }))} />
              <Field label="E-posta" value={draft.contact.email} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, email: value } }))} />
              <Field label="Harita URL" value={draft.contact.mapUrl} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, mapUrl: value } }))} />
              <Field label="Harita butonu" value={draft.contact.mapLabel} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, mapLabel: value } }))} />
              <Field label="Footer sol" value={draft.footer.copyright} onChange={(value) => setDraft((current) => ({ ...current, footer: { ...current.footer, copyright: value } }))} />
              <Field label="Footer sağ" value={draft.footer.imprint} onChange={(value) => setDraft((current) => ({ ...current, footer: { ...current.footer, imprint: value } }))} />
            </div>
          </AdminSection>
          ) : null}

          {activePage === "gutschein-requests" ? (
          <AdminSection id="admin-gutschein-requests" title="Gutschein Kayıtları">
            <div className="grid gap-6 lg:grid-cols-2">
              <GutscheinRequestList
                title="Wertgutschein talepleri"
                emptyText="Henüz Wertgutschein talebi yok."
                items={valueVoucherRequests.map((request) => ({
                  id: request.id,
                  title: request.value,
                  lines: [request.customerName, request.phone, formatDateTime(request.createdAt)],
                }))}
              />
              <GutscheinRequestList
                title="Massagegutschein talepleri"
                emptyText="Henüz Massagegutschein talebi yok."
                items={massageVoucherRequests.map((request) => ({
                  id: request.id,
                  title: request.serviceTitle,
                  lines: [
                    request.duration,
                    request.customerName,
                    request.phone,
                    formatDateTime(request.createdAt),
                  ],
                }))}
              />
            </div>
          </AdminSection>
          ) : null}

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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("de-AT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function GutscheinRequestList({
  title,
  emptyText,
  items,
}: {
  title: string
  emptyText: string
  items: Array<{
    id: string
    title: string
    lines: string[]
  }>
}) {
  return (
    <div className="rounded-lg border border-[#ded4c4] bg-[#fbfaf7] p-4">
      <h3 className="text-lg font-semibold text-[#18221e]">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.length === 0 ? (
          <p className="rounded-md bg-white p-3 text-sm text-[#66746d]">{emptyText}</p>
        ) : (
          items.map((item) => (
            <article className="rounded-md border border-[#ded4c4] bg-white p-4" key={item.id}>
              <p className="font-semibold text-[#28594a]">{item.title}</p>
              <div className="mt-2 grid gap-1 text-sm leading-5 text-[#52625a]">
                {item.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
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

function PlainTextArea({
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

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
  })

  const isCommandActive = (command: string) => {
    try {
      return document.queryCommandState(command)
    } catch {
      return false
    }
  }

  const refreshActiveFormats = () => {
    const editor = editorRef.current
    const selection = window.getSelection()

    if (!editor || !selection?.anchorNode || !editor.contains(selection.anchorNode)) {
      return
    }

    setActiveFormats({
      bold: isCommandActive("bold"),
      italic: isCommandActive("italic"),
      underline: isCommandActive("underline"),
      unorderedList: isCommandActive("insertUnorderedList"),
      orderedList: isCommandActive("insertOrderedList"),
    })
  }

  useEffect(() => {
    const editor = editorRef.current

    if (!editor || document.activeElement === editor) {
      return
    }

    const nextValue = sanitizeRichText(value)
    if (editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue
    }
  }, [value])

  useEffect(() => {
    document.addEventListener("selectionchange", refreshActiveFormats)

    return () => {
      document.removeEventListener("selectionchange", refreshActiveFormats)
    }
  })

  const updateValue = (shouldSanitize = false) => {
    const editor = editorRef.current

    if (!editor) {
      onChange("")
      return
    }

    const nextValue = shouldSanitize ? sanitizeRichText(editor.innerHTML) : editor.innerHTML

    if (shouldSanitize && editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue
    }

    onChange(nextValue)
    refreshActiveFormats()
  }

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, commandValue)
    updateValue()
    window.setTimeout(refreshActiveFormats)
  }

  const addLink = () => {
    const url = window.prompt("Link URL")

    if (!url) {
      return
    }

    runCommand("createLink", url)
  }

  return (
    <div className="grid gap-2 text-sm font-medium text-[#43534b]">
      <span>{label}</span>
      <div className="overflow-hidden rounded-md border border-[#d1c5b7] bg-white">
        <div className="flex flex-wrap gap-1 border-b border-[#e3d9ca] bg-[#fbfaf7] p-2">
          <EditorButton label="Kalın" active={activeFormats.bold} onClick={() => runCommand("bold")}>
            <Bold className="size-4" />
          </EditorButton>
          <EditorButton label="İtalik" active={activeFormats.italic} onClick={() => runCommand("italic")}>
            <Italic className="size-4" />
          </EditorButton>
          <EditorButton label="Altı çizili" active={activeFormats.underline} onClick={() => runCommand("underline")}>
            <span className="text-sm font-semibold underline">U</span>
          </EditorButton>
          <EditorButton label="Madde listesi" active={activeFormats.unorderedList} onClick={() => runCommand("insertUnorderedList")}>
            <List className="size-4" />
          </EditorButton>
          <EditorButton label="Numaralı liste" active={activeFormats.orderedList} onClick={() => runCommand("insertOrderedList")}>
            <ListOrdered className="size-4" />
          </EditorButton>
          <EditorButton label="Link" onClick={addLink}>
            <Link2 className="size-4" />
          </EditorButton>
          <EditorButton label="Biçimi temizle" onClick={() => runCommand("removeFormat")}>
            <RemoveFormatting className="size-4" />
          </EditorButton>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => updateValue()}
          onBlur={() => updateValue(true)}
          onKeyUp={refreshActiveFormats}
          onMouseUp={refreshActiveFormats}
          onPaste={(event) => {
            event.preventDefault()
            const text = event.clipboardData.getData("text/plain")
            document.execCommand("insertText", false, text)
            updateValue()
          }}
          className="rich-editor min-h-32 bg-white p-3 text-base leading-7 outline-none"
        />
      </div>
    </div>
  )
}

function EditorButton({
  label,
  active = false,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`grid size-8 place-items-center rounded-md transition ${
        active
          ? "bg-[#28594a] text-white shadow-sm hover:bg-[#214a3e] hover:text-white"
          : "text-[#43534b] hover:bg-[#e8efe6] hover:text-[#28594a]"
      }`}
    >
      {children}
    </button>
  )
}

function ListTextArea({
  label,
  items,
  onChange,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
}) {
  const [text, setText] = useState(listToText(items))

  useEffect(() => {
    const nextText = listToText(items)

    if (listToText(textToList(text)) !== nextText) {
      setText(nextText)
    }
  }, [items, text])

  return (
    <label className="grid gap-2 text-sm font-medium text-[#43534b]">
      {label}
      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          onChange(textToList(event.target.value))
        }}
        className="min-h-28 rounded-md border border-[#d1c5b7] bg-white p-3 leading-6"
      />
    </label>
  )
}

export default App
