/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, base, toast, print, high } from 'nc-lightapp-front';
import { cacheTools, output } from 'nc-lightapp-front';
import {
  card_from_id, card_table1_id, card_table2_id, card_page_id, base_url, busType, viewmod_deal, print_nodekey,
  print_templateid, printnodekey, funcode, NetPay_Status, ConfirmData, PayChangeData, base_path, VoucherData, IPaymentConst, PaymentConst, billstatus
} from '../../cons/constant.js';
import { SCENE, LINKTYPE, URL_PARAM, LINK_PARAM } from "../../../../../tmpub/pub/cons/constant";
import { PaymentMergeBillType, sourceModel_FTS, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU, PAYMODEL_COMBINEPAY } from '../../../../pub/cons/constant.js';
import { afterEvent } from './index';
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator, linkSucessPro } from '../../../../pub/utils/FTSButtonUtil';
import initTemplate from './initTemplate';
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { getCurrentLastId } from '../../../../../tmpub/pub/util/cache';
const { NCUploader } = high;
import Sign from '../../../../../tmpub/pub/util/ca/index';
import { setCardShouderBtnUseful, getRelationIndexFinanceOrg } from "../../util/index";
import { handleIsNeedCADentify, isEbankBuLuInfoFull, handlerCardTableInsertAfter } from "../../util/index";
import { elecSignListPrint, elecSignCardPrint } from "../../../../../tmpub/pub/util";
var pk;

let bodyCodeArr = {};
bodyCodeArr[card_table1_id] = 'pk_paymentfinance';
bodyCodeArr[card_table2_id] = 'pk_paymentfund';

