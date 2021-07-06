var toggle= 0;
var finishX= 0;
var teleportX= 0;
var playerCostume= 0;

setInterval(()=> {
  finishX= finishX< 12- 1? finishX+ 1: 0;
  teleportX= teleportX< 7- 1? teleportX+ 1: 0;

  toggle= toggle< 4- 1? toggle+ 1: 0;
  playerCostume= playerCostume< 4- 1? playerCostume+ 1: 0;
}, 1000/ 10);
