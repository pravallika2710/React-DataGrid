export function stopPropagation(event) {
  event.stopPropagation()
}

export function scrollIntoView(element) {
  element?.scrollIntoView({ inline: "nearest", block: "nearest" })
}
