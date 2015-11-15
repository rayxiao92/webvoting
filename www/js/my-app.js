// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;
var currentUser = null;
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}





function getListHTMLFromElem (elem, index) {


               return  '   <li class="post-unit"> ' + 
                 '     <div class="post-unit-textblock"> ' + 
                 '       <div class = "post-author">' + 
                 '       <img class = "post-author-image" src="'+ 'https://graph.facebook.com/100001392284681/picture?width=64&height=64' +'">' +
                 '<span class = "post-author-text">'+ elem[1].get("nickname") +'</span>' +'</div> ' +                  
                 '       <div class = "post-title">' + elem[0].get("title") + '</div> ' + 
                 '       <div class = "post-address">' + elem[0].get("address") +'</div> ' + 

                 '     </div> ' + 
                 '     <div class="goto-site" onclick = "openUrl(\''+elem[0].get("address") +'\', false)" ></div>' + 
                 '     <div class = "post-voting-area"> ' + 
                 '       <i class="fa fa-angle-up fa-2x" id="voting-up-arrow-'+index+'" ></i> ' + 
                 '       <div class="post-voting-text" id="voting-number-'+index+'">'+ (elem[0].get("ups") - elem[0].get("downs")) +'</div> ' + 
                 '       <i class="fa fa-angle-down fa-2x" id="voting-down-arrow-'+index+'" ></i> ' + 
                 '     </div> ' + 
                 '     <div class="vote-up-sensitive" onclick="voteUp('+index+')"></div>' + 
                 '     <div class="vote-down-sensitive" onclick="voteDown('+index+')"></div>' + 
                 '   </li> '
}

function animateEffect(selector, effect) {
  $(selector).addClass('animated ' + effect);
  setTimeout(function(){
    $(selector).removeClass('animated ' + effect);
  }, 1000)  
}


function voteUp(index) {
  var number = document.getElementById("voting-number-"+index).innerHTML
  animateEffect("#voting-up-arrow-"+index, "bounce")
  $("#voting-up-arrow-"+index).css("color", "#55acee")
  document.getElementById("voting-number-"+index).innerHTML  = parseInt(number) + 1
}
function voteDown(index) {
  var number = document.getElementById("voting-number-"+index).innerHTML
  // animateEffect("#voting-down-arrow-"+index, "bounce")
  document.getElementById("voting-number-"+index).innerHTML  = parseInt(number) - 1
  $("#voting-down-arrow-"+index).css("color", "#55acee")
}

function updateListHTMLFromListData(results) {
    postList = results
    var postListHTML = "<ul>"
    for (var i in results) {
        var elem = results[i]
        postListHTML += getListHTMLFromElem(elem, i)
    }
    document.getElementById("post-list").innerHTML =  postListHTML + "</ul>"  
}

function updateListDataFromServer() {
  Parse.Cloud.run("getList", null, {
    success: function (results) {
      // alert(results)
      postList = results
      console.log(results)
      updateListHTMLFromListData(results)
    }, 
    error: function (error) {
      console.log(error)
    }
  });
  
  // var query = new Parse.Query(Post);
  // postList = []
  // query.find({
  //   success: function(results) {
  //     // console.log(results)
  //     updateListHTMLFromListData(results)

  //   },
  //   error: function(error) {
  //     alert("Error: " + error.code + " " + error.message);
  //   }
  // });  
}






function openUrl(url, readerMode) {
  SafariViewController.isAvailable(function (available) {
    if (available) {
      SafariViewController.show({
            'url': url,
            'enterReaderModeIfAvailable': readerMode // default false
          },
          function(msg) {
            console.log("OK: " + msg);
          },
          function(msg) {
            alert("KO: " + msg);
          })
    } else {
      // potentially powered by InAppBrowser because that (currently) clobbers window.open
      window.open(url, '_blank', 'location=yes');
    }
  })
}
function configPageOpen() {
  myApp.popup(".popup-config")
}

function configPopupClose () {
  myApp.closeModal(".popup-config")
}

// jQuery.ajax = (function(_ajax){

//     var protocol = location.protocol,
//         hostname = location.hostname,
//         exRegex = RegExp(protocol + '//' + hostname),
//         YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
//         query = 'select * from html where url="{URL}" and xpath="*"';

//     function isExternal(url) {
//         return !exRegex.test(url) && /:\/\//.test(url);
//     }

//     return function(o) {

//         var url = o.url;

//         if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {

//             // Manipulate options so that JSONP-x request is made to YQL

//             o.url = YQL;
//             o.dataType = 'json';

