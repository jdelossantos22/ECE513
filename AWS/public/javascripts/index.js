var myInterval = null;
var guiUpdated = false;
var samplingPeriod = 1/5;
var simTime;
$(function (){
    initRangeSliders();
});

function initRangeSliders() {
    var inputs = $('input[type="range"]');
    var ranges = {};
    for (var i = 0; i < inputs.length; i++) {
        var id = $(inputs[i]).attr("id");
        var $element = $('input[id=\"' + id + '\"]');
        $element
        .rangeslider({
            polyfill: false,
            onInit: function () {
            ranges[id] = this.$range;
            var $handle = $('.rangeslider__handle', this.$range);
            updateHandle($handle[0], this.value);
            }
        })
        .on('input', function () {
            var $handle = $('.rangeslider__handle', ranges[this.id]);
            updateHandle($handle[0], this.value);
        });
    }
}

function updateHandle(el, val) {
    el.textContent = val;
}

function changeSamplingPeriod(val){
  samplingPeriod = val
}

function updateGUI(data) {
    if (!guiUpdated) {
        if ("light" in data) {
        if ("L0" in data.light) $('#smartlightonoff').prop("checked", data.light.L0).change(); 
        if ("L1" in data.light) $('#smartlightMode').prop("checked", data.light.L1).change();
        if ("b" in data.light) $('#birghtnessSlider').val(data.light.b).change();
        if ("m" in data.light) $('#sensorMinSlider').val(data.light.m).change();
        if ("M" in data.light) $('#sensorMaxSlider').val(data.light.M).change();
        }
        if ("led" in data) {
        if ("h" in data.led) $('#ledHzSlider').val(data.led.h).change();
        }
        guiUpdated = true;
    }
    if ("light" in data) {
        if ("s" in data.light) $("#sensorVal").html( data.light.s);
        if ("b" in data.light) {
            $('#curBrightness').css("background-color", `hsl(61, ${data.light.b}%, 50%)`);
            $('#curBrightness').html(data.light.b);
            /*if (data.light.b <= 50) $("#door").text("Door Open")
            else  $("#door").text("Door Closed")*/
        }
    }
    if ("thermostat" in data){
        if ("t" in data.thermostat) $("#tempVal").html(data.thermostat.t.toFixed(2) + " °F");
        if ("h" in data.thermostat) $("#humidity").html(data.thermostat.h.toFixed(2) + " %");
    }
    if("door" in data){
      if ("d" in data.door) {
          if (data.door.d == 'open'){
              $("#openIcon").text("&#128308");       // Red Circle
              $("#closedIcon").text("&#9898");       // White Circle

              setInterval(function() {sendAlert();}, 10000);   // Send alert after 10s of door being opened
          }
          else{
              $("#door").css("color", "black");
              $("#door").text("No Alert to Report.");
              $("#openIcon").text("&#9898");         // White Circle
              $("#closedIcon").text("&#128994");     // Green Circle
          }
      }
  }
  if ("simclock" in data) $('#curTime').html(data.simclock);
}

function sendAlert(){
  $("#door").css("color", "red");
  $("#door").text("ALERT: DOOR HAS BEEN OPEN FOR AN EXTENDED PERIOD OF TIME (15s)!!!");
}

function changeColor(value){
  
  var value = value.match(/[A-Za-z0-9]{2}/g);
  value = value.map(function(v) { return parseInt(v, 16) });
  console.log(value)
  

}

function smartLightControl(option, value) {
    let txcmd = {
      smartlight: { }
    };
    txcmd.smartlight[option] = value;

    console.log(JSON.stringify(txcmd));
    //serailCmd(txcmd);
    cloudCmd(txcmd);
    }
function thermostatControl(option, value) {
    let txcmd = {
      thermostat: { }
    };
    txcmd.thermostat[option] = value;

    console.log(JSON.stringify(txcmd));
    //serailCmd(txcmd);
    cloudCmd(txcmd);
  }
