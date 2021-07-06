'use strict';

class sp {
	static act_first= [
		'bat', 'dart', 'fire_stream', 'inflated_pufferfish', 'spike',
		'player', 'ice_block',
		'blade', 'key',
		'lion_blaster', 'tiger_burner', 'pufferfish',
	];
	static rdr_first= [
		'player_trail', 'bubble_trail', 'player_land_dust', 'land_particle', 'particle', 'explosion', 'falling_ice',
		'dot', 'coin', 'bubble', 'bounce_pad', 'lock', 'whirl_block', 'chameleon_block', 'warper',
	];

	static layers= [
		// item decoration
		'key', 'falling_ice',

		// enemy & special
		'fire_stream', 'lion_blaster', 'dart', 'bat', 'blade', 'spike', 'jelly', 'pufferfish', 'inflated_pufferfish', 'barrier', 'one_way_wall',

		// environment decoration
		'explosion', 'player_land_dust', 'land_particle', 'particle',

		// player
		'player', 'bubble_trail', 'player_trail',

		// item
		'whirl_block', 'warper', 'exit', 'bubble', 'bounce_pad', 'dot', 'coin', 'star', 'regeneration',

		// wall
		'wall', 'barbwire', 'blade_trap',  'lock', 'tiger_burner', 'ice_block', 'chameleon_block', 'semi_solid_wall', 'slide_block',

		// background
		'background',
	];
	static block_order= [
		'player', 'wall', 'exit', 'dot', 'coin', 'star', 'barbwire', 'blade_trap', 'lock', 'opened_lock', 'key', 'regeneration', 'bat_u', 'bat_r', 'bat_d', 'bat_l', 'spike', 'bounce_pad_l', 'bounce_pad_r', 'warper', 'no_return_warper', 'lion_blaster_u', 'lion_blaster_r', 'lion_blaster_d', 'lion_blaster_l', 'chameleon_block', 'ice_block', 'pufferfish',/* 'hornet_d', 'hornet_l', 'hornet_r', */'bubble', 'jelly', 'barrier', 'one_way_wall',/* 'magma_block', 'poison', */'semi_solid_wall', 'whirl_block',/* 'switch', 'switch_block', 'elevator', 'lift', */'tiger_burner_u', 'tiger_burner_r', 'tiger_burner_d', 'tiger_burner_l', 'slide_block', 'fixed_slide_block_ud', 'fixed_slide_block_lr',
	];

	static all= [];
	static block= [];
	static wall= [];
	static transparent= [];
	static player_spawnable= [];
	static solid= [];
	static lazy= [];
	static mobile= [];
	static shared_attr= {};
	static reset(...sp_names) {
		for(const name of sp_names) {
			const n= window[name];
			if(n.meta.custom) Object.assign(n, n.meta.custom);
			for(const attr in n.meta.attr) n[attr]= [];

			n.count= 0;
			if(n.meta.is_mobile) {
				n.fixed_coords= [];
				n.next_coords= [];
			}
			else n.coords= [];
		}
	}
	static reset_all() {
		for(const name of sp.all) {
			const n= window[name];
			if(n.meta.custom) Object.assign(n, n.meta.custom);
			for(const attr in n.meta.attr) n[attr]= [];

			n.count= 0;
			if(n.meta.is_mobile) {
				n.fixed_coords= [];
				n.next_coords= [];
			}
			else n.coords= [];
		}
	}
	static processing= '';

	constructor(data) {
		data.is_single ??= 0;
		data.is_wall ??= 0;
		data.has_fancy_corners ??= 0;
		data.is_transparent ??= 0;
		data.is_player_spawnable ??= 0;
		data.is_solid ??= 0;
		data.is_lazy ??= 0;
		data.is_mobile ??= 0;
		data.attr ??= {};
		data.custom ??= {};
		data.keep_id ??= 1;
		data.has_hitbox ??= 1;
		data.special_attr ??= '';
		data.share_attr_with ??= [];
		this.meta= {};
		Object.assign(this.meta, data);

		if(data.keep_id) {
			this.internal_id= sp.block.length;
			if(data.is_wall) sp.wall.push(this.internal_id);
			if(data.is_transparent) sp.transparent.push(this.internal_id);
			if(data.is_player_spawnable) sp.player_spawnable.push(this.internal_id);
			if(data.is_solid) sp.solid.push(this.internal_id);
			if(data.is_mobile) sp.mobile.push(this.internal_id);
			sp.block.push(data.name);
		}
		if(data.is_lazy) sp.lazy.push(data.name);
		for(const sp_name of data.share_attr_with) {
			sp.shared_attr[sp_name]= data.special_attr;
		}
		sp.all.push(data.name);
		for(const attr in data.attr) this[attr]= [];

		if(data.is_mobile) [this.fixed_coords, this.next_coords]= [[], []];
		else this.coords= [];
		this.count= 0;
		this.add= (attr= {})=> {
			if(!(attr.x=== auto || attr.y=== auto)) {
				if(data.is_mobile) {
					this.fixed_coords.push(`${attr.x} ${attr.y}`);
					this.next_coords.push(`${attr.x} ${attr.y}`);
				}
				else this.coords.push(`${attr.x} ${attr.y}`);
			}
			for(const a in data.attr) this[a].push(attr[a] ?? data.attr[a]);
			++this.count;
		}
		this.del= (id= window.i)=> {
			for(const a in data.attr) {
				this[a].splice(id, 1);
			}
			if(data.is_mobile) {
				this.fixed_coords.splice(id, 1);
				this.next_coords.splice(id, 1);
			}
			else this.coords.splice(id, 1);

			if(window.i!== auto && id<= i && data.name=== sp.processing) --i;
			--this.count;
		}
		this.rdr= ()=> {
			if(data.rdr) {
				sp.processing= data.name;
				for(window.i= 0; i< this.count; ++i) {
					for(const n in data.attr) window['this_'+ n]= this[n][i];
					data.rdr();
					if(window.show_hitbox && data.has_hitbox) {
						ctx.save();
						ctx.lineWidth= 3;
						if(data.is_single) {
							ctx.strokeStyle= '#0f0';
							ctx.strokeRect((this.x+ 0.5- cam_x)* 3, (this.y+ 0.5- cam_y)* 3, 11* 3, 11* 3);
						}
						else {
							if(data.is_solid) ctx.strokeStyle= '#fff';
							else ctx.strokeStyle= '#f00';
							ctx.strokeRect((this.x[i]+ 0.5- cam_x)* 3, (this.y[i]+ 0.5- cam_y)* 3, 11* 3, 11* 3);
						}
						ctx.restore();
					}
				}
				delete window.i;
				for(const n in data.attr) delete window['this_'+ n];
				sp.processing= '';
			}
		}
		this.act= ()=> {
			if(data.act) {
				sp.processing= data.name;
				for(window.i= 0; i< this.count; ++i) {
					for(const n in data.attr) {
						window['this_'+ n]= this[n][i];
					}
					data.act();
				}
				delete window.i;
				for(const n in data.attr) {
					delete window['this_'+ n];
				}
				sp.processing= '';
			}
		}

		this.col= (target, x_name_or_v= 'x', y_name_or_v= 'y', cond= ()=> 1, id= window.i)=> {
			// target shouldn't be single
			const
				x= !isNaN(x_name_or_v)? x_name_or_v : (data.is_single? this[x_name_or_v] : this[x_name_or_v][id]),
				y= !isNaN(y_name_or_v)? y_name_or_v : (data.is_single? this[y_name_or_v] : this[y_name_or_v][id]);
			for(let index= 0; ;) {
				const find= ()=> {
					window.match_id= target.meta.is_mobile? (
						target.fixed_coords.indexOf(`${x} ${y}`, index)>= 0?
							target.fixed_coords.indexOf(`${x} ${y}`, index) :
							target.next_coords.indexOf(`${x} ${y}`, index)
					) : target.coords.indexOf(`${x} ${y}`, index);
				}
				find();
				if((match_id< 0 || cond()) && !(target=== this && match_id=== id)) break;
				index= match_id+ 1;
			}
			let rtn= match_id;
			delete window.match_id;
			return rtn;
		}
		this.move_x_by= (x, id= window.i)=> {
			if(!(this.x[id]% 12) && x)
				this.next_coords[id]= `${x< 0? this.x[id]- 12 : this.x[id]+ 12} ${this.y[id]}`;

			this.x[id]+= x;
			this.x[id]= parseFloat(this.x[id].toFixed(1));
			if(!(this.x[id]% 12))
				this.fixed_coords[id]= `${this.x[id]} ${this.y[id]}`;

			if(id=== window.i && sp.processing=== data.name) this_x= this.x[id];
		}
		this.move_y_by= (y, id= window.i)=> {
			if(!(this.y[id]% 12) && y)
				this.next_coords[id]= `${this.x[id]} ${y< 0? this.y[id]- 12 : this.y[id]+ 12}`;

			this.y[id]+= y;
			this.y[id]= parseFloat(this.y[id].toFixed(1));
			if(!(this.y[id]% 12))
				this.fixed_coords[id]= `${this.x[id]} ${this.y[id]}`;

			if(id=== window.i && sp.processing=== data.name) this_y= this.y[id];
		}
		this.move_to= (x, y, id= window.i)=> {
			this.x[id]= parseFloat(x);
			this.y[id]= parseFloat(y);
			this.fixed_coords[id]= `${x} ${y}`;
			this.next_coords[id]= `${x} ${y}`;
			if(id=== window.i) {
				this_x= this.x[id];
				this_y= this.y[id];
			}
		}

		Object.assign(this, data.custom);
	}
}
sp.layers.reverse();

