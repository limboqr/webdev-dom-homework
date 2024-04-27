import { API } from "./api.js"
import { fnDate } from "./common.js"

export const DOM = {
   // * Основные переменные
   commentButton: document.getElementById('comment-button'),
   commentsList: document.getElementById('comments-list'),
   commentNameInput: document.getElementById('comment-name-input'),
   commentTextInput: document.getElementById('comment-text-input'),

   // * Массив комментов
   comments: [],

   readCommentFromServer() {
      let status = 0

      API.getComments().then((data) => {
         if (API.status !== 200)
            throw new Error(data.error)
         // else if (API.status === 500)
         //   throw new Error('Ошибка сервера')

         const appComments = data.comments.map((comment) => {

            return {
               name: comment.author.name,
               date: fnDate(new Date(comment.date)),
               text: comment.text,
               isLiked: comment.isLiked,
               likeCount: comment.likes,
            }
         })

         this.comments = appComments
         this.renderComments()
      })
         .catch((error) => {
            if (error.message === 'Failed to fetch')
               alert('Ошибка соединения с сервером. Проверьте Интернет')
            else
               alert(error.message)

            console.log(error)
         })
   },

   // * API POST
   sendCommentToServer() {
      this.commentButton.disabled = true

      API.postComments(this.commentNameInput.value, this.commentTextInput.value)
         .then((data) => {
            if (API.status !== 201)
               throw new Error(data.error)
            // else if (API.status === 500)
            //   throw new Error('Ошибка сервера')

            this.readCommentFromServer()
            return 'ok'
         })
         .catch((error) => {
            if (error.message === 'Failed to fetch')
               alert('Ошибка соединения с сервером. Проверьте Интернета')
            else
               alert(error.message)

            console.log(error)
         })
         .then((result) => {
            this.commentButton.disabled = false
            this.commentButton.textContent = 'Написать'

            if (result === 'ok')
               this.commentTextInput.value = ''
            else
               this.renderComments()
         })
   },

   // * Функция рендера комментов в HTML
   renderComments() {
      // * Создание нового массива с помощью map()
      this.commentsList.innerHTML = this.comments.map((comment, index) => {
         // * Узнаём, есть ли лайк в комменте
         const classButton = comment.isLiked
            ? '-active-like'
            : ''

         return `<li class="comment">
      <div class = "comment-header">
         <div>${comment.name}</div>
         <div>${comment.date}</div>
      </div>
      <div class = "comment-body">
      <div class = "comment-text" data-index = "${index}">
         ${comment.text}
         </div>
      </div>
      <div    class = "comment-footer">
      <div    class = "likes">
      <span   class = "likes-counter" data-index              = "${index}">${comment.likeCount}</span>
      <button class = "like-button ${classButton}" data-index = "${index}"></button>
         </div>
      </div>
   </li>`
      }).join('') // * С помощью join() делаем строку

      // * Коментировать выбранный коментарий
      const commentTexts = document.querySelectorAll('.comment-text')
      commentTexts.forEach(commentText => {
         commentText.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index')
            this.commentTextInput.value = `> ${this.comments[index].text}: ${this.comments[index].name}`
            this.commentTextInput.focus()
         })
      })

      // * Функция лайка
      this.initEventListener()
   },

   // * Функция лайка
   initEventListener() {
      // * Переменная всех кнопок лайков
      const likeButtonElements = document.querySelectorAll('.like-button')

      // * Цикл. При клике на кнопку лайка, добавляется или убирается лайк
      for (const likeButtonElement of likeButtonElements) {
         likeButtonElement.addEventListener('click', () => {
            const index = likeButtonElement.dataset.index
            if (this.comments[index].isLiked) {
               this.comments[index].isLiked = !this.comments[index].isLiked
               this.comments[index].likeCount--
            } else {
               this.comments[index].isLiked = !this.comments[index].isLiked
               this.comments[index].likeCount++
            }

            // * После клика на кнопку лайка, перерендарится массив комментариев
            this.renderComments()
         })
      }
   },

   // * Валидация ввода имени и комментария
   handleSubmit() {
      this.commentButton.addEventListener('click', () => {
         // * Создание переменной ошибки
         let error = false

         this.commentNameInput.classList.remove('input-error')
         this.commentTextInput.classList.remove('input-error')

         // * Проверка ввода на пробелы
         if (this.commentNameInput.value.trim() === '') {
            this.commentNameInput.classList.add('input-error')
            error = true
         }

         if (this.commentTextInput.value.trim() === '') {
            this.commentTextInput.classList.add('input-error')
            error = true
         }

         if (error) {
            return
         }

         this.commentsList.innerHTML = 'Стучу на сервак ^.^'

         this.commentButton.disabled = true
         this.commentButton.textContent = 'Отправляю...'

         this.sendCommentToServer()

         // * Поля ввода после создания комментария
         this.commentNameInput.value = `${this.commentNameInput.value}`
      })
   },

   // * Пюск
   start() {
      this.handleSubmit()
      this.commentsList.textContent = 'Подождите чутка...'
      this.readCommentFromServer()
   },
}
