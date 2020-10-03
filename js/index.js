// add global variables
var animationFrameId = 0;
var gameOver = false;

window.onload = () => {
    const canvas = document.querySelector('#canvas')
    const ctx = canvas.getContext('2d')

    // load images

    const helico = new Image()
    const city = new Image()
    const earth = new Image()
    const pipeNorth = new Image()
    const pipeSouth = new Image()

    helico.src = './imgs/helico.png'
    city.src = './imgs/cityBg.png'
    earth.src = './imgs/earth.png'
    pipeNorth.src = 'imgs/pipeNorth.png'
    pipeSouth.src = './imgs/pipeSouth.png'

    // some variables

    let gap = 105
    let constant

    let bX = 10
    let bY = 150

    let gravity = 1.1

    let score = 0
    let d = true

    // audio files

    let fly = new Audio()
    let scor = new Audio()
    let crash = new Audio()

    fly.src = './sounds/fly.mp3'
    scor.src = './sounds/score.mp3'
    crash.src = './sounds/crash.wav'

    //on key down

    document.addEventListener('keydown', moveUp)

    function moveUp() {
        bY -= 25
        fly.play()
    }

    // pipe coordinates

    let pipe = []

    pipe[0] = {
        x: canvas.clientWidth,
        y: 0,
        done: false
    }

    // draw images

    function draw() {

        ctx.drawImage(city, 0, 0)
        ctx.drawImage(earth, 0, canvas.height - earth.height)
        ctx.drawImage(helico, bX, bY)
        bY += gravity

        // add event direction for image helico
        document.addEventListener('keydown', direction)

        function direction(event) {
            if (event.keyCode == 37 && d != 'right' && bX >= 0) {
                d = 'left'
                bX -= 0.1
            } else if (event.keyCode == 38 && d != 'down' && bY >= 0) {
                d = 'up'
                bY -= 0.1
            } else if (event.keyCode == 39 && d != 'left' && bX <= 780) {
                d = 'right'
                bX += 0.1
            } else if (event.keyCode == 40 && d != 'up' && bY <= 383) {
                d = 'down'
                bY += 0.1
            }
        }

        // draw Score
        ctx.fillStyle = 'red'
        ctx.font = '30px Verdana'
        ctx.fillText('Score : ' + score, 10, canvas.height - 20)

        // add pipes
        for (let i = 0; i < pipe.length; i++) {

            constant = pipeNorth.height + gap
            ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y)
            ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant)

            pipe[i].x--

            if (pipe[i].x == 125) {
                pipe.push({
                    x: canvas.clientWidth,
                    y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
                    done: false
                })
            }

            //detect collision pipes and helico image

            if (bX + helico.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width &&
                (bY <= pipe[i].y + pipeNorth.height || bY + helico.height >= pipe[i].y + constant) ||
                bY + helico.height >= canvas.height - earth.height) {

                // draw text 'Game over' in canvas   
                ctx.fillStyle = 'red'
                ctx.font = '60px Verdana'
                ctx.fillText('Game Over', 300, 60)
                crash.play()

                // when is Game Over, stop the game - cancel animation frame
                console.log(animationFrameId);
                gameOver = true
                cancelAnimationFrame(animationFrameId);

            }
            // add condition when is helico.x > pipes.x, increase Score
            if (pipe[i].done == false) {
                if (pipe[i].x < bX) {
                    score++
                    pipe[i].done = true
                    scor.play()
                }
            }
        }

        // call animationFrame
        if (!gameOver) {
            animationFrameId = requestAnimationFrame(draw)
        }
    }
    // call function
    draw()
}