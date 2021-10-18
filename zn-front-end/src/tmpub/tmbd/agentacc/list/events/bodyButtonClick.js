/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/
import { ajax, toast} from 'nc-lightapp-front';
//引入常量定义
import { list_table_id, list_page_id, card_page_id } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';

export default function bodyButtonClick(props, key, text, record, index, prop) {
    switch (key) {
        case 'Edit_i':
            this.addQueryCache();
            props.pushTo("/card", {status: "edit", id: record.pk_agentacccfg.value, pagecode: card_page_id });
            break;
        case 'Delete_i':
            beSureBtnClickDelete(props, record, index)
            break;
        case 'Confirm_i':
            beSureBtnClickConfirm(props, record, 'Confirm', index)
            break;
        case 'UnConfirm_i':
            beSureBtnClickConfirm(props, record, 'UnConfirm', index)
            break;
        case 'Modify_i':
            this.addQueryCache();
            props.pushTo("/card",{status: "edit", modify: 'modify', id: record.pk_agentacccfg.value, pagecode: card_page_id});
            break;
        case 'UnEnable':
            beSureBtnClickEnable(props, record, 'DISABLE', index);
            break;
        case 'Enable':
            beSureBtnClickEnable(props, record, 'ENABLE', index);
            break;
        default:
            break;
    }
}

//启用/停用
function beSureBtnClickEnable(props, record, action, index) {
    ajax({
        url: requesturl.enable,
        data: {
            actionname:action,
            pks: [record.pk_agentacccfg.value],
            ts: record.ts.value
        },
        success: (res) => {
            toast({ color: 'success', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000009') });/* 国际化处理： 操作成功*/
            let updateDataArr = [{
                index: index,
                data: { values: res.data.head[list_table_id].rows[0].values }
            }];
            props.table.updateDataByIndexs(list_table_id, updateDataArr);
        }
    });
}

//确认/取消确认
function beSureBtnClickConfirm(props, record, action, index) {
    ajax({
        url: requesturl.confirm,
        data: {
            actionname:action,
            pks: [record.pk_agentacccfg.value],
            ts: record.ts.value
        },
        success: (res) => {
            toast({ color: 'success', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000009') });/* 国际化处理： 操作成功*/
            let updateDataArr = [{
                index: index,
                data: { values: res.data.head[list_table_id].rows[0].values }
            }];
            props.table.updateDataByIndexs(list_table_id, updateDataArr);
        }
    });
}

//删除
function beSureBtnClickDelete(props, record, index) {
    let {deleteCacheId} = props.table;
    let pkMapTs = {};
    let pkMapRowIndex = {};
    pkMapRowIndex[record.pk_agentacccfg.value] = 1;
    pkMapTs[record.pk_agentacccfg.value] = record.ts.value;
    ajax({
        url: requesturl.delete,
        data: {
            pks: [record.pk_agentacccfg.value],
            tss: [record.ts.value],
            pkMapTs: pkMapTs,
            pkMapRowIndex: pkMapRowIndex,
            pageid: list_page_id
        },
        success: () => {
            toast({ color: 'success', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000009') });/* 国际化处理： 操作成功*/
            props.table.deleteTableRowsByIndex(list_table_id, index);
            deleteCacheId(list_table_id, record.pk_agentacccfg.value);
        }
    });
}


/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/