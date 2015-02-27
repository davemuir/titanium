$.index.open();

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//set up firebase stuff
// create tab group
var tabGroup = Titanium.UI.createTabGroup();
var Firebase = require('com.leftlanelab.firebase');
//var firebaseReference = Firebase.new('https://l3-appcelerator-demo.firebaseio.com/users');
var user = 'Dave';
var sampleChatRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
var fredNameRef = sampleChatRef.child('users/'+user+'/name');
//fredNameRef.set({first: 'Dave', last: 'Muir'});



// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 1',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win1.add(label1);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Tab 2',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Tab 2',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);


var win3 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win3
});

var names = Titanium.UI.createTextField({
    color:'#336699',
    bottom:100,
    left:10,
    width:300,
    height:40,   
    hintText:'Name',
    paddingLeft:8,
    paddingRight:8,
    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    returnKeyType:Titanium.UI.RETURNKEY_NEXT,
    suppressReturn:false
});	
var sendBtn = Ti.UI.createButton({
    width:137,
    height:75,
    backgroundImage:'send.png',
    bottom:0,
    left:10,
});
sendBtn.addEventListener('click',function(event){
	var textVal = names.value;
	showChat(textVal);
});
//win3.add(chatContainer);
win3.add(names);
win3.add(sendBtn);

//add tabs
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3);  


// open tab group
tabGroup.open();


function showChat(textVal){

	fredNameRef.on('value', function (nameSnapshot) {
  		var y = nameSnapshot.val();
  		console.log(nameSnapshot.val());
	});

	var messageListRef = sampleChatRef.child('message_list');
	messageListRef.push({'user_id': user, 'text': textVal});

	messageListRef.on('child_added', function(newMessageSnapshot) {
  	var userId = newMessageSnapshot.child('user_id').val();
  	var text = newMessageSnapshot.child('text').val();
  	console.log(text);
	});

}
var myProfile = Alloy.Collections.profile;
var book = Alloy.createModel('profile', { 
   title : 'Great Expectations', 
   author: 'David Muir' 
});
myProfile.add(book); 
book.save();

function story (event) { 
	alert('life story');
}


function newWindow(event){
	var selectedBook = event.source;
	var args = {
        title: selectedBook.title,
        author: selectedBook.author
    };
    var profile = Alloy.createController("profile", args).getView();
    profile.open();
}
