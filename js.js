/* jshint strict: false */

/* global $: false, jQuery: false */

// set all variables in global scope to give code overview
// jQuery vars defined in functions

var map, icon, title, marker;
var infoWindow, setUL, markertitle;
var finalURL, coordinates, viewModel, title;
var position, id, i, filter, coordinatestr, locStr;
var formattedAddress, formattedPhone, rating;
var prefix, width, suffix, locationImage;
var google, ko;
var url = 'https://api.foursquare.com/v2/venues/';
var auth = '?client_id=E2MIMPTNKJYWAZJTC51JXKKRUN0X1HWLBAFNVSMANV330CH0&client_secret=LWMLJLLPGBNPLBTV3W42M3UCJRR0B5BQPRBUK2OTL0DCWXK5&v=20160621';
var markers = [];

// set map
function initMap() {

	'use strict'; // ensures correct, strict-style JavaScript code

	map = new google.maps.Map(document.getElementById('map-view'), {
		center: {lat: 40.760764, lng: -73.922769},
		zoom: 16
	});

	infoWindow = new google.maps.InfoWindow({
		content: ''
	});

	viewModel.setMarkers();
}

// error handling if map fails to init
function mapError() {

	'use strict';

	$("#map-view").css("text-align", "center");
	document.getElementById('map-view').innerHTML = "Oops, there goes an error! Come back later.";
}

// set Location behavior
function Location(title, lat, lng, filter, id, cat) {

	'use strict';

	this.title = title;
	this.lat = lat;
	this.lng = lng;
	this.filter = filter;
	this.id = id;
	this.cat = cat; // category of location to potentially be used later */
}

