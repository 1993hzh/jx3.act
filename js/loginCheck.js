var LoginCheck = {};

LoginCheck.cookie = {
	url: "http://xoyo.com/",
	name: "xoyokey",
	endHour: 11,// TODO
	endMinute: 20
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
	var dueTime = LoginCheck.getDueTime();
	var expireTime = new Date(expire * 1000);

	if (expireTime < dueTime) {
		Util.log(Util.LOGLEVEL.ERROR, "cookie is going to expire.");
		
		// remove cookie
		Util.cookie.removeCookie(LoginCheck.cookie.url, LoginCheck.cookie.name, function (cookie) {
			if (!cookie) {
				Util.log(Util.LOGLEVEL.ERROR, "cookie: " + LoginCheck.cookie.name + " is not found in " + LoginCheck.cookie.name);
			} else {
				Util.log(Util.LOGLEVEL.INFO, "cookie: " + LoginCheck.cookie.name + " is removed.");
			}
		});
		
		// ask for re-login
		LoginCheck.sendLoginNotification("cookie即将过期，请重新登录！");
	} else {
		if (callback) {
			callback();
		}
	}
};

LoginCheck.getDueTime = function () {
	var now = new Date();
	var today = now.getDate();

	var dueTime = new Date();
	dueTime.setDate(today);
	dueTime.setHours(LoginCheck.cookie.endHour);
	dueTime.setMinutes(LoginCheck.cookie.endMinute);
	return dueTime;
};

LoginCheck.sendLoginNotification = function (msg) {
	var notification = new Notification(null, msg);
	notification.execute();
};