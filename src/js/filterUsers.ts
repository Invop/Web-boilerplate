// filterUsers function
import { FormattedUser } from "./models/FormattedUser";
import { FilterParams } from "./models/FilterParams";

export function filterUsers(users: FormattedUser[], params: FilterParams): FormattedUser[] {
    return users.filter(user => {
        if (params.country && user.country.toLowerCase() !== params.country.toLowerCase()) {
            return false;
        }

        if (params.ageRange) {
            const minAge = params.ageRange.min !== undefined ? params.ageRange.min : -Infinity;
            const maxAge = params.ageRange.max !== undefined ? params.ageRange.max : Infinity;
            if (user.age < minAge || user.age > maxAge) {
                return false;
            }
        }

        if (params.gender && user.gender !== params.gender) {
            return false;
        }

        if (params.favorite !== undefined && user.favorite !== params.favorite) {
            return false;
        }

        if (params.hasPhoto !== undefined) {
            const hasPhoto = user.picture_large || user.picture_thumbnail;
            if (params.hasPhoto && !hasPhoto) {
                return false;
            }
        }

        return true;
    });
}
