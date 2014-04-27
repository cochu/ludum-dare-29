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

var sound = new Howl({  urls: ['sound/sounds.wav'],  sprite: {    blast: [0, 800]  }});// shoot the laser!sound.play('laser');

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


	gameText.visible = true;
	gameText.content = "Cliquez pour jouer !"


function init() {
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

function onMouseDown(event) {
	if (status ==1) { 
		shotOrder = true;
		
	} else {
		init();
		status = 1;
	}

}

function hitTest() {
	if (raster_powerup.visible == true) {
		var hit = raster_powerup.hitTest(raster_sub.position);
		if (hit != null) {
			unicornMode = 10000;
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
					sound.play('blast');
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
		if (targets[i] != null && unicornMode == 0) {
			var hit = targets[i].sprite.hitTest(raster_sub.position);
			if (hit != null) {
				targets[i].sprite.visible = false;
				raster_sub.visible = false;
				targets.splice(i,1);
				i--;
				status = 2;
			}
		}
		
	}
}


function powerup() {

	if ( (powerActive == false) && (Timer - lastPowerUp) > coolDown) {
		if (Math.random() > 0.90) {
			coolDown = 20;
			lastPowerUp = Timer;
			raster_powerup.position = new Point( (view.size.width+200), (100+Math.random()*(view.size.height-200)));
			raster_powerup.visible = true;
		}
	}
}

function newTarget() {
	if (Math.random() > 0.99-(Timer*0.001)) {
		var newspeed = (200 + Timer*0.001 + Level*10)*(Math.random()+0.5);
		console.log(newspeed);
		if (Math.random() > 0.59) {
			var target = raster_poisson.clone();
		} else {
			var target = raster_oiseau.clone();
		}
		var pos = new Point( (view.size.width+200), (100+Math.random()*(view.size.height-200)));
		target.position = pos;
		target.visible = true;
		targets.push({ 
										sprite:target, 
										speed:newspeed 
									});
	}
}

function leveling() {

	if (Score > 1000*Level) {
		Level += 1;
	}

}

function onFrame(event) {
	var dt = event.delta;
	Timer += dt;
	lastShot -= dt*1000;
	
	if (status == 1) {
		if (unicornMode > 0) {
			unicornMode -= dt*1000;
			raster_licorne.position = raster_sub.position;
			//raster_licorne.fillColor.hue += 1;
			if (unicornMode <= 0) {
				unicornMode = 0;
				raster_sub.visible = true;
				raster_licorne.visible = false;
			}
		} else {
			//raster_sub.rotate( 2*Math.sin(2*3.14*dt*1000) );
		}
	
		score.content = Math.round(Score);
		level.content = Level;
		timer.content = Math.round(Timer);
		
		raster_sub.position += (mousePos - raster_sub.position)*0.05;

		if (lastShot <= 0 && shotOrder == true) {
			if (unicornMode > 0) {
				lastShot = 1000/(10+Level*0.5);
			}
			else {
				lastShot = 1000/(1+Level*0.5);
			}
			var torpedo = raster_torpedo.clone();
			torpedo.position = raster_sub.position + new Point(150,10);
			torpedo.visible = true;
			torpedos.push( torpedo );
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
	}
}