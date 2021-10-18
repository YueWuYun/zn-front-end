/*WZdUFj7XJKAXhXM6lPMATVmBgcDIGsbmq0J1nqIJ+vwGjICdSEIKQQJhvq71GGsO*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-提交按钮
 * @param {*} props  
 */
export const cardSubmitBtn = function () {
    let card_sub_status = this.props.getUrlParam('status');
    if (!this.props.getUrlParam('id')) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000008') });/* 国际化处理： 操作失败，无数据！*/
    }
    let tsss = this.props.form.getFormItemsValue(this.formId, 'ts').value
    let data = {
        'pk': this.props.getUrlParam('id'),
        'pageid': this.pageId,
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value
    };
    ajax({
        url: '/nccloud/cmp/curexchange/curexchangecardsubmit.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (data) {
                //提交--指派
                if (data && data.workflow &&
                    (data.workflow == 'approveflow' ||
                        data.workflow == 'workflow')) {
                    this.compositedata = data;
                    this.setState({
                        compositedisplay: true
                    });
                } else if (data) {
                    toast({
                        color: 'success',
                        content: this.props.MutiInit.getIntl("36070FCE") &&
                            this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000009')
                    })/* 国际化处理： 提交成功*/
                    //加载数据
                    this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                    //页面跳转按钮显示
                    let subpk = res.data[this.formId].rows[0].values.pk_cruexchange.value;
                    let subbillno = res.data[this.formId].rows[0].values.vbillno.value;
                    let substatus = res.data[this.formId].rows[0].values.busistatus.value;
                    this.billno = subbillno;
                    this.props.setUrlParam({
                        status: 'browse',
                        id: subpk,
                        pk: substatus
                    });
                    this.toggleShow();//切换页面状态
                    //增加缓存
                    if (!card_sub_status || card_sub_status == 'add' || card_sub_status == 'copy') {
                        //新增缓存
                        addCache(subpk, res.data, this.formId, this.dataSource, res.data[this.formId].rows[0].values);
                    } else {
                        //更新缓存
                        updateCache(this.pkname, subpk, res.data, this.formId, this.dataSource, res.data[this.formId].rows[0].values);
                    }
                }
            }
        }
    });
}

/*WZdUFj7XJKAXhXM6lPMATVmBgcDIGsbmq0J1nqIJ+vwGjICdSEIKQQJhvq71GGsO*/