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
});
