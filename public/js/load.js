window.onload=function() {
  const form = document.querySelector('form')
  
  form.addEventListener('submit', e => {
    e.preventDefault()
    fetch('https://zzz-rest-api-template.herokuapp.com/users').then((response) => {
      console.log(response.json())
    })
  })

}
