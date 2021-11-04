//zPpBovT29EyoCeGjE4sa1bw/iIXm5VKjhWchHBPHVZvSpFBPNCgR7JFXsnxTHX0l
import { PRIMARTKEY, LIST_BUTTON } from '../../constant';
import { listEdit, listDelete } from './listOperator';

//列表操作列按钮操作
export function bodyButtonClick(props, key, text, record, index) {
    // let pk = record[PRIMARTKEY.head_id] && record[PRIMARTKEY.head_id].value;

    let pk = record.values[PRIMARTKEY.head_id] && record.values[PRIMARTKEY.head_id].value;

    switch (key) {
        //修改
        case 'editrow':
            listEdit(props, pk);
            break;
        //删除
        case 'del':
            listDelete(props, pk, index);
            break;
    }
}

//zPpBovT29EyoCeGjE4sa1bw/iIXm5VKjhWchHBPHVZvSpFBPNCgR7JFXsnxTHX0l