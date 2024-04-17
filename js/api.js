// ! API
// * API GET
export const API = {
   status: 0,
   commentUrl: "https://wedev-api.sky.pro/api/v1/pavel-karmanov/comments",

   getComments() {
      this.status = 0

      return fetch(this.commentUrl)
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
      })
         .then((res) => {
            this.status = res.status
            return res.json()
         })
   },
}
