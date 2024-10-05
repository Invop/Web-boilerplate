import { FormattedUser } from "./models/FormattedUser";
import { SortParams } from "./models/SortParams";

import _ from 'lodash';

export function sortUsers(users: FormattedUser[], params: SortParams): FormattedUser[] {
    const { key, order } = params;

    return _.orderBy(users, [key], [order]);
}
