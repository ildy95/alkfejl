$('#btnLogin').on('click', function (e) {  
  e.preventDefault() 

    $modal = $(`  
      <div class="modal fade confirm-modal" tabindex="-1" role="dialog" id="loginModal">  
        <div class="modal-dialog modal-md" role="document">  
          <div class="modal-content">  
            <div class="modal-header">Belépés</div>  
            <div class="modal-body">  
              <div class="alert alert-danger"></div>  
              <div class="form-area"></div>  
            </div>  
          </div>  
        </div>  
      </div>  
    `)  

    const $formContainer = $modal.find('.form-area')  
    const $errorContainer = $modal.find('.alert').hide()  

    $formContainer.load('/login form', function() {  
      $modal.modal('show')
      const $loginForm = $modal.find('form')  
      $loginForm.on('submit', function (e) {  
        e.preventDefault()  
        $errorContainer.hide()  
        const data = $(this).serializeArray()
        Promise.resolve(  
          $.ajax({  
            url: `/ajax/login`,  
            method: 'POST',  
            data: data,  
            dataType: 'json',  
            headers: { 'csrf-token': $('[name="_csrf"]').val() }  
          })  
        ).then(json => {  
          if (json.success) {
              location.assign('/')
          }
          else {  
            $errorContainer.text('Hibás adatok!').show()  
          }  
        })  
      })  
    })  
});