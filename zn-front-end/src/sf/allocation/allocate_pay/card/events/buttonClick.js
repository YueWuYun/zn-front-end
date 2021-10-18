/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, base, toast, print, output, cacheTools, cardCache } from 'nc-lightapp-front';
import { SHOWMODEL_LIULAN, printnodekey, PAYMODEL_COMBINEPAY, base_url, card_page_id, list_page_id, 
  card_from_id, card_table_id, viewmod_deal, SHOWMODEL_BULU, dataSource,funcode } from '../../cons/constant';
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator } from '../../../../pub/utils/SFButtonUtil';
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { elecSignCardPrint} from "../../../../../tmpub/pub/util/index";
// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';

async function buttonClick(props, key, text, record, index, tableId) {
  let isNetpay = false
  switch (key) {
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
    //网银补录
    case 'e_bank':
      ebankBulu.call(this, props, false);
      break;

    //网银浏览（下拉分割按钮）
    case 'e_bank_browse':
      ebankBrowse.call(this, props);
      break;

    // 网银浏览（单独的按钮）
    case 'ebankbrowse':
      ebankBrowse.call(this, props);
      break;

    // 支付
    case 'pay':
      pay.call(this, props)
      break;

    // 支付确认（支付交互）
    case "paybtnconfirm":
      let pk_allocate_paybtnconfirm = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
      let ts_paybtnconfirm = props.form.getFormItemsValue(card_from_id, 'ts');
      let pkMapTs_paybtnconfirm = {}

      if (pk_allocate_paybtnconfirm.value && ts_paybtnconfirm.value) {
        pkMapTs_paybtnconfirm[pk_allocate_paybtnconfirm.value] = ts_paybtnconfirm.value;
      }

      let payBtnConfirmresult = await Sign({
        isSign: true,
        isKey: false,
        data: null,
        encryptVOClassName: null,
        primaryId: [pk_allocate_paybtnconfirm && pk_allocate_paybtnconfirm.value]
      });
      if (payBtnConfirmresult.isStop) {
        return;
      }

      let data_paybtnconfirm = {
        "pkMapTs": pkMapTs_paybtnconfirm,
        "operator": 1,
        "pageid": card_page_id,
        "isCardOpt": true,
        'sign_strSrc': payBtnConfirmresult.data && payBtnConfirmresult.data.text,
        'signature': payBtnConfirmresult.data && payBtnConfirmresult.data.signText,
        'sing_sn': payBtnConfirmresult.data && payBtnConfirmresult.data.userjson,
        'pagecode' : card_page_id,
        'btncode' : 'paybtnconfirm'
      };
      ajax({
        url: '/nccloud/sf/allocation/allocatepay.do',
        data: data_paybtnconfirm,
        success: (res) => {
          if (res.success) {
            if (res.data.successMsg) {
              if (res.data.billCard) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017') })/* 国际化处理： 支付成功*/
                if (res.data.billCard.head) {
                  props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                  cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
                }
                if (res.data.billCard.body) {
                  props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                }
                this.toggleShow();
              }
            }
            if (res.data.errorMsg) {
              toast({ color: 'warning', content: data.errorMsg });
            }
          }
        }
      });
      break;

    // 合并支付（网银补录）
    case "pay_merge":
      ebankBulu.call(this, props, true)
      break;

    // 合并支付(校验)
    case "pay_merge_check":
      doPayMerge.call(this, props, true)            
      break;

    //合并支付确认
    case "mergepayconfirm":
      let pk_allocate_mergepayconfirm = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
      let ts_mergepayconfirm = props.form.getFormItemsValue(card_from_id, 'ts');

      let mergePayBtnConfirmresult = await Sign({
        isSign: true,
        isKey: false,
        data: null,
        encryptVOClassName: null,
        primaryId: [pk_allocate_mergepayconfirm && pk_allocate_mergepayconfirm.value]
      });
      if (mergePayBtnConfirmresult.isStop) {
        return;
      }

      let data_mergepayconfirm = {
        "pk": pk_allocate_mergepayconfirm && pk_allocate_mergepayconfirm.value,
        "ts": ts_mergepayconfirm && ts_mergepayconfirm.value,
        "operator": 1,
        "pageid": card_page_id,
        "isCardOpt": true,
        'sign_strSrc': mergePayBtnConfirmresult.data && mergePayBtnConfirmresult.data.text,
        'signature': mergePayBtnConfirmresult.data && mergePayBtnConfirmresult.data.signText,
        'sing_sn': mergePayBtnConfirmresult.data && mergePayBtnConfirmresult.data.userjson,
      };
      ajax({
        url: '/nccloud/sf/allocation/allocatemergepay.do',
        data: data_mergepayconfirm,
        success: (res) => {
          if (res.success) {
            if (res.data.billCard) {
              toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017') })/* 国际化处理： 支付成功*/
              if (res.data.billCard.head) {
                props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
              }
              if (res.data.billCard.body) {
                props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
              }
              this.toggleShow()
            }
          }
        }
      });
      break

    // 支付状态
    case "paystatus":
      doPayStatus.call(this, props);
      break;

    // 支付确认（支付确认单）
    case "payconfirm":
      doPayConfirm.call(this, props)
      break;

    // 再次手工支付
    case "againhandworkpay":
      let handpayselectrows = props.cardTable.getCheckedRows(card_table_id); //获取选中的表体数据 
      if (handpayselectrows && handpayselectrows.length > 0) {
        props.modal.show('commonModel', {
          title:this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000086'),/* 国际化处理： 再次手工支付,再次手工支付*/
          content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000052'),/* 国际化处理： 对选中的表体行进行再次手工支付?*/
          //点击确定按钮事件
          beSureBtnClick: doAgainHandWorkPayConfirm.bind(this, props, false),
        });
      } else {
        props.modal.show('commonModel', {
          title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000086'),/* 国际化处理： 再次手工支付,再次手工支付*/
          content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000053'),/* 国际化处理： 对整张上收单进行再次手工支付?*/
          //点击确定按钮事件
          beSureBtnClick: doAgainHandWorkPayConfirm.bind(this, props, true),
        });
      }
      break;

    // 分录作废
    case "entrycancel":
      let tablesDatas = props.cardTable.getCheckedRows(card_table_id);

      if (tablesDatas && tablesDatas.length > 0) {
        let canOpera = false
        //处理选择数据（支付失败且未作废）
        tablesDatas.forEach((val) => {
          let paystatus = val.data.values.paystatus;
          let recordstatus = val.data.values.recordstatus;
          if (paystatus && paystatus.value && paystatus.value == 4
            && recordstatus && recordstatus.value && recordstatus.value == 1) {
            canOpera = true;
          }
          return;
        });
        if (!canOpera) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000005') })/* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*/
          return;
        } else {
          props.modal.show('commonModel', {
            title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000006'),/* 国际化处理： 分录作废*/
            content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000007'),/* 国际化处理： 对选中的表体行进行分录作废?*/
            //点击确定按钮事件
            beSureBtnClick: doRecorddisuseConfirm.bind(this, props, false)
          });
        }
      } else {
        let allCardData = props.cardTable.getAllRows(card_table_id)
        let canOperaAll = false;
        //处理选择数据
        allCardData.forEach((val) => {
          let paystatus = val.values.paystatus;
          let recordstatus = val.values.recordstatus;
          if (paystatus && paystatus.value && paystatus.value == 4
            && recordstatus && recordstatus.value && recordstatus.value == 1) {
            canOperaAll = true;
          }
        });
        if (!canOperaAll) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000005') })/* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*/
          return;
        } else {
          props.modal.show('commonModel', {
            title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000006'),/* 国际化处理： 分录作废*/
            content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000008'),/* 国际化处理： 对整张下拨单进行分录作废?*/
            //点击确定按钮事件
            beSureBtnClick: doRecorddisuseConfirm.bind(this, props, true)
          });
        }
      }
      break;

    //取消支付
    case "cancelpay":
      doCancelPay.call(this, props);
      break;

    //联查 下拨核准
    case "allocatecheck":
      doAllocatecheck.call(this, props);
      break;

    //联查 委托付款
    case "entrustpay":
      doEntrustpay.call(this, props);
      break;

    //联查 内部户余额
    case "inner_account_balance":
      doInnerAccountBlance.call(this, props);
      break;

    //联查 收款账户
    case "getpayment_account":
      doGetPaymentAccount.call(this, props);
      break;

    //联查 付款账户
    case "payment_account":
      doPaymentAccount.call(this, props);
      break;

    //联查 计划预算
    case "plan_budget":
      doPlanBudget.call(this, props);
      break;

    //联查 审批详情
    case "approve_detail":
      doApprove.call(this, props);
      break;

    // 联查 回单
    case "receiptsec":
      let newrows = this.props.cardTable.getCheckedRows(card_table_id);
      if (newrows.length < 1) {
        //表头
        let billstatus = this.props.form.getFormItemsValue(card_from_id, 'billstatus').value;
        let pk_allocate_h = this.props.form.getFormItemsValue(card_from_id, 'pk_allocate_h').value;
        if (billstatus && billstatus == '5') {
          linkApp(props, '36K8', { status: 'browse', linkquerytype: 'LinkQuery_SrcBill_H', srcbillid: [pk_allocate_h] })
        } else {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000015') /*'请选择下拨成功的单据进行操作！' */ });
          return;
        }
      } else {
        //表体
        if (newrows.length > 1) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000000') /*请选择一行表体进行操作！ */ });
          return;
        } else {
          let paystatus = newrows[0].data.values.paystatus.value;
          let pk_allocate_b = newrows[0].data.values.pk_allocate_b.value;
          if (paystatus && paystatus == '3') {
            linkApp(props, '36K8', { status: 'browse', linkquerytype: 'LinkQuery_SrcBill_B', srcbillid: [pk_allocate_b] });
          } else {
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000014') /*请选择支付成功的单据进行操作！ */ });
            return;
          }
        }
      }
      break;

    //联查 支付确认单
    case 'payagree':
      let checkrows = this.props.cardTable.getCheckedRows(card_table_id);
      if (checkrows.length > 1 || checkrows.length < 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000000') /*请选择一行表体进行操作！ */ });
        return;
      }
      let isnetpay = checkrows[0].data.values.isnetpay.value;
      if (!isnetpay) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000084') /*请选择网银支付的单据进行操作！ */ });
        return;
      }
      let paystatus = checkrows[0].data.values.paystatus.value;
      if (paystatus.value && paystatus.value == '1') {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000085') /*请选择已经支付过的单据进行操作！ */ });
        return;
      }
      let pk_allocate_b = checkrows[0].data.values.pk_allocate_b.value;
      props.openTo('/obm/ebankconfirmpay/confirmpay/main/index.html#/list',
        {
          appcode: '36100CONFM',
          pagecode: '36100CONFM_C01',
          yurrefs: [pk_allocate_b],
          id: [pk_allocate_b],
          type: 'link',
          status: 'browse'
        });
      break;


    //打印
    case "printgroup":
      printgroup.call(this, props);
      break;

    //输出
    case "export":
      doExport.call(this, props);
      break;
    //正式打印
    case 'elecsignformalPrint':
      elecSignCardPrint(props, {
        url: base_url+'elecsignprint.do',
        offical:true,
        appCode: funcode,
        nodeKey: 'OFFICAL',
        headCode: card_from_id,
        field_id: 'pk_allocate_h',
        field_billno: 'vbillno',
        validateFunc: () => {
            let billstatus = props.form.getFormItemsValue(card_from_id, 'billstatus').value;
            if ('5' != billstatus) {
                return loadMultiLang(props, '36320FA-000104')/** 单据状态非转账成功！ */;
            }
            return null;
        }
      });
    break;
    //补充打印
    case 'elecsigninformalPrint':
      elecSignCardPrint(props, {
        url: base_url+'elecsignprint.do',
        offical:false,
        appCode: funcode,
        nodeKey: 'INOFFICAL',
        headCode: card_from_id,
        field_id: 'pk_allocate_h',
        field_billno: 'vbillno',
        validateFunc: () => {
            let billstatus = props.form.getFormItemsValue(card_from_id, 'billstatus').value;
            if ('5' != billstatus) {
                return loadMultiLang(props, '36320FA-000104')/** 单据状态非转账成功！ */;
            }
            return null;
        }
      });
    break;

    // 附件管理
    case "field":
      doField.call(this, props);
      break;

    // 刷新
    case "refresh":
      doRefresh.call(this, props);
      break;

    //制证
    case "accreditation":
      cardOperator(props, card_page_id, card_from_id, [card_table_id], 'pk_allocate_h', base_url + 'make.do', this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000050'), dataSource, this.toggleShow.bind(this)
      ,true,{btncode: 'accreditation', pagecode: card_page_id });/* 国际化处理： 制证成功！*/
      break;

    //取消制证
    case "cancelaccreditation":
      cardOperator(props, card_page_id, card_from_id, [card_table_id], 'pk_allocate_h', base_url + 'unmake.do', this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000051'), dataSource, this.toggleShow.bind(this)
      ,true,{btncode: 'cancelaccreditation', pagecode: card_page_id });/* 国际化处理： 取消制证成功！*/
      break

    //联查 凭证
    case "linkvoucher":
      let pk_voucher = this.props.form.getFormItemsValue(this.formId, 'pk_allocate_h').value;
      let pk_group=this.props.form.getFormItemsValue(card_from_id,'pk_group').value;
      let pk_org=this.props.form.getFormItemsValue(card_from_id,'pk_org').value;
      let billno=this.props.form.getFormItemsValue(card_from_id,'vbillno').value;
      let pk_billtype=this.props.form.getFormItemsValue(card_from_id,'pk_billtype').value;
     
      linkVoucherApp(props, pk_voucher,pk_group,pk_org, pk_billtype,billno);
      
      break
    /**
     * 以下是子表按钮
     */

    // 新增
    case 'add':
      props.cardTable.addRow(this.tableId);
      break;

    //肩部 增行
    case 'addline':
      AddLine(props, card_table_id);
      break;

    //肩部 删行
    case 'deleteline':
      BatchDelLine(props, card_table_id);
      break;

    //肩部 复制
    case 'copyline':
      BatchCopy(props, card_table_id);
      this.setState({ isRowCopy: true });
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

    default:
      break;
  }
}


