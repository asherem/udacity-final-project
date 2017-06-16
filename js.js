/*jshint strict:false */

// ensure you are forced to write correct JavaScript code-
'use strict';

// set all variables in global scope to give code overview
var map, icon, infoWindow, setUL
var finalURL, marker, markertitle;
var coordinates, viewModel, title;
var position, id, i, filter, coordinatestr, locStr;
var rating, formattedAddress, locationImage, formattedPhone;
var $infoAddress, $infoPhone, $infoImg;
var $infoRating, $menu, $hide;
var url = 'https://api.foursquare.com/v2/venues/';
var auth = '?client_id=E2MIMPTNKJYWAZJTC51JXKKRUN0X1HWLBAFNVSMANV330CH0&client_secret=LWMLJLLPGBNPLBTV3W42M3UCJRR0B5BQPRBUK2OTL0DCWXK5&v=20160621';
var markers = [];
var clear = null;

// set Location behavior
function Location(title, lat, lng, filter, id, cat) {
	this.title = title;
	this.lat = lat;
	this.lng = lng;
	this.filter = filter;
	this.id = id;
	this.cat = cat; // category of location to potentially be used later

	// the following SWITCH is a potential TODO with 'this.cat' that has not been implemented:
	switch (this.cat) {

		case "Restaurant":
		this.icon = 'http://www.googlemapsmarkers.com/v1/G/0099FF/FFFFFF/FF0000/';
		break;

		case "Other":
		this.icon = 'http://www.googlemapsmarkers.com/v1/O/0099FF/FFFFFF/FF0000/';
		break;
	}
}

