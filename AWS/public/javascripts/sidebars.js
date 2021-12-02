/* global bootstrap: false */
$(function () {
  'use strict'
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
  /*
  $('#sidebarToggle').on('click', function () {
    
    var isHidden = $(".menuText").is(":hidden");
    $(".menuText").attr('hidden', !isHidden);
    $('#sidebar').toggleClass('sidebarActive sideBarCollapse');
  });
  */

})
