// * Основные переменные
const commentButton = document.getElementById('comment-button')
const commentsList = document.getElementById('comments-list')
const commentNameInput = document.getElementById('comment-name-input')
const commentTextInput = document.getElementById('comment-text-input')

// * Массив комментов
const comments = [
  {
    name: 'Глеб Фокин',
    date: '12.02.22 12:18',
    text: 'Это будет первый комментарий на этой странице',
    isLiked: false,
    likeCount: 3,
  },
  {
    name: 'Варвара Н.',
    date: '13.02.22 19:22',
    text: 'Мне нравится как оформлена эта страница! ❤',
    isLiked: true,
    likeCount: 75,
  },
]

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

  const commentTexts = document.querySelectorAll('.comment-text')
  commentTexts.forEach(commentText => {
    commentText.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index')
      commentTextInput.value = `> ${comments[index].text}: ${comments[index].name}`
      commentTextInput.focus()
      console.log('click :З')
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
    commentName.classList.add('input-error')
    error = true
  }

  if (commentTextInput.value.trim() === '') {
    commentText.classList.add('input-error')
    error = true
  }

  if (error) {
    return
  }

  // * Создание новой даты в новом комментарии
  let commentDate = new Date()

  // * Добавление комментария в массив комментариев
  comments.push(
    {
      name: commentNameInput.value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('""', '&quot;'),
      date: fnDate(commentDate),
      text: commentTextInput.value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('""', '&quot;'),
      isLiked: false,
      likeCount: 0,
    }
  )

  // * Перерендер массива после добавления комментария в HTML
  renderComments()

  // * Поля ввода после создания комментария
  commentNameInput.value = `${commentNameInput.value}`
  commentTextInput.value = ''
})

// * Рендер массива при загрузке страницы
renderComments()