function gen_particle(amount, ref_x, ref_y) {
	for(let i= 0; i< amount; ++i) particle.add({
		x: ref_x+ i/ (amount- 1)* 12+ (Math.random()- 0.5),
		y: ref_y+ Math.random()* 12,
		vx: 3* (i/ (amount- 1)- 0.5)+ (Math.random()* 0.4- 0.2),
		vy: -(Math.random()* 0.3+ 2.4),
		s: Math.random()< 1/ 3? 1 : 2,
	});
}

function update(target, col_id, fn) {
	if(!target.group[col_id]) {
		window.id= col_id;
		window.dist= 0;
		fn();
	}
	else {
		let index, i_stack= [col_id], stack= [col_id];
		let dist_count= 1, d= [0];
		while(i_stack.length> 0) {
			const s= [...i_stack];
			i_stack= [];
			for(const id of s) req_move(id);
			for(const id of i_stack) d.push(dist_count);
			++dist_count;
		}
		for(let i= 0; i< stack.length; ++i) {
			window.id= stack[i];
			window.dist= d[i];
			fn();
		}

		function req_move(id) {
			if(target.group[col_id]=== target.group[index= target.coords.indexOf(`${target.x[id]} ${target.y[id]- 12}`)] && !stack.includes(index)) {
				i_stack.push(index);
				stack.push(index);
			}
			if(target.group[col_id]=== target.group[index= target.coords.indexOf(`${target.x[id]+ 12} ${target.y[id]}`)] && !stack.includes(index)) {
				i_stack.push(index);
				stack.push(index);
			}
			if(target.group[col_id]=== target.group[index= target.coords.indexOf(`${target.x[id]} ${target.y[id]+ 12}`)] && !stack.includes(index)) {
				i_stack.push(index);
				stack.push(index);
			}
			if(target.group[col_id]=== target.group[index= target.coords.indexOf(`${target.x[id]- 12} ${target.y[id]}`)] && !stack.includes(index)) {
				i_stack.push(index);
				stack.push(index);
			}
		}
	}

	delete window.id;
	delete window.dist;
}

