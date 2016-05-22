window.App = {};




jQuery(document).ready(function($) {
	App.Templates = {
		'videoItem': require('../views/video-item.html.js'),
		'videosWrap': require('../views/videos-wrap.html.js')
	};

	App.Modules = {
		'loading': require('./modules/bbtv-loading.js')
	};

	App.Controllers = {
		'restaurantPage': require('./controllers/restaurantPage.js')
	};




	// Initialize the controllers (if condition return true)
	for(var key in App.Controllers) {
		var ctrl = App.Controllers[key];

		// Skip the loop if there is no init function in the controller
		if(typeof ctrl.init == 'undefined') continue;

		// Read the condition to exec the controller. If there is no condition
		// function, assumes as true
		var condition = typeof ctrl.condition != 'undefined' ? ctrl.condition() : true;

		// If condition is truth, initialize the controller
		if(condition) ctrl.init();
	}

















	//
	// var restaurant_name = $('.biz-page-title').text().trim();
	// var city_name = $('.street-address [itemprop="addressLocality"]').text().trim();
	// var $domVideosWrap = $(Mustache.render(Templates['videosWrap'], {'restaurant_name': restaurant_name}));
	// var $container = $domVideosWrap.find('.bbtv-videos-wrap__items-container');
	//
	//
	// $domVideosWrap.find('.bbtv-videos-wrap__open-close-button').on('click', function() {
	// 	$domVideosWrap.animate({
	// 		height: 0,
	// 		minHeight: 0,
	// 		padding: 0
	// 	});
	// });
	//
	// $domVideosWrap.find('.bbtv-videos-wrap__nav-button').on('click', function(e) {
	// 	e.preventDefault();
	// 	var $this = $(this);
	// 	var lastTranslate = $container.data('lastTranslate') ? $container.data('lastTranslate') : 0;
	//
	// 	if(/--inactive/.test($this[0].className)) return false;
	//
	// 	if(/--left/.test($this[0].className)) {
	// 		// Back
	// 		lastTranslate+=290;
	// 	} else if(/--right/.test($this[0].className)) {
	// 		// Advance
	// 		lastTranslate-=290;
	// 	}
	//
	// 	if(lastTranslate<0) {
	// 		$('.bbtv-videos-wrap__nav-button--left').removeClass('bbtv-videos-wrap__nav-button--inactive');
	// 	} else {
	// 		$('.bbtv-videos-wrap__nav-button--left').addClass('bbtv-videos-wrap__nav-button--inactive');
	// 	}
	//
	// 	$container.css('transform', 'translate3d(' + lastTranslate + 'px, 0, 0)');
	// 	$container.data('lastTranslate', lastTranslate);
	// })

	// for(var x=0; x<10; x++) {
	// 	var $videoItem = $(Mustache.render(Templates['videoItem'], {channel_title: 'Test ' + x, video_title: 'Test video ' + x}));
	// 	$container.append($videoItem);
	// }


	// CHECK IF IT IS A RESTAURANT PAGE
	/*
	$('span[itemprop="title"]')
[<span itemprop=​"title">​Restaurants​</span>​, <span itemprop=​"title">​French​</span>​]
*/

	// "brazilian food"|"brazilian recipe"|"latin american food"|"latin american recipe"|"Tapas/Small Plates food"|"Tapas/Small Plates recipe"|"Meta Petisco Bar Toronto"

	// App.Modules.loading.on($container);
	//
	//
	// // LOAD DATA
	//
	// var tagsQuery = '';
	//
	// $('.review-highlights-list a.ngram').each(function() {
	// 	var tag = $(this).text().trim();
	// 	if(/bars?/i.test(tag)) return ; // tags with bars brings only recipies of bars
	// 	tagsQuery += '|"' + tag + ' recipe"';
	// });
	//
	// $('.category-str-list a').each(function() {
	// 	var tag = $(this).text().trim();
	// 	if(/bars?/i.test(tag)) return ; // tags with bars brings only recipies of bars
	// 	tagsQuery += '|"' + tag + ' recipe"';
	// });
	//
	//
	//
	// restaurant_query = '"' + restaurant_name + ' ' + city_name + '"';
	//
	// $domVideosWrap.insertBefore($('.top-shelf'));
	//
	// $.get('https://www.googleapis.com/youtube/v3/search?q=' + restaurant_query + '|' + tagsQuery.substr(1) + '&part=id,snippet&key=AIzaSyCqNKsHTpqrJWyylCHGlA1Y9UytCwFYPA0&maxResults=10&safeSearch=strict&regionCode=CA&relevanceLanguage=en&type=video&videoEmbeddable=true&videoSyndicated=true&order=rating', function(data) {
	// 	for(var x=0; x<data.items.length; x++) {
	// 		var video = data.items[x];
	// 		var $videoItem = $(Mustache.render(Templates['videoItem'], {
	// 			channel_title: video.snippet.channelTitle,
	// 			video_title: video.snippet.title,
	// 			video_thumb: video.snippet.thumbnails.medium.url,
	// 		}));
	// 		$container.append($videoItem);
	// 	}
	//
	// 	// console.log("Calc", $container.children().eq(0).outerWidth(true), data.items.length);
	// 	// var totalWidth = $container.children().eq(0).outerWidth(true) * data.items.length;
	// 	// $container.width(totalWidth);
	//
	// 	App.Modules.loading.off($container);
	// });



	// console.log("Ready");
	// var res = Mustache.render(Templates['videoItem'], {channel_title: 'Test', video_title: 'Test video'});
	// console.log(res);
});
