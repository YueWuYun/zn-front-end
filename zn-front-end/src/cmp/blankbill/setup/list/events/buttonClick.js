/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base , toast ,print, promptBox} from 'nc-lightapp-front';
import {setButtonVisible, onCancel ,constData} from './initRestMoneyDate';
import { SHOW_MODE } from '../../../../pub/cons/constant';
import { BBC_CONST,APP_INFO,BILL_FIELD,REQUEST_URL,BTN, OTHER } from '../../cons/constant';
const {  } = BBC_CONST;
const { APPCODE,LIST_PAGECODE,SEARCH_CODE,FORM_BBC_01,FORM_BBC_02,FORM_BBC_03,FORM_BBC_04,FORM_BBC_05,TREE } = APP_INFO;
const { PK_NAME,PK_ORG,TS,BILLPK } = BILL_FIELD;
const { QUERY,SAVE,QUERYNOTETYPE } = REQUEST_URL;
const { SAVE_BTN, EDIT_BTN, CANCEL_BTN } = BTN;
const { ADD,BROWSER,EDIT } = SHOW_MODE;
const { rootId } = OTHER
export default function buttonClick(json1, props, id) {
    /**设置小应用按钮事件 */
    let invokethis = this;
    //let checkeddate = props.editTable.getCheckedRows(this.tableId);
    // 财务组织
    // let pkorg = this.props.search.getAllSearchData(this.searchId);
    let pkorg = props.search.getSearchValByField(this.searchId, 'pk_org');//所选组织
    let pkorgvalue = null;
    if (pkorg && pkorg.value.firstvalue) {
		pkorgvalue = pkorg.value.firstvalue;
	}
    if(pkorgvalue == null){
        toast({ color: 'warning', content: json1['36070BBC-000001'] });/* 国际化处理： 请选择财务组织*/
        return;
    }
    let selectTree = this.props.syncTree.getSelectNode(TREE);
    let pk_notetype = null;
    if(selectTree){
        pk_notetype = selectTree.id;
    }
    //刷新按钮
    if (id == constData.refresh) {
        this.refreshHtml();
        return;
    }
    let pktsmap = {};
    // 过滤的不符合条件的数据
    let error = [];
    // 列表操作的索引数组
    let indexarr = [];
    switch (id) {
    
        //保存
    case SAVE_BTN:
        let isautoly = props.form.getFormItemsValue(FORM_BBC_01, 'isautoly').value; // 领用方式
        if(!isautoly){
            toast({ color: 'warning', content: json1['36070BBC-000002'] });/* 国际化处理： 领用方式不能为空*/
            return;
        }
        let lyctrltype = props.form.getFormItemsValue(FORM_BBC_01, 'lyctrltype').value; // 领用控制类型
        if(!lyctrltype){
            toast({ color: 'warning', content: json1['36070BBC-000003'] });/* 国际化处理： 领用控制类型不能为空*/
            return;
        }
        let isautobx = props.form.getFormItemsValue(FORM_BBC_01, 'isautobx').value; // 报销方式
        if(!isautobx){
            toast({ color: 'warning', content: json1['36070BBC-000004'] });/* 国际化处理： 报销方式不能为空*/
            return;
        }
        let bxdrivetype = props.form.getFormItemsValue(FORM_BBC_01, 'bxdrivetype').value; // 报销驱动来源
        if(!bxdrivetype){
            toast({ color: 'warning', content: json1['36070BBC-000005'] });/* 国际化处理： 报销驱动来源不能为空*/
            return;
        }
        let savedata = props.createFormAfterEventData(LIST_PAGECODE, FORM_BBC_01);
        let formdata = props.form.getAllFormValue(FORM_BBC_01);
        let data = {
            formAfter: savedata,
            pkOrg: pkorgvalue,
            pkNotetype: pk_notetype,
            pageCode: LIST_PAGECODE
        }
        ajax({
            url: SAVE,
            data: data,
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    toast({ color: 'success', content: json1['36070BBC-000006'] });/* 国际化处理： 保存成功*/
                    setButtonVisible(props,true);
                    props.form.setAllFormValue({ [FORM_BBC_01]: data[FORM_BBC_01] });
                    props.syncTree.setNodeDisable(TREE, false);
                    props.form.setFormStatus(FORM_BBC_01, BROWSER);
                }
            }
        });
        break;
        case EDIT_BTN:
            let selectTree = this.props.syncTree.getSelectNode(TREE);
            console.log('selectTree:',selectTree);
            if(selectTree.key != rootId){
                props.syncTree.setNodeDisable(TREE, true);
                let isebmmange = props.form.getFormItemsValue(FORM_BBC_01, 'isebmmange').value;
                setButtonVisible(props,false);
                if(isebmmange){
                    props.form.setFormStatus(FORM_BBC_01, 'edit');
                }else{
                    props.form.setFormStatus(FORM_BBC_01, 'edit');
                    this.fildDisabled();
                }
                let disableflag = true;
                let islyctrlbynum = props.form.getFormItemsValue(FORM_BBC_01, 'islyctrlbynum').value; // 是否按领用张数控制
                if(islyctrlbynum){
                    props.form.setFormItemsDisabled(FORM_BBC_01,{'lynum': !disableflag}); // 最大领用张数
                }else{
                    props.form.setFormItemsDisabled(FORM_BBC_01,{'lynum': disableflag}); // 最大领用张数
                }
                let islyctrlbydate = props.form.getFormItemsValue(FORM_BBC_01, 'islyctrlbydate').value; // 是否按照未报销期限控制
                if(islyctrlbydate){
                    props.form.setFormItemsDisabled(FORM_BBC_01,{'lydate': !disableflag}); // 最大未报销领用天数
                }else{
                    props.form.setFormItemsDisabled(FORM_BBC_01,{'lydate': disableflag}); // 最大未报销领用天数
                }
                let islyctrlbymoney = props.form.getFormItemsValue(FORM_BBC_01, 'islyctrlbymoney').value; // 是否按照未报销总金额控制
                if(islyctrlbymoney){
                    props.form.setFormItemsDisabled(FORM_BBC_01,{'lymoney': !disableflag}); // 最大未报销总金额
                }else{
                    props.form.setFormItemsDisabled(FORM_BBC_01,{'lymoney': disableflag}); // 最大未报销总金额
                }
            }
        
            break;
        /**刷新 */
        // case 'refresh':
        //     invokethis.refreshHtml();
        // break;
        // 取消
        case CANCEL_BTN:
        	props.syncTree.setNodeDisable('tree', false);//控制树的节点可编辑
            // props.button.setButtonVisible(['refresh'],true);
            promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070BBC-000007'], // 弹框表头信息/* 国际化处理： 确认取消*/
				content: this.state.json['36070BBC-000008'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认是否取消?*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定", // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消", // 取消按钮名称, 默认为"取消",非必输
				hasCloseBtn:false, //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: onCancel.bind(this, props), // 确定按钮点击调用函数,非必输
				cancelBtnClick: this.cancelModalCancel.bind(this), // 取消按钮点击调用函数,非必输
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			})
        break;    
    }
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/