var player= new sp({
	name: 'player',
	is_single: 1,
	is_transparent: 1,
	rdr() {
		if(state=== 'player_died') {
			rdr(
				'player_death', 110* Math.floor(player.death_t/ 3),
				(uw- 110)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x,
				(uh- 14)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y,
				0, 110,
			);
			++player.death_t;
		}
		else if(state=== 'player_esc') {
			rdr(
				'player_escape', 60* Math.floor(player.esc_t/ 3),
				(uw- 60)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x,
				(uh- 60)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y,
				0, 60,
			);
			++player.esc_t;
		}
		else if(player.in_bubble) rdr(
			'bubble', f(8)% 2* 18,
			(uw- 18)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x,
			(uh- 18)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y,
			0, 18,
		);
		else if(player.moving) {
			if(!player.stamina) rdr(
				'moving_player',
				14* (f(3)% 6+ 6),
				(uw- 14)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x,
				(uh- 14)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y,
				0, 14, 14, 1, player.d,
			);
			else if(player.stamina<= 3) rdr(
				'moving_player',
				14* (f(3)% 6+ f(6)% 2* 6),
				(uw- 14)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x,
				(uh- 14)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y,
				0, 14, 14, 1, player.d,
			);
			else rdr(
				'moving_player',
				f(3)% 6* 14,
				(uw- 14)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x,
				(uh- 14)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y,
				0, 14, 14, 1, player.d,
			);
		}
		else {
			if(!player.stamina) rdr(
				'player',
				(f()% 8+ 8)* 14,
				(uw- 14)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x,
				(uh- 14)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y,
				0, 14, 14, 1, player.d,
			);
			else if(player.stamina<= 3) rdr(
				'player',
				(f()% 8+ (8* (f(6)% 2)))* 14,
				(uw- 14)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x,
				(uh- 14)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y,
				0, 14, 14, 1, player.d,
			);
			else rdr(
				'player',
				f()% 8* 14,
				(uw- 14)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x,
				(uh- 14)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y,
				0, 14, 14, 1, player.d,
			);
		}
		if(state=== 'playing') {
			if(player.stamina<= 6 && player.sweat_f>= 2* 10) player.sweat_f= 0;
			if(player.sweat_f< 2* 10) rdr(
				'player',
				(Math.floor(player.sweat_f/ 2)+ 16)* 14,
				(uw- 14)/ 2+ player.cam_tilt_x+ ice_block.cam_tilt_x+ (player.d=== 3? -12 : (player.d=== 1? 12 : 0)),
				(uh- 14)/ 2+ player.cam_tilt_y+ ice_block.cam_tilt_y+ (!player.d? -12 : (player.d=== 2? 12 : 0)),
				0, 14, 14, 1, player.d,
			);
		}
	},
	act() {
		++player.sweat_f;

		function gen_land_particle() {
			switch(player.d) {
				case 0:
					for(let i= 0; i< 12; ++i) {
						land_particle.add({
							x: i+ player.x,
							y: player.y+ 1- Math.random()* 5,
							vx: 0.02* (i- 5.5+ (Math.random()- 0.5)),
							vy: -0.15+ 0.1* (Math.random()* 2- 1.5),
						});
					}
					break;
				case 1:
					for(let i= 0; i< 12; ++i) {
						land_particle.add({
							x: player.x+ 10+ Math.random()* 5,
							y: i+ player.y,
							vx: 0.15+ 0.1* (Math.random()* 2- 1.5),
							vy: 0.02* (i- 5.5+ (Math.random()- 0.5)),
						});
					}
					break;
				case 2:
					for(let i= 0; i< 12; ++i) {
						land_particle.add({
							x: i+ player.x,
							y: player.y+ 14- Math.random()* 5,
							vx: 0.02* (i- 5.5+ (Math.random()- 0.5)),
							vy: 0.15+ 0.1* (Math.random()* 2- 1.5),
						});
					}
					break;
				case 3:
					for(let i= 0; i< 12; ++i) {
						land_particle.add({
							x: player.x- 3+ Math.random()* 5,
							y: i+ player.y,
							vx: -0.15+ 0.1* (Math.random()* 2- 1.5),
							vy: 0.02* (i- 5.5+ (Math.random()- 0.5)),
						});
					}
					break;
			}
		}
		function stop_moving() {
			player.x= player.fixed_x;
			player.y= player.fixed_y;
			if((player.d_change || player.in_bubble) && !player.step) switch(player.d) {
				case 0:
					player.cam_tilt_y+= 4;
					break;
				case 1:
					player.cam_tilt_x-= 4;
					break;
				case 2:
					player.cam_tilt_y-= 4;
					break;
				case 3:
					player.cam_tilt_x+= 4;
					break;
			}
			if(player.d_change || player.step || player.in_bubble) gen_land_particle();

			if(player.in_bubble) {
				player.in_bubble= 0;
				bubble.used[player.used_bubble]= 0;
				bubble.t[player.used_bubble]= 0;
				player.used_bubble= -1;
			}

			if(player.step || player.d_change) player_land_dust.add({
				x: player.x,
				y: player.y,
				d: player.d,
				f_spd: (player.step> 0)+ 1,
			});
			if(!player.step && player.moving) ++player.stamina;

			if(player.moving) player.cont_t= 0;
			else ++player.cont_t;

			if(player.cont_t>= 15) player.cont_dots= 0;
			if(
				player.stamina && player.cont_t>= 24 ||
				!player.stamina && player.cont_t>= 48
			) player.stamina= 7;

			player.step= 0;
			player.dash_in_bubble= 0;
		}
		function warp(col_id) {
			let
				id_list= [],
				index= warper.id.indexOf(warper.id[col_id]);

			for(; index>= 0; index= warper.id.indexOf(warper.id[col_id], index+ 1))
				if(index!== col_id) id_list.push(index);
			const id= id_list[Math.floor(Math.random()* id_list.length)];

			warper.glare_t[col_id]= 0;
			warper.glare_t[id]= 0;
			player.x= player.fixed_x= warper.x[id];
			player.y= player.fixed_y= warper.y[id];
			player.cam_tilt_x+= warper.x[id]- warper.x[col_id];
			player.cam_tilt_y+= warper.y[id]- warper.y[col_id];
		}
		let col_id;

		if((col_id= player.col(warper, 'next_x', 'next_y', ()=> (!warper.no_return[match_id])))>= 0 && state=== 'playing')
			warp(col_id);

		player.next_x= player.x;
		player.next_y= player.y;

		if(player.d_change && !player.dash_in_bubble) --player.stamina;
		if((!player.in_bubble || player.dash_in_bubble) && state=== 'playing') switch(player.d) {
			case 0:
				if(player.y% 12=== 0) player.next_y= player.y+ 12;
				player.y+= player.in_bubble? 4 : 6;
				break;
			case 1:
				if(player.x% 12=== 0) player.next_x= player.x- 12;
				player.x-= player.in_bubble? 4 : 6;
				break;
			case 2:
				if(player.y% 12=== 0) player.next_y= player.y- 12;
				player.y-= player.in_bubble? 4 : 6;
				break;
			case 3:
				if(player.x% 12=== 0) player.next_x= player.x+ 12;
				player.x+= player.in_bubble? 4 : 6;
				break;
		}

		if(player.in_bubble) ++player.bubble_t;
		else player.bubble_t= 0;

		if((col_id= player.col(bubble))>= 0 && col_id!== player.used_bubble && !bubble.used[col_id]) {
			gen_land_particle();

			if(player.used_bubble>= 0) {
				bubble.used[player.used_bubble]= 0;
				bubble.t[player.used_bubble]= 0;
			}
			else player.cont_t= 0;

			bubble.used[col_id]= 1;
			player.in_bubble= 1;
			player.moving= 0;
			player.step= 0;
			player.used_bubble= col_id;
			player.dash_in_bubble= 0;
			player.bubble_t= 0;
		}
		if(player.in_bubble) {
			if(player.moving) player.cont_t= 0;
			else ++player.cont_t;

			if(player.cont_t>= 15) player.cont_dots= 0;
			if(player.cont_t>= 33) player.stamina= 7;
		}

		if((col_id= player.col(ice_block, 'next_x', 'next_y'))>= 0)
			update(ice_block, col_id, ()=> ice_block.obstructed[id]= 1);

		if(!(player.x% 12 || player.y% 12)) {
			player.fixed_x= player.x;
			player.fixed_y= player.y;
			if(!player.in_bubble || player.dash_in_bubble) ++player.step;
		}

		if((col_id= player.col(ice_block, 'fixed_x', 'fixed_y'))>= 0)
			update(ice_block, col_id, ()=> ice_block.obstructed[id]= 1);

		if(
			(col_id= player.col(jelly, 'next_x', 'next_y'))< 0 &&
			(col_id= player.col(jelly, 'fixed_x', 'fixed_y'))< 0
		) player.dash_on_jelly= -1;

		if(player.x% 12 || player.y% 12) {
			if((col_id= player.col(spike, 'fixed_x', 'fixed_y', ()=> (
				spike.f[match_id]< 0 &&
				spike.d[match_id]=== player.d
			)))>= 0) spike.f[col_id]= 0;

			if((col_id= player.col(whirl_block, 'next_x', 'next_y'))>= 0) {
				explosion.add({
					x: whirl_block.x[col_id],
					y: whirl_block.y[col_id],
					f: Math.floor(Math.random()* 4),
				});
				update(whirl_block, col_id, ()=> {
					if(whirl_block.del_t[id]< 0) whirl_block.del_t[id]= 6* dist+ 6;
				});
			}

			if((
				player.col(barbwire, 'next_x', 'next_y')>= 0 ||
				player.col(spike, 'next_x', 'next_y', ()=> (spike.f[match_id]>= 0))>= 0
			) && state=== 'playing')
				state= 'player_died';

			let moving= 1;
			for(const n of sp.solid) if((col_id= player.col(window[sp.block[n]], 'next_x', 'next_y'))>= 0) {
				if(sp.block[n]=== 'lock' && (
					lock.init_locked[col_id] && (key.collected_t[key.id.indexOf(lock.id[col_id])]>= 0) ||
					!lock.init_locked[col_id] && lock.keyed_t[col_id]< 0 && key.collected_t[key.id.indexOf(lock.id[col_id])]< 0
				)) continue;

				if(sp.block[n]=== 'ice_block' && ice_block.drop_t[col_id]>= 27) continue;

				if(sp.block[n]=== 'chameleon_block' && (
					chameleon_block.glob_t>= 90 ||
					player.col(chameleon_block, 'fixed_x', 'fixed_y')>= 0
				)) continue;

				if(sp.block[n]=== 'semi_solid_wall') continue;

				if(sp.block[n]=== 'whirl_block' && whirl_block.del_t[col_id]>= 0) continue;

				if(sp.block[n]=== 'jelly' && jelly.group[col_id]=== player.dash_on_jelly) continue;

				if(sp.block[n]=== 'slide_block' && slide_block.req_move(col_id)) continue;

				stop_moving();
				moving= 0;
			}
			if(
				player.col(barrier, 'next_x', 'next_y', ()=> (barrier.d[match_id]=== player.d))>= 0 ||
				player.col(barrier, 'fixed_x', 'fixed_y', ()=> (barrier.d[match_id]=== d(player.d+ 2)))>= 0 ||
				player.col(one_way_wall, 'next_x', 'next_y', ()=> (one_way_wall.d[match_id]=== player.d))>= 0
			) {
				stop_moving();
				moving= 0;
			}

			if(moving) player.moving= 1;
			else {
				if((col_id= player.col(warper, 'fixed_x', 'fixed_y', ()=> (!warper.no_return[match_id])))>= 0 && player.d_change)
					warp(col_id);

				player.moving= 0;
			}
		}
		else if((col_id= player.col(slide_block, 'fixed_x', 'fixed_y'))>= 0)
			slide_block.req_move(col_id);

		if(!blade.coords.includes(`${player.x} ${player.y}`) && state=== 'playing') {
			if(player.col(blade_trap, 'x', player.y- 12)>= 0)
				blade.add({x: player.x, y: player.y, d: 2});

			if(player.col(blade_trap, player.x+ 12)>= 0)
				blade.add({x: player.x, y: player.y, d: 3});

			if(player.col(blade_trap, 'x', player.y+ 12)>= 0)
				blade.add({x: player.x, y: player.y, d: 0});

			if(player.col(blade_trap, player.x- 12)>= 0)
				blade.add({x: player.x, y: player.y, d: 1});
		}

		if(player.moving && state=== 'playing') {
			if(player.in_bubble) player.tilt= 2;
			else player.tilt= 3;

			if(player.d=== 0) player.cam_tilt_y+= Math.max(0, (1- player.cam_tilt_y/ 60)* player.tilt);
			if(player.d=== 1) player.cam_tilt_x-= Math.max(0, (1- player.cam_tilt_x/ -90)* player.tilt);
			if(player.d=== 2) player.cam_tilt_y-= Math.max(0, (1- player.cam_tilt_y/ -60)* player.tilt);
			if(player.d=== 3) player.cam_tilt_x+= Math.max(0, (1- player.cam_tilt_x/ 90)* player.tilt);
		}
		if(
			state!== 'playing' ||
			!(player.moving || player.in_bubble) ||
			player.in_bubble && !player.dash_in_bubble && player.bubble_t>= 2
		) {
			player.cam_tilt_x/= 1.075;
			player.cam_tilt_y/= 1.075;
		}
		else if(player.d% 2) player.cam_tilt_y/= 1.075;
		else player.cam_tilt_x/= 1.075;

		if(player.moving && player.step> 0 && state=== 'playing') {
			if(!player.in_bubble) player_trail.add({
				x: player.x+ (player.d=== 1 && 8 || player.d=== 3 && -8),
				y: player.y+ (player.d=== 0 && -8 || player.d=== 2 && 8),
				d: player.d,
			});
			else bubble_trail.add({
				x: player.x+ (player.d=== 1 && 4 || player.d=== 3 && -4),
				y: player.y+ (player.d=== 0 && -4 || player.d=== 2 && 4),
			});
		}

		if(player.x=== exit.x && player.y=== exit.y && state=== 'playing')
			state= 'player_esc';

		if((col_id= player.col(dot, 'fixed_x', 'fixed_y'))>= 0 && dot.d[col_id]< 0) {
			++player.stats_dot;
			++player.cont_dots;
			dot.d[col_id]= player.d;
		}

		if((col_id= player.col(coin, 'fixed_x', 'fixed_y'))>= 0 && coin.d[col_id]< 0) {
			++player.stats_coin;
			coin.d[col_id]= player.d;
		}

		if((col_id= player.col(star, 'fixed_x', 'fixed_y'))>= 0) {
			++player.stats_star;
			explosion.add({
				x: star.x[col_id],
				y: star.y[col_id],
				f: Math.floor(Math.random()* 4),
			});
			gen_particle(12, star.x[col_id], star.y[col_id]);
			star.del(col_id);
		}

		if((col_id= player.col(regeneration, 'fixed_x', 'fixed_y'))>= 0) {
			if(!regeneration.used[col_id]) {
				if(player.stamina< 7) ++player.stamina;
				explosion.add({
					x: regeneration.x[col_id],
					y: regeneration.y[col_id],
					f: Math.floor(Math.random()* 4),
				});
				gen_particle(8, regeneration.x[col_id], regeneration.y[col_id]);
				regeneration.used[col_id]= 1;
				player.used_regen= col_id;
			}
		}
		else regeneration.used[player.used_regen]= 0;

		if((col_id= player.col(bounce_pad, 'fixed_x', 'fixed_y'))>= 0) {
			if(player.step) {
				player.d= (player.d+ (player.d% 2? -1 : 1)* (bounce_pad.d[col_id]? 1 : -1));
				while(player.d< 0) player.d+= 4;
				while(player.d> 3) player.d-= 4;
				player.step= 0;

				bounce_pad.used[col_id]= 1;
				player.used_bounce_pad= col_id;
			}
			else if(!player.moving && col_id=== player.used_bounce_pad) {
				gen_land_particle();
				player_land_dust.add({
					x: player.x,
					y: player.y,
					d: player.d,
					f_spd: 2,
				});
				player.used_bounce_pad= -1;
			}
		}
		else player.used_bounce_pad= -1;

		if((col_id= player.col(key, 'fixed_x', 'fixed_y'))>= 0 && key.collected_t[col_id]< 0)
			key.collected_t[col_id]= 0;

		if((
			player.col(blade, 'fixed_x', 'fixed_y', ()=> (blade.f[match_id]>= 33 && blade.f[match_id]< 33+ 48))>= 0 ||
			player.col(blade, 'next_x', 'next_y', ()=> (blade.f[match_id]>= 33 && blade.f[match_id]< 33+ 48))>= 0 ||
			player.col(dart, 'fixed_x', 'fixed_y', ()=> (dart.crash_t[match_id]< 0))>= 0 ||
			player.col(dart, 'next_x', 'next_y', ()=> (dart.crash_t[match_id]< 0))>= 0 ||
			player.col(bat, 'fixed_x', 'fixed_y')>= 0 ||
			player.col(bat, 'next_x', 'next_y')>= 0 ||
			player.col(fire_stream, 'fixed_x', 'fixed_y', ()=> (fire_stream.f[match_id]< 2* 6))>= 0 ||
			player.col(fire_stream, 'next_x', 'next_y', ()=> (fire_stream.f[match_id]< 2* 6))>= 0 ||
			player.col(inflated_pufferfish, 'fixed_x', 'fixed_y')>= 0 ||
			player.col(inflated_pufferfish, 'next_x', 'next_y')>= 0
		) && state=== 'playing')
			state= 'player_died';

		player.d_change= 0;
		++player.pre_move_t;
		if(player.cutscene_t>= 0) ++player.cutscene_t;
	},
	custom: {
		x: Infinity,
		y: Infinity,
		d: 0,
		fixed_x: 0,
		fixed_y: 0,
		next_x: 0,
		next_y: 0,

		moving: 0,
		step: 0,
		stamina: 7,
		sweat_f: 20,

		in_bubble: 0,
		used_bubble: -1,
		dash_in_bubble: 0,
		bubble_t: 0,

		used_regen: -1,
		used_bounce_pad: -1,
		dash_on_jelly: -1,

		cont_dots: 0,
		cont_t: 0,
		cam_tilt_x: 0,
		cam_tilt_y: 0,
		tilt: 0,

		death_t: 0,
		esc_t: 0,
		cutscene_t: -1,

		pre_move: -1,
		pre_move_t: 0,

		stats_dot: 0,
		stats_coin: 0,
		stats_star: 0,
	},
});

