'use strict';
const auto= void 0;

addEventListener('contextmenu', e=> e.preventDefault());
const
	cvs= document.getElementById('cvs'),
	uw= cvs.width/ 3,
	uh= cvs.height/ 3,
	ctx= cvs.getContext('2d');
ctx.imageSmoothingEnabled= false;

function align(e) {
	cvs.style.marginLeft= (innerWidth- cvs.width)/ 2+ 'px';
	cvs.style.marginTop= (innerHeight- cvs.height)/ 2+ 'px';
}
addEventListener('load', align);
addEventListener('resize', align);

let m= {
	x: Infinity,
	y: Infinity,
	btn: -1,
	start_x: Infinity,
	start_y: Infinity,
	delta_x: 0,
	delta_y: 0,
	swipe_x: [],
	swipe_y: [],
	swipe_dist_x: 0,
	swipe_dist_y: 0,
}
addEventListener('mousemove', e=> {
	m.delta_x= e.offsetX/ 3- m.x;
	m.delta_y= e.offsetY/ 3- m.y;
	m.x= e.offsetX/ 3;
	m.y= e.offsetY/ 3;
	m.swipe_x.unshift(m.x);
	m.swipe_y.unshift(m.y);
	if(m.swipe_x.length> 60) m.swipe_x.pop();
	if(m.swipe_y.length> 60) m.swipe_y.pop();
	m.swipe_dist_x= m.swipe_x[m.swipe_x.length- 1]- m.swipe_x[0];
	m.swipe_dist_y= m.swipe_y[m.swipe_y.length- 1]- m.swipe_y[0];
});
addEventListener('mousedown', e=> {
	if(m.btn< 0) {
		m.start_x= m.x;
		m.start_y= m.y;
	}
	m.btn= e.button;
	m.swipe_x= [];
	m.swipe_y= [];
}, true);
addEventListener('mouseup', e=> {
	m.btn= -1;
	m.swipe_x= [];
	m.swipe_y= [];
});

let
	k= {},
	hold_k= {};
addEventListener('keydown', e=> {
	if(!hold_k[e.key]) k[e.key]= 1;
});
addEventListener('keyup', e=> {
	k[e.key]= 0;
	hold_k[e.key]= 0;
});

let
	sound_queue= [],
	playing= [];
function play(sound) {
	sound_queue.push('resources/sounds/'+ sound+ '.wav');
}
function play_async(sound) {
	if(!playing.includes('resources/sounds/'+ sound+ '.wav')) play(sound);
}
addEventListener('load', ()=> {
	addEventListener('mousedown', e=> {
		if(window.state) state= 'gen_lv';
		// sounds can only be played inside a fn called by an event listener
		setInterval(()=> {
			let played= [];
			for(const sound of sound_queue) {
				if(!played.includes(sound)) {
					const
						s= new AudioContext(),
						osc= s.createOscillator(),
						gain= s.createGain();
					osc.connect(s.destination);
					gain.connect(s.destination);
					osc.type= 'triangle';
					osc.frequency.setValueAtTime(330+ player.cont_dots* 15, s.currentTime);
					gain.gain.setValueAtTime(0.5, s.currentTime);

					osc.start();
					osc.stop(s.currentTime+ 0.1);
					osc.addEventListener('ended', e=> {
						playing.splice(playing.indexOf(sound));
						s.close();
					});
					playing.push(sound);
					played.push(sound);
				}
			}
			sound_queue= [];
		}, 1000/ 50);
	}, { once: true });
});

let
	t_buffer= {},
	cam_x= 0,
	cam_y= 0;
