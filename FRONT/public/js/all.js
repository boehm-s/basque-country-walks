window.fbAsyncInit = function() {
    FB.init({
	appId      : '1639639556137911',
	cookie     : true,
	xfbml      : true,
	version    : 'v3.2'
    });

    FB.AppEvents.logPageView();
    console.log("FB thing ...");

    (function getFacebookUID() {
	FB.getLoginStatus(function(response) {
	    if (response.status === 'connected') {
		console.log('got FB ID ... ');
		window.FB_ID = response.authResponse.userID;
	    } else {
		setTimeout(function() {
		    getFacebookUID();
		}, 50);
	    }
	});
    })();
};


(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
