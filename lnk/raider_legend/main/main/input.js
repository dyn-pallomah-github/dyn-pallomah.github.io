window.addEventListener('mousemove', e=> {
	c.mx= (e.clientX- c.screen.x)/ 3;
	c.my= (e.clientY- c.screen.y)/ 3;
	var player= entity.player;
	if(c.md && c.state!== 5) {
		var [mx, my]= [e.movementX, e.movementY];
		if(Math.abs(my)> 4) entity.levelButton.r= my/ 5.5;
		if(!player.moving && c.state>= 0 && !(player.x% 12 || player.y% 12)) {
			if(Math.abs(mx- my)<= 2) return;
			if(Math.abs(mx)> Math.abs(my)) my= 0;
			else mx= 0;
			if(my<= -6) {
				if(player.d!== 2) player.dchange= 1;
				player.d= 2;
			}
			if(my>= 6) {
				if(player.d!== 0) player.dchange= 1;
				player.d= 0;
			}
			if(mx<= -6) {
				if(player.d!== 1) player.dchange= 1;
				player.d= 1;
			}
			if(mx>= 6) {
				if(player.d!== 3) player.dchange= 1;
				player.d= 3;
			}
		}
	}
});
window.addEventListener('mousedown', e=> {
	if(e.button=== 0) c.md= 1;
});
window.addEventListener('mouseup', e=> {
	if(c.md) {
		for(var i= 0; i< c.buttonX[0].length; i++)
			if(c.mx>= c.buttonX[0][i] && c.mx<= c.buttonX[0][i]+ 14 && c.my>= c.buttonY[0][i] && c.my<= c.buttonY[0][i]+ 14 &&
				 c.state=== 0 || c.state=== 3) {
				c.action.pause();
				break;
			}
		for(var i= 0; i< c.buttonX[1].length; i++)
			if(c.mx>= c.buttonX[1][i] && c.mx<= c.buttonX[1][i]+ 14 && c.my>= c.buttonY[1][i] && c.my<= c.buttonY[1][i]+ 14 &&
				 c.state=== 5) {
				c.action.resume();
				break;
			}
		for(var i= 0; i< c.buttonX[2].length; i++)
			if(c.mx>= c.buttonX[2][i] && c.mx<= c.buttonX[2][i]+ 14 && c.my>= c.buttonY[2][i] && c.my<= c.buttonY[2][i]+ 14) {
				c.action.restart();
				break;
			}
		for(var i= 0; i< c.buttonX[3].length; i++)
			if(c.mx>= c.buttonX[3][i] && c.mx<= c.buttonX[3][i]+ 14 && c.my>= c.buttonY[3][i] && c.my<= c.buttonY[3][i]+ 14) {
				c.action.home();
				break;
			}

		for(var i= 0; i< entity.levelButton.x.length; i++) {
			var btn= entity.levelButton;
			if(c.mx>= btn.x[i]+ 1 && c.mx<= btn.x[i]+ 33+ 6* btn.lv[i].length+ 1 && c.my>= btn.y[i]- 5 && c.my<= btn.y[i]- 6+ 16) {
				c.lv= parseInt(btn.lv[i])- 1;
				localStorage['rl.lv']= c.lv;
				c.genLv();
				c.trans= 0;
				c.state= 3;
				break;
			}
		}
	}
	c.md= 0;
});
c.cvs.addEventListener('wheel', e=> entity.levelButton.m= e.deltaY< 1? 2.5: -2.5);
window.addEventListener('keydown', e=> {
	if(!/F\d/.test(e.key)) e.preventDefault();
	var player= entity.player;
	if(c.state=== 0 || c.state=== 3 || c.state=== 5) switch(e.key) {
		case 'w':
		case 'W':
		case 'ArrowUp':
			if(!player.moving && c.state>= 0 && c.state!== 5 && !(player.x% 12 || player.y% 12)) {
				if(player.d!== 2) player.dchange= 1;
				player.d= 2;
			}
			break;
		case 'a':
		case 'A':
		case 'ArrowLeft':
			if(!player.moving && c.state>= 0 && c.state!== 5 && !(player.x% 12 || player.y% 12)) {
				if(player.d!== 1) player.dchange= 1;
				player.d= 1;
			}
			break;
		case 's':
		case 'S':
		case 'ArrowDown':
			if(!player.moving && c.state>= 0 && c.state!== 5 && !(player.x% 12 || player.y% 12)) {
				if(player.d!== 0) player.dchange= 1;
				player.d= 0;
			}
			break;
		case 'd':
		case 'D':
		case 'ArrowRight':
			if(!player.moving && c.state>= 0 && c.state!== 5 && !(player.x% 12 || player.y% 12)) {
				if(player.d!== 3) player.dchange= 1;
				player.d= 3;
			}
			break;
		case 'r':
		case 'R':
			c.action.restart();
			break;
		case ' ':
			if(c.state=== 5) c.action.resume();
			else if(c.state=== 0 || c.state=== 3) c.action.pause();
			break;
	}
});
