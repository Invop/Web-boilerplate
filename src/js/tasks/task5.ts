import {FormattedUser} from "../models/FormattedUser";
import {SearchParams} from "../models/SearchParams";

export function findUser(users: FormattedUser[], params: SearchParams): FormattedUser | undefined {
    const { key, value } = params;
    return users.find(user => user[key] === value);
}
