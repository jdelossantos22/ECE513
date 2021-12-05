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
       $("#addDeviceList").prepend(`<li><a class="dropdown-item devices" href="#"">${"Device #"+i
        + "&nbsp &nbsp &nbsp &nbsp &nbsp  Device Name: "+ devices[i].deviceName
         + "&nbsp &nbsp &nbsp &nbsp &nbsp Devide ID: "+ devices[i].deviceId
          + "&nbsp &nbsp &nbsp &nbsp &nbsp Apikey: "+ devices[i].apikey}</a> 
          "&nbsp &nbsp &nbsp <button type='button' 
          onclick='deviceDelete(this);' 
          class='btn btn-default'>" +
          "<span class='glyphicon glyphicon-remove' />" +
          "</button>" </li>`)
       //$("#main").show();
       
   }
}

function deviceDelete(ctl) {

  console.log(window.localStorage.getItem("devices"))
  $(ctl).localStorage.removeItem("devices[0]");
  console.log(window.localStorage.getItem("devices"))
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
  let email = $('#email').val();
  let password = $('#password').val();
  let fullName = $('#fullName').val();
  let passwordConfirm = $('#passwordConfirm').val();
  let zip = $('#zip').val();

  $.ajax({
    url: '/users/updateAccount',
    type: 'PUT',
    headers: { 'x-auth': window.localStorage.getItem("authToken") },
    contentType: 'application/json',
    data: JSON.stringify({fullName:fullName, password:password, passwordConfirm:passwordConfirm, zip:zip}),
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



function removeDevice(data, textSatus, jqXHR){
  $.ajax({
       url: '/device/delete/',
       type: 'DELETE',
       headers: { 'x-auth':  window.localStorage.getItem("authToken") },
       data: {},
       contentType: 'application/json',
       responseType: 'text',
       success: function (data, textStatus, jqXHR) {
           console.log("Device removed from account:" + deviceId);
           removeDeviceListing(deviceId);
       },
       error: function(jqXHR, textStatus, errorThrown) {
           $("#error").html("Error: " + jqXHR.responseText);
           $("#error").show();
       }
   });
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
  $('#update').click(updateAccInfo);
  //$('#remove').click(RemoveDevice);
  //console.log("account.js")
});