/**
 * 联查 收款账户
 * @param  props 
 */
const doGetPaymentAccount = function (props) {
  let bankaccbalance_rarr = [];
  let paymentAccountAllrows = props.cardTable.getAllRows(card_table_id)
  let paymentAccountSelectrow = props.cardTable.getCheckedRows(card_table_id)

  let restpk_org_r, pk_bankacc_r, bankacc_rrestkey;

  if (paymentAccountAllrows.length > 1) {
    if (paymentAccountSelectrow.length != 1) {
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000000') })/* 国际化处理： 请选择一条表体数据操作！*/
      return;
    } else {
      //处理选择数据
      paymentAccountSelectrow.forEach((val) => {
        bankacc_rrestkey = val.data.values.pk_allocate_b.value;
        if (val.data.values.pk_bankacc_r
          && val.data.values.pk_bankacc_r.value) {
          pk_bankacc_r = val.data.values.pk_bankacc_r.value;
        }
        if (paymentAccountAllrows[0] && paymentAccountAllrows[0].values && paymentAccountAllrows[0].values.pk_org_r
          && paymentAccountAllrows[0].values.pk_org_r.value) {
          restpk_org_r = val.data.values.pk_org_r.value;
        }
        if (restpk_org_r && pk_bankacc_r) {
          let bankaccbalance_rdata = {
            // 财务组织
            pk_org: restpk_org_r,
            // 银行账户id
            pk_account: pk_bankacc_r,
          };
          bankaccbalance_rarr.push(bankaccbalance_rdata);
          this.setState({
            showOriginalData: bankaccbalance_rarr,
            showOriginal: true,
          });
        } else {
          if (!restpk_org_r) {
            this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000082')/* 国际化处理： 财务组织不存在*/
          }
          if (pk_bankacc_r) {
            this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000083')/* 国际化处理： 银行账户不存在*/
          }
        }
      });
    }
  } else {
    bankacc_rrestkey = paymentAccountAllrows[0].values.pk_allocate_b.value;
    if (paymentAccountAllrows[0].values.pk_bankacc_r
      && paymentAccountAllrows[0].values.pk_bankacc_r.value) {
      pk_bankacc_r = paymentAccountAllrows[0].values.pk_bankacc_r.value;
    }
    if (paymentAccountAllrows[0] && paymentAccountAllrows[0].values && paymentAccountAllrows[0].values.pk_org_r
      && paymentAccountAllrows[0].values.pk_org_r.value) {
      restpk_org_r = paymentAccountAllrows[0].values.pk_org_r.value;
    }

    if (restpk_org_r && pk_bankacc_r) {
      let bankaccbalance_rdata = {
        // 财务组织
        pk_org: restpk_org_r,
        // 银行账户id
        pk_account: pk_bankacc_r,
      };
      bankaccbalance_rarr.push(bankaccbalance_rdata);

      this.setState({
        showOriginalData: bankaccbalance_rarr,
        showOriginal: true,
      });

    } else {
      if (!restpk_org_r) {
        this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000082')/* 国际化处理： 财务组织不存在*/
      }
      if (pk_bankacc_r) {
        this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000083')/* 国际化处理： 银行账户不存在*/
      }
    }
  }
}

