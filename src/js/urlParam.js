//modified from http://www.jquery4u.com/snippets/url-parameters-jquery/

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	
	if ( results && results.length > 0 ) {
	    return decodeURIComponent(results[1]);
	}
	return undefined;
}