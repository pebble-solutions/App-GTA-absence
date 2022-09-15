/**
 * Transforme une date SQL en une date ISO8601
 * @param {String} date Date SQL à transformer
 * @returns {String}
 */
export default function sqlDateToIso(date) {
    date = date.replace(/(\d{4}-\d{2}-\d{2})\s/, '$1T');
    return date;
}