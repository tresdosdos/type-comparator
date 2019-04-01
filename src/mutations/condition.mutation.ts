import { asc } from "../comparators/asc.comparator";
import { Comparator } from "../interfaces";

export function condition(c: (item: any) => boolean, f: Comparator): Comparator {
    return (a, b) => {
        const condA = c(a);
        const condB = c(b);

        if (condA === condB) {
            return f(a, b);
        } else {
            return asc(condA, condB);
        }
    };
}