/**
 * 联查 付款账户
 * @param  props 
 */
const doPaymentAccount = function (props) {
  let bankaccbalance_parr = [];
  let paymentAccountAllrows = props.cardTable.getAllRows(card_table_id)
  let paymentAccountSelectrow = props.cardTable.getCheckedRows(card_table_id)
  let restpk_org_p, pk_bankacc_p;
  let bankacc_prestkey;
  if (props.form.getFormItemsValue(card_from_id, 'pk_org')
    && props.form.getFormItemsValue(card_from_id, 'pk_org').value) {
    restpk_org_p = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
  }
  if (paymentAccountAllrows.length > 1) {
    if (paymentAccountSelectrow.length != 1) {
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000001') })/* 国际化处理： 请选择一条表体数据操作*/
      return;
    } else {
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
  } else {
    bankacc_prestkey = paymentAccountAllrows[0].values.pk_allocate_b.value;
    //处理选择数据
    let restpk_org_p, pk_bankacc_p;
    if (paymentAccountAllrows[0].values.pk_org
      && paymentAccountAllrows[0].values.pk_org.value) {
      restpk_org_p = paymentAccountAllrows[0].values.pk_org.value;
    }
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
const doInnerAccountBlance = function (props) {
  let InnerAccountBlance_busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
  if (InnerAccountBlance_busitype && InnerAccountBlance_busitype.value && InnerAccountBlance_busitype.value != 2) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000002') })/* 国际化处理： 非中心上收的单据不能联查内部账户余额!*/
    return;
  }

  const selectDatas = props.cardTable.getCheckedRows(card_table_id); //获取当前选中行数据
  //判断是否有选中行
  if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000003') });/* 国际化处理： 请选中表体中的一行数据！*/
    return;
  }
  let pkInnerAccount = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_accid_r'] && selectDatas[0].data.values['pk_accid_r'].value;
  if (pkInnerAccount) {
    this.setState({
      showAccModal: !this.state.showAccModal,
      pkInnAccount: pkInnerAccount
    });
  } else {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000004') })/* 国际化处理： 选中表体内部账户为空*/
  }



}



/**
 * 分录作废确认
 * @param  props 
 */
const doRecorddisuseConfirm = function (props, entrycancelBill) {
  debugger
  let recordunuse_pk = props.form.getFormItemsValue(card_from_id, "pk_allocate_h")
  let recordunuse_ts = props.form.getFormItemsValue(card_from_id, "ts")
  let recordunuse_selectRows
  let recordunuse_pkbs = []

  //如果是对整张单据作废
  if (entrycancelBill) {
    recordunuse_selectRows = props.cardTable.getAllRows(card_table_id)
    recordunuse_selectRows.forEach((val) => {
      let paystatus = val.values.paystatus;
      let recordstatus = val.values.recordstatus;
      if (paystatus && paystatus.value && paystatus.value == 4
        && recordstatus && recordstatus.value && recordstatus.value == 1) {
        //子表主键数组
        recordunuse_pkbs.push(val.values.pk_allocate_b.value);
      }
    });
  }
  //如果是对选择的表体行进行作废
  else {
    recordunuse_selectRows = props.cardTable.getCheckedRows(card_table_id)
    recordunuse_selectRows.forEach((val) => {
      let paystatus = val.data.values.paystatus;
      let recordstatus = val.data.values.recordstatus;
      if (paystatus && paystatus.value && paystatus.value == 4
        && recordstatus && recordstatus.value && recordstatus.value == 1) {
        //子表主键数组
        recordunuse_pkbs.push(val.data.values.pk_allocate_b.value);
      }
    });
  }

  let recordunuse_data = {
    pk: recordunuse_pk && recordunuse_pk.value,
    ts: recordunuse_ts && recordunuse_ts.value,
    pageid: card_page_id,
    isCardOpt: true,
    pkbs: recordunuse_pkbs
  }

  ajax({
    url: '/nccloud/sf/allocation/allocaterecorddisuse.do',
    data: recordunuse_data,
    success: (res) => {
      if (res.success) {
        if (res.data) {
          toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000009') })/* 国际化处理： 分录作废成功*/
          if (res.data.head) {
            props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
            cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
          }
          if (res.data.body) {
            props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
          }
          this.toggleShow()
        }
        //  doRefresh.call(this,props);
      }
    }
  });
}

/**
 * 再次手工支付确认
 * @param  props 
 */
const doAgainHandWorkPayConfirm = function (props, forBill) {
  let paybillpk = props.form.getFormItemsValue(card_from_id, "pk_allocate_h");
  let billts = props.form.getFormItemsValue(card_from_id, "ts");
  let handpayrows
  let pkbs = [];

  //是否是整单手工支付
  if (forBill) {
    handpayrows = props.cardTable.getAllRows(card_table_id); //获取所有的表体数据 
    if (handpayrows && handpayrows.length > 0) {
      handpayrows.forEach((val) => {
        pkbs.push(val && val.values && val.values.pk_allocate_b && val.values.pk_allocate_b.value);
      });
    }
  } else {
    handpayrows = props.cardTable.getCheckedRows(card_table_id); //获取选中的表体数据 
    if (handpayrows && handpayrows.length > 0) {
      handpayrows.forEach((val) => {
        pkbs.push(val && val.data && val.data.values && val.data.values.pk_allocate_b && val.data.values.pk_allocate_b.value);
      });
    }
  }



  ajax({
    url: "/nccloud/sf/allocation/allocatepayagain.do",
    data: {
      pk: paybillpk && paybillpk.value,
      pkbs: pkbs,
      ts: billts && billts.value,
      isCardOpt: true,
      pageid: card_page_id
    },
    success: (res) => {
      if (res.success) {
        if (res.data) {
          toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000010') })/* 国际化处理： 再次手工支付成功*/
          if (res.data.head) {
            props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
            cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
          }
          if (res.data.body) {
            props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
          }
        }
        this.toggleShow();   
        // doRefresh.call(this,props);    
      }
    }
  });

}



/**
 * 支付状态
 * @param  props 
 */
const doPayStatus = function (props) {
  let paystatus_pk = props.form.getFormItemsValue(card_from_id, "pk_allocate_h")
  let paystatus_allrows = props.cardTable.getAllRows(card_table_id)
  let paystaus_ts = props.form.getFormItemsValue(card_from_id, 'ts')
  let paystatus_pkbs = []

  paystatus_allrows.forEach((val) => {
    //子表主键数组
    paystatus_pkbs.push(val.values.pk_allocate_b.value);
  });

  // cardOperator(props, card_page_id, card_from_id,[card_table_id] ,'pk_allocate_h', base_url + 'allocatequerypaystatus.do', '获取支付状态成功！', dataSource ,this.toggleShow.bind(this));

  let paystatus_data = {
    pk: paystatus_pk && paystatus_pk.value,
    ts: paystaus_ts && paystaus_ts.value,
    pageid: card_page_id,
    isCardOpt: true,
    pkbs: paystatus_pkbs
  }

  ajax({
    url: '/nccloud/sf/allocation/allocatequerypaystatus.do',
    data: paystatus_data,
    success: (res) => {
      if (res.success) {
        if (res.data) {

          if (res.data.head) {
            props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
            //begin yangjn 20181214 修改支付状态时 后台添加信息不提示的问题 以下两处修改
            //1.let ntbinfo=res.data.head[card_from_id].rows.values['ntbinfo'];
            let ntbinfo = res.data.head[card_from_id].rows[0].values['ntbinfo'];
            if (ntbinfo && ntbinfo.value) {
              //2.res.data.head[card_from_id].rows.values['ntbinfo'] = { value: null, display: null };
              res.data.head[card_from_id].rows[0].values['ntbinfo'] = { value: null, display: null };
              //end 
              toast({ color: 'warning', content: ntbinfo.value });
            } else {
              toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000011') })/* 国际化处理： 获取支付状态成功*/
            }
            cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
          }
          if (res.data.body) {
            props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
          }
        }
        // doRefresh.call(this,props)
      }
    }
  });
}


/**
 * 联查 委托付款
 * @param  props 
 */
const doEntrustpay = function (props) {
  let entrustpay_pk_srcbill = props.form.getFormItemsValue(card_from_id, "pk_srcbill");
  let entrustpay_srcbusitype = props.form.getFormItemsValue(card_from_id, 'srcbusitype');
  if (entrustpay_srcbusitype && entrustpay_srcbusitype.value && entrustpay_srcbusitype.value != 3) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000012') })/* 国际化处理： 单据不是回拨生成的，无法联查委托付款书*/
    return;
  }


  //数据校验
  if (!entrustpay_pk_srcbill || !entrustpay_pk_srcbill.value) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000013') })/* 国际化处理： 该单据无来源单据*/
    return;
  }
  let entrustpaywfExtParam = {
    status: 'browse',
    id: entrustpay_pk_srcbill.value,
  };
  linkApp(props, "36J1", entrustpaywfExtParam);
}


