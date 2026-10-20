// Small string helpers shared by every service: case conversion, email/data-URL checks.

// Throws a clear TypeError naming the function, instead of a harder-to-trace native
// "Cannot read properties of undefined" a few frames deep inside .toLowerCase()/.split().
function assertString(value: unknown, origin: string): asserts value is string {
    if (typeof value !== 'string') {
        throw new TypeError(`${origin}: expected a string, received ${typeof value}`);
    }
}

export function firstLetterUppercase(str: string): string {
    assertString(str, 'firstLetterUppercase()');
    const valueString = str.toLowerCase();
    return valueString
        .split(' ')
        .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
        .join(' ');
}

export function lowerCase(str: string): string {
    assertString(str, 'lowerCase()');
    return str.toLowerCase();
}

export const toUpperCase = (str: string): string => {
    return str ? str.toUpperCase() : str;
};

// Validators: a non-string input is simply "not a match" rather than a thrown error, since
// these are typically used as boolean checks on untrusted input (e.g. request bodies).
export function isEmail(email: string): boolean {
    if (typeof email !== 'string' || !email) return false;
    const regexExp =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
    return regexExp.test(email);
}

export function isDataURL(value: string): boolean {
    if (typeof value !== 'string' || !value) return false;
    const dataUrlRegex =
        /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
    return dataUrlRegex.test(value);
}
