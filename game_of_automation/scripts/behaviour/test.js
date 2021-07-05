function test() {
  for(var i= 0; i< b.map.length; i++) {
    for(var j= 0; j< b.map[i].length; j++) {
      
      if(b.target.includes(b.map[i][j])) {
        m.test= false;
        continue;
      }
    }
  }
}
