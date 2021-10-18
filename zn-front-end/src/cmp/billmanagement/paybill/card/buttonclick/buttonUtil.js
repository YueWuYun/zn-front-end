/*jfEfzE45EHJfWUvTj+cmcRLNlRXw70rF6ir8ELL5wxXFe/muPAUCigrai/Hq0Txg*/
import {
  toast,
  cardCache,
  print,
  output
} from 'nc-lightapp-front';
import {
  saveMultiLangRes,
  loadMultiLang
} from '../../../../../tmpub/pub/util';

/**
 * -联查单据按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const billquery = function () {
  if (!this.props.form.getFormItemsValue(this.formId, 'pk_paybill').value) {
    toast({
      color: 'warning',
      content: loadMultiLang(this.props, '36070PBR-000003')
    }); /* 国际化处理： 操作失败，无数据!*/
    return;
  }
  let pk_srcbilltypecode = this.props.form.getFormItemsValue(this.formId, 'up_billtype') && this.props.form.getFormItemsValue(this.formId, 'up_billtype').value
  if (pk_srcbilltypecode && pk_srcbilltypecode == '36S3') {
    toast({
      color: 'warning',
      content:loadMultiLang(this.props, '36070PBR-000120') /* 国际化处理： 到账通知不支持单据追溯!*/
    });
    return;
  }
  let billtrackpk = this.props.form.getFormItemsValue(this.formId, 'pk_paybill').value;
  let  billtrack_billtype='F5';
  if (this.props.form.getFormItemsValue(this.formId, 'bill_type').value) {
    billtrack_billtype = this.props.form.getFormItemsValue(this.formId, 'bill_type').value;
  }
  if (billtrackpk) {
    this.setState(
      {
        showbilltrackpk: billtrackpk,
        showbilltracktype:'F5' //单据pk
      },
      () => {
        this.setState({
          showbilltrack: true
        });
      }
    );
  }
}
/*jfEfzE45EHJfWUvTj+cmcRLNlRXw70rF6ir8ELL5wxXFe/muPAUCigrai/Hq0Txg*/