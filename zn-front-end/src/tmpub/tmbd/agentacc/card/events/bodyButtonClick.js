/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/
import { toast } from 'nc-lightapp-front';
import {BatchCopy} from '../../util/ButtonUtil.js';
import { card_from_id, card_table_id } from '../../cons/constant.js';

export const bodyButtonClick = function (props, key, text, record, index, tableId) {
    switch (key) {
        //展开
        case 'Openline':
            let org = props.form.getFormItemsValue(card_from_id, 'pk_org')
            if (org.value && org.display) {
                props.cardTable.toggleRowView(card_table_id, record);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000032')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
        //复制
        case 'Copyline':
            props.cardTable.pasteRow(tableId, index);
            let noneData =  { value: '', display: null };
            props.cardTable.setValByKeyAndIndex(tableId, index + 1, 'enablestate', noneData);
            props.cardTable.setValByKeyAndIndex(tableId, index + 1, 'linestatus', noneData);
            props.cardTable.setValByKeyAndIndex(tableId, index + 1, 'ts', noneData);
            props.cardTable.setValByKeyAndIndex(tableId, index + 1, 'pk_agentacccfg_b', noneData);
            props.cardTable.setValByKeyAndIndex(tableId, index + 1, 'pk_bankaccbas', noneData);
            break;
        //插行
        case 'Insertline':
            props.cardTable.addRow(tableId,index)
            break;
        //删除
        case 'Deleteline':
            if (record.values.linestatus.value === '1'){
                toast({ color: 'warning', content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000028') });/* 国际化处理： 仅允许删除未确认的成员单位!*/
					return;
            }
            else {
                props.cardTable.delRowsByIndex(tableId, index);
            }
            break;
        //粘贴至此
        case 'Pasteline':
            if (index != 0 && !index) {
                index = props.cardTable.getNumberOfRows(tableId, false);
            }
            BatchCopy(props, tableId, index);//调用组件使用粘贴
            this.setState({ pasteflag: false }, () => { this.toggleCopy() });
            break;
            
    }
}

/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/