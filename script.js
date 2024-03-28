let totalScore = 3000; // Initial total score
let clickCountsPerMinute = []; // Array to store click counts per minute
let currentMinute = 0; // Variable to track the current minute
let timerInterval; // Variable to store the interval for updating counts
let selectedTimer = null; // Initialize selectedTimer with a default value
let totalWinningCards = 0;

// Initialize clickCountsPerMinute array
for (let i = 0; i < selectedTimer / 60; i++) {
  clickCountsPerMinute.push({ single: 0, bulk3: 0, bulk4: 0, bulk5: 0 });
}

function updateScore(scoreChange) {
  totalScore += scoreChange;
  const scoreDisplay = document.getElementById('scoreDisplay');
  scoreDisplay.innerText = totalScore;

  const scoreDisplayGame = document.getElementById('scoreDisplayGame');
  if (scoreDisplayGame) {
    scoreDisplayGame.innerText = 'Your Credits: ' + totalScore;
  }
}


// Function to set the timer
function setTimer(timer) {
  selectedTimer = timer;
  dialogBoxShown = false; // Reset the flag when a new timer is selected
  const timerButtons = document.querySelectorAll('.timerBtn');
  timerButtons.forEach(button => {
    if (parseInt(button.textContent) === timer) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });

  // Reset click counts per minute array based on the selected timer
  clickCountsPerMinute = [];
  for (let i = 0; i < Math.ceil(selectedTimer / 60); i++) {
    clickCountsPerMinute.push({ single: 0, bulk3: 0, bulk4: 0, bulk5: 0 });
  }
}


// Function to start the game
function startGame(numScratchers, cost) {
  resetElementAppearance();

  if (selectedTimer === null) {
    alert("Please wait for further instructions.");
    return;
  }

  // Disable timer buttons until the current timer completes
  const timerButtons = document.querySelectorAll('.timerBtn');
  timerButtons.forEach(button => {
    button.disabled = true;
  });

  // Update the click counts per minute array dynamically based on the selected timer
  if (selectedTimer > clickCountsPerMinute.length * 60) {
    const minutesToAdd = Math.ceil((selectedTimer / 60) - clickCountsPerMinute.length);
    for (let i = 0; i < minutesToAdd; i++) {
      clickCountsPerMinute.push({ single: 0, bulk3: 0, bulk4: 0, bulk5: 0 });
    }
  }

  // Increment the counts for the correct minute
  const currentMinuteIndex = Math.min(Math.floor(currentMinute / 60), clickCountsPerMinute.length - 1);
  switch (numScratchers) {
    case 1:
      clickCountsPerMinute[currentMinuteIndex].single++;
      break;
    case 3:
      clickCountsPerMinute[currentMinuteIndex].bulk3++;
      break;
    case 4:
      clickCountsPerMinute[currentMinuteIndex].bulk4++;
      break;
    case 5:
      clickCountsPerMinute[currentMinuteIndex].bulk5++;
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

  // Start the timer only if it's not already running
  if (!timerInterval) {
    // Set the timer display
    const timerDisplay = document.getElementById('timerDisplay');
    let remainingTime = selectedTimer * 1000; // Convert to milliseconds
    timerDisplay.innerText = formatTime(remainingTime);

    // Enable timer buttons after the timer completes
    timerInterval = setInterval(() => {
      remainingTime -= 1000; // Subtract 1 second
      if (remainingTime >= 0) {
        timerDisplay.innerText = formatTime(remainingTime);
        // Increment current minute and update click counts
        currentMinute++;
        const currentMinuteIndex = Math.min(Math.floor(currentMinute / 60), clickCountsPerMinute.length - 1);
        switch (numScratchers) {
          case 1:
            clickCountsPerMinute[currentMinuteIndex].single++;
            break;
          case 3:
            clickCountsPerMinute[currentMinuteIndex].bulk3++;
            break;
          case 4:
            clickCountsPerMinute[currentMinuteIndex].bulk4++;
            break;
          case 5:
            clickCountsPerMinute[currentMinuteIndex].bulk5++;
            break;
        }
      } else {
        clearInterval(timerInterval);
        timerDisplay.innerText = "Timer Complete";
        showDialogBox(); // Show dialog box after timer completes
      }
    }, 1000); // Update timer every second
  }

  for (let i = 0; i < numScratchers; i++) {
    const scratcher = document.createElement('div');
    scratcher.classList.add('scratcher');

    const winningNumberText = document.createElement('div');
    winningNumberText.classList.add('winning-number-text');
    winningNumberText.innerText = 'Winning Number';
    scratcher.appendChild(winningNumberText);

    // Generate a random winning number for each scratcher
    const winningNumber = Math.floor(Math.random() * 21);
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
      const randomNumber = Math.floor(Math.random() * 21); // Assign a random number to each square
      square.setAttribute('data-number', randomNumber);
      square.onclick = function() { revealNumber(this, winningNumber, numScratchers); }; // Attach click event handler
      scratcher.appendChild(square);
    }

    gameContainer.appendChild(scratcher);
  }

  updateElementAppearance(true);
}


function formatTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function revealNumber(square, winningNumber, numScratchers) {
  const number = parseInt(square.getAttribute('data-number'), 10);
  square.innerText = number;
  square.style.backgroundColor = 'white'; // Change background color to white

  const scratcher = square.closest('.scratcher');
  const allSquares = scratcher.querySelectorAll('.square');
  let winningNumberFound = false;

  allSquares.forEach(s => {
    if (parseInt(s.innerText, 10) === winningNumber) {
      winningNumberFound = true;
    }
  });

  if (number === winningNumber) {
    allSquares.forEach(s => {
      if (parseInt(s.innerText, 10) !== winningNumber)
      {
              s.onclick = null; // Disable click event for all other squares
              s.style.backgroundColor = 'white';
            }
          });

          // Check if the congratulations message is already present
          const congrats = scratcher.querySelector('.congrats');
          if (!congrats) {
            // Play winning sound
            const winningSound = document.getElementById('winningSound');
            winningSound.play();

            // Display Winning Message
            const congrats = document.createElement('div');
            congrats.classList.add('congrats');
            congrats.innerText = '✨🎉✨ Winner! ✨🎉✨  +100 Credits ';
            totalWinningCards++;
            scratcher.appendChild(congrats);
            updateScore(100); // Add credits for winning
          }

          // Set the background image to the confetti GIF
          scratcher.style.backgroundImage = "url('https://media.tenor.com/HHPMFMlwwMIAAAAj/congratulations-congrats.gif')";
          scratcher.style.backgroundRepeat = 'no-repeat';
          scratcher.style.backgroundSize = 'cover';
        } else {
          square.onclick = null; // Disable click event for the current square

          if (!winningNumberFound && !remainingUnscratchedSquares(allSquares)) {
            const losingMessage = scratcher.querySelector('.losing-message');
            if (!losingMessage) {
              const losingMessage = document.createElement('div');
              losingMessage.classList.add('losing-message');
              losingMessage.innerText = 'No winning numbers!';
              scratcher.appendChild(losingMessage);
              scratcher.classList.add('no-winning-squares'); // Add a class to scratcher with no winning numbers
              scratcher.style.backgroundColor = '#fcb040'; // Change color of scratcher with no winning numbers

              // Play losing sound
              const losingSound = document.getElementById('losingSound');
              losingSound.play();
            }
          }
        }

        // Check if all scratchers have either a "No winning numbers" or "Winner +100" message
        const allScratchers = document.querySelectorAll('.scratcher');
        let allScratchersCompleted = true;
        allScratchers.forEach(scratcher => {
          if (!scratcher.querySelector('.congrats') && !scratcher.querySelector('.losing-message')) {
            allScratchersCompleted = false;
          }
        });

        // If all scratchers are completed, show the "Play Again" button
        if (allScratchersCompleted) {
          const returnBtn = document.getElementById('returnBtn');
          returnBtn.style.display = 'block';
        }
      }

      function remainingUnscratchedSquares(squares) {
        for (let i = 0; i < squares.length; i++) {
          if (squares[i].style.backgroundColor !== 'white') {
            return true;
          }
        }
        return false;
      }

      function returnToWelcome() {
        const welcomeSection = document.getElementById('welcome');
        const gameSection = document.getElementById('game');
        welcomeSection.style.display = 'block';
        gameSection.style.display = 'none';
        const returnBtn = document.getElementById('returnBtn');
        returnBtn.style.display = 'none'; // Hide the "Return to Welcome" button again

        updateElementAppearance(false);
      }

      function showDialogBox() {
        alert(" 🛑 Take a 5 minute break. 🛑 If you are still scratching off numbers, please finish them before taking a break. The experimenter will inform you of what to do next.");
      }

      function resetClickCount() {
        clickCount1 = 0;
        clickCount3 = 0;
        clickCount4 = 0;
        clickCount5 = 0;
        document.getElementById('clickCount1').innerText = clickCount1;
        document.getElementById('clickCount3').innerText = clickCount3;
        document.getElementById('clickCount4').innerText = clickCount4;
        document.getElementById('clickCount5').innerText = clickCount5;

        resetGame(); // Reset the game when clicks are reset
      }

      // Function to download click counts
    function downloadClickCounts() {
      // Prepare the content of the text file
      let content = 'Click Counts Per Minute:\n';
      clickCountsPerMinute.forEach((counts, index) => {
        content += `Minute ${index + 1}: ${counts.single} single, ${counts.bulk3} bulk3, ${counts.bulk4} bulk4, ${counts.bulk5} bulk5\n`;
      });

      // Calculate the total number of cards with 'congrats' message
      const totalCongratsCards = totalWinningCards;
      content += `\nTotal Winning Cards: ${totalCongratsCards}\n`;

      // Create a Blob with the content
      const blob = new Blob([content], { type: 'text/plain' });

      // Create a link element to download the Blob
      const link = document.createElement('a');
      link.download = 'click_counts_per_minute.txt';
      link.href = window.URL.createObjectURL(blob);
      link.click();
    }

      function resetElementAppearance() {
        const timerButtons = document.querySelectorAll('.timerBtn');
        timerButtons.forEach(button => {
          button.style.backgroundColor = '#5cbde6';
          button.style.color = '#2690bd';
        });

        const downloadBtn = document.querySelector('.downloadBtn');
        downloadBtn.style.backgroundColor = '#75befa';

        const resetClicksBtn = document.querySelector('.resetClicksBtn');
        resetClicksBtn.style.backgroundColor = '#68b4f2';
      }

      function updateElementAppearance(inGame) {
        if (inGame) {
          const timerButtons = document.querySelectorAll('.timerBtn');
          timerButtons.forEach(button => {
            button.style.backgroundColor = 'white';
            button.style.color = 'black';
          });

          const downloadBtn = document.querySelector('.downloadBtn');
          downloadBtn.style.backgroundColor = 'white';

          const resetClicksBtn = document.querySelector('.resetClicksBtn');
          resetClicksBtn.style.backgroundColor = 'white';
        } else {
          resetElementAppearance();
        }
      }

      function resetGame() {
        currentMinute = 0;
        clickCountsPerMinute = [];
        clearInterval(timerInterval);
        updateElementAppearance(false);
      }
