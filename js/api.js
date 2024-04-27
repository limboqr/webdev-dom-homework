// ! API
// * API GET
export const API = {
   status: 0,
   commentUrl: "https://wedev-api.sky.pro/api/v2/pavel-karmanov/comments",

   token: "",
   userName: "",

   getComments() {
      this.status = 0
      const params = {
         method: "GET",
      }

      if (this.token) {
         params.headers = {
            Authorization: `Bearer ${this.token}`,
         }
      }

      return fetch(this.commentUrl, params)
         .then((res) => {
            this.status = res.status
            return res.json()
         })
   },

   // * API POST
   postComments(name, text) {
      this.status = 0

      return fetch(this.commentUrl, {
         method: "POST",
         body: JSON.stringify({
            name: name.sanitize(),
            text: text.sanitize(),
         }),
         headers: {
            Authorization: `Bearer ${this.token}`,
         },
      })
         .then((res) => {
            this.status = res.status
            return res.json()
         })
   },

   // * API POST authUser
   authUser(login, password) {
      this.status = 0

      return fetch("https://wedev-api.sky.pro/api/user/login", {
         method: "POST",
         body: JSON.stringify({
            login: login.sanitize(),
            password: password.sanitize(),
         }),
      })
         .then((res) => {
            this.status = res.status
            return res.json()
         })
         .then((data) => {
            this.token = data.user.token
            this.userName = data.user.name
            return data
         })
   },
}
