var $overlay= ()=> entity.overlay= {
	y: [],

	rdr: ()=> {
		var overlay= entity.overlay;
		c.ctx.save();
		c.ctx.fillStyle= '#000000';
		c.ctx.globalAlpha= 1;
		for(var i= 0; i< overlay.y.length; i++) {
			c.ctx.fillRect(0, Math.round(overlay.y[i])* 3, c.cvs.width, 3* 3);
			overlay.y[i]+= 0.8;
			if(overlay.y[i]* 3>= c.cvs.height) {
				overlay.y.splice(i, 1);
				i--;
				overlay.y.push(-3);
			}
		}
		c.ctx.restore();
	},
}
