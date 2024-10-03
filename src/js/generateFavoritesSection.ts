import { FormattedUser } from './models/FormattedUser';
import { generateTeacherCard } from "./generateTeacherCard";
import { generateTeacherPopup } from './generateTeacherPopup';

export function generateFavoritesSection(users: FormattedUser[]) {
    const favoritesContainer = document.querySelector('.favorites-inner') as HTMLDivElement;
    const leftControl = document.querySelector('.favorites-control.left') as HTMLDivElement;
    const rightControl = document.querySelector('.favorites-control.right') as HTMLDivElement;

    let currentStartIndex = 0;
    let visibleCardsCount = 0;

    function calculateVisibleCardsCount() {
        const cardWidth = 200;
        const containerWidth = favoritesContainer.clientWidth;
        return Math.floor(containerWidth / cardWidth)+1;
    }

    function updateFavoritesCards() {
        const favorites = users.filter(user => user.favorite);
        visibleCardsCount = calculateVisibleCardsCount();
        favoritesContainer.innerHTML = '';

        for (let i = 0; i < visibleCardsCount; i++) {
            const user = favorites[(currentStartIndex + i) % favorites.length];
            const teacherCard = generateTeacherCard(user);
            teacherCard.classList.add('teacher-card');
            teacherCard.setAttribute('data-index', (currentStartIndex + i).toString());

            teacherCard.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                const card = target.closest('.teacher-card');
                if (card) {
                    const userIndex = card.getAttribute('data-index');
                    if (userIndex) {
                        const user = favorites[parseInt(userIndex)];
                        generateTeacherPopup(user, favorites);
                    }
                }
            });

            favoritesContainer.appendChild(teacherCard);
        }
    }

    function handleLeftControlClick() {
        const favorites = users.filter(user => user.favorite);
        currentStartIndex = (currentStartIndex - 1 + favorites.length) % favorites.length;
        updateFavoritesCards();
    }

    function handleRightControlClick() {
        const favorites = users.filter(user => user.favorite);
        currentStartIndex = (currentStartIndex + 1) % favorites.length;
        updateFavoritesCards();
    }

    leftControl.addEventListener('click', handleLeftControlClick);
    rightControl.addEventListener('click', handleRightControlClick);

    window.addEventListener('resize', () => {
        // Recalculate visible cards and re-render on window resize
        updateFavoritesCards();
    });

    updateFavoritesCards();

    return {
        updateFavorites: function() {
            updateFavoritesCards();
        }
    };
}
