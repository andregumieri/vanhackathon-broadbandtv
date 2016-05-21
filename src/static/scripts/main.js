var Templates = {
	'videoItem': require('../views/video-item.html.js'),
	'videosWrap': require('../views/videos-wrap.html.js')
};

jQuery(document).ready(function($) {
	var $domVideosWrap = $(Mustache.render(Templates['videosWrap'], {'restaurant_name': $('.biz-page-title').text().trim()}));
	var $container = $domVideosWrap.find('.bbtv-videos-wrap__items-container');

	for(var x=0; x<10; x++) {
		var $videoItem = $(Mustache.render(Templates['videoItem'], {channel_title: 'Test ' + x, video_title: 'Test video ' + x}));
		$container.append($videoItem);
	}

	$domVideosWrap.insertBefore($('.top-shelf'));

	var totalWidth = $container.children().eq(0).outerWidth(true) * 10;
	$container.width(totalWidth);

	// console.log("Ready");
	// var res = Mustache.render(Templates['videoItem'], {channel_title: 'Test', video_title: 'Test video'});
	// console.log(res);
});
