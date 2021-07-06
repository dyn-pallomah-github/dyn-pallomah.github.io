function u(i, j) {
	if(m[i]!== undefined) return m[i][j];
	return undefined;
}
var m= [];
function newLv() {
	if(c.l>= world.length) c.l= c.l% world.length;
	localStorage.savedLevel= c.l;
	c.cp= localStorage.lastFlag? parseInt(localStorage.lastFlag): -1;
	for(var i= 0; i< bl.length; i++) if(bl[i]!== 'null')
		eval(`${bl[i]}.x= []; ${bl[i]}.y= []`);
	for(var i= 0; i< el.length; i++) {
		for(var j= 0; j< Object.keys(eval(el[i])).length; j++) {
			var name= Object.keys(eval(el[i]))[j];
			if(Array.isArray(eval(el[i])[name]) && name!== 'o') eval(el[i])[name]= [];
		}
	}
	for(var i= 0; i< 7; i++) cloud.gen(i* c.w/ 6- 24);
	player.g= 0;

	var m1= world[c.l].trim().split('\n');
	m= [];
	for(var i= 0; i< m1.length; i++) {
		m1[i]= m1[i].split('');
		m[i]= [];
		for(var j= 0; j< m1[i].length; j++) {
			var char= m1[i][j].charCodeAt(0)- 33;
			if(char>= 30000) {
				j++;
				for(var k= 0; k< char- 30000; k++) m[i][j]= m1[i][j+ 1].charCodeAt(0)- 33;
			}
			else m[i][j]= char;
		}
	}
	var x= 0;
	var y= c.h/ 16- 1;
	for(var i= m.length- 1; i>= 0; i--) {
		for(var j= 0; j< m[0].length; j++) {
			var char= m[i][j];

			if(char=== 5) mouse.gen(x* 16, y* 16, -1);
			if(bl[char]!== 'null' && bl[char]) {
				if(bl[char]=== 'soil_slope') {
					soil_slope.setblk(x* 16, y* 16, char- 10);
//					moss.gen(x* 16, y* 16, char+ 2);
					if(char- 10=== 0)
						for(var a= 0; a< 16; a++)
							slope_unit.setblk(x* 16+ a, y* 16+ a);
				}
				else if(char=== 8) {
					if(u(i- 1, j)!== 7) vine.setblk(x* 16, y* 16, 1);
					else vine.setblk(x* 16, y* 16, 0);
				}
				else if(char=== 7) {
					if(u(i, j- 1)=== 6 && u(i, j+ 1)=== 6) log.setblk(x* 16, y* 16, 0);
					else if((u(i, j- 1)!== 6 && u(i, j+ 1)!== 6) || (u(i, j- 1)=== undefined && u(i, j+ 1)=== undefined))
						log.setblk(x* 16, y* 16, 3);
					else if(u(i, j- 1)!== 6 || u(i, j- 1)=== undefined) log.setblk(x* 16, y* 16, 1);
					else if(u(i, j+ 1)!== 6 || u(i, j+ 1)=== undefined) log.setblk(x* 16, y* 16, 2);
				}
				else eval(bl[char]+ '.setblk(x* 16, y* 16)');

				if(char=== 4) {
					if(Math.floor(Math.random()* 4)=== 0 && !pbl.includes(u(i- 1, j))) sprout.gen(x* 16, (y- 1)* 16- 4);

					if(m[i- 1]=== undefined || trsp.includes(m[i- 1][j])) moss.gen(x* 16, (y- 1)* 16, 0);
					if(m[i+ 1]=== undefined || trsp.includes(m[i+ 1][j])) moss.gen(x* 16, (y+ 1)* 16, 1);
					if(m[i][j- 1]=== undefined || trsp.includes(m[i][j- 1])) moss.gen((x- 1)* 16, y* 16, 2);
					if(m[i][j+ 1]=== undefined || trsp.includes(m[i][j+ 1])) moss.gen((x+ 1)* 16, y* 16, 3);

					if((trsp.includes(u(i- 1, j- 1)) &&
							trsp.includes(u(i, j- 1)) &&
							trsp.includes(u(i- 1, j))
						 ))
						moss.gen((x- 1)* 16, (y- 1)* 16, 4);
					if((trsp.includes(u(i- 1, j+ 1)) &&
							trsp.includes(u(i, j+ 1)) &&
							trsp.includes(u(i- 1, j))
						 ))
						moss.gen((x+ 1)* 16, (y- 1)* 16, 5);
					if((trsp.includes(u(i+ 1, j- 1)) &&
							trsp.includes(u(i, j- 1)) &&
							trsp.includes(u(i+ 1, j))
						 ))
						moss.gen((x- 1)* 16, (y+ 1)* 16, 6);
					if((trsp.includes(u(i+ 1, j+ 1)) &&
							trsp.includes(u(i, j+ 1)) &&
							trsp.includes(u(i+ 1, j))
						 ))
						moss.gen((x+ 1)* 16, (y+ 1)* 16, 7);
				}
			}
			if(char=== 1 && c.cp< 0) {
				player.x= player.sx= x* 16;
				player.y= player.sy= y* 16;
			}
			x++;
		}
		y--;
		x= 0;
	}
	if(c.cp>= 0) {
		player.x= player.sx= flag.x[c.cp];
		player.y= player.sy= flag.y[c.cp];
	}
}
