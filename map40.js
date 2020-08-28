var geocoder;
var infowindow;
var ASETEC = { lat: 9.854164, lng: -83.910214 };
var userCoords = { lat: 0, lng: 0 };

function getLocation() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      (position) =>
        (userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
    );
  else alert("No se encontraron coordenadas");
}

async function getMoovinServiceArea() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://developer.moovin.me//moovinApiWebServices-1/rest/api/moovinEnterprise/partners/zoneCoverage",
      requestOptions
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function loadMap() {
  getLocation();
  const data = await getMoovinServiceArea();
  const serviceArea = data.list;

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: ASETEC,
    mapTypeId: "roadmap",
  });

  const serviceAreaMoovinMap = new google.maps.Polyline({
    path: serviceArea,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  serviceAreaMoovinMap.setMap(map);

  let markers = [];

  markers.push(
    new google.maps.Marker({
      position: userCoords, // cambiar por userCoords
      map: map,
      draggable: true,
    })
  );

  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });
  // let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          title: place.name,
          position: place.geometry.location,
          draggable: true,
        })
      );
      let marker = markers[0];

      geocoder = new google.maps.Geocoder();
      infowindow = new google.maps.InfoWindow();

      geocoder.geocode({ latLng: marker.getPosition() }, function (
        results,
        status
      ) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            $("#latitude,#longitude").show();
            $("#address").val(results[0].formatted_address);
            $("#latitude").val(marker.getPosition().lat());
            $("#longitude").val(marker.getPosition().lng());
            infowindow.setContent(results[0].formatted_address);
            infowindow.open(map, marker);
          }
        }
      });

      google.maps.event.addListener(marker, "dragend", function () {
        geocoder.geocode({ latLng: marker.getPosition() }, function (
          results,
          status
        ) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              $("#address").val(results[0].formatted_address);
              $("#latitude").val(marker.getPosition().lat());
              $("#longitude").val(marker.getPosition().lng());
              infowindow.setContent(results[0].formatted_address);
              infowindow.open(map, marker);
            }
          }
        });
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  google.maps.event.addDomListener(window, "load", loadMap);
}
