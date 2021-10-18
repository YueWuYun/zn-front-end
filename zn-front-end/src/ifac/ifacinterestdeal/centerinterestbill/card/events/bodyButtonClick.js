/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { toast } from 'nc-lightapp-front';
import { card_from_id, card_table_id } from '../../cons/constant.js';


export const bodyButtonClick = function (props, key, text, record, index, tableId) {
    props.cardTable.toggleRowView(card_table_id, record);
}

/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/