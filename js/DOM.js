import { format } from "date-fns/format"
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

   // * API GET
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
               date: format(new Date(comment.date), 'yyyy-MM-dd hh.mm.ss'),
               text: comment.text,
               isLiked: comment.isLiked,
               likeCount: comment.likes,
            }
         })

         this.comments = appComments
         this.renderAll()
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

   // * Общая функция
   renderAll() {
      if (API.token) {
         this.renderComments()
         this.renderAddForm()
      } else {
         this.renderComments()
         document.getElementById("footer").innerHTML = `
         <p><a href="#" id="auth-link">Авторизуйтесь</a> чтобы отправить комментарий</p>`
         document.getElementById("auth-link").addEventListener("click", () => {
            this.renderAuthForm()
         })
      }
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

   // * Функция Авторизации
   renderAuthForm() {
      this.commentsList.innerHTML = ""
      document.getElementById("footer").innerHTML = `
         <div   class = "footer-auth">
            <input class = "footer-input" id = "user-login-input" placeholder = "Введите ваш логин" type = "text" />

            <input class = "footer-input" id = "user-password-input" placeholder = "Введите ваш пороль" type = "password" />

            <button class = "footer-button" id = "auth-button">Авторизоваться</button>
         </div>`

      document.getElementById("auth-button").addEventListener("click", () => {
         const login = document.getElementById("user-login-input").value
         const password = document.getElementById("user-password-input").value

         API.authUser(login, password).then((data) => {
            if (API.status !== 201)
               throw new Error(data.error)
            // else if (API.status === 500)
            //   throw new Error('Ошибка сервера')
            this.renderAll()
         })
      })
   },

   // * Функция добавления формы
   renderAddForm() {
      document.getElementById("footer").innerHTML = `
         <div   class = "add-form">
         <input class = "add-form-name" id = "comment-name-input" placeholder = "Введите ваше имя" type = "text" value="${API.userName}" disabled />

         <textarea class = "add-form-text" id = "comment-text-input" placeholder = "Введите ваш коментарий" type = "textarea"
                  rows  = "4"></textarea>

         <div    class = "add-form-row">
         <button class = "add-form-button" id = "comment-button">Написать</button>
         </div>
      </div>`

      this.commentNameInput = document.getElementById('comment-name-input')
      this.commentTextInput = document.getElementById('comment-text-input')

      this.commentButton = document.getElementById('comment-button')
      this.handleSubmit()
   },

   // * Функция лайка
   initEventListener() {
      // * Переменная всех кнопок лайков
      const likeButtonElements = document.querySelectorAll('.like-button')

      // * Цикл. При клике на кнопку лайка, добавляется или убирается лайк
      for (const likeButtonElement of likeButtonElements) {
         likeButtonElement.addEventListener('click', () => {
            if (!API.token) {
               return
            }

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
      if (!API.token) {
         return
      }

      this.commentButton.addEventListener('click', (event) => {
         event.stopPropagation()

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

   // * Пьюск
   start() {
      this.handleSubmit()
      this.commentsList.textContent = 'Подождите чутка...'
      this.readCommentFromServer()
   },
}
