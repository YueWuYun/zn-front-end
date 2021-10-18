/*9D1QA5jkDSXDuuPdOG3mwHm87PC84tKnzb9S67GCVa52Vp1PTmlDbHhGl6Tt67mf*/
/* 
  封装列表方法
  created by: liyaoh 2018-11-29
*/
import { ajax, toast } from 'nc-lightapp-front';
import { OPR_NAME, api } from '../common';
import { getListData } from '../page';
import { checkSelected } from './index';
export { 
    listOperation,
    multiDeleteCallback,
    singleDeleteCallback
}

/**
 * 列表页按钮操作
 *
 * @param {*} params - ListBtnOperation的参数
 */
function listOperation(params) {
    let { data, isMulti, checkOne } = params;
    params.data = { pageCode: this.pageId, ...data };
    if (isMulti) { //批量操作
        if (checkSelected.call(this, checkOne)) {
            listHeadBtnOperation.call(this, { ...params });
        }
    } else {
        listBodyBtnOperation.call(this, { ...params });
    }
}


/**
 * 操作列按钮操作
 *
 * @param {*} params - 自定义参数
 */
function listBodyBtnOperation(params){
    let { apiName, data, success } = params;
    let pdata = data;
    api({
        url: this.API_URL[apiName],
        data: pdata,
        success: success ? success : res => {
            let { success, data } = res;
            if (success) {
                let { successNum, errorNum, total } = data;
                //提交即指派
                if (params.composite && res.data.workflow && (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
                    this.setState({
                        compositedata: res.data,
                        compositedisplay: true,
                        curPk: pdata.pks
                    });
                }else{
                    if (successNum == total) { //成功
                        toast({ color: 'success', content: `${OPR_NAME[apiName]}${this.state.json['TMCPUB-000043']}` });/* 国际化处理： 成功*/
                        //有tab页签根据当前选中Tab进行查询
                        let tabCondition = this.props.listTabs && this.state.activeTab !== this.props.listTabs.allKey ? 
                        this.props.listTabs.onTabChange(this.state.activeTab) : undefined;
                        getListData.call(this, tabCondition);
                    } else { //失败
                        toast({ color: 'warning', content: `${OPR_NAME[apiName]}${this.state.json['TMCPUB-000044']}` });/* 国际化处理： 失败*/
                    }
                }
            }
        },
        ...params
    });
}

/**
 * 列表头部按钮操作
 *
 * @param {*} params - 自定义参数
 */
function listHeadBtnOperation(params) {
    let { apiName, data, success } = params;
    let pdata = data;
    api({
        url: this.API_URL[apiName],
        data: pdata,
        success: success ? success : (res) => {
            let { success, data } = res;
            if (success) {
                //提交即指派
                if (params.composite && res.data.workflow && (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
                    this.setState({
                        compositedata: res.data,
                        compositedisplay: true,
                        curPk: pdata.pks
                    });
                } else {
                    let tabCondition = this.props.listTabs && this.state.activeTab !== this.props.listTabs.allKey ?
                        this.props.listTabs.onTabChange(this.state.activeTab) : undefined;
                    if (typeof data.successNum === 'undefined') {
                        toast({ color: 'success', content: `${OPR_NAME[name]}${this.state.json['TMCPUB-000043']}` });/* 国际化处理： 成功*/
                        getListData.call(this, tabCondition);
                    } else {
                        multiToast.call(this, name, OPR_NAME, data); //批量提示
                        getListData.call(this, tabCondition);
                    }

                }
            }
        },
        ...params
    });

}

/**
 * 接口返回批量提示
 *
 * @param {*} name - 操作名称（与OPR_NAME的键对应）
 * @param {*} OPR_NAME - 操作名称对应的文本 
 * OPR_NAME示例
 * {
        commit: '提交',
        uncommit: '收回',
        delete: '删除'
    }
 * @param {*} data - 接口返回数据
 */
function multiToast(name, OPR_NAME, data) {
    //这里换成自己接口返回的字段名
    let { successNum, errorNum, total, msg, msgDetail } = data;
    let content = `${this.state.json['TMCPUB-000041']}${OPR_NAME[name]}${total}${this.state.json['TMCPUB-000042']}，${this.state.json['TMCPUB-000043']}${successNum}${this.state.json['TMCPUB-000042']}，${this.state.json['TMCPUB-000044']}${errorNum}${this.state.json['TMCPUB-000042']}`;/* 国际化处理： 共,条,成功,条,失败,条*/
    if (successNum == total) { //全部成功
        toast({
            duration: 5,
            color: 'success',
            title: `${OPR_NAME[name]}${this.state.json['TMCPUB-000045']}，${msg}`,/* 国际化处理： 完毕*/
            content: content,
            groupOperation: true
        });
    } else if (errorNum == total) { //全部失败
        toast({
            duration: 'infinity',
            color: 'danger',
            title: `${OPR_NAME[name]}${this.state.json['TMCPUB-000045']}，${msg}`,/* 国际化处理： 完毕*/
            content: content,
            groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: [this.state.json['TMCPUB-000036'], this.state.json['TMCPUB-000037'], this.state.json['TMCPUB-000038']],/* 国际化处理： 展开,收起,关闭*/
            groupOperationMsg: msgDetail, //数组的每一项，需要点击展开按钮显示的内容描述，非必输
        });
    } else if (successNum < total) { //部分失败
        toast({
            duration: 'infinity',
            color: 'warning',
            title: `${OPR_NAME[name]}${this.state.json['TMCPUB-000045']}，${msg}`,/* 国际化处理： 完毕*/
            content: content,
            groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: [this.state.json['TMCPUB-000036'], this.state.json['TMCPUB-000037'], this.state.json['TMCPUB-000038']],/* 国际化处理： 展开,收起,关闭*/
            groupOperationMsg: msgDetail, //数组的每一项，需要点击展开按钮显示的内容描述，非必输
        });
    }
}

/**
 * 批量删除操作回调
 *
 * @param {*} data - 接口返回数据
 */
function multiDeleteCallback(data, params) {
    multiToast.call(this, 'delete', OPR_NAME, data); //批量提示
    //批量删除缓存中数据
    let deletePks = data.data && data.data.filter(item => item.state === '0');//删除成功
    deletePks = deletePks && deletePks.map(item => item.pk);
    if (deletePks.length > 0) {
        let allTableData = this.props.table.getAllTableData(this.tableId);
        let allPks = allTableData.rows[0] && allTableData.rows.map(item => item.values[this.primaryId].value);
        let deleteRowIndexArr = deletePks.map(item => allPks.findIndex(v => v == item)).filter(item => item != -1);
        this.props.table.deleteCacheId(this.tableId, deletePks);
        this.props.table.deleteTableRowsByIndex(this.tableId, deleteRowIndexArr);
    }
}

/**
 * 单条删除操作回调
 *
 * @param {*} data - 接口返回数据
 */
function singleDeleteCallback(data, params) {
    let { index } = params;
    let { successNum, errorNum, total } = data;
    if (successNum == total) { //成功
        toast({ color: 'success', content: `${OPR_NAME['delete']}${this.state.json['TMCPUB-000043']}` });/* 国际化处理： 成功*/
        //删除缓存对应数据
        let deletePk = [];
        data.data[0] && deletePk.push(data.data[0].pk);
        this.props.table.deleteCacheId(this.tableId, deletePk);
        this.props.table.deleteTableRowsByIndex(this.tableId, index);
    } else { //失败
        toast({ color: 'warning', content: `${OPR_NAME['delete']}${this.state.json['TMCPUB-000044']}` });/* 国际化处理： 失败*/
    }
}

/*9D1QA5jkDSXDuuPdOG3mwHm87PC84tKnzb9S67GCVa52Vp1PTmlDbHhGl6Tt67mf*/