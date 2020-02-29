const modalOverlay = document.querySelector('.modal-overlay')
const cards = document.querySelectorAll('.card')

for (const card of cards) {
  card.addEventListener("click", () => {
    const videoId = card.getAttribute("id")
    window.location.href = `video?id=${videoId}`
  })
}

document.querySelector('.close-modal').addEventListener("click", () => {
  modalOverlay.classList.remove("active")
  modalOverlay.querySelector("iframe").src = ""
})
