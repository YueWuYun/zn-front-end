/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, toast ,high ,print ,cacheTools} from 'nc-lightapp-front';
import { base_url, printnodekey,list_table_id, list_page_id, card_page_id,list_search_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode ,dataSource,SHOWMODEL_LIULAN,SHOWMODEL_BULU} from '../../cons/constant.js';
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { linkApp ,linkVoucherApp} from '../../../../../tmpub/pub/util/LinkUtil';
// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
export default async function buttonClick(props, key, text, record, index) {
    let selectedData = props.table.getCheckedRows(list_table_id);
    let isNetpay = false
    switch (key) {
        //头部新增
        case 'add':
            props.pushTo('/card',{
                pagecode:card_page_id,
                status:'add'
            });
            break;
        //头部删除
        case 'delete':
            // listMultiOperator(props, list_page_id, list_table_id, 'pk_allocate_h', base_url + 'delete.do', '批量删除成功！',this.refresh.bind(this));
            this.props.modal.show('delete');
            break;
        //头部退回
        case 'back' :
            this.setState({ showReBack: true});
            
            break;
        
        //头部刷新
        case 'refresh':
			//默认查询待提交数据
			this.navChangeFun(0);
            break;
        
        // 网银浏览
        case 'e_bank_browse':
            if (selectedData.length != 1) {
                NCMessage.create({ content: loadMultiLang(this.props,'1880000025-000061'), color: 'warning', position: 'top' });/* 国际化处理： 请选择一条数据*//* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            
            let netbankbrowse_pk,netbankbrowse_ts;
            //处理选择数据
            selectedData.forEach((val) => {
                netbankbrowse_pk = val.data.values.pk_allocate_h.value;
                //ts时间戳
                netbankbrowse_ts = val.data.values.ts.value;
            });
            let netbankbrowsedata = {
                pk: netbankbrowse_pk,
                ts: netbankbrowse_ts,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/allocation/allocatenetbankbrowse.do',
                data: netbankbrowsedata,
                success: (res) => {
                    if (res && res.data) {
                    // console.log(res.data, 'res.data');
                    this.setState(
                        {
                            onLineData: res.data || [],
                            modelType: SHOWMODEL_LIULAN,
                            }, () => {
                            this.setState({ showBuLu: true });
                        });
                        // this.toggleShow();
                        // this.refresh();
                    }
                }
            });
            break;

        // 网银补录
        case 'e_bank':
            if (selectedData.length != 1) {
                NCMessage.create({ content: loadMultiLang(this.props,'1880000025-000061'), color: 'warning', position: 'top' });/* 国际化处理： 请选择一条数据*//* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            
            let netbankbulu_pk,netbankbulu_ts;
            //处理选择数据
            selectedData.forEach((val) => {
                netbankbulu_pk = val.data.values.pk_allocate_h.value;
                //ts时间戳
                netbankbulu_ts = val.data.values.ts.value;
            });
            let netbankbuludata = {
                pk: netbankbulu_pk,
                ts: netbankbulu_ts,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/allocation/allocatenetbankrewrite.do',
                data: netbankbuludata,
                success: (res) => {
                    if (res && res.data) {
                    this.setState(
                        {
                            onLineData: res.data || [],
                            modelType: SHOWMODEL_BULU,
                            }, () => {
                            this.setState({ showBuLu: true });
                        });
                    }
                }
            });
            // refreshHtml(props);
            break;

        // 支付
        case 'pay':
            if(!selectedData || selectedData.length<1){
                toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000062') });/* 国际化处理： 请选中一行数据*//* 国际化处理： 请选中一行数据！*/
                return;
            }          
                      
            //添加选中数据的映射集合
            let pkMapTs_pay = {};
            let rowIndex ={};
            let index_pay = 0;
            while(index_pay < selectedData.length){
                let pk_allocate_pay = selectedData[index_pay] && selectedData[index_pay].data && selectedData[index_pay].data.values && selectedData[index_pay].data.values['pk_allocate_h'] && selectedData[index_pay].data.values['pk_allocate_h'].value;
                let ts_pay = selectedData[index_pay] && selectedData[index_pay].data && selectedData[index_pay].data.values && selectedData[index_pay].data.values['ts'] && selectedData[index_pay].data.values['ts'].value;
                let index=selectedData[index_pay] && selectedData[index_pay].index;
                if (pk_allocate_pay && ts_pay) {
                    pkMapTs_pay[pk_allocate_pay] = ts_pay;
                }
                rowIndex[index_pay]=index;
                index_pay++;
            }

            let data_pay = {
                "pkMapTs":pkMapTs_pay,
                'isValidate': true,
                'rowIndex':rowIndex
            };

            ajax({
                url: '/nccloud/sf/allocation/allocatepay.do',
                data: data_pay,
                success: (res) => {
                    let { success, data } = res;
                    if (success) { 
                        if(data.errorMsg){
                            toast({ color: 'warning', content: data.errorMsg });
                        }
                        else{                            
                            //所有单据均合法，则进行支付
                            isNetpay = data.isNetpay;
                            // dopay.call(this, props ,isNetpay);
                            let selectDatass = props.table.getCheckedRows(list_table_id);
                            if(!selectDatass || selectDatass.length<1){
                                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000045') });/* 国际化处理： 请选中一行数据！*/
                                return;
                            }          

                            let dopayresult = Sign({
                                isSign: false,
                                isKey: isNetpay,
                                data: null,
                                encryptVOClassName: null
                            });
                            if (dopayresult.isStop) {
                                return;
                            }
                            
                            //添加选中数据的映射集合
                            let pkMapTs_dopay = {};
                            let index_dopay = 0;
                            while(index_dopay < selectDatass.length){
                                let pk_allocate_dopay = selectDatass[index_dopay] && selectDatass[index_dopay].data && selectDatass[index_dopay].data.values && selectDatass[index_dopay].data.values['pk_allocate_h'] && selectDatass[index_dopay].data.values['pk_allocate_h'].value;
                                let ts_dopay = selectDatass[index_dopay] && selectDatass[index_dopay].data && selectDatass[index_dopay].data.values && selectDatass[index_dopay].data.values['ts'] && selectDatass[index_dopay].data.values['ts'].value;
                                
                                if (pk_allocate_dopay && ts_dopay) {
                                    pkMapTs_dopay[pk_allocate_dopay] = ts_dopay;
                                }
                                index_dopay++;
                            }

                            let data_dopay = {
                                "pkMapTs":pkMapTs_dopay,
                                "pageid": list_page_id,                
                                'isCardOpt': false,
                                'isValidate': false,
                            };

                            ajax({
                                url: '/nccloud/sf/allocation/allocatepay.do',
                                data: data_dopay,
                                success: (res) => {
                                    let { success, data } = res;
                                    if (success) { 
                                        if(data.errorMsg){
                                            toast({ color: 'warning', content: data.errorMsg });
                                        }
                                        else if(data.interactMsg){
                                            props.modal.show('payModel',{
                                                title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
                                                content: data.interactMsg,
                                                //点击确定按钮事件
                                                beSureBtnClick: buttonClick.bind(this, props ,'payConfirm'),
                                            });
                                        }                        
                                        else if(data.successMsg){
                                            let row = data.billCard.head[list_table_id].rows[0];
                                            let updateDataArr = [{
                                                index: index,
                                                data: { values: row.values }
                                            }]
                                            props.table.updateDataByIndexs(list_table_id, updateDataArr);
                                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017') });/* 国际化处理： 支付成功*/
                                        }
                                    }  
                                }
                            });                             
                        }
                    }  
                }
            });
            break;
            
        //取消支付
        case "unpay":

            //添加选中数据的映射集合
            let pkMapTs_paycancel = {};
            let index_paycancel = 0;
            while(index_paycancel < selectDatass.length){
                let pk_allocate_paycancel = selectDatass[index_paycancel] && selectDatass[index_paycancel].data && selectDatass[index_paycancel].data.values && selectDatass[index_paycancel].data.values['pk_allocate_h'] && selectDatass[index_paycancel].data.values['pk_allocate_h'].value;
                let ts_paycancel = selectDatass[index_paycancel] && selectDatass[index_paycancel].data && selectDatass[index_paycancel].data.values && selectDatass[index_paycancel].data.values['ts'] && selectDatass[index_paycancel].data.values['ts'].value;
                
                if (pk_allocate_paycancel && ts_paycancel) {
                    pkMapTs_paycancel[pk_allocate_paycancel] = ts_paycancel;
                }
                index_paycancel++;
            }      
          
            ajax({
            url: "/nccloud/sf/allocation/allocateunpay.do",
            data: { 
                pkMapTs:pkMapTs_paycancel,
                pageid: list_page_id,
                isCardOpt: false,
            },
            success: (res) => {      
                let { success, data } = res;
                if (success) {
                    if(data.successMsg){
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000020') });/* 国际化处理： 取消支付成功*/
                    }else if(data.errorMsg){
                        toast({ color: 'warning', content: data.errorMsg });
                    }
                    if (res.data.grid) {
                        handleReturnData.call(this, selectDatass, res.data.grid);
                    }                    
                }
            }
            });
            break;

        //  支付确认
        case 'payConfirm':
            if (selectedData.length != 1) {
                NCMessage.create({ content: loadMultiLang(this.props,'1880000025-000061'), color: 'warning', position: 'top' });/* 国际化处理： 请选择一条数据*//* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            let payBtnConfirmresult = Sign({
                isSign: false,
                isKey: isNetpay,
                data: null,
                encryptVOClassName: null
            });
            if (payBtnConfirmresult.isStop) {
                return;
            }
            let payBtnConfirm_pk,payBtnConfirm_ts;
            //处理选择数据
            selectedData.forEach((val) => {
                payBtnConfirm_pk = val.data.values.pk_allocate_h.value;
                //ts时间戳
                payBtnConfirm_ts = val.data.values.ts.value;
            });
            let payBtnConfirmData = {
                pk: payBtnConfirm_pk,
                ts: payBtnConfirm_ts,
                pageid: list_page_id,
                operator: 1,
                isValidate:false
            }
            ajax({
                url: '/nccloud/sf/allocation/allocatepay.do',
                data: payBtnConfirmData,
                success: (res) => {
                    if (res.success) {
                        if(res.data){
                            toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000014') });/* 国际化处理： 支付成功*//* 国际化处理： 支付成功*/
                        }
                        if (res.data.grid) {
                            handleReturnData.call(this, selectDatass, res.data.grid);
                        } 
                        props.table.updateDataByIndexs(list_table_id, [index]);
                    }
                }
            });
            break;
        //合并支付
        case 'paymerge':
            netPayBulu.call(this,props,true)
            break;

        // 合并支付确认
        case "mergepayConfirm":
            if(!selectedData || selectedData.length<1){
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000045') });/* 国际化处理： 请选中一行数据！*/
                return;
            }  
            let mergepayConfirmresult = await Sign({
                isSign: false,
                isKey: isNetpay,
                data: null,
                encryptVOClassName: null
            });
            if (mergepayConfirmresult.isStop) {
                return;
            }

            //添加选中数据的映射集合
            let pk_allocate_mergepayconfirm = selectedData[0] && selectedData[0].data && selectedData[0].data.values && selectedData[0].data.values['pk_allocate_h'] && selectedData[0].data.values['pk_allocate_h'].value;
            let ts_mergepayconfirm = selectedData[0] && selectedData[0].data && selectedData[0].data.values && selectedData[0].data.values['ts'] && selectedData[0].data.values['ts'].value;
                    
            let mergepayConfirmData = {
                pk:pk_allocate_mergepayconfirm,
                ts:ts_mergepayconfirm,
                pageid: list_page_id,
                operator: 1,                              
                isCardOpt: false,
                isValidate:false
            }
            ajax({
                url: '/nccloud/sf/allocation/allocatemergepay.do',
                data: mergepayConfirmData,
                success: (res) => {
                    if (res.success) {
                        if(res.data){
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDAPay") && this.props.MutiInit.getIntl("36320FDAPay").get('36320FDAPay--000013') });/* 国际化处理： 支付成功*/
                        } 
                        if (res.data.grid) {
                            handleReturnData.call(this, selectDatass, res.data.grid);
                        }                        
                    }
                }
            });
            break;

        //附件管理
        case 'field':
            if (selectedData.length > 1) {
                toast({ color: 'info', content: loadMultiLang(this.props,'1880000025-000063') });/* 国际化处理： 仅可选择一条数据上传附件，此处默认上传附件至您选择的第一条数据!*/
                return;
            }
            if (selectedData.length == 0) {
                toast({ color: 'info', content: loadMultiLang(this.props,'1880000025-000064') });/* 国际化处理： 请您选择一条数据*/
                return;
            }
            let vbillno = selectedData[0].data.values.vbillno.value;
            let pk_allocate_h = selectedData[0].data.values.pk_allocate_h.value;

            this.setState({
                showUploader: !this.state.showUploader,
                target: null,
                billId: pk_allocate_h,
                billno: vbillno
            })
            break;
        
        //联查 委托付款
        case 'commissionpayment':
            doEntrustpay.call(this,props);
            break;
        //联查 凭证
        case 'evidence':
            if (selectedData.length != 1) {
                toast({ color: 'info', content: loadMultiLang(this.props,'1880000025-000065') });/* 国际化处理： 请选择一条数据进行联查。*/
                return;
            }
            let pkVoucher = selectedData[0].data.values['pk_allocate_h'].value;
            let pk_group = selectedData[0].data.values['pk_group'].value;
            let pk_org = selectedData[0].data.values['pk_org'].value;
            let billno = selectedData[0].data.values['vbillno'].value;
            let pk_billtype = selectedData[0].data.values['pk_billtype'].value;
            linkVoucherApp(props, pkVoucher,pk_group,pk_org, pk_billtype,billno);
            break;
        //联查 计划预算预算
        case 'plannedbudget':
            doPlanBudget.call(this,props);
            break;
        //联查 下拨核准
        case "allocateagree":
            doAllocatecheck.call(this,props);
            break;
        //联查 内部户余额
        case "inner_account_balance":
            doInnerAccountBlance.call(this,props);
            break;

        //联查 收款账户
        case "getpayment_account":
            doGetPaymentAccount.call(this,props);
            break;

        //联查 付款账户
        case "payment_account":
            doPaymentAccount.call(this,props);
            break;

        // 联查 回单
        case "receipt":
            doReceipt.call(this,props);
            break;

        //打印
        case 'print':
            let printData= props.table.getCheckedRows(list_table_id);
            //判断是否有选中行
            if (printData == null || printData.length == 0) {
                toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000066') });/* 国际化处理： 请选中一行数据！*/
                return;
            }
            let index = 0;
            let oids = [];
            let newid;
            while (index < printData.length) {
                newid = printData[index] && printData[index].data && printData[index].data.values && printData[index].data.values['pk_allocate_h'] && printData[index].data.values['pk_allocate_h'].value;
                if (!newid) {
                    continue;
                }
                oids.push(newid);
                index++;
            }
            if (oids.length == 0) {
                toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000066') });/* 国际化处理： 请选中一行数据！*/
                return;
            }
            print(
                'pdf',
                base_url + 'allocateprint.do',
                {
                    billtype,
                    funcode,
                    // nodekey: print_nodekey,
                    // printTemplateID: print_templateid,
                    oids
                }
            );
            break;
        // 输出
        case 'output':
            let outputData= props.table.getCheckedRows(list_table_id);
            let outputpks=[];
            outputData.forEach((item) => { 
                outputpks.push(item.data.values.pk_allocate_h.value);
            });
            this.setState(
                {
                    outputData: {
                        // printTemplateID: '1001Z61000000002AIOM',
                        //功能节点编码，即模板编码
                        // appcode: appcode,
                        // 模板节点标识
                        nodekey: printnodekey,
                        // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
                        oids: outputpks,
                        outputType: 'output'
                    }
                },
                () => {
                    this.refs.printOutput.open();
                }
            );
            break;
        case 'return':
            listMultiOperator(props, list_page_id, list_table_id, 'pk_allocate_h', base_url + 'allocateback.do', loadMultiLang(this.props,'1880000025-000059'),this.refresh.bind(this));/* 国际化处理： 批量提交成功！*/
            break;
        default:
            break;
    }
}


