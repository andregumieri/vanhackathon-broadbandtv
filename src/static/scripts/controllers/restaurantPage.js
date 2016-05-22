var restaurant_name = $('.biz-page-title').text().trim();
var $videosContainer = null;
var $videosWrap = null;

var $navButtonLeft = null;
var $navButtonRight = null;

var $domTopShelf = $('.top-shelf');

/**
 * The function that determines if this controller should or should not
 * be initialized
 * This function is called by main.js
 */
function condition() {
	var isTheRightPath = /^\/biz\/.+/.test(location.pathname);
	var isARestaurantPage = /restaurants/i.test($('span[itemtype="http://data-vocabulary.org/Breadcrumb"] [itemprop="title"]').eq(0).text().trim());
	return isTheRightPath && isARestaurantPage;
}


/**
 * The initialize function
 */
function init() {
	setupVideoWrap();
	App.Modules.loading.on($videosContainer);
	loadVideos(handleLoadVideosCallbackSuccess, handleLoadVideosCallbackError);
}


/**
 * Adds to the DOM the <section /> that wraps the videos
 */
function setupVideoWrap() {
	$videosWrap = $(Mustache.render(App.Templates['videosWrap'], {'restaurant_name': restaurant_name}));
	$videosContainer = $videosWrap.find('.bbtv-videos-wrap__items-container');
	$navButtonLeft = $videosWrap.find('.bbtv-videos-wrap__nav-button.bbtv-videos-wrap__nav-button--left');
	$navButtonRight = $videosWrap.find('.bbtv-videos-wrap__nav-button.bbtv-videos-wrap__nav-button--right');

	$navButtonLeft.on('click', handleNavButtonClick);
	$navButtonRight.on('click', handleNavButtonClick);

	$videosWrap.insertBefore($domTopShelf);
}


/**
 * Show a message telling the user that there isn't any videos to present
 */
function showNoVideoMessage() {

}


/**
 * Add a new video to the DOM
 */
function addVideo(variables) {
	var $videoItem = $(Mustache.render(App.Templates['videoItem'], variables));
	$videosContainer.append($videoItem);
}


/**
 * Fix the size of the container
 */
function fixContainerSize() {
	var $videos = $videosContainer.children('.bbtv-video-item');
	var $video = $videos.eq(0);
	var videoWidth = $video.outerWidth(true);
	var totalWidth = videoWidth*$videos.length;

	$videosContainer.width(totalWidth);
}


/**
 * Get important words at DOM
 *
 * @return {ARRAY} all the found tags
 */
function getTags() {
	var tags = [];

	// highlighted words
	$('.review-highlights-list a.ngram').each(function() {
		var tag = $(this).text().trim().toLowerCase();
		if(tags.indexOf(tag)<0) tags.push(tag);
	});

	// restaurant categories
	$('.category-str-list a').each(function() {
		var tag = $(this).text().trim().toLowerCase();
		if(tags.indexOf(tag)<0) tags.push(tag);
	});

	return tags;
}


/**
 * Call the YouTube API and retrieve all the videos
 *
 * @param {function} callbackSuccess: Success callback function
 * @param {function} callbackError: Fail callback function
 */
function loadVideos(callbackSuccess, callbackError) {
	var query = '';

	// Get the tags
	var tags = getTags();

	// Create query string based on tags
	for(var x=0; x<tags.length; x++) query += '|"' + tags[x] + ' recipe"';

	// Load the API
	$.ajax({
		url: 'https://www.googleapis.com/youtube/v3/search',
		data: {
			q: query.substr(1),
			part: 'id,snippet',
			key: 'AIzaSyCqNKsHTpqrJWyylCHGlA1Y9UytCwFYPA0',
			maxResults: 10,
			safeSearch: 'strict',
			regionCode: 'CA',
			relevanceLanguage: 'en',
			type: 'video',
			videoEmbeddable: true,
			videoSyndicated: true,
			order: 'rating'
		},

		success: callbackSuccess,
		error: callbackError
	});
}


/**
 * Callback of video load
 */
function handleLoadVideosCallbackSuccess(data) {
	if(!data.items.length) {
		showNoVideoMessage();
		return false;
	}


	for(var x=0; x<data.items.length; x++) {
		var video = data.items[x];
		addVideo({
			channel_title: video.snippet.channelTitle,
			video_title: video.snippet.title,
			video_thumb: video.snippet.thumbnails.medium.url
		});
	}

	fixContainerSize();
	App.Modules.loading.off($videosContainer);
}

/**
 * Callback error of video load
 */
function handleLoadVideosCallbackError(data) {

}

/**
 * Handle click event on nav buttons
 */
function handleNavButtonClick(e) {
	e.preventDefault();
	var $this = $(this);

	console.log('Button clicked', $this[0].className);

	// Get the last translate position (if there is any)
	var lastTranslate = $videosContainer.data('lastTranslate') ? $videosContainer.data('lastTranslate') : 0;

	// If the button is inactive, ignore the click
	if(/--inactive/.test($this[0].className)) return false;

	// Move the container to the direction of the clicked button
	if(/--left/.test($this[0].className)) lastTranslate+=290;
	else if(/--right/.test($this[0].className)) lastTranslate-=290;

	// Active or deactive buttons depending on container position
	if(lastTranslate<0) $navButtonLeft.removeClass('bbtv-videos-wrap__nav-button--inactive');
	else $navButtonLeft.addClass('bbtv-videos-wrap__nav-button--inactive');

	// Move the container
	$videosContainer.css('transform', 'translate3d(' + lastTranslate + 'px, 0, 0)');

	// Set the new translate position
	$videosContainer.data('lastTranslate', lastTranslate);
}



module.exports = {
	init: init,
	condition: condition
}
