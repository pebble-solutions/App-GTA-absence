import toDateFr from "./formatDateFr";

/**
 * Retourne une date au format français court :Jou JJ/MM
 * @param {String | Date} date la date à formater
 * @returns {String} date au nouveau format
 */
export default function formatDateFr(date){
    return toDateFr(date, 'short');
}