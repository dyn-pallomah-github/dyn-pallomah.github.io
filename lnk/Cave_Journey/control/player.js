var player= new Object();

window.addEventListener('keyup', ()=> {
  if(event.keyCode=== 32) newEvent('nextLevel');
});
window.addEventListener('keydown', ()=> {
  switch(event.keyCode) {
    case 81:
      newEvent('death');
      break;
    case 82:
      window.location.reload();
      break;
    case 88:
      localStorage.clear();
      break;
  }
});
window.addEventListener('keydown', ()=> {
  switch(event.keyCode) {
    case 87:
      newEvent('wKey');
      break;
    case 68:
      newEvent('dKey');
      break;
    case 83:
      newEvent('sKey');
      break;
    case 65:
      newEvent('aKey');
      break;

    case 38:
      newEvent('wKey');
      break;
    case 39:
      newEvent('dKey');
      break;
    case 40:
      newEvent('sKey');
      break;
    case 37:
      newEvent('aKey');
      break;
  }
});

var newLevel= ()=> {
  clearInterval(player.wallCheck);
  
  if(localStorage.lastLevel) currentLevel= parseInt(localStorage.lastLevel);
  else currentLevel= 0;
  localStorage.lastLevel= currentLevel;

  generate(true);
  player.cx= spawn[1];
  player.cy= spawn[0];
  player.d= 0;

  if(inc($1(player.cy+ 1, player.cx), 'wall') && !inc($1(player.cy+ 1, player.cx), 'danger')) player.dir= 2;
  else if(inc($1(player.cy- 1, player.cx), 'wall') && !inc($1(player.cy- 1, player.cx), 'danger')) player.dir= 0;
  else if(inc($1(player.cy, player.cx+ 1), 'wall') && !inc($1(player.cy, player.cx+ 1), 'danger')) player.dir= 1;
  else if(inc($1(player.cy, player.cx- 1), 'wall') && !inc($1(player.cy, player.cx- 1), 'danger')) player.dir= 3;
  player.oldDir= player.dir;
  player.star= 0;
  player.stop= false;
  player.alive= true;
  player.newLevel= false;

  player.prevBlock= '';
  player.nextBlock= '';

  player.wallCheck= setInterval(()=> {
    if(currentLevel< 0 || currentLevel>= maps.layer1.length) return;

    if($1(player.cy, player.cx)=== '<') {
      if(player.dir=== 0) player.dir= 3;
      else if(player.dir=== 3) player.dir= 0;
      if(player.dir=== 2) player.dir= 1;
      else if(player.dir=== 1) player.dir= 2;
      player.oldDir= player.dir;
    }
    if($1(player.cy, player.cx)=== '>') {
      if(player.dir=== 0) player.dir= 1;
      else if(player.dir=== 1) player.dir= 0;
      if(player.dir=== 2) player.dir= 3;
      else if(player.dir=== 3) player.dir= 2;
      player.oldDir= player.dir;
    }

    if(player.oldDir!== player.dir) {
      if(
        (
          (player.oldDir=== 0 && !inc($1(player.cy- 1, player.cx), 'solid')) ||
          (player.oldDir=== 1 && !inc($1(player.cy, player.cx+ 1), 'solid')) ||
          (player.oldDir=== 2 && !inc($1(player.cy+ 1, player.cx), 'solid')) ||
          (player.oldDir=== 3 && !inc($1(player.cy, player.cx- 1), 'solid'))
        ) && !inc($1(player.cy, player.cx), 'solid')
      ) player.dir= player.oldDir;
    }

    if(player.dir=== 0) player.nextBlock= $1(player.cy- 1, player.cx, '');
    if(player.dir=== 1) player.nextBlock= $1(player.cy, player.cx+ 1, '');
    if(player.dir=== 2) player.nextBlock= $1(player.cy+ 1, player.cx, '');
    if(player.dir=== 3) player.nextBlock= $1(player.cy, player.cx- 1, '');

    player.sliding= true;
    if(!player.stop && player.alive) {
      if((player.nextBlock=== '|' || $1(player.cy, player.cx)=== '|') && player.dir% 2=== 1) {
        player.sliding= false;
      }
      else if((player.nextBlock=== '-' || $1(player.cy, player.cx)=== '-') && player.dir% 2=== 0) {
        player.sliding= false;
      }
      else {
        if(player.dir=== 0 && !(inc($1(player.cy- 1, player.cx, '*'), 'fullSolid'))) {
          player.cy-= 1;
          player.d++;
        }
        else if(player.dir=== 1 && !(inc($1(player.cy, player.cx+ 1, '*'), 'fullSolid'))) {
          player.cx+= 1;
          player.d++;
        }
        else if(player.dir=== 2 && !(inc($1(player.cy+ 1, player.cx, '*'), 'fullSolid'))) {
          player.cy+= 1;
          player.d++;
        }
        else if(player.dir=== 3 && !(inc($1(player.cy, player.cx- 1, '*'), 'fullSolid'))) {
          player.cx-= 1;
          player.d++;
        }
        else {
          player.d= 0;
          player.sliding= false;
        }
      }
    }

    if(player.d>= 200) {
      newEvent('death');
      player.killedBy= 'loop';
    }
    if(player.nextBlock=== '') {
      newEvent('death');
      player.killedBy= 'void';
    }

    if(!player.stop && player.alive) {
      if(inc($1(player.cy, player.cx), 'fullSolid')) {
        setTimeout(()=> {newEvent('death');}, 0.8* 1000);
        player.killedBy= 'suffocate';
        player.alive= false;
      }

      if($1(player.cy, player.cx)=== '!' && player.star=== 3) newEvent('finish');
      if(player.nextBlock=== '#') {
        setTimeout(()=> {newEvent('death');}, 0.8* 1000);
        player.killedBy= 'spike';
        player.alive= false;
      }
      if($1(player.cy, player.cx)=== '$') {
        theStage.layer1[player.cy]= r(0, 0, player.cx)+ ' '+ r(0, player.cx+ 1);
        player.star++;
      }
      if($1(player.cy, player.cx)=== '%') theStage.layer1[player.cy]= r(0, 0, player.cx)+ ' '+ r(0, player.cx+ 1);
      if($1(player.cy, player.cx)=== '~') theStage.layer1[player.cy]= r(0, 0, player.cx)+ '+'+ r(0, player.cx+ 1);
      if(/[a-z]/.test($1(player.cy, player.cx)) && (player.d> 0 || player.oldDir!== player.dir)) {
        var x= teleport.key.indexOf($1(player.cy, player.cx));
        if(
          teleport.p1x[x]=== player.cx &&
          teleport.p1y[x]=== player.cy
        ) {
          player.cy= teleport.p2y[x];
          player.cx= teleport.p2x[x];
        }
        else {
          player.cy= teleport.p1y[x];
          player.cx= teleport.p1x[x];
        }
      }

      generate();
      d('player', player.sliding? playerCostume* 32: player.dir* 32, player.sliding? 32: 0, 288, 288);
    }
    if(!player.stop && !player.alive) {
      generate();
      d('player', player.dir* 32, 64, 288, 288);
    }
    player.prevBlock= $1(player.cy, player.cx);
    player.oldDir= player.dir;
  }, 1000/ 60);
}
newLevel();
