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
	var isARestaurantPage = false;
	$('span[itemtype="http://data-vocabulary.org/Breadcrumb"] [itemprop="title"]').each(function() {
		if(/restaurants/i.test($(this).text().trim())) {
			isARestaurantPage = true;
		}
	});
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
	var $playButton = $videoItem.find('.bbtv-video-item__play-button');

	$playButton.on('click', handleVideoPlayButtonClick);

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
 * Opens the video modal
 *
 * @param {string} videoId: ID of the YouTube video
 */
function openVideoModal(videoId) {
	if($('body>.bbtv-video-modal').is('*')) $('body>.bbtv-video-modal').remove();

	var $modal = $(Mustache.render(App.Templates['videoModal'], {
		width: 800,
		height: 450,
		video_id: videoId
	}));

	var $buttonClose = $modal.find('.bbtv-video-modal__button-close');
	var $hitClose = $modal.find('.bbtv-video-modal__hit-close');
	$buttonClose.on('click', handleModalButtonCloseClick);
	$hitClose.on('click', handleModalButtonCloseClick);

	$('body').append($modal);
	$modal.fadeIn(300);
}


/**
 * Closes the video modal
 */
function closeVideoModal() {
	if(!$('body>.bbtv-video-modal').is('*')) return false;
	$('body>.bbtv-video-modal').fadeOut(function() {
		$(this).remove();
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
			video_id: video.id.videoId,
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

	// Get the last translate position (if there is any)
	var lastTranslate = $videosContainer.data('lastTranslate') ? $videosContainer.data('lastTranslate') : 0;

	// If the button is inactive, ignore the click
	if(/--inactive/.test($this[0].className)) return false;

	// Move the container to the direction of the clicked button
	if(/--left/.test($this[0].className)) lastTranslate+=290;
	else if(/--right/.test($this[0].className)) lastTranslate-=290;

	// Adjust last translate so it don't pass the end of the row
	var outsideRight = ($videosContainer.width()-window.innerWidth)+90+lastTranslate;
	if(outsideRight < -90) {
		var diff = -90 - outsideRight;
		lastTranslate+=diff;
	}

	if(lastTranslate>0) {
		lastTranslate = 0;
	}

	// Active or deactive buttons depending on container position
	if(lastTranslate<0) $navButtonLeft.removeClass('bbtv-videos-wrap__nav-button--inactive');
	else $navButtonLeft.addClass('bbtv-videos-wrap__nav-button--inactive');

	// Move the container
	$videosContainer.css('transform', 'translate3d(' + lastTranslate + 'px, 0, 0)');

	// Set the new translate position
	$videosContainer.data('lastTranslate', lastTranslate);
}


/**
 * Handles click on play video buttons
 */
function handleVideoPlayButtonClick(e) {
	e.preventDefault();
	openVideoModal($(this).parents('.bbtv-video-item').data('video-id'));
}


/**
 * Handles click on close modal button
 */
function handleModalButtonCloseClick(e) {
	e.preventDefault();
	closeVideoModal();
}




module.exports = {
	init: init,
	condition: condition
}