export default async function (props, id, tableId) {
  let status = props.getUrlParam("status");
  let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_payment').value;
  //来源业务类型 
  let vsourcebustype = this.props.form.getFormItemsValue(card_from_id, 'vsourcebustype') && this.props.form.getFormItemsValue(card_from_id, 'vsourcebustype').value;
  //来源单据类型
  let pk_vsourcebilltype = this.props.form.getFormItemsValue(this.formId, 'pk_vsourcebilltype').value;
  //单据编号
  let vbillno = this.props.form.getFormItemsValue(this.formId, 'vbillno').value;
  //单据类型
  let billtype = this.props.form.getFormItemsValue(this.formId, 'pk_billtype') && this.props.form.getFormItemsValue(this.formId, 'pk_billtype').value;
  let billtype_fts = billtype;
  //来源单据id
  let pk_srcbill = this.props.form.getFormItemsValue(this.formId, 'pk_srcbill').value;
  let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
  let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
  //是否代发工资
  let ispayroll = this.props.form.getFormItemsValue(this.formId, 'ispayroll').value;
  let saveObj = {};
  let buluShow = true;
  saveObj[card_table1_id, card_table2_id] = 'cardTable';
  let billdata = {};
  let checkBodyDate = [];
  let showOriginalData = [];
  let pk_paymentfund = null;
  let urlExtParam = {};
  let extParam = {};
  let isNeedCADentify = false;
  let payBtnConfirmresult = null;
  let busistatus = null;
  switch (id) {
    //头部 刷新
    case 'Refresh':
      this.qryData(true);
      break;
    //头部 收回
    case 'Uncommit':
      cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentuncommit.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000016'), PaymentConst.dataSource, this.toggleShow.bind(this));/* 国际化处理： 收回成功！*/
      break;
    //头部 制证
    case 'Premit':
      cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentpremit.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000020'), PaymentConst.dataSource, this.toggleShow.bind(this));/* 国际化处理： 制证成功！*/
      break;
    //头部 取消制证
    case 'Unpremit':
      cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentunpremit.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000021'), PaymentConst.dataSource, this.toggleShow.bind(this));/* 国际化处理： 取消制证成功！*/
      break;
    //头部 附件
    case 'File':
      this.setState({
        showUploader: !this.state.showUploader
      });
      break;
    //头部 打印
    case 'Print':
      print(
        'pdf',
        base_url + 'paymentprint.do',
        {
          billtype: billtype,
          funcode: funcode,
          nodekey: null,
          oids: [pk]
        }
      );
      break;
    //正式打印
    case 'OffiPrint':
      elecSignPrint(props, true);
      break;
    //补充打印
    case 'InOffiPrint':
      elecSignPrint(props, false);
      break;
    case 'OutPut':
      output({
        url: base_url + 'paymentprint.do', data: {
          oids: [pk],
          outputType: 'output'
        }
      });
      break;
    /**
     * 联查按钮
     */
    //联查工作流
    case 'LinkWorkFlow':
      this.billID = pk;
      this.setState({
        showApproveDetail: true
      });
      break;
    //联查来源单据
    case 'LinkSourceBill':
      if (vsourcebustype == busType.BusType_BillPayAwoke || vsourcebustype == busType.BusType_BillFBM || vsourcebustype == busType.BusType_BillDeliver) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000022') });/* 国际化处理： 到账通知生成、票据冲销生成或传递生成单据，无需联查来源*/
        return;
      }
      if (vsourcebustype == busType.BusType_BillHand) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000023') });/* 国际化处理： 手工录入的单据，没有来源*/
        return;
      }
      this.billID = pk;
      this.setState({ showBillReview: true });
      break;
    //联查下游单据
    case 'LinkAfterBill':
      ajax({
        url: base_url + 'paymentafterlinkinfo.do',
        data: { pk },
        success: (res) => {
          let { data } = res;
          if (!data) {
            return;
          }
          let linkInfoArr = res.data;
          if (linkInfoArr && linkInfoArr.length > 0) {
            for (let linkInfor of linkInfoArr) {
              let { type, pks, appCode, linkPageCode, billType, url } = linkInfor;

              //普通联查
              if (!type || type == LINKTYPE.NORMAL) {
                let urlExtParam = {};
                //付款单
                if (billType == 'F3' || billType == 'F2') {
                  urlExtParam = {
                    scene: SCENE.LINK,
                    status: 'browse',
                    appcode: appCode,
                    pagecode: linkPageCode,
                    [URL_PARAM.PK_SRC]: pk,
                    [LINK_PARAM.ARAP.FLAG]: LINK_PARAM.ARAP.FLAG_VALUE
                  }
                } else {
                  urlExtParam = {
                    scene: SCENE.LINK,
                    status: 'browse',
                    appcode: appCode,
                    pagecode: linkPageCode,
                    srcbilltype: billtype_fts,
                    [URL_PARAM.PK_SRC]: pk,
                  }
                }
                props.openTo(null, urlExtParam);
              }
              //单据追溯
              else if (type == LINKTYPE.BILL_REVIEW) {
                this.billID = pks[0];
                this.setState({ showBillReview: true });
                break;
              }
            }
          }
        }
      });
      break;
    //联查预算
    case 'LinkNtbPlan':
      linkNtb.call(this, props);
      break;
    //联查支付银行账户
    case 'LinkBankAcc':
      let pk_fundbankaccount_p = LinkBankAccount.call(this, props, card_table2_id, 'pk_fundbankaccount_p');
      if (pk_fundbankaccount_p) {
        let linkOrg = '';
        checkBodyDate = this.props.cardTable.getCheckedRows(card_table2_id);
        let record = checkBodyDate[0].data;
        if (IPaymentConst.Pay_Group.value == record.values.paymode.value || IPaymentConst.Pay_Back.value == record.values.paymode.value) {
          let relFinanceOrg = getRelationIndexFinanceOrg(props, record, 0, card_table1_id);
          linkOrg = relFinanceOrg;
        } else {
          linkOrg = pk_org;
        }

        let data = {
          // 财务组织id
          pk_org: linkOrg,
          // 银行账户id，没有可不写，和现金账户二选一        
          pk_account: pk_fundbankaccount_p,
        };
        showOriginalData.push(data);
        this.setState({ showOriginal: true, showOriginalData: showOriginalData });
      }
      break;
    //联查现金账户
    case 'LinkCashAcc':
      let pk_fundcashaccount = LinkBankAccount.call(this, props, card_table2_id, 'pk_fundcashaccount');
      if (pk_fundcashaccount) {
        let data = {
          // 财务组织id
          pk_org: pk_org,
          // 现金账户id，没有可不写  
          pk_cashaccount: pk_fundcashaccount
        };
        showOriginalData.push(data);
        this.setState({ showOriginal: true, showOriginalData: showOriginalData });
      }
      break;
    //联查下拨银行账户
    case 'LinkRecAcc':
      let pk_allotaccount = LinkBankAccount.call(this, props, card_table2_id, 'pk_allotaccount');
      if (pk_allotaccount) {
        let data = {
          // 财务组织id
          pk_org: pk_org,
          // 银行账户id，没有可不写，和现金账户二选一        
          pk_account: pk_allotaccount
        };
        showOriginalData.push(data);
        this.setState({ showOriginal: true, showOriginalData: showOriginalData });
      }
      break;
    //联查内部户
    case 'LinkInnerAcc':
      let currAccid = LinkBankAccount.call(this, props, card_table1_id, 'pk_inneraccount_p');
      if (currAccid) {
        this.setState({ showInnerAccount: true, currAccid });
      }
      break;
    //联查支付确认单
    case 'LinkCheckPayBill':
      checkBodyDate = this.props.cardTable.getCheckedRows(card_table2_id);
      if (!checkBodyDate || checkBodyDate.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000028') });/* 国际化处理： 请选择一行资金组织页签表体进行操作！*/
        return;
      }
      if (checkBodyDate && checkBodyDate.length > 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000029') });/* 国际化处理： 请选择一行表体！*/
        return;
      }
      pk_paymentfund = checkBodyDate[0].data.values.pk_paymentfund && checkBodyDate[0].data.values.pk_paymentfund.value;
      let req = {
        pk: pk,
        bpk: pk_paymentfund
      };
      ajax({
        url: base_url + 'paymentlinkpayconfirm.do',
        data: req,
        success: (res) => {
          let { data } = res;
          if (!data) {
            return;
          }
          //处理选择数据
          console.log('联查支付确认单', data[0].pks);
          props.openTo('/obm/ebankconfirmpay/confirmpay/main/index.html#/list',
            {
              status: 'browse',
              appcode: '36100CONFM',
              pagecode: '36100CONFM_C01',
              yurrefs: data[0].pks, //数组[]
              id: data[0].pks, //数组[]
              type: 'link',
            });
        }
      });
      break;
    //联查支付变更单
    case 'LinkCheckAccBill':
      checkBodyDate = this.props.cardTable.getCheckedRows(card_table2_id);
      if (!checkBodyDate || checkBodyDate.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000028') });/* 国际化处理： 请选择一行资金组织页签表体进行操作！*/
        return;
      }
      if (checkBodyDate && checkBodyDate.length > 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000030') });/* 国际化处理： 请选择一行进行操作！*/
        return;
      }
      pk_paymentfund = checkBodyDate[0].data.values.pk_paymentfund && checkBodyDate[0].data.values.pk_paymentfund.value;
      let isnetpay = checkBodyDate[0].data.values.isnetpay && checkBodyDate[0].data.values.isnetpay.value;
      let dealway = checkBodyDate[0].data.values.dealway && checkBodyDate[0].data.values.dealway.value;
      if (!isnetpay && !dealway) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000031') });/* 国际化处理： 该表体是非网银的，没有关联的支付信息变更单，无法联查！*/
        return;
      }
      urlExtParam = {
        status: 'browse',
        pk_paymentfund,
        sourceBillType: billtype,
      };
      linkApp(props, PayChangeData.billtype, urlExtParam);
      break;
    //联查上收单
    case 'LinkUpBill':
      ajax({
        url: base_url + 'paymentlinkupbill.do',
        data: { pk },
        success: (res) => {
          let { data } = res;
          if (!data) {
            return;
          }
          let urlExtParam = {
            status: 'browse',
            srckey: data[0].pks,
            srcbilltype: billtype
          };
          linkSucessPro(props, res, urlExtParam);
        }
      });
      break;
    //联查下拨单
    case 'LinkDownBill':
      ajax({
        url: base_url + 'paymentlinkdownbill.do',
        data: { pk },
        success: (res) => {
          let { data } = res;
          if (!data) {
            return;
          }
          let urlExtParam = {
            status: 'browse',
            linkquerytype: '1',
            srcbilltype: billtype,
            srcbillid: data[0].pks,
          };
          linkSucessPro(props, res, urlExtParam);
        }
      });
      break;
    //联查凭证
    case 'LinkViewVoucher':
      linkVoucherApp(props, pk, pk_group, pk_org, '36J5', vbillno);
      break;
    //联查回单  
    case 'LinkReturnBill':
      busistatus = this.props.form.getFormItemsValue(this.formId, 'billstatus').value;
      if (busistatus != billstatus.PayOK) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000112') });
        return;
      }
      ajax({
        url: base_url + 'paymentrcptinitcount.do',
        data: { pk },
        success: (res) => {
          let urlExtParam = {
            status: 'browse',
            [URL_PARAM.PK_SRC]: pk,
            scene: SCENE.LINK,
            appcode: "36300TPRF",
            pagecode: "36300TPRF_L01"
          };
          let count = parseInt(res.data);
          if (count == '1') {
            urlExtParam.pagecode = "36300TPRF_C01";
          }
          props.openTo(null, urlExtParam);
        }
      });
      break;
    /**
     * 支付按钮区域
     * */
    //头部 支付
    case 'Pay':
      if (ispayroll) {
        buluShow = true;
      } else {
        buluShow = isEbankBuLuInfoFull(props, "Pay");
      }
      //补录不完整，弹出补录框
      if (!buluShow) {
        this.isMergePay = false;
        bankAccReWrite.call(this, props, 'BankAccReWrite', base_url + 'paymentbankrewrite.do', SHOWMODEL_ZHIFU, true, "Pay");
      } else {
        await PaymentPay.call(this, props);
      }
      break;
    //头部 合并支付
    case 'MergePay':
      if (ispayroll) {
        buluShow = true;
      } else {
        buluShow = isEbankBuLuInfoFull(props, "MergePay");
      }
      //补录不完整，弹出补录框
      if (!buluShow) {
        this.isMergePay = true;
        bankAccReWrite.call(this, props, 'BankAccReWrite', base_url + 'paymentbankrewrite.do', PAYMODEL_COMBINEPAY, true, 'MergePay');
      } else {
        await PaymentMergePay.call(this, props);
      }
      break;
    //头部 取消支付
    case 'UnPay':
      cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentunpay.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000034'), PaymentConst.dataSource, this.toggleShow.bind(this));/* 国际化处理： 取消支付成功！*/
      break;
    //头部 上收回拨
    case 'RecoveryFund':
      if (ispayroll) {
        buluShow = true;
      } else {
        buluShow = isEbankBuLuInfoFull(props, "RecoveryFund");
      }
      //补录不完整，弹出补录框
      if (!buluShow) {
        bankAccReWrite.call(this, props, 'UpRewrite', base_url + 'paymentbankrewrite.do', SHOWMODEL_ZHIFU, true, 'RecoveryFund');
      } else {
        await PaymentRecoveryFund.call(this, props);
      }
      break;
    //头部 回拨支付
    case 'CallBackPay':
      if (ispayroll) {
        buluShow = true;
      } else {
        buluShow = isEbankBuLuInfoFull(props, "CallBackPay");
      }
      //补录不完整，弹出补录框
      if (!buluShow) {
        bankAccReWrite.call(this, props, 'DownRewrite', base_url + 'paymentbankrewrite.do', SHOWMODEL_ZHIFU, true, 'CallBackPay');
      } else {
        await PaymentCallBackPay.call(this, props);
      }
      break;
    //头部 支付状态
    case 'QueryStatus':
      cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentquerystatus.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000037'), PaymentConst.dataSource, this.toggleShow.bind(this), true);/* 国际化处理： 下载支付状态成功！*/
      break;
    //头部 作废
    case 'Abolish':
      this.setState({ showAbolish: true });
      break;
    //头部 支付确认
    case 'UnionCheckPayBill':
      unionCheckPayBill.call(this, props);
      break;
    //头部 支付变更
    case 'PayChangeBill':
      payChangeBill.call(this, props);
      break;
    /**
    * 网银补录按钮区域
    * */
    //网银补录
    case 'BankAccReWrite':
      bankAccReWrite.call(this, props, 'BankAccReWrite', base_url + 'paymentbankrewrite.do', SHOWMODEL_BULU);
      break;
    //网银浏览
    case 'BankAccBrowse':
      bankAccReWrite.call(this, props, 'BankAccBrowse', base_url + 'paymentbankrewrite.do', SHOWMODEL_LIULAN);
      break;
    //下拨补录
    case 'DownRewrite':
      bankAccReWrite.call(this, props, 'DownRewrite', base_url + 'paymentbankrewrite.do', SHOWMODEL_BULU);
      break;
    //下拨浏览
    case 'DownRewriteBrowse':
      bankAccReWrite.call(this, props, 'DownRewriteBrowse', base_url + 'paymentbankrewrite.do', SHOWMODEL_LIULAN);
      break;
    //上收补录
    case 'UpRewrite':
      bankAccReWrite.call(this, props, 'UpRewrite', base_url + 'paymentbankrewrite.do', SHOWMODEL_BULU);
      break;
    //上收浏览
    case 'UpRewriteBrowse':
      bankAccReWrite.call(this, props, 'UpRewriteBrowse', base_url + 'paymentbankrewrite.do', SHOWMODEL_LIULAN);
      break;
    /**
     * 表格肩部按钮区域
     * */
    //肩部 增行
    case 'AddLine':
    case 'AddLine2':
      addLineProcess.call(this, props, tableId);
      handlerCardTableInsertAfter.call(this, props);
      setCardShouderBtnUseful.call(this, props, tableId);
      break;
    //肩部 删行
    case 'DelLine':
      BatchDelPayemntLine.call(this, props, tableId);
      setCardShouderBtnUseful.call(this, props, tableId);
      break;
    case 'DelLine2':
      BatchDelPaymentFundLine.call(this, props, tableId);
      setCardShouderBtnUseful.call(this, props, tableId);
      break;
    //肩部 复制
    case 'CopyLine':
    case 'CopyLine2':
      let selectRows = props.cardTable.getCheckedRows(tableId);
      if (selectRows == null || selectRows.length == 0) {
        toast({
          'color': 'warning',
          'content': this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000039')/* 国际化处理： 未选中要复制的行*/
        });
        return false;
      }
      if (tableId == card_table1_id) {
        this.copyflag1 = true;
        this.toggleShow();
      } else if (tableId == card_table2_id) {
        for (let dex = 0; dex < selectRows.length; dex++) {
          const element = selectRows[dex].data;
          if (IPaymentConst.Pay_Group.value == element.values.paymode.value || IPaymentConst.Pay_Back.value == element.values.paymode.value || IPaymentConst.Pay_Proxy.value == element.values.paymode.value) {
            toast({
              'color': 'warning',
              'content': this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000104')/* 国际化处理： 资金组织页签不能复制回拨支付或者集团支付行*/
            });
            return false;
          }
        }
        this.copyflag2 = true;
        this.toggleShow();
      }
      setCardShouderBtnUseful.call(this, props, tableId);
      break;
    //肩部 粘贴至末行
    case 'CopyLineLast':
      BatchCopyPaymentLine.call(this, props, tableId);
      if (tableId == card_table1_id) {
        this.copyflag1 = false;
        this.toggleShow();
      }
      handlerCardTableInsertAfter.call(this, props);
      setCardShouderBtnUseful.call(this, props, tableId);
      break;
    case 'CopyLineLast2':
      BatchCopyFund.call(this, props, tableId);
      if (tableId == card_table2_id) {
        this.copyflag2 = false;
        this.toggleShow();
      }
      handlerCardTableInsertAfter.call(this, props);
      setCardShouderBtnUseful.call(this, props, tableId);
      break;
    //肩部 取消
    case 'CancelLine':
    case 'CancelLine2':
      if (tableId == 'paymentfinance') {
        this.copyflag1 = false;
        this.toggleShow();
      } else if (tableId == 'paymentfund') {
        this.copyflag2 = false;
        this.toggleShow();
      }
      setCardShouderBtnUseful.call(this, props, tableId);
      break;
    default:
      break
  }
}
/**
 * 委托付款表体肩部新增
 * @param {*} props 
 * @param {*} tableId 当前表格code
 * @param {*} index 插入行时，当前插入位置
 */
