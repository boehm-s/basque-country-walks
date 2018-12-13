(function($){
    $(function(){

	$('.sidenav').sidenav();
	$('.parallax').parallax();

	$(document).ready(function(){
	    $('.carousel').carousel({
		indicators: true,
		fullWidth: true
	    });
	});

	Array.from(document.getElementsByClassName('carousel-item')).forEach((item, i) => {
	    item.style.width = "100%";
	});
    }); // end of document ready
})(jQuery); // end of jQuery name space
