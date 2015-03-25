var args = arguments[0] || {};
// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#D4D4D4');

//set up firebase stuff
// create tab group
var tabGroup = Titanium.UI.createTabGroup();
var Firebase = require('com.leftlanelab.firebase');

//get user from sign in
var user = args.id;
user = user.toString();
var startCount = 'true';
var unix = args.ts;

var sampleChatRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
var nameRef = sampleChatRef.child('users/'+user);
var nameListRef = sampleChatRef.child('users');
var chatroomRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com/chat_room');
var messageListRef = sampleChatRef.child('chat_room/');
var chatRoomBool = false;
var chatDialogCount = 0;
var listView = Ti.UI.createListView();
var section = Ti.UI.createListSection();
var geoCheck = false;
var orientation;
var sendBtn;

//function to check geoloaction
function checkGeolocation(){
	if(geoCheck == false){
		Titanium.Geolocation.getCurrentPosition(function(e) {
           if (e.error) {
               alert('Error: You must Turn on Location Services to Enable the chatroom feature.' );
               return;
           }else{
           		toggleMonitoring();
           		geoCheck = true;
           }
 		});
	}
}
checkGeolocation();

//check geolocation on timer
setInterval(function(){ 
	Titanium.Geolocation.getCurrentPosition(function(e) {
           if (e.error) {
           		geoCheck = false;
           }
     });
 	checkGeolocation();
}, 60000);

//check orientation
var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;
 
if (pWidth > pHeight) {
    orientation = 0;
} else {
    orientation = 1;    
}

Ti.Gesture.addEventListener('orientationchange',function(e) {
  orientation = e.source.isPortrait();
});

//create the windows
var win1 = Titanium.UI.createWindow({  
    title:'list',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'list',
    window:win1
});

//create look for the profile
var win2 = Titanium.UI.createWindow({  
    title:'Profile',
    backgroundColor:'#fff'
});

var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Profile',
    window:win2
});

