"use strict";

const REP_ACTION = 0,
	  DEL_ACTION = 1;


let generateUnique = (function () {
	let a = "";
	
	return function (length = 6) {
		if (a == "") {
			for (let i = 0; i < length; i++) {
				a += String.fromCharCode(Math.random() * 1000 % 74 + 48);
			}
		}

		return a;
	}
})();


(function syncListenInit() {
	let syncListenSocket = new WebSocket("ws://" + window.location.host + "/sync/listen/");

	syncListenSocket.onmessage = diff => {
		let data = JSON.parse(diff.data);

		if (data.origin != generateUnique())
			upperForm.val(applyChange(upperForm.val(), data));

		syncListenSocket.send(JSON.stringify({token: token}));
	};

	syncListenSocket.onerror = () => console.log("sync/listen seems to be unresponding");
	syncListenSocket.onopen = () => syncListenSocket.send(JSON.stringify({token: token}));
})();


function c_sendData () {
	let syncTellSocket = new WebSocket("ws://" + window.location.host + "/sync/tell/");

	syncTellSocket.onerror = () => console.log("sync/tell seems to be unresponding");

	let pull = [];

	return function i_sendData (so) {
		so.token = token;
		so.origin = generateUnique();
		so.hash = "";

		pull.push(so);

		if (!syncTellSocket.onopen)
			syncTellSocket.onopen = function () {
				syncTellSocket.send(JSON.stringify(pull));
				syncTellSocket.onopen = null;
			};
	};
}


function applyChange (text = "", so = {}) {
	if (so instanceof Array) {
		so.forEach(item => applyChange(text, item));
		return;
	}

	let neu = text.split("");
	
	switch(so.action) {
		case REP_ACTION:
			neu.splice(so.start, so.length, so.data);
			
		case DEL_ACTION:
			console.log(neu);
			neu.splice(so.start - 1, so.length + 1);
			console.log(neu);
			return neu.join("");
	}
}