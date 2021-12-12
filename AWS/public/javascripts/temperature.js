var xValues = ["00:00", "01:00","02:00",];
var tempValues = [];
var humidValues = [];
var tHigh =0,tLow=300, tAvg=0, hHigh=300,hLow=0,hAvg=0
var temp = document.getElementById('tempChart')
var user = [{email:'admin@email.arizona.edu'}];
var humid = document.getElementById('humidChart')
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let tempTitle = `Temperature for December 12, 2021`;
let humidTitle = `Humidty for December 12, 2021`;




function initGUI(){
    var today = new Date();
    let offset = today.getTimezoneOffset();
    today = today.setHours(0,0,0,0);
    //console.log(typeof(today))
    today = today - offset;
    var date = new Date()
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    if (String(day).length == 1) day = "0" + day;
    if (String(month).length == 1) month = "0" + month;
    console.log(`${year}-${month}-${day}`)
    $("#datePicker").val(`${year}-${month}-${day}`)
    today = new Date($("#datePicker").val())
    today = today.setHours(0,0,0,0);
    console.log($(".devices:has(i)"))
    let device = $(".devices:has(i)")[0].id;
    console.log(`initGUI ${today}`)
    //today = new Date(`${year}-${month}-${day}`)
    updateGUI(today, device);
}


function dateChange(){
  let selectedDate = $("#datePicker").val();
  console.log(`selectedDate ${selectedDate})`)
  var date = new Date(selectedDate);
  
  date = date.setHours(0,0,0,0);
  console.log(`dateChange ${date}`)
  console.log(date)
  let device = $(".devices:has(i)")[0].id;
  updateGUI(date, device);
}

function initDevices(){
//items.find.sort( [['_id', -1]] ) // get all items desc by created date.
//sort by first added, first added is the primary device
    let txdata = {
        email:window.localStorage.getItem("email")
    }
    $.ajax({
        url: '/device/findAll',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType:'json'
    }).done(deviceSuccess).fail(deviceFailure);     
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
  dateChange();
  
}


function deviceSuccess(data, textStatus, jqXHR){
  console.log(data.devices)
  //window.localStorage.setItem("devices", JSON.stringify(data.devices))
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
  initGUI();
}

function deviceFailure(jqXHR, textStatus, errorThrown){
  console.log(jqXHR.responseText);
}

function updateGUI(date, id){
  /*
    const token = localStorage.getItem("authToken");
    const respons = await fetch("/users/status",{
      headers: {"X-Auth": token }
    });

    if (respons.status.ok){}  */
    let jsonStr = JSON.stringify({date:date, id: id})
    console.log(jsonStr)
    let jsonData = JSON.parse(jsonStr)
    console.log(jsonData)
    
    $.ajax({
        url: '/temperature/readAll',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({date:date,id:id,email:user[0].email}),
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
    
    xValues=[];
    tempValues=[];
    humidValues=[];
    for(let i = 0; i < data.length; i++){
        let date = new Date(data[i].postDate);
        console.log(typeof date);
        let hour = date.getHours();
        let min = date.getMinutes();
        if (String(hour).length == 1) hour = '0' + hour
        if (String(min).length == 1) min = '0' + min
        /*
        if((parseInt(min) % 10 == 0)|| parseInt(min)%10 == 1 || parseInt(min)%10 == 9){// || parseInt(min)%10 == 1 || parseInt(min)%10 == 9
          xValues.push(`${hour}:${min}`)
          
        }
        else{
          xValues.push('');
        }*/
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
    $("#tlastChecked").html(data[data.length-1].postDate)
    $("#hlastChecked").html(data[data.length-1].postDate)

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
    tempTitle = `Temperature(°F)`;// for ${month} ${day}, ${year}
    humidTitle = `Humidty(%)`;
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
        responsive: true,
        aspectRatio: 2,
        maintainAsepctRatio: true,
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
        responsive: true,
        aspectRatio: 2,
        maintainAsepctRatio: true,
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
    });
    
}

function tempFailure(jqXHR, textStatus, errorThrown){
    console.log(jqXHR.responseText);
    $("#data").text(JSON.stringify(jqXHR, null, 2))
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
    
    initDevices();
    
    
    
});