export const addLineProcess = function (props, tableId, index) {
  let isautorelation = this.props.form.getFormItemsValue(this.formId, 'isautorelation').value;
  let pk_payment = (this.props.form.getFormItemsValue(this.formId, 'pk_payment') || {}).value;
  let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
  let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
  let maxIndex = Number(parseInt(this.maxIndex) + parseInt(1));
  let oripaymodeT = { value: IPaymentConst.Pay_Direct.value, display: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000064') };
  this.maxIndex = maxIndex;
  let defData1 = {
    oripaymode: oripaymodeT,
    rowno: {
      value: maxIndex.toString(),
      display: maxIndex.toString()
    },
    relationindex: {
      value: isautorelation ? maxIndex.toString() : null,
      display: isautorelation ? maxIndex.toString() : null,
    },
    pk_org: {
      value: pk_org,
      display: pk_org
    },
    pk_group: {
      value: pk_group,
      display: pk_group
    }
  };
  let defData2 = {
    paymode: oripaymodeT,
    pk_org: {
      value: pk_org,
      display: pk_org
    },
    pk_group: {
      value: pk_group,
      display: pk_group
    },
    rowno: {
      value: maxIndex.toString(),
      display: maxIndex.toString()
    },
  };

  let index1 = index || props.cardTable.getNumberOfRows(card_table1_id);
  console.log(index1, 'index11111');
  let index2 = index || props.cardTable.getNumberOfRows(card_table2_id);
  //财务表体新增
  if (tableId == card_table1_id) {
    if (isautorelation) {
      AddPaymentLine(props, card_table1_id, index1, defData1);
      let data = {
        paymode: {
          value: props.cardTable.getValByKeyAndIndex(card_table1_id, index1, "oripaymode").value,
          display: props.cardTable.getValByKeyAndIndex(card_table1_id, index1, "oripaymode").display
        },
        relationindex: {
          value: maxIndex.toString(),
          display: maxIndex.toString(),
        },
        pk_org: {
          value: pk_org,
          display: pk_org
        },
        pk_group: {
          value: pk_group,
          display: pk_group
        },
        rowno: {
          value: maxIndex.toString(),
          display: maxIndex.toString(),
        }
      };
      AddPaymentLine(props, card_table2_id, index2, data);
    } else {
      defData1.relationindex = { value: null, display: null };
      AddPaymentLine(props, card_table1_id, index1, defData1);
    }
  }
  //资金表体新增
  else if (tableId == card_table2_id) {
    AddPaymentLine(props, card_table2_id, index2, defData2);
  }
}

export const AddPaymentLine = function (props, tableId, index, data) {
  props.cardTable.addRow(tableId, index, data, false);
}
/**
 * 财务表体肩部删除
 * @param {*} props 
 * @param {*} tableId 
 */
export const BatchDelPayemntLine = function (props, tableId) {
  let selectRows = props.cardTable.getCheckedRows(tableId);
  if (selectRows == null || selectRows.length == 0) {
    toast({
      'color': 'warning',
      'content': this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000040')/* 国际化处理： 未选中要删除的行*/
    });
    return false;
  }
  let selectIndexs = [];
  let selectRownos = [];
  for (let item of selectRows) {
    selectIndexs.push(item.index);
    selectRownos.push(item.data.values.relationindex && item.data.values.relationindex.value);
  }
  //删除财务页签
  props.cardTable.delRowsByIndex(tableId, selectIndexs);
  let isautorelation = this.props.form.getFormItemsValue(this.formId, 'isautorelation').value;
  //删除自动关联的资金页签
  let queryRows = queryRelationRowsByRowno(props, selectRownos);
  if (queryRows && queryRows.length > 0) {
    props.cardTable.delRowsByIndex(card_table2_id, queryRows);
  }
  let totalamount = this.props.form.getFormItemsValue(card_from_id, "totalamount");
  afterEvent.call(this, this.props, card_from_id, "bodyevent", totalamount, null, null, null, null, true);
  return true;
}
/**
 * 资金表体删除
 * @param {*} props 
 * @param {*} tableId 
 */
export const BatchDelPaymentFundLine = function (props, tableId) {
  BatchDelLine(props, tableId);
  let totalamount = this.props.form.getFormItemsValue(card_from_id, "totalamount");
  afterEvent.call(this, this.props, card_from_id, "bodyevent", totalamount, null, null, null, null, true);
}
/**
 * 根据财务页签rowno获取关联的资金页签表体行的index
 * @param {*} props 
 * @param {*} selectRownos 财务页签relationindex的数组
 */
export const queryRelationRowsByRowno = function (props, selectRownos) {
  let queryRows = [];
  if (selectRownos && selectRownos.length > 0) {
    let allRows = props.cardTable.getAllRows(card_table2_id, false);
    // let allData = props.cardTable.getAllData(card_table2_id);
    for (let index = 0; index < allRows.length; index++) {
      const element = allRows[index];
      if (selectRownos.indexOf(element.values.relationindex.value) > -1) {
        queryRows.push(index);
      }
    }
  }
  return queryRows;
}

/**
 * 批量复制,财务页签粘贴使用
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码
 * @param {*} index 粘贴至此行的index,末行不需要传
 */
export const BatchCopyPaymentLine = function (props, tableId, index) {
  let selectRows = props.cardTable.getCheckedRows(tableId);
  if (selectRows == null || selectRows.length == 0) {
    toast({
      'color': 'warning',
      'content': this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000039')/* 国际化处理： 未选中要复制的行*/
    });
    return false;
  }
  let maxIndex = Number(parseInt(this.maxIndex));
  console.log(maxIndex, 'maxIndexCopy');
  //构造对应资金页签需要复制数据的参数
  let selectIndexs = []; //财务选择的表体index
  let selectRownos = []; //财务选择的表体relationindex
  let copyRownos = []; //财务复制的表体Rowno
  let selectRowCopy = JSON.parse(JSON.stringify(selectRows));
  let isautorelation = this.props.form.getFormItemsValue(this.formId, 'isautorelation').value;
  for (let item of selectRowCopy) {
    //每次循环maxIndex自增1
    maxIndex = parseInt(maxIndex) + parseInt(1);
    item.data.selected = false;
    //将原表体rowno取出
    selectRownos.push(item.data.values.relationindex && item.data.values.relationindex.value);
    item.data.values.rowno = {
      value: maxIndex.toString(),
      display: maxIndex.toString()
    };
    item.data.values.relationindex = {
      value: isautorelation ? maxIndex.toString() : null,
      display: isautorelation ? maxIndex.toString() : null,
    };
    item.data.values.pk_paymentfinance = {
      value: null,
      display: null
    };
    item.data.values.pseudocolumn = {
      value: null,
      display: null
    };
    console.log(item.data, 'selectRowCopy');
    selectIndexs.push(item.data);
    copyRownos.push(maxIndex);
  }
  this.maxIndex = maxIndex;
  let table_index1 = '';
  if (index == undefined) {
    table_index1 = props.cardTable.getNumberOfRows(tableId, false);
  }
  console.log(this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000041'), selectIndexs, 'table_index1', table_index1);/* 国际化处理： 表体财务复制数据：*/
  props.cardTable.insertRowsAfterIndex(tableId, selectIndexs, table_index1);


  //自动关联增行时
  if (isautorelation) {
    let fundCopyIndexs = queryRelationRowsByRowno(props, selectRownos);
    if (fundCopyIndexs && fundCopyIndexs.length > 0) {
      let fundRows = props.cardTable.getRowsByIndexs(card_table2_id, fundCopyIndexs);
      let fundCopyRows = JSON.parse(JSON.stringify(fundRows));
      for (let i = 0; i < fundCopyRows.length; i++) {
        let element = fundCopyRows[i];
        element.values.relationindex = {
          value: copyRownos[i].toString(),  //数组顺序不能乱，不然出错
          display: copyRownos[i].toString()
        };
        element.values.rowno = {
          value: copyRownos[i].toString(),  //数组顺序不能乱，不然出错
          display: copyRownos[i].toString()
        };
        element.values.pk_paymentfund = {
          value: null,  //数组顺序不能乱，不然出错
          display: null
        };
        element.values.pseudocolumn = {
          value: null,
          display: null
        };
      }
      let fundindex = getCopyIndexByFinanceIndex(props, index);
      //TODO 等待平台批量复制的API
      console.log(this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000042'), fundCopyRows, 'table_index2', fundindex);/* 国际化处理： 表体资金复制数据：*/
      props.cardTable.insertRowsAfterIndex(card_table2_id, fundCopyRows, fundindex);
    }
  }
  let totalamount = this.props.form.getFormItemsValue(card_from_id, "totalamount");
  afterEvent.call(this, this.props, card_from_id, "bodyevent", totalamount, null, null, null, null, true);
  return true;
}
/**
 * 根据财务页签复制粘贴位置获取资金表体对应粘贴行位置
 * @param {*} props 
 * @param {*} index 
 */
export const getCopyIndexByFinanceIndex = function (props, index) {
  let retIndex;
  if (index == undefined || index == null || index == '') {
    retIndex = props.cardTable.getNumberOfRows(card_table2_id, false);
    return retIndex;
  }
  let financeRow = props.cardTable.getRowsByIndexs(card_table1_id, index);
  if (financeRow.length == 0) {
    retIndex = props.cardTable.getNumberOfRows(card_table2_id, false);
    return retIndex;
  } else {
    let rowno = financeRow[0].values.relationindex.value;
    let fundIndex = queryRelationRowsByRowno([rowno]);
    return fundIndex[0];
  }
}
/**
 * 粘贴至此资金表体处理
 * @param {*} props 
 * @param {*} areacode 
 * @param {*} index 
 */
export const BatchCopyFund = function (props, areacode, index) {
  let selectRows = props.cardTable.getCheckedRows(areacode);
  if (selectRows == null || selectRows.length == 0) {
    toast({
      'color': 'warning',
      'content': this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000039')/* 国际化处理： 未选中要复制的行*/
    });
    return false;
  }
  let selectIndexs = [];
  let selectRowCopy = JSON.parse(JSON.stringify(selectRows));
  let maxIndex = Number(parseInt(this.maxIndex));
  for (let item of selectRowCopy) {
    maxIndex = Number(parseInt(maxIndex) + parseInt(1));
    item.data.selected = false;
    item.data.values.relationindex = {
      value: null,
      display: null
    };
    item.data.values.rowno = {
      value: maxIndex.toString(),
      display: maxIndex.toString()
    };
    item.data.values.pk_paymentfund = {
      value: null,
      display: null
    };
    item.data.values.pseudocolumn = {
      value: null,
      display: null
    };
    selectIndexs.push(item.data);
  }
  this.maxIndex = maxIndex;
  if (index == undefined) {
    index = props.cardTable.getNumberOfRows(areacode, false);
  }
  //TODO 等待平台批量复制的API
  props.cardTable.insertRowsAfterIndex(areacode, selectIndexs, index);

  let totalamount = this.props.form.getFormItemsValue(card_from_id, "totalamount");
  afterEvent.call(this, this.props, card_from_id, "bodyevent", totalamount, null, null, null, null, true);
  return true;
}

/**
 * 网银补录，浏览请求数据
 * @param {*} props  页面内置对象
 * @param {*} actionCode  按钮编码
 * @param {*} url  请求url
 * @param {*} modelType  补录类型
 * @param {*} isPay 是否补录不完整，支付弹出
 * @param {*} clickActionCode 当前点击的按钮，支付前弹出网银补录，补录时需要加上支付按钮的校验处理，不然和NC报错不一致 2019/1/7
 */
const bankAccReWrite = function (props, actionCode, url, modelType, isPay = false, clickActionCode) {
  let pk = this.props.form.getFormItemsValue(this.formId, 'pk_payment').value;
  let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
  let pkMapTs = {};
  pkMapTs[pk] = ts;
  let extParam = {};
  extParam["extAction"] = clickActionCode;

  ajax({
    url: url,
    data: {
      extParam,
      pkMapTs,
      actionCode: actionCode
    },
    success: (res) => {
      if (res && res.data) {
        this.isPay = isPay;
        //下拨补录，上收补录需要更新ts
        if (actionCode == 'UpRewrite' || actionCode == 'DownRewrite') {
          this.props.form.setFormItemsValue(card_from_id, { ts: { value: res.data.ts, display: res.data.ts } });
        }
        this.setState(
          {
            onLineData: res.data.onlineData || [],
            actionCode: actionCode,
            modelType: modelType,
          }, () => {
            this.setState({ showBuLu: true });
          });
        // this.onLineData = res.data || [];
        // this.actionCode = actionCode;
        // this.modelType = modelType;
        // this.setState({ showBuLu: true });
      }
    }
  });
  this.toggleShow();
}

/**
 * 支付确认
 * @param {*} props 
 */
const unionCheckPayBill = function (props) {
  let checkBodyDate = this.props.cardTable.getCheckedRows(card_table2_id);
  if (!checkBodyDate || checkBodyDate.length == 0) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000028') });/* 国际化处理： 请选择一行资金组织页签表体进行操作！*/
    return;
  }
  if (checkBodyDate && checkBodyDate.length > 1) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000029') });/* 国际化处理： 请选择一行表体！*/
    return;
  }
  let pk_transactorg = this.props.form.getFormItemsValue(this.formId, 'pk_transactorg').value;
  let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
  if (pk_transactorg !== pk_org) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000043') });/* 国际化处理： 单据所属资金组织必须等于办理资金组织！*/
    return;
  }
  let ispayroll = this.props.form.getFormItemsValue(this.formId, 'ispayroll').value;
  if (ispayroll) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000111') });/* 国际化处理： 该单据是代发工资业务，请在银企直连工资清单确认状态！*/
    return;
  }
  let bankpaymsg = checkBodyDate[0].data.values.bankpaymsg;
  let bankretmsg = checkBodyDate[0].data.values.bankretmsg;
  if ((!bankpaymsg || !bankpaymsg.value) && (!bankretmsg || !bankretmsg.value)) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000044') });/* 国际化处理： 必须是已支付并且下载网银指令状态才可以生成支付确认单！*/
    return;
  }
  let paystatus = checkBodyDate[0].data.values.paystatus && checkBodyDate[0].data.values.paystatus.value;
  let netpayinfo = checkBodyDate[0].data.values.netpayinfo && checkBodyDate[0].data.values.netpayinfo.value;

  if (!NetPay_Status.NetPay_Fail == paystatus && !NetPay_Status.NetPay_Paying == paystatus) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000045') });/* 国际化处理： 必须是支付中或者支付失败的才可以生成支付确认单！*/
    return;
  }
  let pk = this.props.form.getFormItemsValue(this.formId, 'pk_payment').value;
  let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
  let pk_paymentfund = checkBodyDate[0].data.values.pk_paymentfund && checkBodyDate[0].data.values.pk_paymentfund.value;
  let bodyPKs = [];
  bodyPKs.push(pk_paymentfund);
  let pkMapTs = {};
  pkMapTs[pk] = ts;
  ajax({
    url: base_url + 'paymentpayconfirm.do',
    data: {
      pkMapTs,
      bodyPKs
    },
    success: (res) => {
      if (res && res.data) {
        let pmtConfirmData = res.data;
        console.log(pmtConfirmData, 'pmtConfirmData');
        // 支付确认
        props.openTo(ConfirmData.pmtConfirmUrl, {
          billtype: ConfirmData.billtype,
          pagecode: ConfirmData.pagecode,
          appcode: ConfirmData.appcode,
          status: 'add',
          /** 组织 */
          pk_org: pmtConfirmData.pk_org,
          /** 集团 */
          pk_group: pmtConfirmData.pk_group,
          /** 来源单据编号 */
          srcbillcode: pmtConfirmData.srcbillcode,
          /** 来源单据类型 */
          srcbilltype: pmtConfirmData.srcbilltype,
          /** 来源单据节点号 */
          srcnodecode: pmtConfirmData.srcnodecode,
          /** 来源单据主表PK */
          srcpkid: pmtConfirmData.srcpkid,
          /** 来源系统 */
          srcsystem: pmtConfirmData.srcsystem,
          /** 指令参考号 */
          yurref: pmtConfirmData.yurref,
        });
      }
    }
  });
  this.toggleShow();
}

