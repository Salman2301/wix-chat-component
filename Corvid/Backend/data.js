// Wix database hook are handled in this file
// to create a hook create a function with name ${Collection}_${typeOfHook}


import {publish} from 'wix-realtime-backend';


export function message_afterInsert(item, context) {
	console.log(item);
	const channel = { name : item.to};
	let data = {};
	data.message = 	item.message; 
	data.from = item.from;
	data._id = item._id;
    publish(channel, data, {includePublisher: true});
	return item;
}