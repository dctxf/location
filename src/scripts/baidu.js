window.onload = function() {
	'use strict';
	var btn = document.getElementById('location');
	var info = document.getElementById('info');

	// 百度地图
	var map = new BMap.Map('container');

	// 按钮点击获取坐标
	btn.onclick = function(e) {
		getLocation();
		e.stopPropagation();
		e.preventDefault();
	}

	// 判断是否支持定位
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		} else {
			info.innerHTML = "该浏览器不支持获取地理位置。";
		}
	}

	function showPosition(position) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var point = new BMap.Point(lon, lat); // 创建点坐标
		var gc = new BMap.Geocoder();
		gc.getLocation(point, function(rs) {
			var addComp = rs.addressComponents;
			var curCity = {
				id: '',
				name: addComp.province,
				date: Date()
			};
			//当前定位城市
			$.cookie('VPIAO_MOBILE_CURRENTCITY', JSON.stringify(curCity), {
				expires: 7,
				path: '/'
			});
			alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street);
		});
	}

	function showError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				alert("用户拒绝对获取地理位置的请求。");
				break;
			case error.POSITION_UNAVAILABLE:
				alert("位置信息是不可用的。");
				break;
			case error.TIMEOUT:
				alert("请求用户地理位置超时。");
				break;
			case error.UNKNOWN_ERROR:
				alert("未知错误。");
				break;
		}
	}

	// google map 定位
	/*function showPosition(position) {
		var latlon = position.coords.latitude + "," + position.coords.longitude;

		var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=14&size=400x300&sensor=false";

		document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
	}*/
}