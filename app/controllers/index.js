// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//set up firebase stuff
// create tab group
var tabGroup = Titanium.UI.createTabGroup();
var Firebase = require('com.leftlanelab.firebase');

//get user from sign in
var user = '1';
var sampleChatRef = Firebase.new('https://scorching-fire-9510.firebaseIO.com');
var nameRef = sampleChatRef.child('users/'+user);
var nameListRef = sampleChatRef.child('users');

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


nameListRef.on("value", function(snapshot) {
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

listView.sections = [section];
win1.add(listView);


listView.addEventListener('itemclick',function(e){
	var lin = e.section.getItemAt(e.itemIndex);
	var id = lin.properties;
	id = id.id;
	profileWindow(id);
 });
 
 
var win3 = Titanium.UI.createWindow({  
    title:'Chat',
    backgroundColor:'#fff'
});
var view3 = Titanium.UI.createView({
   backgroundColor:'#D4D4D4',
   width:'100%',
   height:'80%',
   top:0
});
var scrollableView = Ti.UI.createScrollableView({
  views:[view3],
  showPagingControl:false
});

var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Chat',
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
	showChat(textVal,user);
	names.value = '';
});
/*
var listView2 = Ti.UI.createListView({
	 backgroundColor:'#D4D4D4',
	  separatorColor:'transparent',
        separatorStyle:0
});

var section2 = Ti.UI.createListSection();
listView2.sections = [section2];
view3.add(listView2);
*/

var table = Ti.UI.createTableView({
	 backgroundColor:'#D4D4D4',
	  separatorColor:'transparent',
        separatorStyle:0
});

win3.add(scrollableView);
view3.add(table);
win3.add(names);
win3.add(sendBtn);
var tableView = [];
//table.add(Ti.UI.createTableViewRow({ title: 'Bananas' }));
function showChat(textVal,user){

	nameRef.on('value', function (nameSnapshot) {
  		var y = nameSnapshot.val();
  		
	});
	console.log(nameRef);
	
	var messageListRef = sampleChatRef.child('chat_room/'+user);
	messageListRef.push({'user_id': user, 'text': textVal});

	messageListRef.on('child_added', function(newMessageSnapshot) {
  		var userId = newMessageSnapshot.child('user_id').val();
  		var text = newMessageSnapshot.child('text').val();
  		//console.log(text);
	});
	
	var row = Ti.UI.createTableViewRow({
    className: 'row',
    objName: 'row',
    backgroundColor:'#5DFF92',//46BCFF
    touchEnabled: true,
    height: 100
  	});
  	var enabledWrapperView = Ti.UI.createView({
    backgroundColor:'#008FD5',
    objName: 'enabledWrapperView',
    width: Ti.UI.FILL, height: '100%'
  });
  
  var disabledWrapperView = Ti.UI.createView({
    backgroundColor:'#A2E0FF',
    objName: 'disabledWarpperView',
    touchEnabled: false,
    width: 300, height: '80%'
  });
  enabledWrapperView.add(disabledWrapperView);
  
  var label = Ti.UI.createLabel({
    backgroundColor:'#313F48',
    color: '#000',
    text: textVal,
    touchEnabled: false,
  });
  
  	disabledWrapperView.add(label);
  	row.add(enabledWrapperView);
  	tableView.push(row);
	table.setData(tableView);
}

//book collection stuff create maybe some models of friends lists
function profileWindow(id){
    var profile = Alloy.createController("profile",{
        id: id
    }).getView();
    profile.open();
}



tabGroup.addTab(tab1);  
tabGroup.addTab(tab3); 
tabGroup.open();
//$.index.open();