
let shotSound = new Audio;
shotSound.src = 'Assets/SFX/shot.wav';

let laughSound = new Audio;
laughSound.src = 'Assets/SFX/laugh.wav';

let barkSound = new Audio;
barkSound.src = 'Assets/SFX/bark.wav';

let catchSound = new Audio;
catchSound.src = 'Assets/SFX/catch.wav';

let introSound = new Audio;
introSound.src = 'Assets/SFX/Intro.mp3';

let fallSound = new Audio;
fallSound.src = 'Assets/SFX/Falls.mp3';

let landSound = new Audio;
landSound.src = 'Assets/SFX/Lands.mp3';

let clearSound = new Audio;
clearSound.src = 'Assets/SFX/Clear.mp3';

let flapSound = new Audio;
flapSound.src = 'Assets/SFX/flap.wav';

let quackSound = new Audio;
quackSound.src = 'Assets/SFX/krya.wav';

let music = new Audio;
music.src = 'Assets/SFX/DuckTalesTheme.mp3';
		

let score = 0;
let topScore = 0;
const duckPack = 10;
let duckLeft = duckPack;
let flyAwayTimeout;
let flyTimeout;
const duck = $('.duck');
const dogRun = $('.dogRun');
let shotsLeft = 3;
let angle = 0;

//create duck icons in footer
function createDuckBoxDiv(classname){
	let duckIconDiv = document.createElement('div');
	duckIconDiv.classList.add(classname);
	document.querySelector('.duckBox').append(duckIconDiv);	
}
for(let i=0; i < duckPack; i++){
	createDuckBoxDiv('duckStat');
}
createDuckBoxDiv('clear');

function gameOver(){
	$('.dogCatch').css({'display': 'none'});
	$('.introScreen').css('display','block');
	$('.gameScreen').css('display','none');
	$('.scores').css('display', 'block');

	$('.yourScore').text(`Your score = ${score}`);
	if (topScore < score) {topScore = score};
	$('.topScore').text(`Top score = ${topScore}`);
}

//keyPressed listener
let keyState = {leftKey: false, rightKey:false};
$('body').on('keydown', function (e) { 
	if (e.keyCode == 39) {keyState.rightKey = true;}
  	if (e.keyCode == 37) {keyState.leftKey = true;}
});
$('body').on('keyup', function (e) { 
	if (e.keyCode == 39) {keyState.rightKey = false;}
  	if (e.keyCode == 37) {keyState.leftKey = false;}
});

function flyControlled(an){
	const speed = 15;
	const deltaAngle = 4;

	//(X,Y) increments
	let deltaX = Math.sin((an)*Math.PI/180)*speed;
	let deltaY = - Math.cos((an)*Math.PI/180)*speed;
	duck.css({
		left:parseInt(duck.css('left')) + deltaX + 'px',
		top:parseInt(duck.css('top'))  + deltaY + 'px',
	});
	duck.position();

	//handle keyState to change angle
	if(keyState.leftKey){ angle -= deltaAngle;}
	if(keyState.rightKey){ angle += deltaAngle;}

	//checking for wall collisions 
	if (parseInt(duck.css('left')) < 0 || parseInt(duck.css('right')) < 0){
		angle=-angle;
		quackSound.play();
	}
	else if (parseInt(duck.css('top')) < 0 || parseInt(duck.css('top')) > 550){
		angle=180-angle;
		quackSound.play();
	}
	//angle range from -Pi to Pi
	if (angle > 180) { angle -= 360;}
	if (angle < -180) { angle += 360};
	
	duckTurn(angle);
	if (duck.hasClass('isKilled')){
		duck.css({'transition': 'left 2s linear, top 2s linear '});
		
	}	 	
	else {flyTimeout = setTimeout(flyControlled, 20, angle);}
	// console.log('angle=',an,'deltaX=',deltaX,'deltaY',deltaY);
	// console.log('x=',(duck.position().left), 'y=',(duck.position().top))
}