var player_trail= new sp({
	name: 'player_trail',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 2,
	},
	rdr() {
		rdr('player_trail', 10* Math.floor(Math.max(0, this_f)/ 4), this_x+ 1, this_y, 1, 10, 12, 1, this_d);
	},
	act() {
		++player_trail.f[i];
		if(!player.moving) ++player_trail.f[i];
		if(player_trail.f[i]>= 4* 3) player_trail.del();
	},
});

var player_land_dust= new sp({
	name: 'player_land_dust',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
		f_spd: 2,
	},
	rdr() {
		rdr('player_land_dust', Math.floor(this_f/ this_f_spd)* 20, this_x- 4, this_y, 1, 20, 12, 1, this_d);
	},
	act() {
		++player_land_dust.f[i];
		if(player_land_dust.f[i]>= this_f_spd* 13) player_land_dust.del();
	},
});

var land_particle= new sp({
	name: 'land_particle',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		t: 0,
	},
	rdr() {
		ctx.save();
		ctx.fillStyle= '#8000ff';
		ctx.globalAlpha= Math.min(0.5, 0.5- (this_t- 24)/ (60- 24)* 0.5);
		ctx.fillRect(Math.round(this_x- cam_x)* 3, Math.round(this_y- cam_y)* 3, 3, 3);
		ctx.restore();
	},
	act() {
		land_particle.x[i]+= this_vx;
		land_particle.y[i]+= this_vy;
		land_particle.vx[i]*= 0.9905;
		land_particle.vy[i]*= 0.9905;
		++land_particle.t[i];
		if(land_particle.t[i]>= 60) land_particle.del();
	},
});

var particle= new sp({
	name: 'particle',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		s: 2,
		colour: '#ff0',
	},
	rdr() {
		ctx.save();
		ctx.fillStyle= this_colour;
		ctx.globalAlpha= 1;
		ctx.fillRect(
			Math.round(this_x- cam_x- this_s/ 2)* 3, Math.round(this_y- cam_y- this_s/ 2)* 3,
			this_s* 3, this_s* 3,
		);
		ctx.restore();
	},
	act() {
		particle.x[i]+= this_vx;
		particle.y[i]+= this_vy;
		particle.vx[i]*= 0.975;
		particle.vy[i]+= 0.22+ this_s* 0.044;
		if(particle.vy[i]>= 3.6+ this_s* 0.72) particle.vy[i]= 3.6+ this_s* 0.72;
		if(particle.y[i]- cam_y>= uh+ this_s/ 2) particle.del();
	},
});

var explosion= new sp({
	name: 'explosion',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		x: 0,
		y: 0,
		f: 0,
		colour: 0,
	},
	rdr() {
		if(this_f>= 4) rdr('explosion', Math.floor((this_f- 4)/ 2)* 22, this_x- 5, this_y- 5, 1, 22);
	},
	act() {
		++explosion.f[i];
		if(explosion.f[i]>= 2* 3+ 4) explosion.del();
	},
});

var background= new sp({
	name: 'background',
	keep_id: 0,
	is_lazy: 1,
	has_hitbox: 0,
	attr: {
		x: 0,
		y: 0,
		f: 0,
		ornament: -1,
	},
	rdr() {
		rdr('background', 12* this_f, this_x, this_y, 1, 12);

		if(i=== background.count- 1) {
			dummy_ctx.save();
			dummy_ctx.fillStyle= '#000';
			dummy_ctx.globalAlpha= 0.85;

			for(let i= 0; i< background.count; ++i) {
				if(background.ornament[i]>= 0)
					rdr('ornament_1_1', 14* background.ornament[i], background.x[i]- 1, background.y[i], 1, 14);
				dummy_ctx.fillRect(background.x[i], background.y[i], 12, 12);
			}

			dummy_ctx.restore();
		}
	},
});

var wall= new sp({
	name: 'wall',
	is_lazy: 1,
	is_wall: 1,
	has_fancy_corners: 1,
	is_player_spawnable: 1,
	is_solid: 1,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
	},
	rdr() {
		rdr('wall', 12* this_f, this_x, this_y, 1, 12, 12, 1, this_d);
	},
});

var exit= new sp({
	name: 'exit',
	is_single: 1,
	is_transparent: 1,
	rdr() {
		rdr('exit', f()% 8* 12, exit.x, exit.y, 1, 12);
	},
	custom: {
		x: Infinity,
		y: Infinity,
	},
});

