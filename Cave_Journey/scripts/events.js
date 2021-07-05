var e= {
  newEvent: new Array(),
  name: [
    'illegalLevel',
    'wKey',
    'dKey',
    'sKey',
    'aKey',
    'finish',
    'death',
    'nextLevel',
  ],
  script: [
    `
player.stop= true;
player.alive= false;

draw('levelFinished', 0, 0, 'auto', 'auto', area.width/ 2- 420/ 2, area.height/ 2- 190/ 2);
p('Failed task', area.width/ 2- 11* 20/ 2, area.height/ 2- 190/ 2+ 1* 20)
p('Illeagal level '+ currentLevel, area.width/ 2- (15+ currentLevel.toString().length)* 20/ 2, area.height/ 2- 190/ 2+ 2.5* 20);
p('Press R to retry', area.width/ 2- 16* 20/ 2, area.height/ 2- 190/ 2+ 6* 20);`,
    `if(!player.sliding && player.alive) player.dir= 0;`,
    `if(!player.sliding && player.alive) player.dir= 1;`,
    `if(!player.sliding && player.alive) player.dir= 2;`,
    `if(!player.sliding && player.alive) player.dir= 3;`,
    `
player.stop= true;

clear();
localStorage.setItem('lastLevel', currentLevel< maps.layer1.length- 1? currentLevel+ 1: 0);

draw('levelFinished', 0, 0, 'auto', 'auto', area.width/ 2- 420/ 2, area.height/ 2- 190/ 2);
p('Level '+ (currentLevel+ 1), area.width/ 2- (6+ (currentLevel+ 1).toString().length)* 20/ 2, area.height/ 2- 190/ 2+ 1* 20);
p('Cleared', area.width/ 2- 7* 20/ 2, area.height/ 2- 190/ 2+ 2.5* 20);
p('Press space', area.width/ 2- 11* 20/ 2, area.height/ 2- 190/ 2+ 6* 20);
p('to proceed', area.width/ 2- 10* 20/ 2, area.height/ 2- 190/ 2+ 7.5* 20);

player.newLevel= true;`,
    `
if(!player.stop) {
  player.stop= true;

  clear();

  draw('levelFinished', 0, 0, 'auto', 'auto', area.width/ 2- 420/ 2, area.height/ 2- 190/ 2);
  p('Level '+ (currentLevel+ 1), area.width/ 2- (6+ (currentLevel+ 1).toString().length)* 20/ 2, area.height/ 2- 190/ 2+ 1* 20);
  p('Defeated', area.width/ 2- 8* 20/ 2, area.height/ 2- 190/ 2+ 2.5* 20);
  p('Press space', area.width/ 2- 11* 20/ 2, area.height/ 2- 190/ 2+ 6* 20);
  p('to try again', area.width/ 2- 12* 20/ 2, area.height/ 2- 190/ 2+ 7.5* 20);
  player.newLevel= true;
}`,
    `
if(player.newLevel) {
  newLevel();
  document.title= 'Cave Journey - Level '+ (currentLevel+ 1);
}`,
  ],
};
var newEvent= (eventName)=> e.newEvent[e.newEvent.length]= eventName;

var eventTick= 100;
var eventHandler= setInterval(()=> {
  if(e.newEvent.length> 0) for(var i= 0; i< e.newEvent.length; i++) eval(e.script[e.name.indexOf(e.newEvent[i])]);
  e.newEvent= [];
}, 1000/ eventTick);