/**
 * 支付变更
 * @param {*} props 
 */
const payChangeBill = function (props) {
  let checkBodyDate = this.props.cardTable.getCheckedRows(card_table2_id);
  if (!checkBodyDate || checkBodyDate.length == 0) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000028') });/* 国际化处理： 请选择一行资金组织页签表体进行操作！*/
    return;
  }
  if (checkBodyDate && checkBodyDate.length > 1) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000029') });/* 国际化处理： 请选择一行表体！*/
    return;
  }
  let pk_transactorg = this.props.form.getFormItemsValue(this.formId, 'pk_transactorg').value;
  let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
  if (pk_transactorg !== pk_org) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000043') });/* 国际化处理： 单据所属资金组织必须等于办理资金组织！*/
    return;
  }
  let paystatus = checkBodyDate[0].data.values.paystatus && checkBodyDate[0].data.values.paystatus.value;
  if (NetPay_Status.NetPay_Fail != paystatus) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000046') });/* 国际化处理： 必须是支付失败的才可以生成支付信息变更单！*/
    return;
  }
  let pk_payinfochanging = checkBodyDate[0].data.values.pk_payinfochanging && checkBodyDate[0].data.values.pk_payinfochanging.value;
  if (pk_payinfochanging) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000047') });/* 国际化处理： 已经生成处理中的支付信息变更单！*/
    return;
  }
  let pk = this.props.form.getFormItemsValue(this.formId, 'pk_payment').value;
  let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
  let billtype = (this.props.form.getFormItemsValue(this.formId, 'pk_billtype') || {}).value;
  let pk_paymentfund = checkBodyDate[0].data.values.pk_paymentfund && checkBodyDate[0].data.values.pk_paymentfund.value;
  // 支付变更
  let urlExtParam = {
    status: 'edit',
    sourceBillID: pk,
    sourceBillBID: pk_paymentfund,
    sourceBillType: billtype,
    scene: SCENE.OTHER
  };
  linkApp(props, PayChangeData.billtype, urlExtParam);
  this.toggleShow();
}

