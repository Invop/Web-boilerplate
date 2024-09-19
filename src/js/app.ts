import '../css/app.css';

function showPopup(popupId: string, overlayId: string): void {
  const popup = document.getElementById(popupId) as HTMLDivElement;
  const overlay = document.getElementById(overlayId) as HTMLDivElement;

  if (popup && overlay) {
    popup.style.display = 'block';
    overlay.style.display = 'block';
  }
}

function hidePopup(popupId: string, overlayId: string): void {
  const popup = document.getElementById(popupId) as HTMLDivElement;
  const overlay = document.getElementById(overlayId) as HTMLDivElement;

  if (popup && overlay) {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  }
}

// Attach the functions to the window object
(window as any).showPopup = showPopup;
(window as any).hidePopup = hidePopup;

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('close-btn-popup')) {
    const popup = target.closest('.popup') as HTMLDivElement;
    if (popup) {
      const popupId = popup.id;
      const overlayId = `overlay-${popupId}`;
      hidePopup(popupId, overlayId);
    }
  }
});

document.querySelectorAll('[data-popup-id][data-overlay-id]').forEach(element => {
  element.addEventListener('click', () => {
    const popupId = (element as HTMLElement).getAttribute('data-popup-id')!;
    const overlayId = (element as HTMLElement).getAttribute('data-overlay-id')!;

    if (element.classList.contains('close-btn-popup') || element.classList.contains('overlay')) {
      hidePopup(popupId, overlayId);
    } else {
      showPopup(popupId, overlayId);
    }
  });
});

