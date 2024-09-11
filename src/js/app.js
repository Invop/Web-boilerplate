// const testModules = require('./test-module');
require('../css/app.css');

/** ******** Your code here! *********** */

function showPopup(popupId, overlayId) {
  document.getElementById(popupId).style.display = 'block';
  document.getElementById(overlayId).style.display = 'block';
}

function hidePopup(popupId, overlayId) {
  document.getElementById(popupId).style.display = 'none';
  document.getElementById(overlayId).style.display = 'none';
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('close-btn-popup')) {
    const popupId = event.target.closest('.popup').id;
    const overlayId = `overlay-${popupId}`;
    hidePopup(popupId, overlayId);
  }
});
