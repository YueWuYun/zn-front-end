//b4nfaR68nlLzQ+XP6/Wi4g8M+xo8Ao9FAdvOim1beOmfG2+TNXFDz7RtKsdNohem
import { constant, attrcodeObj , ajaxUrl} from "./../const";
import {
    queryAndTransformToTree,
    insert,
    edit,
    rootNodeHandle,
    browseStatusHandle,
    setDefaultUnit,
    printTemp,
    getContext,
    commonParams
} from "./index";

let {
    formId,
    treeId,
    modalId,
} = constant;
    
let {
    pkFather,
    code,
    name,
    pkFinancePrimery,
    pkPrimery,
    isDefalut
} = attrcodeObj;


const buttonClicks = {
    Save: saveClick,
    Cancel: cancelClick,
    Refresh: refreshClick,
    CardPrint: printClick,
    Output: printClick,
    AssignCBS: assignCBSClick,
    SetDefault: setDefaultClick,
    CancelCBS: cancelCBSClick,
    ImportCBS: importCBSClick

}
function activateButton(props, id) {
    buttonClicks[id].call(this, props, id);
}

function saveClick(props) {

    if (!props.form.isCheckNow(formId)) {
        return;
    }
    let params = getFormDataToParams.call(this);
    let status = this.props.form.getFormStatus(formId);
    //验证公式
    let tableTypeObj = {
        [formId] :'form'
    }
    let callback = (params)=>{
        if (status === "add") {
            insert.call(this, params);
        } else {
            edit.call(this, params);
        }
    }
    params.pageid = this.props.getSearchParam('p');
    this.props.validateToSave( params , (data)=>{
        params.pageid = this.props.meta.getMeta().pageid;
        callback.call(this, params)
    } , tableTypeObj, "form");
}

function cancelClick(props, id) {
    //let cancelModalConfig = modalConfig.cancelConfig;
    beSureCancelClick.call(this);
    //  cancelModalConfig.beSureBtnClick = () => beSureCancelClick.call(this);
    // this.props.modal.show(modalId,cancelModalConfig);
}
function beSureCancelClick() {
    browseStatusHandle.call(this, "cancel");
}
function refreshClick() {
    let {
        params,
        haveValueFlag
    } = commonParams.call(this);
    if (haveValueFlag) {
        queryAndTransformToTree.call(this, this.props, params, false, () => { rootNodeHandle.call(this, "root") });
    } else {
        return;
    }
}

function printClick(props, id) {
    let pk = this.props.form.getFormItemsValue(formId, pkPrimery).value;
    let scaleClazz = getContext("scaleClazz");
    let appcode = props.getSearchParam('c');
    printTemp(id === "CardPrint" ? 'print' : "output", 'pdf', ajaxUrl.printUrl, 'Card', [pk], appcode, 'Card', 'pcm', scaleClazz);
}
// 查询默认业务单元
function setDefaultClick(props, id) {

    let params = getFormDataToParams.call(this);
    if(this.state.pkOrgValueRef){
        params.model["pk_org"] = this.state.pkOrgValueRef.refpk;
    }
    setDefaultUnit.call(this, params);
}

function assignCBSClick(props, id) {
    this.setState({
        assignModal: true,
        type : 'assign'
    });
}
function cancelCBSClick(props, id) {
    this.setState({
        assignModal: true,
        type : 'cancelAssign'
    });
}
function importCBSClick(props, id) {
    this.setState({
        importModal: true,
        type : 'import'
    });
}

//新增，修改共同的参数
function getFormDataToParams() {

    let formData = this.props.form.getAllFormValue(formId).rows;
    if (formData[0].values[pkFather].value === "root") {
        formData[0].values[pkFather].value = null;
    }
    let selectNodePk = '';
    let currentNode = this.props.syncTree.getSelectNode(treeId);
    if (currentNode !== null && currentNode.refpk !== "root") {
        selectNodePk = currentNode.refpk;
    }
  
    let pageId =  this.props.meta.getMeta().pageid;
    let params = {
        pageid: pageId,
        model: {
            areacode: "formArea",
            areaType: 'form',
            allpks: [selectNodePk],
            rows: [formData[0]]
        }
    }

    return params;
}
export {
    activateButton,
    buttonClicks
}
//b4nfaR68nlLzQ+XP6/Wi4g8M+xo8Ao9FAdvOim1beOmfG2+TNXFDz7RtKsdNohem