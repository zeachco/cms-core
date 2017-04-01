export default function currency(n) {
    if (n === null) return '???';
    if (typeof n === 'undefined') return '???';
    if (isNaN(n)) return '???';
    let string = (+n).toFixed(2);
    string = string.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    if (n < 0) return `(${string.replace('-', '')})`;
    return string;
}
