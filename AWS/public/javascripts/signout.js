$(function() {
  $('#signout').click(function() {
     window.localStorage.removeItem();
     window.location = "index.html";
  });
});