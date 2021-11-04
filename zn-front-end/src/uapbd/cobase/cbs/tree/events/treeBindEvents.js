//+WbkJGy4pAnviL60zwl13Q9jFFbdtCifJLQ4Qq73NrxvR9uPxdINJgMPywUMhAAb
import {
    queryTree,
    del,
    queryCard,
    editStatusHandle,
    rootNodeHandle,
    judgeGroupDistriCBS,
    commonParams,
    transformToTree, 
    sortTree,
    changeButtonByScene,
    judgeProtypeDistriCBS,
    setDefaultVal
} from "./index";
import { constant, modalConfig, TreeIconAddShow, attrcodeObj } from "./../const";

let {
    formId,
    treeId,
    dataSource,
    modalId
} = constant;
    
let {
    pkPrimery,
    isLeafNode,
    pkOrg,
    isleaf,
    isDefalut,
    pkFather,
    code,
    name,
    pkProject
} = attrcodeObj;
/**
 * @param {*} that this
 * @param {*} 参数 搜索区的val涉及的对象值
 * @param {*} needQueryFirNodeForm 刷新按钮需要是否刷新并获取第一个树节点的对应表的值
 */
function queryAndTransformToTree(props, params, needQueryFirNodeForm, callback) {
    queryTree.call(this, this.props, params, queryTreeCallback, needQueryFirNodeForm, callback);
}

function queryTreeCallback(queryTreeData, props, needQueryFirNodeForm, callback) {

    //组件树必需的字段
    let needData = {
        pid: pkFather,
        refcode: code,
        refname: name,
        refpk: pkPrimery,
        id: pkPrimery,
        values: {}
    };
    let pageCode = this.props.getSearchParam('p');
    let refTreeRootName =  pageCode === "10140CBSG-group" ? "CBS-集团" : (pageCode === "10140CBSC-org" ? "CBS-财务组织" : "项目CBS");

    //乱序的树结构数据
    let disorderedTreeData = transformToTree.call(this, needData, refTreeRootName, queryTreeData, props);
    sortTree(disorderedTreeData);

    props.syncTree.setSyncTreeData(treeId, disorderedTreeData);
    callback && callback();

    if (needQueryFirNodeForm) {
        let key = disorderedTreeData[0].children[0].refpk;
        props.syncTree.setNodeSelected(treeId, key);
        let params = {
            pk: key,
            pagecode: this.props.getSearchParam('p')
        }
        queryCard.call(this, params);
    }
}

function onSelectEve(key, item) {

    rootNodeHandle.call(this, key);
    let isLeafNodeVal = this.props.form.getFormItemsValue(formId, isLeafNode).value;
    let isDefalutVal = this.props.form.getFormItemsValue(formId, isDefalut).value;
    if (isLeafNodeVal && !isDefalutVal && key !== 'root') {
        let disabledButtons = changeButtonByScene.call(this, [], ['SetDefault'], true);
        this.props.button.setButtonDisabled(disabledButtons);
    } else {
        let disabledButtons = changeButtonByScene.call(this, [], ['SetDefault'], false);
        this.props.button.setButtonDisabled(disabledButtons);
    }

    let params = {
        pk: item.refpk,
        pagecode: this.props.getSearchParam('p')
    }
    if (key === "root") {
        //清空表格数据
        this.props.form.EmptyAllFormValue(formId);
        setDefaultVal.call(this)
        return;
    }
    queryCard.call(this, params);
}

/**
 * 新增事件
 */
function clickAddIconEve(item) {
    let {
        params,
        haveValueFlag
    } = commonParams.call(this)
    if (!haveValueFlag) {
        return;
    }
    let pageCode = this.props.getSearchParam('p');
    //默认cbs不允许新增下级
    if (pageCode === '10140CBSC-org' && item[isLeafNode] || pageCode === '10140CBSC-org' && item[isleaf]) {
      
        if(haveValueFlag){
            if(item. id === 'root'){
                params = { [pkPrimery]: '', [pkOrg]:  params[pkOrg] };
            }else{
                params = { [pkPrimery]: [item.refpk], [pkOrg]: params[pkOrg] , operType :"add" };
            }
            judgeGroupDistriCBS.call(this, params, () => { editStatusHandle.call(this, item, "add") });
        }
        
    }else if (pageCode === '10140CBSPRO-pro'&& item.id === 'root') {
        if(haveValueFlag){
            params = { [pkProject]: params[pkProject], [pkOrg]: params[pkOrg] };
            judgeProtypeDistriCBS.call(this, params, () => { editStatusHandle.call(this, item, "add") });
        }
        
    }  else {
        editStatusHandle.call(this, item, "add");
    }
}
//编辑事件
function clickEditIconEve(item) {
    let pageCode = this.props.getSearchParam('p');
    if (pageCode === '10140CBSC-org') {
        let params = { [pkPrimery]: [item.refpk], [pkOrg]: [item.values[pkOrg].value], operType :"edit"  };
        judgeGroupDistriCBS.call(this, params, () => { editStatusHandle.call(this, item, "edit") });
    } else {
        editStatusHandle.call(this, item, "edit");
    }

}
//删除事件
function clickDelIconEve(item) {
    let pageCode = this.props.getSearchParam('p');
    let paramsCard = {
        pk: item.refpk,
        pagecode: pageCode
    }
    if (pageCode === '10140CBSC-org') {
        let params = { [pkPrimery]: [item.refpk], [pkOrg]: [item.values[pkOrg].value] , operType :"del" };
        let deleteFlag = judgeGroupDistriCBS.call(this, params,  null , "delete");
        if(!deleteFlag){
            return;
        }
    } 
    queryCard.call(this, paramsCard, this.props, ()=>{
        rootNodeHandle.call(this, item.refpk);
        this.props.syncTree.openNodeByPk(treeId, item.refpk);//展开节点
        this.props.syncTree.setNodeSelected(treeId, item.refpk)
        //获取指定字段的值
        let tsData = this.props.form.getFormItemsValue(formId, "ts").value;
        let pk = item.refpk;
        let paramInfoMap = { [pk]: tsData }
        let params = {
            paramInfoMap: paramInfoMap,
            pagecode: pageCode,
        }
        let delData = {
            params: params,
            refpk: item.refpk
        }
        let delModalConfig = {};
        if (item.children !== null && item.children !== undefined) {
            if (item.children.length > 0) {
                delModalConfig = modalConfig.deleteConfig;
            } else {
                delModalConfig = modalConfig.deleteNoChilConfig;
            }
        } else {
            delModalConfig = modalConfig.deleteNoChilConfig;
        }
    
        delModalConfig.beSureBtnClick = () => beSureDeleteClick.call(this, delData);
        this.props.modal.show(modalId, delModalConfig);
    });
}

function beSureDeleteClick(delData) {
    del.call(this, delData.params, delData.refpk);
}

function onMouseEnterEve(key, item) {

    if (key === "root") {
        let icon = TreeIconAddShow;
        this.props.syncTree.hideIcon(treeId, key, icon);
    }
}
export {
    queryAndTransformToTree,
    onMouseEnterEve,
    clickAddIconEve,
    onSelectEve,
    clickEditIconEve,
    clickDelIconEve,
};


//+WbkJGy4pAnviL60zwl13Q9jFFbdtCifJLQ4Qq73NrxvR9uPxdINJgMPywUMhAAb