// Generate particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const numParticles = 15;
    
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random position
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 10 + 5;
      
      // Random color
      const colors = ['#7c4dff', '#03dac6', '#b388ff', '#1de9b6'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random animation delay
      const delay = Math.random() * 10;
      
      particle.style.left = `${xPos}%`;
      particle.style.top = `${yPos}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      particle.style.animationDelay = `${delay}s`;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  // Initialize game
  const gameContainer = document.getElementById('game-container');
  const msgEl = document.getElementById('msg');
  const micBtn = document.getElementById('mic-btn');
  const rangeProgress = document.getElementById('range-progress');
  
  // Create speech recognition
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new window.SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  // Generate random number
  let randomNum = getRandomNumber();
  let minGuess = 1;
  let maxGuess = 100;
  console.log('Number:', randomNum);
  
  // Generate random number function
  function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }
  
  // Update range indicator
  function updateRangeIndicator() {
    const rangeWidth = ((maxGuess - minGuess) / 99) * 100;
    const rangeStart = ((minGuess - 1) / 99) * 100;
    rangeProgress.style.width = `${rangeWidth}%`;
    rangeProgress.style.left = `${rangeStart}%`;
  }
  
  // Create success screen
  function showSuccessScreen(num) {
    gameContainer.innerHTML = `
      <div class="success-container">
        <h1>Congratulations!</h1>
        <h3>You guessed the number correctly</h3>
        
        <div class="number-display">${num}</div>
        
        <button class="play-again" id="play-again">Play Again</button>
      </div>
    `;
    
    // Add confetti effect
    createConfetti();
    
    // Add event listener for play again button
    document.getElementById('play-again').addEventListener('click', () => {
      window.location.reload();
    });
  }
  
  // Create confetti animation
  function createConfetti() {
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.background = ['#7c4dff', '#03dac6', '#ff7043', '#ffeb3b', '#43a047'][Math.floor(Math.random() * 5)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '-20px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.zIndex = '100';
      confetti.style.opacity = Math.random() * 0.5 + 0.5;
      document.body.appendChild(confetti);
      
      // Animate confetti falling
      const animation = confetti.animate(
        [
          { transform: `translate(0, 0) rotate(${Math.random() * 360}deg)` },
          { transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)` }
        ],
        {
          duration: Math.random() * 3000 + 2000,
          easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }
      );
      
      animation.onfinish = () => {
        document.body.removeChild(confetti);
      };
    }
  }
  
  // Process speech results
  function onSpeakResult(e) {
    const transcript = e.results[0][0].transcript;
    processGuess(transcript);
    setTimeout(() => {
      micBtn.classList.remove('listening');
    }, 500);
  }
  
  // Check the number
  function processGuess(transcript) {
    const num = parseInt(transcript.replace(/\D/g, ''));
    
    msgEl.style.display = 'block';
    
    // Display what user said
    msgEl.innerHTML = `
      <div>You said:</div>
      <div class="result-box">${transcript}</div>
    `;
    
    // Check if valid number
    if (isNaN(num)) {
      msgEl.innerHTML += `
        <div class="feedback error">That's not a valid number</div>
      `;
      return;
    }
    
    // Check if in range
    if (num < 1 || num > 100) {
      msgEl.innerHTML += `
        <div class="feedback error">Number must be between 1 and 100</div>
      `;
      return;
    }
    
    // Check against target number
    if (num === randomNum) {
      showSuccessScreen(num);
    } else if (num > randomNum) {
      msgEl.innerHTML += `
        <div class="feedback lower">GO LOWER</div>
      `;
      maxGuess = Math.min(maxGuess, num - 1);
      updateRangeIndicator();
    } else {
      msgEl.innerHTML += `
        <div class="feedback higher">GO HIGHER</div>
      `;
      minGuess = Math.max(minGuess, num + 1);
      updateRangeIndicator();
    }
  }
  
  // Start listening when mic button is clicked
  micBtn.addEventListener('click', () => {
    recognition.start();
    micBtn.classList.add('listening');
  });
  
  // Handle speech recognition events
  recognition.addEventListener('result', onSpeakResult);
  recognition.addEventListener('end', () => {
    micBtn.classList.remove('listening');
  });
  recognition.addEventListener('error', (e) => {
    console.error('Speech recognition error', e);
    micBtn.classList.remove('listening');
    
    if (e.error === 'not-allowed') {
      msgEl.style.display = 'block';
      msgEl.innerHTML = `
        <div class="feedback error">Please allow microphone access</div>
      `;
    }
  });
  
  // Initialize
  createParticles();