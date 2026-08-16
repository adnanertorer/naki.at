export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`
}
