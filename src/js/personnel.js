/**
 * Retourne l'organisation du personnel sous la forme de liste.
 * 
 * Le premier item de la liste est le niveau hiérarchique le plus haut, 
 * le dernier item correspond à "moi"
 * 
 * @param {array} managers Collection de Personnel managers
 * @param {object} me Personnel correspondant à "moi"
 * 
 * @returns {array}
 */
export function organizationChart(managers, me) {
    let list = [];
			
    managers.forEach((manager) => {
        list.push(manager);
    });

    list.push(me);

    list.sort((a, b) => {
        if (a.niveau_hierarchique > b.niveau_hierarchique) {
            return 1;
        }
        else if (a.niveau_hierarchique < b.niveau_hierarchique) {
            return -1;
        }
        return 0;
    });

    return list;
}