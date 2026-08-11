export type ServiceIcon = "heart" | "timer" | "leaf" | "sparkles"

export type SiteContent = {
  nav: {
    services: string
    about: string
    practice: string
    appointment: string
    contact: string
    call: string
  }
  hero: {
    eyebrow: string
    title: string
    body: string
    primaryCta: string
    secondaryCta: string
    contactLabel: string
    contactBody: string
    imageUrl?: string | null
  }
  benefits: string[]
  services: Array<{
    title: string
    price: string
    text: string
    times: string[]
    icon: ServiceIcon
  }>
  practice: {
    eyebrow: string
    title: string
    cards: Array<{
      title: string
      text: string
    }>
  }
  about: {
    eyebrow: string
    title: string
    body: string
    stats: Array<{
      value: string
      text: string
    }>
  }
  appointment: {
    eyebrow: string
    title: string
    body: string
    submitLabel: string
  }
  vouchers: {
    title: string
    body: string
    values: string[]
  }
  contact: {
    title: string
    name: string
    address: string
    phone: string
    email: string
    mapUrl: string
    mapLabel: string
  }
  footer: {
    copyright: string
    imprint: string
  }
}
