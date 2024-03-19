// * Онсновные переменные
const commentButton = document.getElementById('comment-button') // * Button
const commentsList = document.getElementById('comments-list') // * List
const commentName = document.getElementById('comment-name') // * Name
const commentText = document.getElementById('comment-text') // * Text

// --------------------------------------------

// * Функция формата даты
function fnDate(commentDate) {
  const day = String(commentDate.getDate()).padStart(2, '0')
  const month = String(commentDate.getMonth() + 1).padStart(2, '0')
  const year = commentDate.getFullYear().toString().slice(-2)
  const hours = commentDate.getHours().toString().padStart(2, '0')
  const minutes = commentDate.getMinutes().toString().padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}

// * Функция добавления лайка
function fnLike() {
  const commentLikeButtons = document.querySelectorAll('.like-button') // * Like Button
  commentLikeButtons.forEach((button) => button.addEventListener('click', () => {
    const element = document.querySelector(`.likes-counter[data-index="${button.dataset.index}"]`)
    let counter = Number(element.innerText)

    if (button.classList.contains('-active-like')) {
      button.classList.remove('-active-like')
      counter--
      element.innerText = counter
    } else {
      button.classList.add('-active-like')
      counter++
      element.innerText = counter
    }
  }))
}

// --------------------------------------------

// * Button Disabled
// if (commentName.value === '' || commentText.value === '') {
//   commentButton.disabled = true
//   commentButton.classList.add('button-disabled')
// }

// if (commentName.value && commentText.value) {
//   commentButton.disabled = false
//   commentButton.classList.remove('button-disabled')
// }

// --------------------------------------------

// * Функция добавления комментария
commentButton.addEventListener('click', () => {
  let error = false
  // * Валидация полей ввода
  commentName.classList.remove('input-error')
  commentText.classList.remove('input-error')
  // * Name
  if (commentName.value.trim() === '') {
    commentName.classList.add('input-error')
    error = true
  }
  // * Text
  if (commentText.value.trim() === '') {
    commentText.classList.add('input-error')
    error = true
  }

  if (error) {
    return
  }

  // * Добваление комментария  
  const oldCommentList = commentsList.innerHTML

  if (commentName.value && commentText.value) {
    const index = document.querySelectorAll('li.comment').length + 1
    const commentDate = new Date()

    commentsList.innerHTML = oldCommentList +
      `<li class="comment">
        <div class="comment-header">
          <div>${commentName.value}</div>
          <div>${fnDate(commentDate)}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
          ${commentText.value}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter" data-index="${index}">0</span>
            <button class="like-button" data-index="${index}"></button>
          </div>
        </div>
      </li>`
  }

  // * Сброс полей ввода, после успешного выполнения
  commentName.value = ''
  commentText.value = ''

  // * Функция добавления лайка
  fnLike()
})

// * Функция добавления лайка
fnLike()
