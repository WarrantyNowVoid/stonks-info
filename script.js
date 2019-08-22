var refresh = 60000; // 1 min, the fastest current.json will update
var threshholds = {
  "NONE": [-Infinity, 0],
  "LOW": [0.01, 0.7],
  "MEDIUM": [0.71, 1],
  "HIGH": [1.01, 1.5],
  "INSANE": [1.51, Infinity]
};
var shakes = {
  "NONE": "",
  "LOW": "shake-little",
  "MEDIUM": "shake",
  "HIGH": "shake-hard",
  "INSANE": "shake-crazy"
}
var endpoint = "current.json";

var getChangeScale = function(changePercent){
  var pct = Math.abs(changePercent);
  for(th in threshholds){
    if(pct >= threshholds[th][0] && pct <= threshholds[th][1]){
      return th;
    }
  }

  throw "AHHHHH WHAT THE FUUUUUUCK: " + changePercent;
}

var fixHeights = function(){
  $("html, body").css("height", window.innerHeight);
  $("#stonksman").css("top", window.innerHeight);
}

var fetchStonks = function(){ 
  $.getJSON(endpoint, function(data){
    updateStonks((((data.current - data.last_close) / data.last_close) * 100).toFixed(2));
  });
}

var updateStonks = function(changePercent){
  var stonksClass = (changePercent >= 0 ? "good" : "bad") + "-stonks",
      scale = getChangeScale(changePercent),
      shakeClass = shakes[scale];

  console.log("change: " + changePercent + "%");
  console.log("this is " + scale + " amounts of " + stonksClass);

  if($("body").hasClass("init")){
    // first load
    $("#spokestonks").text("stonks");
    $("#stonksman").hide();
    $("body").addClass(stonksClass);
    $("body.init canvas").addClass("animated").addClass("bounceOutUp");
    $("body.init canvas").on("animationend", function() {
      space.stop();
      space.removeAll();
      $("body.init canvas").remove();
      $("body").removeClass("init");

      $("#stonksman").addClass("animated").addClass("rollIn");
      $("#stonksman").show();
      $("#stonksman").on("animationend", function() { 
        $("#stonksman").removeClass().addClass(shakeClass).addClass("shake-constant");
      });
    });
    window.setInterval(fetchStonks, refresh);
  }else{
    $("body").removeClass().addClass(stonksClass);
    $("#stonksman").removeClass().addClass(shakeClass).addClass("shake-constant");
  }
}

$(window).resize(function(){ fixHeights(); });

$(document).ready(function(){
  fixHeights();
  // make sure we have a second (or two) to load everything first
  window.setTimeout(fetchStonks, 2000);

  // Pts is fucking amazing and it is a crime to use it for this horseshit
  // example from: https://ptsjs.org/demo/?name=create.noisePts
  Pts.quickStart( "body.init", "#ffffff" );

  let noiseLine = [];
  let noiseGrid = [];

  space.add({ 

    start: (bound) => {

      // Create a line and a grid, and convert them to `Noise` points
      let ln = Create.distributeLinear( [new Pt(0, space.center.y), new Pt(space.width, space.center.y)], 30 );
      let gd = Create.gridPts( space.innerBound, 20, 20 );
      noiseLine = Create.noisePts( ln, 0.1, 0.1 );
      noiseGrid = Create.noisePts( gd, 0.05, 0.1, 20, 20 );
    },

    animate: (time, ftime) => {

      // Use pointer position to change speed
      let speed = space.pointer.$subtract( space.center ).divide( space.center ).abs();

      // Generate noise in a grid
      noiseGrid.map( (p) => {
        p.step( 0.01*speed.x, 0.01*(1-speed.y) );
        form.fillOnly("#123").point( p, Math.abs( p.noise2D() * space.size.x/18 ) );
      });

      // Generate noise in a line
      let nps = noiseLine.map( (p) => {
        p.step( 0.01*(1-speed.x), 0.05*speed.y );
        return p.$add( 0, p.noise2D()*space.center.y );
      });

      // Draw wave
      nps = nps.concat( [space.size, new Pt( 0, space.size.y )] );
      form.fillOnly("rgba(0,140,255,.65)").polygon( nps );
      form.fill("#fff").points( nps, 2, "circle");
    }

  });

  space.play();
});