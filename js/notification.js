function Notification(url, msg) {
    this.url = url;
    this.msg = msg;
}

Notification.prototype.execute = function () {
	var self = this;
	self.createNotification(self.msg);
};

Notification.prototype.createNotification = function (msg) {
    var options = {
        type: "basic",
        iconUrl: "img/favicon48.png",
        title: "jx3.activator有新状态，请及时查看。",
        message: msg,
        isClickable: true
    };

	chrome.notifications.create(options);
};