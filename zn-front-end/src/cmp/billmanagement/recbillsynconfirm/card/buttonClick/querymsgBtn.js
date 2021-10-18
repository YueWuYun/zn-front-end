/*DCfaZ3C3yGHSTUEeS2Z0542eZypnj5iM27xLivlxoo0Hrl4fciucyGal0Brx4kcW*/
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
 * [收款协同]-审批意见
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const querymsgBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000012') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let billid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    let approve_billtype = Templatedata.approve_billtype;
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