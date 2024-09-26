import '../css/app.css';
import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock';
import { generateUsers } from './formatUsers';
import { User } from './models/User';
import { FormattedUser } from './models/FormattedUser';
import { ValidationResult } from './models/ValidationResult';
import { generateTeacherCard } from "./generateTeacherCard";
import { filterUsers } from "./filterUsers";
import { FilterParams, Range } from './models/FilterParams';
import { generateTeacherPopup } from './generateTeacherPopup';
import { validateFormattedUser } from './validateFormattedUser';
import {generateFavoritesSection} from "./generateFavoritesSection";

const users: User[] = randomUserMock as User[];
const additionalFormattedUsers: Partial<FormattedUser>[] = additionalUsers as Partial<FormattedUser>[];
const formattedUsers: FormattedUser[] = generateUsers(users, additionalFormattedUsers);

export const validFormattedUsers: FormattedUser[] = formattedUsers.filter((user) => {
  const validationResult: ValidationResult = validateFormattedUser(user);
  return validationResult.isValid;
});

const ageFilter = document.getElementById('age-filter') as HTMLSelectElement;
const regionFilter = document.getElementById('region-filter') as HTMLSelectElement;
const sexFilter = document.getElementById('sex-filter') as HTMLSelectElement;
const photoFilter = document.getElementById('photo-filter') as HTMLInputElement;
const favoritesFilter = document.getElementById('favorites-filter') as HTMLInputElement;



export function updateTeacherGrid(users: FormattedUser[]) {
  const gridContainer = document.querySelector('.teacher-grid');
  if (gridContainer) {
    gridContainer.innerHTML = '';
    users.forEach(user => {
      const teacherCard = generateTeacherCard(user);
      teacherCard.addEventListener('click', () => {
        generateTeacherPopup(user);
      });
      gridContainer.appendChild(teacherCard);
    });
  }
}

function getFilterParams(): FilterParams {
  const ageRange = ageFilter.value !== 'all' ? ageFilter.value.split('-') : null;
  const ageRangeObj: Range<number> | undefined = ageRange ? {
    min: parseInt(ageRange[0], 10),
    max: ageRange[1] ? parseInt(ageRange[1], 10) : undefined
  } : undefined;

  return {
    country: regionFilter.value !== 'all' ? regionFilter.value : undefined,
    ageRange: ageRangeObj,
    gender: sexFilter.value !== 'all' ? sexFilter.value.charAt(0).toUpperCase() + sexFilter.value.slice(1) as 'Male' | 'Female' : undefined,
    favorite: favoritesFilter.checked ? true : undefined,
    hasPhoto: photoFilter.checked ? true : undefined
  };
}

function onFilterChange() {
  const filterParams = getFilterParams();
  const filteredUsers = filterUsers(validFormattedUsers, filterParams);
  updateTeacherGrid(filteredUsers);
}

function populateRegionFilter() {
  const regions = new Set<string>();
  validFormattedUsers.forEach(user => {
    if (user.country) {
      regions.add(user.country);
    }
  });
  regionFilter.innerHTML = '<option value="all">All</option>';
  regions.forEach(region => {
    const option = document.createElement('option');
    option.value = region.toLowerCase();
    option.textContent = region;
    regionFilter.appendChild(option);
  });
}

export const favoritesSection = generateFavoritesSection(validFormattedUsers);

ageFilter.addEventListener('change', onFilterChange);
regionFilter.addEventListener('change', onFilterChange);
sexFilter.addEventListener('change', onFilterChange);
photoFilter.addEventListener('change', onFilterChange);
favoritesFilter.addEventListener('change', onFilterChange);

document.addEventListener('DOMContentLoaded', () => {
  populateRegionFilter();
  updateTeacherGrid(validFormattedUsers);
  favoritesSection.updateFavorites();
});
