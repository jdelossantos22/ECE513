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
  window.localStorage.setItem('email', data.email);
  checkDeviceExists();
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

function checkDeviceExists(){
  let email = window.localStorage.getItem('email');
  
  $.ajax({
    url: '/device/find',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ email : email}), 
    dataType: 'json'
  })
    .done(findDeviceSuccess)
    .fail(findDeviceFailure);
}

function findDeviceSuccess(data, textSatus, jqXHR){
  
  if (data.msg == "User already has device"){
    window.localStorage.setItem('dKey', data.dKey);
    window.localStorage.setItem('dId', data.dId);
    window.location = "controllerAtHome.html";
  }
  else{
    window.location = "deviceRegister.html";
  }
}
function findDeviceFailure(jqXHR, textStatus, errorThrown) {
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