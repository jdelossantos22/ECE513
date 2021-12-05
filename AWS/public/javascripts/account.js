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
        //console.log(Device)
    // Add the devices to the list 
    //for (let device of data.devices) {
    //  console.log(device)
     // $("#addDeviceList").before("<li class='collection-item'>ID: " +
     //   "<span class='ID'> " + device.deviceId + "</span>, APIKEY: <span class='ID'> " + device.apikey + "</span><br>" +
     //   " </li>");
   // }
  
   console.log(data[0].devices)
   window.localStorage.setItem("devices", JSON.stringify(data.devices))
   data
   let devices = data.devices
   for(let i = 0; i < devices.length; i++){
       console.log(devices[i])
       $("#addDeviceList").prepend(`<li><a class="dropdown-item devices" href="#"">${devices[i].deviceName}</a></li>`)
       $("#main").show();
       //$(".devices").click(updateGUI)
   }
}
  
  // Add the devices to the list 
 // for (let device of data.devices) {
   // console.log(device)
    //$("#addDeviceList").before("<li class='collection-item'>ID: " +
      //"<span class='ID'> " + device.deviceId + "</span>, APIKEY: <span class='ID'> " + device.apikey + "</span><br>" +
      //" </li>");
 // }
//}

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