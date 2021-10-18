/*y4SP581aGiYkmtniSWmrZQESCSrdYS41y0ZdUfSUuXYX5PrHHcX8/VPiIs4w8yFH*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-结算按钮
 * @param {*} props  
 */
export const cardSettleBtn = function () {
    let settle_status = this.props.getUrlParam('status');
    let data = {
        'pk': this.props.getUrlParam('id'),
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value,
        'pageid': this.pageId
    };
    ajax({
        url: '/nccloud/cmp/curexchange/curexchangesettle.do',
        data: data,
        success: (res) => {
            if (res && res.data) {
                let aa = res.data[this.formId].rows[0].values.pk_cruexchange.value;
                let bb = res.data[this.formId].rows[0].values.busistatus.value;
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000006') });/* 国际化处理： 结算成功*/
                //浏览态页面
                this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                //页面跳转按钮显示
                let settlepk = res.data[this.formId].rows[0].values.pk_cruexchange.value;
                let settlebillno = res.data[this.formId].rows[0].values.vbillno.value;
                let settlestatus = res.data[this.formId].rows[0].values.busistatus.value;
                this.billno = settlebillno;
                this.props.setUrlParam({
                    status: 'browse',
                    id: settlepk,
                    pk: settlestatus
                });
                this.toggleShow();//切换页面状态
                //增加缓存
                if (!settle_status || settle_status == 'add' || settle_status == 'copy') {
                    //新增缓存
                    addCache(settlepk, res.data, this.formId, this.dataSource, res.data[this.formId].rows[0].values);
                } else {
                    //更新缓存
                    updateCache(this.pkname, settlepk, res.data, this.formId, this.dataSource, res.data[this.formId].rows[0].values);
                }
            }
        }
    });
}

/*y4SP581aGiYkmtniSWmrZQESCSrdYS41y0ZdUfSUuXYX5PrHHcX8/VPiIs4w8yFH*/