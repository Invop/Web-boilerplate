import { FormattedUser } from "./models/FormattedUser";
import { SearchParams } from "./models/SearchParams";

import _ from 'lodash';

export function findUser(users: FormattedUser[], params: SearchParams[]): FormattedUser[] {
    return _.filter(users, user =>
        _.some(params, param => {
            const { key, value } = param;
            const userValue = user[key]?.toString().toLowerCase();
            const searchValue = value.toString().toLowerCase();
            return userValue && _.includes(userValue, searchValue);
        })
    );
}
