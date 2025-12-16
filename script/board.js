
function bindDragEvents(card) {
  card.addEventListener('dragstart', onDragStart);
  card.addEventListener('dragend', onDragEnd);
}

function onDragStart(e) {
  const card = e.currentTarget;
  const id = card.getAttribute('data-id');
  e.dataTransfer.setData('text/plain', id); 
  card.classList.add('dragging');
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
}

function onDragOver(e) {
  e.preventDefault();
}

function onDragEnter(e) {
  e.currentTarget.classList.add('drop-target');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drop-target');
}

function onDrop(e) {
  e.preventDefault();
  const col = e.currentTarget;
  const cardId = e.dataTransfer.getData('text/plain');
  const card = document.querySelector(`[data-id="${cardId}"]`);
  if (card && col) {
    col.appendChild(card);
  }
  col.classList.remove('drop-target');
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(card => {
    bindDragEvents(card);
  });
  document.querySelectorAll('.column[data-status]').forEach(col => {
    col.addEventListener('dragover', onDragOver);
    col.addEventListener('dragenter', onDragEnter);
    col.addEventListener('dragleave', onDragLeave);
    col.addEventListener('drop', onDrop);
  });
});
