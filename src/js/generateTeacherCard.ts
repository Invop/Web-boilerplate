import {FormattedUser} from "./models/FormattedUser";


export function generateTeacherCard(user: FormattedUser): HTMLElement {
    const card = document.createElement('div');
    card.className = 'teacher-card';

    const img = document.createElement('img');
    img.src = user.picture_large ?? '';
    img.alt = `${user.full_name} Photo`;
    img.className = 'teacher-image';
    card.appendChild(img);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'teacher-info';

    const infoContainer = document.createElement('div');
    infoContainer.className = 'teacher-info-container';

    const namePara = document.createElement('p');
    namePara.className = 'teacher-info-name';
    namePara.innerText = user.full_name.split(' ')[0];
    infoContainer.appendChild(namePara);

    const lastNamePara = document.createElement('p');
    lastNamePara.className = 'teacher-info-last-name';
    lastNamePara.innerText = user.full_name.split(' ')[1];
    infoContainer.appendChild(lastNamePara);

    infoDiv.appendChild(infoContainer);

    const coursePara = document.createElement('p');
    coursePara.className = 'teacher-info-specialization';
    coursePara.innerText = user.course;
    infoDiv.appendChild(coursePara);

    const geoPara = document.createElement('p');
    geoPara.className = 'teacher-info-geo';
    geoPara.innerText = user.country;
    infoDiv.appendChild(geoPara);

    card.appendChild(infoDiv);

    return card;
}
