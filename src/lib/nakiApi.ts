import type { ServiceIcon, SiteContent } from "@/data/siteContent"

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "https://nakiapi.sofiraflow.com").replace(
  /\/$/,
  ""
)

type BaseResponse<T> = {
  succeeded: boolean
  message?: string | null
  data?: T | null
  errors?: Array<string | null> | null
  statusCode?: number | null
}

export type AdminSession = {
  token: string
  refreshToken?: string | null
  fullName: string
  userId: string
  expiration: string
}

type Entity = {
  id: string
}

export type ValueVoucherRequestDto = Entity & {
  value: string
  customerName: string
  phone: string
  createdAt: string
}

export type MassageVoucherRequestDto = Entity & {
  serviceTitle: string
  duration: string
  customerName: string
  phone: string
  createdAt: string
}

export type SiteContentModule =
  | "hero"
  | "services"
  | "practice"
  | "about"
  | "appointment"
  | "contact"

type HeroDto = Entity & {
  eyebrow: string
  title: string
  body: string
  primaryCta: string
  secondaryCta: string
  contactLabel: string
  contactBody: string
  imageUrl?: string | null
}

type NavigationMenuDto = Entity & {
  serviceName: string
  about: string
  practice: string
  appointment: string
  contact: string
  call: string
}

type BenefitDto = Entity & {
  benefitName: string
}

type ServiceDto = Entity & {
  title: string
  price: number
  currency: string
  description: string
  icon: string
}

type ServiceTimeDto = Entity & {
  serviceId: string
  price: number
  currency: string
  durationInMinutes: number
}

type PracticeDto = Entity & {
  eyebrow: string
  title: string
}

type PracticeCardDto = Entity & {
  practiceId: string
  title: string
  description: string
}

type AboutDto = Entity & {
  eyebrow: string
  title: string
  description: string
  imageUrl?: string | null
}

type AboutStatDto = Entity & {
  aboutId: string
  statValue: string
  description: string
}

type AppointmentDto = Entity & {
  eyebrow: string
  title: string
  description: string
  buttonText: string
}

type VoucherDto = Entity & {
  title: string
  description: string
}

type VoucherPriceDto = Entity & {
  voucherId: string
  price: number
  currency: string
}

type ContactDto = Entity & {
  title: string
  name: string
  address: string
  phone: string
  email: string
  mapUrl: string
  mapLabel: string
}

type FooterDto = Entity & {
  copyright: string
  imprint: string
}

type ApiSnapshot = {
  heroes: HeroDto[]
  navigationMenus: NavigationMenuDto[]
  benefits: BenefitDto[]
  services: ServiceDto[]
  serviceTimes: ServiceTimeDto[]
  practices: PracticeDto[]
  practiceCards: PracticeCardDto[]
  abouts: AboutDto[]
  aboutStats: AboutStatDto[]
  appointments: AppointmentDto[]
  vouchers: VoucherDto[]
  voucherPrices: VoucherPriceDto[]
  contacts: ContactDto[]
  footers: FooterDto[]
}

const endpoints = {
  heroes: "Heroes",
  navigationMenus: "NavigationMenus",
  benefits: "Benefits",
  services: "Services",
  serviceTimes: "ServiceTimes",
  practices: "Practices",
  practiceCards: "PracticeCards",
  abouts: "About",
  aboutStats: "AboutState",
  appointments: "Apointments",
  vouchers: "Vouchers",
  voucherPrices: "VoucherPrices",
  gutscheinRequests: "GutscheinRequests",
  contacts: "Contacts",
  footers: "Footers",
  users: "User",
} as const

function responseMessage<T>(response: BaseResponse<T>) {
  return response.message ?? response.errors?.filter(Boolean).join(", ") ?? "API istegi basarisiz."
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const payload = (await response.json().catch(() => null)) as BaseResponse<T> | null

  if (!response.ok || !payload?.succeeded) {
    throw new Error(payload ? responseMessage(payload) : `API hatasi: ${response.status}`)
  }

  return payload.data as T
}

async function upload<T>(path: string, formData: FormData, token: string) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const payload = (await response.json().catch(() => null)) as BaseResponse<T> | null

  if (!response.ok || !payload?.succeeded) {
    throw new Error(payload ? responseMessage(payload) : `API hatasi: ${response.status}`)
  }

  return payload.data as T
}