//             o.data = {
//                 q: query.replace(
//                     '{URL}',
//                     url + (o.data ?
//                         (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
//                     : '')
//                 ),
//                 format: 'xml'
//             };

//             // Since it's a JSONP request
//             // complete === success
//             if (!o.success && o.complete) {
//                 o.success = o.complete;
//                 delete o.complete;
//             }

//             o.success = (function(_success){
//                 return function(data) {

//                     if (_success) {
//                         // Fake XHR callback.
//                         _success.call(this, {
//                             responseText: data.results[0]
//                                 // YQL screws with <script>s
//                                 // Get rid of them
//                                 .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
//                         }, 'success');
//                     }

//                 };
//             })(o.success);

//         }

//         return _ajax.apply(this, arguments);

//     };

// })(jQuery.ajax);


function getUrlTitle(){
  var url = document.getElementById("post-address-input").value; 
  // var url = "http://stackoverflow.com/questions/7901760/how-can-i-get-the-title-of-a-webpage-given-the-url-an-external-url-using-jquer"
  var yql_url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(url) + "%22" + 
      "%20and%0A%20%20%20%20%20%20xpath%3D'%2F%2Ftitle'" + 
      "&format=json" + 
      "&callback=?";

  $.getJSON(yql_url, function(json) {
    console.log(json)
    // console.log(json.nextAll('img:first'))
    if (json && json.query && json.query.results && json.query.results.title) {
      document.getElementById("post-title-input").value = json.query.results.title

    }
  });
}

function postLink () {
  if (!currentUser) {
    myApp.alert("Please register first")
    return
  }
  var post = new Post(); 
  post.set("address", document.getElementById("post-address-input").value); 
  post.set("title", document.getElementById("post-title-input").value); 
  post.set("ups", 0); 
  post.set("creator", currentUser); 
  post.set("downs", 0); 

  post.save(null, {
    success: function() {
      myApp.alert("You just posted a node! ", function(){
         myApp.closeModal(".popup-post")
      });
    }, 
    error: function (error) {

    }
  })

}

function signUp() {
  var user = new Parse.User();
  user.set("username", document.getElementById("post-email-input").value);
  user.set("password", document.getElementById("post-password-input").value);
  user.set("nickname", "")
  // user.set("email", );

  // other fields can be set just like with Parse.Object
  // user.set("phone", "415-392-0202");

  user.signUp(null, {
    success: function(user) {
      currentUser = user
      myApp.alert("You just signed up!")
      loginPopupClose()
      loginStatusUpdate()

      // Hooray! Let them use the app now.
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function updateInfo() {
  var nickname = document.getElementById("setting-nickname-input").value
  currentUser.set("nickname", nickname); 
  currentUser.save(null, {
    success: function(user) {
      myApp.alert("You just updated your nickname!")
      configPopupClose()
    }
  })
}

function logIn() {
  var username = document.getElementById("post-email-input").value
  var password = document.getElementById("post-password-input").value
  Parse.User.logIn(username, password, {
    success: function(user) {
      currentUser = user
      myApp.alert("You just logged in!")
      loginPopupClose()      
      loginStatusUpdate()
      // Do stuff after successful login.
    },
    error: function(user, error) {
      // The login failed. Check error to see why.
    }
  });
}


function addPostPopupOpen () {
    myApp.popup(".popup-post")

    // setTimeout(function () {
    //   document.getElementById("post-address-input").focus()

    // }, 500)
}

function pastFromClipBoard() {
      cordova.plugins.clipboard.paste(function (text) { 
        document.getElementById("post-address-input").value = text; 
      });  
}
function logOut(){
  Parse.User.logOut();
  myApp.alert("You just logged out!")
  configPopupClose()
  loginStatusUpdate()
}

function addPostPopupClose () {
    myApp.closeModal(".popup-post")
}
function loginPopupClose () {
    myApp.closeModal(".popup-login")
}

function loginPopupOpen() {
    myApp.popup(".popup-login")
}



var ptrContent = $$('.pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
    setTimeout(function () {
      updateListDataFromServer()
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
    }, 200);
});






Parse.initialize("JkGo2xhtI6riLE6fnkx8rNQNpmRisSmQcJt1j89K", "lEObYMBjToUE6fCN9xlmQzwfQs5xjFaxjo6FvDEM");
var postList = []
var Post = Parse.Object.extend("posts"); 
updateListDataFromServer()


loginStatusUpdate()

function loginStatusUpdate() {
  currentUser = Parse.User.current();

  if (currentUser) {
    $(".login-only").css("display", "block")
    $(".guest-only").css("display", "none")
  } else {
    $(".login-only").css("display", "none")
    $(".guest-only").css("display", "block")
  }  
}















