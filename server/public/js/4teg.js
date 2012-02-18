var latitude = null;
var longitude = null;

function initialize() {
    function success(position){
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        mapCenter = new google.maps.LatLng(latitude,longitude);
        var myOptions = {
          zoom: 16,
          center: mapCenter, 
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);

        var marker = new google.maps.Marker({ 
            position: mapCenter,
            map: map,
            title: "Current Position"
        });
    }
    function error(error) {
        switch(error.code) {
            case error.TIMEOUT:
                alert('Timeout');
                break;
            case error.POSITION_UNAVAILABLE:
                alert('Position unavailable');
                break;
            case error.PERMISSION_DENIED:
                alert('Permission denied');
                break;
            case error.UNKNOWN_ERROR: 
                alert('Unknown error');
                break;
        }
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('The geolocation is not working');
    }
}

function checkin(url) {
    if (latitude && longitude) {
        location.href = url + '?lat=' + latitude + '&lng=' + longitude;
    }
}
