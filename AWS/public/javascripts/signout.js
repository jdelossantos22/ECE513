$(function() {
  $('#signout').click(function() {
     window.localStorage.clear();
     window.location = "index.html";
  });
});