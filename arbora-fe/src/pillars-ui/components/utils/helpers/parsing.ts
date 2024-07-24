export function formatNumberWithCommas(num: number | string): string {
    if (typeof num === 'number') {
        num = num.toString();
    }
    // if the string is not a valid number return as is
    if (isNaN(parseFloat(num))) {
        return num;
    }
    // split into integer and decimal parts
    let [integer, decimal] = num.split('.');
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimal ? `${integer}.${decimal}` : integer;
}