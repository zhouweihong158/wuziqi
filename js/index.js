window.onload = function () {

	var
  canvas = document.querySelector('#canvas'),
  ctx = canvas.getContext('2d'),

  //棋盘大小
  ROW = 15,

  //所有的落子数据
  qizi = {},

  //代表空白的字典
  kongbai = {};

  var  drawData_phone = {
    perWidth:22,
    padding:6.5,
    lineEnd:314,
    starpos:[ 3 * 22 + 6.5 , 11 * 22 + 6.5 ],
    start_r:2,
    piece_r:9,
    canvasWidth:320
  };

  var drawData_desktop = {
    perWidth:40,
    padding:20.5,
    lineEnd:580,
    starpos:[ 3 * 40 + 20.5 , 11 * 40 + 20.5 ],
    start_r:3,
    piece_r:18,
    canvasWidth:600
  }

  if ( document.documentElement.clientWidth > 768 ) {
    var draw = drawData_desktop;
  }else{
    draw = drawData_phone;
  }

  // 画布大小适应两种屏幕
  canvas.width =  canvas.height = draw.canvasWidth;

  // 一开始所有的位置都是空白
  var initblank = function () {
    for (var i = 0; i < ROW; i++) {
      for (var j = 0; j < ROW; j++) {
        kongbai[ i + '-' + j ] = true;
      }
    }
  }

  var  handle = function( e ) {
    e.preventDefault();
    var x =  Math.round( (e.position.x - canvas.offsetLeft - draw.padding)/draw.perWidth );
    var y =  Math.round( (e.position.y - canvas.offsetTop - draw.padding)/draw.perWidth );

    if( qizi[x+'-'+y] ){return;}
    luozi(x,y,'black');
    qizi[ x + '-' + y ] = 'black';
    delete kongbai[ x + '-' + y ];

    if( panduan(x,y,'black') >= 5 ){
      alert('黑棋赢'); init();
      return;
    }

    var pos = ai();
    luozi(pos.x,pos.y,'white');
    qizi[ pos.x + '-' + pos.y ] = 'white';
    delete kongbai[ pos.x + '-' + pos.y ];
    if( panduan(Number(pos.x),Number(pos.y),'white') >= 5 ){
      alert('白棋赢'); init();
      return;
    };
  }

  var init = function() {
    ctx.clearRect(0,0,draw.canvasWidth,draw.canvasWidth);
    for(var i = 0; i < ROW; i++){
      ctx.strokeStyle = '#777';
      ctx.beginPath();
      ctx.moveTo( draw.padding, i * draw.perWidth + draw.padding);
      ctx.lineTo( draw.lineEnd, i * draw.perWidth + draw.padding);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i * draw.perWidth + draw.padding, draw.padding);
      ctx.lineTo(i * draw.perWidth + draw.padding, draw.lineEnd);
      ctx.stroke();
    }
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(draw.canvasWidth/2+0.5,draw.canvasWidth/2+0.5,draw.start_r,0,Math.PI*2);
    ctx.fill();
    for(var i = 0; i < draw.starpos.length; i++){
      for(var j = 0; j < draw.starpos.length; j++){
        ctx.beginPath();
        ctx.arc(draw.starpos[i],draw.starpos[j],draw.start_r,0,Math.PI*2);
        ctx.fill();
      }
    }
    qizi = {};
    initblank();
  }

  init();
  touch.on(canvas,'tap',handle);


  var luozi = function (x,y,color) {
    var zx = draw.perWidth * x + draw.padding;
    var zy = draw.perWidth * y + draw.padding;
    ctx.fillStyle = ( color == 'black') ?'black':'white';
    ctx.beginPath();
    ctx.arc(zx,zy,draw.piece_r,0,Math.PI*2);
    ctx.fill();
  }



  var ai = function () {
    var max = -1000000; var xx = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = panduan(Number(pos.split('-')[0]),Number(pos.split('-')[1]),'black');
      if( x > max ){
        max = x;
        xx.x = pos.split('-')[0];
        xx.y = pos.split('-')[1];
      }
    }

    var max2 = -1000000; var yy = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = panduan(Number(pos.split('-')[0]),Number(pos.split('-')[1]),'white');
      if( x > max2 ){
        max2 = x;
        yy.x = pos.split('-')[0];
        yy.y = pos.split('-')[1];
      }
    }
    if( max2 >= max){
      return yy;
    }
    return xx;
  }

  var xy2id = function(x,y) {
    return x + '-' + y;
  }

  var filter = function(color) {
    var r = {};
    for(var i in qizi){
      if(qizi[i]  == color){
        r[i] = qizi[i];
      }
    }
    return r;
  }

  var panduan = function(x,y,color) {
    var shuju = filter(color);
    var tx,ty,hang = 1;shu = 1; zuoxie= 1;youxie = 1;
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty ) ]){tx--;hang++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty ) ]){tx++;hang++};
    tx=x;ty=y;while( shuju[ xy2id( tx,ty-1 ) ]){ty--;shu++};
    tx=x;ty=y;while( shuju[ xy2id( tx,ty+1 ) ]){ty++;shu++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty-1 ) ]){tx++;ty--;zuoxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty+1 ) ]){tx--;ty++;zuoxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty-1 ) ]){tx--;ty--;youxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty+1 ) ]){tx++;ty++;youxie++};
    return Math.max(hang,shu,zuoxie,youxie);
  }

}