/**
 * 银行账户联查
 * @param {*} props 
 * @param {*} tableId 
 * @param {*} key 
 */
const LinkBankAccount = function (props, tableId, key) {
  let checkBodyDate = this.props.cardTable.getCheckedRows(tableId);
  if (!checkBodyDate || checkBodyDate.length == 0) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000048') });/* 国际化处理： 请选择表体行！*/
    return;
  }
  if (checkBodyDate && checkBodyDate.length > 1) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000029') });/* 国际化处理： 请选择一行表体！*/
    return;
  }
  let bankaccount = checkBodyDate[0].data.values[key].value;
  if (!bankaccount) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000024') });
  }
  return bankaccount;
}


/**
 * 新增
 * @param {*} props  页面内置对象
 */
const add = function (props) {
  let pk = props.getUrlParam('id');
  props.pushTo('/card', {
    status: 'add',
    from: 'card'
  });
  initTemplate.call(this, props);
  this.billID = '';
  props.form.EmptyAllFormValue(card_from_id);
  props.cardTable.setMulTablesData({ [card_table1_id]: { rows: [] }, [card_table2_id]: { rows: [] } });
  this.toggleShow();
}
/**
 * 联查预算
 * @param {*} props 
 */
const linkNtb = function (props) {
  let pk = props.form.getFormItemsValue(card_from_id, "pk_payment").value;
  ajax({
    url: base_url + 'paymentlinkntb.do',
    data: { pk },
    success: (res) => {
      let { data } = res;
      this.setState({
        showNtbDetail: true,
        ntbdata: data
      })
    }
  });
}

