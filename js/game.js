var raster_sub = new Raster('rose');
var raster_torpedo = new Raster('homme');
var raster_oiseau = new Raster('oiseau');
var raster_poisson = new Raster('poisson');
var raster_powerup= new Raster('powerup');
var raster_explo1= new Raster('explo1');
var raster_licorne= new Raster('licorne');

var status = 0;
var Level = 1;
var lastShot = 0;

raster_sub.scale(0.3);
raster_torpedo.scale(0.2);
raster_oiseau.scale(0.2);
raster_poisson.scale(0.2);
raster_explo1.scale(0.5);
raster_powerup.scale(0.3);
raster_licorne.scale(0.7);

raster_torpedo.visible = false;
raster_oiseau.visible = false;
raster_poisson.visible = false;
raster_explo1.visible = false;
raster_powerup.visible = false;
raster_licorne.visible = false;
raster_sub.visible = false;

raster_oiseau.name = "mouette";

var torpedos = new Array();
var targets = new Array();
var explosions = new Array();

var Score = 0;
var Timer = 0;


var powerActive = false;
var lastPowerUp = 0;
var coolDown = 5;
var unicornMode = 0;

var shotOrder = false;

var nbrExplosion=0;
var firstPlay = true;			

var sousmarin_sound = new Howl({  urls: ['sound/sous_marin.mp3', 'sound/sous_marin.ogg']});
var game_over = new Howl({  urls: ['sound/game_over.mp3', 'sound/game_over.ogg']});
var sound = new Howl({  urls: ['sound/sounds.mp3', 'sound/sounds.ogg'],  sprite: {    
									start: [39, 1262-39],  
									bloub1: [1384, 1833-1384], 
									bloub2: [1840, 2572-1840],  
									bloub3: [2620, 3176-2620], 
									torpedo1: [3234, 3456-3234],  
									torpedo2: [3533, 3795-3234], 
									torpedo3: [3795, 4147-3795],  
									torpedo4: [3795, 4337-3795], 
									explo1: [4375, 5299-4375],  
									explo2: [5415, 6030-5415], 
									explo3: [6113, 6791-6113],  
									explo4: [6786, 7128-6786], 
									unicorn: [7176, 9569-7176],  
									mouette1: [9788, 10416-9788], 
									mouette2: [10482, 11232-10482],  
									mouette3: [11307, 12162-11307],
									sonar: [12256, 975] 
									}});// shoot the laser!sound.play('laser');

raster_sub.position = view.center - new Point(300,0);

var mousePos = view.center;


var gameText = new PointText({
	point: (view.center),
	justification: 'center',
	fontSize: 60,
	fillColor: 'black'
});


var scoreText = new PointText({
	point: (view.center - new Point(0,(view.size.height / 2) - 25 )),
	justification: 'center',
	fontSize: 35,
	fillColor: 'black'
});
scoreText.content = "Score";

var score = new PointText({
	point: (view.center - new Point(0,(view.size.height / 2) - 60 )),
	justification: 'center',
	fontSize: 30,
	fillColor: 'black'
});


var timerText = new PointText({
	point: (view.center - new Point(-200,(view.size.height / 2) - 25 )),
	justification: 'center',
	fontSize: 35,
	fillColor: 'black'
});
timerText.content = "Temps";

var timer = new PointText({
	point: (view.center - new Point(-200,(view.size.height / 2) - 60 )),
	justification: 'center',
	fontSize: 30,
	fillColor: 'black'
});


var levelText = new PointText({
	point: (view.center - new Point(200,(view.size.height / 2) - 25 )),
	justification: 'center',
	fontSize: 35,
	fillColor: 'black'
});
levelText.content = "Niveau";

var level = new PointText({
	point: (view.center - new Point(200,(view.size.height / 2) - 60 )),
	justification: 'center',
	fontSize: 30,
	fillColor: 'black'
});





function init() {

		firstPlay = true;			

		gameText.visible = true;
		gameText.content = "Cliquez pour jouer !"
		sound.play('start');
	
		gameText.visible = false;

		Timer = 0;

		Score = 0;
		Level = 1;
		lastShot = 0;
		
		powerActive = false;
    lastPowerUp = 0;
		coolDown = 5;
		
		unicornMode = 0;
		
		shotOrder = false;
		nbrExplosion = 0;
	
		for (var i = 0; i < torpedos.length; i++) {
			torpedos[i].visible = false;
			torpedos[i].delete;
		}
		
		for (var i = 0; i < targets.length; i++) {
			targets[i].sprite.visible = false;
			targets[i].delete;
		}
		
		for (var i = 0; i < explosions.length; i++) {
			explosions[i].sprite.visible = false;
			explosions[i].delete;
		}


	torpedos = new Array();
	targets = new Array();
	explosions = new Array();
	raster_sub.visible = true;
	raster_licorne.visible = false;
	raster_powerup.visible = false;
	raster_sub.position = view.center - new Point(300,0);
}

