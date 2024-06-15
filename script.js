var gameCamera = {
  x: 0,
  y: 0
}

var player = {
  x: 0,
  y: 0,
  xVel: 0,
  yVel: 0,
  onGround: false,
  active: false
}

//we love tests

var drag = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  down: null
}

var mouse = {
  l: false,
  m: false,
  r: false
}

const buildMenu = {
  open: false,
  tab: 0,
  selection: 0,
  dampen: 1,
  lerp: 0
};

var buildSolid = true;

var cruh = "cruh";

var placingPlayer = false;
var playerSize = 0.85;
var halfSize = playerSize/2;

var tileSize = 32; // in px

var lineAlpha = 0;

var clr;

var gameFPS = 0;

var displayMode = false;

var cnv;
var tiles = [];
var images = [];

var stars = [];

function preload() {

  // any images are added to the build menu automatically for conviencence. Frankly, I don't know why you wouldn't want that besides for like the star or smthn
  let imageList = ["grass_top","grassside1","grassside2","grassy","bush","dirt","dirt_back","grass","stone","star","wall1","windowwall1","doorwall1","roof1","roof2","roof3"] // remember to add it here

  // loop through each image file
  for (let i = 0; i < imageList.length; i++) {
    // load the image and add it to the images array (i think it might be brokey)
    let imagePath = 'assets/textures/' + imageList[i] + '.png';
    let img = loadImage(imagePath);
    console.log(imagePath)
    images.push({name:imageList[i],image:img});
  }
}

function setup() {

  console.log(cruh); // very important
  
  for(let i = 0; i < 100; i++){
    stars.push(new Star(random(-100,innerWidth+100),random(-100,innerHeight+100)));
  }
  //setAttributes('antialias', false);
  cnv = createCanvas(300, 300);
  cnv.position(0, 0);
  noSmooth();
}

