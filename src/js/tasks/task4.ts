// tasks/task4.ts
import { FormattedUser } from "../models/FormattedUser";
import { SortParams } from "../models/SortParams";

export function sortUsers(users: FormattedUser[], params: SortParams): FormattedUser[] {
    const { key, order } = params;

    return users.sort((a, b) => {
        let comparison = 0;

        if (key === 'age') {
            comparison = a.age - b.age;
        } else if (key === 'b_day') {
            const dateA = new Date(a.b_day || "").getTime();
            const dateB = new Date(b.b_day || "").getTime();
            comparison = dateA - dateB;
        } else {
            const valueA = a[key] as string;
            const valueB = b[key] as string;

            comparison = valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
        }

        return order === 'asc' ? comparison : -comparison;
    });
}
