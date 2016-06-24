var Activator = {};

Activator.const = {
	targetUrl: "http://app.jx3.xoyo.com/app/jx3/tifu201509/activation?code=",
	isSucceed: false,
	successFlag: 1
};

Activator.execute = function (keys, index) {
	setTimeout(function () {
		var key = keys[index];
		if (!Activator.const.isSucceed && index + 1 <= keys.length) {
			Activator.sendRequest(key, function (msg) {
				Util.log(Util.LOGLEVEL.INFO, key + ": " + msg);
			});
			Activator.execute(keys, ++index);
		}
	}, 500); // delay for 1s
};

Activator.sendRequest = function (key, callback) {
	var url = Activator.const.targetUrl + key;
	Util.sendAjax(url, function (xhr) {
		var result = JSON.parse(xhr.responseText);
		if (result.status === Activator.const.successFlag) {
			Activator.const.isSucceed = true;
			var notification = new Notification(null, "成功激活！");
			notification.execute();
		}
		if (callback) {
			callback(result.tips);
		}
	});
}