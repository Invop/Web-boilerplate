import { FormattedUser } from './models/FormattedUser';
import { SortParams } from './models/SortParams';
import { sortUsers } from './sortUsers';

let currentPage = 1;
const rowsPerPage = 10;
let currentSort: SortParams = { key: 'full_name', order: 'asc' };
let usersList: FormattedUser[] = [];

function generateTableRows(users: FormattedUser[]): string {
    return users.map(user => `
        <tr>
            <td data-label="Name">${user.full_name}</td>
            <td data-label="Speciality">${user.course}</td>
            <td data-label="Age">${user.age}</td>
            <td data-label="Gender">${user.gender}</td>
            <td data-label="Nationality">${user.country}</td>
        </tr>
    `).join('');
}

function updateStatisticsTable() {
    const tbody = document.querySelector('.table-container tbody');
    if (tbody) {
        const start = (currentPage - 1) * rowsPerPage;
        const paginatedUsers = usersList.slice(start, start + rowsPerPage);
        tbody.innerHTML = generateTableRows(paginatedUsers);
    }
}

function generatePaginationControls() {
    const paginationContainer = document.getElementById('pagination');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';

        const pageCount = Math.ceil(usersList.length / rowsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.className = 'page-link';
            pageLink.textContent = `${i}`;
            pageLink.addEventListener('click', (event) => {
                event.preventDefault();
                currentPage = i;
                updateStatisticsTable();
                updateActivePageLink();
            });

            paginationContainer.appendChild(pageLink);
        }

        updateActivePageLink();
    }
}

function updateActivePageLink() {
    const paginationContainer = document.getElementById('pagination');
    if (paginationContainer) {
        const pageLinks = paginationContainer.querySelectorAll('.page-link');
        pageLinks.forEach((link, index) => {
            if (index + 1 === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

function addSortEventListeners() {
    const headers: { id: string, key: SortParams['key'] }[] = [
        { id: 'sortName', key: 'full_name' },
        { id: 'sortSpeciality', key: 'course' },
        { id: 'sortAge', key: 'age' },
        { id: 'sortGender', key: 'gender' },
        { id: 'sortNationality', key: 'country' }
    ];

    headers.forEach(header => {
        const element = document.getElementById(header.id);
        if (element) {
            element.addEventListener('click', () => {
                if (currentSort.key === header.key) {
                    currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort = { key: header.key, order: 'asc' };
                }

                usersList = sortUsers(usersList, currentSort);
                currentPage = 1;
                updateStatisticsTable();
                updateActivePageLink();
            });
        }
    });
}
function setUsersList(users: FormattedUser[]) {
    usersList = users;
    generatePaginationControls();
    updateStatisticsTable();
}

export { setUsersList, addSortEventListeners };
