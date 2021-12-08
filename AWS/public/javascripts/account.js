//const User = require("../../models/users");

function sendReqForAccountInfo() {
  $.ajax({
    url: '/users/status',
    type: 'GET',
    headers: { 'x-auth': window.localStorage.getItem("authToken") },
    dataType: 'json'
  }).done(accountInfoSuccess)
    .fail(accountInfoError);
}

var user;

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
          </li>`)
       //$("#main").show();
       
   }
}

/*
function deviceDelete() {

  let devNum = $('#deviceNum').val();
  
  let deviceNum = parseInt(devNum);
  
  let devices = window.localStorage.getItem("devices")
  devices = JSON.parse(devices)
  console.log("checkDevice with Number")
  console.log(devices[deviceNum])
  for(let i = 0; i < devices.length; i++)
  {
  
  console.log(devices[i])
  if (deviceNum == i) {
    console.log("inside if statement")
    console.log("deviceNumuber")
    console.log(devices[i])
    //delete devices[i].deviceName;
    delete devices[i];
    
    window.localStorage.setItem("devices", JSON.stringify(devices))
  }
  
  
  }

  //window.localStorage.setItem("devices", JSON.stringify(devices))
  initDevices();
  console.log("After Removing"+window.localStorage.getItem("devices"))

}
*/

function updateDeviceList()
{
  let txdata = {
    email: $('#userEmail').val()
}
$.ajax({
  url: '/device/findAll',
  method: 'POST',
  contentType: 'application/json',
  data: JSON.stringify(txdata),
  dataType:'json'
}).done(deviceSuccess).fail(deviceFailure);     
}

function deviceSuccess(data, textStatus, jqXHR){
  console.log(data.devices)
  window.localStorage.setItem("devices", JSON.stringify(data.devices))
  let devices = data.devices
    //devices1=devices11.filter((a)=>a);
  //let devices = data.devices
  for(let i = 0; i < devices.length; i++){
      console.log(devices[i])
      $("#addDeviceList").prepend(`<li><a class="dropdown-item devices" href="#"">${"Device #"+i
       + "&nbsp &nbsp &nbsp &nbsp &nbsp  Device Name: "+ devices1[i].deviceName
        + "&nbsp &nbsp &nbsp &nbsp &nbsp Devide ID: "+ devices1[i].deviceId
         + "&nbsp &nbsp &nbsp &nbsp &nbsp Apikey: "+ devices1[i].apikey}</a> 
         </li>`)
      //$("#main").show();
      
  }
   
}

function deviceFailure(jqXHR, textStatus, errorThrown){
  console.log(jqXHR.responseText);
}

function deleteDevices(){
  //items.find.sort( [['_id', -1]] ) // get all items desc by created date.
  //sort by first added, first added is the primary device
  let devId = $('#deviceId').val();
  
  let deviceId = String(devId);
  
  let devices = window.localStorage.getItem("devices")
  devices = JSON.parse(devices)
  console.log("checkDevice with Id")
  //console.log(devices[deviceNum])
  
  for(let i = 0; i < devices.length; i++){
    if(devices[i].deviceId == deviceId){
      delete devices[i];
      console.log("inside if statement")
      console.log("deviceNumuber")
      console.log(devices[i])
      delete devices[i];
      
        }
      
      window.localStorage.setItem("devices", JSON.stringify(devices.filter((a)=>a)));
      console.log(devices[i])
    }
/*
   let devices1 = window.localStorage.getItem("devices")
   devices1 = JSON.parse(devices1)
   //devices1=devices11.filter((a)=>a);
   //let devices = data.devices
   for(let i = 0; i < devices1.length; i++){
       console.log(devices1[i])
       $("#addDeviceList").prepend(`<li><a class="dropdown-item devices" href="#"">${"Device #"+i
        + "&nbsp &nbsp &nbsp &nbsp &nbsp  Device Name: "+ devices1[i].deviceName
         + "&nbsp &nbsp &nbsp &nbsp &nbsp Devide ID: "+ devices1[i].deviceId
          + "&nbsp &nbsp &nbsp &nbsp &nbsp Apikey: "+ devices1[i].apikey}</a> 
          </li>`)
       //$("#main").show();
       
   }*/
  //}
      let txdata = {
        device:devices
      };
      $.ajax({
          url: '/device/delete',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(txdata),
          dataType:'json'
      })//.done(deviceSuccess).fail(deviceFailure);
      .done(function (data, textStatus, jqXHR) {
        $('#rxData').html(JSON.stringify(data, null, 2));
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
        $('#rxData').html(JSON.stringify(jqXHR, null, 2));
        });     

        window.location.reload();
  }


function deviceSuccess(data, textStatus, jqXHR){
    console.log(data.devices)
    window.localStorage.setItem("devices", JSON.stringify(data.devices))
    
}

function deviceFailure(jqXHR, textStatus, errorThrown){
  console.log(jqXHR.responseText);
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


function updateUser() {
  // data validation
  /*if ($('#email').val() === "") {
      window.alert("invalid email!");
      return;
  }*/

  if ($('#password').val() === "") {
      window.alert("invalid password!");
      return;
  }
  if ($('#fullname').val() === "") {
      window.alert("invalid fullname!");
      return;
  }

  if ($('#passwordConfirm').val() === "") {
    window.alert("invalid passwordConfirm!");
    return;
}

if ($('#zip').val() === "") {
  window.alert("invalid zip!");
  return;
}

var strongRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  let strongPassword = !strongRegex.test(password)
  //strongPassword = false
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

let txdata = {email:email, 
  fullName:fullName, 
  //APIKEY: authorizationKey,
  password: password,
  zip: zip
};
console.log(txdata);

  $.ajax({
      url: '/students/update',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(txdata),
      dataType: 'json'
  })
  .done(function (data, textStatus, jqXHR) {
      $('#rxData').html(JSON.stringify(data, null, 2));
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
      $('#rxData').html(JSON.stringify(jqXHR, null, 2));
  });
}


/*
function updateAccInfo(){
  let email = $('#email').val();
  let password = $('#password').val();
  let fullName = $('#fullName').val();
  let passwordConfirm = $('#passwordConfirm').val();
  let zip = $('#zip').val();

  $.ajax({
    url: '/users/updateAccount',
    type: 'POST',
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

*/
/*
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

*/


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
  //  initDevices()
  }
 // $('#update').click(updateAccInfo);
  $('#btnUpdate').click(updateUser);
  $('#btnDelete').click(deleteDevices);
  $('#btnUpdate').click(updateDeviceList);
  //$('#remove').click(RemoveDevice);
  //console.log("account.js")
});