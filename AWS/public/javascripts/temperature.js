var xValues = [];
var tempValues = [];
var humidValues = [];
var tHigh =0,tLow=300, tAvg=0, hHigh=300,hLow=0,hAvg=0
var temp = document.getElementById('tempChart')
var humid = document.getElementById('humidChart')
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];





function initGUI(){
    var today = new Date();
    today = today.setHours(0,0,0,0);
    updateGUI(today);
}

function updateGUI(date){
    let jsonStr = JSON.stringify({date:date})
    console.log(jsonStr)
    let jsonData = JSON.parse(jsonStr)
    console.log(jsonData)
    
    $.ajax({
        url: '/temperature/readAll',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({date:date}),
        dataType:'json'
    }).done(tempSuccess).fail(tempFailure);
    
}

function findMin(num, low){
    if (num < low) low = num
    return low
}

function findMax(num, high){
    if (num > high) high = num
    return high
}
function average(num){

}
//for the initGUI
function getDevice(){
    //get device for a dropdown list of device
}
function tempSuccess(data, textStatus, jqXHR){
    console.log(data)
    tAvg = 0, tLow = 300, tHigh = 0, hAvg = 0, hLow = 300, hHigh= 0;
    
    
    for(let i = 0; i < data.length; i++){
        let date = new Date(data[i].postDate);
        console.log(typeof date);
        let hour = date.getHours();
        let min = date.getMinutes();
        if (String(hour).length == 1) hour = '0' + hour
        if (String(min).length == 1) min = '0' + min
        xValues.push(`${hour}:${min}`);
        tempValues.push(data[i].temperature);
        humidValues.push(data[i].humidity);

        //min
        tLow = findMin(data[i].temperature, tLow);
        hLow = findMin(data[i].humidity, hLow);

        //max
        tHigh = findMax(data[i].temperature, tHigh);
        hHigh = findMax(data[i].humidity, hHigh);

        //avg
        tAvg += data[i].temperature;
        hAvg += data[i].humidity;
    }
    console.log(hAvg)
    tAvg = tAvg/data.length;
    hAvg = hAvg/data.length;

    //change gui
    $("#temp").text(data[data.length-1].temperature.toFixed(2))
    $("#humid").text(data[data.length-1].humidity.toFixed(2))
    $("#lastChecked").html(data[data.length-1].postDate)

    $("#tHigh").text(tHigh.toFixed(2))
    $("#tLow").text(tLow.toFixed(2))
    $("#tAvg").text(tAvg.toFixed(2))

    $("#hHigh").text(hHigh.toFixed(2))
    $("#hLow").text(hLow.toFixed(2))
    $("#hAvg").text(hAvg.toFixed(2))

    let date = new Date(data[0].postDate)
    let year = date.getFullYear();
    let month = date.getMonth();
    month = monthNames[month];
    let day = date.getDate();
    let tempTitle = `Temperature for ${month} ${day}, ${year}`;
    let humidTitle = `Humidty for ${month} ${day}, ${year}`;
    if (String(day).length == 1) day = '0' + day
    console.log(xValues)
    var tempChart = new Chart(temp, {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [{
            data: tempValues,
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 4,
            pointBackgroundColor: '#007bff',
            fill: true
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false
              }
            }]
          },
          legend: {
            display: false
          },
          
        title: {
            display: true,
            text: tempTitle
        }
        }
    })
    var humidChart = new Chart(humid, {
        type: 'line',
        data: {
          labels: xValues
          ,
          datasets: [{
            data: humidValues,
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 4,
            pointBackgroundColor: '#007bff'
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false
              }
            }]
          },
          legend: {
            display: false
          },
          title: {
            display: true,
            text: humidTitle
        }
        }
    })
}

function tempFailure(jqXHR, textStatus, errorThrown){
    console.log(jqXHR.responseText);
}
function generateTemp(){
    let today = new Date();
    let hour = 1000*60*60;
    let newHour;
    today = today.setUTCHours(7,0,0,0);
    for(let i = 0; i < 24;i++){
        newHour = new Date(today + i*hour);

        let temp = Math.random()*100;
        let humidity = Math.random()*50;
        let txdata = {
            postDate:newHour,
            temperature: temp,
            humidity: humidity
        }
        //console.log(newHour)
        //console.log(JSON.stringify(txdata))
        
        $.ajax({
            url: '/temperature/create',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType:'json'
        }).done(tempSuccess).fail(tempFailure);
        
    }

}
$(function() {
    //generateTemp();
    initGUI();
    
});