/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import {card_head_hidden_buttons,pkname,FixedWithDrawConst, formId } from "../../cons/constant";
import { getCurrentLastId } from '../../../../../tmpub/pub/util/cache';
import { showErrBtn} from "../../../../../tmpub/pub/util/index";
export const buttonVisible = function (props) {
    if (props.button.getButtons().length == 0) {
        return;
    }
    //控制重试按钮显示情况
    showErrBtn(props, {
        headBtnCode: 'card_head', 
        headAreaCode: formId,
        fieldPK: pkname,
        datasource: FixedWithDrawConst.dataSource
    });
    let status = props.getUrlParam('status');
    let billstate = props.form.getFormItemsValue(formId, 'billstate');
    let Linkflag = props.getUrlParam('scene')==="linksce";
    let fip = props.getUrlParam('scene')==="fip";
    let islinklistquery = this.props.getUrlParam('islinklistquery');
    let nextId = getCurrentLastId(FixedWithDrawConst.dataSource);
    let showBackBtn = true;
    if (status === 'add' || status === 'edit'||status ==='copy') {
        showBackBtn=false;
        props.button.setButtonVisible(card_head_hidden_buttons, false);
        props.button.setButtonVisible(['SaveGroup','Save','SaveAdd','SaveCommit', 'Cancel'], true);
        props.button.setButtonDisabled(card_head_hidden_buttons, true);
        props.button.setButtonDisabled(['SaveGroup','Save','SaveAdd','SaveCommit', 'Cancel'], false);
        props.button.setMainButton(['Save'],true);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置卡片翻页的显隐性
    } else {
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);//设置卡片翻页的显隐性
        if(Linkflag&&!islinklistquery){
            showBackBtn=false;
        }
        if(!nextId&&!Linkflag){
            props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            });
            props.button.setButtonVisible(card_head_hidden_buttons, false);
            props.button.setButtonVisible(['Add'], true);
            props.button.setButtonDisabled(['Add'], false);
            props.button.setMainButton(['Add'],true);
            return;
        }
        //让所有按钮显示
        props.button.setButtonVisible(card_head_hidden_buttons, true);
         //让所有按钮可以编辑
        props.button.setButtonDisabled(card_head_hidden_buttons, false);
        if(Linkflag ||fip){
            linkSuccButtonCtrl(props);
            // if()
        }else{
            // 待提交
            if (billstate.value == '1') {
                waitCommitButtonCtrl(props);
            }//待审批
            else if (billstate.value == '2') {
                waitApproveButtonCtrl(props);
            }//审批完成
            else if (billstate.value == '3') {
                approveSuccButtonCtrl(props);
            }else{
                props.button.setButtonVisible(['SaveGroup','Save','SaveAdd','SaveCommit', 'Cancel'], false);
            }
        }
    }
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: showBackBtn,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
    });
} 


/** 
 * 待提交
 * @param {*} props 
 */
const waitCommitButtonCtrl = function (props) {
    let srcbillcode=props.form.getFormItemsValue(formId,['pk_srcbill'])[0].value;
    let srcbilltypecode=props.form.getFormItemsValue(formId,['pk_srcbilltype'])[0].value;
    props.button.setButtonVisible(['UnCommit','Back','Save','SaveAdd','SaveCommit','Cancel','toAllocate'], false);
    props.button.setButtonDisabled(['queryIntList','queryVoucher'],true);
    props.button.setMainButton(['Add'],false);
    if(srcbillcode!=null&&srcbilltypecode!=null){
        props.button.setButtonVisible(['Back'], true);
        props.button.setButtonVisible(['Delete'], false);
    }
}

/**
 * 待审批
 * @param {*} props 
 * @param {*} record 
 */
const waitApproveButtonCtrl = function (props) {
    props.button.setMainButton(['Add'],true);
    props.button.setButtonDisabled(['queryIntList','queryVoucher'],true);
    props.button.setButtonVisible([ 'Commit','Edit', 'Delete', 'Save','SaveAdd','SaveCommit','Cancel','Back','toAllocate'], false);
}

/**
 * 审批完成
 * @param {*} props 
 */
const approveSuccButtonCtrl = function (props) {
    props.button.setMainButton(['Add'],true);
    props.button.setButtonVisible(['toAllocate'], true);
    props.button.setButtonVisible(['Back','Edit','Commit', 'Delete', 'Save','SaveAdd','SaveCommit','Cancel'], false);
}

/**
 * 联查场景
 * @param {*} props 
 */
const linkSuccButtonCtrl = function (props) {
    let billstate_1 = props.form.getFormItemsValue(formId, 'billstate');
    props.button.setButtonVisible(['Save','Add','Back','Copy','SaveAdd','SaveCommit','Edit','Delete','Cancel','Commit','UnCommit'], false);
    if(billstate_1.value != '3'){
        props.button.setButtonDisabled(['queryIntList','queryVoucher'],true);
    }
}
/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/