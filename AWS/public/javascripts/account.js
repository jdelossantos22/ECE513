function sendReqForAccountInfo() {
  $.ajax({
    url: '/users/status',
    type: 'GET',
    headers: { 'x-auth': window.localStorage.getItem("authToken") },
    dataType: 'json'
  })
    .done(accountInfoSuccess)
    .fail(accountInfoError);
}






function accountInfoSuccess(data, textSatus, jqXHR) {
  $("#email").html(data.email).show();
  console.log(data.email)
  $("#fullName").html(data.fullName);
  console.log(data.fullName)
  $("#lastAccess").html(data.lastAccess);
  console.log(data.lastAccess)
  $("#zip").html(data.zip);
  console.log(data.zip)
  //$("#main").show();
  
  // Add the devices to the list 
  for (let device of data.devices) {
    console.log(device)
    $("#addDeviceList").before("<li class='collection-item'>ID: " +
      "<span class='ID'> " + device.deviceId + "</span>, APIKEY: <span class='ID'> " + device.apikey + "</span><br>" +
      " </li>");
  }
}

function accountInfoError(jqXHR, textStatus, errorThrown) {
  // If authentication error, delete the authToken 
  // redirect user to sign-in page 
  if( jqXHR.status === 401 ) {
    window.localStorage.removeItem("authToken");
    window.location.replace("signin.html");
  } 
  else {
    $("#error").html("Error: " + status.message);
    $("#error").show();
  } 
}

// Handle authentication on page load
$(function() {
  // If there's no authToekn stored, redirect user to 
  // the sign-in page 
  if (!window.localStorage.getItem("authToken")) {
    window.location.replace("signin.html");
  }
  else {
    sendReqForAccountInfo();
  }
});