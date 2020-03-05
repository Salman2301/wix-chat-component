import * as realtime from 'wix-realtime';
import wixUsers from 'wix-users';
import wixData from "wix-data";
import {getUsers, getMe} from "backend/getUsers.jsw";


let lastUserId, lastLoginEmail, lastPicture ;
let userId = wixUsers.currentUser.id;
let owner;

$w.onReady(function () {
	// $w('#dataset1').onReady(init);
	init();

	$w('#inSearch').onKeyPress(e=>{
		setTimeout(()=>{
			if(e.key === "Enter") filterMem();
			if(e.key === "Escape") {
				$w('#inSearch').value = "";
				filterMem();
			}
		},40);
	});

	$w('#ChatElement').setAttribute("append-msg", JSON.stringify({
		user: {
			name: "salman",
		},
		msg :" Hello this is a test",
		date : new Date().toISOString(),
		isOwner: true
	}));

	getMe()
	.then(data=>{
		owner = data;
	});
	

});
function init() {

	// wix real time
	const channel = { name: userId };
	realtime.subscribe(channel, newMessage);

	// update UI
	filterMem();

	// events
	$w('#repeaterUser').onItemReady(($item, itemData, i)=>{
		let { loginEmail, picture} = itemData;
		$item('#image1').src = picture;
		$item('#textEmail').text = loginEmail;
	});

	$w('#containerUser').onClick((e)=>{
		switchUser(e.context.itemId);
	});

	$w('#btnSend').onClick(sendMessage);

}
async function filterMem() {
	let inMember = $w('#inSearch').value || undefined;
	getUsers(inMember)
	.then(data=>{
		$w('#repeaterUser').data = data.items;
		if(!lastUserId) {
			switchUser(data.items[0]._id) 
		}
	})
	.catch(console.error)
	
}

async function switchUser(toUserId) {
	lastUserId = toUserId;

	$w('#repeaterUser').onItemReady(($item, itemData, i)=>{
		let {_id,loginEmail, picture} = itemData;
		if(_id === toUserId) {
			$item('#imgCurrUser').show();
			$w('#textHeadUser').text = `Connected to ${loginEmail}`;
			lastLoginEmail = loginEmail;
			lastPicture = picture;
			refreshMsg()
		} else {
			$item('#imgCurrUser').hide();			
		}
	});
}

async function newMessage({ payload }) {
	appendMsg(payload._id)
}

async function refreshMsg() {
	$w('#ChatElement').setAttribute("messages","[]")
	let resMsgs = await wixData.query("message")
				.eq("from", userId)
				.eq("to", lastUserId)
				.or(
					wixData.query("message")
					.eq("from", lastUserId)
					.eq("to", userId)
				)
				.ascending("_createdDate")
				.find();

	let msg = resMsgs.items;
	let username = lastLoginEmail.split("@")[0];
	msg = msg.map(el=>{
		let isOwner = userId === el.from;
		let userImage = isOwner ? owner.picture : lastPicture;
		userImage =encodeURI(userImage);
		if(!userImage.startsWith("https://")) userImage = undefined;
		
		return {
			"_id" : el._id,
			isOwner: isOwner,
			user : {
				name: username,
				image: userImage
			},
			"msg" : el.message,
			"date" : el._createdDate,
			"data" : el
		}
	});

	$w('#ChatElement').setAttribute("messages", JSON.stringify(msg));

	if(msg.length === 0 ){
		$w('#textNoMsg').show();
	} else {
		$w('#textNoMsg').hide();		
	}
}


async function appendMsg(msgId) {
	let resMsgs = await wixData.query("message").eq("_id", msgId).find();

	let firstItem = resMsgs.items[0];

	let username = lastLoginEmail.split("@")[0];

	let isOwner = userId === firstItem.from;
	let userImage = isOwner ? owner.picture : lastPicture;
	userImage =encodeURI(userImage);
	if(!userImage.startsWith("https://")) userImage = undefined;

	let msg = {
			"_id" : firstItem._id,
			isOwner: isOwner,
			user : {
				name: username,
				image: userImage
			},
			"msg" : firstItem.message,
			"date" : firstItem._createdDate,
			"data" : firstItem
		}

	$w('#ChatElement').setAttribute("append-msg", JSON.stringify(msg));

}

async function sendMessage() {
	try {
		$w('#btnSend').disable();
		let msg = $w('#inMessage').value;
		if(!msg) return;

		let toInsert = {
			from : userId,
			to : lastUserId,
			message: msg
		}
		let inserted = await wixData.insert("message", toInsert);

		appendMsg(inserted._id);
		$w('#btnSend').enable();
		$w('#inMessage').value = "";
		
	}
	catch(e) {
		console.log("ERROR : " , e.message);
		$w('#btnSend').enable();
		$w('#inMessage').value = "";
		
	}

}