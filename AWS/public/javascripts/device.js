var user;

function Register(){
  //const user = await response.json();
  console.log(user)
  let deviceName = $("#deviceName").val();
  let deviceId = $("#deviceId").val();
  let deviceKey = $("#apiKey").val();
  let userEmail = user[0].email;
  let txdata = {
      name:deviceName,
      id:deviceId,
      api:deviceKey,
      email: userEmail
  };
  $.ajax({
      url: '/device/create',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(txdata),
      dataType: 'json'
      }).done(registerSuccess)
      .fail(registerError);

  
}

function registerSuccess(data, textStatus, jqXHR) {
    if (data.success) {
        window.localStorage.setItem('dKey', data.dKey);
        window.localStorage.setItem('dId', data.dId);
        window.location = "controllerAtHome.html";
    }
    else {
      $('#ServerResponse').html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
      $('#ServerResponse').show();
    }
}

function registerError(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR)
    if (jqXHR.statusCode == 404) {
      $('#ServerResponse').html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
      $('#ServerResponse').show();
    }
    else {
      $('#ServerResponse').html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON + "</span>");
      $('#ServerResponse').show();
    }
  }

  $(function () {
    $('#signup').click(Register);
    $.ajax({
      url: '/users/status',
      method: 'GET',
      headers: { 'x-auth' : window.localStorage.getItem("authToken") },
      dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
      console.log(data)
      user = data;
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      window.localStorage.removeItem('authToken');
      window.location = "index.html";
    });
  });