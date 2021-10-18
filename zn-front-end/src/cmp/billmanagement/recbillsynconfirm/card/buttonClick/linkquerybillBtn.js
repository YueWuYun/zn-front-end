/*NkiV9juwi3cve6/X1iRkvvGrpa+rP8NgIM/GVaC2uFiprjGCXJw3j1iu5HMrcy5L*/
import { createPage, ajax, base, high, toast, cacheTools, cardCache, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
import { MakeBillApp } from '../../../../public/utils/Makebill';//制单
import { linkApp, linkVoucherApp } from '../../../../public/utils/LinkUtil';//凭证
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款协同]-联查单据
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const linkquerybillBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000012') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let showbilltrackpk = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    let billtrack_billtype = Templatedata.billtrack_billtype;
    if (this.props.form.getFormItemsValue(this.formId, 'bill_type').value) {
        billtrack_billtype = this.props.form.getFormItemsValue(this.formId, 'bill_type').value;
    }
    let pk_srcbilltypecode = this.props.form.getFormItemsValue(this.formId, 'up_billtype') && this.props.form.getFormItemsValue(this.formId, 'up_billtype').value
    if (pk_srcbilltypecode && pk_srcbilltypecode == '36S3') {
      toast({
        color: 'warning',
        content:this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000131') });/* 国际化处理： 操作失败，无数据!*/

      return;
    }

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