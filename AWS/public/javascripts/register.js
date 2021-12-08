function Register() {
  let errors = [];
  let email = $('#email').val().toLowerCase();
  let password = $('#password').val();
  let fullName = $('#fullName').val();
  let passwordConfirm = $('#passwordConfirm').val();
  let zip = $('#zip').val();

  var strongRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  let strongPassword = !strongRegex.test(password)
  //strongPassword = false
  let reEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
  if (!reEmail.test(email)){
    //email.classList.add("errorBox");
    //errors.push("Invalid or missing email address.");
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Invalid or missing email address."
    +"</span>");
    $('#ServerResponse').show();
    return;
  }
  if(strongPassword){
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Password is not strong enough.:"
                              +"<ul> <li>length of 8 or more characters</li>"
                              +"<li>At least one Capital letter</li>"
                              +"<li>At least one lower case letter</li>"
                              +"<li>At least one number</li>"
                              +"<li>At least one lower Special Character</li>"
                              +"</ul></span>");
    $('#ServerResponse').show();
    return;
  }
  
  if (password != passwordConfirm) {
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Passwords don't match.</span>");
    $('#ServerResponse').show();
    return;
  }

  else { 
    console.log("Registering")
    //what are you testing here?
    var alphanumericTest = /^[a-zA-Z0-9_]{8,}$/;
    //if (alphanumericTest.test(password)) {}
    authorizationKey = getNewApikey();
    message = "Enter the key to register your account: " + authorizationKey;
    //I still dont know what email does
    /*
    Email.send({
        SecureToken : "b543ae45-4be8-7871-45ef-9b6ebc4dsa50",
        // Host : "smtp.elasticemail.com",
        // Username : "cuevasr@email.arizona.edu",
        // Password : "PASS",
        To : email,
        From : "cuevasr@email.arizona.edu",
        Subject : "Register your Account",
        Body : message
    }).then(
      message => console.log(message)
    );*/
    let txdata = {email:email, 
      fullName:fullName, 
      APIKEY: authorizationKey,
      password: password,
      zip: zip
    };
    console.log(txdata);
    $.ajax({
      url: '/users/register',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(txdata),
      dataType: 'json'
      }).done(registerSuccess)
      .fail(registerError);
  }
}

function registerSuccess(data, textStatus, jqXHR) {
  if (data.success) {
    window.location = "signin.html";
  }
  else {
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
    $('#ServerResponse').show();
  }
}

function registerError(jqXHR, textStatus, errorThrown) {
  if (jqXHR.statusCode == 404) {
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
    $('#ServerResponse').show();
  }
  else {
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON.message + "</span>");
    $('#ServerResponse').show();
  }
}



function getNewApikey() {
  let newApikey = "";
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  for (let i = 0; i < 32; i++) 
  {
    newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return newApikey;
}

$(function () {
  $('#signup').click(Register);
});
