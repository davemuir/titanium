// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//set up firebase stuff
// create tab group
var tabGroup = Titanium.UI.createTabGroup();
var Firebase = require('com.leftlanelab.firebase');

//get user from sign in
var user = '0';
var startCount = 'true';
var unix = Math.round(+new Date()/1000);

var sampleChatRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
var nameRef = sampleChatRef.child('users/'+user);
var nameListRef = sampleChatRef.child('users');
var chatroomRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com/chat_room');

var chatRoomBool = false;
var listView = Ti.UI.createListView();
var section = Ti.UI.createListSection();

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


nameRef.on("value", function(snapshot) {
	  var x = snapshot.hasChild('contact_list');
	console.log(x);
	if(x == 1){
  var newBase = Firebase.new('https://scorching-fire-9510.firebaseIO.com/users/'+user+'/contact_list');
  newBase.on("value", function(snapshot) {
  	 var flist = snapshot.val();  
  //var len = flist.length;
  //console.log(len);
  for(var item in flist){
  		console.log('count');
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



/*nameListRef.on("value", function(snapshot) {
  var list = snapshot.val();  

  for(var item in list){
  	
  		var sampleChatRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
  		var nameItem = sampleChatRef.child('users/'+item);
  		
  		nameItem.on("value", function(snap) {
  			var fullName = snap.val().first+' '+snap.val().last;
  			var uid = snap.val().id;
  			var items = [{properties : {title: fullName,id:uid } }];
  			
  			section.appendItems(items);
  			
		});
		
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
*/
listView.sections = [section];
win1.add(listView);


var win3 = Titanium.UI.createWindow({  
    title:'Chat',
    backgroundColor:'#fff'
});
var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Chat',
    window:win3
});

/*-- Function to write the chatroom on coming into a beacon vicinity ---*/
function createChatroom(){
if(chatRoomBool == false){
console.log('create the room');	
listView.addEventListener('itemclick',function(e){
	var lin = e.section.getItemAt(e.itemIndex);
	var id = lin.properties;
	id = id.id;
	profileWindow(id);
 });
 
//window for chat 

var view3 = Titanium.UI.createView({
   backgroundColor:'#D4D4D4',
   width:'100%',
   height:'80%',
   top:0
});
var scrollableView = Ti.UI.createScrollableView({
  views:[view3],
  showPagingControl:false,
  id:"scrollableChatView",
  
});



var names = Titanium.UI.createTextArea({
    color:'#336699',
    bottom:100,
    left:10,
    width:'90%',
    height:40,   
    hintText:'Name',
    paddingLeft:8,
    paddingRight:8,
    font:{fontSize: '16dp'},
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
});


var table = Ti.UI.createTableView({
	 backgroundColor:'#D4D4D4',
	  separatorColor:'transparent',
        separatorStyle:0,
        scrollable:true
});

win3.add(scrollableView);
view3.add(table);
win3.add(names);
win3.add(sendBtn);

//EVENT listeners
var tableView = [];


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
Ti.App.addEventListener('updateViews', function(e){ 
    // console.log(e.data);

    var color = '#49AAFE';
 	var pos = '42%';
	if(e.data.userV == e.data.userIDV){
	
		//console.log(nameRef);
	
		var messageListRef = sampleChatRef.child('chat_room/');
		
		messageListRef.push({'user_id': e.data.userIDV, 'text': e.data.textV,'time': e.data.time,'name':e.data.userName});

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
Alloy.Collections.iBeacon = Alloy.createCollection('iBeacon');
Alloy.Collections.iBeacon.fetch();


TiBeacons.addEventListener('bluetoothStatus', function(e){
    Ti.API.info(e);
});
TiBeacons.requestBluetoothStatus();





function enterRegion(e) {
	alert("You have entered a new region, check out the chat room ! <br/>"+e);
	//var model = ensureModel(e);
	console.log(e);
	createChatroom();
	//TiBeacons.startRangingForBeacons(e);
}
function exitRegion(e) {
	alert("exiting room, see you next time!"+e);
	destroyChatroom();
	//var model = ensureModel(e);
	//Alloy.Collections.iBeacon.remove(model);

    //TiBeacons.stopRangingForBeacons(e);
   
}
function updateRanges(e) {
	Ti.API.trace(e);
}
function handleProximity(e) {
	Ti.API.info(e);
	
	var model = ensureModel(e);
	//sets the proximity indication
	model.set("proximity", e.proximity);
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

TiBeacons.addEventListener("enteredRegion", enterRegion);
TiBeacons.addEventListener("exitedRegion", exitRegion);
TiBeacons.addEventListener("beaconRanges", updateRanges);
TiBeacons.addEventListener("beaconProximity", handleProximity);
	
//start destroy chatRoom 
function destroyChatroom(){
//	alert('closing room');
	//$.scrollableChatView.close();
	//$.profileContainer.close();
	
	win3.add(defaultview3);
	defaultview3.add(defaultLabel);
	chatRoomBool = false;
}
function toggleMonitoring() {
	//console.log('toggle monitoring');
	// can create a privacy swicth to turn off monitioring
   // if ($.monitoringSwitch.value) {
   
       TiBeacons.startMonitoringForRegion({
            uuid : "E2C56DB5-DFFB-48D2-B060-D0F5A7109666",
            major: 666,
            minor: 666,
            identifier : "satan beacon"
        });

  	//} else {

	//	TiBeacons.stopMonitoringAllRegions();
    //}
}
toggleMonitoring();

/*----end beacon ---*/

tabGroup.addTab(tab1);  
tabGroup.addTab(tab3); 
tabGroup.open();



//$.win.open();

