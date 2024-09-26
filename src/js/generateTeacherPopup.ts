import { FormattedUser } from './models/FormattedUser';

export function generateTeacherPopup(user: FormattedUser): void {
    // Remove existing popups if any
    const existingPopup = document.getElementById('teacher-info-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    const existingOverlay = document.getElementById('overlay-teacher-info-popup');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay-teacher-info-popup';
    overlay.onclick = () => hidePopup('teacher-info-popup', 'overlay-teacher-info-popup');

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'popup teacher-info-popup';
    popup.id = 'teacher-info-popup';

    popup.innerHTML = `
        <div class="header-popup">
            <h1>Teacher Info</h1>
            <button class="close-btn-popup" onclick="hidePopup('teacher-info-popup', 'overlay-teacher-info-popup')">&times;</button>
        </div>
        <div class="content-popup">
            <img src="${user.picture_large ?? 'https://via.placeholder.com/100'}" alt="Teacher Avatar" class="avatar">
            <div class="info-popup">
                <h2>${user.full_name}</h2>
                <span class="star-icon">★</span>
                <div class="details-popup">
                    <p>${user.course}</p>
                    <p>${user.city}, ${user.country}</p>
                    <p>${user.age}, ${user.gender}</p>
                    <p>${user.email}</p>
                    <p>${user.phone}</p>
                </div>
            </div>
        </div>
        <div class="bio">
            <p>${user.note}</p>
        </div>
        <a href="#" class="toggle-map">Toggle map</a>
    `;

    // Append to body
    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // Show popup
    showPopup('teacher-info-popup', 'overlay-teacher-info-popup');
}

function showPopup(popupId: string, overlayId: string): void {
    const popup = document.getElementById(popupId) as HTMLDivElement | null;
    const overlay = document.getElementById(overlayId) as HTMLDivElement | null;

    if (!popup || !overlay) {
        console.error("Popup or overlay element not found");
        return;
    }

    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function hidePopup(popupId: string, overlayId: string): void {
    const popup = document.getElementById(popupId) as HTMLDivElement | null;
    const overlay = document.getElementById(overlayId) as HTMLDivElement | null;

    if (!popup || !overlay) {
        console.error("Popup or overlay element not found");
        return;
    }

    popup.style.display = 'none';
    overlay.style.display = 'none';
}

// Attach functions to window for external access
(window as any).showPopup = showPopup;
(window as any).hidePopup = hidePopup;
