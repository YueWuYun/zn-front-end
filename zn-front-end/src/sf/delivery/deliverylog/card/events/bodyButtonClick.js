/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';

export const bodyButtonClick = function (props, key, text, record, index, tableId) {
    switch (key) {
        //展开（浏览态）
        case 'OpenDown':
        //收起
        case 'CloseDown':
            props.cardTable.toggleRowView(tableId, record);
            break;
        default:
            break;
    }
}
/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/