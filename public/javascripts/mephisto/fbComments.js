var api = null;
var guid = null;

function initComments() {
    FB_RequireFeatures(["Connect"],
    function() {
        // Create an ApiClient object, passing app's API key and
        // a site relative URL to xd_receiver.htm
        FB.init("a993b3c318314ae985788373988c52aa", "/connect/xd_receiver.htm");

        api = FB.Facebook.apiClient;

        if (api.get_session() != null) {
            FB.XFBML.Host.autoParseDomTree = false;
            var uid = api.get_session().uid;
						guid = uid;
            setAndCreateFBElements(uid);
            $('fbinfo').show();
        } else {
            $('fblogin').show();
        }
    });
}

function setAndCreateFBElements(uid) {
    $('fbname').writeAttribute('uid', uid);
    $('fbprofile-pic').writeAttribute('uid', uid);
		populateAuthor(uid);
    var fbname = new FB.XFBML.Name($('fbname'));
    var profilePic = new FB.XFBML.ProfilePic($('fbprofile-pic'));
    FB.XFBML.Host.addElement(fbname);
    FB.XFBML.Host.addElement(profilePic);
    FB.XFBML.Host.parseDomTree();
}

function fbLoginReady() {
    $('fblogin').hide();
    var api = FB.Facebook.apiClient;
    var uid = api.get_session().uid;
    setAndCreateFBElements(uid);
    $('fbinfo').show();

}

function populateAuthor(uid) {
    var sql = "SELECT name FROM user WHERE uid =" + uid;
    FB.Facebook.apiClient.fql_query(sql,
    function(result, ex) {
        var userName = result[0]['name'];
				$('comment_author').writeAttribute('value', userName);
    });
}

function streamPost() {
	// var attachment = {'name':'Google','href':'http://www.google.com/','description':'Google Home Page'};
	// FB.Connect.streamPublish('abc', attachment);
	var template_data = {"site":"<a href='http://espn.com'>test</a>"};
	FB.Connect.showFeedDialog(
	    124774407134, 
			template_data
	);
}
