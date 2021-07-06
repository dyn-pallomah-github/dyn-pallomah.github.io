'use strict';

let
	map= JSON.parse(localStorage['rl.editor.map'] ?? '[]'),
	all_attrs= JSON.parse(localStorage['rl.editor.all_attrs'] ?? '{}'),
	selected= 1;	// wall
cam_x= parseInt(localStorage['rl.editor.cam_x'] ?? 0);
cam_y= parseInt(localStorage['rl.editor.cam_y'] ?? 0);

function place_block() {
	const
		x= Math.floor(m.x/ 12)+ cam_x,
		y= Math.floor(m.y/ 12)+ cam_y;
	// place the selected block
	if(m.btn=== 0) {
		if(!(window[sp.block_order[selected]]?.meta.special_attr || sp.shared_attr[sp.block_order[selected]]) || special_attr_val) {
			if(!map[y]) map[y]= [];
			map[y][x]= sp.block.indexOf(sp.block_order[selected]);
		}
		if(window[sp.block_order[selected]]?.meta.special_attr || sp.shared_attr[sp.block_order[selected]]) {
			if(!all_attrs[sp.block_order[selected]]) all_attrs[sp.block_order[selected]]= [];
			if(!all_attrs[sp.block_order[selected]][y]) all_attrs[sp.block_order[selected]][y]= [];
			all_attrs[sp.block_order[selected]][y][x]= special_attr_val;
		}
	}
	if(m.btn=== 2) {
		const attr= all_attrs[sp.block[map[y]?.[x]]];
		if(attr?.[y]) delete attr[y][x];
		if(attr) {
			let empty= 1;
			for(let i= 0; i< attr.length; ++i)
				if(Array.isArray(attr[i])) for(let j= 0; j< attr[i].length; ++j) {
					if(!(attr[i][j]=== undefined || attr[i][j]=== null)) {
						empty= 0;
						break;
					}
				}
			if(empty) delete all_attrs[sp.block[map[y][x]]];
		}
		if(map[y]) delete map[y][x];
	}
}
cvs.addEventListener('mousedown', place_block, true);
cvs.addEventListener('mousemove', place_block);

cvs.addEventListener('wheel', e=> {
	if(e.deltaY< 0) {
		--selected;
		if(selected< 0) selected= sp.block_order.length- 1;
	}
	else {
		++selected;
		if(selected>= sp.block_order.length) selected= 0;
	}
});

addEventListener('keydown', e=> {
	switch(e.key) {
		case 'ArrowUp':
			if(cam_y> 0) --cam_y;
			else {
				map.unshift([]);
				for(const n in all_attrs) all_attrs[n].unshift([]);
			}
			break;
		case 'ArrowDown':
			++cam_y;
			break;
		case 'ArrowLeft':
			if(cam_x> 0) --cam_x;
			else {
				for(let i= 0; i< map.length; ++i) if(map[i]) map[i].unshift(undefined);

				for(const n in all_attrs)
					for(let i= 0; i< all_attrs[n].length; ++i)
						if(all_attrs[n][i]) all_attrs[n][i].unshift(undefined);
			}
			break;
		case 'ArrowRight':
			++cam_x;
			break;

		case 'Delete':
			map= [];
			all_attrs= {};
			break;
		case 'Escape':
			let o= `'{"main":${out()}`;
			for(const n in all_attrs) o+= `,"${n}":${out(all_attrs[n])}`;
			console.log(o+ `}',`);
			break;
	}
});

