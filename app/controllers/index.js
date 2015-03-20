// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#D4D4D4');
$.indexContainer.open();
//set up firebase stuff
// create tab group
var Firebase = require('com.leftlanelab.firebase');
var sampleChatRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
var nameListRef = sampleChatRef.child('users');
var userID;
var loginBool = false;
var ts = Math.round(+new Date()/1000);

function login(pass,email){
	nameListRef.on("value", function(snapshot) {
		var userArr = snapshot.val();
		var leng = userArr.length;
	
		for(var i=0;i < leng;i++){
			var usersRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com/users/'+i);
			usersRef.on("value", function(snap) {
				//console.log(snap.val().password);
				if(pass == snap.val().password && email == snap.val().email){
					loginBool = true;
					
					userID = snap.val().id;
					//console.log("login bool ="+loginBool+" -userID - "+userID);
		
					
				}
			});
		}
		setTimeout(function(){ 
			if(loginBool == true){
				loginWindow(userID);
			}else{
				alert('login failed');
			}
		}, 2000);
	});
	
	
}
$.loginButton.addEventListener('click',function(e){
	var email = $.email.value;
	var pass = $.password.value;
	login(pass,email);
});
$.registerBtn.addEventListener('click',function(e){
	$.indexContainer.close();
	var register = Alloy.createController("register",{
     
    }).getView();
});

function loginWindow(userID){
	
	loginBool = false;
	$.destroy();
	//sampleChatRef.off();
    var login = Alloy.createController("login",{
       id: userID,
       ts:ts
    }).getView();
   
}







