let originalBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none"; 
    originalBoard = Array.from(Array(9).keys());
    for(let i = 0; i <cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }  
}

function turnClick(square){
    if(typeof originalBoard[square.target.id] != 'number'){
        return;
    }
    turn(square.target.id, humanPlayer);


    if(!checkWin(originalBoard,humanPlayer) && !checkTie()){
        turn(bestSpot(), aiPlayer);
    }
}


function turn(squareId, player){
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(originalBoard, player)
    if(gameWon){
        gameOver(gameWon)
    }
    else {
        checkTie();
    }
}

function checkWin(board, player){
    let plays = board.reduce((acumulator, element, index) => 
        (element === player) ? acumulator.concat(index) : acumulator, []);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index : index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for (let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == humanPlayer ? "blue" : "red";
    }
    for(let i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You Win!" : "You Lose!");
}

function declareWinner(winner){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = winner;
}

function emptySquares(){
    return originalBoard.filter(square => typeof square == 'number');
}

function bestSpot(){
    return minimax(originalBoard, aiPlayer).index;
}

function checkTie(){
    if(emptySquares().length == 0){
        for(let i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game");
        return true;
    }
    return false;
}

function minimax(newBoard, player){
    let availableSpots = emptySquares(newBoard);

    if(checkWin(newBoard, humanPlayer)){
        return {score: -1};
    }
    else if(checkWin(newBoard, aiPlayer)){
        return {score: 1};
    }
    else if(availableSpots.length == 0){
        return {score: 0};
    }

    let moves = [];
    for (let index = 0 ; index < availableSpots.length; index++){
        let move = {};
        move.index = newBoard[availableSpots[index]];
        newBoard[availableSpots[index]] = player;

        if(player == aiPlayer){
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        }
        else{
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availableSpots[index]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if(player === aiPlayer){
        var bestScore = -10000;
        for(let index = 0; index < moves.length; index++){
            if(moves[index].score > bestScore){
                bestScore = moves[index].score;
                bestMove = index;
            }
        }
    } else{
        var bestScore = 10000;
        for(let index = 0; index < moves.length; index++){
            if(moves[index].score < bestScore){
                bestScore = moves[index].score;
                bestMove = index;
            }
        }
    }

    return moves[bestMove];
}