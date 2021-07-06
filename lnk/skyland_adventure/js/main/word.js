var w= {
	list: `abcdefghijklmnopqrstuvwxyz0123456789 \`~!@#$%^&*()-_=+[]{}\\|;:'",<.>/?`,
	prt: function(x, y, t) {
		var t= t.toLowerCase();
		var wl= 0;
		var lb= 0;
		for(var i= 0; i< t.length; i++) {
			if(t[i]=== '\n') {
				lb++;
				wl= 0;
				continue;
			}
			else if(w.list.includes(t[i])) c.rdr('font', (w.list.indexOf(t[i])+ 1)* 9, 9, 9, x+ 9* wl, y+ 9* lb);
			else c.rdr('font', 0, 9, 9, x+ 9* wl, y+ 9* lb);
			wl++;
		}
	},
}
