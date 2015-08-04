var
	kThemeNormal = {
		id:							"normal",
		vialMax:				412,
		vialMin:				100,
		vialWidth:			116,
		glowWidth:			116,
		glowHeight:			64,
		glowOffset:			0,
		counterHeight:	82,
		background:			"classicbg"
	},
	kThemeSteampunk = {
		id:							"steampunk",
		vialMax:				375,
		vialMin:				95,
		vialWidth:			206,
		glowWidth:			0,
		glowHeight:			0,
		glowOffset:			5,
		counterHeight:	88,
		background:			"steampunkbg"
	},
	kThemeWood = {
		id:							"wood",
		vialMax:				440,
		vialMin:				100,
		vialWidth:			124,
		glowWidth:			49,
		glowHeight:			16,
		glowOffset:			5,
		counterHeight:	82,
		background:			"woodbg"
	},
	kThemeSimpleLight = {
		id:							"simple-light",
		vialMax:				411,
		vialMin:				100,
		vialWidth:			82,
		glowWidth:			37,
		glowHeight:			7,
		glowOffset:			0,
		counterHeight:	79,
		background:			null
	},
	kThemeSimpleDark = {
		id:							"simple-dark",
		vialMax:				411,
		vialMin:				100,
		vialWidth:			82,
		glowWidth:			37,
		glowHeight:			7,
		glowOffset:			0,
		counterHeight:	79,
		background:			null
	},
	kThemeMagic = {
		id:							"magic",
		vialMax:				415,
		vialMin:				120,
		vialWidth:			305,
		glowWidth:			93,
		glowHeight:			20,
		glowOffset:			0,
		counterHeight:	83,
		background:			"magicbg"
	},
	kThemeBling = {
		id:							"bling",
		vialMax:				395,
		vialMin:				100,
		vialWidth:			156,
		glowWidth:			101,
		glowHeight:			19,
		glowOffset:			0,
		counterHeight:	83,
		background:			"blingbg"
	};

var
	kThermometerStatusCold		= "cold",
	kThermometerStatusRegular	= "regular",
	kThermometerStatusHot		= "hot";

var
	kTransitionNoOpacity		= {'opacity':	0},
	kTransitionFullOpacity	= {'opacity':	1},
	kAnimationSpeed					= 300,
	kAnimationStepWait			= 20;

var
	kTemperatureUnitCelcius = "C",
	kTemperatureUnitFahrenheit = "F";

var
	kMinT	= -20,
	kMaxT	= 40;

var kWeatherBaseURI = "http://free.worldweatheronline.com/feed/weather.ashx?key=366fb512c3211016111501&format=json&fx=no&includeLocation=yes&q=";
// var kWeatherBaseURI = "http://127.0.0.1";
var kAssetsPath = "http://assets.robocatapps.com/thermo-site";
var kImagePath = kAssetsPath + "/images";

var isiPhone = navigator.userAgent.match(/iPhone/i) !== null ? true : false;
var isiPad = navigator.userAgent.match(/iPad/i) !== null ? true : false;

