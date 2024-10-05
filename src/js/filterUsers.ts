// filterUsers function
import { FormattedUser } from "./models/FormattedUser";
import { FilterParams } from "./models/FilterParams";

import _ from 'lodash';

export function filterUsers(users: FormattedUser[], params: FilterParams): FormattedUser[] {
    return _.filter(users, user => {
        if (params.country && !_.isEqual(_.toLower(user.country), _.toLower(params.country))) return false;

        if (params.ageRange && !_.inRange(user.age, params.ageRange.min || -Infinity, (params.ageRange.max || Infinity) + 1)) return false;

        if (params.gender && !_.isEqual(user.gender, params.gender)) return false;

        if (!_.isUndefined(params.favorite) && !_.isEqual(user.favorite, params.favorite)) return false;

        if (!_.isUndefined(params.hasPhoto) && params.hasPhoto && _.isEmpty(user.picture_large) && _.isEmpty(user.picture_thumbnail)) return false;

        return true;
    });
}