/**
 * 联查 委托付款
 * @param  props 
 */
const doEntrustpay =function(props){
    let entrustpay_pk_srcbill = props.form.getFormItemsValue(card_from_id,"pk_srcbill");
    let entrustpay_srcbusitype = props.form.getFormItemsValue(card_from_id, 'srcbusitype');
    if(entrustpay_srcbusitype && entrustpay_srcbusitype.value && entrustpay_srcbusitype.value != 3){
      toast({ color: 'warning', content:this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000012')})/* 国际化处理： 单据不是回拨生成的，无法联查委托付款书*/
      return;
    }
    
    let entrustpayArr = [];
    //数据校验
    if (entrustpay_pk_srcbill && entrustpay_pk_srcbill.value) {
      entrustpayArr.push(entrustpay_pk_srcbill.value);
    }else{
      toast({ color: 'warning', content:this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000013')})/* 国际化处理： 该单据无来源单据*/
      return;
    }
    let entrustpaywfExtParam = {
      status: 'browse',
      id: entrustpay_pk_srcbill.value
    };
    linkApp(props, "36J1", entrustpayArr, entrustpaywfExtParam);
  }

  /**
 * 联查 计划预算
 * @param  props 
 */
const doPlanBudget = function(props){
    let row = props.table.getCheckedRows(list_table_id);
    let pk=row[0].values.pk_allocate_h;
    ajax({
      url: "/nccloud/sf/allocation/allocatelinkplan.do",
      data: { 
        pk,
        pageid:card_page_id
       },
      success: (res) => {
        let { data } = res.data;
        if(res.data && res.data.hint){
            toast({ color: 'warning', content: res.data.hint});
            return;
          }else{
            this.setState({
                sourceData: res.data,
                showInspection: true,
            });
          }
      }
    });
  }

  /**
 * 联查 下拨核准
 * @param  props 
 */
const doAllocatecheck =function(props){
    let row = props.table.getCheckedRows(list_table_id);
    if(row && row.length != 1 ){
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000045') });/* 国际化处理： 请选中一行数据！*/
        return
    }
    let pk=row[0].data.values.pk_srcbill;
    let srcbusitype=row[0].data.values.srcbusitype
   
    if(srcbusitype && srcbusitype.value && srcbusitype.value == 6) {
      linkApp(props,"36K7",[pk && pk.value],{ status: 'browse',id:pk && pk.value})
    }else {
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000016') });/* 国际化处理： 该单据来源非下拨申请！*/
      return;
    }
  }

  /**
 * 联查 回单
 */
const doReceipt = function(props){
    let receiptrestkey = [];
    let checkAllCardDate = props.table.getAllRows(card_table_id, false);
    let checkBodyData = props.table.getCheckedRows(card_table_id)
        if(checkAllCardDate.length > 1){
          if (checkBodyData.length != 1) {
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000000') });/* 国际化处理： 请选择一条表体数据操作！*/
            return;
          }else{
            if (checkBodyData.length > 0) {
              let paystatus = checkBodyData[0].values.paystatus;
              if(paystatus && paystatus.value != 3){
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000014') });/* 国际化处理： 请选择支付成功的单据进行操作!*/
                return;
              }
              //处理选择数据
              checkBodyData.forEach((val) => {
                receiptrestkey.push(val.data.values.pk_allocateapply_b.value);
              });
            }
          }
        }else{
          let billstatus = props.form.getFormItemsValue(this.formId, 'billstatus');
          if(billstatus && billstatus.value != 4){
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000015') });/* 国际化处理： 请选择下拨成功的单据进行操作!*/
            return;
          }
          receiptrestkey.push(pk_allocate_h && pk_allocate_h.value); 
        } 
        let receiptExtParam = {
          status: 'browse',
        };
        linkApp(props, "36K9", receiptrestkey, receiptExtParam);
   
  }


/**
 * 联查 收款账户
 * @param  props 
 */
const doGetPaymentAccount = function(props){
    let bankaccbalance_rarr = [];
    let paymentAccountAllrows = props.table.getAllRows(card_table_id)
    let paymentAccountSelectrow = props.table.getCheckedRows(card_table_id)
    
        let restpk_org_r, pk_bankacc_r, bankacc_rrestkey;
  
        if(paymentAccountAllrows.length > 1){
          if (paymentAccountSelectrow.length != 1) {
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000000')})/* 国际化处理： 请选择一条表体数据操作！*/          
            return;
          }else{
            //处理选择数据
            paymentAccountSelectrow.forEach((val) => {
              bankacc_rrestkey = val.data.values.pk_allocate_b.value;
              if (val.data.values.pk_bankacc_r 
                && val.data.values.pk_bankacc_r.value) {
                  pk_bankacc_r = val.data.values.pk_bankacc_r.value;
                  restpk_org_r = val.data.values.pk_org_r.value;
                  
              }
  
              let bankaccbalance_rdata = {
                // 财务组织
                pk_org: restpk_org_r,
                // 银行账户id
                pk_account: pk_bankacc_r,
              };
              bankaccbalance_rarr.push(bankaccbalance_rdata);
            });
          }
        }else{
          bankacc_rrestkey = paymentAccountAllrows[0].values.pk_allocate_b.value;
          if (paymentAccountAllrows[0].values.pk_bankacc_r 
            && paymentAccountAllrows[0].values.pk_bankacc_r.value) {
              pk_bankacc_r = paymentAccountAllrows[0].values.pk_bankacc_r.value;
          }
          if (paymentAccountAllrows[0].values.pk_org_r 
            && paymentAccountAllrows[0].values.pk_org_r.value) {
              restpk_org_r = paymentAccountAllrows[0].values.pk_org_r.value;
          }
  
          let bankaccbalance_rdata = {
            // 财务组织
            pk_org: restpk_org_r,
            // 银行账户id
            pk_account: pk_bankacc_r,
          };
          bankaccbalance_rarr.push(bankaccbalance_rdata);
        }
        this.setState({
          showOriginalData: bankaccbalance_rarr,
          showOriginal: true,
        });
  }
  
  
  /**
   * 联查 付款账户
   * @param  props 
   */
  const doPaymentAccount = function(props){
    let bankaccbalance_parr = [];
    let paymentAccountAllrows = props.table.getAllRows(card_table_id)
    let paymentAccountSelectrow = props.table.getCheckedRows(card_table_id)
    let restpk_org_p, pk_bankacc_p;
    let bankacc_prestkey;
    if (props.form.getFormItemsValue(card_from_id, 'pk_org') 
          && props.form.getFormItemsValue(card_from_id, 'pk_org').value) {
            restpk_org_p = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
        }
    if(paymentAccountAllrows.length > 1){
      if (paymentAccountSelectrow.length != 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000001')})/* 国际化处理： 请选择一条表体数据操作*/
        return;
      }else{
        //处理选择数据
        paymentAccountSelectrow.forEach((val) => {
          bankacc_prestkey = val.data.values.pk_allocate_b.value;
          //处理选择数据
          if (val.data.values.pk_bankacc_p 
            && val.data.values.pk_bankacc_p.value) {
              pk_bankacc_p = val.data.values.pk_bankacc_p.value;
          }
  
          let bankaccbalance_pdata = {
            // 财务组织
            pk_org: restpk_org_p,
            // 银行账户id
            pk_account: pk_bankacc_p,
          };
          bankaccbalance_parr.push(bankaccbalance_pdata);
        });
      }
    }else{
      bankacc_prestkey = paymentAccountAllrows[0].values.pk_allocate_b.value;
      //处理选择数据
      if (paymentAccountAllrows[0].values.pk_bankacc_p 
        && paymentAccountAllrows[0].values.pk_bankacc_p.value) {
          pk_bankacc_p = paymentAccountAllrows[0].values.pk_bankacc_p.value;
      }
  
      let bankaccbalance_pdata = {
        // 财务组织
        pk_org: restpk_org_p,
        // 银行账户id
        pk_account: pk_bankacc_p,
      };
      bankaccbalance_parr.push(bankaccbalance_pdata);
    }
  
    this.setState({
      showOriginalData: bankaccbalance_parr,
      showOriginal: true,
    });
  }
  
  
  /**
   * 联查 内部户余额
   * @param  props 
   */
  const doInnerAccountBlance = function(props){
    let InnerAccountBlance_busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
        if(InnerAccountBlance_busitype && InnerAccountBlance_busitype.value && InnerAccountBlance_busitype.value != 2){
          toast({ color: 'warning', content:this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000002')})/* 国际化处理： 非中心上收的单据不能联查内部账户余额!*/
          return;
        }
  
    const selectDatas = props.table.getCheckedRows(card_table_id); //获取当前选中行数据
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000003') });/* 国际化处理： 请选中表体中的一行数据！*/
      return;
    }
    let pkInnerAccount = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_accid_r'] && selectDatas[0].data.values['pk_accid_r'].value;
    if(pkInnerAccount){
      this.setState({
        showAccModal: !this.state.showAccModal,
        pkInnAccount: pkInnerAccount
      });
    }else{
      toast({ color: 'warning', content:this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000004')})/* 国际化处理： 选中表体内部账户为空*/
    }
    
    
    
  }


/**
 * 支付（校验后）
 * @param {*} props 
 * @param {*} isNetpay 
 */
async function dopay(props,isNetpay,rowIndex){
    let selectDatass = props.table.getCheckedRows(list_table_id);
    if(!selectDatass || selectDatass.length<1){
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000045') });/* 国际化处理： 请选中一行数据！*/
        return;
    }          

    let dopayresult = await Sign({
        isSign: false,
        isKey: isNetpay,
        data: null,
        encryptVOClassName: null
    });
    if (dopayresult.isStop) {
        return;
    }
    
    //添加选中数据的映射集合
    let pkMapTs_dopay = {};
    let index_dopay = 0;
    while(index_dopay < selectDatass.length){
        let pk_allocate_dopay = selectDatass[index_dopay] && selectDatass[index_dopay].data && selectDatass[index_dopay].data.values && selectDatass[index_dopay].data.values['pk_allocate_h'] && selectDatass[index_dopay].data.values['pk_allocate_h'].value;
        let ts_dopay = selectDatass[index_dopay] && selectDatass[index_dopay].data && selectDatass[index_dopay].data.values && selectDatass[index_dopay].data.values['ts'] && selectDatass[index_dopay].data.values['ts'].value;
        
        if (pk_allocate_dopay && ts_dopay) {
            pkMapTs_dopay[pk_allocate_dopay] = ts_dopay;
        }
        index_dopay++;
    }

   let data_dopay = {
        "pkMapTs":pkMapTs_dopay,
        "pageid": list_page_id,                
        'isCardOpt': false,
        'isValidate': false,
    };

    ajax({
        url: '/nccloud/sf/allocation/allocatepay.do',
        data: data_dopay,
        success: (res) => {
            let { success, data } = res;
            if (success) { 
                if(data.errorMsg){
                    toast({ color: 'warning', content: data.errorMsg });
                }
                else if(data.interactMsg){
                    props.modal.show('payModel',{
                        title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
                        content: data.interactMsg,
                        //点击确定按钮事件
                        beSureBtnClick: buttonClick.bind(this, props ,'payConfirm'),
                      });
                }                        
                else if(data.successMsg){
                    let row = data.head[list_table_id].rows[0];
                    let updateDataArr = [{
                        index: rowIndex,
                        data: { values: row.values }
                    }]
                    props.table.updateDataByIndexs(tableCode, updateDataArr);
                    toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017') });/* 国际化处理： 支付成功*/
                }
                if (res.data.grid) {
                    handleReturnData.call(this, selectDatass, res.data.grid);
                }

            }  
        }
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(selectedData, data){
    let returnData = data[list_table_id].rows;
    //处理选择数据
    selectedData.forEach((val) => {
        let pk_allocate_h_check = val.data.values.pk_allocate_h.value;
        returnData.forEach((retrunval) => {
            if(pk_allocate_h_check === retrunval.values.pk_allocate_h.value){
                let updateDataArr = [{
                    index: val.index,
                    data: { values: retrunval.values }
                }];
                this.props.table.updateDataByIndexs(list_table_id, updateDataArr);
            }
        });
    });
}

/**
 * 网银补录
 */
function netPayBulu(props,isMergepayBulu){
    let selectDatass = props.table.getCheckedRows(list_table_id);
    if (selectDatass == null || selectDatass.length == 0 || selectDatass.length > 1) {
        toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000067') });/* 国际化处理： 请选中一行数据!*//* 国际化处理： 请选中一行数据！*/
        return;
    }            
    let pk_allocate_e_bank = selectDatass[0] && selectDatass[0].data && selectDatass[0].data.values && selectDatass[0].data.values['pk_allocate_h'] && selectDatass[0].data.values['pk_allocate_h'].value;
    let ts_e_bank = selectDatass[0] && selectDatass[0].data && selectDatass[0].data.values && selectDatass[0].data.values['ts'] && selectDatass[0].data.values['ts'].value;
    let data_e_bank = {
        "pk": pk_allocate_e_bank,
        "ts": ts_e_bank,
        "pageid": list_page_id
    };

    ajax({
        url: '/nccloud/sf/allocation/allocatenetbankrewrite.do',
        data: data_e_bank,
        success: (res) => {
            if (res && res.data) {
            this.setState(
                {
                fromBodyOrHead:true,
                isMergepayBulu:isMergepayBulu,
                onLineData: res.data || [],
                modelType: SHOWMODEL_BULU,
                }, () => {
                this.setState({ showBuLu: true });
                });
            }
        }
    });      
}


/**
 * 合并支付（校验后）
 * @param {*} props 
 * @param {*} isNetpay 
 */
async function domergepay(props,isNetpay){
    let selectDatass = props.table.getCheckedRows(list_table_id);
    if(!selectDatass || selectDatass.length != 1){
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000045') });/* 国际化处理： 请选中一行数据！*/
        return;
    } 
    let mergepayresult = await Sign({
        isSign: false,
        isKey: isNetpay,
        data: null,
        encryptVOClassName: null
    });
    if (mergepayresult.isStop) {
        return;
    }
    let pk_allocate_mergepay = selectDatass[0] && selectDatass[0].data && selectDatass[0].data.values && selectDatass[0].data.values['pk_allocate_h'] && selectDatass[0].data.values['pk_allocate_h'].value;
    let ts_mergepay = selectDatass[0] && selectDatass[0].data && selectDatass[0].data.values && selectDatass[0].data.values['ts'] && selectDatass[0].data.values['ts'].value;
    let data_mergepay = {
        "pk": pk_allocate_mergepay,
        "ts": ts_mergepay,
        "pageid": list_page_id,
        'isCardOpt': false,
        'isValidate': false,
    };
    
    ajax({
        url: '/nccloud/sf/allocation/allocatemergepay.do',
        data: data_mergepay,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if(data.errorMsg){
                    toast({ color: 'warning', content: data.errorMsg });
                }
                else if(data.interactMsg){
                    props.modal.show('payModel',{
                        title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
                        content: data.interactMsg,
                        //点击确定按钮事件
                        beSureBtnClick: buttonClick.bind(this, props ,'mergepayConfirm'),
                    });
                }
                else if(data.successMsg){
                    toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017') });/* 国际化处理： 支付成功*/
                }  
                if (res.data.grid) {
                    handleReturnData.call(this, selectDatass, res.data.grid);
                }           
            }
        }
    });
}

//退回确认
export const backConfirm = (props,value) => {
    if(!value) {
        toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000038') });/* 国际化处理： 退回原因必输！*/
        return;
    }
    listMultiOperator(props, list_page_id, list_table_id, 'pk_allocate_h', base_url + 'allocateback.do', loadMultiLang(this.props,'1880000025-000039'), dataSource,{returnnote: value});/* 国际化处理： 退回成功！*/
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/