function ViewModel() {

	'use strict';

	var self = this;

	self.coordinates = ko.observableArray(
		[
		new Location('Vitality And Health', 40.756828, -73.913812, 'buffet organic supermarket deli food grocery all', '4b46b35ef964a520062726e3', "Other"),
		new Location('Astoria Bier & Cheese', 40.760466, -73.922607, 'beer cheese outdoor seating food all', '50676bc4e4b08e8fd3d07f72', "Restaurant"),
		new Location('Oliver\'s Astoria', 40.759588, -73.919761, 'breakfast lunch dinner food all', '51b11835498e02e0e1c93b76', "Restaurant"),
		new Location('Sweet Afton', 40.765388, -73.919027, 'beer wine bar pub gastropub food all', '4a9b0e2cf964a520373420e3', "Restaurant"),
		new Location('Museum Of The Moving Image', 40.756314, -73.923933, 'museum film movies cinema all', '424de080f964a520aa201fe3', "Other"),
		new Location('Saffron', 40.7572223, -73.91571420000002, 'dinner lunch indian curry food all', '50e5c5a2e4b035f761f9df9f', "Restaurant"),
		new Location('United Artists Kaufman Astoria 14', 40.754356, -73.92409470000001, 'film movies cinema all', '482af93cf964a520cd4f1fe3', "Other"),
		new Location('The Bonnie', 40.7746737, -73.91360029999998, 'bar lunch dinner food pub gastropub all', '544ed5d6498e79ed1c48737a', "Restaurant"),
		new Location('New York Pao De Queijo', 40.7626515, -73.9261085, 'brazilian lunch dinner spanish food all', '4b6dbc02f964a520c98a2ce3', "Restaurant"),
		new Location('El Basurero', 40.7584236, -73.919106, 'colombian spanish lunch dinner food all', '4abaae53f964a5206e8220e3', "Restaurant"),
		new Location('Il Bambino', 40.7628596, -73.92089090000002, 'italian lunch dinner food all', '458d06b3f964a520fe3f1fe3', "Restaurant"),
		new Location('The Strand Smokehouse', 40.76321009999999, -73.9272823, 'bbq american food steak all', '509c54afe4b047ee279e799b', "Restaurant"),
		new Location('Villa Brazil Café Grill', 40.7551287, -73.91802530000001, 'brazilian spanish lunch dinner food all', '4f77a524e4b0e0abc49ecef9', "Restaurant"),
		new Location('Bai Sushi', 40.7597557, -73.92021869999996, 'sushi lunch dinner asian japanese food all', '4b2062f2f964a520a53124e3', "Restaurant"),
		new Location('Red Mango', 40.762579, -73.916416, 'dessert frozen yogurt ice cream food all', '4bc21e2f2a89ef3b6241f388', "Restaurant"),
		new Location('Bagels & Brew', 40.757903, -73.9162, 'bagels breakfast lunch coffee food all', '4d121b1180f6721ed23115eb', "Restaurant"),
		new Location('Omonia Cafe', 40.761112, -73.92402049999998, 'greek dessert coffee dinner food all', '4ad17c3cf964a5208bde20e3', "Restaurant"),
		new Location('Greenbay Market', 40.761306, -73.92443249999997, 'gourmet organic supermarket grocery deli food all', '4f887eb7e4b0ab5c870ffc44', "Other"),
		new Location('Bareburger', 40.7634438, -73.9210736, 'burger organic american food all', '4a3c2b49f964a52036a11fe3', "Restaurant"),
		new Location('Zenon Taverna', 40.7628144, -73.92, 'greek dinner wine food all', '4a6b89d8f964a52009cf1fe3', "Restaurant")

	]);

	// inits the marker as concept
	self.createMarker = function(title, position, id, icon) {
		marker = new google.maps.Marker({
			title: title,
			position: position,
			id: id,
			map: map,
			icon: icon,  // potential functionality for later
			animation: google.maps.Animation.DROP  // sets marker animation
		});

		marker.addListener('click', function(){
			self.showInfoWindow(title, this);
		});
		markers.push(marker);

		return marker;
	};

	// adds the markers as on-screen objects
	self.setMarkers = function() {
		coordinates = self.filLocs();
		for (i = 0; i < coordinates.length; i++) {
			title = coordinates[i].title;
			position = []; 	// leverage caching
			id = coordinates[i].id;
			position.lat = coordinates[i].lat;
			position.lng = coordinates[i].lng;
			// self.createMarker(title, position, id, icon);
			self.coordinates()[i].marker = self.createMarker(title, position, id, icon);
		}
	};

	// filter system
	self.setFilter = function() {
		// ...
	};

	// init filter system with bindings
	self.myFilter = ko.observable();
	self.filLocs = ko.computed(function() {

		if (!self.myFilter()) {
			self.coordinates().forEach(function(mov) {
				if (mov.marker) {
					mov.marker.setVisible(true);
				}
			});
			return self.coordinates();
		} else {
			return ko.utils.arrayFilter(self.coordinates(), function(mov) {
				filter = self.myFilter().toLowerCase();
				coordinatestr = mov.filter;
				locStr = coordinatestr.indexOf(filter);
				if (locStr == -1) {
					mov.marker.setVisible(false); // clears markers without deleting them
					return false;
				} else {
					mov.marker.setVisible(true); // sets markers without re-creating them
					return true;
				}
			});
		}
	});

	// set on-click menu behavior
	self.menuClick = function(e) {
		setUL = e.title;
		for (i = 0; i < markers.length; i++) {
			marker = markers[i];
			markertitle = marker.title;
			if (setUL == markertitle) {
				self.showInfoWindow(markertitle, marker);

			}
		}
	};

	// set menu tab's hiding behavior
	self.hide = function() {
		var $menu = $(".menu");
		var $hide = $(".menu-tab");
		if ($menu.hasClass("hide")) {
			$menu.removeClass("hide");
			$hide.css({ "top": "10px"
								});
		} else {
			$menu.addClass("hide");
			$hide.css( { "top": "70px"
								});
		}
	};

	// taps FourSquare API to pull up all required data
	self.showInfoWindow = function(title, marker) {

		finalURL = url + marker.id + auth;

		infoWindow.close();

		// pans on marker on click
		map.setZoom(16);
		map.panTo(marker.getPosition());

		// create animation upon click with timer to prevent perpetual motion
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null); // set animation to null...
		}, 1400);  						// ...after 1400 ms

		// style the infowindow and set content

		$.getJSON(finalURL)  // requests API info for everything besides tips
		.done(function(data) {
			rating = data.response.venue.rating;
			formattedAddress = data.response.venue.location.address;
			prefix = data.response.venue.bestPhoto.prefix;
			width = data.response.venue.bestPhoto.width;
			suffix = data.response.venue.bestPhoto.suffix;
			locationImage = prefix + width + suffix;
			formattedPhone = data.response.venue.contact.formattedPhone;

			infoWindow.setContent('<div><span class="window-title">' + title + '</span>' +
									'<div><br><span class="window-address">' + formattedAddress + '</span></div>' +
									'<div><br><span class="window-address">' + 'Astoria, NY' + '</span></div>' +
									'<div><br><span class="window-phone">' + formattedPhone + '</span></div>' +
									'<div><br><img class="window-image" src=' + locationImage + '></img></div>' +
									'<div><br><span class="window-rating"> The people say: <strong>' + rating + '/10</strong></span></div>' +
									'</div>'
								);

			// open the window
			infoWindow.open(map, marker);

		})

		// error testing
		.fail(function(data) {
			infoWindow.setContent('<div><span class="ajax-error"> Oops! FourSquare could not be reached. We\'re working on it.</span></div>');
			infoWindow.open(map, marker);

		});
	};
}

viewModel = new ViewModel();

ko.applyBindings(viewModel);
