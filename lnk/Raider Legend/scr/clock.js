'use strict';

var state= 'title_scr';
let
	frame= 0,
	abs_frame= 0,
	fps,
	fps_every_half_s,
	frame_delta,
	f= (freq= 5, index= frame)=> Math.floor(index/ freq),
	old_t,
	swipe_t= 0;
let
	game_paused= 0,
	game_paused_t= Infinity,
	game_resumed_t= -12;
let
	show_hint= 0,
	show_hint_t= Infinity,
	close_hint_t= 0;

let wait_fn= [], wait_t= [];
function wait(f, fn) {
	wait_fn.push(fn);
	wait_t.push(frame+ f);
}

addEventListener('load', e=> {
	old_t= Date.now();
	function clock() {
		if(!(state=== 'gen_lv' || state=== 'cutscene_gen_lv')) ctx.clearRect(0, 0, cvs.width, cvs.height);
		for(let i= 0; i< wait_fn.length; ++i) {
			if(wait_t[i]=== frame) {
				wait_fn[i]();
				wait_fn.splice(i, 1);
				wait_t.splice(i, 1);
				--i;
			}
		}

		const playing= !game_paused && game_resumed_t<= 0 && game_paused_t>= 36;
		function toggle_pausing() {
			if(state=== 'playing' && (player.cutscene_t< 0 || player.cutscene_t>= 36)) {
				game_paused= 1- game_paused;
				if(game_paused) {
					if(game_paused_t>= 36) {
						game_paused_t= 36;
						for(let i= 0; i< uh/ 12+ 1; ++i)
							black_stripe.add({y: 6* (i* 2- 1)});

						// continue btn
						btn.add({
							x: (uw- (20* 4))/ 2- 4* 1.5,
							y: Infinity,
							fig: 1,
							action() {
								if(!game_paused_t) game_paused= 0;
							},
						});
						// hint btn
						btn.add({
							x: (uw- (20* 2))/ 2- 4* 0.5,
							y: Infinity,
							fig: 2,
							action() {
								
							},
						});
						// restart btn
						btn.add({
							x: (uw- (20* 0))/ 2- 4* -0.5,
							y: Infinity,
							fig: 3,
							action() {
								if(!game_paused_t) {
									game_paused= 0;
									game_paused_t= Infinity;
									game_resumed_t= -12;
									state= 'player_died';
									sp.reset('black_stripe', 'btn');
								}
							},
						});
						// home btn
						btn.add({
							x: (uw- (20* -2))/ 2- 4* -1.5,
							y: Infinity,
							fig: 4,
							action() {
								game_paused= 0;
								game_paused_t= Infinity;
								game_resumed_t= -12;

								state= 'menu_lesson';
								for(let i= 1; i<= stage.lesson.length; ++i) lv_btn.add({
									x: 10,
									y: 10+ 20* (i- 1),
									lv: i,
								});
							},
						});
					}
					player.pre_move= -1;
					player.pre_move_t= 0;
				}
			}
		}

		switch(state) {
			case 'title_scr': {
				rdr('english_title', 152* (f(15)% 2), (uw- 152)/ 2, 60, 0, 152);
				write('tap to play', (uw- (11* 6+ 1))/ 2, 60+ 30+ 20);
				break;
			}
			case 'cutscene_gen_lv':
			case 'gen_lv': {
				gen_lv();
				let passed= 0;
				for(const rdr_component in cvs_cache) {
					try {
						const cache= cvs_cache[rdr_component];
						cache.getContext('2d').getImageData(0, 0, cache.width, cache.height);
						if(!(cache.width && cache.height)) ++passed;
						else break;
					}
					catch(_) {++passed}
				}
				if(passed=== Object.keys(cvs_cache).length) {
					if(state=== 'cutscene_gen_lv') player.cutscene_t= 0;
					state= 'playing';

					// pause btn
					btn.add({
						x: uw- 16- 8,
						y: 6,
						fig: 0,
						action: toggle_pausing,
					});
				}
				break;
			}
			case 'player_died':
			case 'player_esc':
			case 'playing': {
				if(k[' ']) toggle_pausing();

				if(state=== 'playing' && player.stamina && playing) {
					const old_player_d= player.d;
					if(k.s || k.ArrowDown) player.d= 0;
					if(k.a || k.ArrowLeft) player.d= 1;
					if(k.w || k.ArrowUp) player.d= 2;
					if(k.d || k.ArrowRight) player.d= 3;

					let reset_swipe= 0;
					if(m.btn=== 0) {
						if(Math.abs(m.delta_y)- Math.abs(m.delta_x)>= 4 || Math.abs(m.swipe_dist_y)- Math.abs(m.swipe_dist_x)>= 90) {
							if(m.delta_y>= 2.5 || m.swipe_dist_y<= -60) {
								player.d= 0;
								reset_swipe= 1;
							}
							else if(m.delta_y<= -2.5 || m.swipe_dist_y>= 60) {
								player.d= 2;
								reset_swipe= 1;
							}
						}
						if(Math.abs(m.delta_x)- Math.abs(m.delta_y)>= 4 || Math.abs(m.swipe_dist_x)- Math.abs(m.swipe_dist_y)>= 90) {
							if(m.delta_x<= -2.5 || m.swipe_dist_x>= 60) {
								player.d= 1;
								reset_swipe= 1;
							}
							else if(m.delta_x>= 2.5 || m.swipe_dist_x<= -60) {
								player.d= 3;
								reset_swipe= 1;
							}
						}
					}

					if(!player.moving && (player.col(chameleon_block, 'fixed_x', 'fixed_y')< 0 || chameleon_block.glob_t>= 90)) {
						if(player.pre_move>= 0 && player.pre_move_t< 18) {
							player.d= player.pre_move;
							player.pre_move= -1;
							player.pre_move_t= 0;
						}
					}
					else if(old_player_d!== player.d) {
						player.pre_move= player.d;
						player.pre_move_t= 0;
						player.d= old_player_d;
					}

					if(old_player_d!== player.d) player.d_change= 1;

					let col_id;
					if(
						k.s || k.ArrowDown || k.a || k.ArrowLeft || k.w || k.ArrowUp || k.d || k.ArrowRight ||
						m.btn=== 0 &&
						(Math.abs(m.delta_x)>= 2.5 || Math.abs(m.delta_y)>= 2.5) &&
						Math.abs(m.delta_x- m.delta_y)>= 4 &&
						!swipe_t
					) {
						if(player.in_bubble && player.col(bubble)=== player.used_bubble && bubble.used[player.used_bubble]) {
							player.dash_in_bubble= 1;
							player.cont_t= 0;
							--player.stamina;
						}
						if((col_id= player.col(jelly, 'next_x', 'next_y'))>= 0 && !player.d_change)
							player.dash_on_jelly= jelly.group[col_id];
					}

					if(swipe_t> 0) --swipe_t;
					if(reset_swipe) swipe_t= 6;
				}

				if(k.r && playing && (player.cutscene_t< 0 || player.cutscene_t>= 36)) state= 'player_died';
				for(const key in k) if(k[key]) hold_k[key]= 1;
				k= {};

				if(playing) for(const n of sp.act_first) window[n].act();
				if(state!== 'playing') player.moving= 0;

				cam_x= player.x- player.cam_tilt_x- ice_block.cam_tilt_x- (uw- 12)/ 2;
				cam_y= player.y- player.cam_tilt_y- ice_block.cam_tilt_y- (uh- 12)/ 2;

				if(state!== 'playing') {
					ctx.save();
					ctx.fillStyle= '#ff0';
					if(state=== 'player_died' && player.death_t<= 3* 14) {
						ctx.globalAlpha= 1- player.death_t/ (3* 14);
						ctx.fillRect(0, 0, cvs.width, cvs.height);
					}
					if(state=== 'player_esc' && player.esc_t<= 2* 14) {
						ctx.globalAlpha= 1- player.esc_t/ (2* 14);
						ctx.fillRect(0, 0, cvs.width, cvs.height);
					}
					ctx.restore();
				}

				for(const n of sp.layers) {
					if(sp.lazy.includes(n)) lazy_rdr(n);
					else {
						if(n=== 'player' && state!== 'playing')
							continue;
						window[n].rdr();
					}
				}

				if(state!== 'playing') {
					ctx.save();
					ctx.fillStyle= '#000';
					ctx.globalAlpha= 0.8;
					ctx.fillRect(0, 0, cvs.width, cvs.height);
					ctx.restore();
					player.rdr();
				}

				if(window.show_hitbox) {
					ctx.save();
					ctx.strokeStyle= '#f00';
					ctx.lineWidth= 3;
					for(const n of sp.lazy) {
						const s= window[n];
						if(s.meta.is_solid) ctx.strokeStyle= '#fff';
						if(s.meta.has_hitbox) for(let i= 0; i< s.count; ++i)
							ctx.strokeRect((s.x[i]+ 0.5- cam_x)* 3, (s.y[i]+ 0.5- cam_y)* 3, (12- 1)* 3, (12- 1)* 3);
					}
					ctx.restore();
				}

				let str;
				if(game_paused_t<= 36) {
					ctx.save();
					ctx.fillStyle= '#000';
					ctx.globalAlpha= (1- (game_paused_t/ 36))* 0.5;
					ctx.fillRect(0, 0, cvs.width, cvs.height);
					ctx.restore();
					black_stripe.rdr();

					const slide_y= (game_paused_t/ 36)** 2.8* 240;
					ctx.save();
					ctx.fillStyle= '#ff0';
					ctx.globalAlpha= 1;
					ctx.fillRect(3* (uw- 132)/ 2, 3* Math.round((uh- 104)/ 2+ slide_y+ 5), 3* 132, 3* 104);
					ctx.fillRect(3* (uw- 130)/ 2, 3* Math.round((uh- 108)/ 2+ slide_y+ 5), 3* 130, 3* 108);
					ctx.fillRect(3* (uw- 126)/ 2, 3* Math.round((uh- 110)/ 2+ slide_y+ 5), 3* 126, 3* 110);
					ctx.restore();

					write(
						str= 'paused',
						Math.round((uw- 13* str.length)/ 2),
						Math.round((uh- 110)/ 2+ slide_y)+ 5+ 10,
						1, 'fancy_font',
					);
					const vine_y= Math.round((uh- 110)/ 2+ slide_y)+ 15+ 14+ 8;
					rdr('vine', 0, (uw- 132)/ 2+ 6, vine_y, 0);
					rdr('vine', 0, (uw- 132)/ 2+ 6+ 60, vine_y, 0, 60, 12, 1, 0, -1);

					if(mode=== 'lesson')
						write(str= stage.lesson_name[lv], (uw- 6* str.length)/ 2, vine_y+ 12+ 12, 1, 'black_font');
					else if(mode=== 'adventure')
						write(str= 'room '+ (lv+ 1), (uw- 6* str.length)/ 2, vine_y+ 12+ 12, 1, 'black_font');

					for(let i= 1; i< btn.count; ++i)
						btn.y[i]= Math.round((uh- 110)/ 2+ slide_y)+ 5+ 110- 20- 8;

					ctx.save();
					ctx.fillStyle= '#000';
					ctx.globalAlpha= 1;
					ctx.fillRect(3* (uw- 120)/ 2, 3* (Math.round((uh- 112)/ 2+ slide_y)+ 5+ 112- 32- 3), 3* 120, 3);
					ctx.restore();
				}

				if(game_paused && game_paused_t> 0) --game_paused_t;
				if(!game_paused) {
					++game_paused_t;

					if(game_paused_t=== 36) {
						game_resumed_t= 105;

						const
							btn_holding= btn.holding[0],
							btn_f= btn.f[0];
						sp.reset('black_stripe', 'btn');
						btn.add({
							x: uw- 16- 8,
							y: 6,
							fig: 0,
							action: toggle_pausing,
						});
						btn.holding[0]= btn_holding;
						btn.f[0]= btn_f;
					}

					if(game_paused_t> 36 && game_resumed_t> -12) {
						--game_resumed_t;

						ctx.save();
						ctx.fillStyle= '#ff0';
						ctx.globalAlpha= game_resumed_t> 0?
							1- Math.max(0, game_resumed_t- 90)/ 15 :
							1- -game_resumed_t/ 12;

						ctx.fillRect(0, 3* Math.round((uh- 24)/ 2- 30+ player.cam_tilt_y), 3* uw, 3* 24);

						ctx.fillStyle= '#000';
						ctx.fillRect(0, 3* Math.round((uh- 24)/ 2- 30+ player.cam_tilt_y- 1), 3* uw, 3);
						ctx.fillRect(0, 3* Math.round((uh- 24)/ 2- 30+ player.cam_tilt_y+ 24), 3* uw, 3);

						write(
							Math.max(1, Math.min(3, Math.ceil(game_resumed_t/ 30))),
							Math.round((uw- 5* 2)/ 2),
							Math.round((uh- 24)/ 2- 30+ player.cam_tilt_y)+ Math.round((12- 6)* 2/ 2),
							ctx.globalAlpha, 'black_font', 2,
						);
						ctx.restore();
					}
				}

				if(playing) for(const n of sp.rdr_first) window[n].act();

				for(let i= 0; i< btn.count; ++i) {
					btn.clicking[i]= 0;
					if(
						m.btn=== 0 &&
						m.start_x>= btn.x[i] && m.start_x<= btn.x[i]+ 21 && m.x>= btn.x[i] && m.x<= btn.x[i]+ 20 &&
						m.start_y>= btn.y[i] && m.start_y<= btn.y[i]+ 21 && m.y>= btn.y[i] && m.y<= btn.y[i]+ 20
					) {
						if(!btn.holding[i]) btn.clicking[i]= 1;
						btn.holding[i]= 1;
					}
					else btn.holding[i]= 0;
				}
				btn.rdr();

				if(mode=== 'lesson') write(str= stage.lesson_name[lv], (uw- (6* str.length+ 1))/ 2, 8);
				else if(mode=== 'adventure') write(str= 'room '+ (lv+ 1), (uw- (6* str.length+ 1))/ 2, 8);
				rdr('level_dash_line', 0, (uw- (str.length* 6+ 1))/ 2- 37- 4, 8+ 1, 0);
				rdr('level_dash_line', 0, (uw- (str.length* 6+ 1))/ 2+ str.length* 6+ 5, 8+ 1, 0, 37, 3, 1, 0, -1);

				rdr('level_completion', 0, 8, 6, 0);
				if(lv_stats.total) write(Math.floor(player.stats_dot/ lv_stats.total* 100)+ '%', 21, 8);
				else write('nil', 21, 8);

				for(let i= 0; i< 3; ++i) {
					if(player.stats_star> i)
						rdr('star_icon', 10, 11* i+ (uw- 10)/ 2- 11, 20, 0, 10);
					else if(lv_stats.star- 1< i)
						rdr('prohibit', 0, 12* i+ (uw- 12)/ 2- 12, 19, 0);
					else rdr('star_icon', 0, 11* i+ (uw- 10)/ 2- 11, 20, 0, 10);
				}

				if(player.cutscene_t>= 0 && player.cutscene_t< 36) {
					ctx.save();
					ctx.fillStyle= '#ff0';
					ctx.globalAlpha= 1;
					ctx.fillRect(Math.round(cvs.width* (player.cutscene_t/ 36)** 1.8), 0, cvs.width, cvs.height);
					ctx.restore();
				}

				if(player.death_t>= 3* 14+ 6 || player.esc_t>= 3* 14+ 18) {
					ctx.save();
					ctx.fillStyle= '#ff0';
					ctx.globalAlpha= 1;
					if(state=== 'player_died') {
						ctx.fillRect(0, 0, Math.round(cvs.width* ((player.death_t- (3* 14+ 6))/ 36)** 1.8), cvs.height);
						if(player.death_t>= 3* 14+ 6+ 36) state= 'cutscene_gen_lv';
					}
					if(state=== 'player_esc') {
						ctx.fillRect(0, 0, Math.round(cvs.width* ((player.esc_t- (3* 14+ 18))/ 36)** 1.8), cvs.height);
						if(player.esc_t>= 3* 14+ 18+ 36) {
							lv= lv=== stage[mode].length- 1? 0 : lv+ 1;
							state= 'cutscene_gen_lv';
						}
					}
					ctx.restore();
				}
				break;
			}
			case 'menu_lesson': {
				lv_btn.rdr();
				break;
			}
		}

		if(playing) ++frame;
		fps= 1000/ (Date.now()- old_t);
		frame_delta= Date.now()- old_t- 1000/ 60;
		old_t= Date.now();

		if(!(abs_frame% 15)) fps_every_half_s= fps;
		++abs_frame;

		write(fps_every_half_s.toFixed(3), 4, uh- 8- 4);
		requestAnimationFrame(clock);
	}
	clock();
});
