/* globals Chart:false, feather:false */

// Graphs
var daily = document.getElementById('powerDailyChart')
var weekly = document.getElementById('powerWeeklyChart')
var user;
// eslint-disable-next-line no-unused-vars
var dailyChart = new Chart(daily, {
  type: 'line',
  data: {
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    datasets: [{
      data: [
        15339,
        21345,
        18483,
        24003,
        23489,
        24092,
        12034
      ],
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
      text: "Daily Power Usage"
  }
  }
});
var weeklyChart = new Chart(weekly, {
  type: 'line',
  data: {
    labels: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    datasets: [{
      data: [
        15339,
        21345,
        18483,
        24003,
        23489,
        24092,
        12034
      ],
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
      text: "Weekly Power Usage"
  }
  }
});

function initDevices(){
  //items.find.sort( [['_id', -1]] ) // get all items desc by created date.
  //sort by first added, first added is the primary device
      let txdata = {
          email:user[0].email
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

function initGUI(){
  var today = new Date();
  today = today.setHours(0,0,0,0);
  var date = new Date()
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate();
  if (String(day).length == 1) day = "0" + day;
  if (String(month).length == 1) month = "0" + month;
  console.log(`${year}-${month}-${day}`)
  $("#datePicker").val(`${year}-${month}-${day}`)
  console.log($(".devices:has(i)"))
  let device = $(".devices:has(i)")[0].id;
  updateGUI(today, device);
}

function weekChange(){
  let selectedWeek = $("#weekPicker").val();
  console.log(selectedWeek)
  let yearRe = /^(\d{4})/;
  let year = yearRe.exec(selectedWeek)[1];
  console.log(year)
  let weekRe = /W(\d{2})$/;
  let week = weekRe.exec(selectedWeek)[1];
  console.log(week)
  let startDate = getDateOfWeek(week, year)
  console.log(startDate)
  let device = $(".devices:has(i)")[0].id;
  updateGUI(startDate, device);
}

function getDateOfWeek(w, y) {
  var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

  return new Date(y, 0, d);
}

function updateGUI(date, id){
  let jsonStr = JSON.stringify({date:date,id:id})
  $.ajax({
    url: '/power/readAll',
    method: 'POST',
    contentType: 'application/json',
    data: jsonStr,
    dataType:'json'
  }).done(powSuccess).fail(powFailure);
}
function powSuccess(data, textStatus, jqXHR){
  let week = []
  console.log(data)
  /*for(let i = 0; i < 7; i++){

  }*/
  
}
function powFailure(jqXHR, textStatus, errorThrown){
  console.log(jqXHR.responseText);
  $("#data").text(JSON.stringify(jqXHR, null, 2))
}

$(function () {
  $.ajax({
    url: '/users/status',
    method: 'GET',
    headers: { 'x-auth' : window.localStorage.getItem("authToken") },
    dataType: 'json'
  })
  .done(function (data, textStatus, jqXHR) {
    console.log(data)
    user = data;
    initDevices();
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    window.localStorage.removeItem('authToken');
    window.location = "index.html";
  });
    feather.replace({ 'aria-hidden': 'true' })
    
  });
  