var dot= new sp({
	name: 'dot',
	is_transparent: 1,
	attr: {
		x: 0,
		y: 0,
		d: -1,
		f: 0,
	},
	rdr() {
		if(this_d>= 0 && this_f>= 2)
			rdr('vanish', 16* Math.floor((this_f- 2)/ 2), this_x- 2, this_y+ 3, 1, 16, 6, 1, this_d);
		else {
			ctx.save();
			ctx.fillStyle= f(20)% 2? '#8000ff' : '#ff0';
			ctx.fillRect(Math.round(this_x+ 5- cam_x)* 3, Math.round(this_y+ 5- cam_y)* 3, 6, 6);
			ctx.restore();
		}
	},
	act() {
		if(this_d>= 0) ++dot.f[i];
		if(dot.f[i]>= 2* 5+ 2) dot.del();
	},
});

var coin= new sp({
	name: 'coin',
	is_transparent: 1,
	attr: {
		x: 0,
		y: 0,
		d: -1,
		f: 0,
	},
	rdr() {
		if(this_d>= 0 && this_f>= 2) 
			rdr('vanish', 16* Math.floor((this_f- 2)/ 2), this_x- 2, this_y+ 3, 1, 16, 6, 1, this_d);
		else rdr('coin', f()% 4* 8, this_x+ 2, this_y+ 2, 1, 8);
	},
	act() {
		if(this_d>= 0) ++coin.f[i];
		if(coin.f[i]>= 2* 5+ 2) coin.del();
	},
});

var regeneration= new sp({
	name: 'regeneration',
	is_transparent: 1,
	attr: {
		x: 0,
		y: 0,
		used: 0,
	},
	rdr() {
		if(f()% 20< 16) rdr('regeneration', f(10)% 2* 10, this_x+ 1, this_y, 1, 10);
		else rdr('regeneration', (f()% 20- 16+ 2)* 10, this_x+ 1, this_y, 1, 10);
	},
});

var barbwire= new sp({
	name: 'barbwire',
	is_lazy: 1,
	is_wall: 1,
	is_solid: 1,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
	},
	rdr() {
		rdr('barbwire', this_f* 12, this_x, this_y, 1, 12, 12, 1, this_d);
	},
});

var bubble= new sp({
	name: 'bubble',
	is_transparent: 1,
	attr: {
		x: 0,
		y: 0,
		used: 0,
		t: -1,
	},
	rdr() {
		if(!this_used) {
			if(this_t< 0) rdr('bubble', 0, this_x- 3, this_y- 3+ ((f(28)% 2? -1 : 1)* f(14)% 2), 1, 18);
			else rdr('bubble', 18* (Math.floor(this_t/ 2)+ 2), this_x- 3, this_y- 3, 1, 18);
		}
		else if(!(this_x=== player.x && this_y=== player.y))
			rdr('bubble', 36, this_x- 3, this_y- 3, 1, 18);
	},
	act() {
		if(!this_used && this_t>= 0) {
			++bubble.t[i];
			if(bubble.t[i]>= 2* 10) bubble.t[i]= -1;
		}
	},
});

var bubble_trail= new sp({
	name: 'bubble_trail',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		x: 0,
		y: 0,
		t: 0,
	},
	rdr() {
		rdr('bubble', 0, this_x- 3, this_y- 3, 1, 18, 18, 0.4* (1- this_t/ 16));
	},
	act() {
		++bubble_trail.t[i];
		if(!player.moving) ++bubble_trail.t[i];
		if(bubble_trail.t[i]>= 16) bubble_trail.del();
	},
});

var blade_trap= new sp({
	name: 'blade_trap',
	is_wall: 1,
	is_solid: 1,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
	},
	rdr() {
		rdr('blade_trap', 12* (this_f+ f(10)% 2* 6), this_x, this_y, 1, 12, 12, 1, this_d);
	},
});

var blade= new sp({
	name: 'blade',
	keep_id: 0,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
	},
	rdr() {
		if(this_f>= 13) {
			if(this_f< 13+ 5* 4) rdr(
				'blade_trap', 12* (Math.floor((this_f- 13)/ 4)+ 12),
				this_x, this_y, 1, 12, 12, 1, this_d,
			);
			else if(this_f< 13+ 5* 4+ 48) rdr(
				'blade_trap', 12* 16,
				this_x, this_y, 1, 12, 12, 1, this_d,
			);
			else rdr(
				'blade_trap', 12* ((4- Math.floor((this_f- (13+ 5* 4+ 48))/ 4))+ 12),
				this_x, this_y, 1, 12, 12, 1, this_d,
			);
		}
	},
	act() {
		++blade.f[i];
		if(blade.f[i]>= 13+ 5* 4+ 48+ 20) blade.del();
	},
});

var bounce_pad= new sp({
	name: 'bounce_pad',
	keep_id: 0,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		t: -1,
		f: 0,
		used: 0,
	},
	rdr() {
		rdr('bounce_pad', 16* (this_used* this_f+ f(10)% 2* 3), this_x- 2, this_y- 2, 1, 16, 16, 1, this_d);
	},
	act() {
		if(this_used) {
			if(this_t< 0) bounce_pad.t[i]= 19;
			else --bounce_pad.t[i];

			if(bounce_pad.t[i]< 0) bounce_pad.used[i]= bounce_pad.f[i]= 0;
			else {
				const f_arr= [1, 2, 2, 1];
				bounce_pad.f[i]= f_arr[Math.floor(bounce_pad.t[i]/ 5)];
			}
		}
		else bounce_pad.f[i]= 0;
	},
});
for(let i= 0; i< 2; ++i) sp.transparent.push(sp.block.length+ i);
sp.block.push('bounce_pad_l', 'bounce_pad_r');

var bat= new sp({
	name: 'bat',
	keep_id: 0,
	is_mobile: 1,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		step: 0,
		rest_t: -1,
	},
	rdr() {
		rdr('bat', f()% 8* 14, this_x- 1, this_y, 1, 14, 12, 1, 0, (this_d% 2?
			(this_d- 1)/ 2? 1 : -1 :
			this_d? -1 : 1
		));
	},
	act() {
		let col_id;

		if(this_rest_t< 0) {
			switch(this_d) {
				case 0:
					bat.move_y_by(-1.2);
					break;
				case 1:
					bat.move_x_by(1.2);
					break;
				case 2:
					bat.move_y_by(1.2);
					break;
				case 3:
					bat.move_x_by(-1.2);
					break;
			}

			if((col_id= bat.col(warper, ...bat.next_coords[i].split(' ')))>= 0 && !warper.no_return[col_id]) {
				let
					id_list= [],
					index= warper.id.indexOf(warper.id[col_id]);
	
				for(; index>= 0; index= warper.id.indexOf(warper.id[col_id], index+ 1))
					if(index!== col_id) id_list.push(index);
				const id= id_list[Math.floor(Math.random()* id_list.length)];

				bat.move_to(warper.x[id], warper.y[id]);
				warper.glare_t[col_id]= 0;
				warper.glare_t[id]= 0;
			}

			if(!(this_x% 12 || this_y% 12)) ++bat.step[i];
		}

		if((col_id= bat.col(bounce_pad, ...bat.fixed_coords[i].split(' ')))>= 0 && bat.step[i]) {
			bat.d[i]= (this_d+ (this_d% 2? -1 : 1)* (bounce_pad.d[col_id]? 1 : -1));
			while(bat.d[i]< 0) bat.d[i]+= 4;
			while(bat.d[i]> 3) bat.d[i]-= 4;
			bat.step[i]= 0;
			bounce_pad.used[col_id]= 1;
		}

		for(const n of sp.solid) if(bat.col(window[sp.block[n]], ...bat.next_coords[i].split(' '))>= 0) {
			bat.move_to(...bat.fixed_coords[i].split(' '));
			bat.d[i]+= bat.d[i]>= 2? -2 : 2;
			bat.step[i]= 0;
			bat.rest_t[i]= 36;
			break;
		}

		--bat.rest_t[i];
	},
});
for(let i= 0; i< 4; ++i) sp.transparent.push(sp.block.length+ i);
sp.block.push('bat_u', 'bat_r', 'bat_d', 'bat_l');

