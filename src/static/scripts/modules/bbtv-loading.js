function on(el) {
	var dom = '<div class="bbtv-loading"><div class="bbtv-loading__element bbtv-loading__element--1"></div><div class="bbtv-loading__element bbtv-loading__element--2"></div><div class="bbtv-loading__element bbtv-loading__element--3"></div><div class="bbtv-loading__element bbtv-loading__element--4"></div><div class="bbtv-loading__element bbtv-loading__element--5"></div></div>';
	if($(el).find('.bbtv-loading').is('*')) return false;
	$(el).append(dom);
}

function off(el) {
	$(el).find('.bbtv-loading').remove();
}

module.exports = {
	on: on,
	off: off
}
