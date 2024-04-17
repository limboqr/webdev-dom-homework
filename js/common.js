
// * Функция формата даты
export function fnDate(commentDate) {
   const day     = String(commentDate.getDate()).padStart(2, '0')
   const month   = String(commentDate.getMonth() + 1).padStart(2, '0')
   const year    = commentDate.getFullYear().toString().slice(-2)
   const hours   = commentDate.getHours().toString().padStart(2, '0')
   const minutes = commentDate.getMinutes().toString().padStart(2, '0')

   return `${day}.${month}.${year} ${hours}:${minutes}`
}

String.prototype.sanitize = function () {
   return this
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('""', '&quot;')
}
