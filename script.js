var fixHeights = function(){
  $('html, body').css('height', window.innerHeight);
  $('#stonksman').css('top', window.innerHeight);
}

$(window).resize(function(){ fixHeights(); });

$(document).ready(function(){
  fixHeights();
});