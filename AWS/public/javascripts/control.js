var gCtrlVar = {
    baseUrl: 'https://api.openweathermap.org/data/2.5/',
    apiKey: '5399b0dde9cf4901f36860ba0960fc8a',
    zip: '85721',
    country: 'us',
    unit:'imperial'            
};//api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}

var devices = [];

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
        let dayTime = dayName + " " + date.getHours() + ":" + date.getMinutes();
        $("#weather-date").text(dayTime);
        let iconUrl = "http://openweathermap.org/img/wn/" + gRxData.weather[0].icon + "@2x.png"
        $("#weather-icon img").attr("src", iconUrl);
        console.log(JSON.stringify(gRxData));
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
}

function initThermostat(){

}
function get_zip_code(){
    var userEmail = window.localStorage.getItem("email")

}

$(function(){
    //review auth token first
    //get user info first to get zip code
    //get open weather
    //if no zip code, set zip code to u of a
    url = getUrl();
    httpGet(url);
    //from get user info, i can get devices from user email
    //initDevicees()
    //initThermostat();

    $("#farenheit").click(convertToFarenheit);
    $("#celsius").click(convertToCelsius);
    
});