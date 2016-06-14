window.onload = function() {
	'use strict';
	var btn = document.getElementById('location');
	var info = document.getElementById('info');

	// 高德地图
	var map = new AMap.Map('container', {
		resizeEnable: true,
		zoom: 11,
		center: [116.397428, 39.90923]
	});

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

	function showPosition(postion) {
		// GPS经纬度转换为高德地图经纬度坐标
		AMap.convertFrom([postion.coords.latitude, postion.coords.longitude], 'gps', function(status, result) {
			if (status === 'complete') {
				console.log('转换成功');
				// console.log(result.locations[0]);
				var lnglat = result.locations[0];
				var lnglatXY = [lnglat.lng, lnglat.lat];
				alert(lnglatXY);
				AMap.plugin('AMap.Geocoder', function() {
					alert(lnglatXY);
					//实例化Geocoder
					var geocoder = new AMap.Geocoder({
						city: "010" //城市，默认：“全国”
					});
					//TODO: 使用geocoder 对象完成相关功能
					geocoder.getAddress(lnglatXY, function(st, res) {
						alert(st + '\n' + res);
						if (st === 'complete' && res.info === 'OK') {
							//获得了有效的地址信息:
							//即，result.regeocode.formattedAddress
							alert(res.regeocode.formattedAddress);
						} else {
							//获取地址失败
							alert('获取地址失败');
						}
					});
				});
			} else {

			}
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