function toggleLedControl(value) {
    let txcmd = {
      led: {frequency: value}
    };
    console.log(JSON.stringify(txcmd));
    //serailCmd(txcmd);
    cloudCmd(txcmd);
}

function pingTest() {
  console.log("PING")
    $.ajax({
      url: '/particle/ping',
      method: 'GET',
      dataType: 'json'
    }).done(particleSuccess).fail(particleFailure);
}
  
  function readData() {
    $.ajax({
      url: '/particle/read',
      method: 'GET',
      dataType: 'json'
    }).done(particleSuccess).fail(particleFailure);
  }

  function enableDisablePublish() {
    let bPublish;
    if ($('#btnEnablePublish').html() == 'Enable publish') bPublish = true;
    else bPublish = false;
    let cmd = {
      publish: bPublish
    };
    console.log(JSON.stringify(cmd));
    $.ajax({
      url: '/particle/publish',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(cmd),
      dataType: 'json'
    }).done(particleSuccess).fail(particleFailure);
  }

  function cloudCmd(cmd){
    console.log(JSON.stringify(cmd));
      $.ajax({
        url: '/particle/publish',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cmd),
        dataType: 'json'
    }).done(particleSuccess).fail(particleFailure);
  }

  function publish(){
    let cmd = {
        publish: true
    };
      console.log(JSON.stringify(cmd));
      $.ajax({
        url: '/particle/publish',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cmd),
        dataType: 'json'
      }).done(particleSuccess).fail(particleFailure);

  }
  
  function particleSuccess(data, textStatus, jqXHR) {
    $('#cmdStatusData').html(JSON.stringify(data, null, 2));
    
    if ("cmd" in data) {
      if (data.cmd === "ping") {
        if ("online" in data.data) {
          if (data.data.online) {
            $('#ping_status').val('Online');
          }
          else $('#ping_status').val('Offline');
        }
      }
      else if (data.cmd === "read") {
        if ("simclock" in data.data) $('#curTime').html(data.data.simclock);
        updateGUI(data.data);
        //update dbs
        saveTemperature(data.data);
        
      }
      else if ((data.cmd === "publish") && (data.success)){
        if ($('#btnEnablePublish').html() == 'Enable publish') {
          $('#btnEnablePublish').html('Disable publish'); 
          myInterval = setInterval(readData, 1000*samplingPeriod);
        }
        else {
          $('#btnEnablePublish').html('Enable publish');
          if (myInterval != null) {
            clearInterval(myInterval);
            myInterval = null;
          }
        }
      }          
    }
    //updateGUI(data.data);
  }

  function saveTemperature(data){
    //let simClock = new Date(data.simclock)
    //if()
    let deviceId = $(".devices:has(i)")[0].id;
    console.log($(".devices:has(i)")[0].id)
    let thermostatData = data.thermostat;
    let temperature = thermostatData.t;
    let humidity = thermostatData.h;
    simTime = data.simclock;
    let power = thermostatData.w
    let txdata = {
      id:deviceId,
      postDate:simTime,
      temperature:temperature,
      humidity:humidity,
      power:power
    }
    console.log(txdata)
    
    $.ajax({
      url: '/temperature/create',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(txdata),
      dataType: 'json'
    }).done((data, textStatus, jqXHR) => {console.log(data)})
    .fail(particleFailure);
    
    /*
    txdata = {
      id:deviceId,
      postDate:simTime,
      power:power
    }
    console.log(txdata)
    
    $.ajax({
      url: '/power/create',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(txdata),
      dataType: 'json'
    }).done((data, textStatus, jqXHR) => {console.log(data)})
    .fail(particleFailure);*/
  }
 
  function particleFailure(jqXHR, textStatus, errorThrown) {
    $('#cmdStatusData').html(JSON.stringify(jqXHR, null, 2));
  }
//to do get device checked and send it with every ajax call