function duckTurn(angle){
		if (-22 < angle && angle <= 22){
			duck.css({
				'animation':'duckFlyAway .4s infinite step-end',
				'transform': `rotate(${angle}deg)`,
			})	
		}

		if (22 < angle && angle <= 68){
			duck.css({
				'animation':'duckFlyRightUp .4s infinite step-end',
				'transform': `rotate(${angle-45}deg)`,
			})	
		}

		else if (68 < angle && angle <= 112){
			duck.css({
				'animation':'duckFlyRight .4s infinite step-end',
				'transform': `rotate(${angle-90}deg)`,
			})
		}

		else if (112 < angle && angle <= 157.5){
			duck.css({
				'animation':'duckFlyRightUp .4s infinite step-end',
				'transform': `rotate(${angle-45}deg)`,
			})
		}

		if (157.5 < angle || angle <= -157.5){
			duck.css({
				'animation':'duckFlyAway .4s infinite step-end',
				'transform': `scale(-1,1) rotate(${-angle}deg)`,
			})	
		}

		else if (-157.5 < angle && angle <= -112){
			duck.css({
				'animation':'duckFlyRightUp .4s infinite step-end',
				'transform': `scale(-1,1) rotate(${-45-angle}deg)`,
			})	
		}

		else if (-112 < angle && angle <= -68){
			duck.css({
				'animation':'duckFlyRight .4s infinite step-end',
				'transform': `scale(-1,1) rotate(${-angle-90}deg)`,
			})
		}

		else if (-68 < angle && angle <= -22){
			duck.css({
				'animation':'duckFlyRightUp .4s infinite step-end',
				'transform': `scale(-1,1) rotate(${-angle-45}deg)`,
			})	
		}
}

//angle range from -Pi to Pi clockwise, zero axis -Y
function getAngle(prevPos, nextPos){
	let angle = Math.round(Math.atan((nextPos.left-prevPos.left)/(-nextPos.top+prevPos.top))*180/Math.PI);
	if (nextPos.top-prevPos.top > 0){
		if( nextPos.left-prevPos.left <= 0){angle-=180;}
		else angle +=180 ;
	}
	// console.log(angle);
	return angle;
}

