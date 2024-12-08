
let game_field = []
let input_map = {}
let gameObjects = []
let isGameOver = 0
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 500;
let tabFocused = true
let inputStates = {
    r: false,
    l: false,
    d: false,
    u: false
}

const canvas = document.getElementById("game");
const GRID_UNIT = 30
const GRAVITY = 9.81 * GRID_UNIT;

class GameObject {
    constructor(context, pos, vel) {
        this.context = context
        this.pos = pos
        this.vel = vel
        this.restitution = 0.9
        this.isColliding = false
    }
}

class Player extends GameObject {
    constructor(context, pos, vel, color="red") {
        super(context, pos, vel)
        this.context = context
        this.pos = pos
        this.vel = vel
        this.color = color
        this.restitution = 0
        this.width = GRID_UNIT
        this.height = 2*GRID_UNIT
    }

    isGrounded()
    {
   
        for (const obj of gameObjects) {

            if(!(obj instanceof Player) 
                && ((obj.pos.y == this.pos.y + this.height)
                || (this.pos.y + this.height == canvas.clientHeight))){
                return true
            }
        }
        return false
    }

    draw(){
        this.context.fillStyle = this.color;
        this.context.fillRect(this.pos.x, this.pos.y, this.width, this.height); 
    }
    
    update(deltaTime){
        // if(this.isColliding)
        // {
        //     this.pos.x = this.pos.x
        // }

        this.vel.y += 2 * GRAVITY * deltaTime
        let grounded = this.isGrounded()
        if(inputStates.l && !inputStates.r)
        {
            this.vel.x = -movingSpeed
        }
        else if(inputStates.r && !inputStates.l)
        {
            this.vel.x = movingSpeed
        }
        else if ((!inputStates.r && !inputStates.l) || (inputStates.r && inputStates.l)) {
            this.vel.x = 0
        }
        //  else if(((!inputStates.r && !inputStates.l) || (inputStates.r && inputStates.l)) && grounded)
        // {
        //     this.vel.x = 0
        // }
        if(inputStates.u && !inputStates.d && grounded/* isgrounded */)
        {
            this.vel.y -= 10 * GRID_UNIT// Y axis is facing down
            console.log(this.vel);
        }

        
        this.pos.y += this.vel.y * deltaTime
        this.pos.x += this.vel.x * deltaTime

    }

}
class Square extends GameObject {
    constructor(context, pos, vel, size=1, color="green") {
        super(context, pos, vel)
        this.context = context
        this.pos = pos
        this.vel = vel
        this.size = size
        this.color = color

        this.width = this.height = GRID_UNIT * size
    }
    update(deltaTime)
    {
        this.vel.y += GRAVITY * deltaTime

        this.pos.x += this.vel.x * deltaTime
        this.pos.y += this.vel.y * deltaTime
    }

