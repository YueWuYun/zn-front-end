//zPpBovT29EyoCeGjE4sa1bw/iIXm5VKjhWchHBPHVZvSpFBPNCgR7JFXsnxTHX0l
import { PRIMARTKEY, LIST_BUTTON,LIST } from '../../constant';
import { listEdit, listDelete } from './listOperator';
import {listCFSEdit} from './listOperatorCFS'
import {buttonVisibilityControl} from "./buttonVisibilityControl";

//列表表体操作列按钮操作
export function bodyButtonClick(props, key, text, record, index) {
    // let pk = record[PRIMARTKEY.head_id] && record[PRIMARTKEY.head_id].value;

    let pk = record.values[PRIMARTKEY.head_id] && record.values[PRIMARTKEY.head_id].value;

    switch (key) {
        //修改
        case LIST_BUTTON.bodyUpdate:
            props.setUrlParam({
                status: 'edit'
            });
            buttonVisibilityControl(props);
            let allRows = props.editTable.getAllRows(LIST.table_id);
            for (let i = 0; i < allRows.length; i++) {
                props.editTable.setEditableRowByRowId(LIST.table_id, allRows[i].rowid, false);
            }
            props.editTable.setEditableByKey(LIST.table_id, record.rowid,'name', true);
            props.editTable.setEditableByKey(LIST.table_id, record.rowid, 'isdefault', true);
            props.editTable.setEditableByKey(LIST.table_id, record.rowid, 'enablestate', true);

            break;
        //删除
        case LIST_BUTTON.bodyDelete:
            listDelete(props, pk, index);
            break;
        //成本中心结构
        case LIST_BUTTON.centergroup:
            listEdit(props, record, index);
            break;
        //成本要素结构
        case LIST_BUTTON.factorgroup:
            listCFSEdit(props, record, index);
            break;
    }
}

//zPpBovT29EyoCeGjE4sa1bw/iIXm5VKjhWchHBPHVZvSpFBPNCgR7JFXsnxTHX0l