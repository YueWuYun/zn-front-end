//puTVBG0reIAXqKgw4+aihiymoAKxlN7yvJ3lmx6ICad3u7Un7y2YPqGizJ1awlCz
import { ajax, toast, cardCache } from "nc-lightapp-front";
let { addCache, getCacheById, updateCache, getCurrentLastId, } = cardCache;
import { ajaxUrl, constant, toastConfig, attrcodeObj } from "./../const";
import { newTreeNode, rootNodeHandle, commonParams, transformToTree, sortTree, changeButtonByScene, queryAndTransformToTree } from "./index";
let {
    formId,
    treeId,
    dataSource,
    refOrgTreeRootName,
    orgTreeId,
} = constant;
    
let {
    pkFather,
    code,
    name,
    pkFinancePrimery,
    pkPrimery,
    isDefalut,
} = attrcodeObj;

function queryTree(props, params, callback, needQueryFirNodeForm, callbackOfRoot) {
    let queryTreeData = [];
    ajax({
        url: ajaxUrl.queryTreeUrl,
        data: params,
        success: (res) => {
            if (res && res.data) {
                queryTreeData = res.data;
                if (!needQueryFirNodeForm) {
                    showToast(toastConfig, 'querySucess');
                }
                callback.call(this, queryTreeData, props, needQueryFirNodeForm, callbackOfRoot);//把返回值转换成树结构
            }
        }
    })
}

function insert(params) {
    ajax({
        url: ajaxUrl.insertUrl,
        data: params,
        success: (res) => {
            let data = res.data[formId];
            newTreeNode.call(this, data, 'add');
            setFormValue.call(this, data);
            showToast(toastConfig, 'addSucess');
        }
    });
}
function edit(params) {
    ajax({
        url: ajaxUrl.editUrl,
        data: params,
        success: (res) => {
            let data = res.data[formId];
            newTreeNode.call(this, data, "edit");
            setFormValue.call(this, data);
            showToast(toastConfig, 'editSucess');
        }
    });
}

function del(params, refpk) {
    ajax({
        url: ajaxUrl.deleteUrl,
        data: params,
        success: (res) => {
            this.props.syncTree.delNodeSuceess(treeId, refpk);
            this.props.form.EmptyAllFormValue(formId);
            rootNodeHandle.call(this, 'root');
            showToast(toastConfig, 'delSucess');
        }
    });
}

function queryCard(params, props,callback) {
    if(this.state.pkOrgValueRef){
        params["pk_org"] = this.state.pkOrgValueRef.refpk;
    }
    ajax({
        url: ajaxUrl.queryCardUrl,
        data: params,
       // async: true,
        success: (res) => {
            if (res && res.data) {
                let data = res.data[formId];
                setFormValue.call(this, data);
                callback &&callback();
            }
        }
    })
}

function setFormValue(data) {

    this.props.form.setAllFormValue({ formArea: data });//数据绑定到卡表单里

    let isDefaultVal = data.rows[0].values[isDefalut].value;
    if (isDefaultVal) {
        let disabledButtons = changeButtonByScene.call(this, [], ['SetDefault'], false);
        this.props.button.setButtonDisabled(disabledButtons);
    } else {
        let disabledButtons = changeButtonByScene.call(this, [], ['SetDefault'], true);
        this.props.button.setButtonDisabled(disabledButtons);
    }

    let pk = data.rows[0] && data.rows[0].values[pkPrimery] && data.rows[0].values[pkPrimery].value || '';
    let cardDataId = pk ? pk : getCurrentLastId(dataSource);
    let cardData = getCacheById(cardDataId, dataSource);
    let status = this.props.form.getFormStatus(formId);
    if (cardData || status === "edit") {
        pk && updateCache(pkPrimery, cardDataId, data, formId, dataSource);
    } else {
        pk && addCache(cardDataId, data, formId, dataSource);
    }
}

//判断是否是集团分配的cbs
function judgeGroupDistriCBS(params, callback, type) {

    let deleteFlag = false;
    
    ajax({
        url: ajaxUrl.doCBSValidatorUrl,
        data: params,
        async: false,
        success: (res) => {
            if(res.data){
                switch(res.data){
                    case '0':
                    case '3':
                        deleteFlag = type === "delete"? true : false;
                        callback&&callback();
                    default: break;
                }
                
            }
        }
    });
    return deleteFlag
}


