import { FormattedUser } from './models/FormattedUser';
import { updateTeacherGrid, validFormattedUsers,favoritesSection } from './app';
import {setUsersList} from "./generateTable";

export function generateTeacherPopup(user: FormattedUser): void {
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
        ? '<span class="star-icon" id="star-icon" style="color: gold; cursor: pointer;">★</span>'
        : '<span class="star-icon" id="star-icon" style="cursor: pointer;">★</span>';

    popup.innerHTML = `
        <div class="header-popup">
            <h1>Teacher Info</h1>
            <button class="close-btn-popup" onclick="hidePopup('teacher-info-popup', 'overlay-teacher-info-popup')">&times;</button>
        </div>
        <div class="content-popup">
            <img src="${user.picture_large ?? 'https://via.placeholder.com/100'}" alt="Teacher Avatar" class="avatar">
            <div class="info-popup">
                <h2>${user.full_name}</h2>
                ${starIconHTML}
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

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    const starIcon = document.getElementById('star-icon');
    if (starIcon) {
        starIcon.addEventListener('click', () => {
            user.favorite = !user.favorite;
            updateTeacherGrid(validFormattedUsers);
            favoritesSection.updateFavorites();
            generateTeacherPopup(user);
        });
    }

    showPopup('teacher-info-popup', 'overlay-teacher-info-popup');
}

document.getElementById('add-teacher-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTeacher = createNewUser();
    if (newTeacher) {
        validFormattedUsers.push(newTeacher);
        updateTeacherGrid(validFormattedUsers);
        setUsersList(validFormattedUsers);
        hidePopup('add-teacher-popup', 'overlay-add-teacher-popup');
    } else {
        alert('Please fill all required fields correctly.');
    }
});

function createNewUser(): FormattedUser | null {
    const form = document.getElementById('add-teacher-form') as HTMLFormElement;
    const formData = new FormData(form);

    const gender = formData.get('teacher-sex') as string;

    if (!gender || !(gender === 'male' || gender === 'female')) {
        return null;
    }

    return {
        id: String(validFormattedUsers.length + 1),
        favorite: false,
        course: formData.get('teacher-speciality') as string,
        bg_color: formData.get('teacher-bgcolor') as string,
        note: formData.get('teacher-notes') as string || '',
        gender: gender.charAt(0).toUpperCase() + gender.slice(1) as 'Male' | 'Female',
        full_name: formData.get('teacher-name') as string,
        city: formData.get('teacher-city') as string,
        country: (formData.get('teacher-country') as string).toLowerCase(),
        email: formData.get('teacher-email') as string,
        age: calculateAge(new Date(formData.get('teacher-dob') as string)),
        phone: formData.get('teacher-phone') as string,
    };
}

function calculateAge(birthday: Date): number {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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

(window as any).showPopup = showPopup;
(window as any).hidePopup = hidePopup;
