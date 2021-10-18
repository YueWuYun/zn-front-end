/*5TJi9BS8/DOgTZreZ83mvWX449PKqnUHlLu4d8Ca3vqt1wsIt9GUO1v46uvNM0Qe*/
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
 * [收款协同]-复制
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const copybodyBtn = function () {
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (!org_val && !org_display) {
        toast({
          'color': 'warning',
          'content': this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
      }
      if (org_val && org_display) {
        let currRows3 = this.props.cardTable.getCheckedRows(this.tableId);
        if (currRows3 && currRows3.length > 0) {
          this.setState({ pasteflag: true }, () => {
            this.toggleShow();
          });
        } else {
          toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000006')/* 国际化处理： 请选择复制数据！*/
          });
          return;
        }
      }
}

/*5TJi9BS8/DOgTZreZ83mvWX449PKqnUHlLu4d8Ca3vqt1wsIt9GUO1v46uvNM0Qe*/