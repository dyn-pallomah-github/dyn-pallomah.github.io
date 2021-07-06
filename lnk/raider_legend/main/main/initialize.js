var c= {
	cvs: document.getElementById('cvs'),
	ctx: this.cvs.getContext('2d'),
	rdr: (img, cx, x, y, w, h, d= 0, fx= 1, fy= 1)=> {
		if(x> -w && x< c.cvs.width/ 3 && y> -h && y< c.cvs.height/ 3 && document.getElementById(img)) {
			c.ctx.save();
			c.ctx.scale(fx, fy);
			c.ctx.translate((Math.round(x)+ w/ 2)* 3* fx, (Math.round(y)+ h/ 2)* 3* fy);
			c.ctx.rotate(d* 90* Math.PI/ 180);
			var img= document.getElementById(img);
			c.ctx.drawImage(img, cx, 0, w, h, -w/ 2* 3, -h/ 2* 3, w* 3, h* 3);
			c.ctx.restore();
		}
	},
	write: (t, x, y, s= 1, clr= 0)=> {
		t= t.toString().toLowerCase();
		var w= 'abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?';

		[x, y]= [Math.round(x), Math.round(y)];
		if(clr=== 0) for(var i= 0; i< t.length; i++)
			c.ctx.drawImage(document.getElementById('font'), w.indexOf(t[i])* 7, 0, 7, 7, (i* s* 6+ x)* 3, y* 3, s* 21, s* 21);
		if(clr=== 1) for(var i= 0; i< t.length; i++)
			c.ctx.drawImage(document.getElementById('fontBlack'), w.indexOf(t[i])* 5, 0, 5, 5, (i* s* 6+ x)* 3, y* 3, s* 15, s* 15);
	},
	button: (fig, x, y)=> {
		c.rdr('actionButton',
					14* (c.md && c.mx>= x && c.mx<= x+ 14 && c.my>= y && c.my<= y+ 14),
					x, y, 14, 14);
		c.rdr('actionFigure', 10* fig, x+ 2,
					y+ 3+ 2* (c.md && c.mx>= x && c.mx<= x+ 14 && c.my>= y && c.my<= y+ 14), 10, 6);

		if(!(c.buttonX[fig].includes(x) || c.buttonY[fig].includes(y)) ||
			 !(c.buttonX[fig].includes(x) && c.buttonY[fig].includes(y)) && c.buttonX[fig].indexOf(x)!== c.buttonY[fig].indexOf(y)) {
			c.buttonX[fig].push(x);
			c.buttonY[fig].push(y);
		}
	},
	cover: ()=> {
		if(c.trans> 1) {
			c.trans= 1;
		}
		if(c.trans< 0) {
			c.trans= 0;
		}
		c.ctx.save();
		c.ctx.fillStyle= '#000000';
		c.ctx.globalAlpha= 1- c.trans;
		c.ctx.fillRect(0, 0, c.cvs.width, c.cvs.height);
		c.ctx.restore();
	},
	state: 0,
	trans: 1,
	frame: 0,
	clockCycle: 0,
	action: {
		pause: ()=> {
			c.state= 5;
			c.trans= 1;
			for(var i= 0; i< 17; i++)
				entity.overlay.y.push(i* 12);
		},
		resume: ()=> {
			c.state= 0;
			$overlay();
		},
		restart: ()=> {
			c.genLv();
			c.trans= 0;
			c.state= 3;
		},
		home: ()=> {
			c.state= -2;
			$overlay();
		},
	},

	screen: {
		x: window.innerWidth/ 2- this.cvs.width/ 2,
		y: window.innerHeight/ 2- this.cvs.height/ 2,
		midX: this.cvs.width/ 2/ 3,
		midY: this.cvs.height/ 2/ 3,
		offX: 0,
		offY: 0,
	},
	mx: 0,
	my: 0,
	md: 0,
	buttonX: [],
	buttonY: [],

	dev: {
		code: ()=> {
			var unicode= '';
			for(var i= 97; i< 1097; i++) unicode+= String.fromCharCode(i);
			console.log(unicode);
		},
		skip: (num, to)=> {
			c.lv+= num;
			if(to!== undefined) c.lv= to;
			if(c.lv< 0) c.lv+= level.length;
			localStorage['rl.lv']= c.lv;
			c.genLv();
		},
		freeze: (times= Infinity)=> c.froze+= times,
		unfreeze: ()=> c.froze= 0,
	},
	relPos: (x, y, w= 12, h= 12)=> [c.screen.midX- (entity.player.x- x)- w/ 2+ c.screen.offX, c.screen.midY- (entity.player.y- y)- h/ 2+ c.screen.offY],

	lv: parseInt(localStorage['rl.lv']?? 0),
	froze: 0,
	entity: {
		reset: ()=> {
			entity= {};
			$levelButton();
			$player();
			$playerTrail();
			$overlay();
			$particle();
			$spark();
			$explosion();
			$dust();
			$dustParticle();
			$enemyTrail();
			$escape();
			$coin();
			$star();
			$wall();
			$spike();
			$bladeTrap();
			$blade();
			$blaster();
			$blast();
			$dart();
			$bouncePad();
			$wormhole();
			$bat();
			$barrier();
			$glass();
			$gate();
			$wheel();
			$flip();
			$elevator();
			$dragonTrap();
			$dragon();
		},
	},
	list: [
		'',
		'player', 'escape', 'coin', 'star', 'wall', 'spike', 'bladeTrap',
		'blasterU', 'blasterR', 'blasterD', 'blasterL',
		'bouncePadL', 'bouncePadR',
		'wormhole', 'batU', 'batR', 'batD', 'batL',
		'barrierU', 'barrierR', 'barrierD', 'barrierL',
		'glass', 'gate', 'wheel', 'flip',
		'elevatorU', 'elevatorR', 'elevatorD', 'elevatorL',
		'dragonU', 'dragonR', 'dragonD', 'dragonL'
	],
	wall: ['5', '6', '7', '31', '32', '33', '34'],
}
c.ctx.imageSmoothingEnabled= false;
c.cvs.style.marginLeft= c.screen.x+ 'px';
c.cvs.style.marginTop= c.screen.y+ 'px';
c.cvs.style.cursor= 'crosshair';

window.addEventListener('contextmenu', e=> e.preventDefault());
window.addEventListener('resize', e=> {
	c.screen.x= window.innerWidth/ 2- this.cvs.width/ 2;
	c.screen.y= window.innerHeight/ 2- this.cvs.height/ 2;
	c.cvs.style.marginLeft= c.screen.x+ 'px';
	c.cvs.style.marginTop= c.screen.y+ 'px';
});
