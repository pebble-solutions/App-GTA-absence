/**
 * Retourne une date au format français standard JJ/MM/AAA
 * @param {String | Date} date la date à formater
 * @returns {String} date au nouveau format
 */
export function formatDateFr(date){
    let newDate = new Date(date);
    let format = newDate.toLocaleDateString('fr-FR');
    return format;
}