var lion_blaster= new sp({
	name: 'lion_blaster',
	is_solid: 1,
	is_transparent: 1,
	is_player_spawnable: 1,
	attr: {
		x: 0,
		y: 0,
		d: 0,
	},
	rdr() {
		// cycle= 66+ 0 frames
		if(lion_blaster.glob_t< 47 || lion_blaster.glob_t>= 63) rdr(
			'lion_blaster', 0, this_x, this_y, 1, 12, 12, 1, this_d,
			(this_d=== 2? -1 : 1),
			(this_d=== 1? -1 : 1),
		);
		else rdr(
			'lion_blaster',
			12* Math.floor((lion_blaster.glob_t- 47)/ 4+ 1),
			this_x, this_y, 1, 12, 12, 1, this_d,
			(this_d=== 2? -1 : 1),
			(this_d=== 1? -1 : 1),
		);
		if(lion_blaster.glob_t>= 51) {
			let x= 0, y= 0;
			if(this_d=== 0) [x, y]= [-6, -4];
			if(this_d=== 1) [x, y]= [2, 4];
			if(this_d=== 2) [x, y]= [-6, 12];
			if(this_d=== 3) [x, y]= [-14, 4];
			rdr('blast', 24* Math.floor((lion_blaster.glob_t- 51)/ 3), this_x+ x, this_y+ y, 1, 24, 3, 1, this_d);
		}
	},
	act() {
		if(lion_blaster.glob_t=== 51) {
			let dart_attr= {x: this_x, y: this_y, d: this_d};
			if(this_d=== 0) dart_attr.y-= 3;
			if(this_d=== 1) dart_attr.x+= 3;
			if(this_d=== 2) dart_attr.y+= 3;
			if(this_d=== 3) dart_attr.x-= 3;
			dart.add(dart_attr);
		}
		if(i=== lion_blaster.count- 1) ++lion_blaster.glob_t;
		if(lion_blaster.glob_t>= 66) lion_blaster.glob_t= 0;
	},
	custom: {
		glob_t: 0,
	},
});
for(let i= 0; i< 4; ++i) {
	sp.transparent.push(sp.block.length+ i);
	sp.player_spawnable.push(sp.block.length+ i);
}
sp.block.push('lion_blaster_u', 'lion_blaster_r', 'lion_blaster_d', 'lion_blaster_l');

var dart= new sp({
	name: 'dart',
	keep_id: 0,
	is_mobile: 1,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		step: 0,
		crash_t: -1,
	},
	rdr() {
		if(this_crash_t< 0) rdr('dart', 0, this_x+ 2, this_y+ 1, 1, 8, 10, 1, this_d);
		else rdr('dart_crash', 14* this_crash_t, this_x- 1, this_y, 1, 14, 12, 1, this_d);
	},
	act() {
		let col_id;

		if(this_crash_t< 0) {
			switch(this_d) {
				case 0:
					dart.move_y_by(-3);
					break;
				case 1:
					dart.move_x_by(3);
					break;
				case 2:
					dart.move_y_by(3);
					break;
				case 3:
					dart.move_x_by(-3);
					break;
			}

			if((col_id= dart.col(warper, ...dart.next_coords[i].split(' ')))>= 0 && !warper.no_return[col_id]) {
				let
					id_list= [],
					index= warper.id.indexOf(warper.id[col_id]);
	
				for(; index>= 0; index= warper.id.indexOf(warper.id[col_id], index+ 1))
					if(index!== col_id) id_list.push(index);
				const id= id_list[Math.floor(Math.random()* id_list.length)];

				dart.move_to(warper.x[id], warper.y[id]);
				warper.glare_t[col_id]= 0;
				warper.glare_t[id]= 0;
			}

			if(!(this_x% 12 || this_y% 12)) ++dart.step[i];

			if((col_id= dart.col(bounce_pad, ...dart.fixed_coords[i].split(' ')))>= 0 && dart.step[i]) {
				dart.d[i]= (this_d+ (this_d% 2? -1 : 1)* (bounce_pad.d[col_id]? 1 : -1));
				while(dart.d[i]< 0) dart.d[i]+= 4;
				while(dart.d[i]> 3) dart.d[i]-= 4;
				dart.step[i]= 0;
				bounce_pad.used[col_id]= 1;
			}
		}

		if(this_crash_t>= 0) {
			++dart.crash_t[i];
			if(dart.crash_t[i]>= 4) dart.del();
		}
		else for(const n of sp.solid) if(dart.col(window[sp.block[n]], ...dart.next_coords[i].split(' '))>= 0) {
			dart.move_to(...dart.fixed_coords[i].split(' '));
			dart.crash_t[i]= 0;
		}
	},
});

var star= new sp({
	name: 'star',
	is_transparent: 1,
	attr: {
		x: 0,
		y: 0,
	},
	rdr() {
		if(f()% 20< 16) rdr('star', f(10)% 2* 12, this_x, this_y, 1, 12);
		else rdr('star', 12* (f()% 20- 16+ 2), this_x, this_y, 1, 12);
	},
});

var lock= new sp({
	name: 'lock',
	is_solid: 1,
	is_transparent: 1,
	is_player_spawnable: 1,
	special_attr: 'id',
	share_attr_with: ['opened_lock'],
	attr: {
		x: 0,
		y: 0,
		id: Infinity,
		keyed_t: -1,
		init_locked: 1,
	},
	rdr() {
		if(this_keyed_t< 0) {
			if(key.collected_t[key.id.indexOf(this_id)]>= 0)
				rdr('lock', this_init_locked? 12 : 84- 12, this_x, this_y, 1, 12);
			else
				rdr('lock', this_init_locked? 0 : 84, this_x, this_y, 1, 12, 12, this_init_locked? 1 : 0.5);
		}
		else if(this_keyed_t< 2* (7- 1))
			rdr('lock', 12* Math.floor((this_init_locked? this_keyed_t : 11- this_keyed_t)/ 2+ 1), this_x, this_y, 1, 12);
		else rdr('lock', 12* (this_init_locked? 6 : 0), this_x, this_y, 1, 12);
	},
	act() {
		if(this_keyed_t>= 0) ++lock.keyed_t[i];
		if(lock.keyed_t[i]=== 30) {
			explosion.add({
				x: this_x,
				y: this_y,
				f: Math.floor(Math.random()* 4),
			});
			gen_particle(6, this_x, this_y);
			if(this_init_locked) lock.del();
		}
	},
});
sp.transparent.push(sp.block.length);
sp.player_spawnable.push(sp.block.length);
sp.block.push('opened_lock');

var key= new sp({
	name: 'key',
	is_transparent: 1,
	special_attr: 'id',
	attr: {
		x: 0,
		y: 0,
		id: Infinity,
		collected_t: -1,
	},
	rdr() {
		rdr('key', 12* (f()% 16), this_x, this_y, 1, 12);
	},
	act() {
		const
			off_x= lock.x[lock.id.indexOf(this_id)]- this_x,
			off_y= lock.y[lock.id.indexOf(this_id)]+ 12- this_y;

		if(this_collected_t=== 0) {
			key.x[i]+= Math.min(Math.abs(off_x/ 20)> 4?
				Math.sign(off_x)* 4 : off_x/ 20
			);
			key.y[i]+= Math.min(Math.abs(off_y/ 20)> 4?
				Math.sign(off_y)* 4 : off_y/ 20
			);

			if(
				Math.abs(lock.x[lock.id.indexOf(this_id)]- key.x[i])< 0.5 &&
				Math.abs(lock.y[lock.id.indexOf(this_id)]+ 12- key.y[i])< 0.5
			) {
				[key.x[i], key.y[i]]= [lock.x[lock.id.indexOf(this_id)], lock.y[lock.id.indexOf(this_id)]+ 12];
				key.collected_t[i]= 1;
				lock.keyed_t[lock.id.indexOf(this_id)]= 0;
			}
		}
		else if(this_collected_t> 0) ++key.collected_t[i];
		if(key.collected_t[i]> 30) key.del();
	},
});

var spike= new sp({
	name: 'spike',
	is_transparent: 1,
	special_attr: 'dirs',
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: -1,
	},
	rdr() {
		if(this_f<= 0) rdr('spike', 0, this_x, this_y, 1, 12, 12, 1, this_d);
		else rdr('spike', 12* Math.min(3, Math.floor((this_f- 1)/ 5)), this_x, this_y, 1, 12, 12, 1, this_d);
	},
	act() {
		if(this_f=== 0) {
			if(`${player.fixed_x} ${player.fixed_y}`!== spike.coords[i]) spike.f[i]= 1;
		}
		else if(this_f> 0) ++spike.f[i];
	},
});

var whirl_block= new sp({
	name: 'whirl_block',
	is_solid: 1,
	is_transparent: 1,
	special_attr: 'group',
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
		group: 0,
		del_t: -1,
	},
	rdr() {
		if(this_del_t>= 0) {
			if(this_del_t< 12)
				rdr('whirl_block_deconstruct', 24* Math.min(5, 5- this_del_t+ 6), this_x- 6, this_y- 6, 1, 24);
			else rdr('whirl_block', 12* this_f, this_x, this_y, 1, 12, 12, 1, this_d);
		}
		else rdr('whirl_block', 12* this_f, this_x, this_y, 1, 12, 12, 1, this_d);
	},
	act() {
		if(!this_del_t) {
			gen_particle(6, this_x, this_y);
			whirl_block.del();
			return;
		}
		--whirl_block.del_t[i];
	},
});

