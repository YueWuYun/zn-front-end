/*uw6XmGACqGEk733an3ENVfywMvLy3GZNqOj/po+Frbx+s70HDS6P7q96qgJwor69*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-取消结算按钮
 * @param {*} props  
 */
export const cardUnsettleBtn = function () {
    let un_settle_status = this.props.getUrlParam('status');
    let data = {
        'pk': this.props.getUrlParam('id'),
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value,
        'pageid': this.pageId
    };
    ajax({
        url: '/nccloud/cmp/curexchange/curexchangeunsettle.do',
        data: data,
        success: (res) => {
            if (res && res.data) {
                let cc = res.data[this.formId].rows[0].values.pk_cruexchange.value;
                let dd = res.data[this.formId].rows[0].values.busistatus.value;
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000007') });/* 国际化处理： 结算取消成功*/
                //浏览态页面
                this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                //页面跳转按钮显示
                let unsettlepk = res.data[this.formId].rows[0].values.pk_cruexchange.value;
                let unsettlebillno = res.data[this.formId].rows[0].values.vbillno.value;
                let unsettlestatus = res.data[this.formId].rows[0].values.busistatus.value;
                this.billno = unsettlebillno;
                this.props.setUrlParam({
                    status: 'browse',
                    id: unsettlepk,
                    pk: unsettlestatus
                });
                this.toggleShow();//切换页面状态
                //增加缓存
                if (!un_settle_status || un_settle_status == 'add' || un_settle_status == 'copy') {
                    //新增缓存
                    addCache(unsettlepk, res.data, this.formId, this.dataSource, res.data[this.formId].rows[0].values);
                } else {
                    //更新缓存
                    updateCache(this.pkname, unsettlepk, res.data, this.formId, this.dataSource, res.data[this.formId].rows[0].values);
                }
            }
        }
    });
}

/*uw6XmGACqGEk733an3ENVfywMvLy3GZNqOj/po+Frbx+s70HDS6P7q96qgJwor69*/