function ajaxElutasit(url) {
  const headers = {
    'csrf-token': $('[name="_csrf"]').val()
  }
  return Promise.resolve(
    $.ajax({
      url: `/ajax${url}`,
      method: 'DELETE',
      dataType: 'json',
      headers
    })
  )
}

function my_confirm(str) {
  const confirmModal = new ConfirmModal('.confirm-modal')
  return confirmModal.confirm(str)
}

function onDeleteClick(e) {
  co(function* () {
    e.preventDefault()
    const response = yield my_confirm('Biztos törölni akarod?')
    if (response) {
      const url = $(this).attr('href')
      $('.help-block').text('')
      ajaxElutasit(url)
        .then(function(data) {
          location.assign('/registrations')
        })
        .catch(function (reason) {
          console.error(reason);
          $('.help-block').text('Hiba történt a feldolgozás során')
        });
    }
  }.bind(this))
}

$('.btn-elutasit').on('click', onDeleteClick)

