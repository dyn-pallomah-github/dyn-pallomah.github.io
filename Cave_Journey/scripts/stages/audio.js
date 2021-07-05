var audio= {
  played: new Array(),

  play: (sound)=> {new Audio('/audio/'+ sound+ '.wav').play()},
  playOnce: (sound)=> {
    if(!audio.played.includes(sound)) {
      new Audio('/audio/'+ sound+ '.wav').play();
      audio.played[audio.played.length]= sound;
    }
  },
}
