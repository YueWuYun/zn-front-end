/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {  toast, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';//凭证
/**
 * 按钮事件
 * @param {*} props 
 * @param {*} id 
 */
export default function (props, id) {
  //联查凭证
  let voucher_billtype = Templatedata.voucher_billtype;
  let voucher_appcode = Templatedata.voucher_appcode;
  //打印
  let printcard_nodekey = Templatedata.printcard_nodekey;
  //联查审批意见
  let approve_billtype = Templatedata.approve_billtype;

  switch (id) {

    // 审批
    case 'approveBtn':
      break

    // 审批取消
    case 'unapproveBtn':
      break

    //刷新
    case 'refreshBtn':
      break

    //导入
    case 'importBtn':
      break

    //导出
    case 'exportBtn':
      break

    //审批意见
    case 'cardapprovemsgBtn':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000011') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      let billid = this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value;
      if (billid) {
        this.setState({
          show: true,
          billtype: approve_billtype,//单据类型
          billid: billid//单据pk
        });
      }
      break;

    //附件
    case 'cardaccessoryBtn':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000011') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      let pk_rec = props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value;;//单据pk
      let bill_no = props.form.getFormItemsValue(this.formId, 'vbillno').value;;//单据编号
      this.setState({
        billId: pk_rec,//单据pk
        billno: bill_no,//附件管理使用单据编号
        showUploader: !this.state.showUploader,
        target: null
      })

      break;

    //打印
    case 'cardprintBtn':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000011') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/cmp/curexchange/curexchangeprint.do',
        {
          appcode:'36070FCE',// appcode: props.getSearchParam('c'),//小应用codeprintcard_funcode
          nodekey: 'NCC36070FCECARD',     //模板节点标识：单据模版初始化
          oids: [this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value]

        }
      );
      break;
    //输出
    case 'cardoutputBtn':
      let pks = [];
      pks.push(this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value);
      output({
        url: '/nccloud/cmp/curexchange/curexchangeprint.do',
        data: {
          nodekey: printcard_nodekey,
          appcode:'36070FCE',// appcode: props.getSearchParam('c'),
          oids:pks,
          outputType: 'output'
        }
      });
      break
    //联查凭证
    case 'cardvoucherBtn':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000011') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      linkVoucherApp(
        props,
        this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_group').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
        voucher_billtype,
        this.props.form.getFormItemsValue(this.formId, 'vbillno').value,
      );

      break;

    //买入余额
    case 'cardbuybalanceBtn':
      // toast({ color: 'warning', content: '功能待开发' });
      let buybalanceBtnArr = [];
      let pk_buyorg, pk_buyacct
      if (props.form.getFormItemsValue(this.formId, 'pk_org').value) {
        pk_buyorg = props.form.getFormItemsValue(this.formId, 'pk_org').value;
      }
      if (props.form.getFormItemsValue(this.formId, 'pk_buyacct').value) {
        pk_buyacct = props.form.getFormItemsValue(this.formId, 'pk_buyacct').value;
      } else {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000013') });/* 国际化处理： 买入账户为空！*/
        return;
      }
      let buyquery_data = {
        pk_org: pk_buyorg, //财务组织id
        pk_account: pk_buyacct, //银行账户id，没有可不写，和现金账户二选一
        pk_cashaccount: null //现金账户id，没有可不写
      }
      buybalanceBtnArr.push(buyquery_data);//买入银行账号
      this.setState({
        showOriginalData: buybalanceBtnArr,
        showOriginal: true,
      });
      break

    //卖出余额
    case 'cardsellbalanceBtn':
      // toast({ color: 'warning', content: '功能待开发' });
      let sellbalanceBtnArr = [];
      let pk_sellacct = null;
      if (props.form.getFormItemsValue(this.formId, 'pk_sellacct').value) {
        pk_sellacct = props.form.getFormItemsValue(this.formId, 'pk_sellacct').value;
      } else {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000015') });/* 国际化处理： 卖出账户为空！*/
        return;
      }
      let pk_sellorg = null;
      if (props.form.getFormItemsValue(this.formId, 'pk_org').value) {
        pk_sellorg = props.form.getFormItemsValue(this.formId, 'pk_org').value;
      }
      //修改请求联查方式
      let query_sell_data = {
        pk_org: pk_sellorg, //财务组织id
        pk_account: pk_sellacct, //银行账户id，没有可不写，和现金账户二选一
        pk_cashaccount: null //现金账户id，没有可不写
      }
      sellbalanceBtnArr.push(query_sell_data);//卖出银行账号
      this.setState({
        showOriginalData: sellbalanceBtnArr,
        showOriginal: true,
      });
      break

    //手续费余额
    case 'cardchargebalanceBtn':
      let chargebalanceBtnArr = [];
      let pk_paychargeacct = null;
      if (props.form.getFormItemsValue(this.formId, 'pk_paychargeacct').value) {
        pk_paychargeacct = props.form.getFormItemsValue(this.formId, 'pk_paychargeacct').value;
      } else {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000017') });/* 国际化处理： 手续费账户为空！*/
        return;
      }
      let pk_charge_org = null;
      if (props.form.getFormItemsValue(this.formId, 'pk_org').value) {
        pk_charge_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
      }
      //修改请求联查方式
      let query_charge_data = {
        pk_org: pk_charge_org, //财务组织id
        pk_account: pk_paychargeacct, //银行账户id，没有可不写，和现金账户二选一
        pk_cashaccount: null //现金账户id，没有可不写
      }
      chargebalanceBtnArr.push(query_charge_data);//卖出银行账号
      this.setState({
        showOriginalData: chargebalanceBtnArr,
        showOriginal: true,
      });
      break;
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/