//取消按钮
const cancel = function (props) {
  let status = this.props.getUrlParam("status");
  if (status == 'edit' || status == viewmod_deal) {
    props.setUrlParam({
      status: 'browse',
      id: props.getUrlParam('id')
    });
    // this.pageChange(props.getUrlParam('id'));
    this.qryData();
    // 因为表体采用setTableData设置的值，所以回退不会起效，重新查询
  } else if (status == 'add' || status == 'copy') {
    let nextId = getCurrentLastId(PaymentConst.dataSource);
    if (nextId) {
      props.setUrlParam({
        status: 'browse',
        id: nextId,
        isCopy: false
      });
      this.qryData();
      //因为上一条可能是新增加入缓存的数据，缓存中只存储表头数据，所以需要重新查询
      // this.pageChange(nextId);
    } else {
      this.billID = '';
      this.props.form.EmptyAllFormValue(this.formId);
      this.props.cardTable.setMulTablesData({ [this.tableId1]: { rows: [] }, [this.tableId2]: { rows: [] } });
      this.props.pushTo('/card', {
        status: 'browse',
      });
      this.toggleShow();
    }
  } else {
    window.history.back();
  }
}
/**
 * 上收回拨
 * @param {*} props 
 */
export const PaymentRecoveryFund = async function (props) {
  let isNeedCADentify = handleIsNeedCADentify(props, card_from_id, "card", "RecoveryFund");
  let bodyCodeArr = {};
  bodyCodeArr[card_table1_id] = 'pk_paymentfinance';
  bodyCodeArr[card_table2_id] = 'pk_paymentfund';
  let extParam = {};
  let pk = props.form.getFormItemsValue(card_from_id, 'pk_payment').value;
  if (isNeedCADentify == 'error') {
    return;
  }
  if (isNeedCADentify) {
    let payBtnConfirmresult = await Sign({
      isSign: true,
      isKey: true,
      data: null,
      encryptVOClassName: null,
      primaryId: [pk]
    });
    if (!payBtnConfirmresult || payBtnConfirmresult.isStop) {
      return;
    }
    extParam = {
      sign_strSrc: payBtnConfirmresult.data.text,
      signature: payBtnConfirmresult.data.signText,
      sign_sn: payBtnConfirmresult.data.userjson,
    }
  }
  cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentrecoveryfund.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000035'), PaymentConst.dataSource, this.toggleShow.bind(this), true, extParam);/* 国际化处理： 上收回拨成功！*/
}
/**
 * 合并支付
 * @param {*} props 
 */
