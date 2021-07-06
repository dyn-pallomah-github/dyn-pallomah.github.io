var c= {
	v: '4.6',
	cvs: document.getElementById('game'),
	w: document.getElementById('game').width/ 2,
	h: document.getElementById('game').height/ 2,
	x: 0,
	y: 0,
	md: 0,

	ctx: document.getElementById('game').getContext('2d'),
	rdr: function(img, sx, w, h, x, y) {
		c.ctx.drawImage(document.getElementById(img), sx, 0, w, h, Math.round(x* 2), Math.round(y* 2), w* 2, h* 2);
	},
	clr: function() {
		c.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
	},
	trs: 0,

	l: 0,
	cp: -1,
	k: [],
	oldk: [],
	tempk: [],

	fps: 60,
	f: 0,
}
document.title= `${document.title} (v${c.v})`;
c.ctx.imageSmoothingEnabled= false;
c.cx= c.w/ 2- 8;
c.cy= c.h/ 2- 8;
c.px= c.cx;
c.py= c.cy;