function onMouseMove(event) {
	mousePos = event.point;
}

function onMouseUp(event) {
	shotOrder = false;
}

function alea(n) {

	var t = Math.random();
	t = t*n+1;
	return Math.floor(t);
	
}


function onMouseDown(event) {
	if (status == 1) { 
		shotOrder = true;
		
	} else if ( status == 3 || status == 0){
		init();
		status = 1;
	}

}

function hitTest() {
	if (raster_powerup.visible == true) {
		var hit = raster_powerup.hitTest(raster_sub.position);
		if (hit != null) {
			sound.play('unicorn');

			unicornMode = 11500;
			raster_powerup.visible = false;
			raster_licorne.position = raster_sub;
			raster_sub.visible = false;
			raster_licorne.visible = true;
		}
	}


	for (var i = 0; i < targets.length; i++) {
		for (var j = 0; j < torpedos.length; j++) {
			if (targets[i] != null && torpedos[j] != null) {
				var torpedo = torpedos[j];
				var hit = targets[i].sprite.hitTest(torpedo.position);
				if (hit != null) {
					var explosion = raster_explo1.clone();	
					explosion.position = targets[i].sprite.position;
					explosion.visible = true;
					explosion.rotate((Math.random()-0.5)*100);
					explosions.push( { sprite:explosion, life:500 } ); 
					if (targets[i].type == 'oiseau'){
						var n = alea(3);
						var s = 'mouette' + n;
						sound.play(s);

					} else {
						var n = alea(4);
						var s = 'explo' + n;
						sound.play(s);
					}
					Score += 100;
					targets[i].sprite.visible = false;
					torpedos[j].visible = false;
					targets.splice(i,1);
					torpedos.splice(j,1);
					i--;
					j--;
				}
			}
		}
		
		// Death test
		if (targets[i] != null) {
			var hit = targets[i].sprite.hitTest(raster_sub.position);
			if (hit != null) {
				var explosion = raster_explo1.clone();	
				explosion.position = raster_sub.position;
				explosion.visible = true;
				explosion.rotate((Math.random()-0.5)*100);
				explosions.push( { sprite:explosion, life:300 } ); 
						var n = alea(4);
						var s = 'explo' + n;
						sound.play(s);
				targets[i].sprite.visible = false;
				raster_sub.visible = false;
				targets.splice(i,1);
				i--;
				if (unicornMode == 0) {
				status = 2;
				}
			}
		}
		
	}
}


function powerup() {

	if ( (powerActive == false) && (Timer - lastPowerUp) > coolDown) {
		if (Math.random() > 0.97) {
			coolDown = 30;
			lastPowerUp = Timer;
			raster_powerup.position = new Point( (view.size.width+200), (100+Math.random()*(view.size.height-200)));
			raster_powerup.visible = true;
		}
	}
}

function newTarget() {
	var difficulty = (Timer*0.001)-(Level*0.01);
	if (difficulty >= 0.99) { 
		difficulty = 0.99;
	}
	if (Math.random() > (0.99-difficulty)) {
		var newspeed = (200 + Timer*0.001 + Level*10)*(Math.random()+0.5);
		if (Math.random() > 0.50) {
			var target = raster_poisson.clone();
			var newtype = 'poisson';
		} else {
			var target = raster_oiseau.clone();
			var newtype = 'oiseau';
		}
		var pos = new Point( (view.size.width+200), (100+Math.random()*(view.size.height-200)));
		target.position = pos;
		target.visible = true;
		targets.push({ 
										sprite:target, 
										speed:newspeed,
										type:newtype
									});
	}
}

function leveling() {

	if (Score > 1000*Level) {
		Level += 1;
		sound.play('sonar');
	}

}

var rain = new Group();
var rainLen = 30;
var rainWidth = 10;
var rainStep = 10;
var colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];
for (var c=0; c<7; c++) {
	var path = new Path();
	for (var i=0; i<rainLen; i++) {
		path.strokeWidth = 10;
		path.strokeCap = 'round';
		path.strokeColor = colors[c];
		path.add( new Point(view.center.x-rainStep*i, view.center.y + (c-3)*rainWidth) );
	}
	rain.addChild(path);
}
rain.visible = false;

