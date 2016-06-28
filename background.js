var Background = {};

Background.constant = {
	StartHour: 11,
	StartMinute: 55,
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
	if (now - startTime > 0) {
		return true;
	}
	return false;
};

document.addEventListener("DOMContentLoaded", function (event) {
	setInterval(function () {
		if (!Background.isRunning && Background.checkTime()) {
			Util.log(Util.LOGLEVEL.INFO, "running.");
			Background.execute();
		}
	}, Background.constant.intervalTime * 1000);
});