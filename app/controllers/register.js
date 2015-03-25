var Cloud = require('ti.cloud');
Cloud.debug = true;  

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
					
		/*			var emailDialog = Titanium.UI.createEmailDialog();
 
					    emailDialog.setSubject(' Titanium !!!!!!!! ');
    					emailDialog.setToRecipients(['davidmuirdesign@gmail.com']);
    					emailDialog.setMessageBody('Hi,\n I am working with appcelerator.');
    					emailDialog.setHtml(false);
    					emailDialog.setBarColor('#336699');
    					 emailDialog.addEventListener('complete',function(e)
    {
        if (e.result == emailDialog.SENT)
        {
            if (Ti.Platform.osname != 'android') {
                // android doesn't give us useful result codes.
                // it anyway shows a toast.
                alert("message was sent");
            }
        }
        else
        {
            alert("message was not sent. result = " + e.result);
        }
    });
    		Cloud.Emails.send({
			template : 'Registration',
			recipients : 'davidmuirdesign@gmail.com', //to whom
			name : 'name'
		}, function(e) {
			if (e.success) {
				console.log('sces');
			} else {
				alert(e.message);
			}
		});			
			*/		
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
			var fname = e.data.first;
			var lname = e.data.last;
			var userBase = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
			userBase.child('users').child(id).set({'id': e.data.id, 'last': e.data.last, 'first' : e.data.first, 'email' :email, 'gender' : e.data.ugender, 'password' : e.data.password,'active':0});
			
			//get to send the data for email server
			var xhr = Titanium.Network.createHTTPClient();  					
    		xhr.onload = function(){
        				//Titanium.API.info('API.INFO');
        				//Ti.API.info('xml ' + this.responseXML + ' text ' + this.responseText);
    		};
   			 // open the client
    		xhr.open('GET','http://sto.apengage.io/index.php/et/register/'+email+'/'+fname+'/'+lname+'/'+e.data.id);
   
   			 // send the data
    		xhr.send();
			$.destroy();
			var index = Alloy.createController("index",{
				
    		}).getView();
});
