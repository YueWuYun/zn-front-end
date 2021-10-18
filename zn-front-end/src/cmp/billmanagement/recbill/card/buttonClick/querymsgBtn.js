/*DCfaZ3C3yGHSTUEeS2Z0542eZypnj5iM27xLivlxoo0Hrl4fciucyGal0Brx4kcW*/
import { createPage, ajax, base, high, toast, cardCache, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
/**
 * [收款结算]-审批意见按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const querymsgBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let billid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    let approve_billtype=Templatedata.billtrack_billtype;
    if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
        approve_billtype = this.props.form.getFormItemsValue(this.formId, 'trade_type').value;
    }

    if (billid) {
        this.setState(
          {
            billtype: approve_billtype,
            approvebillid:billid//单据pk
          },
          () => {
            this.setState({
                show: true
            });
          }
        );
      }

}

/*DCfaZ3C3yGHSTUEeS2Z0542eZypnj5iM27xLivlxoo0Hrl4fciucyGal0Brx4kcW*/