/**
 * 联查 计划预算
 * @param  props 
 */
const doPlanBudget = function (props) {
  let pk = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h').value;
  let queryntbplanData = {
    pk: pk,
		pageid: card_page_id
  }

  ajax({
    url: "/nccloud/sf/allocation/allocatelinkplan.do",
    data: queryntbplanData,
    success: (res) => {
      if (res.success) {
				if (res.data && res.data.hint) {
					toast({ color: 'warning', content: res.data.hint });
					return;
				} else {
					this.setState({
						ntbdata: res.data,
						showNtbDetail: true
					});
				}
			}
    }
  });
}

/**
 * 联查 审批详情
 * @param  props 
 */
const doApprove = function (props) {
  let billid = props.form.getFormItemsValue(card_from_id, "pk_allocate_h");
  let billtype = props.form.getFormItemsValue(card_from_id, "pk_billtype");
  this.setState({
    show: !this.state.show,
    billid: billid && billid.value,
    billtype: billtype && billtype.value
  });
}

/**
 * 联查 回单
 */
const doReceipt = function (props) {
  let receiptrestkey = [];
  let checkAllCardDate = props.cardTable.getAllRows(card_table_id, false);
  let checkBodyData = props.cardTable.getCheckedRows(card_table_id);

  //如果表体有数据但是没有选数据，则联查所有可联查的表体
  if (checkAllCardDate.length > 0) {
    if (checkBodyData.length < 1) {
      checkAllCardDate.forEach((val) => {
        if (val.values.paystatus.value == 3) {
          receiptrestkey.push(val.values.pk_allocate_b.value);
        }
      });
    } else {
      checkBodyData.forEach((val) => {
        if (val.values.paystatus.value == 3) {
          receiptrestkey.push(val.values.pk_allocate_b.value);
        }
      });
    }
  }
  let receiptExtParam = {
    status: 'browse',
    srcbillid: receiptrestkey,
    linkquerytype: "LinkQuery_Apply_B",
  };
  linkApp(props, "36K8", receiptExtParam);
}

