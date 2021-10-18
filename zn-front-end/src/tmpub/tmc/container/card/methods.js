/*9D1QA5jkDSXDuuPdOG3mwHm87PC84tKnzb9S67GCVa52Vp1PTmlDbHhGl6Tt67mf*/
/* 
  封装卡片方法
  created by: liyaoh 2018-09-08
*/
import { ajax, toast, cardCache, deepClone } from 'nc-lightapp-front';
import { OPR_NAME, api } from '../common';
import { getCardData } from '../page';
let { getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById, addCache } = cardCache;

/**
 * 卡片页按钮操作
 *
 * @param {*} apiName - 操作名称
 * @param {*} data - 可选。不传默认为{pks: [pk]}
 * @param {*} success - -操作成功的回调函数
 */
export function baseOperation({ 
    apiName, 
    data, 
    success,
    ...other
}) {
    let pk = this.props.form.getFormItemsValue(this.formId, this.primaryId).value || this.props.getUrlParam('id');
    let ts = this.props.form.getFormItemsValue(this.formId, 'ts') && this.props.form.getFormItemsValue(this.formId, 'ts').value;
    let pkMapTs = new Map();
    //主键与tsMap
    if (pk && ts) {
        pkMapTs.set(pk, ts);
    }
    data = data || { 
        pks: [pk], 
        pkMapTs,
        pageCode: this.pageId 
    };
    api.call(this, {
        url: this.API_URL[apiName],
        data,
        success: success ? success : res => {
            let { success, data } = res;
            if (success) {
                //提交即指派
                if (other.composite && res.data.workflow && (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
                    this.setState({
                        compositedata: res.data,
                        compositedisplay: true
                    });
                }else{
                    toast({ color: 'success', content: `${OPR_NAME[apiName]}${this.state.json['TMCPUB-000043']}` });/* 国际化处理： 成功*/
                    //更新缓存数据
                    updateCache(this.primaryId, pk, data, this.formId, this.dataSource, data.head[this.formId].rows[0].values);
                    getCardData.call(this, pk);
                    this.buttonVisible(this.props);
                }        
            }
        },
        ...other
    });
}

/**
 * 保存单据
 * @param {*} apiName - 保存类型 save:保存 saveCommit:保存提交
 */
export function saveBill(apiName = 'save', saveData) {
    return new Promise (resolve => {
        if (!typeof saveData === 'undefined') {
            saveData = this.tabOrder ? 
                this.props.createTabsCardData(this.pageId, this.formId, this.tabOrder)
                :
                this.props.createExtCardData(this.pageId, this.formId, this.tabOrder);
        }
        let status = this.props.getUrlParam('status');
        let pkMapTs = new Map();
        let pk = this.props.form.getFormItemsValue(this.formId, this.primaryId).value || this.props.getUrlParam('id');
        let ts = this.props.form.getFormItemsValue(this.formId, 'ts') && this.props.form.getFormItemsValue(this.formId, 'ts').value;
        //主键与tsMap
        if (pk && ts) {
            pkMapTs.set(pk, ts);
        }
        saveData.pkMapTs = pkMapTs;
        //console.log('save saveData',saveData)
        if (this.props.form.isCheckNow(this.formId)) {
            api.call(this,{
                url: this.API_URL[apiName],
                data: saveData,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        let id = res.data.head[this.formId].rows[0].values[this.primaryId].value;
                        toast({ color: 'success', content: `${OPR_NAME[apiName]}${this.state.json['TMCPUB-000043']}` });/* 国际化处理： 成功*/
                        resolve(id, res);
                        // 缓存
                        if (status === 'add' || status === 'copy') {
                            addCache(id, data, this.formId, this.dataSource);
                        } else {
                            updateCache(this.primaryId, id, data, this.formId, this.dataSource);
                        }
                        
                    }
                }
            });
        }

    });
}

/**
 * 保存前事件
 *
 * @param {*} callback - 保存之前进行的操作
 */
export function saveBefore(callback) {
    let data = this.tabOrder ?
        this.props.createTabsCardData(this.pageId, this.formId, this.tabOrder)
        :
        this.props.createExtCardData(this.pageId, this.formId, this.tabOrder);
    if (typeof this.saveBefore === 'function') {
        this.saveBefore((newData) => {
            data = newData || data;
            this.tabOrder && this.props.validateToTabSave ? this.props.validateToTabSave(data, callback, this.tableTypeObj, '') : this.props.validateToSave(data, callback, this.tableTypeObj, '');
        });
    } else {
        this.tabOrder && this.props.validateToTabSave ? this.props.validateToTabSave(data, callback, this.tableTypeObj, '') : this.props.validateToSave(data, callback, this.tableTypeObj, '');
    }
}

/*9D1QA5jkDSXDuuPdOG3mwHm87PC84tKnzb9S67GCVa52Vp1PTmlDbHhGl6Tt67mf*/