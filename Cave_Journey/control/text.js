var words= new Object();
words.list= ' abcdefghijklmnopqrstuvwxyz0123456789.,:;!?+-*/|\\()\'\"=<>$%^~_';

var p= (text, x, y)=> {
  var t= text.toLowerCase();
  for(var i= 0; i< t.length; i++) {
    if(words.list.includes(t[i])) draw('words', (words.list.indexOf(t[i])+ 1)* 16, 0, 16, 16, i* 20+ x, y);
    else draw('words', 0, 0, 16, 16, i* 20+ x, y);
  }
}
