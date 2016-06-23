var Background = {};

Background.constant = {
	CookieExistsMinute: 60,
	StartHour: 11,
	StartMinute: 35,
	intervalTime: 10
};

Background.isRunning = false;

Background.execute = function () {
	LoginCheck.execute(function () {
		FetchKeys.execute(function (keys) {
			Background.isRunning = true;
			Activator.execute(keys, 0);
		});
	});
};

Background.getStartTime = function () {
	var now = new Date();
	var today = now.getDate();

	var targetTime = new Date();
	targetTime.setDate(today);
	targetTime.setHours(Background.constant.StartHour);
	targetTime.setMinutes(Background.constant.StartMinute);
	return targetTime;
};

Background.checkTime = function () {
	var now = new Date();
	var startTime = Background.getStartTime();
	if (now - startTime > 0 && now.getTime() - startTime.getTime() < Background.constant.CookieExistsMinute * 60 * 1000) {
		return true;
	}
	return false;
};

document.addEventListener("DOMContentLoaded", function (event) {
	setInterval(function () {
		Util.log(Util.LOGLEVEL.INFO, "check if it is time to do activator.");
		if (!Background.isRunning && Background.checkTime()) {
			Background.execute();
		}
	}, Background.constant.intervalTime * 1000);
});