let totalCredits = 0;

function loadScratcher(numScratchers) {
    totalCredits -= numScratchers * 100;
    updateTotalCredits();
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('scratcher-screen').classList.remove('hidden');
    document.getElementById('scratcher-container').innerHTML = '';
    for (let i = 0; i < numScratchers; i++) {
        createScratcher();
    }
}

function createScratcher() {
    const scratcherContainer = document.getElementById('scratcher-container');
    const scratcher = document.createElement('div');
    scratcher.classList.add('scratcher');

    const winningNumber = Math.floor(Math.random() * 50) + 1;
    const winningSquare = Math.floor(Math.random() * 6) + 1;

    for (let i = 1; i <= 6; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.onclick = function() { scratch(square, i, winningNumber, winningSquare); };
        scratcher.appendChild(square);
    }

    scratcherContainer.appendChild(scratcher);
}

function scratch(square, number, winningNumber, winningSquare) {
    if (square.classList.contains('clicked')) return;

    square.classList.add('clicked');

    const num = Math.floor(Math.random() * 50) + 1;

    if (number === winningSquare) {
        if (num === winningNumber) {
            totalCredits += 100;
            updateTotalCredits();
        }
        else {
            const squares = square.parentNode.getElementsByClassName('square');
            for (let i = 0; i < squares.length; i++) {
                if (!squares[i].classList.contains('clicked')) {
                    squares[i].classList.add('x');
                    squares[i].onclick = null;
                }
            }
        }
    }

    if (document.querySelectorAll('.square.clicked').length === 6) {
        document.getElementById('main-screen').classList.remove('hidden');
        document.getElementById('scratcher-screen').classList.add('hidden');
    }
}

function playAgain() {
    document.getElementById('main-screen').classList.remove('hidden');
    document.getElementById('scratcher-screen').classList.add('hidden');
    centerMouse();
}

function updateTotalCredits() {
    document.getElementById('total-credits').innerText = totalCredits;
}

function centerMouse() {
    window.scrollTo(window.innerWidth / 2, window.innerHeight / 2);
}

centerMouse(); // Center the mouse on page load
