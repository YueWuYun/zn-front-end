/*W8YNa24IDSX5oNRyYONnS7hNfcB0TuPc/k2GR9iFunkIncn65th7yeWWDAADHHDU*/
import { createPage, ajax, base, high, toast, cacheTools,cardCache,print,output } from 'nc-lightapp-front';
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
 * [收款协同]-取消确认
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const unconfirmBtn = function () {
    let unconfirmBtnArr = [];
      let unsaveSubStatus = this.props.getUrlParam('status');
      unconfirmBtnArr.push(this.props.getUrlParam('id'));
      let unconfirmBtnData = {
        'pks': unconfirmBtnArr,
        'pageid': this.pageId,
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value
      };
      ajax({
        url: '/nccloud/cmp/recbill/recbillunsynconfirm.do',
        data: unconfirmBtnData,
        success: (res) => {
          toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000014') });/* 国际化处理： 协同取消确认成功*/

          let uncon_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
          let uncon_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
          //增加缓存
          if (!unsaveSubStatus || unsaveSubStatus == 'add' || unsaveSubStatus == 'copy') {
            //新增缓存
            addCache(uncon_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
          } else {
            //更新缓存
            updateCache(this.pkname, uncon_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
          }
          this.props.pushTo('/card', {
            status: 'browse',
            id: uncon_pk_recbill,
            billno: uncon_billstatue
          })
          this.refresh();
        }
      });
}

/*W8YNa24IDSX5oNRyYONnS7hNfcB0TuPc/k2GR9iFunkIncn65th7yeWWDAADHHDU*/