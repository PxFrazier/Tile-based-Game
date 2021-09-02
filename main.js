const canvas = document.getElementById("canvas");
const cxt = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 600;
var p1 = new Image();
p1.src = "playerCharacter.png";
var gameMap = new GameMap(mapTable.search('Maze'));
var player = new Player(p1, gameMap.tileW * 16, gameMap.tileH*34);
var camera = new Camera();

window.addEventListener("keyup", (event)=>{
	player.idle();
});

window.addEventListener("keydown", (event)=>{
	console.log(event.keyCode);
	player.walk(event.keyCode);
});

function animate()
{
	cxt.clearRect(0, 0, canvas.width, canvas.height);
	camera.update(player.x + (player.playerWidth / 2), player.y + (player.playerHeight / 2));
	gameMap.render();
	player.render();
	requestAnimationFrame(animate);
}

animate();