var thermometer = {
	currentTemperature:	kMinT,
	currentTheme:	kThemeNormal,

	// Calculate the thermometer positions based
	// on the given temperature
	position:	function(temperature) {

		var top = (function() {
			if(temperature <= kMinT)
				return thermometer.currentTheme.vialMin;
			else if (temperature >= kMaxT)
				return thermometer.currentTheme.vialMax;
			else
				return Math.floor((temperature - kMinT) * ((thermometer.currentTheme.vialMax - thermometer.currentTheme.vialMin)/(kMaxT-kMinT)) + thermometer.currentTheme.vialMin);
		})();

		// Returns the status of the thermometer
		// based on the current temperature.
		// The status can be hot | regular | cold
		var status = (function() {
			if (temperature >= 30)
				return kThermometerStatusHot;
			else if (temperature >= 0)
				return kThermometerStatusRegular;
			else
				return kThermometerStatusCold;
		})();

		return {
			'top':			top,
			'glowX':		Math.floor((this.currentTheme.vialWidth - this.currentTheme.glowWidth - this.currentTheme.glowOffset) / 2),
			'glowY':		top - this.currentTheme.glowHeight/2,
			'status':		status,
			'counter':	Math.floor(top - (this.currentTheme.counterHeight / 2))
		};
	},

  addCold: function () {
    $("#thermometer").append('<div class="cold empty" id="cold_empty"></div>');
    $("#thermometer").append('<div class="cold full" id="cold_full"></div>');
    $("#thermometer").append('<div class="cold top" id="cold_top"></div>');
  },

  addRegular: function() {
    $("#thermometer").append('<div class="regular empty" id="regular_empty"></div>');
    $("#thermometer").append('<div class="regular full" id="regular_full"></div>');
    $("#thermometer").append('<div class="regular top" id="regular_top"></div>');
  },

  addHot: function () {
    $("#thermometer").append('<div class="hot empty" id="hot_empty"></div>');
    $("#thermometer").append('<div class="hot full" id="hot_full"></div>');
    $("#thermometer").append('<div class="hot top" id="hot_top"></div>');
  },

	prepareTheme: function() {
		thermometer.currentTheme = data.theme;
		thermometer.currentTemperature = data.temperature;

    var status = thermometer.position(thermometer.currentTemperature).status;
    if (status === kThermometerStatusCold) {
      this.addCold();
    } else if (status === kThermometerStatusRegular) {
      this.addCold();
      this.addRegular();
    } else if (status === kThermometerStatusHot) {
      this.addCold();
      this.addRegular();
      this.addHot();
    }

		if (data.theme.id != kThemeSimpleDark.id && data.theme.id != kThemeSimpleLight.id) {
      var url = kImagePath + "/backgrounds/" + data.theme.background;
      if (!isiPhone) {
        url += ".jpg";
        $.backstretch(url, {fade: 400});
      } else {
        url += "_iphone.jpg";
        $('body').css({"background-image": "url('" + url + "')", "background-position": "center center", 'background-repeat': 'no-repeat', 'background-attachment': 'fixed'});
      }
			
		} else if(data.theme.id == kThemeSimpleLight.id) {
			$("body").css({'background-color': '#fff'});
		}

		$("body").addClass('theme-' + data.theme.id);
		$("#background").addClass('theme-' + data.theme.id);

		$("#thermometer .temperature").css({
			'bottom':	this.position(kMinT).counter + 'px'
		});

		$(".full").css({
			'height':	this.position(kMinT).top + 'px'
		});

		$(".top").css({
			'bottom':	this.position(kMinT).glowY + 'px',
			'left'	:	this.position(kMinT).glowX + 'px'
		});

		$("#thermometer").delay(700).animate(kTransitionFullOpacity, 400);
		$("#thermometer .temperature").animate(kTransitionFullOpacity, 400);

		// Set the theme
		$("#thermometer").addClass('theme-' + data.theme.id);
	},

	// Animate the thermometer
	animate: function(callback) {
		// Finish up the animation by displaying the
		// feels like temperature
		var finish = (function() {
			$("#feels_like_text .data").html(data.feels_like);
			$("#feels_like_text .text").html(_t("feels"));

			$(".content .funny").html(util.funnyString(data.temperature));
			$(".content .location_text").html(util.temperatureString(data.temperature, data.unit, data.location));
			$(".content .description").html(util.descriptionString());

			if (!data.legacy) {
				$("#feels_like_text").animate(kTransitionFullOpacity, 500);
			}

			$(".content").animate(kTransitionFullOpacity, 500);
			callback();

		});

    $.waitForImages.hasImgProperties = ['backgroundImage'];
    $('#thermometer').waitForImages(function() {
      thermometer.currentTemperature = data.temperature;
      thermometer.loop(kMinT, finish);
    }, null, true);
	},

	// Animation loop for animating the thermometer
	loop:	function(temperature, callback) {
		var
			position					= this.position(temperature),
			transitionToRegular		= false,
			transitionToHot			= false;

		$("#temperature_text .data").text(temperature);

		$(".temperature").css({
			'bottom':	position.counter + 'px'
		});

		$(".full").css({
			'height':	position.top + 'px'
		});

		$(".top").css({
			'bottom':	position.glowY + 'px',
			'left'	:	position.glowX + 'px'
		});

		// Animate change from cold to regular and from regular to hot
		if (position.status == kThermometerStatusRegular && !transitionToRegular) {
			transitionToRegular = true;

			// $("#cold_empty").animate(kTransitionNoOpacity, 300);
			$("#cold_full").animate(kTransitionNoOpacity, 300);
			$("#cold_top").animate(kTransitionNoOpacity, 300);


			$("#regular_empty").animate(kTransitionFullOpacity, 300);
			$("#regular_full").animate(kTransitionFullOpacity, 300);
			$("#regular_top").animate(kTransitionFullOpacity, 300);

		} else if (position.status == kThermometerStatusHot && !transitionToHot) {
			transitionToRegular = true;

			$("#regular_top").hide();

			$("#hot_empty").animate(kTransitionFullOpacity, 300);
			$("#hot_full").animate(kTransitionFullOpacity, 300);
			$("#hot_top").animate(kTransitionFullOpacity, 300);
		}



		setTimeout(function() {
			if (temperature < thermometer.currentTemperature && temperature < 100) {
				thermometer.loop(temperature + 1, callback);
			} else {
				callback();
			}

		}, kAnimationStepWait);
	}
};

