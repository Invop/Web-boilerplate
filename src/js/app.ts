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


import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock';
import { runTask1 } from './tasks/task1';
import { User } from './models/User';
import { FormattedUser } from './models/FormattedUser';
import { validateFormattedUser } from './tasks/task2';
import { ValidationResult } from './models/ValidationResult';
import {filterUsers} from "./tasks/task3";
import { SortParams } from "./models/SortParams";
import {sortUsers} from "./tasks/task4";
import {findUser} from "./tasks/task5";
import {SearchParams} from "./models/SearchParams";
import {FilterParams} from "./models/FilterParams";
import {calculatePercentage} from "./tasks/task6";

const users: User[] = randomUserMock as User[];
const additionalFormattedUsers: Partial<FormattedUser>[] = additionalUsers as Partial<FormattedUser>[];
//task1
const formattedUsers: FormattedUser[] = runTask1(users, additionalFormattedUsers);
//task2
/*formattedUsers.forEach(user => {
  const validationResult: ValidationResult = validateFormattedUser(user);
  if (validationResult.isValid) {
    console.log(`User ${user.full_name}: Valid`);
  } else {
    console.log(`User ${user.full_name}: Invalid. Errors:`);
    validationResult.errors.forEach(error => console.log(`- ${error}`));
  }
});*/
//task3
console.log("Testing task 3 (filterUsers)");
const filterParams = {
  country: 'USA',
  ageRange: { min: 30, max: 35 },
  gender: 'Male' as 'Male' | 'Female',
  favorite: true,
};
const filteredUsers = filterUsers(formattedUsers, filterParams);
console.log("Filtered users:", JSON.stringify(filteredUsers, null, 2));

//task4
console.log("Testing task 4 (sortUsers)");
const sortedByAgeAsc = sortUsers(formattedUsers, { key: 'age', order: 'asc' });
console.log("Sorted by age (asc):", JSON.stringify(sortedByAgeAsc, null, 2));

const sortedByFullNameDesc = sortUsers(formattedUsers, { key: 'full_name', order: 'desc' });
console.log("Sorted by full name (desc):", JSON.stringify(sortedByFullNameDesc, null, 2));




//task5
console.log("Testing task 5 (findUser)");
const searchByName: SearchParams = { key: 'full_name', value: 'Olivia Storm' };
const userByName = findUser(formattedUsers, searchByName);
console.log("Found user by full name 'Olivia Storm':", JSON.stringify(userByName, null, 2));

const searchByName2: SearchParams = { key: 'full_name', value: 'Olivia Stormsdf' };
const userByName2 = findUser(formattedUsers, searchByName2);
console.log("Found user by full name 'Olivia Stormsdf':", JSON.stringify(userByName2, null, 2));

const searchByAge: SearchParams = { key: 'age', value: 26 };
const userByAge = findUser(formattedUsers, searchByAge);
console.log("Found user by age 26:", JSON.stringify(userByAge, null, 2));

const searchByNote: SearchParams = { key: 'note', value: 'old lady with a cats' };
const userByNote = findUser(formattedUsers, searchByNote);
console.log("Found user by note 'old lady with a cats':", JSON.stringify(userByNote, null, 2));


//task6


const ageRangeFilter: FilterParams = { ageRange: { min: 25, max: 35 } };
const percentageAgeRange = calculatePercentage(formattedUsers, ageRangeFilter);
console.log(`Percentage of users aged between 25 and 35: ${percentageAgeRange}%`);

const femaleFilter: FilterParams = { gender: 'Female' };
const percentageFemales = calculatePercentage(formattedUsers, femaleFilter);
console.log(`Percentage of female users: ${percentageFemales}%`);

const favoriteFilter: FilterParams = { favorite: true };
const percentageFavorites = calculatePercentage(formattedUsers, favoriteFilter);
console.log(`Percentage of favorite users: ${percentageFavorites}%`);

const countryFilter: FilterParams = { country: 'Germany' };
const percentageFromUSA = calculatePercentage(formattedUsers, countryFilter);
console.log(`Percentage of users from Germany: ${percentageFromUSA}%`);
