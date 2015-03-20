

var registerBool = false;
var Firebase = require('com.leftlanelab.firebase');
var nameListRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com/users/');
//var userBase = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
var pass,fname,lname,gender,email,leng;
$.registerContainer.open();

$.backButton.addEventListener('click',function(e){
			$.destroy();
			var index = Alloy.createController("index",{
				
    		}).getView();
});

$.registerButton.addEventListener('click',function(e){
	  pass = $.password.value;
	  fname = $.firstName.value;
	  lname = $.lastName.value;
	  gender = $.gender.getSelectedRow(0).title;
	  email = $.email.value;
	
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;    
 
   if(reg.test(email) == false) {
        alert('please provide a valid email');
        return;
    } 
    
   if(pass.length < 8 ){
		alert('please provide a secure password at least 8 characters long');
		return;
   }
   else{
   
   		
   		registerUser(pass,fname,gender,lname,email);
   		
		return;
   }
});
//if they passed all the steps
function registerUser(pass,fname,gender,lname,email){
	
	
	nameListRef.on("value", function(snapshot) {
		var userArr = snapshot.val();
	  	var leng = userArr.length;
	
		for(var i=0;i < leng;i++){
			var usersRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com/users/'+i);
			usersRef.on("value", function(snap) {
				
				if(email == snap.val().email){
					registerBool = true;
					
					alert('duplicate email');
					return;
				}
			});
		}
		
		setTimeout(function(){ 
			if(registerBool == true){
				//alert('found an email, cannot do');
				return;
			}else{
					Ti.App.fireEvent('createUsers', {data:{id: leng, last: lname, first : fname, uemail : email, ugender : gender, password : pass}});
					//return;
			}
		}, 2000);
	});
	nameListRef.off();
}

Ti.App.addEventListener('createUsers', function createUser(e){ 
			nameListRef.off();
			var id = e.data.id;
			id = id.toString();
			var email = e.data.uemail;
			var userBase = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
			userBase.child('users').child(id).set({'id': e.data.id, 'last': e.data.last, 'first' : e.data.first, 'email' :email, 'gender' : e.data.ugender, 'password' : e.data.password});
			
			$.destroy();
			var index = Alloy.createController("index",{
				
    		}).getView();
});
