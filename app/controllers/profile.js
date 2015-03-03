var Firebase = require('com.leftlanelab.firebase');

var args = arguments[0] || {};

//get user from sign in
var user = 'David';
var sampleChatRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
var nameRef = sampleChatRef.child('users/'+args.id);

		//show some stuff from chattee
  		nameRef.on("value", function(snap) {
  			var fullName = snap.val().first+' '+snap.val().last;
  			var uid = snap.val().id;
  		
  			alert(fullName+' '+uid);
  			
		});

function indexReturn(){
   $.profileContainer.close();
}