function rainbow(dt) {
	if (rain.visible == false) {
		rain.visible = true;
	}
	for (var c=0; c<rain.children.length; c++) {
		path = rain.children[c];
		for (var i=path.segments.length - 1; i > 0; i--) {
		
			path.segments[i].point = path.segments[i-1].point + new Point(-10,0);
		
		}

		path.firstSegment.point = raster_sub.position + new Point(-100-(c-3)*2, 0+(c-3)*rainWidth);
	}
}

function onFrame(event) {
	var dt = event.delta;
	Timer += dt;
	lastShot -= dt*1000;
	
	if (status == 1) {
		
		if (unicornMode > 0) {
			if (unicornMode <= 1000 && firstPlay == true) {
				sousmarin_sound.play();
				firstPlay = false;
			}
			rainbow();
			unicornMode -= dt*1000;
			raster_licorne.position = raster_sub.position;
			//raster_licorne.fillColor.hue += 1;
			if (unicornMode <= 0) {
				rain.visible = false;
				unicornMode = 0;
				raster_sub.visible = true;
				raster_licorne.visible = false;
				firstPlay = true;
			}
		} else {
			//raster_sub.rotate( 2*Math.sin(2*3.14*dt*1000) );
		}
	
		score.content = Math.round(Score);
		level.content = Level;
		timer.content = Math.round(Timer);
		
		raster_sub.position += (mousePos - raster_sub.position)*0.05;

		if (lastShot <= 0 && shotOrder == true && unicornMode < 10000) {
			if (unicornMode > 0) { 
				lastShot = 1000/(10+Level*0.01);
			}
			else {
				lastShot = 1000/(1+Level*0.01);
			}
			var n = alea(4);
			var s = 'torpedo' + n; 
			sound.play(s);
			var nbTorpedo = 1+2*(Math.floor(Level/2));
			if (unicornMode > 0) {
				nbTorpedo = 1;
			}			
			for (var k=0; k<nbTorpedo; k++) {
				var torpedo = raster_torpedo.clone();
				torpedo.position = raster_sub.position + new Point(150,10+(nbTorpedo/2-k)*50);
				torpedo.visible = true;
				torpedos.push( torpedo );
			}
			if (unicornMode == 0) {
				Score -= 20;
			}
		}
		
		for (var i = 0; i < explosions.length; i++) {
			explosions[i].life -= dt*1000;
			if (explosions[i].life <= 0) {
				explosions[i].sprite.visible = false;
				explosions.splice(i,1);
				i--;
			}
		}
		
		if (raster_powerup.visible == true) {
			raster_powerup.position -= new Point(100*dt,0);
			if (raster_powerup.position.x < 0	) {
				raster_powerup.visible = false;
			}
		}
		
		for (var i = 0; i < torpedos.length; i++) {
			torpedos[i].position += new Point(300*dt,0);
			if (torpedos[i].position.x > view.size.width) {
				var n = alea(3);
				var s = 'bloub' + n; 
				sound.play(s);
				torpedos[i].visible = false;
				torpedos.splice(i,1);
				i--;
			}
		}
		
		for (var i = 0; i < targets.length; i++) {
			targets[i].sprite.position -= new Point(targets[i].speed*dt,0);
			if (targets[i].sprite.position.x < 0) {
				targets[i].sprite.visible = false;
				targets.splice(i,1);
				i--;
				if (unicornMode == 0) {
					Score -= 20;
				} else {
					Score -= 100;
				}
		
			}
		}
		
		newTarget();
		hitTest();
		leveling();
		powerup();
	} else if (status == 2) {
		for (var i = 0; i < explosions.length; i++) {
			explosions[i].life -= dt*1000;
			if (explosions[i].life <= 0) {
				nbrExplosion++;
				if (nbrExplosion < 10) {
				var explosion = raster_explo1.clone();	
				explosion.position = raster_sub.position + new Point((Math.random()-0.5)*30, (Math.random()-0.5)*30);
				explosion.visible = true;
				explosion.rotate((Math.random()-0.5)*100);
						var n = alea(4);
						var s = 'explo' + n;
						sound.play(s);
				explosions[i].sprite.visible = false;
				explosions.splice(i,1);
				i--;
				explosions.push( { sprite:explosion, life:(300-(nbrExplosion*25)) } ); 
				} else {
					status = 3;
						gameText.visible = true;
						gameText.content = "Game Over !!!  Click to restart !";
						game_over.play();
				}
			}
		}
	}
}