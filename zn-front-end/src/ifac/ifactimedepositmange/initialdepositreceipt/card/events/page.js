/*THKCOjNyYOubQLqLOpp8umft4H9tBCEWQazhRlNBS3E=*/
import { ajax, cardCache, toast } from 'nc-lightapp-front';
import { buttonVisible } from './buttonVisible';
import { baseReqUrl, javaUrl } from '../../cons/constant.js';
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
let { getCacheById, updateCache, addCache } = cardCache;

/**
 * 新增
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
    props.setUrlParam(pks);
    getCardData.call(this, this.cardUrl, pks);
}

/**
 * 新增
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCardData(url, id, isFirst = false, isRefresh = false) {
    let cardData = getCacheById(id, this.cache);
    if (this.props.getUrlParam('status') == 'copy' || this.props.getUrlParam('status') == 'edit') {
        this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
    }
    let flag = true;
    if(this.props.getUrlParam('status') == 'copy'){
        flag = false;
    }
    if (cardData && !isRefresh && !isFirst) {//有缓存且不是刷新按钮
        let ts = cardData.head[this.formId].rows[0].values.ts.value;
        this.idTs = { id, ts };
        this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
        orgVersionView(this.props, this.formId);//组织版本视图
        buttonVisible.call(this, this.props);
        this.props.resMetaAfterPkorgEdit();
        return;
    }
    ajax({
        url: `${url}.do`,
        data: {
            pk: id,
            pageCode: this.pageId
        },
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data && data.head) {
                    let ts = data.head[this.formId].rows[0].values.ts.value;
                    let glcrate = data.head[this.formId].rows[0].values.glcrate.value;
                    let gllcrate = data.head[this.formId].rows[0].values.gllcrate.value;
                    let olcrate = data.head[this.formId].rows[0].values.olcrate.value;
                    this.idTs = { id, ts };
                    this.props.form.setAllFormValue({ [this.formId]: data.head[this.formId] });
                    this.props.resMetaAfterPkorgEdit();
                    //this.props.form.setFormItemsDisabled(this.formId, {});
                    this.props.form.setFormItemsDisabled(this.formId, { 'billmaker': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'billmakedate': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_confirm': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'confirmdate': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'creator': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'creationtime': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'modifier': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'modifiedtime': true });
                    if (glcrate != 1) {
                        this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': false });
                    }else{
                        this.props.form.setFormItemsDisabled(this.formId, { 'glcrate': true });
                    }
                    if (gllcrate != 1) {
                        this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': false });
                    }else{
                        this.props.form.setFormItemsDisabled(this.formId, { 'gllcrate': true });
                    }
                    if(olcrate != 1){
                        this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': false });
                    }else{
                        this.props.form.setFormItemsDisabled(this.formId, { 'olcrate': true });
                    }
                }
                orgVersionView(this.props, this.formId);//组织版本视图
                buttonVisible.call(this, this.props);
                if ((isFirst || isRefresh) && flag) {//didmount或者刷新按钮
                    //保存缓存
                    addCache(id, data, this.formId, this.cache);
                } else if(flag) {
                    // 更新缓存
                    updateCache(this.primaryId, id, data, this.formId, this.cache);
                }
                if (isRefresh) {// 更新列表缓存
                    updateCache(this.primaryId, id, data, this.formId, this.dataSource);
                }
            }
        },
        error: (res) => {
            this.props.setUrlParam({
                status: 'browse',
                id: this.props.getUrlParam('id')
            });
            toast({ color: 'warning', content: res.message });
            this.props.form.EmptyAllFormValue(this.formId);
            buttonVisible.call(this, this.props);
            updateCache(this.primaryId, id, data, this.formId, this.dataSource);
            return;
        }
    });
}

/*THKCOjNyYOubQLqLOpp8umft4H9tBCEWQazhRlNBS3E=*/