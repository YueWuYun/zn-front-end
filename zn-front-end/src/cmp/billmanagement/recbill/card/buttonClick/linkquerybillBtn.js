/*NkiV9juwi3cve6/X1iRkvvGrpa+rP8NgIM/GVaC2uFiprjGCXJw3j1iu5HMrcy5L*/
import { toast, cardCache, print, output } from 'nc-lightapp-front';

/**
 * [外币兑换]-联查单据按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const linkquerybillBtn = function () {
  if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
    return;
  }
  let pk_srcbilltypecode = this.props.form.getFormItemsValue(this.formId, 'up_billtype') && this.props.form.getFormItemsValue(this.formId, 'up_billtype').value
  if (pk_srcbilltypecode && pk_srcbilltypecode == '36S3') {
    toast({
      color: 'warning',
      content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000131') });/* 国际化处理： 操作失败，无数据!*/
    return;
  }

  let showbilltrackpk = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
  let billtrack_billtype = '';
  if (this.props.form.getFormItemsValue(this.formId, 'bill_type').value) {
    billtrack_billtype = this.props.form.getFormItemsValue(this.formId, 'bill_type').value;
  }

  if (showbilltrackpk) {
    this.setState(
      {
        showbilltrackpk: showbilltrackpk,
        showbilltracktype:'F4' //单据pk
      },
      () => {
        this.setState({
          showbilltrack: true
        });
      }
    );
  }

}

/*NkiV9juwi3cve6/X1iRkvvGrpa+rP8NgIM/GVaC2uFiprjGCXJw3j1iu5HMrcy5L*/