$(document).ready(function() {
	$('.introScreen').on('click',function() {
		shotSound.currentTime = 0;
		shotSound.play();
	})

	let gameMode;

	$('button').on('click', function(ev){
		clearSound.pause();
		clearSound.currentTime = 0;
		$('.introScreen').css('display', 'none');
		$('.gameScreen').css('display', 'block');
		$(ev.target).hasClass('singleplayer') ? gameMode='singleplayer': gameMode='multiplayer';
		console.log('Game mode is',gameMode); 	

		newRound();

	})

	$('.gameScreen').on('click', function(){
		if (shotsLeft > 0) {
			shotSound.currentTime = 0;
			shotSound.play();
			shotsLeft--;
			$('.bullet').eq(shotsLeft).css('visibility','hidden');
		}
	});

	function newRound(){		
		duckLeft = duckPack;
		score = 0;
		introSound.play();
		console.log('New Round started!');
		$('.scoreBox').text(`Score:\n${score}`);
		$('.duckStat').css('background-color', 'black');

		dogRun.css({
			'left': '0px',
			'top': '550px',
			'display': 'block',
		})

		dogRun.position(); //flush dog css props 		
		
		dogRun.css({
			'left': 'calc(50% - 75px)',			
			'transition': 'all 5s ease-in-out .1s',			
			'animation': 'dogRun .5s 12 step-end 0s',
		});
		dogRun.position();
		dogRun.one('transitionend', function(){			
			dogRun.addClass('dogJumped');

			dogRun.css({			
				animation: 'dogJump 1s 1 step-end 0s',
				top: '450px',
				transition: 'all .5s cubic-bezier(0.33, 0.33, 0.3, 2.5) .5s',
			});
			$('.dogJumped').one('transitionend', function(){
				barkSound.play();
				dogRun.css({
					'display':'none',
					'transition':'none',
				});
				music.play();
				game();
				$('.dogJumped').off('transitionend');

			});
		})
	}		

	function game(){
		flyAwayTimeout = setTimeout(duckFlyAway, 7000);

		flapSoundInterval = setInterval(function(){
			flapSound.currentTime = 0;
			flapSound.play();
		},250);

		initDuck();
		//starts selected game mode
		if (gameMode == 'singleplayer'){ duckBounce();}
		else { flyControlled(angle);}
		
		duck.on('transitionend', function(event){

			//слушаем только transition left, чтобы transitionend не стрелял 2х
			if (event.originalEvent.propertyName == 'left'){
				duckBounce();
			}
		})

		function initDuck(){

			duck.removeClass('isKilled');
			//refresh bullets display		
			shotsLeft = 3;
			$('.bullet').css('visibility','visible');

			//duck to start position wo animation/transition
			duck.css({
				'left': Math.round(Math.random())*(parseInt($('.gameScreen').css('width')) - 90) +'px', //магия плавающей ширины
				'top':  Math.floor((parseInt($('.gameScreen').css('height'))-200)*Math.random()) +'px',
				'transition': 'none',
				'animation':'none',
				'display': 'block',
				'background-position': '-320px -300px',
			});			
			duck.position().left==0 ? duck.css('transform', 'scale(1,1)'):duck.css('transform', 'scale(-1,1)')
		}		

		

		function duckBounce(){
			duck.css({'transition': 'left 2s linear, top 2s linear '});

			let newPos = {};	
			let prevPos = {};
	 		prevPos.top = $('.duck').position().top;
			prevPos.left = $('.duck').position().left;



			//Left border bounce
			if (duck.position().left <= 0) {
				newPos.top = Math.floor((parseInt($('.gameScreen').css('height'))-200)*Math.random());
				newPos.left = parseInt($('.gameScreen').css('width')) - 90;
				quackSound.play();
			} 

			//Right border bounce
			if(parseInt(duck.css('right'))<=0){
				newPos.top = Math.floor((parseInt($('.gameScreen').css('height'))-200)*Math.random());
				newPos.left = 0;	
				quackSound.play();			
			}
			
			setTimeout(function(){
				$('.duck').css({
					'left':  newPos.left +'px',
					'top':  newPos.top +'px',				
				});	},0);			

			duckTurn(getAngle(prevPos,newPos));
		}
		
		//duck shot handler
		duck.one('click', function(ev){
			if (!duck.hasClass('isKilled') && shotsLeft > 0){
				clearTimeout(flyTimeout);
				duckLeft--;
				score+=100;
				clearInterval(flapSoundInterval);
				
				//refresh screen stats
				$('.duckStat').eq(duckLeft).css('background-color', 'firebrick');
				$('.scoreBox').text(`Score:\n${score}`);

				$('.dogCatch').css({animation: 'none'});

				//stop to fly
				$('.duck').css({
					'left': $(ev.target).position().left+'px',
					'top': $(ev.target).position().top+'px',
					'animation':'none',
					'transform': 'scale(1,1) rotate(0deg)',
				});

				//add class to prevent score++ on the dead duck shot
				//and zombie duck fly away
				$(this).addClass('isKilled');

				//Fall
				fallSound.play();
				$('.isKilled').position();
				$('.isKilled').css({
					top: '600px',
					'background-position': '-320px -580px',
					animation: 'duckFall .4s infinite step-end .5s',
					transition:'top 1.2s cubic-bezier(0.6, -0.28, 0.74, 0.05) 0s',
				})

				//Dog catch duck
				$('.isKilled').one('transitionend', function(){					
					fallSound.pause();
					fallSound.currentTime = 0;
					landSound.play();
					catchSound.play();
					$('.dogCatch').css({
						'display':'block',
						'left': $(ev.target).position().left + 'px',
						animation: 'dogCatch 2s 1 ease 0s',
					});
				});
				

				clearTimeout(flyAwayTimeout);

			 	//Check if there are ducks left or gameOver after dog catch animation
			 	$('.dogCatch').one('animationend', function(){
			 		// debugger;
				 	if (duckLeft > 0) {				 		
						game(); 
				 	}	

					else  {	
						music.pause();
						music.currentTime = 0;
						clearSound.play();

						gameOver();														
					}	
				});	
			}
		});

		

		//angle range from -Pi to Pi clockwise, zero axis -Y
		function getAngle(prevPos, nextPos){
			let angle = Math.round(Math.atan((nextPos.left-prevPos.left)/(-nextPos.top+prevPos.top))*180/Math.PI);
			if (nextPos.top-prevPos.top > 0){
				if( nextPos.left-prevPos.left <= 0){angle-=180;}
				else angle +=180 ;
			}
			// console.log(angle);
			return angle;
		}

			
		function duckFlyAway(){

			if (!duck.hasClass('isKilled')){

				clearTimeout(flyTimeout); 
				duck.off('transitionend'); //delete 'bounce' transition listener 
				duckLeft--;
				duck.addClass('isKilled');			
				
				duck.css({
				'left': duck.position().left+'px',
				'top': duck.position().top+'px',
				'animation':'none',
				'transform': 'scale(1,1) rotate(0deg)',
				'transition': 'left 2s linear, top 2s linear ',
				});
				duck.position();
				//Fly up'n'away
				duck.css({
					top: '-90px',
					animation: 'duckFlyAway .4s infinite step-end 0s',
				});

				clearTimeout(flyAwayTimeout); 

				//checking if any ducks left or gameOver		 	
		 		$('.isKilled').one('transitionend', function(){	
					
					clearInterval(flapSoundInterval);
		 			laughSound.play();
		 			$('.dogLaugh').css({
						animation: 'dogLaugh .5s infinite step-end 0s',
						top: '460px',
					});		
					$('.dogLaugh').one('transitionend', function(){	
						$('.dogLaugh').css({top:'600px'	});

						if (duckLeft > 0) {game();}
						else  {		
							music.pause();
							music.currentTime = 0;
							clearSound.play();												
							gameOver();				
						}					
					})
				})				
			}
		}
	};
});