var userLabel = Titanium.UI.createLabel({
    color: '#333131',
    text: 'My Profile',
     left:10,
     top:50,
     font:{fontSize: '16dp'},
     height: Ti.UI.SIZE
});
var userImage = Ti.UI.createImageView({
  	image:'/images/myimage.png',
  	left:10,
    top:100,
});
var logoutBtn = Ti.UI.createButton({
   width:'14%',
    height:'6%',
    color:'#fff',
    backgroundColor: '#4DA7FF',
    borderColor: '#B6BABF',
    title: 'Log Out',
    bottom:'3%',
    value:'false',
    left:'75%',
    borderRadius:15,
    font:{fontSize: '14dp'},
    backgroundImage: 'none'
});
var updatePasswordBtn = Ti.UI.createButton({
    width:'14%',
    height:'6%',
    backgroundColor: '#4DA7FF',
    borderColor: '#B6BABF',
    color:'#fff',
    borderRadius:15,
    title: 'Update',
    top:'45%',
    value:'false',
    left:'66%',
    backgroundImage: 'none',
    font:{fontSize: '14dp'}
});
var password = Ti.UI.createTextField({
    height:'6%',
    borderRadius:15,
    font:{fontSize: '14dp'},
     borderColor: '#B6BABF',
    color:'#336699',
    left:'24%',
    width:'40%',
    hintText:'password',
    top:'45%',
    //bubbleParent: false,
    passwordMask:true,
    paddingLeft:8,
    paddingRight:8,
    font:{fontSize: '16dp'},
    //keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    returnKeyType:Titanium.UI.RETURNKEY_NEXT,
    //suppressReturn:false
});
var updateFirstnameBtn = Ti.UI.createButton({
    width:'14%',
    height:'6%',
    backgroundColor: '#4DA7FF',
    borderColor: '#B6BABF',
    color:'#fff',
    borderRadius:15,
    title: 'Update',
    top:'25%',
    value:'false',
    left:'66%',
    backgroundImage: 'none',
    font:{fontSize: '14dp'}
});
var firstname = Ti.UI.createTextField({
    height:'6%',
    font:{fontSize: '14dp'},
     borderColor: '#B6BABF',
    color:'#336699',
    left:'24%',
    borderRadius:15,
    width:'40%',
    hintText:'first name',
    top:'25%',
    paddingLeft:8,
    paddingRight:8,
    font:{fontSize: '16dp'},
    returnKeyType:Titanium.UI.RETURNKEY_NEXT,
});
var updateLastnameBtn = Ti.UI.createButton({
    width:'14%',
    height:'6%',
    backgroundColor: '#4DA7FF',
    borderColor: '#B6BABF',
    color:'#fff',
    borderRadius:15,
    title: 'Update',
    top:'35%',
    value:'false',
    left:'66%',
    backgroundImage: 'none',
    font:{fontSize: '14dp'}
});
var lastname = Ti.UI.createTextField({
    height:'6%',
    font:{fontSize: '14dp'},
     borderColor: '#B6BABF',
    color:'#336699',
    left:'24%',
    borderRadius:15,
    width:'40%',
    hintText:'last name',
    top:'35%',
    paddingLeft:8,
    paddingRight:8,
    font:{fontSize: '16dp'},
    returnKeyType:Titanium.UI.RETURNKEY_NEXT,
});
//for friend list basically
nameRef.on("value", function(snapshot) {
	var x = snapshot.hasChild('contact_list');
	if(x == 1){
  var newBase = Firebase.new('https://scorching-fire-9510.firebaseIO.com/users/'+user+'/contact_list');
  newBase.on("value", function(snapshot) {
  	 var flist = snapshot.val();  
  //var len = flist.length;
  //console.log(len);
  for(var item in flist){

  		var friendItemRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com/users/'+user+'/contact_list');
  		var friendNameItem = friendItemRef.child(item);
  		//var friendNameItem = friendItemRef.child('users/'+item);
  		
  		friendNameItem.on("value", function(snap) {
  			var friendID = snap.val().user_id;
  			var friendName = snap.val().user_name;
  			console.log(friendID);
  			var items = [{properties : {title: friendName,id:friendID } }];
  			section.appendItems(items);
  			
		});
	}	
  });
 }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

listView.sections = [section];
win1.add(listView);
win2.add(userLabel);
win2.add(updatePasswordBtn);
win2.add(updateFirstnameBtn);
win2.add(firstname);
win2.add(updateLastnameBtn);
win2.add(lastname);
win2.add(password);
win2.add(logoutBtn);
//callback function on logoutbutton
logoutBtn.addEventListener('click',function(e){
	destroyChatroom();
	logoutBtn.value = 'true';
	console.log(logoutBtn.value);
	toggleMonitoring();
	stopMonitor();
	TiBeacons.removeEventListener("exitedRegion", exitRegion);
	TiBeacons.removeEventListener("enteredRegion", enterRegion);
	tabGroup.close();

	$.destroy();
	var index = Alloy.createController("index",{
				
    }).getView();

});
updateFirstnameBtn.addEventListener('click',function(e){
	var fname = firstname.value;
	if(fname.length <= 1){
		alert('Error: First name must be at least 2 characters long');
	}else{
		var quickListRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com/users/');
		var usersRef = quickListRef.child(user);
		usersRef.update({
 
    	first:fname
   
  		});
 	}
  //quickListRef.
});

var win3 = Titanium.UI.createWindow({  
    title:'Chat',
    backgroundColor:'#fff',
    //windowSoftInputMode:Ti.UI.Android.SOFT_INPUT_ADJUST_PAN
});
var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Chat',
    window:win3
});

