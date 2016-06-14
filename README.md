# Location For Baidu Map

利用GPS获取用户当前的地理位置

## 采用技术

* jQuery&Cookie
* baidu map

## 关键代码

### getCurrentPosition(fn,error)

fn返回位置信息，error返回错误信息

```
navigator.geolocation.getCurrentPosition(showPosition, showError);
```


```
// 创建百度地图实例
var map = new BMap.Map();
```


```
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
```


