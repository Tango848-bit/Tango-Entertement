window.onload = function()
{
    var canvas , canvas2; 
    var ctx ,ctx2,ctx3,ctx4,ctx5;
    var snakee;
    var delay =300;
    var canvasheight=500;
    var canvaswidth=1010;
    var i;
    var blocksize =30;
    var dir;
    var applee;
    var heightinBlock = canvasheight/blocksize;
    var widthinBlock = canvaswidth/blocksize;
    var score = 0 , NouDirect=" " , AncDirect="";
    

        init();

    function init()
    {
    canvas = document.createElement('canvas');
    canvas.width=canvaswidth;
    canvas.height=canvasheight;
    canvas.style.border="1px double";
    canvas.style.marginBottom="40px";
    canvas.style.backgroundColor="cyan";
    document.body.appendChild(canvas);
    snakee = new snake([[6,4] , [5,4] , [4,4]] , "right");
    applee = new Apple([10,10]);
    ctx = canvas.getContext('2d');
    refresh();
   //Manette();
    }
    function refresh()
    {
        snakee.advance();

        if(snakee.checkCollision()){
            
            GameOver();
        }else{ 
           
            if(snakee.isEatApple(applee)){
                do{ 
                    score++;
                    snakee.ateApple = true;applee;
                applee.setNewPosition();
                }
                while(applee.OnSnake(snakee))
                //alert(applee.OnSnake(snakee));
            }
        ctx.clearRect(0,0,canvaswidth,canvasheight);
        ctx.fillStyle="#ff0000";
        snakee.draw();
        drawScore();
        applee.draw();
       // snakee.setDirection(dir);
        setTimeout(refresh , delay);
        }
    }
    function drawScore(){
        ctx.save();
        ctx.fillText(score.toString(),0 ,canvasheight-5);
        ctx.restore();
    }
    function GameOver(){
        ctx.save();
        ctx.fillText("GAME OVER !" , 5,25);
        ctx.fillText("Appuyez sur Barre D`Espacement ou F5 pour Continuer !" , 5,40);
        //ctx.fillStyle = "GREEN";
        ctx.restore();
        score =0;
        
    }
    
    function Restart(){
        snakee = new snake([[6,4] , [5,4] , [4,4]] , "right");
        applee = new Apple([10,10]);
        score =0;
        refresh();
    }
    function Apple(position) {
       this.position =position;
       this.draw = function(){
        ctx.save();
        ctx.fillStyle="red";
        ctx.beginPath();
        var rayon = blocksize/2;
        var x = this.position[0]*blocksize +rayon ;
        var y = this.position[1]*blocksize+rayon;
        ctx.arc(x,y,rayon,0,Math.PI*2,true);
        ctx.fill();
        ctx.restore();
       };

       this.setNewPosition = function(){
        var NewX = Math.round(Math.random()*(widthinBlock-1));
        var NewY = Math.round(Math.random()*(heightinBlock-1) );
        this.position = [NewX,NewY];
       };

       this.OnSnake = function(SnakeToCheck){
        var dessus = false;
        for(var i=0;i<SnakeToCheck.body.length;i++){
            if(this.position[0] === SnakeToCheck.body[i][0] && this.position[1] === SnakeToCheck.body[i][1]){
                dessus= true;
            }
        }
        return dessus;
       };
    }
    function drawblock(ctx,position){
        var x = position[0]*blocksize;
        var y = position[1]*blocksize;
       ctx.fillRect(x,y,blocksize,blocksize);
    }
    
    function snake(body,direction){
        this.body = body;
        this.direction = direction;
        this.ateApple =false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle="yellow";
            for(i=0 ; i<this.body.length;i++){
                drawblock(ctx,this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function()
        {
            var nextposition=this.body[0].slice();
            switch(this.direction)
            {
                case "up":nextposition[1]-=1; break;
                case "down":nextposition[1]+=1;break;
                case "right":nextposition[0]+=1;break;
                case "left":nextposition[0]-=1;break;
                default: nextposition[0];
            }
            this.body.unshift(nextposition);
            if(!this.ateApple)
            this.body.pop();
            else
                this.ateApple = false;

                ctx.save();
               // ctx.fillText( ("posi = "+direct.toString()+" thispos = "+ this.direction.toString()), canvaswidth -125,canvasheight -15);
              ctx.restore();
        };

        this.setDirection = function(newdir){
            var allowdir;
            var ancienDir = this.direction;
            switch(this.direction)
            {
                case "up": 
                case "down":
            
                case "right":
                case "left":
                  allowdir = ["down","up","right","left"];break;
                default: throw("INVALIDE TOUCH");
            }
           // alert("aloowd = "+(allowdir.indexOf(newdir) >-1).toString());
            if(allowdir.indexOf(newdir) >-1){
                this.direction = newdir;
            }
           var chd= this.changement(ancienDir , newdir);
           

        };
        this.changement = function(anc , nouv){             
            
            var dir =anc;this.AncDirect = dir;
            this.NouDirect = nouv;
            ctx.save();
            var chg = false;
            ctx.fillText( ("posi = "+dir.toString()+" thispos = "+ nouv.toString()), canvaswidth -125,canvasheight -15);

            if(dir != this.direction){
                chg =true;
                ctx.fillText( ("ANCIEN = "+dir.toString()+" NOUV = "+ nouv.toString()), canvaswidth -125,canvasheight -15);

            }
           ctx.restore();
           
            return chg;
        }

        this.checkCollision = function(){
            var wallTook = false;
            var collison = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX=minY= 0;
            var maxX=widthinBlock;
            var maxY=heightinBlock;

            var OutHorizontal = snakeX < minX ||snakeX >maxX;
            var OutVertical = snakeY < minY || snakeY > maxY;

             if(OutHorizontal || OutVertical){
                wallTook = true;
             }
             for(var i =0 ; i<rest.length ; i++){
                if(!snakee.changement(AncDirect,NouDirect)){ 
                   if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    collison =true;
                   }}
             }
             return wallTook || collison;
        };
        
        this.isEatApple = function(Pom){
            var head = this.body[0];

            if(head[0] === Pom.position[0] && head[1] === Pom.position[1])     
                return true;
            else  
               return false;
        }
    }

    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        //alert(key);
        var newdir;
        switch(key){
            case 37: newdir = "left";
            break;
            case 38: newdir = "up";
            break;
            case 39:newdir = "right";
            break;
            case 40:newdir = "down";break;
            case 32 :
                Restart();
                return;
                break;
            case 116:
                Restart();
                return;
            break;
        }
       this.direction= dir=newdir;
        snakee.setDirection(newdir);
    
    }; 


/*
   
       function Manette()
    {
        canvas2 = document.createElement('canvas');
        canvas2.width = 330;
        canvas2.height = 150;
        canvas2.style.border = "2px double";
        canvas2.style.backgroundColor="green";
        canvas2.style.margin="300px";
        canvas2.style.marginTop="1px";
    
        document.body.appendChild(canvas2);
        ctx2 = canvas2.getContext('2d');
        ctx3 = canvas2.getContext('2d');
        ctx4 = canvas2.getContext('2d');
        ctx5 = canvas2.getContext('2d');
        ctx2.fillStyle="#444";
        ctx3.fillStyle="#444";
        ctx4.fillStyle="blue";
        ctx5.fillStyle="#444";
        
        up();down();right();Left();
    }
    function up(){
        // le button UP
        ctx2.fillRect(150,9,45,45);
        ctx2.fillStyle="#00ffff";
        ctx2.fillText("UP",166,35);
        var ret = "up";
        this.dir = ret;
        if(document.onmousemover){
            ctx2.snakee.setDirection("up");
        }
    }
    function down(){
        // le Button Down
        ctx3.fillRect(150,100,45,45);
        ctx3.fillStyle="#ffa500";
        ctx3.fillText("DOWN",155,125);
        ctx3.down();
        var ret2 = "down";
        this.dir = ret2;
           
    }
    function right(){
        // le Button right
        ctx4.fillRect(30,50,45,45);
        ctx4.fillStyle="#444";
        ctx4.fillText("RIGHT",35,75);
        ctx4.right();
        
    }
    function Left(){
        // le Button left
        ctx5.fillRect(260,50,45,45);
        ctx5.fillStyle="#ffa500";
        ctx5.fillText("LEFT",270,75);
        ctx5.Left();
    }
*/

}