/*-- Function to write the chatroom on coming into a beacon vicinity ---*/
function createChatroom(){
	console.log(chatRoomBool);
	console.log(chatDialogCount);
if(chatRoomBool == false){
chatDialogCount = 0;	
unix = Math.round(+new Date()/1000);
console.log('create the room');	
listView.addEventListener('itemclick',function(e){
	var lin = e.section.getItemAt(e.itemIndex);
	var id = lin.properties;
	id = id.id;
	profileWindow(id);
 });
 
//window for chat 
var parentView3 = Titanium.UI.createScrollView({
   backgroundColor:'#fff',
   width:'auto',
   height:'auto',
   contentHeight:'100%',
   contentWidth:'100%',
   id:"scrollableChatView",
   top:0
});

var view3 = Titanium.UI.createView({
   backgroundColor:'#D4D4D4',
   width:'100%',
   height:'88%',
   top:0
});
var scrollableView = Ti.UI.createScrollableView({
  views:[view3],
  showPagingControl:false
 
});

var names = Titanium.UI.createTextArea({
    color:'#336699',
    bottom:'3%',
    left:'2%',
    width:'70%',
    height:'8%',   
    hintText:'message',
    bubbleParent: false,
    paddingLeft:8,
    paddingRight:8,
    font:{fontSize: '16dp'},
    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
    returnKeyType:Titanium.UI.RETURNKEY_NEXT,
    suppressReturn:false
});	
 sendBtn = Ti.UI.createButton({
    width:'12%',
    height:'8%',
    borderRadius:10,
   	//backgroundImage:'send.png',
    bottom:'3%',
    left:'75%',
    backgroundColor: '#4DA7FF',
    borderColor: '#B6BABF',
    color:'#fff',
    title:'Send',
     font:{fontSize: '20dp'}
});




var table = Ti.UI.createTableView({
	 backgroundColor:'#D4D4D4',
	  separatorColor:'transparent',
        separatorStyle:0,
        scrollable:true
});


win3.add(parentView3);

parentView3.add(scrollableView);
view3.add(table);
win3.add(names);
win3.add(sendBtn);

//EVENT listeners

names.addEventListener('focus', function() {
	var ab = Ti.Platform.model;
	//var ipn = ab.search('iPad');
	
	//var pWidth = Ti.Platform.displayCaps.platformWidth;
	var pHeight = Ti.Platform.displayCaps.platformHeight;
	if(ab.search('iPad') == 0) {
		if(orientation == 0){
			//ipad is landscape
  			var halfHeight = pHeight*0.42;
  			var btnW = '4%';
  			var btnH = '8%';
  		}else{
  			//ipad is portait
  			var halfHeight = pHeight*0.23;
  			var btnW = 65;
  			var btnH = 65;
  		}
	}else{
		//is ipod/iphone
		var halfHeight = pHeight*0.38;
		var btnW = '8%';
		var btnH = '8%';
	}
	//Ti.App.SCREEN_HEIGHT = (pWidth > pHeight) ? pWidth : pHeight;
	console.log(halfHeight);
    names.animate({bottom: halfHeight, duration:300});
    sendBtn.animate({bottom: halfHeight, duration:300});
    
    downBtn = Ti.UI.createButton({
    width:btnW,
    height:btnH,
    backgroundImage:'arrowDown.png',
    bottom:halfHeight,
    left:'90%',
	});
	win3.add(downBtn);
	downBtn.addEventListener('click',function(e){
		messageSent();
	});
	
});
names.addEventListener('blur', messageSent);
function messageSent(e){
	win3.remove(downBtn);
	hideKeyboard();
	var pHeight = Ti.Platform.displayCaps.platformHeight;
	var bottomHeight = 0.03*pHeight;
	console.log(bottomHeight);
    names.animate({bottom: bottomHeight, duration:300});
    sendBtn.animate({bottom: bottomHeight, duration:300});
    
}
var tableView = [];

var sendMessage = sendBtn.addEventListener('click',sendBtnFunction);

function sendBtnFunction(event){
	
	
	var textVal = names.value;
	var userID = user;
	//showChat(textVal,userID,user);
	names.value = '';
	nameListRef.child(userID).once("value", function(snapshot) {
		var uName = snapshot.val();
		var time =  Math.round(+new Date()/1000);
		uName = uName.first;
		 
		console.log(uName);
		Ti.App.fireEvent('updateViews', {data:{textV:textVal,userIDV:userID,userV:user,userName:uName,time:time}});
	});
	hideKeyboard();
}
function hideKeyboard () {
	names.blur();
    var fields = names.getChildren(); // view is the parent view
 
    for(var i = 0; i < fields.length; i++) {
        fields[i].blur();
    }
}
//updates the chat from firbase anytime a new chatroom object is added
chatroomRef.on("child_added", function(snapshot) {
		
		var snap = snapshot.val();
		if(unix <= snap.time && snap.user_id != user){
  			//console.log(snap);
  			var textVal = snap.text;
  			var userID = snap.user_id;
  			var uName = snap.name;
  			var time = snap.time;
  			//showChat(textVal,userID,user);
  			Ti.App.fireEvent('updateViews', {data:{textV: textVal, userIDV: userID,userV:user,userName:uName,time:time}});
  			//do function where put on tableview as a dialouge from backend
		}
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//inherit chats from firebase
Ti.App.addEventListener('updateViews', function updateView(e){ 
    // console.log(e.data);
	
    var color = '#49AAFE';
 	var pos = '42%';
	if(e.data.userV == e.data.userIDV){
	
		//console.log(nameRef);
		
		messageListRef.child(e.data.userIDV+'_'+e.data.time).set({'user_id': e.data.userIDV, 'text': e.data.textV,'time': e.data.time,'name':e.data.userName});
			
		messageListRef.on('child_added', function(newMessageSnapshot) {
  			var userId = newMessageSnapshot.child('user_id').val();
  			var text = newMessageSnapshot.child('text').val();
  			//console.log(text);
		});
		color = '#5DFF92';
		pos = 20;
	 }

	var a = new Date(e.data.time*1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  	var year = a.getFullYear();
  	var month = months[a.getMonth()];
  	var date = a.getDate();
  	var hour = a.getHours();
  	var min = a.getMinutes();
  	var sec = a.getSeconds();
  	var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  	
  	
	var row = Ti.UI.createTableViewRow({
    className: 'row',
    objName: 'row',
    backgroundColor:'#D4D4D4',
    top:10,
    user_id:e.data.userIDV,
    touchEnabled: true
  	});
  	//outside view wrapper
  	var enabledWrapperView = Ti.UI.createView({
    backgroundColor:'#D4D4D4',
    objName: 'enabledWrapperView',
    width: Ti.UI.FILL, height:Ti.UI.SIZE
  });
  
  var disabledWrapperView = Ti.UI.createView({
    backgroundColor:color,//46BCFF
    objName: 'disabledWarpperView',
    touchEnabled: false,
    width: '55%', 
    height: Ti.UI.SIZE,
    borderRadius:10,
     left:pos
  });
  enabledWrapperView.add(disabledWrapperView);
  
  var label = Ti.UI.createLabel({
    backgroundColor:color,
    color: '#333131',
    text: e.data.textV,
    touchEnabled: false,
     left:10,
     top:50,
      font:{fontSize: '16dp'},
     height: Ti.UI.SIZE
  });
  	
  	var nameLabel = Ti.UI.createLabel({
    backgroundColor:color,
    color: '#010101',
    text: e.data.userName,
    touchEnabled: false,
     left:10,
     top:5,
     font:{fontSize: '20dp'},
     height: Ti.UI.SIZE
  });
  	  	var timeLabel = Ti.UI.createLabel({
    backgroundColor:color,
    color: '#333131',
    text: time,
    touchEnabled: false,
     left:10,
     top:28,
     font:{fontSize: '12dp'},
     height: Ti.UI.SIZE
  });
  
  	disabledWrapperView.add(nameLabel);
  	disabledWrapperView.add(timeLabel);
  	disabledWrapperView.add(label);
  	row.add(enabledWrapperView);
  	tableView.push(row);
  
	table.setData(tableView);
	if(chatDialogCount == 0){
		var checkID = e.data.userIDV;
		table.addEventListener('click',function(e){
		console.log('table click - '+e.rowData.user_id+" "+checkID);
		if(e.rowData.user_id != user){
		var ModalWindow = Ti.UI.createWindow({
  			backgroundColor:'#fff',
  			width:'60%',
   			height:'60%',
   			borderRadius:10,
   			top:'20%'
  		});
		
		var dlabel = Ti.UI.createLabel({
    		backgroundColor:color,
    		color: '#333131',
    		text: e.rowData.user_id,
    		touchEnabled: false,
      		font:{fontSize: '16dp'},
      		top:20,
     		height: Ti.UI.SIZE
  		});
  		var dbtn = Ti.UI.createButton({
    
   			title:'back',
    		
  		});
  		
  		ModalWindow.add(dlabel);
  		ModalWindow.add(dbtn);
  		ModalWindow.open({modal:true}); 
  		dbtn.addEventListener('click',function(){
  			
  			var winObj = ModalWindow;
  			if (winObj.children) {
        		Ti.API.info('Has children! Len: ' + winObj.children.length);
       			 for (var i = winObj.children.length; i > 0; i--){
           	 	Ti.API.info( (i-1) + ") " + winObj.children[i-1]);
           		 winObj.remove(winObj.children[i-1]);
        		}
   			 }
  			ModalWindow.close();
  			
  		});
		//return sendBtn;
		}
	});
	chatDialogCount++;
	
	}
	var len = table.data[0].rows.length;
	var lengt = table.data.length;
	table.scrollToIndex(len-1);

});

}
chatRoomBool = true;
}
//end create chat 

var defaultview3 = Titanium.UI.createView({
   backgroundColor:'#D4D4D4',
   width:'100%',
   height:'100%',
   top:0
});
var defaultLabel = Ti.UI.createLabel({
    color: '#010101',
    text: "Enable Location Services and Find a Zone",
    font:{fontSize: '20dp'},
  });
win3.add(defaultview3);
defaultview3.add(defaultLabel);

/*defaultLabel.addEventListener('click',function(e){
	reRange();
});*/
function destroyChatroom(){
	chatroomRef.off("child_added");
    messageListRef.off("child_added");
	var winObj = win3;
	if (winObj.children) {
        Ti.API.info('Has children! Len: ' + winObj.children.length);
        for (var i = winObj.children.length; i > 0; i--){
            Ti.API.info( (i-1) + ") " + winObj.children[i-1]);
            winObj.remove(winObj.children[i-1]);
        }
    }
 
	win3.add(defaultview3);
	defaultview3.add(defaultLabel);
	chatRoomBool = false;
	chatDialogCount = 0;
	return chatDialogCount;
}
//book collection stuff create maybe some models of friends lists
function profileWindow(id){
    var profile = Alloy.createController("profile",{
        id: id
    }).getView();
    profile.open();
}

/*----------------  BEACON MODULE ---------------------*/

//beacon ti beacons stuff
var TiBeacons = require('org.beuckman.tibeacons');
//TiBeacons.enableAutoRanging();

Alloy.Collections.iBeacon = Alloy.createCollection('iBeacon');
Alloy.Collections.iBeacon.fetch();

TiBeacons.addEventListener('bluetoothStatus', function(e){
    Ti.API.info(e);
});
TiBeacons.requestBluetoothStatus();
function enterRegion(e) {
	if(chatRoomBool == false){
		console.log(e);
	alert("You have entered "+e.identifier+" region, check out the chat room !");
	//var model = ensureModel(e);
	console.log(e);
	
	createChatroom();
	}
	//TiBeacons.startRangingForBeacons(e);
}
function exitRegion(e) {
	//alert("exiting room, see you next time!"+e);
	var alert = Titanium.UI.createAlertDialog({ title: 'Leaving Location', message: 'See you next time!', buttonNames: ['ok'], cancel: 0 });
	alert.show();
	destroyChatroom();
}
function updateRanges(e) {
	Ti.API.trace(e);
}
function handleProximity(e) {
	Ti.API.info(e);
	console.log('handling proximity');
}
/*function ensureModel(e) {
	
	var atts = {
		id: e.uuid+" "+e.major+" "+e.minor,
		identifier: e.identifier,
		uuid: e.uuid,
		major: parseInt(e.major),
		minor: parseInt(e.minor),
		proximity: e.proximity
	};
	
	var model;
	var models = Alloy.Collections.iBeacon.where({id:atts.id});
	
	if (models.length == 0) {
		model = Alloy.createModel("iBeacon", atts);
		Alloy.Collections.iBeacon.add(model);
	}
	else {
		//model is found and the collection item is pulled from alloy
		model = models[0];
		Ti.API.info("found model "+models[0].get("identifier"));	
		
	}
	console.log('commented createCHat');
	//createChatroom();
	return model;
}
*/
TiBeacons.addEventListener("exitedRegion", exitRegion);
TiBeacons.addEventListener("enteredRegion", enterRegion);

TiBeacons.addEventListener("beaconRanges", updateRanges);
TiBeacons.addEventListener("beaconProximity", handleProximity);
	

function toggleMonitoring() {
	// can create a privacy swicth to turn off monitioring
    if (logoutBtn.value == 'false') {
   		//TiBeacons.stopMonitoringAllRegions();
   		TiBeacons.startMonitoringForRegion({
            uuid : "00000000-DFFB-48D2-B060-D0F5A7109666",
            major: 000,
            minor: 000,
            identifier : "fake beacon"
        });
       TiBeacons.startMonitoringForRegion({
            uuid : "E2C56DB5-DFFB-48D2-B060-D0F5A7109666",
            major: 666,
            minor: 666,
            identifier : "satan beacon"
        });
        
		setTimeout(function(){
			//TiBeacons.stopMonitoringAllRegions();
			console.log('retime out');
			TiBeacons.startMonitoringForRegion({
            uuid : "00000000-DFFB-48D2-B060-D0F5A7109666",
            major: 000,
            minor: 000,
            identifier : "fake beacon"
        });
       TiBeacons.startMonitoringForRegion({
            uuid : "E2C56DB5-DFFB-48D2-B060-D0F5A7109666",
            major: 666,
            minor: 666,
            identifier : "satan beacon"
        });
         }, 30000);
 	}
 	else{
 	//if(logoutBtn.value == 'true') {
 		
 		TiBeacons.stopMonitoringAllRegions();
 	}
}

function stopMonitor(){

        TiBeacons.stopMonitoringAllRegions();
}

/*----end beacon ---*/

tabGroup.addTab(tab1);  
tabGroup.addTab(tab3); 
tabGroup.addTab(tab2);
tabGroup.open();


//$.win.open();


