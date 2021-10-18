/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { app_id, card_from_id, card_table_id, link_card_page_id, allocatePk, dataSource} from '../../cons/constant.js';
import { showErrBtn} from "../../../../../tmpub/pub/util/index";
const formId = card_from_id;
const pageId = link_card_page_id;
const tableId = card_table_id;

export const buttonVisible = function (props, status) {
    // console.log("buttons", props.button.getButtons());
    if (!status) {
        status = props.getUrlParam('status');
    }
    let flag = status === 'browse' ? false : true;
    let copyflag = false;
    if (this) {
        copyflag = this.state.copyflag || false;
    }

    // props.button.setButtonVisible(['Add', 'Copy','LinkWorkFlow','LinkRecAcc','LinkSourceBill','LinkNtbPlan','LinkCashAcc','LinkAfterBill','LinkInnerAcc','Print','File','Refresh'], !flag);
    //按照状态区分
    let billstatus = props.form.getFormItemsValue(formId, 'billstatus');
    billstatus = billstatus && billstatus.value;
    let paystatus = props.form.getFormItemsValue(formId, 'paystatus');
    paystatus = paystatus && paystatus.value;
    let ismakevoucher = props.form.getFormItemsValue(formId, 'ismakevoucher');
    ismakevoucher = ismakevoucher && ismakevoucher.value;
    let srcbusitype = props.form.getFormItemsValue(formId, 'srcbusitype');
    srcbusitype = srcbusitype && srcbusitype.value;

    console.log("billstatus", billstatus, "paystatus", paystatus, "ismakevoucher", ismakevoucher);
    props.button.setButtonVisible(['linkgroup', 'print', 'elecsignformalPrint','elecsigninformalPrint','refresh', 'unpay', 'allocateagree',
        'commissionpayment', 'receipt', 'evidence',
        'payagree', 'queryapprove'], false);
    // 编辑态
    if (flag) {
        props.button.setButtonVisible(['field'], !flag);
        props.button.setButtonVisible(['savegroup', 'linkgroup', 'cancel'], flag);
    } else if (!flag && billstatus == '1' && srcbusitype != '7') {
        //待提交,推送
        props.button.setButtonVisible(['linkgroup', 'print', 'field', 'refresh'], true);

    } else if (!flag && billstatus == '1' && srcbusitype == '7') {
        //待提交,手动录入
        props.button.setButtonVisible(['linkgroup', 'print', 'field', 'refresh'], true);

    } else if (!flag && billstatus == '2') {
        //待审批
        props.button.setButtonVisible(['field', 'linkgroup', 'queryapprove', 'print', 'refresh'], true);

    } else if (!flag && billstatus == '3') {
        //审批后待支付
        props.button.setButtonVisible(['field', 'linkgroup', 'print', 'refresh', 'queryapprove'], true);

    } else if (!flag && billstatus == '4') {
        //支付中
        props.button.setButtonVisible(['field', 'linkgroup', 'print', 'refresh', 'queryapprove'], true);

    } else if (!flag && billstatus == '5' && !ismakevoucher) {
        //支付后制证
        props.button.setButtonVisible(['field','linkgroup', 'payagree', 'receipt', 'evidence', 'print','elecsignformalPrint','elecsigninformalPrint', 'refresh', 'queryapprove'], true);

    } else if (!flag && billstatus == '5' && ismakevoucher) {
        //取消制证
        props.button.setButtonVisible(['field', 'linkgroup', 'payagree', 'receipt', 'evidence', 'print','elecsignformalPrint','elecsigninformalPrint', 'refresh', 'queryapprove'], true);

    } else if (!flag && billstatus == '6') {
        //已作废
        props.button.setButtonVisible(['field', 'linkgroup', 'print', 'refresh', 'queryapprove'], true);

    } else if (billstatus == null) {
        props.button.setButtonVisible(['field'], false);

    }
    //联查的精细控制
    if (!flag && srcbusitype == '7') {
        //手动录入

    }
    else if (!flag && srcbusitype == '1') {
        //系统自动生成

    }
    else if (!flag && srcbusitype == '2') {
        //到账通知生成

    }
    else if (!flag && srcbusitype == '3' && billstatus != '4') {
        //委托回拨生成 非支付中单据
        props.button.setButtonVisible(['commissionpayment', 'refresh'], true);
    }
    else if (!flag && srcbusitype == '3' && billstatus == '4') {
        //委托回拨生成 支付中单据
        props.button.setButtonVisible(['commissionpayment', 'refresh'], true);

    }
    else if (!flag && srcbusitype == '4') {
        //资金计划生成

    }
    else if (!flag && srcbusitype == '5') {
        //付款排程生成

    }
    else if (!flag && srcbusitype == '6') {
        //下拨申请生成

        props.button.setButtonVisible(['allocateagree', 'refresh'], true);
    }

    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
    props.form.setFormStatus(formId, status);
    props.cardTable.setStatus(tableId, status);
    
    //控制重试按钮显示情况
    showErrBtn(props, {
        headBtnCode: 'list_head',
        headAreaCode: card_from_id,
        fieldPK: allocatePk,
        datasource: dataSource
    });
}
//卡片表体行级按钮数组
export const getBodyBtnArr = function (props, record,copyflag) {
    let status = props.getUrlParam('status');
    if ('browse' == status) {
        return record.expandRowStatus ? ['closedown'] : ['opendown'];
    }
    else if ('decide' == status) {
        return [];
    }
    else {
        if (!copyflag) {
            return ['openright'];
        }
    }
}

/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/