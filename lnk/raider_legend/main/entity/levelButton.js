var $levelButton= ()=> entity.levelButton= {
	x: [],
	y: [],
	lv: [],
	m: 0,
	r: 0,

	add: ()=> {
		var btn= entity.levelButton;
		for(var i= 0; i< level.length; i++) {
			btn.x.push(c.cvs.width/ 2/ 3- 80);
			btn.y.push(c.cvs.height/ 3- 16- 40- 30- 18* i- 36* Math.floor(i/ 3));
			btn.lv.push((i+ 1).toString());
		}
		var y= (18+ 6)- btn.y[c.lv];
		btn.y.forEach((v, x)=> btn.y[x]+= y);
	},
	rdr: ()=> {
		var btn= entity.levelButton;
		btn.y.forEach((v, x)=> {
			btn.y[x]+= btn.m;
			btn.y[x]+= btn.r;
		});
		btn.m*= 0.96;
		btn.r*= 0.96;
		if(Math.abs(btn.m)< 0.05) btn.m= 0;
		for(var i= 0; i< btn.x.length; i++) {
			var press= c.md && c.mx>= btn.x[i]+ 1 && c.mx<= btn.x[i]+ 33+ 6* btn.lv[i].length+ 1 && c.my>= btn.y[i]- 5 && c.my<= btn.y[i]- 6+ 16;
			var current= btn.lv[i]- 1=== c.lv && c.frame% 4<= 1;
			c.rdr('levelButton', 15* (2* press+ 4* current),
						...c.relPos(btn.x[i], btn.y[i]), 15, 16);

			for(var j= 0; j< btn.lv[i].length- 1; j++)
				c.rdr('levelButton', 15* (2* press+ 4* current+ 1), ...c.relPos(btn.x[i]+ 15+ 6* j, btn.y[i]), 6, 16);
			c.rdr('levelButton', 15* (2* press+ 4* current+ 1), ...c.relPos(btn.x[i]+ 15+ 6* (btn.lv[i].length- 1), btn.y[i]), 8, 16);
			c.write(btn.lv[i], ...c.relPos(btn.x[i]+ 16+ 1, btn.y[i]+ 4+ 3* press), 1, 1);

			c.rdr('levelButton', 15* (2* press+ 4* current),
						...c.relPos(btn.x[i]+ 15+ 6* btn.lv[i].length+ 2, btn.y[i]), 15, 16, 0, -1);

			if(btn.lv[i]=== '1') {
				c.rdr('levelLink', c.frame% 8* 4, ...c.relPos(btn.x[i]+ 17, btn.y[i]+ 15+ 1), 4, 38);
				c.rdr('gameLogo', (c.frame% 4<= 1)* 152, ...c.relPos(btn.x[i], btn.y[i]+ 15+ 1+ 38), 152, 30);
			}
			if(btn.lv[i]=== level.length.toString()) {
				c.rdr('levelLink', c.frame% 8* 4, ...c.relPos(btn.x[i]+ 17, btn.y[i]- 38), 4, 38);
				c.rdr('end', 0, ...c.relPos(btn.x[i], btn.y[i]- 38- 35), 110, 35);
			}
			if(!((btn.lv[i]- 1)% 3) && btn.lv[i]!== '1') c.rdr('levelLink', c.frame% 8* 4, ...c.relPos(btn.x[i]+ 17, btn.y[i]+ 15+ 1), 4, 38);
			if(!(btn.lv[i]% 3)) {
				c.rdr('levelTheme', 0, ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5, btn.y[i]+ 1), 9, 51);
				switch(btn.lv[i]/ 3) {
					case 1:
						c.rdr('player', c.frame% 8* 14, ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 2, btn.y[i]+ 18), 14, 14);
						c.write('beginning', ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3+ 12+ 6, btn.y[i]+ 18+ 4));
						break;
					case 2:
						c.rdr('spike', 4* 12, ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3, btn.y[i]+ 19), 12, 12);
						c.write('spike', ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3+ 12+ 6, btn.y[i]+ 18+ 4));
						break;
					case 3:
						c.rdr('bladeTrap', (4+ 6* (c.frame% 4<= 1))* 12, ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3, btn.y[i]+ 19), 12, 12);
						c.write('blade trap', ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3+ 12+ 6, btn.y[i]+ 18+ 4));
						break;
					case 4:
						c.rdr('blaster', (c.frame% 14<= 8? 0: c.frame% 14- 9)* 12, ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3, btn.y[i]+ 19), 12, 12, 1, 1, -1);
						c.write('blaster', ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3+ 12+ 6, btn.y[i]+ 18+ 4));
						break;
					case 5:
						c.rdr('bat', c.frame% 8* 14, ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3, btn.y[i]+ 19), 14, 12);
						c.write('bat', ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3+ 12+ 6, btn.y[i]+ 18+ 4));
						break;
					case 8:
						if(c.frame% 10=== 4)
							c.rdr('bouncePad', (1+ 3* (c.frame% 4< 2))* 12, ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3, btn.y[i]+ 19), 12, 12, 1, 1, -1);
						else if(c.frame% 10> 4)
							c.rdr('bouncePad', 3* (c.frame% 4< 2)* 12, ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3, btn.y[i]+ 19), 12, 12, 1, 1, -1);
						else
							c.rdr('bouncePad', (Math.min(2, c.frame% 10)+ 3* (c.frame% 4< 2))* 12, ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3, btn.y[i]+ 19), 12, 12, 1, 1, -1);
						c.write('bounce pad', ...c.relPos(btn.x[i]+ 30+ 6* btn.lv[i].length+ 2+ 1+ 5+ 9+ 3+ 12+ 6, btn.y[i]+ 18+ 4));
						break;
				}
			}
		}
	},
}