var util = {
	temperatureForUnit: function(temperature, unit)
	{
		if (unit == kTemperatureUnitCelcius)
			return temperature;
		else
			return Math.round(fahrenheit_from_celcius(temperature));
	},

	temperatureCounterString: function(temperature, unit)
	{
		return this.temperatureForUnit(temperature, unit);
	},

	temperatureString: function (temperature, unit, location) {
		return sprintf(_t("its"), temperature, unit, location);
	},

	isInInterval : function(min, max, temperature) {
		return (temperature >= min && temperature <= max);
  },

	funnyString: function (temperature) {
		var rand = Math.random();
		if (temperature <= -15) {
      if (rand < 0.6) { return _t("f_arctic"); }
      return _t("f_penguins");
    } else if (this.isInInterval(-16, 0, temperature)) {
      if (rand > 0.3 && rand < 0.6) { return _t("f_brr"); }
      if (rand > 0.6) { return _t("f_cold"); }
      return _t("f_chilly");
    } else if (this.isInInterval(1, 20, temperature)) {
      if (rand > 0.3 && rand < 0.6) { return _t("f_rock"); }
      if (rand > 0.6) { return _t("f_cruising"); }
      return _t("f_regular");
    } else if (this.isInInterval(21, 35, temperature)) {
      if (rand > 0.3 && rand < 0.6) { return _t("f_dang"); }
      if (rand > 0.6) { return _t("f_sweating"); }
      return _t("f_strong");
    } else if (temperature == 1337) {
      return _t("f_leet");
    } else {
      if (rand > 0.3 && rand < 0.6) { return _t("f_kidding"); }
      if (rand > 0.6) { return _t("f_armageddon"); }
      return _t("f_volcano");
    }
	},

	descriptionString: function() {
		return sprintf(_t("description"), '<a href="http://itunes.apple.com/app/thermo/id414215658?mt=8" target="_blank">', '</a>');
	}
};

