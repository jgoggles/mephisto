var api = null;
var guid = null;
var user_data = new Array();

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
    	    setUserData(uid);
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
    setUserData(uid);
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

function setUserData(uid) {
   var sql = "SELECT first_name FROM user WHERE uid =" + uid;
    FB.Facebook.apiClient.fql_query(sql,
    function(result, ex) {
        user_data['first_name'] = result[0]['first_name'];	
    });
}

function streamPublish() {
    var attachments = { 'name':'Blog Post Name Here',
			'href':'http://www.google.com',
			'caption': user_data['first_name'] + ' commented on this post',
			'description':'This will be the first however many words of the article...',
			'properties':{'site':{'text':'TechCrunch','href':'http://www.techcrunch.com'}}};
    FB.Connect.streamPublish('abc',attachments,'','','Your comment');
}






