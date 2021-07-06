'use strict';

// debug
function log_data() {
	console.log(`\
current level: ${lv}
fps: ${fps.toFixed(2)}
time loss between frames (upon calling): ${frame_delta.toFixed(2)}ms
`);
}

// skip
function skip(n= 1) {
	lv+= n;
	if(lv>= stage.length || lv< 0) {
		console.error(`Invalid level ${lv}`);
		lv-= n;
		return;
	}
	state= 'gen_lv';
}
function skip_to(n= lv+ 1) {
	const old= lv;
	lv= n;
	if(lv>= stage.length || lv< 0) {
		console.error(`Invalid level ${lv}`);
		lv= old;
		return;
	}
	state= 'gen_lv';
}

// show hitbox
var show_hitbox= 0;
function toggle_hitbox() {
	show_hitbox= !show_hitbox;
}
addEventListener('keydown', e=> {
	if(k.Escape) toggle_hitbox();
});

