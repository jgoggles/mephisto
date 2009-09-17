// Configuration - This is filled out by the rake task or you can manually edit it.
var api_key = "<api_key>";
var template_id = "<template_id>";
var site_name = "<site_name>";

// Global variables
var api = null;
var guid = null;
var user_data = new Array();

function initComments() {
    FB_RequireFeatures(["Connect"],
    function() {
        // Create an ApiClient object, passing app's API key and
        // a site relative URL to xd_receiver.htm
        FB.init(api_key, "/connect/xd_receiver.htm");

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
    if ($('comment-form') != null) {
        populateAuthor(uid);
        var fields = [$('comment_author'), $('comment_author_url'), $('comment_author_email')];
        fields.each(function(s) {
            $(s).writeAttribute('type', 'hidden');
            $(s).siblings()[0].hide();
        });

        $('comment-form').writeAttribute('name', 'commentform');
        $('submit').writeAttribute('name', 'submit2');
        $('submit').writeAttribute('id', 'submit2');
        $('comment-form').writeAttribute('onSubmit', 'return streamPost(this.comment.value)');
    } else {
				$('commentingOptions').hide();
		}

    $('fbname').writeAttribute('uid', uid);
    $('fbprofile-pic').writeAttribute('uid', uid);
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


function streamPost(comment) {
    var template_data = {
        "site": site_name,
				"post_title" : "",
				"body" : ""
    };

    FB.Connect.showFeedDialog(
    template_id,
    template_data,
    null, null, null, FB.RequireConnect.require, submitComment, "fu",
    comment
    );
    return false;
}

function setUserData(uid) {
    var sql = "SELECT first_name FROM user WHERE uid =" + uid;
    FB.Facebook.apiClient.fql_query(sql,
    function(result, ex) {
        user_data['first_name'] = result[0]['first_name'];
    });
}

function streamPublish() {
    var attachments = {
        'name': 'Blog Post Name Here',
        'href': 'http://www.google.com',
        'caption': user_data['first_name'] + ' commented on this post',
        'description': 'This will be the first however many words of the article...',
        'properties': {
            'site': {
                'text': 'TechCrunch',
                'href': 'http://www.techcrunch.com'
            }
        }
    };
    FB.Connect.streamPublish('abc', attachments, '', '', 'Your comment');
}

function submitComment() {
    document.commentform.submit();
}

function afterLogout() {
    $('fblogin').show();
    $('fbinfo').hide();
    var fields = [$('comment_author'), $('comment_author_url'), $('comment_author_email')];
    fields.each(function(s) {
        $(s).writeAttribute('type', 'input');
        $(s).siblings()[0].show();
    });
}