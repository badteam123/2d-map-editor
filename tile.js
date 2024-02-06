class Tile {
  constructor(x,y,tex,s){
    this.x = x;
    this.y = y;
    this.dx = 1;
    this.dy = 1;
    this.tex = tex;
    this.s = s;
  }

  render(){
    noStroke();
    if(displayMode){
      image(getImage(this.tex),GameToScreen("x",this.x),GameToScreen("y",this.y),(this.dx*tileSize)+1,(this.dy*tileSize)+1);
    } else {
      if(this.s){
        fill(200);
      } else {
        fill(150)
      }
      rect(GameToScreen("x",this.x)-0.5,GameToScreen("y",this.y)-0.5, (this.dx*tileSize)+1, (this.dy*tileSize)+1);
    }
  }

  collide(){

    let inX = ((player.x + halfSize) > this.x) && ((player.x - halfSize) < this.x+1);
    let inY = ((player.y + halfSize) > this.y) && ((player.y - halfSize) < this.y+1);
    let inXNext = ((player.x + halfSize + (player.xVel*deltaTime)) > this.x) && ((player.x - halfSize + (player.xVel*deltaTime)) < this.x+1);
    let inYNext = ((player.y + halfSize + (player.yVel*deltaTime)) > this.y) && ((player.y - halfSize + (player.yVel*deltaTime)) < this.y+1);

    if(inY && !inX && inXNext){
      if(player.x < this.x){
        player.x = this.x-halfSize-0.0000001;
        player.xVel = 0;
      }
      if(player.x > this.x){
        player.x = this.x+1+halfSize+0.0000001;
        player.xVel = 0;
      }
    } else if(!inY && inX && inYNext){
      if(player.y < this.y){
        player.y = this.y-halfSize-0.0000001;
        player.yVel = 0;
        player.onGround = true;
      }
      if(player.y > this.y){
        player.y = this.y+1+halfSize+0.0000001;
        player.yVel = 0;
      }
    } else if(!inX && !inY && inXNext && inYNext){

      if(player.x < this.x && player.y < this.y){
        if(Math.abs(player.xVel) > Math.abs(player.yVel)){
          player.yVel = 0;
          player.y = this.y - halfSize-0.0000001;
        } else {
          player.xVel = 0;
          player.x = this.x - halfSize-0.0000001;
        }
      }

      if(player.x > this.x && player.y < this.y){
        if(Math.abs(player.xVel) > Math.abs(player.yVel)){
          player.yVel = 0;
          player.y = this.y - halfSize-0.0000001;
        } else {
          player.xVel = 0;
          player.x = this.x + 1 + halfSize+0.0000001;
        }
      }

      if(player.x < this.x && player.y > this.y){
        if(Math.abs(player.xVel) > Math.abs(player.yVel)){
          player.yVel = 0;
          player.y = this.y + 1 + halfSize+0.0000001;
        } else {
          player.xVel = 0;
          player.x = this.x - halfSize-0.0000001;
        }
      }

      if(player.x > this.x && player.y > this.y){
        if(Math.abs(player.xVel) > Math.abs(player.yVel)){
          player.yVel = 0;
          player.y = this.y + 1 + halfSize+0.0000001;
        } else {
          player.xVel = 0;
          player.x = this.x + 1 + halfSize+0.0000001;
        }
      }

    }

  }
}