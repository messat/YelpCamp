(() => {
    'use strict'
    let file_Name_Display = document
    .getElementById("fileNameDisplay");


    const forms = document.querySelectorAll('.validated-form')
  
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()