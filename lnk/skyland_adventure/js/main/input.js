function keyDetect() {
	c.tempk[event.keyCode]= event.type=== 'keydown';
	if(!c.k[17] && !/F\d/.test(event.key)) event.preventDefault();
}
window.addEventListener('keydown', keyDetect);
window.addEventListener('keyup', keyDetect);

window.addEventListener('mousemove', function() {
	c.x= save(Math.round(event.clientX/ 2))> c.w? c.w: it;
	c.y= save(Math.round(event.clientY/ 2))> c.h? c.h: it;
});
window.addEventListener('mousedown', function() {
	if(event.button=== 0) c.md= 1;
	if(event.button=== 2) c.md= 2;
});
window.addEventListener('mouseup', function() {
	if(player.pause && c.md=== 1) player.pause= 0;
	c.md= 0;
});
window.addEventListener('contextmenu', function() {
	event.preventDefault();
});
document.addEventListener('visibilitychange', function() {
	if(document.hidden && !c.tscr)
		player.pause= 1;
});
