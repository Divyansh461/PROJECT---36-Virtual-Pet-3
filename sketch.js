//Create variables here
var dogimg,happydogimg;
var dog;
var database;
var foods,foodstock;
var fedtime,lastfed;
var feed,addfoods;
var foodObj;
var bedimg,gardenimg,washroomimg;
var readstate;



function preload()
{
	//load images here
  dogimg = loadImage("images/dogImg.png");
  happydogimg = loadImage("images/dogImg1.png");

  bedimg = loadImage("virtual pet images/Bed Room.png");
  gardenimg = loadImage("virtual pet images/Garden.png");
  washroomimg = loadImage("virtual pet images/Wash Room.png");
 
}

function setup() {
  database = firebase.database();
	createCanvas(1000,600);
foodObj = new Food();


  dog = createSprite(800,400,20,20);
  dog.addImage(dogimg);
  dog.scale = 0.3;

  database = firebase.database();
  var foodstock = database.ref("Food");
  foodstock.on("value",readstock);

  feed = createButton("Feed the dog");
  feed.position(750,100);
  feed.mousePressed(feeddog);

  addfood = createButton("Add Food");
  addfood.position(850,100);
  addfood.mousePressed(addfoods);

  //read gamestate from database
  readstate = database.ref('gameState');
  readstate.on("value",function(data) {
    gamestate = data.val();
  })

}


function draw() {  

background(46,139,87);
foodObj.display();

fedtime = database.ref('feedtime');
fedtime.on("value",function(data) {
  lastfed = data.val();
} );

textSize(20);
 fill("white");
 stroke(4);
 if(lastfed >= 12) {
   text("LastFed : " + lastfed % 12 + "PM ",600,30);
 } else if(lastfed == 0) {
   text("LastFed : 12 AM",600,30);
 } else {
   text("LastFed : " + lastfed + "AM",600,50);
 }

 
 
 currenttime = hour();
 if(currenttime == (lastfed + 0.1)) {
   update("Playing");
   foodObj.garden();

 } else if (currenttime == (lastfed + 2)) {
   update("Sleeping");
   foodObj.bedroom();
 
  } else if (currenttime > (lastfed + 2) && currenttime < (lastfed + 4)) {
    update("Bathing");
    foodObj.washroom();
  
  } else{
    update("hungry");
    foodObj.display();
  }
 
  if(gamestate != "hungry") {
    feed.hide();
    addfood.hide();
    dog.remove();
  } else{
    feed.show();
    addfood.show();
    dog.addImage(dogimg);
  }
 
 drawSprites();
}  

 
//function to update gamestates in database
function update(state) {
  database.ref('/').update({
    gameState : state,
  })
}

//function to read values from the database
function readstock(data) {
  foods = data.val();
  foodObj.updatefoodstock(foods);

}

//function to update food stock and lastfed time
function feeddog(x) {

dog.addImage(happydogimg);
var foodstockval = foodObj.getfoodstock();
if(foodstockval <= 0) {
  foodObj.updatefoodstock(foodstockval*0);
} else {
  foodObj.updatefoodstock(foodstockval - 1);
}

  database.ref('/').update({
    Food:foodObj.getfoodstock(),
    feedtime : hour(),


  })

}

//function to add food in stock
function addfoods() {
foods++;
database.ref('/').update({
  Food : foods,
})
}








