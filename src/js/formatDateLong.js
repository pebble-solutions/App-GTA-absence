import toDateFr from "./formatDateFr";

/**
 * Retourne une date au format français long :Jou JJ/MM/AAAA
 * @param {String | Date} date la date à formater
 * @returns {String} date au nouveau format
 */
export default function formatDateFr(date){
    return toDateFr(date, 'long');
}