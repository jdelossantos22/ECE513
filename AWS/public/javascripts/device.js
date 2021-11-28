function Register(){
    let deviceName = $("#deviceName").val();
    let deviceId = $("#deviceId").val();
    let deviceKey = $("#apiKey").val();
    let userEmail = window.localStorage.getItem("email")
    let txdata = {
        name:deviceName,
        id:deviceId,
        api,deviceKey,
        email: userEmail
    };
    $.ajax({
        url: '/device/register',
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
    if (jqXHR.statusCode == 404) {
      $('#ServerResponse').html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
      $('#ServerResponse').show();
    }
    else {
      $('#ServerResponse').html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON.message + "</span>");
      $('#ServerResponse').show();
    }
  }