function draw() {
  if(deltaTime > 60){
    deltaTime = 60;
  }
  gameFPS++;
  setTimeout(removeFPS, 1000);
  frameRate(9999999);
  resizeCanvas(window.innerWidth, window.innerHeight);
  background(20);
  fill(255);

  if(displayMode){
    for(let i = 0; i < stars.length; i++){
      image(getImage("star"), stars[i].x-gameCamera.x*4, stars[i].y-gameCamera.y*4, 10, 10);
    }
  }
  //rect(0 - gameCamera.x, 0 - gameCamera.y, tileSize, tileSize);

  if(tileSize >= 50){
    if(player.active){
      lineAlpha = lerp(lineAlpha, 30, deltaTime*0.005);
    } else {
      lineAlpha = lerp(lineAlpha, 255, deltaTime*0.005);
    }
  } else {
    lineAlpha = lerp(lineAlpha, 0, deltaTime*0.005);
  }
  
  for (let t = 0; t < tiles.length; t++) {
    tiles[t].render();
  }
  
  if(lineAlpha > 1){
    strokeWeight(tileSize/32);
    clr = color(255);
    clr.setAlpha(lineAlpha);
    stroke(clr);
    for(let i = Math.floor(ScreenToGame("x", 0)); i < Math.floor(ScreenToGame("x", window.innerWidth))+1; i++){
      line(GameToScreen("x", i),0,GameToScreen("x", i),window.innerHeight);
    }
    for(let i = Math.floor(ScreenToGame("y", 0)); i < Math.floor(ScreenToGame("y", window.innerHeight))+1; i++){
      line(0,GameToScreen("y", i),window.innerWidth,GameToScreen("y", i));
    }
  }

  if (mouse.m) {
    gameCamera.x -= (movedX / tileSize)*2; // x2 for s p e e d
    gameCamera.y -= (movedY / tileSize)*2;
  }

  if(drag.down === "l"){
    clr = color(0, 255, 0);
    clr.setAlpha(100);
    fill(clr);
    // THIS IS THE GROSSEST LINE OF CODE I HAVE EVER WRITTEN SORRY
    rect(GameToScreen("x", Math.min(drag.x1, Math.floor(ScreenToGame("x", mouseX)))), GameToScreen("y", Math.min(drag.y1, Math.floor(ScreenToGame("y", mouseY)))), ((Math.max(drag.x1, Math.floor(ScreenToGame("x", mouseX))) - Math.min(drag.x1, Math.floor(ScreenToGame("x", mouseX))))+1)*tileSize, ((Math.max(drag.y1, Math.floor(ScreenToGame("y", mouseY))) - Math.min(drag.y1, Math.floor(ScreenToGame("y", mouseY))))+1)*tileSize);
  }

  if(drag.down === "r"){
    clr = color(255, 0, 0);
    clr.setAlpha(100);
    fill(clr);
    // OH GOD OH FUCK NOT AGAIN
    rect(GameToScreen("x", Math.min(drag.x1, Math.floor(ScreenToGame("x", mouseX)))), GameToScreen("y", Math.min(drag.y1, Math.floor(ScreenToGame("y", mouseY)))), ((Math.max(drag.x1, Math.floor(ScreenToGame("x", mouseX))) - Math.min(drag.x1, Math.floor(ScreenToGame("x", mouseX))))+1)*tileSize, ((Math.max(drag.y1, Math.floor(ScreenToGame("y", mouseY))) - Math.min(drag.y1, Math.floor(ScreenToGame("y", mouseY))))+1)*tileSize);
  }

  noStroke();
  if(player.active){
    if(keyIsDown(65) || keyIsDown(37)){
      player.xVel -= deltaTime*0.0001;
    }
    if(keyIsDown(68) || keyIsDown(39)){
      player.xVel += deltaTime*0.0001;
    }
    if(keyIsDown(90) || keyIsDown(32)){
      if(player.onGround){
        player.yVel -= 0.018;
        player.onGround = false;
      }
    }
    player.yVel += 0.00005*deltaTime;

    player.xVel = lerp(player.xVel, 0, 0.01*deltaTime);

    player.onGround = false;
    for(let t = 0; t < tiles.length; t++){
      if(tiles[t].s){
        tiles[t].collide();
      }
    }

    player.x += player.xVel * deltaTime;
    player.y += player.yVel * deltaTime;

    fill(255, 80, 80);
    rect(GameToScreen("x", player.x-halfSize), GameToScreen("y", player.y-halfSize), playerSize*tileSize, playerSize*tileSize);
  }

  if(placingPlayer){
    clr = color(255, 80, 80);
    clr.setAlpha(100);
    fill(clr);
    rect(mouseX-(halfSize*tileSize), mouseY-(halfSize*tileSize), playerSize*tileSize, playerSize*tileSize);
  }

  buildMenu.lerp = lerp(buildMenu.lerp,buildMenu.selection,Math.min(deltaTime*0.02,1));
  
  displayHud();
}

//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
// BOTTOM OF DRAW ^^^

function removeFPS(){
  gameFPS--;
}

function GameToScreen(axis, pos) {
  if (axis === "x") {
    return (pos - gameCamera.x) * tileSize + (window.innerWidth / 2);
  }
  if (axis === "y") {
    return (pos - gameCamera.y) * tileSize + (window.innerHeight / 2);
  }
}

function ScreenToGame(axis, pos) {
  if (axis === "x") {
    return (pos - window.innerWidth / 2) / tileSize + gameCamera.x;
  }
  if (axis === "y") {
    return (pos - window.innerHeight / 2) / tileSize + gameCamera.y;
  }
}

