const allowedRichTextTags = new Set([
  "A",
  "B",
  "BR",
  "DIV",
  "EM",
  "I",
  "LI",
  "OL",
  "P",
  "SPAN",
  "STRONG",
  "U",
  "UL",
])

export function sanitizeRichText(value: string) {
  if (!value.includes("<")) {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("")
  }

  const template = document.createElement("template")
  template.innerHTML = value

  const cleanNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent ?? "")
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null
    }

    const element = node as HTMLElement
    const tagName = element.tagName

    if (!allowedRichTextTags.has(tagName)) {
      const fragment = document.createDocumentFragment()
      element.childNodes.forEach((child) => {
        const cleanChild = cleanNode(child)
        if (cleanChild) {
          fragment.append(cleanChild)
        }
      })
      return fragment
    }

    const cleanElement = document.createElement(tagName.toLowerCase())

    if (tagName === "A") {
      const href = element.getAttribute("href") ?? ""
      if (/^(https?:|mailto:|tel:)/i.test(href)) {
        cleanElement.setAttribute("href", href)
        cleanElement.setAttribute("target", "_blank")
        cleanElement.setAttribute("rel", "noreferrer")
      }
    }

    element.childNodes.forEach((child) => {
      const cleanChild = cleanNode(child)
      if (cleanChild) {
        cleanElement.append(cleanChild)
      }
    })

    return cleanElement
  }

  const fragment = document.createDocumentFragment()
  template.content.childNodes.forEach((child) => {
    const cleanChild = cleanNode(child)
    if (cleanChild) {
      fragment.append(cleanChild)
    }
  })

  const wrapper = document.createElement("div")
  wrapper.append(fragment)
  return wrapper.innerHTML
}

export function RichContent({ value, className }: { value: string; className?: string }) {
  return (
    <div
      className={`rich-content ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }}
    />
  )
}
