// * Основные переменные
const commentButton = document.getElementById('comment-button')
const commentsList = document.getElementById('comments-list')
const commentNameInput = document.getElementById('comment-name-input')
const commentTextInput = document.getElementById('comment-text-input')
const commentUrl = "https://wedev-api.sky.pro/api/v1/pavel-karmanov/comments"

// * Массив комментов
let comments = []

// ! API
// * API GET
function readCommentFromServer() {
  fetch(commentUrl)
    .then((res) => res.json())
    .then((data) => {
      const appComments = data.comments.map((comment) => {

        return {
          name: comment.author.name,
          date: fnDate(new Date(comment.date)),
          text: comment.text,
          isLiked: comment.isLiked,
          likeCount: comment.likes,
        }
      })

      comments = appComments
      renderComments()
    })
}

// * API POST
function sendCommentToServer() {
  commentButton.disabled = true

  fetch(commentUrl, {
    method: "POST",
    body: JSON.stringify({
      name: commentNameInput.value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('""', '&quot;'),
      text: commentTextInput.value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('""', '&quot;'),
    }),
  })
    .then((res) => res.json())
    .then(() => {
      readCommentFromServer()
      return 'ok'
    })
    .catch((error) => console.log(error))
    .then((result) => {
      commentButton.disabled = false
      commentButton.textContent = 'Написать'

      if (result === 'ok') {
        commentTextInput.value = ''
      } 
      else {
        renderComments()
      }
    })
}

// * Функция формата даты
function fnDate(commentDate) {
  const day = String(commentDate.getDate()).padStart(2, '0')
  const month = String(commentDate.getMonth() + 1).padStart(2, '0')
  const year = commentDate.getFullYear().toString().slice(-2)
  const hours = commentDate.getHours().toString().padStart(2, '0')
  const minutes = commentDate.getMinutes().toString().padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}

// * Функция рендера комментов в HTML
function renderComments() {
  // * Создание нового массива с помощью map()
  commentsList.innerHTML = comments.map((comment, index) => {
    // * Узнаём, есть ли лайк в комменте
    const classButton = comment.isLiked
      ? '-active-like'
      : ''

    return `<li class="comment">
    <div class="comment-header">
      <div>${comment.name}</div>
      <div>${comment.date}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text" data-index="${index}">
      ${comment.text}
      </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter" data-index="${index}">${comment.likeCount}</span>
        <button class="like-button ${classButton}" data-index="${index}"></button>
      </div>
    </div>
  </li>`
  }).join('') // * С помощью join() делаем строку

  // * Коментировать выбранный коментарий
  const commentTexts = document.querySelectorAll('.comment-text')
  commentTexts.forEach(commentText => {
    commentText.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index')
      commentTextInput.value = `> ${comments[index].text}: ${comments[index].name}`
      commentTextInput.focus()
    })
  })

  // * Функция лайка
  initEventListener()
}

// * Функция лайка
function initEventListener() {
  // * Переменная всех кнопок лайков
  const likeButtonElements = document.querySelectorAll('.like-button')

  // * Цикл. При клике на кнопку лайка, добавляется или убирается лайк
  for (const likeButtonElement of likeButtonElements) {
    likeButtonElement.addEventListener('click', () => {
      const index = likeButtonElement.dataset.index
      if (comments[index].isLiked) {
        comments[index].isLiked = !comments[index].isLiked
        comments[index].likeCount--
      } else {
        comments[index].isLiked = !comments[index].isLiked
        comments[index].likeCount++
      }

      // * После клика на кнопку лайка, перерендарится массив комментариев
      renderComments()
    })
  }
}

// * Валидация ввода имени и комментария
commentButton.addEventListener('click', () => {
  // * Создание переменной ошибки
  let error = false

  commentNameInput.classList.remove('input-error')
  commentTextInput.classList.remove('input-error')

  // * Проверка ввода на пробелы
  if (commentNameInput.value.trim() === '') {
    commentNameInput.classList.add('input-error')
    error = true
  }

  if (commentTextInput.value.trim() === '') {
    commentTextInput.classList.add('input-error')
    error = true
  }

  if (error) {
    return
  }

  commentsList.innerHTML = 'Стучу на сервак ^.^'

  commentButton.disabled = true
  commentButton.textContent = 'Отправляю...'

  sendCommentToServer()

  // * Поля ввода после создания комментария
  commentNameInput.value = `${commentNameInput.value}`
})

commentsList.textContent = 'Подождите чутка...'
readCommentFromServer()