/**
 * 联查 下拨核准
 * @param  props 
 */
const doAllocatecheck = function (props) {
  let srcbusitype=this.props.form.getFormItemsValue(card_from_id,'srcbusitype');
  let pk_srcbillhead =[];
  //begin 修改合并生成的下拨单 联查时无法获取到srcbillcode的问题
  let tableIndex = props.cardTable.getAllRows(card_table_id).length;
  for(let i=0;i<tableIndex;i++){
    pk_srcbillhead.push(this.props.createMasterChildData(card_page_id, card_from_id, card_table_id).body[card_table_id].
                        rows[i].values.pk_srcbillhead.value)
  }
  //end 2019/1/8 yangjn
  let urlExtParam = {
    status: 'browse',
    srcbillid: pk_srcbillhead,
    linkquerytype: '1',
  };
  if (srcbusitype && srcbusitype.value && srcbusitype.value == 6) {
    linkApp(props, "36K7", urlExtParam)
  } else {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000016') });/* 国际化处理： 该单据来源非下拨申请！*/
    return;
  }
}

/**
 * 打印
 * @param  props 
 */
const printgroup = function (props) {
  let oids = [];
      let pk_allocate_h = this.props.form.getFormItemsValue(card_from_id, 'pk_allocate_h').value;
      if(pk_allocate_h) {
        oids.push(pk_allocate_h);
      }
      print(
          'pdf',
          '/nccloud/sf/allocation/allocateprint.do',
          {
              funcode:'36320FA_PAY',
              // nodekey: print_nodekey,
              // printTemplateID: print_templateid,
              oids
          }
      );

  // let printpk = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  // print(
    //支持两类: 'html'为模板打印, 'pdf'为pdf打印
    // 'pdf',
    // '/nccloud/sf/allocation/allocateprint.do',
    // {
    //   oids: [printpk && printpk.value],
    // }
  // );
}