function ViewModel(){

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
		new Location('Blink Fitness', 40.7626515, -73.9261085, 'gym fitness all', '529688b811d2e101fca0bf89', "Other"),
		new Location('New York Pao De Queijo', 40.7626515, -73.9261085, 'brazilian lunch dinner spanish food all', '4b6dbc02f964a520c98a2ce3', "Restaurant"),
		new Location('El Basurero', 40.7584236, -73.919106, 'colombian spanish lunch dinner food all', '4abaae53f964a5206e8220e3', "Restaurant"),
		new Location('Astoria Sports Complex', 40.7555046, -73.92290279999997, 'gym fitness all', '4b68ad82f964a52092862be3', "Other"),
		new Location('The Strand Smokehouse', 40.76321009999999, -73.9272823, 'bbq american food steak all', '509c54afe4b047ee279e799b', "Restaurant"),
		new Location('Villa Brazil Café Grill', 40.7551287, -73.91802530000001, 'brazilian spanish lunch dinner food all', '4f77a524e4b0e0abc49ecef9', "Restaurant"),
		new Location('Bai Sushi', 40.7597557, -73.92021869999996, 'sushi lunch dinner asian japanese food all', '4b2062f2f964a520a53124e3', "Restaurant"),
		new Location('Red Mango', 40.762579, -73.916416, 'dessert frozen yogurt ice cream food all', '4bc21e2f2a89ef3b6241f388', "Restaurant"),
		new Location('Bagels & Brew', 40.757903, -73.9162, 'bagels breakfast lunch coffee food all', '4d121b1180f6721ed23115eb', "Restaurant"),
		new Location('Omonia Cafe', 40.761112, -73.92402049999998, 'greek dessert coffee dinner food all', '4ad17c3cf964a5208bde20e3', "Restaurant"),
		new Location('Greenbay Market', 40.761306, -73.92443249999997, 'gourmet organic supermarket grocery deli food all', '4f887eb7e4b0ab5c870ffc44', "Other"),
		new Location('Bareburger', 40.7634438, -73.9210736, 'burger organic american food all', '4a3c2b49f964a52036a11fe3', "Restaurant"),
		new Location('Zenon Taverna', 40.7628144, -73.9208577, 'greek dinner wine food all', '4a6b89d8f964a52009cf1fe3', "Restaurant")

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
			self.showInfoWindow(title, marker);
		});
		markers.push(marker);
	};

	// adds the markers as on-screen objects
	// title, position, id, icon critical for 'cat' functionality
	self.setMarkers = function() {
		coordinates = self.filLocs();
		for (i = 0; i < coordinates.length; i++) {
			title = coordinates[i].title;
			position = []; 	// leverage caching
			id = coordinates[i].id;
			position.lat = coordinates[i].lat;
			position.lng = coordinates[i].lng;
			self.createMarker(title, position, id, icon);
		}
	};

	self.setMapMarkers = function(map) {
		for (i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		}
	};

	self.showMarkers = function() {
		self.setMapMarkers(map);
	};

	self.clearMarkers = function() {
		self.setMapMarkers(clear);
	};

	self.deleteMarkers = function() {
		self.clearMarkers();
		markers = []; // leverage caching
	};

	// filter system
	self.setFilter = function() {
		self.deleteMarkers();
		self.setMarkers();
	};

	// init filter system with bindings
	self.myFilter = ko.observable();
	self.filLocs = ko.computed(function() {

		if (!self.myFilter()) {
			return self.coordinates();
		} else {
			return ko.utils.arrayFilter(self.coordinates(), function(mov){
				filter = self.myFilter().toLowerCase();
				coordinatestr = mov.filter;
				locStr = coordinatestr.indexOf(filter);
				if (locStr == -1) {
					return false;
				} else {
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
		$menu = $(".menu");
		$hide = $(".menu-tab");
		if ($menu.hasClass("hide")) {
			$menu.removeClass("hide").css("box-shadow", "3px 3px 10px 0px rgba(0,0,0,0.5)");
			$hide.css({ "top": "10px"
								});
		} else {
			$menu.addClass("hide").css("box-shadow", "none");
			$hide.css( { "top": "70px"
								});
		}
	};

	// taps FourSquare API to pull up all required data
	self.showInfoWindow = function(title, marker) {

		finalURL = url + marker.id + auth;

		infoWindow.close();
		(function() {
			for (i = 0; i < markers.length; i++) {
				marker = markers[i];
				marker.setAnimation(clear);
			}
		})
		();

		marker.setAnimation(google.maps.Animation.DROP);

		// style the infowindow itself
		infoWindow.setContent('<div id="info-window"><span class="window-title">' + title + '</span>' +
								'<div><br><span class="window-address"></span></div>' +
								'<div><br><span class="window-phone"></span></div>' +
								'<div><br><img class="window-image"></div>' +
								'<div><br><span class="window-rating"></span></div>' +
								'</div>'
							);
		infoWindow.open(map, marker);
		$.getJSON(finalURL)  // requests API info

		.done(function(data) {
			rating = data.response.venue.rating;
			formattedAddress = data.response.venue.location.formattedAddress;
			locationImage = data.response.venue.bestPhoto;
			formattedPhone = data.response.venue.contact.formattedPhone;
			$infoImg = $(".window-image");
			$infoRating = $(".window-rating");
			$infoAddress = $(".window-address");
			$infoPhone = $(".window-phone");

			// set API data into infoWindow with light error handling
			if (formattedAddress.length > 0) {
				$infoAddress.append(data.response.venue.location.formattedAddress[0]);
				$infoAddress.append("<br>Astoria, NY");
			} else {
				$infoAddress.append("Sorry, no address!");
			}

			if (formattedPhone.length > 0) {
				$infoPhone.append(data.response.venue.contact.formattedPhone);
			} else {
				$infoPhone.append("Sorry, no phone number available!");
			}

			if (locationImage) {
				$infoImg.attr("src", locationImage.prefix + "75x75" + locationImage.suffix);
			} else {
				$infoImg.append("src=#");
			}

			// color the ratings red, yellow, and green according to numerical qualifiers
			if (rating <= 6) {
				rating = "The people say: " + '<span class="red"><strong>' + rating + "/10" + '</strong></span>';
				$infoRating.append(rating);

			} else if (rating <= 7.5) {
				rating = "The people say: " + '<span class="yellow"><strong>' + rating + "/10" + '</strong></span>';
				$infoRating.append(rating);

			} else if (rating >= 7.6) {
				rating = "The people say: " + '<span class="green"><strong>' + rating + "/10" + '</strong></span>';
				$infoRating.append(rating);

			} else {
				$infoRating.append("Be the first to review this venue!");
			}
		});
	};
}

viewModel = new ViewModel();

ko.applyBindings(viewModel);
