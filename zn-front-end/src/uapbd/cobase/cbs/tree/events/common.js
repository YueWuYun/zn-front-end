//qWNFZPKLBwQhyupqlt1oLBGLprJoTtn0N1vzJtcOt534/0B7y1P97cyCdhV3glI0
import { toast, cardCache } from "nc-lightapp-front";
let { getCurrentLastId, getCacheById } = cardCache;
import { constant, attrcodeObj, toastConfig } from "./../const";
import { queryCard} from "./index";
import { showToast } from "./ajaxFunc";

let {
    formId,
    treeId,
    dataSource,
} = constant;
    
let {
    pkProjecttype,
    pkFather,
    pkOrg,
    pkProject,
    code,
    pkPrimery,
    nodetype
} = attrcodeObj;

function editStatusHandle(item, type) {
    let {
        pkOrgValueRef,
        pkProjectValueRef,
        pkProjectTypeValueRef
    } = this.state;
    let callback = ()=>{
        if (type === "add") {
            //清空表格数据
            this.props.form.EmptyAllFormValue(formId);
            setDefaultVal.call(this);
    
            let parent = item.refpk;
    
            //获取父级对应值，放入新增编辑态卡片，充当默认值，传给后台,values这里只有一个空格
            let values = { [pkFather]: { value: parent === "root" ? null : parent, display: item.refname.split(" ")[1] } };
            this.props.form.setFormItemsValue(formId, values);
     
            this.props.syncTree.setNodeSelected(treeId, item.refpk);
        } 
        this.props.form.setFormStatus(formId, type);

        let visiableButtons = changeButtonByScene.call(this, ['Save', 'Cancel', 'Refresh', 'CardPrint', 'Output', 'AssignCBS', 'SetDefault', 'CancelCBS', 'ImportCBS'], ['Save', 'Cancel'], false)
        this.props.button.setButtonsVisible(visiableButtons);
        let disabledButtons = changeButtonByScene.call(this, ['Save', 'Cancel', 'Refresh', 'CardPrint', 'Output', 'AssignCBS', 'SetDefault', 'CancelCBS', 'ImportCBS'], ['Save', 'Cancel'], true)
        this.props.button.setButtonDisabled(disabledButtons);

        this.props.syncTree.setNodeDisable(treeId, true);
    }
    let params = {
        pk: item.refpk,
        pagecode: this.props.getSearchParam('p')
    }
    if (item.refpk !== "root") {
        queryCard.call(this, params, this.props, callback);
    }else{
        callback();
    }
    
    
};

function browseStatusHandle(type) {
    
  
    if (type === 'cancel') {
        this.props.form.cancel(formId);
        this.props.form.EmptyAllFormValue(formId);

        let cardDataId = getCurrentLastId(dataSource);
        let cardData = getCacheById(cardDataId, dataSource);
        if (cardData) {
            this.props.form.setAllFormValue({ [formId]: cardData });//取消要回到清空卡片之前
            let values = cardData.rows[0].values;
            if (values[code].value !== "root" || values[code].value !== null) {
                this.props.syncTree.openNodeByPk(treeId, values[pkPrimery].value);//展开节点
                this.props.syncTree.setNodeSelected(treeId, values[pkPrimery].value)
                let disabledButtons = changeButtonByScene.call(this, ['Save', 'Cancel', 'Refresh', 'CardPrint', 'Output', 'SetDefault', 'AssignCBS', 'CancelCBS', "ImportCBS"], ['Save', 'Cancel'], false)
                this.props.button.setButtonDisabled(disabledButtons);
            } else {
                rootNodeHandle.call(this, "root");
            }
        } else {
            let disabledButtons = changeButtonByScene.call(this, ['Save', 'Cancel', 'Refresh', 'CardPrint', 'Output', 'SetDefault'], ['Refresh'], true)
            this.props.button.setButtonDisabled(disabledButtons);
        }
    } else {
        this.props.form.setFormStatus(formId, "browse");
        rootNodeHandle.call(this, "noRoot");
    }

    let visiableButtons = changeButtonByScene.call(this, ['Save', 'Cancel', 'Refresh', 'CardPrint', 'Output', 'SetDefault', 'AssignCBS', 'CancelCBS', "ImportCBS"], ['Save', 'Cancel'], true)
    this.props.button.setButtonsVisible(visiableButtons);

    this.props.syncTree.setNodeDisable(treeId, false);
}

