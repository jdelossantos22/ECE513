var user;
function Register(){
  //const user = await response.json();
  console.log(user);
  pingTest(); // verify id and key AND create db entry
}

function pingTest() {
  let deviceId = $("#deviceId").val();
  let deviceKey = $("#apiKey").val();
  //verify id by pinging particle
  let txdata = {
    id:deviceId,
    token:deviceKey
  }
  console.log("PING")
    $.ajax({
      url: '/particle/verify',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(txdata),
      dataType: 'json'
    }).done(deviceSuccess).fail(deviceFailure);
}

function deviceSuccess(data, textStatus, jqXHR){
  if (data.success) {
    console.log(data)
    let deviceName = $("#deviceName").val();
    let deviceId = $("#deviceId").val();
    let deviceKey = $("#apiKey").val();
    let userEmail = user[0].email;
    let date = $("#startDate").val() + " " + $("#startTime").val()
    date = new Date(date);
    console.log(date)
    let txdata = {
        name:deviceName,
        id:deviceId,
        api:deviceKey,
        email: userEmail,
        startDate:date
    };
    console.log(txdata)
    
    $.ajax({
        url: '/device/create',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
        }).done(registerSuccess)
        .fail(registerError);
  }
  else{
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Error: invalid_id/" + data.data.error + "</span>"
    +"<br><span class='red-text text-darken-2'>Error: " + data.data.error_description + "</span>");
    $('#ServerResponse').show();
  }

}
function deviceFailure(jqXHR, textStatus, errorThrown){
  console.log(jqXHR);
  if (jqXHR.statusCode == 404) {
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
    $('#ServerResponse').show();
  }
  else {
    $('#ServerResponse').html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON + "</span>");
    $('#ServerResponse').show();
  }
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

  Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
  });

  $(function () {
    $('#signup').click(Register);
    //$("startDate").val(new Date().toDateInputValue());
    //$("startTime")
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