async function list<T>(controller: string) {
  return request<T[]>(`/api/${controller}/list`)
}

async function create<T>(controller: string, body: unknown, token: string) {
  return request<T>(
    `/api/${controller}/create`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    token
  )
}

async function update<T>(controller: string, body: unknown, token: string) {
  return request<T>(
    `/api/${controller}/update`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
    token
  )
}

async function remove(controller: string, id: string, token: string) {
  await request<Entity>(
    `/api/${controller}/remove`,
    {
      method: "DELETE",
      body: JSON.stringify({ id }),
    },
    token
  )
}

function valuesMatch(left: unknown, right: unknown) {
  if (typeof left === "number" || typeof right === "number") {
    return Number(left) === Number(right)
  }

  return left === right
}

function bodyMatchesCurrent<T extends Entity>(
  current: T | undefined,
  body: Record<string, unknown>
) {
  if (!current) {
    return false
  }

  return Object.entries(body).every(([key, value]) => {
    const currentValue = current[key as keyof T]
    return valuesMatch(currentValue, value)
  })
}

async function upsertOne<T extends Entity>(
  controller: string,
  current: T | undefined,
  body: Record<string, unknown>,
  token: string
) {
  if (current) {
    if (bodyMatchesCurrent(current, body)) {
      return current
    }

    return update<T>(controller, { id: current.id, ...body }, token)
  }

  return create<T>(controller, body, token)
}

async function syncCollection<T extends Entity, TBody extends Record<string, unknown>>(
  controller: string,
  currentItems: T[],
  bodies: TBody[],
  token: string
) {
  const result: T[] = []

  for (const [index, body] of bodies.entries()) {
    result.push(await upsertOne<T>(controller, currentItems[index], body, token))
  }

  for (const item of currentItems.slice(bodies.length)) {
    await remove(controller, item.id, token)
  }

  return result
}

function currencyFromText(value: string) {
  return value.includes("$") ? "$" : "€"
}

