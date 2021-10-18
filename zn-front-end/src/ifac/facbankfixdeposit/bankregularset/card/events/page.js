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
export function pageClick (props, pks) {
    props.setUrlParam(pks);
	getCardData.call(this,this.cardUrl, pks);
}

/**
 * 新增
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCardData (url, id, isFirst= false, isRefresh= false) {
    let cardData = getCacheById(id, this.cache);
    let pageid = this.pageId;
    if(this.props.getUrlParam('status') == 'copy' || this.props.getUrlParam('status') == 'edit'){
        this.props.form.setFormItemsDisabled(this.formId, {pk_org:true});
    }
    if(this.props.getUrlParam('status') == 'copy'){
        this.props.form.setFormItemsDisabled(this.formId,
            {  'creator': true, 'creationtime': true,'modifier': true, 'modifiedtime': true});
    }
    if (cardData && !isRefresh && !isFirst) {//有缓存且不是刷新按钮
        let ts= cardData.head[this.formId].rows[0].values.ts.value;
        this.idTs= {id, ts};
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
            let { success, data }= res;
            if (success) {
            	let idNew = data.head[this.formId].rows[0].values[this.primaryId].value;
                if (data && data.head) {
                    let ts= data.head[this.formId].rows[0].values.ts.value;
                    this.idTs= {id, ts};
                    this.props.form.setAllFormValue({ [this.formId]: data.head[this.formId] });
                    this.props.resMetaAfterPkorgEdit();
                    // this.props.form.setFormItemsDisabled(this.formId, {});
                }
                orgVersionView(this.props, this.formId);//组织版本视图
                buttonVisible.call(this, this.props);
                if (isFirst || isRefresh) {//didmount或者刷新按钮
                    //保存缓存
                	if(idNew){
                        addCache(idNew, data, this.formId, this.cache);
                        }
                } else {
                    // 更新缓存
                    updateCache(this.primaryId, id, data, this.formId, this.cache);
                }
                if (isRefresh) {// 更新列表缓存
                    updateCache(this.primaryId, id, data, this.formId, this.dataSource);
                }
            }
        },
        error: (res) => {
            toast({color: 'danger', content: res.message});
        }
    }); 
}

/*THKCOjNyYOubQLqLOpp8umft4H9tBCEWQazhRlNBS3E=*/