var data = {
	location:	null,
	temperature:	null,
	feels_like:	null,
	theme:	null,
	bling_number:	null,
	unit: kTemperatureUnitCelcius,
	country: null,

	legacy: false,


	renderWithData:	function() {
			setTimeout(function (){
				thermometer.animate(function() { console.log('done animating!'); });
			}, 800);
	},

	fallback:	function() {

		this.location = "Copenhagen, Denmark";
		this.temperature = 36;
		this.feels_like = 32;
		this.theme = kThemeNormal;

		this.renderWithData();
	},

	waitForIfnoQuery: function(callback)
	{
		setTimeout(function () {
			if (info_query_done === true) {
				callback();
			} else {
				data.waitForIfnoQuery(callback);
			}
		}, 100);
	},

	decodeWithoutQuery:	function() {
		this.theme = kThemeNormal;

		thermometer.prepareTheme();
		data.decodeFromIp(ip_address);
	},

	decodeFromIp:	function(ip) {
    console.log("looking up weather for ip: " + ip);
		try {
			$.getJSON(kWeatherBaseURI + ip + "&callback=?", function(response, status, xhr) {
				if (xhr.status == 500 || xhr.status == 503 || xhr.status == 404) {
					console.log("Invalid response from weather service");
					data.fallback();
				} else if (response.data.error === undefined) {
					var temp = response.data.current_condition[0].temp_C;
					data.temperature = temp;

					var nearest = response.data.nearest_area[0];
					data.location = nearest.areaName[0].value + ", " + nearest.country[0].value;
					data.country = nearest.country[0].value;

					var temp_f = response.data.current_condition[0].temp_F;
					var windspeed = response.data.current_condition[0].windspeedMiles;
					var humidity = response.data.current_condition[0].humidity;
					var feels = 0;
					if (temp_f >= 80) {
						feels = heatindex(temp_f, humidity);
					} else {
						feels = chillindex(temp_f, windspeed);
					}

					if (data.country === "United States of America" || data.country === "USA") {
						data.unit = kTemperatureUnitFahrenheit;
					} else {
						data.unit = kTemperatureUnitCelcius;
					}

					data.feels_like = Math.floor(celcius_from_fahrenheit(feels));

					data.renderWithData();
				} else {
					console.log("Invalid response from weather service");
					console.log(response.data.error);
					data.fallback();
				}
			});
		} catch (e) {
			console.log("Could not get weather from weather service");
			console.log(e);
			this.fallback();
		}
	},

	decodeWithLegacyQuery: function(query)
	{
		try {
			var decoded = base64_decode(query);
			var escaped = unescape(decoded);
			var parsed = escaped.split(",");

			if (!parsed || parsed.length != 3) {
				console.log('hrmm');
				throw "Invalid share query";
			}

			data.location = parsed[0] + ', ' + parsed[1];
			data.temperature = parsed[2];
			data.feels_like = null;
			data.theme = kThemeNormal;
			data.legacy = true;

			if (data.temperature === "" || data.temperature === null) {
				console.log('123');
				throw "Invalid share query";
			}



			thermometer.prepareTheme();
			this.renderWithData();
		} catch (e) {
			console.log("Could not get weather from decoding legacy share URL");
			console.log(e);
			this.decodeWithoutQuery();
		}
	},

	decodeFromQuery: function(query) {
		try {
			var decoded = base64_decode(query);
      // console.log('decoded: ' + decoded);
			var parsed = $.parseJSON(decoded);
      // console.log('parsed: ' + parsed);

			this.location = parsed.l;
			this.temperature = parsed.e;
			this.feels_like = parsed.f;
			this.theme = this.themeFromData(parsed.t);
			this.bling_number = parsed.b;
			jQuery('body').attr('id', 'share');

			thermometer.prepareTheme();
			this.renderWithData();
		} catch(e) {
			console.log("Got an error while trying to decode data from query");
			console.log(e);

			this.decodeWithoutQuery();
		}
	},

	themeFromData:	function(index) {
		switch(index) {
			case 0 :	return kThemeNormal;
			case 1 :	return kThemeSteampunk;
			case 2 :	return kThemeWood;
			case 3 :	return kThemeSimpleLight;
			case 4 :	return kThemeSimpleDark;
			case 5 :	return kThemeMagic;
			case 6 :	return kThemeBling;
			default:	return kThemeNormal;
		}
	}
};

function animate_landing() {
	if (isiPhone)
		return;

	var iphone = $("#iphone");
	var samsung = $("#samsung");


	$(samsung).animate({left:'408px',opacity:1}, '1500');
	$(iphone).animate({
		left: '225px',
		opacity: 1
	}, '1500', 'swing', function() {
		$('.store').animate({opacity:1}, 'slow');
	});
}

$(document).ready(function() {
  get_user_language();

  var query = window.location.search;
  if(query === "") {
    // data.waitForIfnoQuery(function() { data.decodeWithoutQuery(); });
    jQuery('body').attr('id', 'landing');
    animate_landing();
  } else {
    if(query.indexOf("s=") > 0) {
			jQuery('body').attr('id', 'share');
      data.decodeFromQuery(query.substring(query.indexOf("s=") + 2, query.length));
    } else if(query.indexOf("e=") > 0) {
			jQuery('body').attr('id', 'share');
      data.decodeWithLegacyQuery(query.substring(query.indexOf("e=") + 2, query.length));
    } else if(query.indexOf("loc") > 0) {
			jQuery('body').attr('id', 'share');
      setTimeout(function (){
        data.decodeWithoutQuery();
      }, 1500);
    } else {
      // Show landing
      jQuery('body').attr('id', 'landing');
      animate_landing();
    }
  }

  $(".video").click(function (e) {
		if (isiPhone)
			return;

		e.preventDefault();
		$.fancybox({
      width				: '960px',
      height			: '540px',
      autoSize		: false,
      closeClick  : true,
      openEffect  : 'elastic',
      closeEffect : 'elastic',
      href				: this.href.replace(new RegExp("watch\\?v=", "i"), 'v/') + '&autoplay=1',
      type				: 'swf',
      swf					: {
				'wmode'							: 'transparent',
        'allowfullscreen'		: 'true'
      }
    });
  });
});
