'use strict';

addEventListener('load', e=> {
	const gallery= document.getElementById('featured_gallery');
	for(const img_link of gallery.children) {
		const img= img_link.getElementsByTagName('img')[0];
		img.width= 140* 1366/ 768;
		img.height= 140;
	}
});
