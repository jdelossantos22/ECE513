function sendSigninRequest() {
  let email = $('#email').val();
  let password = $('#password').val();
  
  $.ajax({
    url: '/users/signin',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ email : email, password : password }), 
    dataType: 'json'
  })
    .done(signinSuccess)
    .fail(signinError);
}

function signinSuccess(data, textSatus, jqXHR) {
  window.localStorage.setItem('authToken', data.authToken);
  window.location = "controllerAtHome.html";
}

function signinError(jqXHR, textStatus, errorThrown) {
  if (jqXHR.statusCode == 404) {
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
    $('#ServerResponse').show();
  }
  else {
    //what is jqXHR.responseJSON.message
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Error: " + errorThrown + "</span>");
    $('#ServerResponse').show();
  }
}

// Handle authentication on page load
$(function() {  
  if( window.localStorage.getItem('authToken')) {
    window.location.replace('account.html');
  }
  else {
    $('#signin').click(sendSigninRequest);
     $('#password').keypress(function(event) {
        if( event.which === 13 ) {
           sendSigninRequest();
        }
     });
  }
});