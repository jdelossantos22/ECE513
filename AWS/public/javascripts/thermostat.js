$("#thermostatDisplay").roundSlider({
    radius: 200,
    width:8,
    handleSize: "+16",
    handleShape: "dot",
    circleShape: "pie",
    sliderType: "min-range",
    value: 50,
    startAngle: 315,
    tooltipFormat: "changeTooltip",
    beforeCreate: function () {
        this.options.radius = this.control.parent().width() / 2;
    
        this["_bind"]($(window), "resize", function () {
          
          var radius = 200;
          let winRadius = this.control.parent().width();
          if (winRadius > 700){
              radius = 50;
          }
          else if (winRadius < 700){
              radius=200;
          }
          else{
              radius = winRadius/4;
          }
          this.option("radius", radius);
        });
      }
});

function changeTooltip(e) {
    var val = e.value;
    val = "<div id='thermostatMode'>HEATING</div>"; 
    val+= "<div id='thermostatTemp'>19 °F</div>";
    val+= "<div id='setTempLabel'>Set Temperature</div>";
    val += "<divclass='.rs-tooltip-text'>" + e.value + "°F</div>";
    return val
}