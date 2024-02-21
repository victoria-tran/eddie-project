let totalScore = 3000; // Initial total score
let clickCount1 = 0;
let clickCount3 = 0;
let clickCount4 = 0;
let clickCount5 = 0;

function updateScore(scoreChange) {
  totalScore += scoreChange;
  const scoreDisplay = document.getElementById('scoreDisplay');
  scoreDisplay.innerText = totalScore;

  const scoreDisplayGame = document.getElementById('scoreDisplayGame');
  if (scoreDisplayGame) {
    scoreDisplayGame.innerText = 'Your Credits: ' + totalScore;
  }
}

function startGame(numScratchers, cost) {
  switch (numScratchers) {
    case 1:
      clickCount1++;
      document.getElementById('clickCount1').innerText = clickCount1;
      break;
    case 3:
      clickCount3++;
      document.getElementById('clickCount3').innerText = clickCount3;
      break;
    case 4:
      clickCount4++;
      document.getElementById('clickCount4').innerText = clickCount4;
      break;
    case 5:
      clickCount5++;
      document.getElementById('clickCount5').innerText = clickCount5;
      break;
  }

  if (totalScore < cost) {
    alert("Insufficient credits!");
    return;
  }

  updateScore(-cost); // Deduct credits for starting the game

  const welcomeSection = document.getElementById('welcome');
  const gameSection = document.getElementById('game');
  welcomeSection.style.display = 'none';
  gameSection.style.display = 'block';

  const gameContainer = document.querySelector('.gameContainer');
  gameContainer.innerHTML = ''; // Clear the game container

  for (let i = 0; i < numScratchers; i++) {
    const scratcher = document.createElement('div');
    scratcher.classList.add('scratcher');


        // Create "Winning Number Text" text
            const winningNumberText = document.createElement('div');
            winningNumberText.classList.add('winning-number-text');
            winningNumberText.innerText = 'Winning Number';
            scratcher.appendChild(winningNumberText);

    // Generate a random winning number for each scratcher
    const winningNumber = Math.floor(Math.random() * 51);
    const winningNumberBox = document.createElement('div');
    winningNumberBox.classList.add('winning-number');
    winningNumberBox.innerText = winningNumber;
    scratcher.appendChild(winningNumberBox);


    // Create "Your Numbers" text
        const yourNumbersText = document.createElement('div');
        yourNumbersText.classList.add('your-numbers-text');
        yourNumbersText.innerText = 'Your Numbers';
        scratcher.appendChild(yourNumbersText);



    // Create 6 squares for each scratcher
    for (let j = 0; j < 6; j++) {
      const square = document.createElement('div');
      square.classList.add('square');
      const randomNumber = Math.floor(Math.random() * 51); // Assign a random number to each square
      square.setAttribute('data-number', randomNumber);
      square.onclick = function() { revealNumber(this, winningNumber, numScratchers); }; // Attach click event handler
      scratcher.appendChild(square);
    }

    gameContainer.appendChild(scratcher);
  }
}

function revealNumber(square, winningNumber, numScratchers) {
  const number = parseInt(square.getAttribute('data-number'), 10);
  square.innerText = number;
  square.style.backgroundColor = 'white'; // Change background color to black

  if (number === winningNumber) {
    const scratcher = square.closest('.scratcher');
    const allSquares = scratcher.querySelectorAll('.square');
    allSquares.forEach(s => {
      if (parseInt(s.innerText, 10) !== winningNumber) {
        s.onclick = null; // Disable click event for all other squares
        s.style.backgroundColor = 'white';
      }
    });

    // Check if the congratulations message is already present
    const congrats = scratcher.querySelector('.congrats');
    if (!congrats) {
      const congrats = document.createElement('div');
      congrats.classList.add('congrats');
      congrats.innerText = '🎉 Congratulations! 🎉';
      scratcher.appendChild(congrats);
      updateScore(100); // Add credits for winning
    }
  } else {
    square.onclick = null; // Disable click event for the current square
  }

  // Check if there are any remaining unscratched squares
  const remainingSquares = document.querySelectorAll('.square:not([style*="white"])');
  if (remainingSquares.length === 0) {
    const returnBtn = document.getElementById('returnBtn');
    returnBtn.style.display = 'block';
  }
}



function returnToWelcome() {
  const welcomeSection = document.getElementById('welcome');
  const gameSection = document.getElementById('game');
  welcomeSection.style.display = 'block';
  gameSection.style.display = 'none';
  const returnBtn = document.getElementById('returnBtn');
  returnBtn.style.display = 'none'; // Hide the "Return to Welcome" button again
}
