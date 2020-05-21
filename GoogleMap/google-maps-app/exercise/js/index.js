var map;
var infoWindow;
var markers = [];

function initMap() {

    let Kaohsiung = {
        lat: 22.659901,
        lng: 120.300032
    }
    let lostAngeles = {
        lat: 34.0663880,
        lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: lostAngeles,
        zoom: 11,
        styles: [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ebe3cd"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#523735"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f1e6"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#c9b2a6"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#dcd2be"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#ae9e90"
                }]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#93817c"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#a5b076"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#447530"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f1e6"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#fdfcf8"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f8c967"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#e9bc62"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e98d58"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#db8555"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#806b63"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#8f7d77"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#ebe3cd"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#b9d3c2"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#92998d"
                }]
            }
        ]

    });
    infoWindow = new google.maps.InfoWindow();

}
//enable enter key
const onEnter = (e) => {
    if (e.key == "Enter") {
        getStores();
    }
}

const noStoresFound = () => {
    const html = `
    <div class="no-stores-found">
        No Stores Found
    </div>`
    document.querySelector('.stores-list').innerHTML = html;
}

const createMarker = (latlng, name, address, openStatusText, phone, storeNumber) => {
    let html = `
    <div class = "store-info-window">
        <div class ="store-info-name">
            ${name}
        </div>
        <div class= "store-info-open-status">
            ${openStatusText}
        </div>
        <div class ="store-info-address">
            <div class="icon">
            <i class="fab fa-telegram-plane"></i>
            </div>
        <span>
            ${address}
            </span>
        </div>
        <div class="store-info-phone">
        <div class= "icon">
        <i class="fas fa-phone-alt"></i>
        </div>
        <span>    
        <a href="tel:${phone}">${phone}</a>
        </span>
        </div>
    </div>
    `
    //from google document let create marker 
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        label: `${storeNumber}`
    });
    //store info
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker)
};

const getStores = () => {


    const zipCode = document.getElementById('zip-code').value;
    if (!zipCode) {
        return;
    }
    const API_URL = "http://localhost:3000/api/stores";
    const fullUrl = `${API_URL}?zip_code=${zipCode}`
    fetch(fullUrl)
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            } else {
                throw new Error(response.status);
            }
        }).then((data) => {
            if (data.length > 0) {
                clearLocations()
                searchLocatonsNear(data);
                setStoresList(data)
                setOnClickListener()
            } else {
                clearLocations()
                noStoresFound()
            }
        })
}

const clearLocations = () => {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

const setOnClickListener = () => {
    let storeElements = document.querySelectorAll('.store-container')
    storeElements.forEach((elem, index) => {
        elem.addEventListener('click', () => {
            google.maps.event.trigger(markers[index], 'click');
        })

    })

}

const setStoresList = (stores) => {
    let storesHtml = '';
    stores.forEach((store, index) => {
        storesHtml += `
        <div class="store-container">
        <div class="store-container-background">
            <div class="store-info-container">
                <div class="store-address">
                    <span>${store.addressLines[0]}</span>
                    <span>${store.addressLines[1]}</span>
                </div>
                <div class="store-phone-number">
                    ${store.phoneNumber}
                </div>
            </div>
            <div class="store-number-container">
                <div class="store-number">
                    ${index+1}
                </div>
            </div>
        </div>
    </div>
        
        `
    })
    document.querySelector('.stores-list').innerHTML = storesHtml;
}

const searchLocatonsNear = (stores) => {
    //fit map with the locator
    let bounds = new google.maps.LatLngBounds();
    stores.forEach((store, index) => {
        var latlng = new google.maps.LatLng(
            store.location.coordinates[1],
            store.location.coordinates[0])
        let name = store.storeName;
        let address = store.addressLines[0];
        let openStatusText = store.openStatusText;
        let phone = store.phoneNumber;
        bounds.extend(latlng)
        createMarker(latlng, name, address, openStatusText, phone, index + 1)
    });
    map.fitBounds(bounds);
}