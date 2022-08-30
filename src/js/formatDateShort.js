/**
 * Retourne une date au format français court :Jou JJ/MM
 * @param {String | Date} date la date à formater
 * @returns {String} date au nouveau format
 */
export default function formatDateFr(date){
    let newDate = new Date(date);
    let options = {weekday:'short', day:'numeric', month:'numeric'}
    let format = newDate.toLocaleDateString('fr-FR', options);
    return format;
}