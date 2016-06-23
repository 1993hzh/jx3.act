var FetchKeys = {};

FetchKeys.execute = function (callback) {
	var sogou = "http://weixin.sogou.com/weixin?query=ksjianwang3";
	Util.sendAjax(sogou, function (xhr) {
		var publicUrl = FetchKeys.parseSogouHtml(FetchKeys.toHtml(xhr.responseText));
		if (!publicUrl) {
			Util.log(Util.LOGLEVEL.ERROR, "cannot find jx3 url from sogou!");
			return;
		}

		Util.sendAjax(publicUrl, function (xhr) {
			var passageUrl = FetchKeys.parsePublicPassageHtml(FetchKeys.toHtml(xhr.responseText));
			if (!passageUrl) {
				Util.log(Util.LOGLEVEL.ERROR, "cannot find any passage url from jx3 public account!");
				return;
			}

			Util.sendAjax(passageUrl, function (xhr) {
				var keys = FetchKeys.parseDetailHtml(FetchKeys.toHtml(xhr.responseText));
				if (callback) {
					callback(keys);
				}
			});
		});
	});
};

FetchKeys.parseDetailHtml = function (html) {
	var keys = [];
	var targetKeyDivs = html.querySelectorAll("p[style='text-align: center;']");
	for (var index in targetKeyDivs) {
		var targetDiv = targetKeyDivs[index];
		var key = targetDiv.innerText;
		if (!key || key.length !== 16) {
			continue;
		}
		keys.push(key);
	}
	return keys;
};

FetchKeys.parsePublicPassageHtml = function (html) {
	var length = html.scripts.length;
	var target = html.scripts[length - 1];
	var text = target.innerHTML;
	var start = text.indexOf("'");
	var end = text.lastIndexOf("'");

	var json = text.substring(start + 1, end);
	var json = json.replaceAll("&quot;", "'");

	var j = JSON.parse("\"" + json + "\"");
	var result = eval("(" + j + ")");
	var rawUrl = result.list[0].app_msg_ext_info.content_url;

	var publishTime = result.list[0].comm_msg_info.datetime;
	if (new Date(publishTime * 1000).getDate() !== new Date().getDate()) {
		return;
	}

	return "http://mp.weixin.qq.com" + rawUrl.replaceAll("&amp;amp;", "&");
};

FetchKeys.parseSogouHtml = function (html) {
	var targetDiv = html.querySelector(".results");
	if (!targetDiv) {
		Util.log(Util.LOGLEVEL.ERROR, "cannot find ksjianwang3, impossible!");
		return;
	}

	var urlDiv = targetDiv.getElementsByTagName("div")[0];
	var rawUrl = urlDiv.getAttribute("onclick");
	var start = rawUrl.indexOf("'");
	var end = rawUrl.lastIndexOf("'");
	return rawUrl.substring(start + 1, end);
};

FetchKeys.toHtml = function (html) {
	var parser = new DOMParser();
	return parser.parseFromString(html, "text/html");
};