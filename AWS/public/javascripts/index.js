var myInterval = null;
var guiUpdated = false;
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
        if ("t" in data.thermostat) $("#tempVal").html(data.thermostat.t);
        if ("h" in data.thermostat) $("#humidity").html(data.thermostat.h);
    }
    if("door" in data){
        if ("d" in data.door) {
            if (data.door.d == 'open'){
                $('#door').css("background-color", "red");
                $("#door").text(data.door.d);
            }
            else{
                $('#door').css("background-color", "green");
                $("#door").text(data.door.d);
            }
        }
    }
    if ("simclock" in data) $('#curTime').html(data.simclock);
}



function smartLightControl(option, value) {
    let txcmd = {
        cmd: "write",
        data: {
        smartlight: { }
        }
    };
    txcmd.data.smartlight[option] = value;

    console.log(JSON.stringify(txcmd));
    serailCmd(txcmd);
    }

function toggleLedControl(value) {
    let txcmd = {
        cmd: "write",
        data: {
        led: {frequency: value}
        }
    };
    console.log(JSON.stringify(txcmd));
    serailCmd(txcmd);
}

function thermostatControl(value){
    let txcmd = {
        cmd: "write",
        data: {
        thermostat: {frequency: value}
        }
    };
}

function pingTest() {
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
    updateGUI(data.data);
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
      }
      else if ((data.cmd === "publish") && (data.success)){
        if ($('#btnEnablePublish').html() == 'Enable publish') {
          $('#btnEnablePublish').html('Disable publish'); 
          myInterval = setInterval(readData, 1000);
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
  }
 
  function particleFailure(jqXHR, textStatus, errorThrown) {
    $('#cmdStatusData').html(JSON.stringify(jqXHR, null, 2));
  }