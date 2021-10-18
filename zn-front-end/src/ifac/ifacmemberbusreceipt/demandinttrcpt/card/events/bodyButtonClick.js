/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { toast } from 'nc-lightapp-front';
// import {BatchCopy} from '../../util/ButtonUtil.js';
import { card_from_id, card_table_id } from '../../cons/constant.js';

export const bodyButtonClick = function (props, key, text, record, index, tableId) {
    let that = this;
    let org = props.form.getFormItemsValue(card_from_id, 'pk_org');
    switch (key) {
        //展开
        case 'Openline':
            if (org.value && org.display) {
                props.cardTable.toggleRowView(card_table_id, record);
            } else {
                toast({
                    'color': 'warning',
                    'content': '请先填写财务组织'
                });
                return;
            }
            break;
        //收起
        case 'Closeline':
            if (org.value && org.display) {
                props.cardTable.toggleRowView(card_table_id, record);
            } else {
                toast({
                    'color': 'warning',
                    'content': '请先填写财务组织'
                });
                return;
            }
            break;

        //编辑态 展开
        case 'OpenlineEdit':
          props.cardTable.openModel(card_table_id, 'edit', record, index);
          break;
        
        //插行
        case 'InsertRow':
            props.cardTable.addRow(tableId,index)
            break;
        case 'DeleteRow':
            let currRows = props.cardTable.getCheckedRows(tableId);
            let currSelect = [];
      
            if(currRows.length===0){
              toast({color:"warning",content:that.state.json['36050OA-000016']})/* 国际化处理： 请选择要删除的行*/
              break;
            }
      
            if (currRows && currRows.length > 0) {
              for (let item of currRows) {
                currSelect.push(item.index);
              }
            }
            props.cardTable.delRowsByIndex(tableId, currSelect);
            break;
        
            
    }
}

/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/