document.addEventListener("mousedown", function(event) {
  if (event.button === 0) { // Left mouse button
    mouse.l = true;
    if(drag.down === null && !placingPlayer){
      drag.down = "l";
      drag.x1 = Math.floor(ScreenToGame("x", mouseX));
      drag.y1 = Math.floor(ScreenToGame("y", mouseY));
    }
    if(drag.down === "r"){
      drag.down = null;
    }
  }
  if (event.button === 1) { // Middle mouse button
    mouse.m = true;
    event.preventDefault();
  }
  if (event.button === 2) { // Right mouse button
    mouse.r = true;
    if(drag.down === null && !placingPlayer){
      drag.down = "r";
      drag.x1 = Math.floor(ScreenToGame("x", mouseX));
      drag.y1 = Math.floor(ScreenToGame("y", mouseY));
    }
    if(drag.down === "l"){
      drag.down = null;
    }
    event.preventDefault();
  }
});

document.addEventListener("mouseup", function(event) {
  if (event.button === 0) { // Left mouse button
    mouse.l = false;
    if(drag.down === "l" && !placingPlayer){
      drag.down = null;
      drag.x2 = Math.floor(ScreenToGame("x", mouseX));
      drag.y2 = Math.floor(ScreenToGame("y", mouseY));
      placeBlocks();
    }
    if(placingPlayer){
      placingPlayer = false;
      player.x = ScreenToGame("x", mouseX);
      player.y = ScreenToGame("y", mouseY);
      player.xVel = 0;
      player.yVel = 0;
      player.onGround = false;
      player.active = true;
    }
  }
  if (event.button === 1) { // Middle mouse button
    mouse.m = false;
  }
  if (event.button === 2) { // Right mouse button
    mouse.r = false;
    if(drag.down === "r" && !placingPlayer){
      drag.down = null;
      drag.x2 = Math.floor(ScreenToGame("x", mouseX));
      drag.y2 = Math.floor(ScreenToGame("y", mouseY));
      removeBlocks();
    }
  }
});

function placeBlocks(){
  for(let x = Math.min(drag.x1, drag.x2); x < Math.max(drag.x1, drag.x2)+1; x++){
    for(let y = Math.min(drag.y1, drag.y2); y < Math.max(drag.y1, drag.y2)+1; y++){
      for(let b = tiles.length - 1; b >= 0; b--){
        if(tiles[b].x === x && tiles[b].y === y){
          tiles.splice(b, 1);
        }
      }
      tiles.push(new Tile(x, y, images[buildMenu.selection].name, buildSolid));
    }
  }
}

