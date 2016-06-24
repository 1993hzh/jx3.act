var Util = {};

Util.opt = function (result, msg) {
    return {
        result: result,
        msg: msg
    };
};

Util.nodeListToArray = function (nodeList) {
    return Array.prototype.slice.call(nodeList);
};

Util.cookie = {
    getCookie: function (url, cookieName, callback) {
        if (!chrome.cookies) {
            chrome.cookies = chrome.experimental.cookies;
        }
        chrome.cookies.get({
            "url": url,
            "name": cookieName
        }, function (cookie) {
            if (callback) {
                callback(cookie);
            }
        });
    },

    removeCookie: function (url, cookieName, callback) {
        chrome.cookies.remove({
            "url": url,
            "name": cookieName
        }, function (cookie) {
            if (callback) {
                callback(cookie);
            }
        });
    }
};

Util.storage = {
    isEmpty: function (obj) {
        return Object.keys(obj).length === 0;
    },

    getValue: function (key, callback) {
        chrome.storage.sync.get(key, function (items) {
            if (callback) {
                callback(items);
            }
        });
    },

    /**
     * NOTICE: here we may got some errors due to the storage maxium size limit
     */
    setValue: function (key, value, callback) {
        var object = {};
        object[key] = value;
        chrome.storage.sync.set(object, function () {
            var result = null;
            if (chrome.extension.lastError) {
                result = Util.opt(false, 'An error occurred: ' + chrome.extension.lastError.message);
            }
            result = Util.opt(true, (key + ' saved.'));

            if (callback) {
                callback(result);
            }
        });
    }
};

Util.url = {
    getUrl: function (url) {
        if (url.indexOf("?") > -1) {
            url = url.substr(0, url.indexOf("?"));
        }
        return url;
    },

    getParam: function (url, name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },

    setParam: function (url, name, value) {
        url += (url.split('?')[1] ? '&' : '?') + (name + "=" + value);
        return url;
    },

    getParams: function (url) {
        //TODO
    }
};

Util.LOGLEVEL = {
    INFO: "INFO",
    ERROR: "ERROR"
};

Util.log = function (level, msg) {
    var now = new Date();
    console.log(now.format("yyyy-MM-dd hh:mm:ss") + " " + level + ": " + msg);
};

Date.prototype.format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

String.prototype.replaceAll = function (s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
};

Util.sendAjax = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr);
        }
    }
    xhr.send();
};