    draw(){
        this.context.fillStyle = this.isColliding ? "red" : this.color;
        this.context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    
}

function AABBisIntersecting(box1, box2){
    return !(
        //if any is true box is not inside other box
        box2.pos.x  > box1.width + box1.pos.x || // passed to right
        box1.pos.x  > box2.width + box2.pos.x  || // passed to left
        box2.pos.y  > box1.height + box1.pos.y || // passed above
        box1.pos.y > box2.height + box2.pos.y  // passed under
    )
}

function HandleBorderCollisions()
 {

     let obj;
     for (let i = 0; i < gameObjects.length; i++)
     {
         obj = gameObjects[i];

         // Check for left and right
         if (obj.pos.x < 0){
             obj.vel.x = Math.abs(obj.vel.x) * obj.restitution;
             obj.pos.x = 0;
         }else if (obj.pos.x > canvas.clientWidth - obj.width){
             obj.vel.x = -Math.abs(obj.vel.x) * obj.restitution;
             obj.pos.x = canvas.clientWidth - obj.width;
         }

         // Check for bottom and top
         if (obj.pos.y < 0){
             obj.vel.y = Math.abs(obj.vel.y) * obj.restitution;
             obj.pos.y = 0;
         } else if (obj.pos.y > canvas.clientHeight - obj.height){
             obj.vel.y = -Math.abs(obj.vel.y) * obj.restitution;
             obj.pos.y = canvas.clientHeight - obj.height;
         }
     }
}

function initGame()
{
    console.log("game init");
    window.onblur = () => {
        tabFocused = false
        secondsPassed = 0
        oldTimeStamp = 0
        console.log("lost focus");
        
    }
    window.onfocus = () => {
        console.log("now focused", oldTimeStamp, secondsPassed);
        tabFocused = true;
        secondsPassed = 0;
        oldTimeStamp = 0;
        window.requestAnimationFrame(gameLoop)
    }
    //init game level
    
    //init game objects
    gameObjects.push(new Square(ctx, {x:3.5 * GRID_UNIT, y:3 *GRID_UNIT}, {x:0, y:1000}))
    gameObjects.push(new Square(ctx, {x:7 * GRID_UNIT, y:1 * GRID_UNIT},  {x:-1000, y:0}))
    // gameObjects.push(new Square(ctx, {x:3 * GRID_UNIT, y:7 * GRID_UNIT},  {x:0, y:0}))
    // gameObjects.push(new Square(ctx, {x:9* GRID_UNIT, y:9* GRID_UNIT},    {x:0, y:0}))
    
    //init player
    let player = new Player(ctx, {x:0, y:0}, {x:0, y:0})
    gameObjects.push(player)

    window.addEventListener("keydown", (e) => {

        
        if(e.key == "ArrowRight"){
            inputStates.r = true
        }
        if(e.key == "ArrowLeft"){
           inputStates.l = true
        }
        if(e.key == "ArrowUp")
        {
            inputStates.u = true
        }
    })
    window.addEventListener("keyup", (e) => {
        if(e.key == "ArrowRight"){
            inputStates.r = false
        }
        if(e.key == "ArrowLeft"){
            inputStates.l = false
        }
        if(e.key == "ArrowUp")
        {
            inputStates.u = false
        }
    })
 
    console.log(gameObjects);
    //TODO: init inputs
    //document.addEventListener("keydown", );
    
    //TODO: init textures/sounds
}

function _drawGrid()
{
    ctx.fillStyle = "black"
    for (let x = 0; x < (canvas.clientWidth/GRID_UNIT).toFixed(0); x++) {
        for (let y = 0; y < (canvas.clientHeight/GRID_UNIT).toFixed(0); y++) {
            ctx.fillRect(x*GRID_UNIT, y*GRID_UNIT, 1, canvas.clientHeight)
            ctx.fillRect(x*GRID_UNIT, y*GRID_UNIT, canvas.clientWidth, 1)
        }
        
    }
}
function drawScene()
{
    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)    
    for (const obj of gameObjects) {
        obj.draw()
    }
    _drawGrid()
    
}

function updateScene(secondsPassed) {
    for (const obj of gameObjects) {
        obj.update(secondsPassed)
    }
}
function computeIntersections() {
    for (const obj of gameObjects) {
        obj.isColliding = false
    }
    
    for (let i = 0; i < gameObjects.length; i++) {
        let obj1 = gameObjects[i]
        for (let j = i+1; j < gameObjects.length; j++) {
            let obj2 = gameObjects[j]
            if(AABBisIntersecting(obj1, obj2))
            {  
                obj1.isColliding = true
                obj2.isColliding = true
            }
                
        }
            
    }
}
function updateInputs()
{

}

function gameLoop(timeStamp)
{
    // Calculate how much time has passed

    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    if(secondsPassed > 1) secondsPassed = 0.00001; // prevent deltatime to grow when out of focus
    
    


    
    updateScene(secondsPassed)
    computeIntersections()
    HandleBorderCollisions()
    drawScene();
    
    //DEBUG show fps
    fps = Math.round(1 / secondsPassed);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText("FPS: " + fps, 10, 30);
    if(tabFocused)
    {
        window.requestAnimationFrame(gameLoop)
    }
}
if (canvas != null) {
    var ctx = canvas.getContext("2d");
    if (ctx == null) {
        throw new Error("Can't cet canvas context");
    }
    initGame();
    window.requestAnimationFrame(gameLoop)
    

}
