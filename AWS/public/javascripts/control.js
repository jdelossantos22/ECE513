var gCtrlVar = {
    baseUrl: 'https://api.openweathermap.org/data/2.5/',
    apiKey: '5399b0dde9cf4901f36860ba0960fc8a',
    zip: '85721',
    country: 'us',
    unit:'imperial'            
};//api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}

var devices = [];
var user;
var setTemp = 0;

function httpGet(url){
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.addEventListener("load", function(){ displayResult(this)});
    xmlHTTP.open("GET", url, true);
    xmlHTTP.send();
}

function displayResult(evt){
    if(evt.status == 200){
        gRxData = JSON.parse(evt.responseText);
        $("#weather-temp-num").html(gRxData.main.temp + "&#176;");
        $("#weather-high").text(gRxData.main.temp_max);
        $("#weather-low").text(gRxData.main.temp_min);
        $("#weather-humidity").text(gRxData.main.humidity);
        $("#weather-wind").text(gRxData.wind.speed);
        $("#weather-city").text(gRxData.name);
        $("#weather-description").text(gRxData.weather[0].description);
        let date = new Date(gRxData.dt*1000);
        let dayName = date.toLocaleDateString(undefined,{weekday: 'long'})
        let hour = date.getHours();
        let minute = date.getMinutes();
        if (String(hour).length == 1) hour = '0' + hour;
        if (String(minute).length == 1) minute = '0' + minute;
        let dayTime = dayName + " " + hour + ":" + minute;
        $("#weather-date").text(dayTime);
        let iconUrl = "http://openweathermap.org/img/wn/" + gRxData.weather[0].icon + "@2x.png"
        $("#weather-icon img").attr("src", iconUrl);
        //console.log(JSON.stringify(gRxData));
    }
}

function convertToFarenheit(){
    gCtrlVar.unit='imperial';
    url = getUrl();
    httpGet(url);
    $("#farenheit").css({"color":"white"})
    $("#celsius").css({"color":"gray"})
}

function convertToCelsius(){
    gCtrlVar.unit='metric';
    url = getUrl();
    httpGet(url);
    $("#celsius").css({"color":"white"})
    $("#farenheit").css({"color":"gray"})
}

function getUrl(){
    url = gCtrlVar.baseUrl
    url += "weather?units="+ gCtrlVar.unit + "&";
    url += "zip=" + gCtrlVar.zip + "," + gCtrlVar.country + "&";
    url += "appid=" + gCtrlVar.apiKey;
    return url;
}
function getUserInfo(){
    
}
function initDevices(){
//items.find.sort( [['_id', -1]] ) // get all items desc by created date.
//sort by first added, first added is the primary device
    let decoded = window.localStorage.getItem("authToken");
    console.log(decoded);
    let userEmail = decoded.email;
    console.log(userEmail)
    let txdata = {
        email:userEmail
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
    for(let i = devices.length-1; i >=0; i--){
        console.log(devices.length)
        //javascript:updateDevice()
        if(i == 0){
            $("#devicesList").prepend(`<li><a class="dropdown-item devices" id="${devices[i].deviceId}" href="#" onclick="updateDevice(event)"><i class="bi bi-check"></i>${devices[i].deviceName}</a></li>`)
        }
        else{
            $("#devicesList").prepend(`<li><a class="dropdown-item devices" id="${devices[i].deviceId}" href="#" onclick="updateDevice(event)">${devices[i].deviceName}</a></li>`)
        }
        //$(".devices").click(updateGUI)
    }
    $("#deviceHeader").text(devices[0].deviceName)
    let txdata = {
        device:{
            id:devices[0].deviceId,
            token:devices[0].apikey
        }
    }

    $.ajax({
        url: '/particle/device',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType:'json'
    }).done(function(data,textStatus,jqXHR){
        console.log(data);
    }).fail(deviceFailure)

}
function updateDevice(e){
    console.log("UPDATE DEVICES");
    let id = e.target.id;
    console.log(id)
    let devices = window.localStorage.getItem("devices");
    let index;
    
    devices = JSON.parse(devices)
    let apikey;
    $(".devices i").remove()
    //console.log(devices)
    for(let i = 0; i < devices.length; i++){
        if(devices[i].deviceId == id){
            index=i;
            console.log(devices[i].deviceName)
            $("#deviceHeader").text(devices[i].deviceName)
            apikey = devices[i].apikey
        }
    }
    $(".devices").each((i) =>{
        if(i == index){
            $(e.target).prepend('<i class="bi bi-check"></i>')
        }
    })
    
    let txdata = {
        device:{
            id:id,
            token:apikey
        }
    }
    $.ajax({
        url: '/particle/device',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType:'json'
    })

    
    
    
}
function deviceFailure(jqXHR, textStatus, errorThrown){
    console.log(jqXHR.responseText);
}

function initThermostat(){

}
function get_zip_code(){
    var userEmail = window.localStorage.getItem("email")

}

//from get user info, i can get devices from user email
function changeMode(e){
    let mode = e.target.id
    $(".mode").removeClass("btn-dark")
    $(".mode").addClass("btn-light")
    $("#thermostatMode").removeClass()
    //e.target.parentNode.classList.toggle("btn-light")
    e.target.parentNode.classList.add("btn-dark")
    switch(mode){
        case 'off':
            console.log('OFF');
            $("#thermostat").css("background","linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(93,93,93,1) 100%)");
            $("#thermostatMode").text("OFF")
            $("#thermostatMode").addClass("off")
            $("#tempVal").addClass("off")
            break;
        case 'cold':
            console.log('COLD');
            $("#thermostat").css("background","linear-gradient(90deg, #1CB5E0 0%, #000851 100%)");
            $("#thermostatMode").text("COOLING")
            $("#thermostatMode").addClass("cold")
            $("#tempVal").addClass("cold")
            break;
        case 'heat':
            console.log('HEATSS');
            $("#thermostat").css("background","linear-gradient(90deg, #d53369 0%, #daae51 100%)");
            $("#thermostatMode").text("HEATING")
            $("#thermostatMode").addClass("heat")
            $("#tempVal").addClass("heat")
            break;
        default:
            break;
    }
}

function changeFanMode(e){
    let fanMode = e.target.id;
    $(".fan").removeClass("btn-dark");
    $(".fan").addClass("btn-light");
    e.target.parentNode.classList.add("btn-dark");
    switch(fanMode){
        case "on":
            console.log("Fan ON");
            break;
        case "auto":
            console.log("Fan AUTO");
            break;
    }
}



$(function(){
    //review auth token first
    $.ajax({
        url: '/users/status',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("authToken") },
        dataType: 'json'
      })
      .done(function (data, textStatus, jqXHR) {
        //console.log(data)
        user = data;
        
        //get user info first to get zip code
        //get open weather
        //if no zip code, set zip code to u of a
        gCtrlVar.zip = user[0].zip
        //console.log(gCtrlVar.zip)
        url = getUrl();
        httpGet(url);
        initDevices()

      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        window.localStorage.removeItem();
        window.location = "index.html";
    });
    //initThermostat();
    //$("#devicesList").on("click", ".devices", updateGUI)//.click(updateGUI)
    $("#farenheit").click(convertToFarenheit);
    $("#celsius").click(convertToCelsius);
    $("input[name='mode']").change(changeMode)
    $("input[name='fan']").change(changeFanMode)
});




    
    
