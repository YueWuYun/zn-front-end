/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/
import { ajax, base, toast, cardCache } from 'nc-lightapp-front';
import { base_url, link_card_page_id, card_from_id, card_table_id, viewmod_deal, dataSource } from '../../cons/constant';
import { initTemplate } from './initTemplate';
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator } from '../../../../pub/utils/SFButtonUtil';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

export const bodyButtonClick = function (props, key, text, record, index, tableId) {
    // let status = props.getUrlParam("status");
    let pk_org = this.props.form.getFormItemsValue(card_from_id, 'pk_org').value;
    switch (key) {
        //肩部 增行
        case 'addline':
            //设置收款单位内部账户的可编辑性
            if (pk_org) {
                // AddLine(props,card_table_id);

                let busitype = props.form.getFormItemsValue(card_from_id, 'busitype').value;
                let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
                let pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group').value;
                index = 0;
                let rows = props.cardTable.getCheckedRows(card_table_id);
                if (rows.length > 0) {
                    index = rows[rows.length - 1].index;
                } else {
                    index = props.cardTable.getNumberOfRows(card_table_id) - 1;
                }
                InsertLine(props, card_table_id, index);
                props.cardTable.setValByKeyAndIndex(card_table_id, index + 1, 'pk_org', { value: pk_org, display: '' });
                props.cardTable.setValByKeyAndIndex(card_table_id, index + 1, 'pk_group', { value: pk_group, display: '' });
                let meta = this.props.meta.getMeta();
                meta[card_table_id].items.find((e) => e.attrcode == 'pk_org_r').isShowUnit = true;
                if (busitype != 2) {
                    props.cardTable.setEditableByIndex(card_table_id,
                        [index], 'pk_accid_r', false);

                }
            } else {
                toast({
                    'color': 'warning',
                    'content': loadMultiLang(this.props,'36320FA-000003')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
        //展开（浏览态）
        case 'opendown':
        //收起
        case 'closedown':
            props.cardTable.toggleRowView(card_table_id, record);
            break;
        //展开（编辑态）
        case 'openright':
            props.cardTable.openModel(card_table_id, 'edit', record, index);
            break;
        //肩部 删行
        case 'deleteline':
            BatchDelLine(props, card_table_id);
            props.button.setButtonDisabled(['deleteline', 'copyline'], true);
            break;
        //肩部 复制行
        case 'copyline':
            let selectRows = props.cardTable.getCheckedRows(card_table_id);
            if (selectRows == null || selectRows.length == 0) {
                toast({
                    'color': 'warning',
                    'content': loadMultiLang(this.props,'36320FA-000004')/* 国际化处理： 未选中要复制的行*/
                });
                return false;
            }
            this.setState({ copyflag: true }, () => { this.toggleShow() });
            // BatchCopy(props, card_table_id);
            // this.setState({ isRowCopy: true });
            break;
        //粘贴至末行
        case 'copytoendline':
            index = this.props.cardTable.getNumberOfRows(card_table_id);
            BatchCopy(props, card_table_id, index, 'pk_allocate_b');
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'ts', { value: null, display: null });
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'paystatus', { value: null, display: null });
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'recordstatus', { value: null, display: null });
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'pk_allocate_b', { value: null, display: null });
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'encryptkey', { value: null, display: null });
            this.setState({ copyflag: false }, () => { this.toggleShow() });
            break;
        //粘贴至此
        case 'copythis':
            BatchCopy.call(this, props, card_table_id, index, 'pk_allocate_b');
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'ts', { value: null, display: null });
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'paystatus', { value: null, display: null });
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'recordstatus', { value: null, display: null });
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'pk_allocate_b', { value: null, display: null });
            props.cardTable.setValByKeyAndIndex(card_table_id, index, 'encryptkey', { value: null, display: null });
            this.setState({ copyflag: false }, () => { this.toggleShow() });
            break;
        //取消复制
        case 'cancelcopy':
            this.setState({ copyflag: false }, () => { this.toggleShow() });
            break;
        //行 展开
        case 'open':
            Open(props, card_table_id, index, record, 'edit');
            break;
        //行 复制
        case 'copyrow':
            CopyLine(props, card_table_id, index);
            break;
        case 'insertrow':
            InsertLine(props, card_table_id, index);
            break;
        //行 删除
        case 'deleterow':
            DelLine(props, card_table_id, index);
            break;
    }
}


/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/