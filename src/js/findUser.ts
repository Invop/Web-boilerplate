import {FormattedUser} from "./models/FormattedUser";
import {SearchParams} from "./models/SearchParams";

export function findUser(users: FormattedUser[], params: SearchParams[]): FormattedUser[] {
    return users.filter(user =>
        params.some(param => {
            const { key, value } = param;
            const userValue = user[key]?.toString().toLowerCase();
            const searchValue = value.toString().toLowerCase();
            return userValue && userValue.includes(searchValue);
        })
    );
}
