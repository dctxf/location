window.onload = function() {
	'use strict';
	var btn = document.getElementById('location');
	var address = document.getElementById('address');
	var current = document.getElementById('current');

	// 创建百度地图实例
	var map = new BMap.Map();

	// 按钮点击获取坐标
	btn.onclick = function(e) {
		address.style.display = 'block';
		getLocation();
		e.stopPropagation();
		e.preventDefault();
	}

	// 判断是否支持定位
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		} else {
			current.innerHTML = '定位失败';
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
			// alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street);
			current.innerHTML = addComp.city.replace('市', '');
			btn.innerHTML = current.innerHTML;
			console.log(addComp);
		});
	}

	function showError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				// alert("用户拒绝对获取地理位置的请求。");
				current.innerHTML = '定位失败';
				break;
			case error.POSITION_UNAVAILABLE:
				// alert("位置信息是不可用的。");
				current.innerHTML = '位置信息不可用';
				break;
			case error.TIMEOUT:
				// alert("请求用户地理位置超时。");
				current.innerHTML = '请求超时';
				break;
			case error.UNKNOWN_ERROR:
				// alert("未知错误。");
				current.innerHTML = '未知错误';
				break;
		}
	}
}