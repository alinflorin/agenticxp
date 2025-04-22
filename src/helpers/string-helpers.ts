export const toCapitalCase = (s: string) => {
    if (!s) {
        return s;
    }
    if (s.length === 0) {
        return s;
    }
    if (s.length === 1) {
        return s.toUpperCase();
    }
    return s[0].toUpperCase() + s.substring(1);
}