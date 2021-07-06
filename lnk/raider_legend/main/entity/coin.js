var $coin= ()=> entity.coin= {
	x: [],
	y: [],
	d: [],
	t: [],

	add: (x, y)=> {
		var coin= entity.coin;
		coin.x.push(x);
		coin.y.push(y);
		coin.d.push(0);
		coin.t.push(0);
	},
	rdr: ()=> {
		var coin= entity.coin;
		for(var i= 0; i< coin.x.length; i++) {
			if(coin.t[i]>= 60) {
				coin.x.splice(i, 1);
				coin.y.splice(i, 1);
				coin.d.splice(i, 1);
				coin.t.splice(i, 1);
				i--;
				continue;
			}
			if(coin.t[i]> 0) {
				c.rdr('coinVanish', Math.floor(coin.t[i]/ 10)* 20, ...c.relPos(coin.x[i]- 4, coin.y[i]+ 4), 20, 3, coin.d[i]);
				if(c.state!== 5) coin.t[i]++;
			}
			else c.rdr('coin', c.frame% 4* 8, ...c.relPos(coin.x[i]+ 2, coin.y[i]+ 2), 8, 8);
		}
	},
}