//判断是否是集团分配的cbs
function judgeProtypeDistriCBS(params, callback) {
    ajax({
        url: ajaxUrl.doCBSProValidatorUrl,
        data: params,
        async: false,
        success: (res) => {
            if(res.data){
                switch(res.data){
                    case '3':
                        callback&&callback();
                    default: break;
                }
                
            }
        }
    });
}

//设置业务单元
function setDefaultUnit(params) {
    ajax({
        url: ajaxUrl.setDefaultUnit,
        data: params,
        success: (res) => {
            let data = res.data[formId];
            setFormValue.call(this, data);
        }
    });
}


function queryFinanceOrg() {
    let treeDatas = [];
    ajax({
        url: ajaxUrl.queryFinanceOrg,
        async : false,
        success: (res) => {
            treeDatas = res;
       
            //组件树必需的字段
            let needData = {
                pid: pkFather,
                refcode: code,
                refname: name,
                refpk: pkFinancePrimery,
                id: pkFinancePrimery,
                values: {}
            };
            let queryTreeData = res.data;
            let disorderedTreeData = transformToTree.call(this, needData, refOrgTreeRootName, queryTreeData, this.props);
            sortTree(disorderedTreeData);
            this.props.syncTree.setSyncTreeData(orgTreeId, disorderedTreeData);
        }
    });
    return treeDatas
}


function queryModalCBSOrg() {
    let {params} = commonParams.call(this);
    if(this.state.type === 'import'){
        params.node_type = 'ORG_NODE'
        params.pk_projecttype = null
    }
    let pageCode = this.props.getSearchParam('p');
    let disorderedTreeData = [];
    ajax({
        url: ajaxUrl.queryTreeUrl,
        data: params,
        async: false,
        success: (res) => {
            //组件树必需的字段
            let needData = {
                pid: pkFather,
                refcode: code,
                refname: name,
                refpk: pkPrimery,
                id: pkPrimery,
                values: {},
                fpid: pkFather
            };
            let queryTreeData = res.data;
            let refTreeRootName =  pageCode === "10140CBSG-group" ? "CBS-集团" : (pageCode === "10140CBSC-org" ? "CBS-财务组织" : "项目CBS");
            disorderedTreeData = transformToTree.call(this, needData, refTreeRootName, queryTreeData, this.props);
            sortTree(disorderedTreeData);
            this.props.syncTree.setSyncTreeData('leftTree', disorderedTreeData);
        }
    });
    return disorderedTreeData;
}

function doCBSAssign (params){
    ajax({
        url: ajaxUrl.doCBSAssignUrl,
        data: params,
        success: (res) => {
            this.setState({
                assignModal: false,
                importModal: false,
                type : ''
            });
            showToast.call(this, toastConfig, 'assignSuccess')
        }
    });
}
function cancelCBSAssign (params){
    ajax({
        url: ajaxUrl.cancelCBSAssignUrl,
        data: params,
        success: (res) => {
            this.setState({
                importModal: false,
                assignModal: false,
                type : ''
            });
            showToast.call(this, toastConfig, 'cancelAssignSuccess')
        }
    });
}
function importFunc (params){
    ajax({
        url: ajaxUrl.importUrl,
        data: params,
        success: (res) => {
            this.setState({
                importModal: false,
                type : ''
            });
         
            let {
                params
            } = commonParams.call(this)
            queryAndTransformToTree.call(this, this.props, params, true, () => { rootNodeHandle.call(this, "root") });
            showToast.call(this, toastConfig, 'importSuccess')
        }
    });
}
function showToast(toastConfig, typeSuccessOrFail){
    let color = toastConfig[typeSuccessOrFail].color;
    let title = toastConfig[typeSuccessOrFail].title;
    let content = toastConfig[typeSuccessOrFail].content;
    toast({color, title, content});
}
export {
    queryTree,
    insert,
    edit,
    del,
    queryCard,
    judgeGroupDistriCBS,
    setDefaultUnit,
    queryFinanceOrg,
    queryModalCBSOrg,
    doCBSAssign,
    importFunc,
    cancelCBSAssign,
    showToast,
    judgeProtypeDistriCBS
}
//puTVBG0reIAXqKgw4+aihiymoAKxlN7yvJ3lmx6ICad3u7Un7y2YPqGizJ1awlCz