export const PaymentMergePay = async function (props) {
  let bodyCodeArr = {};
  bodyCodeArr[card_table1_id] = 'pk_paymentfinance';
  bodyCodeArr[card_table2_id] = 'pk_paymentfund';
  let extParam = {};
  let pk = props.form.getFormItemsValue(card_from_id, 'pk_payment').value;
  let isNeedCADentify = handleIsNeedCADentify(props, card_from_id, "card", "MergePay");
  if (isNeedCADentify == 'error') {
    return;
  }
  if (isNeedCADentify) {
    let payBtnConfirmresult = await Sign({
      isSign: true,
      isKey: true,
      data: null,
      encryptVOClassName: null,
      primaryId: [pk]
    });
    if (!payBtnConfirmresult || payBtnConfirmresult.isStop) {
      return;
    }
    extParam = {
      sign_strSrc: payBtnConfirmresult.data.text,
      signature: payBtnConfirmresult.data.signText,
      sign_sn: payBtnConfirmresult.data.userjson,
    }
  }
  cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentmergepay.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000033'), PaymentConst.dataSource, this.toggleShow.bind(this), true, extParam);/* 国际化处理： 合并支付成功！*/
}
/**
 * 回拨支付
 * @param {*} props 
 */
export const PaymentCallBackPay = async function (props) {
  let bodyCodeArr = {};
  bodyCodeArr[card_table1_id] = 'pk_paymentfinance';
  bodyCodeArr[card_table2_id] = 'pk_paymentfund';
  let extParam = {};
  let pk = props.form.getFormItemsValue(card_from_id, 'pk_payment').value;
  let isNeedCADentify = handleIsNeedCADentify(props, card_from_id, "card", "CallBackPay");
  if (isNeedCADentify == 'error') {
    return;
  }
  if (isNeedCADentify) {
    let payBtnConfirmresult = await Sign({
      isSign: true,
      isKey: true,
      data: null,
      encryptVOClassName: null,
      primaryId: [pk]
    });
    if (!payBtnConfirmresult || payBtnConfirmresult.isStop) {
      return;
    }
    extParam = {
      sign_strSrc: payBtnConfirmresult.data.text,
      signature: payBtnConfirmresult.data.signText,
      sign_sn: payBtnConfirmresult.data.userjson,
    }
  }
  cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentcallbackpay.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000036'), PaymentConst.dataSource, this.toggleShow.bind(this), true, extParam);/* 国际化处理： 回拨支付成功！*/
}

/**
 * 支付
 * @param {*} props 
 */