function rootNodeHandle(key) {
    let disabledButtons = changeButtonByScene.call(this, ['Save', 'Cancel', 'Refresh', 'CardPrint', 'Output', 'SetDefault'], ['Refresh', 'AssignCBS', 'CancelCBS', "ImportCBS"], true);
    this.props.button.setButtonDisabled(disabledButtons);
    if (key === "root" || key === null) {
        this.props.form.EmptyAllFormValue(formId);
        let disabledButtons = changeButtonByScene.call(this, ['Save', 'Cancel', 'Refresh', 'CardPrint', 'Output', 'SetDefault'], ['Refresh'], true);
        this.props.button.setButtonDisabled(disabledButtons);
    } else {
        let disabledButtons = changeButtonByScene.call(this, [], ['Refresh', 'CardPrint', 'Output', 'AssignCBS', 'CancelCBS', "ImportCBS"], true);
        this.props.button.setButtonDisabled(disabledButtons);
    }
}

//新增修改后的树的数据重新绑定
function newTreeNode(params, type) {
    browseStatusHandle.call(this);
    let {
        pk_father,
        code,
        name,
        pk_cbsnode,
        isleafnode
    } = params.rows[0].values;
    let newAfterEditNode = {
        isleaf: isleafnode.value,
        pid: pk_father.value ? pk_father.value : 'root',
        refcode: code.value,
        refname: code.value + " " + name.value,
        refpk: pk_cbsnode.value,
        values: params.rows !== undefined && params.rows[0].values ? params.rows[0].values : params
    };

    this.props.form.setAllFormValue({ formArea: params });
    if (type == "add") {
        this.props.syncTree.addNodeSuccess(treeId, newAfterEditNode);
        this.props.syncTree.openNodeByPk(treeId, newAfterEditNode.refpk);//展开节点
        this.props.syncTree.setNodeSelected(treeId, newAfterEditNode.refpk)
    } else if (type == "edit") {
        this.props.syncTree.editNodeSuccess(treeId, newAfterEditNode);
    }
}

function commonParams() {
    let {
        pkOrgValueRef,
        pkProjectValueRef,
        pkProjectTypeValueRef
    } = this.state;
    let params = {};
    let haveValueFlag = false;
    let pageCode = this.props.getSearchParam('p');
    switch(pageCode){
        case '10140CBSG-group':
            Object.assign(params,{
                'pk_projecttype':pkProjectTypeValueRef.refpk
            })
            if(pkProjectTypeValueRef.refpk){
                haveValueFlag = true
            }
        break
        case '10140CBSC-org':
            Object.assign(params,{
                "pk_org":pkOrgValueRef.refpk,
                'pk_projecttype':pkProjectTypeValueRef.refpk
            })
            if(pkOrgValueRef.refpk && pkProjectTypeValueRef.refpk){
                haveValueFlag = true
            }
        break
        case '10140CBSPRO-pro':
            Object.assign(params,{
                "pk_org":pkOrgValueRef.refpk,
                "pk_project": pkProjectValueRef.refpk
            })
            if(pkOrgValueRef.refpk && pkProjectValueRef.refpk){
                haveValueFlag = true
            }
        break
    }
    let nodeType = pageCode === "10140CBSG-group" ? "GROUP_NODE" : (pageCode === "10140CBSC-org" ? "ORG_NODE" : "PROJECT_NODE");
    Object.assign(params,{
        [nodetype]: nodeType,
    })
    if(!haveValueFlag){
        showToast.call(this, toastConfig, 'warning') 
    }
    return {params, haveValueFlag};
}
function changeButtonByScene (buttonsAll,  othersButtons, boolFlag){
    let afterChangeButtons ={};
   
    if(buttonsAll.length === 0){
        othersButtons.map( (itemInner, indexInner) =>{
            afterChangeButtons[itemInner] = !boolFlag 
        });
    }else{
        buttonsAll.map( (item, index)=>{
            afterChangeButtons[item] = boolFlag 
    
            othersButtons.map( (itemInner, indexInner) =>{
                if( item === itemInner){
                    afterChangeButtons[itemInner] = !boolFlag 
                }
            });
        });
    }
    return afterChangeButtons
}

function setDefaultVal(){
    let {
        pkOrgValueRef,
        pkProjectValueRef,
        pkProjectTypeValueRef
    } = this.state;
    let projectObj = { 
        value: pkProjectValueRef.refpk, 
        display: pkProjectValueRef.refname 
    };
    let typeObj = { 
        value: pkProjectTypeValueRef.refpk, 
        display: pkProjectTypeValueRef.refname 
    };
    let orgObj = { 
        value: pkOrgValueRef.refpk, 
        display: pkOrgValueRef.refname 
    };
    let val = { [pkProjecttype]: typeObj, [pkProject]:projectObj,[pkOrg]:orgObj };
    this.props.form.setFormItemsValue(formId, val);
}
export {
    editStatusHandle,
    browseStatusHandle,
    rootNodeHandle,
    newTreeNode,
    commonParams,
    changeButtonByScene,
    setDefaultVal
}
//qWNFZPKLBwQhyupqlt1oLBGLprJoTtn0N1vzJtcOt534/0B7y1P97cyCdhV3glI0