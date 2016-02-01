var didScroll,
    lastScrolltop,
    delta = 10,
    navbarheight = $('nav').outerHeight();


$(window).scroll(function(e){
  didScroll= true;
});

setInterval(function(){
  if (didscroll){
    hasScrolled();
    didscroll = false;
  }
}, 250);

function hasScrolled(){
  var scrltp = $(this).scrollTop();

  if (Math.abs(lastScrolltop - scrltp) <= delta)
    return;
  if (scrltp > lastScrolltop && st > navbarheight ){
    $('nav').removeClass('nav-down').addClass('nav-up');
    console.log('-----------------');
    console.log("Current Scroll " + scrltp);
    console.log("Last Scroll " + lastScrolltop);
  } else {
    $('nav').removeClass('nav-up').addClass('nav-down');
  }
  lastScrolltop = scrltp;
}
