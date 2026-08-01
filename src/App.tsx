import {
  ArrowRight,
  Check,
  Gift,
  HeartPulse,
  Leaf,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  Timer,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import nakiLogo from "@/assets/images/logo_naki.svg"
import nakiPortrait from "@/assets/images/naki.jpg"

const services = [
  {
    title: "Ganzkörper-Massage",
    price: "ab 70€",
    text: "Klassische Massage für tiefe Entspannung, bessere Beweglichkeit und gezielte Linderung von Verspannungen.",
    times: ["50 Min · 70€", "80 Min · 100€", "10+1 · ab 700€"],
    icon: HeartPulse,
  },
  {
    title: "Teilkörper-Massage",
    price: "ab 50€",
    text: "Fokussierte Behandlung für Rücken, Beine oder Arme, wenn einzelne Bereiche besondere Aufmerksamkeit brauchen.",
    times: ["25 Min · 50€", "50 Min · 70€", "10+1 · ab 500€"],
    icon: Timer,
  },
  {
    title: "Aromaöl-Massage",
    price: "ab 70€",
    text: "Sanfte Ganzkörpermassage mit warmen Aromaölen für Regeneration, Ruhe und ein weiches Körpergefühl.",
    times: ["60 Min · 70€", "10+1 · 700€"],
    icon: Leaf,
  },
  {
    title: "Fuss-Massage",
    price: "ab 50€",
    text: "Entspannende Fußmassage mit wohltuender Stimulation der Reflexzonen und spürbarer Leichtigkeit.",
    times: ["25 Min · 50€", "50 Min · 70€", "10+1 · ab 500€"],
    icon: Sparkles,
  },
]

const benefits = [
  "Ruhige Praxis in Pramet",
  "Persönliche Terminabstimmung",
  "Wert- und Massagegutscheine",
  "10+1 Pakete für regelmäßige Behandlungen",
]

const voucherValues = ["25€", "50€", "75€", "100€", "200€", "300€"]

export function App() {
  return (
    <main className="min-h-svh bg-[#f8f5ef] text-[#1c2621]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/35 bg-[#f8f5ef]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center font-semibold">
            <span className="flex h-14 w-44 items-center sm:w-56 lg:w-64 mt-3">
              <img
                src={nakiLogo}
                alt="Naki Öztürk Massagezentrum Pramet"
                className="max-h-24 w-full object-contain object-left"
              />
            </span>
            <span className="sr-only">Naki Öztürk Massagezentrum Pramet</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#52625a] md:flex">
            <a href="#leistungen">Leistungen</a>
            <a href="#naki">Über Naki</a>
            <a href="#praxis">Praxis</a>
            <a href="#termin">Termin</a>
            <a href="#kontakt">Kontakt</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="tel:+436607727575"
              className="hidden h-9 items-center justify-center gap-2 rounded-md bg-[#28594a] px-3 text-sm font-medium text-white transition hover:bg-[#214a3e] hover:text-white md:inline-flex"
            >
              <Phone className="size-4" />
              Anrufen
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
              Massage in Grosspiesenham, 4925 Pramet
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-[#18221e] sm:text-6xl lg:text-7xl">
              Deine Wohlfühl-Massage in Pramet
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#52625a]">
              Entspannen, regenerieren und wieder leichter bewegen: Naki Öztürk
              begleitet dich mit klassischer Massage, Aromaöl-Massage und
              fokussierten Behandlungen für deinen Alltag.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#termin"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#28594a] px-5 text-sm font-medium text-white transition hover:bg-[#214a3e] hover:text-white"
              >
                Termin vereinbaren
                <ArrowRight className="size-4" />
              </a>
              <a
                href="#leistungen"
                className="inline-flex h-11 items-center justify-center rounded-md border border-[#cfc4b6] bg-white/70 px-5 text-sm font-medium text-[#28594a] transition hover:bg-white hover:text-[#214a3e]"
              >
                Leistungen ansehen
              </a>
            </div>
            <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
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
              src={nakiPortrait}
              alt="Ruhiger Massageraum mit Behandlungsliege und Tageslicht"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10251d]/42 via-transparent to-transparent" />
            <div className="flower-field" aria-hidden="true">
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 rounded-md bg-white/86 p-5 shadow-xl backdrop-blur-md sm:left-auto sm:max-w-sm">
              <p className="text-sm font-medium text-[#7a4b35]">Direkt erreichbar</p>
              <p className="mt-2 text-2xl font-semibold text-[#18221e]">0660 77 27 575</p>
              <p className="mt-2 text-sm leading-6 text-[#52625a]">
                Für Termine, Gutscheine und kurze Rückfragen. Bei Formularanfragen
                erfolgt ein Rückruf.
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
                Leistungen
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
            {services.map((service) => {
              const Icon = service.icon

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
              Die Praxis
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#18221e] sm:text-5xl">
              Berührung, die den Körper wieder in Ruhe bringt
            </h2>
          </div>
          <div className="grid gap-5 text-base leading-8 text-[#52625a] md:grid-cols-2">
            <div className="rounded-lg bg-white p-6">
              <h3 className="text-xl font-semibold text-[#18221e]">Wirkung</h3>
              <p className="mt-3">
                Massage kann Durchblutung und Zellstoffwechsel anregen, Muskulatur
                lockern und vorhandenen Stress reduzieren. Viele Gäste nutzen sie
                zur Regeneration, bei Verspannungen oder als bewusste Pause.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6">
              <h3 className="text-xl font-semibold text-[#18221e]">Hinweis</h3>
              <p className="mt-3">
                Bei akuten Entzündungen, Hauterkrankungen, traumatischen
                Verletzungen oder während der Schwangerschaft bitte vorab ärztlich
                abklären, welche Behandlung geeignet ist.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="naki" className="bg-[#f8f5ef] py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[#e2d8c9] bg-[#f1eadc] shadow-[0_24px_70px_rgba(32,45,38,0.12)] sm:min-h-[440px] lg:min-h-[560px]">
            <img
              src={nakiPortrait}
              alt="Naki Öztürk, Masseur in Pramet"
              className="absolute inset-0 size-full object-cover object-center"
            />
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#f8f5ef]/44 to-transparent" />
            <div className="flower-field" aria-hidden="true">
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
              <span className="flower-bloom" />
            </div>
          </div>
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9b6040]">
              Über Naki
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#18221e] sm:text-5xl">
              Persönlich, ruhig und mit Aufmerksamkeit für den Körper
            </h2>
            <p className="mt-5 text-base leading-8 text-[#52625a]">
              Bei Naki Öztürk steht nicht die schnelle Behandlung im Mittelpunkt,
              sondern ein achtsamer Ablauf, der zu dir und deinem Körper passt.
              Jede Massage wird mit Ruhe, Erfahrung und einem klaren Blick auf
              deine aktuellen Bedürfnisse abgestimmt.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-5">
                <p className="text-3xl font-semibold text-[#28594a]">4</p>
                <p className="mt-2 text-sm leading-6 text-[#5b6b63]">
                  Massagearten für Entspannung, Regeneration und gezielte
                  Lockerung.
                </p>
              </div>
              <div className="rounded-lg bg-white p-5">
                <p className="text-3xl font-semibold text-[#28594a]">10+1</p>
                <p className="mt-2 text-sm leading-6 text-[#5b6b63]">
                  Paketoptionen für alle, die regelmäßige Behandlung schätzen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="termin" className="bg-[#1e2b25] py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6a276]">
              Termin vereinbaren
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Schreib kurz, was du brauchst. Naki ruft zurück.
            </h2>
            <p className="mt-5 max-w-md leading-8 text-white/72">
              Die Anfrage ist unverbindlich. Für schnelle Abstimmung erreichst du
              die Praxis auch direkt telefonisch.
            </p>
            <a
              href="tel:+436607727575"
              className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-medium text-[#1e2b25] transition hover:bg-[#f4efe6] hover:text-[#1e2b25]"
            >
              <Phone className="size-4" />
              0660 77 27 575
            </a>
          </div>
          <form className="grid gap-4 rounded-lg bg-white p-5 text-[#1c2621] shadow-2xl sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Massageart
                <select className="h-12 rounded-md border border-[#d9d1c5] bg-[#fbfaf7] px-3">
                  <option>Bitte auswählen</option>
                  {services.map((service) => (
                    <option key={service.title}>{service.title}</option>
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
              Absenden
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
              Gutschein kaufen
            </h2>
            <p className="mt-4 leading-8 text-[#5b6b63]">
              Wertgutscheine und Massagegutscheine können täglich von 18:00 bis
              19:00 Uhr in Grosspiesenham 49, 4925 Pramet abgeholt werden.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {voucherValues.map((value) => (
                <span key={value} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#28594a]">
                  {value}
                </span>
              ))}
            </div>
          </div>
          <div id="kontakt" className="rounded-lg bg-[#eef3ec] p-7">
            <MapPin className="size-10 text-[#28594a]" />
            <h2 className="mt-5 text-4xl font-semibold text-[#18221e]">
              Kontakt & Anfahrt
            </h2>
            <div className="mt-5 space-y-3 text-lg text-[#43534b]">
              <p className="font-semibold text-[#18221e]">Naki Öztürk</p>
              <p>Grosspiesenham 49, 4925 Pramet</p>
              <p>
                <a href="tel:+436607727575">0660 77 27 575</a>
              </p>
              <p>
                <a href="mailto:office@naki.at">office@naki.at</a>
              </p>
            </div>
            <a
              href="https://www.google.at/maps/search/Grosspiesenham+49+4925+Pramet"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex h-8 items-center justify-center gap-2 rounded-md bg-[#28594a] px-3 text-sm font-medium text-white transition hover:bg-[#214a3e] hover:text-white"
            >
              Anfahrt öffnen
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e7dfd4] bg-[#f8f5ef] px-5 py-8 text-sm text-[#66746d] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Naki Öztürk · Massage Pramet</p>
          <p>Mitglied der WKO · Impressum: Grosspiesenham 49, 4925 Pramet</p>
        </div>
      </footer>
    </main>
  )
}

export default App
