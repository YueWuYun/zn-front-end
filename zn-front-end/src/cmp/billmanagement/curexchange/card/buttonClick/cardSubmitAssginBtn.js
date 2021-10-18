/*VzuNHp8ye56a/V99iD0SqIIK4pQ/dWqKYakaa8b9lvkcOrELOTZktwrdx3WKcT2A*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-提交指派按钮
 * @param {*} props  
 */
export const cardSubmitAssginBtn = function () {
    let card_sub_status = this.props.getUrlParam('status');
    if (!this.props.getUrlParam('id')) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000008') });/* 国际化处理： 操作失败，无数据！*/
    }
    let tsss = this.props.form.getFormItemsValue(this.formId, 'ts').value
    let tsObjmap = {
        'param': this.getAssginUsedr//提交指派使用
    }
    if (!this.getAssginUsedr) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            content: this.props.MutiInit.getIntl("36070FCE") && 
            this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000081')   ///* 国际化处理：请选择指派人!*/
        });
        return;
    }
    let data = {
        'pk': this.props.getUrlParam('id'),
        'pageid': this.pageId,
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value,
        'tsObjmap': tsObjmap
    };
    ajax({
        url: '/nccloud/cmp/curexchange/curexchangecardsubmit.do',
        data: data,
        success: (res) => {
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
             //关闭指派框
             this.setState({
                compositedisplay: false
            })
        }
    });
}

/*VzuNHp8ye56a/V99iD0SqIIK4pQ/dWqKYakaa8b9lvkcOrELOTZktwrdx3WKcT2A*/