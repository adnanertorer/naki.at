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

export const siteContentVersion = 1

export const defaultSiteContent: SiteContent = {
  nav: {
    services: "Leistungen",
    about: "Über Naki",
    practice: "Praxis",
    appointment: "Termin",
    contact: "Kontakt",
    call: "Anrufen",
  },
  hero: {
    eyebrow: "Massage in Grosspiesenham, 4925 Pramet",
    title: "Deine Wohlfühl-Massage in Pramet",
    body: "Entspannen, regenerieren und wieder leichter bewegen: Naki Öztürk begleitet dich mit klassischer Massage, Aromaöl-Massage und fokussierten Behandlungen für deinen Alltag.",
    primaryCta: "Termin vereinbaren",
    secondaryCta: "Leistungen ansehen",
    contactLabel: "Direkt erreichbar",
    contactBody:
      "Für Termine, Gutscheine und kurze Rückfragen. Bei Formularanfragen erfolgt ein Rückruf.",
  },
  benefits: [
    "Ruhige Praxis in Pramet",
    "Persönliche Terminabstimmung",
    "Wert- und Massagegutscheine",
    "10+1 Pakete für regelmäßige Behandlungen",
  ],
  services: [
    {
      title: "Ganzkörper-Massage",
      price: "ab 70€",
      text: "Klassische Massage für tiefe Entspannung, bessere Beweglichkeit und gezielte Linderung von Verspannungen.",
      times: ["50 Min · 70€", "80 Min · 100€", "10+1 · ab 700€"],
      icon: "heart",
    },
    {
      title: "Teilkörper-Massage",
      price: "ab 50€",
      text: "Fokussierte Behandlung für Rücken, Beine oder Arme, wenn einzelne Bereiche besondere Aufmerksamkeit brauchen.",
      times: ["25 Min · 50€", "50 Min · 70€", "10+1 · ab 500€"],
      icon: "timer",
    },
    {
      title: "Aromaöl-Massage",
      price: "ab 70€",
      text: "Sanfte Ganzkörpermassage mit warmen Aromaölen für Regeneration, Ruhe und ein weiches Körpergefühl.",
      times: ["60 Min · 70€", "10+1 · 700€"],
      icon: "leaf",
    },
    {
      title: "Fuss-Massage",
      price: "ab 50€",
      text: "Entspannende Fußmassage mit wohltuender Stimulation der Reflexzonen und spürbarer Leichtigkeit.",
      times: ["25 Min · 50€", "50 Min · 70€", "10+1 · ab 500€"],
      icon: "sparkles",
    },
  ],
  practice: {
    eyebrow: "Die Praxis",
    title: "Berührung, die den Körper wieder in Ruhe bringt",
    cards: [
      {
        title: "Wirkung",
        text: "Massage kann Durchblutung und Zellstoffwechsel anregen, Muskulatur lockern und vorhandenen Stress reduzieren. Viele Gäste nutzen sie zur Regeneration, bei Verspannungen oder als bewusste Pause.",
      },
      {
        title: "Hinweis",
        text: "Bei akuten Entzündungen, Hauterkrankungen, traumatischen Verletzungen oder während der Schwangerschaft bitte vorab ärztlich abklären, welche Behandlung geeignet ist.",
      },
    ],
  },
  about: {
    eyebrow: "Über Naki",
    title: "Persönlich, ruhig und mit Aufmerksamkeit für den Körper",
    body: "Bei Naki Öztürk steht nicht die schnelle Behandlung im Mittelpunkt, sondern ein achtsamer Ablauf, der zu dir und deinem Körper passt. Jede Massage wird mit Ruhe, Erfahrung und einem klaren Blick auf deine aktuellen Bedürfnisse abgestimmt.",
    stats: [
      {
        value: "4",
        text: "Massagearten für Entspannung, Regeneration und gezielte Lockerung.",
      },
      {
        value: "10+1",
        text: "Paketoptionen für alle, die regelmäßige Behandlung schätzen.",
      },
    ],
  },
  appointment: {
    eyebrow: "Termin vereinbaren",
    title: "Schreib kurz, was du brauchst. Naki ruft zurück.",
    body: "Die Anfrage ist unverbindlich. Für schnelle Abstimmung erreichst du die Praxis auch direkt telefonisch.",
    submitLabel: "Absenden",
  },
  vouchers: {
    title: "Gutschein kaufen",
    body: "Wertgutscheine und Massagegutscheine können täglich von 18:00 bis 19:00 Uhr in Grosspiesenham 49, 4925 Pramet abgeholt werden.",
    values: ["25€", "50€", "75€", "100€", "200€", "300€"],
  },
  contact: {
    title: "Kontakt & Anfahrt",
    name: "Naki Öztürk",
    address: "Grosspiesenham 49, 4925 Pramet",
    phone: "0660 77 27 575",
    email: "office@naki.at",
    mapUrl: "https://www.google.at/maps/search/Grosspiesenham+49+4925+Pramet",
    mapLabel: "Anfahrt öffnen",
  },
  footer: {
    copyright: "© 2026 Naki Öztürk · Massage Pramet",
    imprint: "Mitglied der WKO · Impressum: Grosspiesenham 49, 4925 Pramet",
  },
}
