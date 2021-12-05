function sendReqForAccountInfo() {
  $.ajax({
    url: '/users/status',
    type: 'GET',
    headers: { 'x-auth': window.localStorage.getItem("authToken") },
    dataType: 'json'
  }).done(accountInfoSuccess)
    .fail(accountInfoError);
}



var devices = [];
function accountInfoSuccess(data, textSatus, jqXHR) {
    
    $("#email").html(JSON.stringify(data[0].email, null, 2));
    $("#fullName").html(JSON.stringify(data[0].fullName, null, 2));
    $("#lastAccess").html(JSON.stringify(data[0].lastAccess, null, 2));
    $("#zip").html(JSON.stringify(data[0].zip, null, 2));
    $("#main").show();
    console.log(data)
   
   let devices = window.localStorage.getItem("devices")
   devices = JSON.parse(devices)
   //let devices = data.devices
   for(let i = 0; i < devices.length; i++){
       console.log(devices[i])
       $("#addDeviceList").prepend(`<li><a class="dropdown-item devices" href="#"">${"Device #"+i <br> + "Device Name: "+ devices[i].deviceName<br> + "     Devide ID: "+ devices[i].deviceId<br> + "     Apikey: "+ devices[i].apikey}</a></li>`)
       $("#main").show();
       
   }
}
  

function accountInfoError(jqXHR, textStatus, errorThrown) {
  // If authentication error, delete the authToken 
  // redirect user to sign-in page 
  console.log("HEY")
  if( jqXHR.status === 401 ) {
    window.localStorage.removeItem("authToken");
    window.location.replace("signin.html");
  } 
  else {
    $("#error").html("Error: " + status.message);
    $("#error").show();
  } 
}



function updateAccInfo(){
  var fullName = $("#fullName").val();
  var zip = $("#zip").val();
  $.ajax({
    url: '/users/updateAccount',
    type: 'PUT',
    headers: { 'x-auth': window.localStorage.getItem("authToken") },
    contentType: 'application/json',
    data: JSON.stringify({fullName:fullName, zip:zip}),
    dataType: 'json'
  })
  .done(updateSuccess)
  .fail(updateFailure);
}

function updateSuccess(data, textStatus, jqXHR) {
  window.localStorage.setItem('authToken', data.authToken);
  window.location.reload(false)
}

function updateFailure(jqXHR, textStatus, errorThrown) {
  console.log("Update Failed")
  console.log(jqXHR)
  console.log(textStatus)
  console.log(errorThrown)
}

// Handle authentication on page load
$(function() {
  // If there's no authToekn stored, redirect user to 
  // the sign-in page 
  //console.log(!window.localStorage.getItem("authToken"))
  
  if (!window.localStorage.getItem("authToken")) {
    window.location.replace("signin.html");
  }
  else {
    sendReqForAccountInfo();
  }

  $('#updateAccount').click(Register);
  //console.log("account.js")
});