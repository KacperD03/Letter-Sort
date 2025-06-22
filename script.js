const letterPool = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
                    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const longStickLetters = new Set(['b', 'd', 'f', 'h', 'k', 'l', 't']);
const lettersContainer = document.getElementById('letters');
const audioCorrect = document.getElementById('correct');
const audioFail = document.getElementById('fail');


letterPool.forEach(letter => {
  const div = document.createElement('div');
  div.className = 'letter';
  div.textContent = letter;
  div.draggable = true;

  div.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('letter', letter);
  });

  lettersContainer.appendChild(div);
});


document.querySelectorAll('.column').forEach(column => {
  column.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('letter');
    const isLong = longStickLetters.has(letter);
    const targetColumn = column.id;

    const correct =
      (targetColumn === 'long-stick' && isLong) ||
      (targetColumn === 'no-stick' && !isLong);

    if (correct) {
      const draggedLetter = [...lettersContainer.children].find(el => el.textContent === letter);
      if (draggedLetter) {
        column.appendChild(draggedLetter);
        audioCorrect.play();
      }
    } else {
      audioFail.play();
      alert('Źle, ziomek. Ta litera tu nie pasuje!');
    }
  });
});