var tiger_burner= new sp({
	name: 'tiger_burner',
	is_solid: 1,
	is_transparent: 1,
	is_player_spawnable: 1,
	attr: {
		x: 0,
		y: 0,
		d: 0,
	},
	rdr() {
		// cycle= 54+ 42 frames
		if(tiger_burner.glob_t< 47) rdr(
			'tiger_burner', 0, this_x, this_y, 1, 12, 12, 1, this_d, 
			(this_d=== 2? -1 : 1),
			(this_d=== 1? -1 : 1),
		);
		else rdr(
			'tiger_burner',
			12* (1+ Math.floor((tiger_burner.glob_t- 47)/ 4)% 4),
			this_x, this_y, 1, 12, 12, 1, this_d,
			(this_d=== 2? -1 : 1),
			(this_d=== 1? -1 : 1),
		);
	},
	act() {
		if(tiger_burner.glob_t> 50) {
			let x= this_x, y= this_y;
			if(this_d=== 0) y-= 12;
			if(this_d=== 1) x+= 12;
			if(this_d=== 2) y+= 12;
			if(this_d=== 3) x-= 12;

			let index= fire_stream.coords.indexOf(`${x} ${y}`);
			for(; index>= 0; index= fire_stream.coords.indexOf(`${x} ${y}`, index+ 1))
				if(fire_stream.f[index]=== 2* 6 && fire_stream.root_burner_d[index]=== this_d)
					fire_stream.f[index]= 2* 3;
		}
		else if(tiger_burner.glob_t=== 50) {
			const fire_attr= {x: this_x, y: this_y, d: this_d, root_burner_d: this_d};
			if(this_d=== 0) fire_attr.y-= 12;
			if(this_d=== 1) fire_attr.x+= 12;
			if(this_d=== 2) fire_attr.y+= 12;
			if(this_d=== 3) fire_attr.x-= 12;
			fire_stream.add(fire_attr);
		}

		if(i=== tiger_burner.count- 1) ++tiger_burner.glob_t;
		if(tiger_burner.glob_t>= 96) tiger_burner.glob_t= 0;
	},
	custom: {
		glob_t: 0,
	},
});
for(let i= 0; i< 4; ++i) {
	sp.transparent.push(sp.block.length+ i);
	sp.player_spawnable.push(sp.block.length+ i);
}
sp.block.push('tiger_burner_u', 'tiger_burner_r', 'tiger_burner_d', 'tiger_burner_l');

var fire_stream= new sp({
	name: 'fire_stream',
	keep_id: 0,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
		root_burner_d: -1,
		root_x: Infinity,
		root_y: Infinity,
		root_d: -1,
		used_bounce_pad: 0,
		used_warper: 0,
	},
	rdr() {
		if(this_f< 2* 6) rdr('fire_stream', 14* Math.floor(this_f/ 2), this_x- 1, this_y, 1, 14, 12, 1, this_d);
		else rdr('fire_stream', 14* Math.floor((this_f- 2* 6)/ 2+ 6), this_x- 1, this_y, 1, 14, 12, 1, this_d);
	},
	act() {
		for(const n of sp.solid) if(fire_stream.col(window[sp.block[n]], ...fire_stream.coords[i].split(' '))>= 0) {
			fire_stream.del();
			return;
		}

		let col_id;
		if((col_id= fire_stream.col(warper))>= 0 && !warper.no_return[col_id] && !this_used_warper) {
			let
				id_list= [],
				index= warper.id.indexOf(warper.id[col_id]);

			for(; index>= 0; index= warper.id.indexOf(warper.id[col_id], index+ 1))
				if(index!== col_id) id_list.push(index);
			const id= id_list[Math.floor(Math.random()* id_list.length)];

			fire_stream.x[i]= warper.x[id];
			fire_stream.y[i]= warper.y[id];
			fire_stream.used_warper[i]= 1;

			this_x= fire_stream.x[i];
			this_y= fire_stream.y[i];
		}
		if((col_id= fire_stream.col(bounce_pad))>= 0 && !this_used_bounce_pad) {
			fire_stream.d[i]= (this_d+ (this_d% 2? -1 : 1)* (bounce_pad.d[col_id]? 1 : -1));
			while(fire_stream.d[i]< 0) fire_stream.d[i]+= 4;
			while(fire_stream.d[i]> 3) fire_stream.d[i]-= 4;
			fire_stream.used_bounce_pad[i]= 1;
		}

		if(this_f=== 2* 5) {
			const cond= ()=> fire_stream.f[match_id]< 2* 6 && fire_stream.d[match_id]=== this_d;
			switch(this_d) {
				case 0:
					if(fire_stream.col(fire_stream, 'x', this_y- 12, cond)< 0)
						fire_stream.add({
							x: this_x, y: this_y- 12, d: 0,
							root_x: this_x, root_y: this_y, root_d: this_d,
						});
					break;
				case 1:
					if(fire_stream.col(fire_stream, this_x+ 12, 'y', cond)< 0)
						fire_stream.add({
							x: this_x+ 12, y: this_y, d: 1,
							root_x: this_x, root_y: this_y, root_d: this_d,
						});
					break;
				case 2:
					if(fire_stream.col(fire_stream, 'x', this_y+ 12, cond)< 0)
						fire_stream.add({
							x: this_x, y: this_y+ 12, d: 2,
							root_x: this_x, root_y: this_y, root_d: this_d,
						});
					break;
				case 3:
					if(fire_stream.col(fire_stream, this_x- 12, 'y', cond)< 0)
						fire_stream.add({
							x: this_x- 12, y: this_y, d: 3,
							root_x: this_x, root_y: this_y, root_d: this_d,
						});
					break;
			}
		}
		if(this_f=== 2* 6) {
			const cond= ()=> fire_stream.d[match_id]=== this_d;
			if(
				this_d=== 0 && fire_stream.col(fire_stream, 'x', this_y+ 12, cond)>= 0 ||
				this_d=== 1 && fire_stream.col(fire_stream, this_x- 12, 'y', cond)>= 0 ||
				this_d=== 2 && fire_stream.col(fire_stream, 'x', this_y- 12, cond)>= 0 ||
				this_d=== 3 && fire_stream.col(fire_stream, this_x+ 12, 'y', cond)>= 0 ||
				fire_stream.d[fire_stream.coords.indexOf(`${this_root_x} ${this_root_y}`)]=== this_root_d
			) fire_stream.f[i]= 2* 3;
		}

		++fire_stream.f[i];
		if(fire_stream.f[i]>= 2* 6+ 2* 5) fire_stream.del();
	},
});

var ice_block= new sp({
	name: 'ice_block',
	is_solid: 1,
	is_transparent: 1,
	special_attr: 'group',
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
		group: 0,
		drop_t: 0,
		obstructed: 0,
		recover_t: 32,
	},
	rdr() {
		rdr(
			'ice_block', 12* (this_f+ (this_drop_t> 0 && this_drop_t< 27)* 6),
			this_x, this_y,
			1, 12, 12, 1, this_d,
		);
		rdr(
			'ice_block', 12* (12+ Math.min(8, Math.floor(this_recover_t/ 4))+ (this_drop_t> 0 && this_drop_t< 27)* 9),
			this_x, this_y,
			1, 12,
		);
	},
	act() {
		if(this_drop_t< 27 && this_obstructed) {
			if(player.d% 2) ice_block.cam_tilt_y= (this_drop_t> 0)* (f(9)% 2 || -1)* (f(3)% 3);
			else ice_block.cam_tilt_x= (this_drop_t> 0)* (f(9)% 2 || -1)* (f(3)% 3);
			ice_block.cam_change= 1;
		}
		if(i=== ice_block.count- 1 && !ice_block.cam_change) {
			ice_block.cam_tilt_x= 0;
			ice_block.cam_tilt_y= 0;
		}

		if(this_obstructed) {
			++ice_block.drop_t[i];
			if(ice_block.drop_t[i]=== 27) {
				falling_ice.add({link_id: i});
				ice_block.recover_t[i]= 0;
			}
		}
		else ice_block.drop_t[i]= 0;
		if(ice_block.drop_t[i]< 27) ++ice_block.recover_t[i];

		ice_block.obstructed[i]= 0;
	},
	custom: {
		cam_tilt_x: 0,
		cam_tilt_y: 0,
		cam_change: 0,
	},
});

var falling_ice= new sp({
	name: 'falling_ice',
	keep_id: 0,
	has_hitbox: 0,
	attr: {
		link_id: -1,
		y: 0,
		vy: 1,
		t: 0,
	},
	rdr() {
		rdr('ice_block', 12* (ice_block.f[this_link_id]+ 6), ice_block.x[this_link_id], ice_block.y[this_link_id]+ this_y, 1, 12, 12, 1- (this_t- 21)/ (36- 21), ice_block.d[this_link_id]);
		rdr('ice_block', 12* 29, ice_block.x[this_link_id], ice_block.y[this_link_id]+ this_y, 1, 12, 12, 1- (this_t- 21)/ (36- 21));
	},
	act() {
		falling_ice.y[i]+= this_vy;
		falling_ice.vy[i]+= 0.15;
		if(falling_ice.vy[i]>= 4) falling_ice.vy[i]= 4;
		++falling_ice.t[i];
		if(falling_ice.t[i]>= 36) falling_ice.del();
	},
});

