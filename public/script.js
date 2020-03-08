const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")

for (const item of menuItems) {
  if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active")
  }
}

//Mensagem de confirmação de deleção
const formDelete = document.querySelector("#form-delete")
if (formDelete) {
  formDelete.addEventListener("submit", (event) => {
    const confirmation = confirm("Deseja deletar?")

    if (!confirmation)
      event.preventDefault()
  })
}

//Paginação
const paginate = (selectedPage, totalPages) => {
  let pages = [],
    oldPage

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages

    if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...")
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1)
      }

      pages.push(currentPage)
      oldPage = currentPage
    }
  }

  return pages
}

const createPagination = (pagination) => {
  const filter = pagination.dataset.filter
  const page = +pagination.dataset.page
  const total = +pagination.dataset.total
  const pages = paginate(page, total)

  let elements = ""

  for (const currPage of pages) {
    if (String(page).includes("...")) {
      elements += `<span">${currPage}</span>`
    } else {
      if (filter)
        elements += `<a href="?page=${currPage}&filter=${filter}">${currPage}</a>`
      else
        elements += `<a href="?page=${currPage}">${currPage}</a>`
    }
  }

  pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination)
  createPagination(pagination)

