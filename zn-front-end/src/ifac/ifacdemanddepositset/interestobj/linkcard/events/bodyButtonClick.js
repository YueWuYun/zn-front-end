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
        case 'Insertline':
            props.cardTable.addRow(tableId,index)
            break;
        case 'DeleteRow':
            let currRows = props.cardTable.getCheckedRows(tableId);
            let currSelect = [];
      
            if(currRows.length===0){
              toast({color:"warning",content:that.state.json['36340AIAC-000016']})/* 国际化处理： 请选择要删除的行*/
              break;
            }
      
            if (currRows && currRows.length > 0) {
              for (let item of currRows) {
                currSelect.push(item.index);
              }
            }
            props.cardTable.delRowsByIndex(tableId, currSelect);
            break;
        case 'SaveRow':
            let number =  props.cardTable.getNumberOfRows(tableId, false);
            if(number===0){
              props.cardTable.addRow(tableId);
            }else{
              let currRowssave = props.cardTable.getCheckedRows(tableId);
              let index;
              if(currRowssave.length===0){
                props.cardTable.addRow(tableId);
              }else{
                for (let item of currRowssave) {
                  index = item.index;
                }
                props.cardTable.addRow(tableId,index+1);
              }
            }
            let rownum = that.props.cardTable.getNumberOfRows('applychild');
            let values = ['pk_currtype','money','protruding','account_type'];
      
            values.forEach((val) => {
                let key = val;
                if (props.form.getFormItemsValue(formId, key)) {
                  let value;
                  let dly;
                  let scale
                  if(key==='account_type'){
                    value = '0';
                    dly = that.state.json['36340AIAC-000001'];/* 国际化处理： 活期*/
                  }else{
                    value = props.form.getFormItemsValue(formId, key).value;
                    dly = props.form.getFormItemsValue(formId, key).display;
                    scale = props.form.getFormItemsValue(formId, key).scale;
                  }
                  props.cardTable.setValByKeyAndIndex(tableId, rownum - 1, key, {
                       value: value,
                       scale:scale ,
                       display: dly
                  });
                }
            });
            break;
            
    }
}

/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/