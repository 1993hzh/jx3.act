var LoginCheck = {};

LoginCheck.cookie = {
	url: "http://xoyo.com/",
	name: "xoyokey",
	key: ["123"]
};

LoginCheck.execute = function (callback) {
	Util.cookie.getCookie(LoginCheck.cookie.url, LoginCheck.cookie.name, function (cookie) {
		if (!cookie) {
			Util.log(Util.LOGLEVEL.ERROR, "cookie is expired.");
			LoginCheck.sendLoginNotification("cookie已过期，请重新登录！");
		} else {
			Util.log(Util.LOGLEVEL.INFO, "no need to re-login.");
			LoginCheck.isExpire(cookie.expirationDate, callback);
		}
	});
};

LoginCheck.isExpire = function (expire, callback) {
	var dueTime = new Date();
	var expireTime = new Date(expire * 1000);

	if (expireTime - dueTime < 60 * 1000) {// once the cookie is going to expire in 1min, send a forge activator to keep the cookie valid
		Util.log(Util.LOGLEVEL.INFO, "cookie is going to expire, sending a forge request.");
		
		Activator.execute(LoginCheck.cookie.key, 0);
	} else {
		if (callback) {
			callback();
		}
	}
};

LoginCheck.sendLoginNotification = function (msg) {
	var notification = new Notification(null, msg);
	notification.execute();
};