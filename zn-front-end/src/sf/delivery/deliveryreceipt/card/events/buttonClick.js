/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { createPage, ajax, base, toast, print, promptBox, output } from 'nc-lightapp-front';
import { card_page_id, printParameter, dataSource, card_from_id, base_url } from '../../cons/constant.js';
const { NCMessage } = base;
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import {elecSignPrint } from "../../util/index";
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator } from '../../../../pub/utils/SFButtonUtil.js';
export default function (props, id) {
  const pk_deliveryreceipt = props.form.getFormItemsValue(this.formId, 'pk_deliveryreceipt').value;
  const billnoe = props.form.getFormItemsValue(this.formId, 'vbillno').value;
  const pks = new Array;
  switch (id) {
    //打印
    case 'Print':
      if (!pk_deliveryreceipt) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FCR-000002') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      print(
        printParameter.prinType,  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        printParameter.actionUrl,
        {
          // billtype: printParameter.billtype,  //单据类型
          funcode: printParameter.funcode, //功能节点编码，即模板编码
          nodekey: printParameter.nodekey,     //模板节点标识
          // printTemplateID: printParameter.printTemplateID, //模板id
          oids: [pk_deliveryreceipt]
        }
      );
      break;
    //输出
    case 'Output':
      if (!pk_deliveryreceipt) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FCR-000002') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      output({
        url: printParameter.actionUrl,
        data: {
          funcode: printParameter.funcode, //功能节点编码，即模板编码
          nodekey: printParameter.nodekey,     //模板节点标识
          // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
          oids: [pk_deliveryreceipt],
          outputType: 'output'
        }
      });
      // this.refs.printOutput.open();
      // this.setState(
      //   {
      //     outputData: {
      //       // funcode: printParameter.funcode, //功能节点编码，即模板编码
      //       // nodekey: printParameter.nodekey, //模板节点标识
      //       // printTemplateID: printParameter.printTemplateID, //模板id
      //       oids: [pk_deliveryreceipt],
      //       outputType: 'output'
      //     }//打印输出使
      //   },
      //   () => {
      //     this.refs.printOutput.open();
      //   }
      // );
      break;
    //正式打印
    case 'Official':
      elecSignPrint(props,true,true);
      break;
    //补充打印
    case 'Inofficial':
      elecSignPrint(props,false,true);
      break;      
    //联查 收款内部户  pk_accid_p
    case 'PayInside':
      // let pkAccount = this.props.form.getFormItemsValue(this.formId, 'pk_accid_p').value
      // if (pkAccount) {
      //   this.setState({ accModalShow: true, currentpk: pkAccount })
      // } else {
      //   toast({ color: 'warning', content: loadMultiLang(props,'36320FCR-000003') });/* 国际化处理： 账户为空,无法进行联查。 */
      //   return;
      // }
      let payInside_rarr = [];
      let payInsidepk_org_r, pk_accid_p;
      if (this.props.form.getFormItemsValue(this.formId, 'pk_org')
        && this.props.form.getFormItemsValue(this.formId, 'pk_org').value) {
          payInsidepk_org_r = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
      }
      if (this.props.form.getFormItemsValue(this.formId, 'pk_accid_p')
        && this.props.form.getFormItemsValue(this.formId, 'pk_accid_p').value) {
          pk_accid_p = this.props.form.getFormItemsValue(this.formId, 'pk_accid_p').value;
      }
      let payInside_rdata = {
        // 财务组织
        pk_org: payInsidepk_org_r,
        // 银行账户id
        pk_account: pk_accid_p,
      };
      payInside_rarr.push(payInside_rdata);
      this.setState({
        showOriginalData: payInside_rarr,
        showOriginal: true,
      });
      break;
    //联查 付款账户  pk_bankacc_p
    case 'Receivables':
      let bankaccbalance_rarr = [];
      let restpk_org_r, pk_bankacc_p, bankacc_rrestkey;
      if (this.props.form.getFormItemsValue(this.formId, 'pk_org')
        && this.props.form.getFormItemsValue(this.formId, 'pk_org').value) {
        restpk_org_r = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
      }
      if (this.props.form.getFormItemsValue(this.formId, 'pk_bankacc_p')
        && this.props.form.getFormItemsValue(this.formId, 'pk_bankacc_p').value) {
        pk_bankacc_p = this.props.form.getFormItemsValue(this.formId, 'pk_bankacc_p').value;
      }
      let bankaccbalance_rdata = {
        // 财务组织
        pk_org: restpk_org_r,
        // 银行账户id
        pk_account: pk_bankacc_p,
      };
      bankaccbalance_rarr.push(bankaccbalance_rdata);
      this.setState({
        showOriginalData: bankaccbalance_rarr,
        showOriginal: true,
      });
      break;
    //联查 计划预算
    case 'Plan':
      let queryntbplanData = {
        pk: pk_deliveryreceipt,
        pageid: card_page_id,
      };
      ajax({
        url: '/nccloud/sf/deliveryreceipt/deliveryreceiptplan.do',
        data: queryntbplanData,
        success: (res) => {
          if (res.success) {
            if (res.data && res.data.hint) {
              toast({ color: 'warning', content: res.data.hint });
              return;
            } else {
              this.setState({
                showNtbDetail: true,
                ntbdata: res.data
              });
            }
          }
        }
      });
      break;
    //联查 凭证
    case 'Voucher':