let special_attr_val= '';
addEventListener('keydown', e=> {
	switch(e.key) {
		default:
			if(e.key.length=== 1) special_attr_val+= e.key;
			break;

		case 'Backspace':
			special_attr_val= special_attr_val.slice(0, special_attr_val.length- 1);
			break;
	}
});
const rdr_data= [
	// [img, cx, x_offset, y_offset, width, ?height, ?dir, ?fx, ?fy]
	['player', 0, -1, -1, 14],
	['wall', 48, 0, 0, 12],
	['exit', 0, 0, 0, 12],
	'dot',
	['coin', 0, 2, 2, 8],
	['regeneration', 10, 1, 0, 10],
	['barbwire', 48, 0, 0, 12],
	['bubble', 0, -3, -3, 18],
	['blade_trap', 48, 0, 0, 12],
	['bounce_pad', 0, -2, -2, 16, 16, 0],
	['bounce_pad', 0, -2, -2, 16, 16, 1],
	['bat', 0, -1, 0, 14, 12, 0],
	['bat', 0, -1, 0, 14, 12, 1],
	['bat', 0, -1, 0, 14, 12, 2],
	['bat', 0, -1, 0, 14, 12, 3],
	null,
	['lion_blaster', 0, 0, 0, 12, 12, 0, 1, 1],
	['lion_blaster', 0, 0, 0, 12, 12, 1, 1, -1],
	['lion_blaster', 0, 0, 0, 12, 12, 2, -1, 1],
	['lion_blaster', 0, 0, 0, 12, 12, 3, 1, 1],
	['star', 12, 0, 0, 12],
	['lock', 0, 0, 0, 12],
	['lock', 84, 0, 0, 12],
	['key', 0, 0, 0, 12],
	['spike', 36, 0, 0, 12],
	['whirl_block', 48, 0, 0, 12],
	null,
	['tiger_burner', 0, 0, 0, 12, 12, 0, 1, 1],
	['tiger_burner', 0, 0, 0, 12, 12, 1, 1, -1],
	['tiger_burner', 0, 0, 0, 12, 12, 2, -1, 1],
	['tiger_burner', 0, 0, 0, 12, 12, 3, 1, 1],
	'ice_block',
	['chameleon_block', 60, 0, 0, 12],
	'semi_solid_wall',
	['warper', 24, 0, 0, 12],
	['no_return_warper', 24, 0, 0, 12],
	'jelly',
	['pufferfish', 0, -1, -1, 14],
	['barrier', 0, 0, -2, 12, 16],
	['one_way_wall', 0, 0, -2, 12, 16],
	['slide_block', 0, 0, 0, 12],
	['slide_block', 12, 0, 0, 12, 12, 0],
	['slide_block', 12, 0, 0, 12, 12, 1],
];
function clock() {
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	for(let i= 0; i< map.length; ++i) {
		if(map[i]) for(let j= 0; j< map[i].length; ++j) {
			if(Number.isInteger(map[i][j])) switch(map[i][j]) {
				default: {
					const $= rdr_data[map[i][j]];
					rdr($[0], $[1], 12* (j- cam_x)+ $[2], 12* (i- cam_y)+ $[3], 0, $[4], $[5], 1, $[6], $[7], $[8]);

					if(window[sp.block[map[i][j]]]?.meta.special_attr || sp.shared_attr[sp.block[map[i][j]]]) {
						const this_attr= all_attrs[sp.block[map[i][j]]]?.[i]?.[j]+ [] ?? '';
						write(this_attr, 12* (j- cam_x)+ (12- (this_attr.length* 6+ 1))/ 2, 12* (i- cam_y)+ 2, 0.7);
					}
					break;
				}
				case sp.block.indexOf('dot'): {
					ctx.fillStyle= '#ffff00';
					ctx.globalAlpha= 1;
					ctx.fillRect((12* (j- cam_x)+ 5)* 3, (12* (i- cam_y)+ 5)* 3, 6, 6);
					break;
				}
				case sp.block.indexOf('ice_block'): {
					rdr('ice_block', 48, 12* (j- cam_x), 12* (i- cam_y), 0, 12);
					rdr('ice_block', 216, 12* (j- cam_x), 12* (i- cam_y), 0, 12);

					const this_attr= all_attrs[sp.block[map[i][j]]]?.[i]?.[j]+ [] ?? '';
					write(this_attr, 12* (j- cam_x)+ (12- (this_attr.length* 6+ 1))/ 2, 12* (i- cam_y)+ 2, 0.7);
					break;
				}
				case sp.block.indexOf('semi_solid_wall'): {
					rdr('background', 1, 12* (j- cam_x)+ 1, 12* (i- cam_y)+ 1, 0, 10, 10, 0.4);
					break;
				}
				case sp.block.indexOf('jelly'): {
					rdr('jelly', 3, 12* (j- cam_x), 12* (i- cam_y), 0, 12, 12);
					rdr('jelly_edge', 48, 12* (j- cam_x), 12* (i- cam_y), 0, 12);

					const this_attr= all_attrs[sp.block[map[i][j]]]?.[i]?.[j]+ [] ?? '';
					write(this_attr, 12* (j- cam_x)+ (12- (this_attr.length* 6+ 1))/ 2, 12* (i- cam_y)+ 2, 0.7);
					break;
				}
			}
		}
	}
	// display the currently selecting block
	switch(selected) {
		default: {
			const $= rdr_data[sp.block.indexOf(sp.block_order[selected])];
			rdr($[0], $[1], (12* Math.floor(m.x/ 12)+ $[2]), (12* Math.floor(m.y/ 12)+ $[3]), 0, $[4], $[5], 0.4, $[6], $[7], $[8]);
			break;
		}
		case sp.block_order.indexOf('dot'): {
			ctx.fillStyle= '#ffff00';
			ctx.globalAlpha= 0.4;
			ctx.fillRect((12* Math.floor(m.x/ 12)+ 5)* 3, (12* Math.floor(m.y/ 12)+ 5)* 3, 6, 6);
			break;
		}
		case sp.block_order.indexOf('ice_block'): {
			rdr('ice_block', 48, 12* Math.floor(m.x/ 12), 12* Math.floor(m.y/ 12), 0, 12, 12, 0.4);
			break;
		}
		case sp.block_order.indexOf('semi_solid_wall'): {
			rdr('background', 1, 12* Math.floor(m.x/ 12)+ 1, 12* Math.floor(m.y/ 12)+ 1, 0, 10, 10, 0.4);
			break;
		}
		case sp.block_order.indexOf('jelly'): {
			rdr('jelly', 3, 12* Math.floor(m.x/ 12), 12* Math.floor(m.y/ 12), 0, 12, 12, 0.4);
			break;
		}
	}
	write(
		sp.block_order[selected].replace(/_/g, ' ')+
		((window.attr= window[sp.block_order[selected]]?.meta.special_attr ?? sp.shared_attr[sp.block_order[selected]])? ` ${attr}= ${special_attr_val || '?'}` : ''),
	4, 2);
	delete window.attr;

	requestAnimationFrame(clock);
}
clock();