/**
 * 输出
 * @param  props 
 */
const doExport = function (props) {
  let outputpk = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  output({
    url: "/nccloud/sf/allocation/allocateprint.do",
    data: {
      oids: [outputpk && outputpk.value],
      outputType: 'output'
    }
  });
}

/**
 * 附件管理
 * @param  props 
 */
const doField = function (props) {
  let vbillno = props.form.getFormItemsValue(card_from_id, 'vbillno');
  let pk_allocate_h = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  this.setState({
    showUploader: !this.state.showUploader,
    target: null,
    billId: pk_allocate_h && pk_allocate_h.value,
    billno: vbillno && vbillno.value
  })
}


/**
 * 刷新
 * @param  props 
 */
const doRefresh = function (props) {
  this.qryCard();
}

/**
 * 网银浏览
 */
const ebankBrowse = function (props) {
  let pk_allocate_e_bank_browse = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  let ts_e_bank_browse = props.form.getFormItemsValue(card_from_id, 'ts');
  let data_e_bank_browse = {
    "pk": pk_allocate_e_bank_browse && pk_allocate_e_bank_browse.value,
    "ts": ts_e_bank_browse && ts_e_bank_browse.value,
    "pageid": card_page_id
  };
  ajax({
    url: '/nccloud/sf/allocation/allocatenetbankbrowse.do',
    data: data_e_bank_browse,
    success: (res) => {
      if (res && res.data) {
        this.setState(
          {
            onLineData: res.data || [],
            modelType: SHOWMODEL_LIULAN
          }, () => {
            this.setState({ showBuLu: true });
          });
      }
    }
  });
}