//      let pk_deliveryreceipt = this.props.form.getFormItemsValue(card_from_id, 'pk_deliveryreceipt').value;
      let pk_group = this.props.form.getFormItemsValue(card_from_id, 'pk_group').value;
      let pk_org = this.props.form.getFormItemsValue(card_from_id, 'pk_org').value;
      let vbillno = this.props.form.getFormItemsValue(card_from_id, 'vbillno').value;
      let pk_billtype = this.props.form.getFormItemsValue(card_from_id, 'pk_billtype').value;

      linkVoucherApp(this.props, pk_deliveryreceipt, pk_group, pk_org, pk_billtype, vbillno);
      // linkVoucherApp(props, pk_deliveryreceipt, 'nc.vo.sf.deliveryreceipt.AggDeliveryReceiptVO');
      break;
    //记账
    case 'Bookkeeping':
      cardOperator(props, card_page_id, card_from_id, [],
        'pk_deliveryreceipt', base_url + 'deliveryreceipttally.do', loadMultiLang(props,'36320FCR-000036'), dataSource,doRefresh.bind(this),true,{ btncode: 'Bookkeeping', pagecode: card_page_id });/* 国际化处理： 记账成功！*/
      break;
    //取消记账
    case 'UnBookkeeping':
      cardOperator(props, card_page_id, card_from_id, [],
        'pk_deliveryreceipt', base_url + 'deliveryreceiptUntally.do', loadMultiLang(props,'36320FCR-000033'), dataSource, doRefresh.bind(this),true,{ btncode: 'UnBookkeeping', pagecode: card_page_id });/* 国际化处理： 取消成功！*/
      break;
    //制证
    case 'Certification':
      cardOperator(props, card_page_id, card_from_id, [],
        'pk_deliveryreceipt', base_url + 'deliveryreceiptvoucher.do', loadMultiLang(props,'36320FCR-000037'), dataSource, doRefresh.bind(this),true,{ btncode: 'Certification', pagecode: card_page_id });/* 国际化处理： 制证成功！*/
      break;
    //取消制证
    case 'UnCertification':
      cardOperator(props, card_page_id, card_from_id, [],
        'pk_deliveryreceipt', base_url + 'deliveryreceiptunvoucher.do', loadMultiLang(props,'36320FCR-000033'), dataSource, doRefresh.bind(this),true,{ btncode: 'UnCertification', pagecode: card_page_id });/* 国际化处理： 取消成功！*/
      break;
    //附件管理
    case 'File':
      this.setState({
        billId: pk_deliveryreceipt, //单据id
        billno: billnoe, // 单据编号
        showUploader: !this.state.showUploader,
        target: null
      })
      break;
    //刷新
    case 'Refresh':
      this.refresh();
      break;
  }
}

/**
 * 刷新
 * @param  props 
 */
const doRefresh = function (props) {
  this.refresh();
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/