addEventListener('beforeunload', e=> {
	localStorage['rl.editor.map']= JSON.stringify(map);
	localStorage['rl.editor.all_attrs']= JSON.stringify(all_attrs);
	localStorage['rl.editor.cam_x']= cam_x;
	localStorage['rl.editor.cam_y']= cam_y;
});
function out(src= map, ...no_cleanup_dir) {
	let m= [];
	for(let i= 0; i< src.length; ++i) {
		if(Array.isArray(src[i])) m[i]= [...src[i]];
		else m[i]= [];
	}
	for(let i= 0; i< m.length; ++i)
		for(let j= 0; j< m[i].length; ++j) {
			if(m[i][j]=== '') m[i][j]= null;
			if(!isNaN(parseInt(m[i][j]))) m[i][j]= parseInt(m[i][j]);
		}

	// cleanup
	// top
	if(src=== map) {
		if(!no_cleanup_dir.includes(0)) for(let i= 0; i<= m.length; ++i) {
			if(i=== m.length) return '[]';

			let brk= 0;
			if(m[i]) for(let j= 0; j< m[i].length; ++j)
				if(Number.isInteger(m[i][j])) {
					m.splice(0, i);
					brk= 1;
					break;
				}
			if(brk) break;
		}
	}
	else m.splice(0, map.length- JSON.parse(out(map, 2)).length);

	// bottom
	if(!no_cleanup_dir.includes(2)) for(let i= m.length- 1; i>= 0; --i) {
		let brk= 0;
		if(m[i])
			for(let j= 0; j< m[i].length; ++j) if(Number.isInteger(m[i][j])) {
				m= m.slice(0, i+ 1);
				brk= 1;
				break;
			}
		if(brk) break;
	}

	// right
	if(!no_cleanup_dir.includes(1)) for(let i= 0; i< m.length; ++i) {
		let j= m[i].length- 1;
		for(; j>= 0; --j) if(Number.isInteger(m[i][j])) break;
		m[i]= m[i].slice(0, j+ 1);
	}

	// left
	if(src=== map) {
		if(!no_cleanup_dir.includes(3)) {
			let min;
			for(let i= 1; i< m.length; ++i) {
				let j= 0;
				for(; j< m[i].length; ++j) if(Number.isInteger(m[i][j])) break;
				if(j< min || !Number.isInteger(min)) min= j;
			}
			for(let i= 0; i< m.length; ++i) {
				m[i]= m[i].slice(min);
			}
		}
	}
	else for(let i= 0; i< m.length; ++i) {
		m[i]= m[i].slice(JSON.parse(out(auto, 3))[i].length- JSON.parse(out())[i].length);
	}

	// clear empty rows
	for(let i= 0; i< m.length; ++i) {
		let j= 0;
		for(; j< m[i].length; ++j) if(Number.isInteger(m[i][j])) break;
		if(j=== m[i].length) m[i]= [];
	}
	return JSON.stringify(m);
}
function load(str= '', mode= 'lesson', old_map_sys= 0) {
	if(Number.isInteger(str)) str= stage[mode][str- 1];
	const m= JSON.parse(str);
	if(old_map_sys) {
		map= m;
		all_attrs= {};
	}
	else {
		map= m.main;
		for(const n in m) if(n!== 'main') all_attrs[n]= m[n];
	}
	cam_x= cam_y= 0;
}