/**
 * 网银补录
 */
const ebankBulu = function (props, isMergepay) {
  let pk_allocate_e_bank = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  let ts_e_bank = props.form.getFormItemsValue(card_from_id, 'ts');
  let data_e_bank;

  //合并支付的时候网银补录要合并
  if (isMergepay) {
    data_e_bank = {
      "pk": pk_allocate_e_bank && pk_allocate_e_bank.value,
      "ts": ts_e_bank && ts_e_bank.value,
      "pageid": card_page_id,
      "ismergepay":true
    };
    this.ismergepay=true;
    this.setState({
      modelType: PAYMODEL_COMBINEPAY,
    })
  } else {
    data_e_bank = {
      "pk": pk_allocate_e_bank && pk_allocate_e_bank.value,
      "ts": ts_e_bank && ts_e_bank.value,
      "pageid": card_page_id,
      "ismergepay":false
    };
    this.ismergepay=false;
    this.setState({
      modelType: SHOWMODEL_BULU,
    })
  }

  ajax({
    url: '/nccloud/sf/allocation/allocatenetbankrewrite.do',
    data: data_e_bank,
    success: (res) => {
      if (res && res.data) {
        this.setState(
          {
            isMergepay: isMergepay,
            onLineData: res.data || [],
          }, () => {
            this.setState({ showBuLu: true });
          });
      }
    }
  });
}

/**
 * 支付
 */
const pay = async function (props) {
  let pk_allocate_pay = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  let allRows = props.cardTable.getAllRows(card_table_id)
  let isNetpay = false

  allRows.forEach((val) => {
    let isnetbankfull = val.values.isnetbankfull.value;
    if (isnetbankfull) {
      isNetpay = true;
    }
    return;
  });


  let payresult = await Sign({
    isSign: true,
    isKey: isNetpay,
    data: null,
    encryptVOClassName: null,
    primaryId: [pk_allocate_pay && pk_allocate_pay.value]
  });
  if (payresult.isStop) {
    return;
  }

  let ts_pay = props.form.getFormItemsValue(card_from_id, 'ts');
  let pkMapTs = {}

  if (pk_allocate_pay.value && ts_pay.value) {
    pkMapTs[pk_allocate_pay.value] = ts_pay.value;
  }


  let data_pay = {
    "pkMapTs": pkMapTs,
    "pageid": card_page_id,
    'isCardOpt': true,
    'sign_strSrc': payresult.data && payresult.data.text,
    'signature': payresult.data && payresult.data.signText,
    'sing_sn': payresult.data && payresult.data.userjson,
    'pagecode' : card_page_id,
    'btncode' : 'pay'
  };

  ajax({
    url: '/nccloud/sf/allocation/allocatepay.do',
    data: data_pay,
    success: (res) => {
      let { success, data } = res;
      if (success) {
        if (data.errorMsg) {
          toast({ color: 'warning', content: data.errorMsg });
        }
        else if (data.interactMsg) {
          props.modal.show('payModel', {
            title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
            content: data.interactMsg,
            //点击确定按钮事件
            beSureBtnClick: buttonClick.bind(this, props, 'paybtnconfirm'),
          });
        }
        else if (data.successMsg) {
          if (data.billCard) {
            toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017') });/* 国际化处理： 支付成功*/
            if (data.billCard.head) {
              props.form.setAllFormValue({ [card_from_id]: data.billCard.head[card_from_id] });
              cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), data.billCard, card_from_id, dataSource);
            }
            if (data.billCard.body) {
              props.cardTable.setTableData(card_table_id, data.billCard.body[card_table_id]);
            }
            this.toggleShow();
          }
        }
      }
    }
  });
}


