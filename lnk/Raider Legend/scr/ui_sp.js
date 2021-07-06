var btn= new sp({
	name: 'btn',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		x: 0,
		y: 0,
		fig: 0,
		f: 0,
		holding: 0,
		clicking: 0,
		action: ()=> 0,
	},
	rdr() {
		if(this_clicking) this_action();
		if(btn.fig[i]< 2) btn.fig[i]= game_paused;

		rdr('button', 20* this_f, this_x, this_y, 0, 20);
		rdr('button_figure', 8* this_fig, this_x+ 6, this_y+ 4+ this_f, 0, 8);

		if(this_holding && this_f< 3) ++btn.f[i];
		else if(!this_holding && this_f> 0) --btn.f[i];
	},
});

var black_stripe= new sp({
	name: 'black_stripe',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		y: -6,
	},
	rdr() {
		ctx.save();
		ctx.fillStyle= '#000';
		ctx.globalAlpha= 1- (game_paused_t/ 36);
		ctx.fillRect(0, this_y* 3, uw* 3, 3* 6);
		ctx.restore();

		++black_stripe.y[i];
		if(black_stripe.y[i]>= uh+ 6) {
			black_stripe.add();
			black_stripe.del();
		}
	},
});

var lv_btn= new sp({
	name: 'lv_btn',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		x: 0,
		y: 0,
		lv: 0,
	},
	rdr() {
		rdr('level_button', 0, this_x, this_y, 0);

		let str;
		if(mode=== 'lesson') str= stage.lesson_name[this_lv- 1];
		else str= this_lv+ [];

		for(let i= 0; i<= 6* (str.length- 1)+ 5+ 15; ++i)
			rdr('level_button', 7, this_x+ 7+ i, this_y, 0, 1);

		rdr('level_button', 0, this_x+ 8+ 6* (str.length- 1)+ 5+ 15, this_y, 0, auto, auto, auto, auto, -1);

		write(str, this_x+ 15, this_y+ 4, 1, 'black_font');

		if(
			m.btn=== 0 &&
			m.start_x>= this_x && m.start_x<= this_x+ 8+ 6* (str.length- 1)+ 5+ 15+ 8 &&
			m.x>= this_x && m.x<= this_x+ 8+ 6* (str.length- 1)+ 5+ 15+ 8 &&
			m.start_y>= this_y && m.start_y<= this_y+ 18 &&
			m.y>= this_y && m.y<= this_y+ 18
		) {
			lv= this_lv- 1;
			state= 'gen_lv';
		}
	},
});