function removeBlocks(){
  for(let x = Math.min(drag.x1, drag.x2); x < Math.max(drag.x1, drag.x2)+1; x++){
    for(let y = Math.min(drag.y1, drag.y2); y < Math.max(drag.y1, drag.y2)+1; y++){
      for(let b = tiles.length - 1; b >= 0; b--){
        if(tiles[b].x === x && tiles[b].y === y){
          tiles.splice(b, 1);
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function keyPressed(){
  if(buildMenu.open){
    if(keyCode === 38){
      buildMenu.selection -= 1;
    }
    if(keyCode === 40){
      buildMenu.selection += 1;
    }
  }
  if(keyCode == 80){ // p
    exportMap();
  }
  if(keyCode == 81){ // q
    buildMenu.open = !buildMenu.open;
  }
  if(keyCode == 70){ //f
    buildSolid = !buildSolid;
  }
  if(keyCode === 84){
    displayMode = !displayMode;
  }
  if(keyCode === 192){
    if(player.active){
      player.active = false;
    } else {
      placingPlayer = true;
      drag = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        down: null
      }
    }
  }
}
  
function mouseWheel(event) {
  if(buildMenu.open){
    buildMenu.selection += Math.sign(event.delta);
  }

  if(!buildMenu.open){
    buildMenu.tab = 0;
    
    if(tileSize > 10 && event.delta > 0 || tileSize < 1000 && event.delta < 0){
      let bruhX = (mouseX - (window.innerWidth / 2)) / tileSize;
      let bruhY = (mouseY - (window.innerHeight / 2)) / tileSize;
      gameCamera.x -= bruhX;
      gameCamera.y -= bruhY;
      bruhX /= tileSize;
      bruhY /= tileSize;
      tileSize *= (1-(event.delta/1000));
      bruhX *= tileSize;
      bruhY *= tileSize;
      gameCamera.x += bruhX;
      gameCamera.y += bruhY;
    }
    
  }
  
}

function displayHud(){
  noStroke();
  fill(150);
  rect(0, window.innerHeight-100, window.innerWidth, 100);
  fill(200);
  rect(0, window.innerHeight-100, 300, 100);
  fill(0);
  textSize(16);
  text(`Mouse position: ${Math.floor(ScreenToGame("x", mouseX))}, ${Math.floor(ScreenToGame("y", mouseY))}`, 10, window.innerHeight-80);
  text(`Tile size: ${Math.round(tileSize*10)/10}`, 10, window.innerHeight-60);
  text(`FPS: ${gameFPS}`, 10, window.innerHeight-40);
  if(displayMode){
    text(`(T to toggle) Display Mode: image()`, 10, window.innerHeight-20);
  } else {
    text(`(T to toggle) Display Mode: fill()`, 10, window.innerHeight-20);
  }
  text(`(F to toggle) Build Solid: ${buildSolid}`, 10, window.innerHeight-5);

  if(buildMenu.open){
    buildMenu.dampen = lerp(buildMenu.dampen,0,0.01*deltaTime);
  } else {
    buildMenu.dampen = lerp(buildMenu.dampen,1,0.01*deltaTime);
  }

  if(buildSolid){
    fill(255)
  } else {
    fill(150)
  }
  rect(mouseX,mouseY,10,-10)

  if(buildMenu.dampen < 0.98){
    translate(-(buildMenu.dampen)*320,0);
    noStroke();
    clr = color(50,50,50,200);
    fill(clr);
    rect(0,0,300,window.innerHeight);
    translate(0,innerHeight/3)
    for(let i = 0; i < images.length; i++){
      translate(0,-buildMenu.lerp*50)
      fill(clr);
      if(buildMenu.selection == i){
        fill(100,200,100)
      }
      rect(5,5+i*50,290,40);
      fill(255)
      text(images[i].name, 15, 25+i*50)
      image(getImage(images[i].name), 250, 10+i*50, 30, 30);
      translate(0,buildMenu.lerp*50)
    }
    translate(0,-((height/2)-300))
    translate(buildMenu.dampen*320, -((height/2)-300));
  }
}

function getImage(name){
  for(let i = 0; i < images.length; i++){
    if(name === images[i].name){
      return images[i].image;
    }
  }
}

function toggleBuildMenu(){
  buildMenu.open = !buildMenu.open;
}


//still no worky
function exportMap() { // USE WITH CAUTION, IRRECOVERABLE AS OF NOW!!!
  // Create a new array to store the compressed blocks
  let compressedTiles = [];

  // Iterate through each tile in the tiles array
  for(let i = 0; i < tiles.length; i++) {
    // Get the current tile
    let currentTile = tiles[i];
    let merged = false;

    // Iterate through the compressed tiles array to check for merging
    for(let j = 0; j < compressedTiles.length; j++) {
      // Get the current compressed tile
      let compressedTile = compressedTiles[j];

      // Check if the tiles have the same dx and dy values
      if(currentTile.name === compressedTile.name && currentTile.y === compressedTile.y) {
        //if(compressedTile.x > currentTile.x + currentTile.dx && compressedTile.x < currentTile.x + currentTile.dx){ doesnt work for tiles seperated from eachother yet
          // Update dx and dy of the compressed tile
          compressedTile.dx += currentTile.dx;
          merged = true;
          break;
        //}
      }
    }

    // If the current tile was not merged with any existing compressed tile, add it as a new compressed tile
    if(!merged) {
      compressedTiles.push(currentTile);
    }
  }

  // Output the compressed tiles
  console.log("Compressed Tiles:");
  console.log(compressedTiles);
  tiles = compressedTiles;
}