async function rdr(img, cx, x, y, rel, w, h, opc= 1, d= 0, fx= 1, fy= 1, s= 1) {
	img= 'resources/textures/'+ img+ '.png';
	if(!(img in t_buffer)) {
		const t= t_buffer[img]= new Image();
		t.src= img;
		await new Promise((done, err)=> {
			t.addEventListener('load', done);
			t.addEventListener('error', err);
		});
	}
	const target= t_buffer[img];
	w ??= target.width;
	h ??= target.height;
	if(!window.dummy_cvs) {
		if(rel) {
			x-= cam_x;
			y-= cam_y;
		}
		if((x<= -w || x>= cvs.width+ w) || (y<= -h || y>= cvs.height+ h)) return;
	}

	const $ctx= window.dummy_ctx ?? ctx;
	$ctx.save();
	if(window.dummy_ctx) {
		$ctx.globalAlpha= opc;
		$ctx.scale(fx, fy);
		$ctx.translate(Math.round(x+ w/ 2)* fx, Math.round(y+ h/ 2)* fy);
		$ctx.rotate(d* 90* Math.PI/ 180);
		$ctx.drawImage(target, cx, 0, w, h, Math.round(-w/ 2), Math.round(-h/ 2), w* s, h* s);
	}
	else {
		$ctx.globalAlpha= opc;
		$ctx.scale(fx, fy);
		$ctx.translate(Math.round(x+ w/ 2)* 3* fx, Math.round(y+ h/ 2)* 3* fy);
		$ctx.rotate(d* 90* Math.PI/ 180);
		$ctx.drawImage(target, cx, 0, w, h, Math.round(-w/ 2)* 3, Math.round(-h/ 2)* 3, w* 3* s, h* 3* s);
	}
	$ctx.restore();
}

const fonts= {
	yellow_font: {
		w: 7,
		h: 8,
		x_margin: 6,
		y_margin: 8,
	},
	black_font: {
		w: 5,
		h: 6,
		x_margin: 6,
		y_margin: 8,
	},
	fancy_font: {
		w: 13,
		h: 14,
		x_margin: 13,
		y_margin: 16,
	},
}
function write(t, x, y, opc= 1, font= 'yellow_font', s= 1) {
	t+= [];
	t= t.toLowerCase();
	const list= 'abcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?';
	const origin_x= x;
	for(const letter of Array.from(t)) {
		if(letter=== '\n') {
			y+= fonts[font].y_margin* s;
			x= origin_x;
		}
		else {
			rdr(font, list.indexOf(letter)* fonts[font].w, x, y, 0, fonts[font].w, fonts[font].h, opc, 0, 1, 1, s);
			x+= fonts[font].x_margin* s;
		}
	}
}

let cvs_cache= {};
function cache_lazy(block) {
	const blk= window[block];
	window.dummy_cvs= document.createElement('canvas');
	dummy_cvs.width= Math.max(...blk.x)+ 12;
	dummy_cvs.height= Math.max(...blk.y)+ 12;
	window.dummy_ctx= dummy_cvs.getContext('2d');
	dummy_ctx.imageSmoothingEnabled= false;

	blk.rdr();
	cvs_cache[block]= dummy_cvs;
	delete window.dummy_cvs;
	delete window.dummy_ctx;
}
function lazy_rdr(block) {
	const c= cvs_cache[block];
	if(c.width && c.height)
		ctx.drawImage(c, Math.round(-cam_x)* 3, Math.round(-cam_y)* 3, c.width* 3, c.height* 3);
}

let lv= parseInt(localStorage['rl.game.last_lv']) || 0;
addEventListener('beforeunload', e=> localStorage['rl.game.last_lv']= lv);

function d(dir) {
	if(dir>= 0) return dir% 4;
	while(dir< 0) dir+= 4;
	return dir;
}
let
	mode= 'lesson',
	lv_stats;

