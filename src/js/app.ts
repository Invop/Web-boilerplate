import '../css/app.css';
import { User } from './models/User';
import axios from 'axios';
import { getFormatedUsers } from './formatUsers';
import { FormattedUser } from './models/FormattedUser';
import { generateTeacherCard } from './generateTeacherCard';
import { generateTeacherPopup } from "./generateTeacherPopup";

const randomUserAPI = 'https://randomuser.me/api/?results=10';
let formattedUsers: FormattedUser[] = [];

async function fetchRandomUsers(): Promise<User[]> {
  try {
    const response = await axios.get(randomUserAPI);

    if (response.status === 200) {
      return response.data.results as User[];
    } else {
      console.error('Failed to fetch users:', response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

async function setFormattedUsers(): Promise<void> {
  const randomUsers = await fetchRandomUsers();
  formattedUsers = getFormatedUsers(randomUsers);
  createTeacherGrid();
}
function createTeacherGrid(): void {
  const teacherGrid = document.querySelector('.teacher-grid');

  if (teacherGrid) {
    renderTeacherCards(teacherGrid, formattedUsers);

    teacherGrid.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const card = target.closest('.teacher-card');
      if (card) {
        const userIndex = card.getAttribute('data-index');
        if (userIndex) {
          const user = formattedUsers[parseInt(userIndex)];
          generateTeacherPopup(user, formattedUsers);
        }
      }
    });
  }
}
function renderTeacherCards(teacherGrid: Element, users: FormattedUser[]): void {
  teacherGrid.innerHTML = '';

  users.forEach((user, index) => {
    const teacherCard = generateTeacherCard(user);
    teacherCard.setAttribute('data-name', user.id);
    teacherCard.setAttribute('data-index', index.toString());
    teacherGrid.appendChild(teacherCard);
  });
}


(async function initialize() {
  await setFormattedUsers();
})();
