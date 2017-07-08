//var pointsArray = document.getElementsByClassName('point');
//var animatePoints = function(points) {
  var animatePoints = function(){
    var revealPoint = function(){
      $(this).css({
        opacity: 1,
        transform: 'scaleX(1) translateY(0)'
      });
    };
  $.each($('.point'), revealPoint);
};
  /*var revealPoint = function(index){
      points[index].style.opacity = 1;
      points[index].style.transform = "scaleX(1) translateY(0)";
      points[index].style.msTransform = "scaleX(1) translateY(0)";
      points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
    }

  for(var i = 0; i<points.length; i++)  {
    revealPoint(i);
  }*/

//animatePoints();
$(window).load (function(){
  if ($(window).height() > 950){
    animatePoints();
  }
  var scrollDistance =  $('.selling-points').offset().top - $(window).height() + 200;
  //var sellingPoints = document.getElementsByClassName('selling-points')[0];
  //var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight+200;
  //window.addEventListener('scroll', function(event){
  $(window).scroll(function(event){
    if($(window).scrollTop() >= scrollDistance){
      animatePoints();
    }
  });
    //if (document.documentElement.scrollTop || document.body.scrollTop>=scrollDistance){
      //animatePoints(pointsArray);
    //}
  });
