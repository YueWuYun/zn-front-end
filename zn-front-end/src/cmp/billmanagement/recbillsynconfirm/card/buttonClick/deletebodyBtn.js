/*iZkEV46aapNhB6mUWaDAK0hmmC4I6CV+y58gz5e+Y9WOYwxvKyQC9YQ+GcuxXPMq*/
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
 * [收款协同]-表体删除行
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const deletebodyBtn = function () {
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        let currRows = this.props.cardTable.getCheckedRows(this.tableId);
        let currSelect = [];
        if (currRows && currRows.length > 0) {
            for (let item of currRows) {
                currSelect.push(item.index);
            }
        }
        if (currSelect.length == 0) {
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000005') });/* 国际化处理： 未选择数据!*/
            return;
        }
        this.props.cardTable.delRowsByIndex(this.tableId, currSelect);
    } else {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
}

/*iZkEV46aapNhB6mUWaDAK0hmmC4I6CV+y58gz5e+Y9WOYwxvKyQC9YQ+GcuxXPMq*/