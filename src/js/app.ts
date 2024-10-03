// app.ts

// Import the necessary functions and types
import '../css/app.css';
import { User } from './models/User';
import { getFormatedUsers } from './formatUsers';
import { FormattedUser } from './models/FormattedUser';
import { generateTeacherCard } from './generateTeacherCard';
import { generateTeacherPopup } from "./generateTeacherPopup";
import { validateFormattedUser } from "./validateFormattedUser";
import { filterUsers } from "./filterUsers";
import { FilterParams, Range } from "./models/FilterParams";
import { findUser } from "./findUser";
import { SearchParams } from "./models/SearchParams";
import { setUsersList, addSortEventListeners } from './generateTable';
import { generateFavoritesSection } from './generateFavoritesSection';
const randomUserAPI = 'https://randomuser.me/api/?results=';
const batchSize = 50;
let formattedAndValidUsers: FormattedUser[] = [];
let countries: Set<string> = new Set();
let currentFilterParams: FilterParams = {};
let searchParams: SearchParams[] = [];
let favoriteSectionUpdater: { updateFavorites: () => void } | null = null;
async function fetchRandomUsers(batchSize: number): Promise<User[]> {
  try {
    const response = await fetch(`${randomUserAPI}${batchSize}`);

    if (response.ok) {
      const data = await response.json();
      return data.results as User[];
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
  const randomUsers = await fetchRandomUsers(batchSize);
  const formattedUsers = getFormatedUsers(randomUsers);
  const validFormattedUsers = formattedUsers.filter(user => {
    const validation = validateFormattedUser(user);
    if (!validation.isValid) {
      console.warn(`User validation failed: ${validation.errors.join(', ')}`);
    }
    return validation.isValid;
  });
  validFormattedUsers.forEach(user => {
    countries.add(user.country);
  });
  updateCountryFilter();
  formattedAndValidUsers = [...formattedAndValidUsers, ...validFormattedUsers];
  applyFiltersAndRender();

  if (!favoriteSectionUpdater) {
    favoriteSectionUpdater = generateFavoritesSection(formattedAndValidUsers);
  } else {
    favoriteSectionUpdater.updateFavorites();
  }
}

function updateCountryFilter(): void {
  const countryFilter = document.querySelector('#region-filter');
  if (countryFilter) {
    countryFilter.innerHTML = '<option value="all">All</option>';
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countryFilter.appendChild(option);
    });
  }
}

export function applyFiltersAndRender(): void {
  let filteredUsers = filterUsers(formattedAndValidUsers, currentFilterParams);

  if (searchParams.length > 0) {
    filteredUsers = findUser(filteredUsers, searchParams); // Apply search filters
  }

  // Update the teacher grid view
  createTeacherGrid(filteredUsers);

  // Update the table view
  setUsersList(filteredUsers);

  if (favoriteSectionUpdater) {
    favoriteSectionUpdater.updateFavorites();
  }
}

function createTeacherGrid(users: FormattedUser[]): void {
  const teacherGrid = document.querySelector('.teacher-grid');

  if (teacherGrid) {
    renderTeacherCards(teacherGrid, users);

    teacherGrid.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const card = target.closest('.teacher-card');
      if (card) {
        const userIndex = card.getAttribute('data-index');
        if (userIndex) {
          const user = users[parseInt(userIndex)];
          generateTeacherPopup(user, users);
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

async function loadMoreUsers(): Promise<void> {
  await setFormattedUsers();
}

function handleFilterChange(): void {
  const countryFilter = getFilterElement<HTMLSelectElement>('#region-filter');
  const ageFilter = getFilterElement<HTMLSelectElement>('#age-filter');
  const genderFilter = getFilterElement<HTMLSelectElement>('#sex-filter');
  const photoFilter = getFilterElement<HTMLInputElement>('#photo-filter');
  const favoritesFilter = getFilterElement<HTMLInputElement>('#favorites-filter');

  currentFilterParams.country = countryFilter.value !== 'all' ? countryFilter.value : undefined;
  currentFilterParams.ageRange = getAgeRange(ageFilter.value);
  currentFilterParams.gender = formatGender(genderFilter.value);
  currentFilterParams.hasPhoto = photoFilter.checked || undefined;
  currentFilterParams.favorite = favoritesFilter.checked || undefined;

  applyFiltersAndRender();
}

function getFilterElement<T extends HTMLElement>(selector: string): T {
  return document.querySelector(selector) as T;
}

function getAgeRange(value: string): Range<number> | undefined {
  switch (value) {
    case '18-25': return { min: 18, max: 25 };
    case '26-35': return { min: 26, max: 35 };
    case '36-45': return { min: 36, max: 45 };
    case '46+': return { min: 46, max: Infinity };
    default: return undefined;
  }
}

function formatGender(value: string): 'Male' | 'Female' | undefined {
  return value !== 'all' ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) as 'Male' | 'Female' : undefined;
}

async function initialize() {
  await setFormattedUsers();

  const loadMoreButton = document.querySelector('#load-more-btn');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadMoreUsers);
  }

  const countryFilter = document.querySelector('#region-filter');
  if (countryFilter) {
    countryFilter.addEventListener('change', handleFilterChange);
  }

  const ageFilter = document.querySelector('#age-filter');
  if (ageFilter) {
    ageFilter.addEventListener('change', handleFilterChange);
  }

  const sexFilter = document.querySelector('#sex-filter');
  if (sexFilter) {
    sexFilter.addEventListener('change', handleFilterChange);
  }

  const photoFilter = document.querySelector('#photo-filter');
  if (photoFilter) {
    photoFilter.addEventListener('change', handleFilterChange);
  }

  const favoritesFilter = document.querySelector('#favorites-filter');
  if (favoritesFilter) {
    favoritesFilter.addEventListener('change', handleFilterChange);
  }

  const searchButton = document.querySelector('.search-button');
  if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
  }

  // Add sort event listeners for the table headers
  addSortEventListeners();
}

function handleSearch(): void {
  const searchInput = document.querySelector('.search-input') as HTMLInputElement;
  if (!searchInput) return;

  const searchValue = searchInput.value.trim().toLowerCase();
  if (!searchValue) {
    searchParams = [];
  } else {
    searchParams = [
      { key: 'full_name', value: searchValue },
      { key: 'note', value: searchValue },
      { key: 'age', value: searchValue }
    ];
  }

  applyFiltersAndRender();
}

initialize();
