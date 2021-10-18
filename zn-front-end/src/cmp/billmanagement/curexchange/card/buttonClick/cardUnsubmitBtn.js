/*SQhAaR9gAkS4p3wXGvDXUjD4WmgrCoVCodw7p4fNZGPA60jAoV5h2COQhf3APKiw*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-收回按钮
 * @param {*} props  
 */
export const cardUnsubmitBtn = function () {
    let card_unsub_status = this.props.getUrlParam('status');
    if (!this.props.getUrlParam('id')) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000008') });/* 国际化处理： 操作失败，无数据！*/
    }
    let tssss = this.props.form.getFormItemsValue(this.formId, 'ts').value
    let data = {
        'pk': this.props.getUrlParam('id'),
        'pageid': this.pageId,
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value
    };
    ajax({
        url: '/nccloud/cmp/curexchange/curexchangecardunsubmit.do',
        data: data,
        success: (res) => {
            toast({ color: 'success', content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000010') });/* 国际化处理： 收回成功*/
            //加载数据
            this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
            //页面跳转按钮显示
            let unsubpk = res.data[this.formId].rows[0].values.pk_cruexchange.value;
            let unsubbillno = res.data[this.formId].rows[0].values.vbillno.value;
            let unsubstatus = res.data[this.formId].rows[0].values.busistatus.value;
            this.billno = unsubbillno;
            this.props.setUrlParam({
                status: 'browse',
                id: unsubpk,
                pk: unsubstatus
            });
            this.toggleShow();//切换页面状态
            //增加缓存
            // addCacheId(this.formId, savepk);
            if (!card_unsub_status || card_unsub_status == 'add' || card_unsub_status == 'copy') {
                //新增缓存
                addCache(unsubpk, res.data, this.formId, this.dataSource, res.data[this.formId].rows[0].values);
            } else {
                //更新缓存
                updateCache(this.pkname, unsubpk, res.data, this.formId, this.dataSource, res.data[this.formId].rows[0].values);
            }
        }

    });
}

/*SQhAaR9gAkS4p3wXGvDXUjD4WmgrCoVCodw7p4fNZGPA60jAoV5h2COQhf3APKiw*/