function gen_lv() {
	if(mode=== 'lesson') document.title= `${stage.lesson_name[lv]} - Raider Legend`;
	if(mode=== 'adventure') document.title= `Level ${lv+ 1} - Raider Legend`;
	sp.reset_all();
	lv_stats= {
		total: 0,
		star: 0,
	};
	const this_lv= JSON.parse(stage[mode][lv]).main;
	let attr;

	for(let i= 0; i< this_lv.length; ++i) {
		for(let j= 0; j< this_lv[i].length; ++j) {
			const
				id= this_lv[i][j],
				s= window[sp.block[id]];
			attr= JSON.parse(stage[mode][lv])[sp.block[id]];

			function add_bkg() {
				let
					ornament= -1,
					chance= 6;

				if(sp.solid.includes(this_lv[i- 1]?.[j])) chance-= 3;
				if(sp.solid.includes(this_lv[i][j- 1]) && sp.solid.includes(this_lv[i][j- 1])) chance-= 4.5;
				else {
					if(sp.solid.includes(this_lv[i][j- 1])) chance-= 1.5;
					if(sp.solid.includes(this_lv[i][j+ 1])) chance-= 1.5;
				}

				if(
					sp.solid.includes(this_lv[i+ 1]?.[j]) &&
					!sp.solid.includes(id) &&
					Math.random()* Math.max(1, chance)< 1
				) {
					// valuables
					if(sp.solid.includes(this_lv[i- 1]?.[j]) && Math.random()* 4< 3) {
						const valuables= [4, 5, 6, 7];
						ornament= valuables[Math.floor(Math.random()* valuables.length)];
					}
					// chest
					else if(!sp.solid.includes(this_lv[i- 1]?.[j]) && Math.random()* 7< 1) ornament= 2;
					else {
						do ornament= Math.floor(Math.random()* 11);
						while(
							ornament=== 2 || ornament=== 10 ||
							ornament>= 4 && ornament<= 7 && Math.random()* 3< 2
						);
					}
				}

				background.add({
					x: j* 12,
					y: i* 12,
					f: Math.random()* 3< 2? 0 : Math.floor(Math.random()* 3)+ 1,
					ornament,
				});
			}
			function add_plate(list_of_connection, blank_f= -1, corner_f= -1, cond= ()=> 1) {
				for(const type in list_of_connection)
					if(list_of_connection[type] instanceof sp)
						list_of_connection[type]= list_of_connection[type].internal_id;

				// dir= list of neighbours which connects
				let dir= new Array(4).fill(0);
				window.neighbour_attr= auto;

				neighbour_attr= attr?.[i- 1]?.[j];
				if(
					(cond() || this_lv[i- 1]?.[j]!== id) &&
					(this_lv[i- 1]?.[j]=== auto || list_of_connection.includes(this_lv[i- 1][j]))
				) dir[0]= 1;

				neighbour_attr= attr?.[i][j+ 1];
				if(
					(cond() || this_lv[i][j+ 1]!== id) &&
					(this_lv[i][j+ 1]=== auto || list_of_connection.includes(this_lv[i][j+ 1]))
				) dir[1]= 1;

				neighbour_attr= attr?.[i+ 1]?.[j];
				if(
					(cond() || this_lv[i+ 1]?.[j]!== id) &&
					(this_lv[i+ 1]?.[j]=== auto || list_of_connection.includes(this_lv[i+ 1][j]))
				) dir[2]= 1;

				neighbour_attr= attr?.[i][j- 1];
				if(
					(cond() || this_lv[i][j- 1]!== id) &&
					(this_lv[i][j- 1]=== auto || list_of_connection.includes(this_lv[i][j- 1]))
				) dir[3]= 1;

				function place(d, f) {
					if(window[sp.block[id]].meta.special_attr) s.add({
						x: j* 12, y: i* 12, d, f,
						[window[sp.block[id]].meta.special_attr]: attr?.[i][j],
					});
					else s.add({x: j* 12, y: i* 12, d, f});
				}
				switch(dir.filter(v=> v).length) {
					case 0:
						place(0, 4);
						break;
					case 1:
						place(2+ dir.indexOf(1), 3);
						break;
					case 2:
						if(dir.lastIndexOf(1)- dir.indexOf(1)=== 2) place(1- dir.indexOf(1)% 2, 2);
						else if(!dir[3] && !dir[0]) place(3, 1);
						else place(dir.indexOf(0), 1);
						break;
					case 3:
						place(dir.indexOf(0), 0);
						break;
					case 4:
						if(blank_f>= 0) place(0, blank_f);
						break;
				}

				if(corner_f>= 0) {
					const conv= (val, to= 1)=> val=== auto? to: val;
					let corners= new Array(4).fill(0);

					if(!list_of_connection.includes(conv(this_lv[i- 1]?.[j+ 1])) && dir[0] && dir[1]) corners[0]= 1;
					if(!list_of_connection.includes(conv(this_lv[i+ 1]?.[j+ 1])) && dir[1] && dir[2]) corners[1]= 1;
					if(!list_of_connection.includes(conv(this_lv[i+ 1]?.[j- 1])) && dir[2] && dir[3]) corners[2]= 1;
					if(!list_of_connection.includes(conv(this_lv[i- 1]?.[j- 1])) && dir[3] && dir[0]) corners[3]= 1;

					for(let index= 0; index<= 3; ++index) if(corners[index]) {
						if(window[sp.block[id]].meta.has_fancy_corners) {
							let f= 0+ (!corners[d(index+ 1)] && dir[d(index+ 2)]);
							if(!corners[d(index- 1)] && dir[d(index- 1)]) f+= 2;
							place(index, corner_f+ f);
						}
						else place(index, corner_f);
					}
				}

				delete window.neighbour_attr;
			}

			if(id=== null) add_bkg();
			if(Number.isInteger(id)) {
				if(sp.transparent.includes(id)) add_bkg();

				const match_id= ()=> (attr[i][j]> 0 && attr[i][j]=== neighbour_attr);

				if(sp.wall.includes(id))
					add_plate(sp.wall, -1, 5);

				else if(sp.block[id]=== 'whirl_block')
					add_plate([whirl_block], 5, -1, match_id);

				else if(sp.block[id]=== 'ice_block')
					add_plate([...sp.wall, ice_block], 5, -1, match_id);

				else if(sp.block[id]=== 'chameleon_block')
					add_plate([...sp.wall, chameleon_block], 5);

				else if(sp.block[id]=== 'semi_solid_wall')
					add_plate([...sp.wall, semi_solid_wall], 9, 5);
				
				else if(sp.block[id]=== 'jelly')
					add_plate([jelly], 5, -1, match_id);

				else switch(sp.block[id]) {
					default: {
						if(window[sp.block[id]].meta.special_attr) s.add({
							x: j* 12, y: i* 12,
							[window[sp.block[id]].meta.special_attr]: JSON.parse(stage[mode][lv])[sp.block[id]][i][j],
						});
						else s.add({x: j* 12, y: i* 12});

						if(sp.block[id]=== 'dot' || sp.block[id]=== 'coin') ++lv_stats.total;
						if(sp.block[id]=== 'star') ++lv_stats.star;
						break;
					}

					case 'player': {
						player.x= j* 12;
						player.y= i* 12;
						player.fixed_x= player.x;
						player.fixed_y= player.y;
						let dir= [];
						// dir= list of directions the player can initially set to
						if(sp.player_spawnable.includes(this_lv[i- 1]?.[j])) dir.push(2);
						if(sp.player_spawnable.includes(this_lv[i][j+ 1])) dir.push(3);
						if(sp.player_spawnable.includes(this_lv[i+ 1]?.[j])) dir.push(0);
						if(sp.player_spawnable.includes(this_lv[i][j- 1])) dir.push(1);
						player.d= dir[Math.floor(Math.random()* dir.length)];
						player.add();
						break;
					}
					case 'exit': {
						exit.x= j* 12;
						exit.y= i* 12;
						exit.add();
						break;
					}
					case 'bounce_pad_l':
					case 'bounce_pad_r': {
						bounce_pad.add({
							x: j* 12,
							y: i* 12,
							d: id- sp.block.indexOf('bounce_pad_l'),
						});
						break;
					}
					case 'bat_u':
					case 'bat_r':
					case 'bat_d':
					case 'bat_l': {
						bat.add({
							x: j* 12,
							y: i* 12,
							d: id- sp.block.indexOf('bat_u'),
						});
						break;
					}
					case 'lion_blaster_u':
					case 'lion_blaster_r':
					case 'lion_blaster_d':
					case 'lion_blaster_l': {
						lion_blaster.add({
							x: j* 12,
							y: i* 12,
							d: id- sp.block.indexOf('lion_blaster_u'),
						});
						break;
					}
					case 'opened_lock': {
						lock.add({
							x: j* 12,
							y: i* 12,
							id: JSON.parse(stage[mode][lv]).opened_lock[i][j],
							init_locked: 0,
						});
						break;
					}
					case 'tiger_burner_u':
					case 'tiger_burner_r':
					case 'tiger_burner_d':
					case 'tiger_burner_l': {
						tiger_burner.add({
							x: j* 12,
							y: i* 12,
							d: id- sp.block.indexOf('tiger_burner_u'),
						});
						break;
					}
					case 'spike':
					case 'barrier':
					case 'one_way_wall': {
						let dir= JSON.parse(stage[mode][lv])[sp.block[id]][i][j];
						for(let x= 3; x>= 0; --x) if(dir>= 2** x) {
							window[sp.block[id]].add({
								x: j* 12,
								y: i* 12,
								d: x,
							});
							dir-= 2** x;
						}
						break;
					}
					case 'no_return_warper': {
						warper.add({
							x: j* 12,
							y: i* 12,
							id: JSON.parse(stage[mode][lv]).no_return_warper[i][j],
							no_return: 1,
						});
						break;
					}
					case 'fixed_slide_block_ud':
					case 'fixed_slide_block_lr': {
						slide_block.add({
							x: j* 12,
							y: i* 12,
							d: id- sp.block.indexOf('fixed_slide_block_ud'),
							fixed: 1,
						});
					}
				}
			}
		}
	}
	for(const n of sp.lazy) cache_lazy(n);
}
