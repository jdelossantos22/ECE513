function sendReqForAccountInfo() {
  $.ajax({
    url: '/users/status',
    type: 'GET',
    headers: { 'x-auth': window.localStorage.getItem("authToken") },
    dataType: 'json'
  }).done(accountInfoSuccess)
    .fail(accountInfoError);
}

function accountInfoSuccess(data, textSatus, jqXHR) {
  console.log("JHEY")
  $("#email").html(data.email);
  $("#fullName").html(data.fullName);
  $("#lastAccess").html(data.lastAccess);
  $("#zip").html(data.zip);
  $("#main").show();
  
  // Add the devices to the list before the list item for the add device button
  for (let device of data.devices) {
    $("#addDeviceList").before("<li class='collection-item'>ID: " +
      "<span class='ID'> " + device.deviceId + "</span>, APIKEY: <span class='ID'> " + device.apikey + "</span><br>" +
      " </li>");
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
  //console.log("account.js")
});