var chameleon_block= new sp({
	name: 'chameleon_block',
	is_solid: 1,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
	},
	rdr() {
		// 90+ 90 frames
		rdr('chameleon_block', 12* 5, this_x, this_y, 1, 12);
		if(this_f< 5) rdr('chameleon_block', 12* this_f, this_x, this_y, 1, 12, 12, 1, this_d);
		if(chameleon_block.glob_t>= 90) {
			ctx.save();
			ctx.fillStyle= '#000';
			ctx.globalAlpha= 0.6;
			ctx.fillRect(Math.round(this_x- cam_x)* 3, Math.round(this_y- cam_y)* 3, 36, 36);
			ctx.restore();
		}
	},
	act() {
		if(!i) {
			++chameleon_block.glob_t;
			if(chameleon_block.glob_t>= 180) chameleon_block.glob_t= 0;
		}
	},
	custom: {
		glob_t: 0,
	},
});

var semi_solid_wall= new sp({
	name: 'semi_solid_wall',
	is_solid: 1,
	is_lazy: 1,
	has_fancy_corners: 1,
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
	},
	rdr() {
		if(i=== 0) {
			const arr= Array.from(new Set(semi_solid_wall.coords));
			for(const coords of arr)
				rdr('background', 0, ...coords.split(' '), 1, 12);
		}

		if(this_f< 9) rdr('wall', 12* this_f, this_x, this_y, 1, 12, 12, 1, this_d);

		if(i=== semi_solid_wall.count- 1) {
			dummy_ctx.save();
			dummy_ctx.fillStyle= '#000';
			dummy_ctx.globalAlpha= 0.6;

			const arr= Array.from(new Set(semi_solid_wall.coords));
			for(const coords of arr) {
				dummy_ctx.fillRect(
					Math.round(coords.split(' ')[0]),
					Math.round(coords.split(' ')[1]),
					12, 12,
				);
			}
			dummy_ctx.restore();
		}
	},
});

var warper= new sp({
	name: 'warper',
	is_transparent: 1,
	special_attr: 'id',
	share_attr_with: ['no_return_warper'],
	attr: {
		x: 0,
		y: 0,
		id: -1,
		no_return: 0,
		glare_t: 2* 14,
	},
	rdr() {
		rdr((this_no_return? 'no_return_' : '')+ 'warper', f()% 8* 12, this_x, this_y, 1, 12);
		if(this_glare_t< 2* 14)
			rdr('player_escape', 60* Math.floor(this_glare_t/ 2), this_x- 24, this_y- 24, 1, 60);
	},
	act() {
		++warper.glare_t[i];
	},
});
sp.transparent.push(sp.block.length);
sp.block.push('no_return_warper');

var jelly= new sp({
	name: 'jelly',
	is_player_spawnable: 1,
	is_solid: 1,
	is_transparent: 1,
	special_attr: 'group',
	attr: {
		x: 0,
		y: 0,
		d: 0,
		f: 0,
		group: 0,
	},
	rdr() {
		rdr('jelly', 0, this_x, this_y, 1, 12, 12);
		rdr('jelly_edge', 12* this_f, this_x, this_y, 1, 12, 12, 1, this_d);
	},
});

var pufferfish= new sp({
	name: 'pufferfish',
	is_solid: 1,
	is_transparent: 1,
	attr: {
		x: 0,
		y: 0,
	},
	rdr() {
		// 75+ 30 frames
		if(pufferfish.glob_t< 75- 20- 20)
			rdr('pufferfish', Math.floor(pufferfish.glob_t/ 5)% 6* 14, this_x- 1, this_y- 1, 1, 14);
		else if(pufferfish.glob_t< 75- 20)
			rdr('inflated_pufferfish', 36* Math.floor((pufferfish.glob_t- 75+ 20+ 20)/ 5), this_x- 12, this_y- 12, 1, 36);
		else if(pufferfish.glob_t< 105- 20)
			rdr('inflated_pufferfish', (3+ !(Math.floor((pufferfish.glob_t- 75+ 20)/ 5)% 2))* 36, this_x- 12, this_y- 12, 1, 36);
		else rdr('inflated_pufferfish', (4- Math.floor((pufferfish.glob_t- 105+ 20)/ 5))* 36, this_x- 12, this_y- 12, 1, 36);

		if(pufferfish.glob_t=== 75- 20- 1) {
			const dir= [
				[-12, -12], [0, -12], [12, -12],
				[-12, 0], /* center */ [12, -12],
				[-12, 12], [0, 12], [12, 12],
			];
			for(let i= 0; i< 8; ++i) inflated_pufferfish.add({
				x: dir[i][0]+ this_x,
				y: dir[i][1]+ this_y,
			});
		}
	},
	act() {
		if(i=== pufferfish.count- 1) ++pufferfish.glob_t;
		if(pufferfish.glob_t> 105) pufferfish.glob_t= 0;
	},
	custom: {
		glob_t: 0,
	},
});

var inflated_pufferfish= new sp({
	name: 'inflated_pufferfish',
	keep_id: 0,
	attr: {
		x: 0,
		y: 0,
	},
	rdr() {},
	act() {
		if(pufferfish.glob_t>= 105- 20) inflated_pufferfish.del();
	},
});

var barrier= new sp({
	name: 'barrier',
	is_lazy: 1,
	is_transparent: 1,
	special_attr: 'dirs',
	attr: {
		x: 0,
		y: 0,
		d: 0,
	},
	rdr() {
		rdr('barrier', 0, this_x, this_y- 2, 1, 12, 16, 1, this_d);
	},
});

var one_way_wall= new sp({
	name: 'one_way_wall',
	is_lazy: 1,
	is_transparent: 1,
	special_attr: 'dirs',
	attr: {
		x: 0,
		y: 0,
		d: 0,
	},
	rdr() {
		rdr('one_way_wall', 0, this_x, this_y- 2, 1, 12, 16, 1, this_d);
	},
});

var slide_block= new sp({
	name: 'slide_block',
	is_mobile: 1,
	is_transparent: 1,
	is_solid: 1,
	attr: {
		x: 0,
		y: 0,
		d: -1,
		fixed: 0,
	},
	rdr() {
		rdr('slide_block', 12* this_fixed, this_x, this_y, 1, 12, 12, 1, this_d* this_fixed);
	},
	custom: {
		req_move(id) {
			if(!(slide_block.fixed[id] && (slide_block.d[id]- player.d)% 2)) {
				if(player.d=== 0) slide_block.move_y_by(6, id);
				if(player.d=== 1) slide_block.move_x_by(-6, id);
				if(player.d=== 2) slide_block.move_y_by(-6, id);
				if(player.d=== 3) slide_block.move_x_by(6, id);
			}
			else return 0;

			function snap_to_grid() {
				slide_block.x[id]= parseInt(slide_block.fixed_coords[id].split(' ')[0]);
				slide_block.y[id]= parseInt(slide_block.fixed_coords[id].split(' ')[1]);
				slide_block.next_coords[id]= slide_block.fixed_coords[id];
			}
			let col_id;
			if(slide_block.x[id]% 12 || slide_block.y[id]% 12) {
				for(const n of sp.solid)
					if((col_id= slide_block.col(
						window[sp.block[n]],
						slide_block.next_coords[id].split(' ')[0],
						slide_block.next_coords[id].split(' ')[1],
						auto, id,
					))>= 0) {
						if(sp.block[n]=== 'slide_block' && !(slide_block.fixed[col_id] && (slide_block.d[col_id]- player.d)% 2)) {
							if(!slide_block.req_move(col_id)) {
								snap_to_grid();
								return 0;
							}
						}
						else {
							snap_to_grid();
							return 0;
						}
					}

				if(!(player.d=== 1 || player.d=== 2) && (col_id= slide_block.col(
					slide_block,
					slide_block.fixed_coords[id].split(' ')[0],
					slide_block.fixed_coords[id].split(' ')[1],
					auto, id,
				))>= 0 && !slide_block.req_move(col_id)) {
					snap_to_grid();
					return 0;
				}
			}
			else if((col_id= slide_block.col(
				slide_block,
				slide_block.next_coords[id].split(' ')[0],
				slide_block.next_coords[id].split(' ')[1],
				auto, id,
			))>= 0 && !slide_block.req_move(col_id)) {
				snap_to_grid();
				return 0;
			}

			return 1;
		},
	},
});
for(let i= 0; i< 2; ++i) sp.transparent.push(sp.block.length+ i);
sp.block.push('fixed_slide_block_ud', 'fixed_slide_block_lr');
