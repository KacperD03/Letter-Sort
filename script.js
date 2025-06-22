const letterPool = 'abcdefghijklmnopqrstuvwxyz'.split('');
const longStickLetters = new Set(['b', 'd', 'f', 'h', 'k', 'l', 't']);
const lettersContainer = document.getElementById('letters');
const columns = document.querySelectorAll('.column');
const darkToggle = document.getElementById('darkToggle');

let totalPlaced = 0;
let currentLetters = [];
let currentDifficulty = 'easy';

function playSound(file) {
  const audio = new Audio(file);
  audio.play().catch(err => console.warn("Audio error:", err));
}

function getRandomLetters(count) {
  let pool = [...letterPool];
  if (currentDifficulty === 'hard') {
    pool = [...pool, ...pool.map(l => l.toUpperCase())];
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function clearBoard() {
  lettersContainer.innerHTML = '';
  columns.forEach(col => {
    const header = col.querySelector('h2');
    col.innerHTML = '';
    col.appendChild(header);
  });
}

function getRandomColor() {
  const colors = ['#e74c3c', '#9b59b6', '#f1c40f', '#1abc9c', '#3498db'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function setDifficulty(level) {
  currentDifficulty = level;
  generateLetters();
}

function generateLetters() {
  clearBoard();
  totalPlaced = 0;
  currentLetters = getRandomLetters(10);

  currentLetters.forEach(letter => {
    const div = document.createElement('div');
    div.className = 'letter';
    div.textContent = letter;
    div.draggable = true;

    if (currentDifficulty === 'medium') {
      div.classList.add('medium');
      div.style.color = getRandomColor();
    }

    if (currentDifficulty === 'hard') {
      div.classList.add('hard');
      if (Math.random() > 0.5) {
        div.style.transform = 'rotate(180deg)';
      }
      div.style.color = getRandomColor();
    }

    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('letter', letter.toLowerCase());
      playSound(`audio/${letter.toLowerCase()}.mp3`);
    });

    lettersContainer.appendChild(div);
  });
}

columns.forEach(column => {
  column.addEventListener('dragover', (e) => e.preventDefault());

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('letter');
    const isLong = longStickLetters.has(letter);
    const targetColumn = column.id;

    const correct =
      (targetColumn === 'long-stick' && isLong) ||
      (targetColumn === 'no-stick' && !isLong);

    if (correct) {
      const draggedLetter = [...lettersContainer.children].find(el =>
        el.textContent.toLowerCase() === letter
      );
      if (draggedLetter) {
        column.appendChild(draggedLetter);
        playSound('correct.mp3');
        totalPlaced++;

        if (totalPlaced === currentLetters.length) {
          setTimeout(() => generateLetters(), 500);
        }
      }
    } else {
      playSound('fail.mp3');
    }
  });
});

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkToggle.checked);
});

generateLetters();