function numberFromText(value: string) {
  const normalized = value.replace(",", ".")
  const match = normalized.match(/\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : 0
}

function serviceIcon(value: string): ServiceIcon {
  return value === "heart" || value === "timer" || value === "leaf" || value === "sparkles"
    ? value
    : "sparkles"
}

function timeLabel(time: ServiceTimeDto) {
  return `${time.durationInMinutes} Min · ${time.price}${time.currency}`
}

function parseTimeLabel(label: string) {
  return {
    durationInMinutes: Math.trunc(numberFromText(label)),
    price: numberFromText(label.split("·").at(1) ?? label),
    currency: currencyFromText(label),
  }
}

function contentFromSnapshot(snapshot: ApiSnapshot): SiteContent {
  const hero = snapshot.heroes[0]
  const navigation = snapshot.navigationMenus[0]
  const practice = snapshot.practices[0]
  const about = snapshot.abouts[0]
  const appointment = snapshot.appointments[0]
  const voucher = snapshot.vouchers[0]
  const contact = snapshot.contacts[0]
  const footer = snapshot.footers[0]

  if (!hero || !navigation || !practice || !about || !appointment || !voucher || !contact || !footer) {
    throw new Error("API content is incomplete. Please ensure the seed process has run.")
  }

  return {
    nav: {
      services: navigation.serviceName,
      about: navigation.about,
      practice: navigation.practice,
      appointment: navigation.appointment,
      contact: navigation.contact,
      call: navigation.call,
    },
    hero,
    benefits: snapshot.benefits.map((benefit) => benefit.benefitName),
    services: snapshot.services.map((service) => {
      const times = snapshot.serviceTimes
        .filter((time) => time.serviceId === service.id)
        .map(timeLabel)

      return {
        title: service.title,
        price: `ab ${service.price}${service.currency}`,
        text: service.description,
        times,
        icon: serviceIcon(service.icon),
      }
    }),
    practice: {
      eyebrow: practice.eyebrow,
      title: practice.title,
      cards: snapshot.practiceCards
        .filter((card) => card.practiceId === practice.id)
        .map((card) => ({ title: card.title, text: card.description })),
    },
    about: {
      eyebrow: about.eyebrow,
      title: about.title,
      body: about.description,
      imageUrl: about.imageUrl,
      stats: snapshot.aboutStats
        .filter((stat) => stat.aboutId === about.id)
        .map((stat) => ({ value: stat.statValue, text: stat.description })),
    },
    appointment: {
      eyebrow: appointment.eyebrow,
      title: appointment.title,
      body: appointment.description,
      submitLabel: appointment.buttonText,
    },
    vouchers: {
      title: voucher.title,
      body: voucher.description,
      values: snapshot.voucherPrices
        .filter((price) => price.voucherId === voucher.id)
        .map((price) => `${price.price}${price.currency}`),
    },
    contact,
    footer,
  }
}

async function loadSnapshot(): Promise<ApiSnapshot> {
  const [
    heroes,
    navigationMenus,
    benefits,
    services,
    serviceTimes,
    practices,
    practiceCards,
    abouts,
    aboutStats,
    appointments,
    vouchers,
    voucherPrices,
    contacts,
    footers,
  ] = await Promise.all([
    list<HeroDto>(endpoints.heroes),
    list<NavigationMenuDto>(endpoints.navigationMenus),
    list<BenefitDto>(endpoints.benefits),
    list<ServiceDto>(endpoints.services),
    list<ServiceTimeDto>(endpoints.serviceTimes),
    list<PracticeDto>(endpoints.practices),
    list<PracticeCardDto>(endpoints.practiceCards),
    list<AboutDto>(endpoints.abouts),
    list<AboutStatDto>(endpoints.aboutStats),
    list<AppointmentDto>(endpoints.appointments),
    list<VoucherDto>(endpoints.vouchers),
    list<VoucherPriceDto>(endpoints.voucherPrices),
    list<ContactDto>(endpoints.contacts),
    list<FooterDto>(endpoints.footers),
  ])

  return {
    heroes,
    navigationMenus,
    benefits,
    services,
    serviceTimes,
    practices,
    practiceCards,
    abouts,
    aboutStats,
    appointments,
    vouchers,
    voucherPrices,
    contacts,
    footers,
  }
}

export async function loadSiteContentFromApi() {
  const snapshot = await loadSnapshot()
  return contentFromSnapshot(snapshot)
}

export async function saveSiteContentToApi(content: SiteContent, token: string) {
  const snapshot = await loadSnapshot()

  const hero = await upsertOne<HeroDto>(
    endpoints.heroes,
    snapshot.heroes[0],
    content.hero,
    token
  )

  const navigationMenu = await upsertOne<NavigationMenuDto>(
    endpoints.navigationMenus,
    snapshot.navigationMenus[0],
    {
      serviceName: content.nav.services,
      about: content.nav.about,
      practice: content.nav.practice,
      appointment: content.nav.appointment,
      contact: content.nav.contact,
      call: content.nav.call,
    },
    token
  )

  const benefits = await syncCollection<BenefitDto, { benefitName: string }>(
    endpoints.benefits,
    snapshot.benefits,
    content.benefits.map((benefitName) => ({ benefitName })),
    token
  )

  const services = await syncCollection<ServiceDto, Record<string, unknown>>(
    endpoints.services,
    snapshot.services,
    content.services.map((service) => ({
      title: service.title,
      price: numberFromText(service.price),
      currency: currencyFromText(service.price),
      description: service.text,
      icon: service.icon,
    })),
    token
  )

  const serviceTimeBodies = content.services.flatMap((service, serviceIndex) =>
    service.times.map((time) => ({
      serviceId: services[serviceIndex]?.id ?? snapshot.services[serviceIndex]?.id,
      ...parseTimeLabel(time),
    }))
  )

  const serviceTimes = await syncCollection<ServiceTimeDto, Record<string, unknown>>(
    endpoints.serviceTimes,
    snapshot.serviceTimes,
    serviceTimeBodies.filter((time) => typeof time.serviceId === "string"),
    token
  )

  const practice = await upsertOne<PracticeDto>(
    endpoints.practices,
    snapshot.practices[0],
    {
      eyebrow: content.practice.eyebrow,
      title: content.practice.title,
    },
    token
  )

  const practiceCards = await syncCollection<PracticeCardDto, Record<string, unknown>>(
    endpoints.practiceCards,
    snapshot.practiceCards,
    content.practice.cards.map((card) => ({
      practiceId: practice.id,
      title: card.title,
      description: card.text,
    })),
    token
  )

  const about = await upsertOne<AboutDto>(
    endpoints.abouts,
    snapshot.abouts[0],
    {
      eyebrow: content.about.eyebrow,
      title: content.about.title,
      description: content.about.body,
      imageUrl: content.about.imageUrl,
    },
    token
  )

  const aboutStats = await syncCollection<AboutStatDto, Record<string, unknown>>(
    endpoints.aboutStats,
    snapshot.aboutStats,
    content.about.stats.map((stat) => ({
      aboutId: about.id,
      statValue: stat.value,
      description: stat.text,
    })),
    token
  )

  const appointment = await upsertOne<AppointmentDto>(
    endpoints.appointments,
    snapshot.appointments[0],
    {
      eyebrow: content.appointment.eyebrow,
      title: content.appointment.title,
      description: content.appointment.body,
      buttonText: content.appointment.submitLabel,
    },
    token
  )

  const voucher = await upsertOne<VoucherDto>(
    endpoints.vouchers,
    snapshot.vouchers[0],
    {
      title: content.vouchers.title,
      description: content.vouchers.body,
    },
    token
  )

  const voucherPrices = await syncCollection<VoucherPriceDto, Record<string, unknown>>(
    endpoints.voucherPrices,
    snapshot.voucherPrices,
    content.vouchers.values.map((value) => ({
      voucherId: voucher.id,
      price: numberFromText(value),
      currency: currencyFromText(value),
    })),
    token
  )

  const contact = await upsertOne<ContactDto>(
    endpoints.contacts,
    snapshot.contacts[0],
    content.contact,
    token
  )

  const footer = await upsertOne<FooterDto>(
    endpoints.footers,
    snapshot.footers[0],
    content.footer,
    token
  )

  return contentFromSnapshot({
    heroes: [hero],
    navigationMenus: [navigationMenu],
    benefits,
    services,
    serviceTimes,
    practices: [practice],
    practiceCards,
    abouts: [about],
    aboutStats,
    appointments: [appointment],
    vouchers: [voucher],
    voucherPrices,
    contacts: [contact],
    footers: [footer],
  })
}

export async function saveSiteContentModuleToApi(
  content: SiteContent,
  token: string,
  module: SiteContentModule
) {
  const snapshot = await loadSnapshot()
  const nextSnapshot = { ...snapshot }

  if (module === "hero") {
    const hero = await upsertOne<HeroDto>(
      endpoints.heroes,
      snapshot.heroes[0],
      content.hero,
      token
    )

    const benefits = await syncCollection<BenefitDto, { benefitName: string }>(
      endpoints.benefits,
      snapshot.benefits,
      content.benefits.map((benefitName) => ({ benefitName })),
      token
    )

    nextSnapshot.heroes = [hero]
    nextSnapshot.benefits = benefits
  }

  if (module === "services") {
    const services = await syncCollection<ServiceDto, Record<string, unknown>>(
      endpoints.services,
      snapshot.services,
      content.services.map((service) => ({
        title: service.title,
        price: numberFromText(service.price),
        currency: currencyFromText(service.price),
        description: service.text,
        icon: service.icon,
      })),
      token
    )

    const serviceTimeBodies = content.services.flatMap((service, serviceIndex) =>
      service.times.map((time) => ({
        serviceId: services[serviceIndex]?.id ?? snapshot.services[serviceIndex]?.id,
        ...parseTimeLabel(time),
      }))
    )

    const serviceTimes = await syncCollection<ServiceTimeDto, Record<string, unknown>>(
      endpoints.serviceTimes,
      snapshot.serviceTimes,
      serviceTimeBodies.filter((time) => typeof time.serviceId === "string"),
      token
    )

    nextSnapshot.services = services
    nextSnapshot.serviceTimes = serviceTimes
  }

  if (module === "practice") {
    const practice = await upsertOne<PracticeDto>(
      endpoints.practices,
      snapshot.practices[0],
      {
        eyebrow: content.practice.eyebrow,
        title: content.practice.title,
      },
      token
    )

    const practiceCards = await syncCollection<PracticeCardDto, Record<string, unknown>>(
      endpoints.practiceCards,
      snapshot.practiceCards,
      content.practice.cards.map((card) => ({
        practiceId: practice.id,
        title: card.title,
        description: card.text,
      })),
      token
    )

    nextSnapshot.practices = [practice]
    nextSnapshot.practiceCards = practiceCards
  }

  if (module === "about") {
    const about = await upsertOne<AboutDto>(
      endpoints.abouts,
      snapshot.abouts[0],
      {
        eyebrow: content.about.eyebrow,
        title: content.about.title,
        description: content.about.body,
        imageUrl: content.about.imageUrl,
      },
      token
    )

    const aboutStats = await syncCollection<AboutStatDto, Record<string, unknown>>(
      endpoints.aboutStats,
      snapshot.aboutStats,
      content.about.stats.map((stat) => ({
        aboutId: about.id,
        statValue: stat.value,
        description: stat.text,
      })),
      token
    )

    nextSnapshot.abouts = [about]
    nextSnapshot.aboutStats = aboutStats
  }

  if (module === "appointment") {
    const appointment = await upsertOne<AppointmentDto>(
      endpoints.appointments,
      snapshot.appointments[0],
      {
        eyebrow: content.appointment.eyebrow,
        title: content.appointment.title,
        description: content.appointment.body,
        buttonText: content.appointment.submitLabel,
      },
      token
    )

    const voucher = await upsertOne<VoucherDto>(
      endpoints.vouchers,
      snapshot.vouchers[0],
      {
        title: content.vouchers.title,
        description: content.vouchers.body,
      },
      token
    )

    const voucherPrices = await syncCollection<VoucherPriceDto, Record<string, unknown>>(
      endpoints.voucherPrices,
      snapshot.voucherPrices,
      content.vouchers.values.map((value) => ({
        voucherId: voucher.id,
        price: numberFromText(value),
        currency: currencyFromText(value),
      })),
      token
    )

    nextSnapshot.appointments = [appointment]
    nextSnapshot.vouchers = [voucher]
    nextSnapshot.voucherPrices = voucherPrices
  }

  if (module === "contact") {
    const contact = await upsertOne<ContactDto>(
      endpoints.contacts,
      snapshot.contacts[0],
      content.contact,
      token
    )

    const footer = await upsertOne<FooterDto>(
      endpoints.footers,
      snapshot.footers[0],
      content.footer,
      token
    )

    nextSnapshot.contacts = [contact]
    nextSnapshot.footers = [footer]
  }

  return contentFromSnapshot(nextSnapshot)
}

export async function uploadHeroImage(file: File, token: string) {
  const formData = new FormData()
  formData.append("file", file)

  return upload<string>(`/api/${endpoints.heroes}/upload-image`, formData, token)
}

export async function uploadAboutImage(file: File, token: string) {
  const formData = new FormData()
  formData.append("file", file)

  return upload<string>(`/api/${endpoints.abouts}/upload-image`, formData, token)
}

export async function createValueVoucherRequest(body: {
  value: string
  customerName: string
  phone: string
}) {
  return request<ValueVoucherRequestDto>(`/api/${endpoints.gutscheinRequests}/value`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function createMassageVoucherRequest(body: {
  serviceTitle: string
  duration: string
  customerName: string
  phone: string
}) {
  return request<MassageVoucherRequestDto>(`/api/${endpoints.gutscheinRequests}/massage`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function loadGutscheinRequests(token: string) {
  const [valueRequests, massageRequests] = await Promise.all([
    request<ValueVoucherRequestDto[]>(
      `/api/${endpoints.gutscheinRequests}/value/list`,
      {},
      token
    ),
    request<MassageVoucherRequestDto[]>(
      `/api/${endpoints.gutscheinRequests}/massage/list`,
      {},
      token
    ),
  ])

  return { valueRequests, massageRequests }
}

export async function loginAdmin(email: string, password: string) {
  return request<AdminSession>(`/api/${endpoints.users}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function logoutAdmin(session: AdminSession) {
  await request(
    `/api/${endpoints.users}/logout`,
    {
      method: "POST",
      body: JSON.stringify({ userId: session.userId }),
    },
    session.token
  ).catch(() => undefined)

}
