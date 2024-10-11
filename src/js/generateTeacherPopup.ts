import { FormattedUser } from './models/FormattedUser';
import { generateTeacherCard } from './generateTeacherCard';
import { applyFiltersAndRender } from './app';
import L from 'leaflet';
import dayjs from 'dayjs';

// Default coordinates
const DEFAULT_LATITUDE = 51.505;
const DEFAULT_LONGITUDE = -0.09;

function initMap(lat: number, lng: number, mapElement: HTMLElement): void {
    const map = L.map(mapElement).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup('Teacher Location')
        .openPopup();
}

export function generateTeacherPopup(user: FormattedUser, users: FormattedUser[]): void {
    const existingPopup = document.getElementById('teacher-info-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    const existingOverlay = document.getElementById('overlay-teacher-info-popup');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay-teacher-info-popup';
    overlay.onclick = () => hidePopup('teacher-info-popup', 'overlay-teacher-info-popup');

    const popup = document.createElement('div');
    popup.className = 'popup teacher-info-popup';
    popup.id = 'teacher-info-popup';

    const starIconHTML = user.favorite
        ? '<span class="star-icon" style="color: gold; cursor: pointer;">★</span>'
        : '<span class="star-icon" style="cursor: pointer;">★</span>';

    const daysUntilBirthday = user.b_day ? calculateDaysUntilNextBirthday(user.b_day) : 'N/A';
    popup.innerHTML = `
        <div class="header-popup">
            <h1>Teacher Info</h1>
            <button class="close-btn-popup">&times;</button>
        </div>
        <div class="content-popup">
            <img src="${user.picture_large ?? 'https://via.placeholder.com/100'}" alt="Teacher Avatar" class="avatar">
            <div class="info-popup">
                <h2>${user.full_name}</h2>
                <div class="star-icon-container">${starIconHTML}</div>
                <div class="details-popup">
                    <p>${user.course}</p>
                    <p>${user.city}, ${user.country}</p>
                    <p>${user.age}, ${user.gender}</p>
                    <p>Days until next birthday: ${daysUntilBirthday}</p>
                    <p>${user.email}</p>
                    <p>${user.phone}</p>
                    <div class="map-container" id="map" style="height: 0; overflow: hidden;"></div>
                </div>
            </div>
        </div>
        <div class="bio">
            <p>${user.note}</p>
        </div>
        <a href="#" class="toggle-map">Toggle map</a>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // Attach event listener to star icon using event delegation
    const starIcon = popup.querySelector('.star-icon') as HTMLElement;
    starIcon.addEventListener('click', () => {
        user.favorite = !user.favorite;
        updateUserCard(user, users);
        generateTeacherPopup(user, users); // Re-generate popup with updated data
        applyFiltersAndRender();
    });

    // Attach event listener to close button
    const closeButton = popup.querySelector('.close-btn-popup') as HTMLElement;
    closeButton.addEventListener('click', () => hidePopup('teacher-info-popup', 'overlay-teacher-info-popup'));

    // Attach event listener to Toggle map link
    const toggleMapLink = popup.querySelector('.toggle-map') as HTMLElement;
    const coordinates = user.coordinates;
    const latitude = coordinates?.latitude ? parseFloat(coordinates.latitude) : DEFAULT_LATITUDE;
    const longitude = coordinates?.longitude ? parseFloat(coordinates.longitude) : DEFAULT_LONGITUDE;

    toggleMapLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mapContainer = document.getElementById('map') as HTMLElement;
        if (mapContainer.style.height === '0px') {
            mapContainer.style.height = '300px';
            initMap(latitude, longitude, mapContainer);
        } else {
            mapContainer.style.height = '0';
        }
    });

    showPopup('teacher-info-popup', 'overlay-teacher-info-popup');
}

function calculateDaysUntilNextBirthday(birthDateString: string): number {
    const today = dayjs();
    const birthDate = dayjs(birthDateString);
    let nextBirthday = birthDate.year(today.year());

    if (nextBirthday.isBefore(today)) {
        nextBirthday = nextBirthday.add(1, 'year');
    }

    return nextBirthday.diff(today, 'day');
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

export function hidePopup(popupId: string, overlayId: string): void {
    const popup = document.getElementById(popupId) as HTMLDivElement | null;
    const overlay = document.getElementById(overlayId) as HTMLDivElement | null;

    if (!popup || !overlay) {
        console.error("Popup or overlay element not found");
        return;
    }

    popup.style.display = 'none';
    overlay.style.display = 'none';
}

function updateUserCard(user: FormattedUser, users: FormattedUser[]): void {
    const teacherGrid = document.querySelector('.teacher-grid');
    if (!teacherGrid) {
        console.error('Teacher grid not found');
        return;
    }

    const userCard = teacherGrid.querySelector(`[data-name="${user.id}"]`);
    if (!userCard) {
        console.error('User card not found');
        return;
    }

    const newCard = generateTeacherCard(user);
    newCard.setAttribute('data-name', user.id);
    newCard.setAttribute('data-index', users.indexOf(user).toString()); // Ensure the new card has the correct index

    teacherGrid.replaceChild(newCard, userCard);
}

(window as any).showPopup = showPopup;
(window as any).hidePopup = hidePopup;
