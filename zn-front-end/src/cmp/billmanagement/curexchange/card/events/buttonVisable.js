/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/
import { Templatedata } from "../../config/Templatedata";
let formId = Templatedata.card_formid;
import { showErrBtn } from "../../../../../tmpub/pub/util";

/**
 * [外币兑换]-[按钮控制]
 * @param {*} props 
 */

export const buttonVisable = function (props) {
    //控制重试按钮显示情况
    showErrBtn(props, { headBtnCode: 'card_head', headAreaCode: Templatedata.card_formid,fieldPK:Templatedata.pkname, datasource:Templatedata.dataSource });
    let isinneracc = props.form.getFormItemsValue(formId, 'isinner');
    let settlestatus = props.form.getFormItemsValue(formId, 'settlestatus');
    let pk_srcbill = props.form.getFormItemsValue(formId, 'pk_srcbill');//来源单据：推单生成
    //注意：按钮组也要增加到false的不显示中，不然不起作用
    //编辑状态
    if (props.getUrlParam('status') === 'edit'
        || props.getUrlParam('status') === 'copy') {
        //编辑状态：显示按钮：保存，保存新增，保存提交，取消
        props.button.setButtonVisible(
            [
                'cardCopyBtn',
                'cardAddBtn',
                'cardSubmitBtn',
                'cardUnsubmitBtn',
                'cardEditBtn',
                'cardPrintBtn',
                'cardDeleteBtn',
                'cardSettleBtn',
                'cardUnsettleBtn',
                'cardmoreBtn',
                'cardlindgroup',
                'cardprintBtn',
                'cardaccessoryBtn',
                'makebillBtn',
                'savegroup',
                'refreshBtn',
                'transfer',
                'canceltransfer'
            ],
            false
        );
        //保存，保存新增，保存提交，取消
        props.button.setButtonVisible(
            [
                'saveBtn',
                'savesubmitBtn',
                'saveaddBtn',
                'cancelBtn'
            ],
            true
        );
    }
    //新增
    if (props.getUrlParam('status') === 'add') {

        //保存状态：显示按钮：保存，保存提交，取消
        props.button.setButtonVisible(
            [
                'cardCopyBtn',
                'cardAddBtn',
                'cardSubmitBtn',
                'cardUnsubmitBtn',
                'cardEditBtn',
                'cardPrintBtn',
                'cardDeleteBtn',
                'cardSettleBtn',
                'cardUnsettleBtn',
                'cardmoreBtn',
                'cardlindgroup',
                'cardprintBtn',
                'cardaccessoryBtn',
                'makebillBtn',
                'savegroup',
                'refreshBtn',
                'transfer',
                'canceltransfer'
            ],
            false
        );
        //保存，保存新增，保存提交，取消
        props.button.setButtonVisible(
            [
                'saveBtn',
                'savesubmitBtn',
                'saveaddBtn',
                'cancelBtn'
            ],
            true
        );

    }
    //浏览
    if (props.getUrlParam('status') === 'browse') {
        let url_status = props.getUrlParam('pk');
        let isvoucherlink = props.getUrlParam('fip');//是否是凭证联查过来的数据
        let scene = props.getUrlParam('scene');//是否联查过来的单据;
        if (url_status === '1') {//单据状态：已保存

            //新增，复制，提交，修改，打印，更多：删除，附件，联查等
            props.button.setButtonVisible(
                [
                    'cardUnsubmitBtn',
                    'cardEditBtn',
                    'saveBtn',
                    'cancelBtn',
                    'cardPrintBtn',
                    'cardSettleBtn',
                    'cardUnsettleBtn',
                    'savesubmitBtn',
                    'cardDeleteBtn',
                    'saveaddBtn',
                    'makebillBtn',
                    'cardvoucherBtn',
                    'cardapprovemsgBtn',
                    'cancelBtn',
                    'transfer',
                    'canceltransfer'
                ],
                false
            );
            //新增，修改，删除，复制，提交，更多
            props.button.setButtonVisible(
                [
                    'cardAddBtn',
                    'cardCopyBtn',
                    'cardSubmitBtn',
                    'cardEditBtn',
                    'moreOperateBtn',
                    'cardDeleteBtn',
                    'cardmoreBtn',
                    'cardlindgroup',
                    'cardprintBtn',
                    'cardaccessoryBtn',
                    'refreshBtn'
                ],
                true
            );
        }
        else if (url_status === '2') {//单据状态：待审批

            //新增，复制，收回，打印，更多：附件，联查等
            props.button.setButtonVisible(
                [
                    'cardSubmitBtn',
                    'cardEditBtn',
                    'saveBtn',
                    'cancelBtn',
                    'cardPrintBtn',
                    'cardSettleBtn',
                    'cardUnsettleBtn',
                    'cardDeleteBtn',
                    'savesubmitBtn',
                    'saveaddBtn',
                    'makebillBtn',
                    'cardvoucherBtn',
                    //lidyu 去掉联查审批详情
                    // 'cardapprovemsgBtn',
                    'cancelBtn',
                    'transfer',
                    'canceltransfer'
                ],
                false
            );
            //新增，复制，收回，更多
            props.button.setButtonVisible(
                [
                    'cardAddBtn',
                    'cardCopyBtn',
                    'cardUnsubmitBtn',
                    'moreOperateBtn',
                    'cardmoreBtn',
                    'cardlindgroup',
                    'cardprintBtn',
                    'cardaccessoryBtn',
                    'cardprintBtn2',
                    'cardoutputBtn',
                    'refreshBtn',
                    //begin tm lidyu 待审批状态允许联查审批性情
                    'cardapprovemsgBtn'
                    //end lidyu
                ],
                true
            );
        }
        else if (url_status === '3') {//单据状态：待办理

            //新增，复制，结算，取消结算，打印，更多：附件，联查等
            props.button.setButtonVisible(
                [
                    'saveaddBtn',
                    'cardUnsubmitBtn',
                    'cardSubmitBtn',
                    'cardEditBtn',
                    'cardPrintBtn',
                    'saveBtn',
                    'cancelBtn',
                    'cardDeleteBtn',
                    'savesubmitBtn',
                    'cardUnsettleBtn',
                    'makebillBtn',
                    'cardvoucherBtn',
                    'cardapprovemsgBtn',
                    'cancelBtn',
                    'transfer',
                    'canceltransfer'
                ],
                false
            );
            //新增，复制，结算，更多
            props.button.setButtonVisible(
                [
                    'cardAddBtn',
                    'cardCopyBtn',
                    'cardSettleBtn',
                    'cardUnsubmitBtn',
                    'moreOperateBtn',
                    'cardmoreBtn',
                    'cardlindgroup',
                    'cardprintBtn',
                    'cardprintBtn2',
                    'cardoutputBtn',
                    'cardaccessoryBtn',
                    'refreshBtn'
                ],
                true
            );
            // 单据状态为待结算时 且为内部账户
            if (isinneracc.value) {
                //显示
                props.button.setButtonVisible(['transfer'], true);
                //不显示
                props.button.setButtonVisible(['cardSettleBtn', 'canceltransfer'], false);
            }
            // 单据状态为待结算时 且结算状态为结算中 且为内部账户
            if (settlestatus.value == 1 && isinneracc.value) {
                //显示
                props.button.setButtonVisible(['canceltransfer'], true);
                //不显示
                props.button.setButtonVisible(['cardSettleBtn', 'transfer'], false);
            }
        } else if (url_status === '4') {//单据状态：已完毕

            //新增，复制，取消结算，打印，更多：制单，附件，联查等
            props.button.setButtonVisible(
                [
                    'saveaddBtn',
                    'cardUnsubmitBtn',
                    'cardEditBtn',
                    'saveBtn',
                    'cardPrintBtn',
                    'cancelBtn',
                    'cardSettleBtn',
                    'savesubmitBtn',
                    'cardDeleteBtn',
                    'cardSubmitBtn',
                    'cardvoucherBtn',
                    'cardapprovemsgBtn',
                    'cancelBtn'
                ],
                false
            );
            //新增，复制，取消结算，更多
            props.button.setButtonVisible(
                [
                    'cardAddBtn',
                    'cardCopyBtn',
                    'cardUnsettleBtn',
                    'makebillBtn',
                    'cardmoreBtn',
                    'cardlindgroup',
                    'cardprintBtn',
                    'cardprintBtn2',
                    'cardoutputBtn',
                    'cardaccessoryBtn',
                    'cardvoucherBtn',
                    'refreshBtn'
                ],
                true
            );
            // 单据状态为完结 且为内部账户
            if(isinneracc.value){
                //不显示
                props.button.setButtonVisible(['transfer', 'canceltransfer', 'cardUnsettleBtn', 'cardSettleBtn'], false);
             }else{
                //显示
                props.button.setButtonVisible(['cardUnsettleBtn'], true);
                //不显示
                props.button.setButtonVisible(['transfer', 'canceltransfer','cardSettleBtn'], false);
             }
            // 推单生成的单据，完毕了也可以显示[收回按钮]add by zhanghjr on 2019/06/21
            if (pk_srcbill && pk_srcbill.value) {
                //显示
                props.button.setButtonVisible(['cardUnsubmitBtn'], true);
            }
        } else {

            props.button.setButtonVisible(
                [
                    'cardUnsubmitBtn',
                    'cardEditBtn',
                    'saveBtn',
                    'cancelBtn',
                    'cardPrintBtn',
                    'cardSettleBtn',
                    'cardUnsettleBtn',
                    'savesubmitBtn',
                    'cardDeleteBtn',
                    'saveaddBtn',
                    'makebillBtn',
                    'cardvoucherBtn',
                    'cardapprovemsgBtn',
                    'cancelBtn',
                    'cardAddBtn',
                    'cardCopyBtn',
                    'cardUnsettleBtn',
                    'makebillBtn',
                    'cardmoreBtn',
                    'cardvoucherBtn',
                    'refreshBtn',
                    'cardCopyBtn',
                    'cardAddBtn',
                    'cardSubmitBtn',
                    'cardUnsubmitBtn',
                    'cardEditBtn',
                    'cardPrintBtn',
                    'cardDeleteBtn',
                    'cardSettleBtn',
                    'cardUnsettleBtn',
                    'cardmoreBtn',
                    'cardlindgroup',
                    'cardprintBtn',
                    'cardaccessoryBtn',
                    'makebillBtn',
                    'savegroup',
                    'transfer',
                    'canceltransfer'
                ],
                false
            );
            //新增，复制，取消结算，更多
            props.button.setButtonVisible(
                [
                    'cardAddBtn'
                ],
                true
            );
        }
        //新增凭证联查单据按钮显隐性
        if (scene || isvoucherlink) {
            props.button.setButtonVisible(
                [
                    'cardUnsubmitBtn',
                    'cardEditBtn',
                    'saveBtn',
                    'cancelBtn',
                    'cardPrintBtn',
                    'cardSettleBtn',
                    'savesubmitBtn',
                    'cardDeleteBtn',
                    'saveaddBtn',
                    'cardvoucherBtn',
                    'cardapprovemsgBtn',
                    'cancelBtn',
                    'cardAddBtn',
                    'transfer',//委托
                    'cardSettleBtn',
                    'canceltransfer',//取消委托
                    'cardCopyBtn',
                    'cardUnsettleBtn',
                    'makebillBtn',
                    'cardmoreBtn',
                    'refreshBtn',
                    'cardCopyBtn',
                    'cardAddBtn',
                    'cardSubmitBtn',
                    'cardUnsubmitBtn',
                    'cardEditBtn',
                    'cardDeleteBtn',
                    'cardSettleBtn',
                    'cardUnsettleBtn',
                    'cardlindgroup',
                    'cardprintBtn',
                    'cardaccessoryBtn',
                    'savegroup'
                ],
                false
            );
            //新增，复制，取消结算，更多
            props.button.setButtonVisible(
                [
                    'cardlindgroup',
                    'cardprintBtn',
                    'cardvoucherBtn',
                    'cardPrintBtn',
                    'cardaccessoryBtn',
                    'cardapprovemsgBtn'
                ],
                true
            );

        }

    }
  
}

/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/