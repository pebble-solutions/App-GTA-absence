import sqlDateToIso from "./sqlDateToIso";

/**
 * Retourne une date au format français standard JJ/MM/AAA
 * @param {String | Date} date la date à formater
 * @returns {String} date au nouveau format
 */
export default function formatDateFr(date, size) {
    size = typeof size === 'undefined' ? 'short' : size;

    if (typeof date === 'string') {
        date = sqlDateToIso(date);
    }

    let newDate = new Date(date);
    let options = {weekday:'short', day:'numeric', month:'numeric'}

    if (size == 'long') {
        options.year = 'numeric';
    }
    
    let format = newDate.toLocaleDateString('fr-FR', options);
    return format;
}