/**
 * 取消支付
 * @param  props 
 */
const doCancelPay = function (props) {

  let payCancelpk = props.form.getFormItemsValue(card_from_id, "pk_allocate_h").value;
  let billCancelts = props.form.getFormItemsValue(card_from_id, "ts").value;
  let pkMapTs_paycancel = {};
  pkMapTs_paycancel[payCancelpk] = billCancelts

  ajax({
    url: "/nccloud/sf/allocation/allocateunpay.do",
    data: {
      pkMapTs: pkMapTs_paycancel,
      pageid: card_page_id,
      isCardOpt: true,
      pagecode : card_page_id,
      btncode : 'cancelpay'
    },
    success: (res) => {
      let { success, data } = res;
      if (success) {
        if (data.successMsg) {
          toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000020') });/* 国际化处理： 取消支付成功*/
          this.componentDidMount();
        } else if (data.errorMsg) {
          toast({ color: 'warning', content: data.errorMsg });
        }
      }
    }
  });

}


/**
 * 合并支付（校验后）
 * @param  props 
 */
const doPayMerge = async function (props, isNetpay) {

  let pk_allocate_pay = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  let ts_pay = props.form.getFormItemsValue(card_from_id, 'ts');

  let payresult = await Sign({
    isSign: true,
    isKey: isNetpay,
    data: null,
    encryptVOClassName: null,
    primaryId: [pk_allocate_pay && pk_allocate_pay.value]
  });
  if (payresult.isStop) {
    return;
  }

  let data_pay = {
    "pk": pk_allocate_pay && pk_allocate_pay.value,
    "ts": ts_pay && ts_pay.value,
    "pageid": card_page_id,
    'isCardOpt': true,
    'sign_strSrc': payresult.data && payresult.data.text,
    'signature': payresult.data && payresult.data.signText,
    'sing_sn': payresult.data && payresult.data.userjson,
  };

  ajax({
    url: '/nccloud/sf/allocation/allocatemergepay.do',
    data: data_pay,
    success: (res) => {
      let { success, data } = res;
      if (success) {
        if (data.errorMsg) {
          toast({ color: 'warning', content: data.errorMsg });
        }
        else if (data.interactMsg) {
          props.modal.show('payModel', {
            title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
            content: data.interactMsg,
            //点击确定按钮事件
            beSureBtnClick: buttonClick.bind(this, props, 'mergepayconfirm'),
          });
        }
        else if (data.successMsg) {
          toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000021') })/* 国际化处理： 合并支付成功*/
          if (data.billCard) {
            if (data.billCard.head) {
              props.form.setAllFormValue({ [card_from_id]: data.billCard.head[card_from_id] });
              cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), data.billCard, card_from_id, dataSource);
            }
            if (data.billCard.body) {
              props.cardTable.setTableData(card_table_id, data.billCard.body[card_table_id]);
            }
            this.toggleShow();
          }
        }
      }
    }
  });
}





/**
 * 支付确认单
 * @param  props 
 */
const doPayConfirm = function (props) {
  let payconfirmcheckrows = props.cardTable.getCheckedRows(card_table_id)

  if (payconfirmcheckrows.length != 1) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000055') })/* 国际化处理： 请选择一条表体数据操作!*/
    return;
  } else {
    //处理选择数据
    let paystatus = payconfirmcheckrows[0].data.values.paystatus.value;
    let netpayinfo = payconfirmcheckrows[0].data.values.netpayinfo.value;
    if (!paystatus || paystatus != 2) {
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000056') })/* 国际化处理： 请选择支付状态为支付中的表体进行操作!*/
      return;
    } else if (!netpayinfo) {
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000057') })/* 国际化处理： 请先下载支付指令状态!*/
      return;
    }
    let pk_allocate_bArr = [];
    pk_allocate_bArr.push(payconfirmcheckrows[0].data.values.pk_allocate_b);

    let payconfirmpk_h = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
    let payconfirmpk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
    let payconfirmpk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
    let payconfirmvbillno = props.form.getFormItemsValue(card_from_id, 'vbillno');
    // 支付确认
    props.openTo('/obm/ebankconfirmpay/confirmpay/main/index.html#/card', {
      billtype: '36CC',
      pagecode: '36100CONFM_L01',
      appcode: '36100CONFM',
      status: 'add',
      /** 组织 */
      pk_org: payconfirmpk_org && payconfirmpk_org.value,
      /** 集团 */
      pk_group: payconfirmpk_group && payconfirmpk_group.value,
      /** 来源单据编号 */
      srcbillcode: payconfirmvbillno && payconfirmvbillno.value,
      /** 来源单据类型 */
      srcbilltype: '36K2',
      /** 来源单据节点号 */
      srcnodecode: '36320FA_PAY',
      /** 来源单据主表PK */
      srcpkid: payconfirmpk_h && payconfirmpk_h.value,
      /** 来源系统 */
      srcsystem: 'SF',
      /** 指令参考号 */
      yurref: payconfirmcheckrows[0].data.values.pk_allocate_b.value,
    });
    doRefresh.call(this, props)
  }
}

export default buttonClick;
/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/