export const PaymentPay = async function (props) {
  let bodyCodeArr = {};
  bodyCodeArr[card_table1_id] = 'pk_paymentfinance';
  bodyCodeArr[card_table2_id] = 'pk_paymentfund';
  let extParam = {};
  let pk = props.form.getFormItemsValue(card_from_id, 'pk_payment').value;
  let isNeedCADentify = handleIsNeedCADentify(props, card_from_id, "card", "Pay");
  if (isNeedCADentify == 'error') {
    return;
  }
  if (isNeedCADentify) {
    let payBtnConfirmresult = await Sign({
      isSign: true,
      isKey: true,
      data: null,
      encryptVOClassName: null,
      primaryId: [pk]
    });
    if (!payBtnConfirmresult || payBtnConfirmresult.isStop) {
      return;
    }
    extParam = {
      sign_strSrc: payBtnConfirmresult.data.text,
      signature: payBtnConfirmresult.data.signText,
      sign_sn: payBtnConfirmresult.data.userjson,
    }
  }
  cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentpay.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000032'), PaymentConst.dataSource, this.toggleShow.bind(this), true, extParam);/* 国际化处理： 支付成功！*/
}

/**
 * 表格展开新增
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} index 
 */
export const modelAddLineProcess = function (props, moduleId, index) {
  let isautorelation = this.props.form.getFormItemsValue(this.formId, 'isautorelation').value;
  let maxIndex = Number(parseInt(this.maxIndex) + parseInt(1));
  index = index + 1;
  this.maxIndex = maxIndex;
  let flag = false;
  let defData = getTableDefData.call(this, props, moduleId, maxIndex, flag);
  this.props.cardTable.setValByKeysAndIndex(moduleId, index, defData);
  if (moduleId == card_table1_id && isautorelation) {
    let index2 = index || props.cardTable.getNumberOfRows(card_table2_id);
    defData = getTableDefData.call(this, props, card_table2_id, maxIndex, !flag);
    AddPaymentLine(props, card_table2_id, index2, defData);
  }
}

/**
 * 表格展开删除
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} index 
 * @param {*} record 
 */
export const modelDelLineProcess = function (props, moduleId, index, record) {
  if (moduleId == card_table1_id) {
    let financeRowno = [];
    financeRowno.push(record.values.relationindex.value);
    //删除自动关联的资金页签
    let queryRows = queryRelationRowsByRowno(props, financeRowno);
    if (queryRows && queryRows.length > 0) {
      props.cardTable.delRowsByIndex(card_table2_id, queryRows);
    }
  }
  return true;
}
/**
 * 展开删除行后事件处理
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} index 
 * @param {*} record 
 */
export const modelDelLineAfterProcess = function (props, moduleId) {
  let totalamount = this.props.form.getFormItemsValue(card_from_id, "totalamount");
  afterEvent.call(this, this.props, card_from_id, "bodyevent", totalamount, null, null, null, null, true);
  return true;
}

/**
 * 获取表体默认数据
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} maxIndex 
 * @param {*} flag 
 */
export const getTableDefData = function (props, moduleId, maxIndex, flag) {
  let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
  let pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
  let isautorelation = this.props.form.getFormItemsValue(this.formId, 'isautorelation').value;
  let oripaymodeT = { value: IPaymentConst.Pay_Direct.value, display: this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000064') };
  let relationindex = parseInt(maxIndex).toString();
  let defData = {};
  if (moduleId == card_table1_id) {
    defData = {
      oripaymode: oripaymodeT,
      rowno: {
        value: relationindex,
        display: relationindex
      }, relationindex: {
        value: isautorelation ? relationindex : null,
        display: isautorelation ? relationindex : null,
      }, pk_org: {
        value: pk_org,
        display: pk_org
      }, pk_group: {
        value: pk_group,
        display: pk_group
      }
    };
  } else if (moduleId == card_table2_id && flag) {
    defData = {
      paymode: oripaymodeT,
      rowno: {
        value: relationindex,
        display: relationindex
      }, relationindex: {
        value: relationindex,
        display: relationindex,
      }, pk_org: {
        value: pk_org,
        display: pk_org
      }, pk_group: {
        value: pk_group,
        display: pk_group
      }
    };
  } else if (moduleId == card_table2_id && !flag) {
    defData = {
      paymode: oripaymodeT,
      pk_org: {
        value: pk_org,
        display: pk_org
      }, pk_group: {
        value: pk_group,
        display: pk_group
      }
    };
  }
  return defData;
}

/**
 * 提交指派
 * @param {*} props 
 * @param {*} data 
 */
const commitAssign = function (props, data) {
  if (!data) {
    return;
  }
  if (Array.isArray(data)) {
    data = data[0];
  }
  let { workflow } = data;
  //有指派信息，则指派，没有则重绘界面
  if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
    this.setState({ assignData: data, assignShow: data });
  } else {
    this.toggleShow()
  }
}

/**
 * 保存提交
 * @param {*} props 
 */
const saveCommit = function (props) {
  this.saveBill.call(this, false, () => {
    cardOperator(props, card_page_id, card_from_id, bodyCodeArr, 'pk_payment', base_url + 'paymentcommit.do', this.props.MutiInit.getIntl("36300TP") && this.props.MutiInit.getIntl("36300TP").get('36300TP-000015')/* 国际化处理： 提交成功！*/, PaymentConst.dataSource, commitAssign.bind(this), true);
  })
}

/**
 * 电子签章打印
 */
const elecSignPrint = function (props, offical) {
  elecSignCardPrint(props, {
    url: base_url + 'paymentelecsignprint.do',
    offical,
    appCode: funcode,
    nodeKey: offical ? printnodekey.official : printnodekey.inofficial,
    headCode: card_from_id,
    field_id: PaymentConst.pk_filed,
    field_billno: 'vbillno',
    getOrgFunc: () => {
      let pk_delgoorg = props.form.getFormItemsValue(card_from_id, 'pk_delgoorg') && props.form.getFormItemsValue(card_from_id, 'pk_delgoorg').value;
      if (pk_delgoorg) {
        return pk_delgoorg;
      }
      else {
        return props.form.getFormItemsValue(card_from_id, 'pk_org').value;
      }
    },
    validateFunc: () => {
      let busistatus = props.form.getFormItemsValue(card_from_id, 'billstatus').value;
      if (billstatus.PayOK != busistatus) {
        return props.MutiInit.getIntl("36300TP") && props.MutiInit.getIntl("36300TP").get('36300TP-000110')/** 单据状态非转账成功！ */;
      }
      return null;
    }
  })
}
/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/