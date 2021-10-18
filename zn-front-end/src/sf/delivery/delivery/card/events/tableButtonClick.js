/*0GI1xcoeligdpMeXoHBphl0GNEszI+D1/NroCR6iR3BekktQme7YijczRGlxFJLg*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';

import { app_id, module_id, base_url, list_search_id,
	list_table_id, button_limit, 
	oid,card_page_id,card_from_id,
	card_fromtail_id,card_table_id } from '../../cons/constant.js';

import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator } from '../../../../pub/utils/SFButtonUtil.js';
import { clsRowno } from "../../util/index";

export default function tableButtonClick(props, key, text, record, index) {
    // console.log(key);
    let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
    let org_val,org_display;
    if(pk_org){
      org_val = pk_org.value;
      org_display = pk_org.display;
    }
    switch (key) {
        // 展开
        case 'open_inner':
            if (org_val && org_display) {
                props.cardTable.toggleRowView(card_table_id, record);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
        // 收回
        case 'unopen_inner':
            if (org_val && org_display) {
                props.cardTable.toggleRowView(card_table_id, record);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
        case 'copyline_inner':
            if (org_val && org_display) {
                props.cardTable.pasteRow(card_table_id, index);
                let isreversebusitype_copyline = props.form.getFormItemsValue(card_from_id, 'isreversebusitype');
                if(isreversebusitype_copyline && isreversebusitype_copyline.value){
                    // 不可以编辑
                    props.cardTable.setEditableByIndex(card_table_id, index, 'isnetpay', false);
                    props.cardTable.setEditableByIndex(card_table_id, index, 'pay_type', false);
                    props.cardTable.setEditableByIndex(card_table_id, index, 'issamebank', false);
                    props.cardTable.setEditableByIndex(card_table_id, index, 'issamecity', false);
                }
                props.cardTable.setEditableByIndex(card_table_id, index, 'pk_bankacc_p', false);
                props.cardTable.setEditableByIndex(card_table_id, index, 'pk_accid', false);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
            case 'addline_inner':
            if (org_val && org_display) {
                props.cardTable.addRow(card_table_id);
                clsRowno(props, card_table_id);
                let isreversebusitype_addline = props.form.getFormItemsValue(card_from_id, 'isreversebusitype');
                if(isreversebusitype_addline && isreversebusitype_addline.value){
                    // 不可以编辑
                    props.cardTable.setEditableByIndex(card_table_id, index+1, 'isnetpay', false);
                    props.cardTable.setEditableByIndex(card_table_id, index+1, 'pay_type', false);
                    props.cardTable.setEditableByIndex(card_table_id, index+1, 'issamebank', false);
                    props.cardTable.setEditableByIndex(card_table_id, index+1, 'issamecity', false);

                }
                props.cardTable.setEditableByIndex(card_table_id, index, 'pk_bankacc_p', false);
                props.cardTable.setEditableByIndex(card_table_id, index, 'pk_accid', false);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
        case 'delline_inner':
            if (org_val && org_display) {
                props.cardTable.delRowsByIndex(card_table_id, index);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
        //编辑展开
        case 'editline_inner':
            if (org_val && org_display) {
                props.cardTable.openModel(card_table_id, 'edit', record, index);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
        //粘贴至此
        case 'copythis':
            let selectRows = props.cardTable.getCheckedRows(card_table_id);
            if (selectRows == null || selectRows.length == 0) {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000039')/* 国际化处理： 未选中要复制的行*/
                });
                return false;
            }
            if (index != 0 && !index) {
                index = props.cardTable.getNumberOfRows(card_table_id, false);
            }
            BatchCopy(props, card_table_id, index,'pk_delivery_b');//调用组件使用粘贴
            //处理复制张贴数据
            let isreversebusitype_copyline = props.form.getFormItemsValue(card_from_id, 'isreversebusitype');
            //表格行数
            let rownum_copyline = props.cardTable.getNumberOfRows(card_table_id);
            for (let i = 0; i < rownum_copyline; i++) {
                if(isreversebusitype_copyline && isreversebusitype_copyline.value){
                    // 不可以编辑
                    props.cardTable.setEditableByIndex(card_table_id, i, 'isnetpay', false);
                    props.cardTable.setEditableByIndex(card_table_id, i, 'pay_type', false);
                    props.cardTable.setEditableByIndex(card_table_id, i, 'issamebank', false);
                    props.cardTable.setEditableByIndex(card_table_id, i, 'issamecity', false);
                }
                props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', false);
                props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', false);
            }
            clsRowno(props, card_table_id);
            this.setState({ pasteflag: false }, () => { this.toggleShow() });
            break;
        default:
            break;
    }
}

/*0GI1xcoeligdpMeXoHBphl0GNEszI+D1/NroCR6iR3BekktQme7YijczRGlxFJLg*/