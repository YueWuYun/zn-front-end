/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
import { ajax, base, toast, cardCache } from 'nc-lightapp-front';
import { app_id, card_from_id, card_table_id, card_page_id, dataSource, allocatePk } from '../../cons/constant.js';
import { loadMultiLang, showErrBtn } from "../../../../../tmpub/pub/util/index";
import { cache } from "../../../../../tmpub/pub/cons/constant";
const formId = card_from_id;
const pageId = card_page_id;
const tableId = card_table_id;

export const buttonVisible = function (props,status) {
    // console.log("buttons", props.button.getButtons());
    if(!status) {
        status = props.getUrlParam('status');
    }
    let flag = status === 'browse' ? false : true;
    let copyflag =false;
    if(this) {
        copyflag = this.state.copyflag || false;
    }
    
    // props.button.setButtonVisible(['Add', 'Copy','LinkWorkFlow','LinkRecAcc','LinkSourceBill','LinkNtbPlan','LinkCashAcc','LinkAfterBill','LinkInnerAcc','Print','File','Refresh'], !flag);
    //按照状态区分
    let billstatus = props.form.getFormItemsValue(formId,'billstatus');
    billstatus = billstatus && billstatus.value;
    let paystatus = props.form.getFormItemsValue(formId,'paystatus');
    paystatus = paystatus && paystatus.value;
    let ismakevoucher = props.form.getFormItemsValue(formId,'ismakevoucher');
    ismakevoucher = ismakevoucher && ismakevoucher.value;
    let srcbusitype= props.form.getFormItemsValue(formId,'srcbusitype');
    srcbusitype = srcbusitype && srcbusitype.value;

    console.log("billstatus",billstatus,"paystatus",paystatus,"ismakevoucher",ismakevoucher);
    props.button.setButtonVisible(['savegroup','add','cancel','edit','delete','copy','decide','return','commit',
    'uncommit','linkgroup','print','make','cancelmake','e_bank','pay','pay_merge','paystatus','payconfirm',
    'againhandworkpay','entrycancel','e_bank_browse_1','refresh','unpay','allocateagree',
    'commissionpayment','receipt','evidence',
    'payagree','queryapprove'], false);
    // 编辑态
    if(flag) {
        props.button.setButtonVisible(['field'], !flag);
        props.button.setButtonVisible(['savegroup', 'linkgroup','cancel'], flag);
    }else if(!flag && billstatus == '1'&&srcbusitype!='7') {
        //待提交,推送
        props.button.setButtonVisible(['add','e_bank','copy','decide','return','commit','linkgroup','print','field','refresh'], true); 
        props.button.setMainButton(['commit'],true);
        props.button.setMainButton(['add'],false);
    }else if(!flag && billstatus == '1'&&srcbusitype=='7') {
        //待提交,手动录入
        props.button.setButtonVisible(['add', 'edit','e_bank', 'delete','copy','commit','linkgroup','print','field','refresh'], true); 
        props.button.setMainButton(['commit'],true);
        props.button.setMainButton(['add'],false);
    }else if(!flag && billstatus == '2') {
        //待审批
        props.button.setButtonVisible(['add','copy','e_bank','uncommit','field','linkgroup','queryapprove','print','refresh'], true);
        props.button.setMainButton(['uncommit'],false);
        props.button.setMainButton(['add'],false);
    }else if(!flag && billstatus == '3') {
        //审批后待支付
        props.button.setButtonVisible(['add','copy','uncommit','e_bank','pay','pay_merge','field','linkgroup','print','refresh','queryapprove'], true); 
        props.button.setMainButton(['pay'],true);
        props.button.setMainButton(['add'],false);
    }else if(!flag && billstatus == '4') {
        //支付中
        props.button.setButtonVisible(['e_bank','add','copy','pay','pay_merge','paystatus','payconfirm','payagree','againhandworkpay','entrycancel','field','linkgroup','print','refresh','queryapprove'], true); 
        props.button.setMainButton(['payconfirm'],true);
        props.button.setMainButton(['add'],false);
    }else if(!flag && billstatus == '5'&&!ismakevoucher) {
        //支付后制证
        props.button.setButtonVisible(['add','copy','make','unpay','linkgroup','payagree','receipt','evidence','print','refresh','queryapprove'], true);
        props.button.setMainButton(['add'],false);
    }else if(!flag &&billstatus == '5'&& ismakevoucher) {
        //取消制证
        props.button.setButtonVisible(['add','copy','cancelmake','field','linkgroup','payagree','receipt','evidence','print','refresh','queryapprove'], true);
        props.button.setMainButton(['add'],false);
    }else if(!flag && billstatus == '6') {
        //已作废
        props.button.setButtonVisible(['add','copy','e_bank_browse_1','field','linkgroup','print','refresh','queryapprove'], true);
        props.button.setMainButton(['add'],true);
    }else if(billstatus==null){
        props.button.setButtonVisible(['field'], false);
        props.button.setButtonVisible(['add'], true);
        props.button.setMainButton(['add'],true);
    }
    //联查的精细控制
    if(!flag&&srcbusitype=='7') {
        //手动录入

    }
    else if(!flag&&srcbusitype=='1') {
        //系统自动生成

    }
    else if(!flag&&srcbusitype=='2') {
        //到账通知生成
        
    }
    else if(!flag&&srcbusitype=='3'&&billstatus!='4') {
        //委托回拨生成 非支付中单据
        props.button.setButtonVisible(['commissionpayment','refresh'], true);
    }
    else if(!flag&&srcbusitype=='3'&&billstatus=='4') {
        //委托回拨生成 支付中单据
        props.button.setButtonVisible(['commissionpayment','refresh'], true);
        props.button.setButtonVisible(['paystatus','payconfirm','againhandworkpay','entrycancel'], false);
    }
    else if(!flag&&srcbusitype=='4') {
        //资金计划生成

    }
    else if(!flag&&srcbusitype=='5') {
        //付款排程生成

    }
    else if(!flag&&srcbusitype=='6') {
        //下拨申请生成
        
        props.button.setButtonVisible(['allocateagree','refresh'], true);
    }
    

    if(flag&&!copyflag&&status!='decide') {
        props.button.setButtonVisible(['addline','deleteline','copyline'], true);
        props.button.setButtonVisible(['copytoendline','cancelcopy'], false);
        if(props.getUrlParam('status')=='add') {
            props.button.setButtonDisabled(['addline','deleteline','copyline'], true);
        }else {
            props.button.setButtonDisabled(['deleteline','copyline'], true);
        } 
    }else{
        if(flag&&status!='decide') {
            props.button.setButtonVisible(['copytoendline','cancelcopy'], true);
            props.button.setButtonVisible(['addline','deleteline','copyline'], false);
        }else {
            props.button.setButtonVisible(['copytoendline','cancelcopy'], false);
            props.button.setButtonVisible(['addline','deleteline','copyline'], false);
        }
    }

    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
    props.form.setFormStatus(formId, status);
    props.cardTable.setStatus(tableId, status);
    
     //添加异常提示标记
     cardCache.setDefData(cache.iserrtoast, dataSource, true);
     //控制重试按钮显示情况
     showErrBtn(props, {
        headBtnCode: 'list_head',
        headAreaCode: card_from_id,
        fieldPK: allocatePk,
        datasource: dataSource
    });    
}

/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/