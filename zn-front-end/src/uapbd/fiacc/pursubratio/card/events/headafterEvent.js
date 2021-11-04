//PJv+sWwcj8JgDOEq2zmS1GquPwP+uuvumPTsH7p4ohWc+MC9GE1KUIOh+6JZd7N2
import { ajax, toast, promptBox } from 'nc-lightapp-front';

//表头需要走编辑后事件的字段，其余字段不走编辑后
let keys = ['pk_org','pk_setofbook','celementid','costcomponentid']
// let keys = ['pk_org']

export default function headafterEvent(props, moduleId, key, value, changedrows, i, s, g) {

    if(keys.indexOf(key) == -1){
        return;
    }

    if (moduleId == this.formId) {
        let data = null;
        let pageId = this.pageId;
        switch (key) {
            case 'pk_org':
                if (value && value.value == null || value.value == '') {
                    //清空财务组织
                    promptBox({
                        color: 'warning',
                        title: this.state.json['10140CCSD-000012'] /* 国际化处理： 确认修改*/,
                        content: this.state.json['10140CCSD-000013'] /* 国际化处理： 确定​修改组织，这样会清空您录入的信息?*/,
                        beSureBtnName: this.state.json['10140CCSD-000007'] /* 国际化处理： 确定*/,
                        cancelBtnName: this.state.json['10140CCSD-000008'] /* 国际化处理： 取消*/,
                        beSureBtnClick: () => {
                            this.initAdd(true);
                        },
                        closeBtnClick:()=>{
                            this.props.form.setFormItemsValue(this.formId, { pk_org: changedrows });
                        },
                        cancelBtnClick: () => {
                            this.props.form.setFormItemsValue(this.formId, { pk_org: changedrows });
                        }
                    });
                }else if (changedrows && changedrows.value != null && changedrows.value != ''){
                    //切换财务组织
                    promptBox({
                        color: 'warning',
                        title: this.state.json['10140CCSD-000012'] /* 国际化处理： 确认修改*/,
                        content: this.state.json['10140CCSD-000013'] /* 国际化处理： 确定​修改组织，这样会清空您录入的信息?*/,
                        beSureBtnName: this.state.json['10140CCSD-000007'] /* 国际化处理： 确定*/,
                        cancelBtnName: this.state.json['10140CCSD-000008'] /* 国际化处理： 取消*/,
                        beSureBtnClick: () => {
                            this.props.form.EmptyAllFormValue(this.formId);
                            this.props.cardTable.setTableData(this.tableId, { rows: [] });
                            this.props.form.setFormItemsValue(this.formId, { pk_org: value });
                            data = {
                                pageId: pageId,
                                event: this.props.createHeadAfterEventData(pageId, this.formId, this.tableId, moduleId, key, value),
                                uiState: this.props.getUrlParam('status')
                            }
                            headFieldAfterRequest.call(this, data, key, changedrows)
                        },
                        closeBtnClick:()=>{
                            this.props.form.setFormItemsValue(this.formId, { pk_org: changedrows });
                        },
                        cancelBtnClick: () => {
                            this.props.form.setFormItemsValue(this.formId, { pk_org: changedrows });
                        }
                    });
                }else{
                    data = {
                        pageId: pageId,
                        event: this.props.createHeadAfterEventData(pageId, this.formId, this.tableId, moduleId, key, value),
                        uiState: this.props.getUrlParam('status')
                    }
                    headFieldAfterRequest.call(this, data, key, changedrows)
                }
                
                break;
            default:
                data = {
                    pageId: pageId,
                    event: this.props.createHeadAfterEventData(pageId, this.formId, this.tableId, moduleId, key, value),
                    uiState: this.props.getUrlParam('status')
                }
                headFieldAfterRequest.call(this, data, key, changedrows)
                break;
        }
        

    }
	
}


export function headFieldAfterRequest(requestData, key, changedrows) {
	ajax({
		url: '/nccloud/uapbd/pursubratio/cardheadafteredit.do',
		data: requestData,
		async: false,
		success: (res) => {
            //渲染数据
			if (res.data.head) {
                this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
            }
            if (res.data.body) {
                this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId]);
            }
			if (key == 'pk_org') {//如果key为主组织的处理逻辑
				let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
				if (pk_org) {
                    this.props.resMetaAfterPkorgEdit();

                    var vbillcodeEdit = res.data.userjson;
                    //根据编码规则设置合同编码是否可编辑
                    if("false" == vbillcodeEdit || false == vbillcodeEdit)
                    {
                        //不可编辑
                        this.props.form.setFormItemsDisabled(this.formId, { vbillcode: true });
                    }
                    else
                    {
                        //可编辑
                        this.props.form.setFormItemsDisabled(this.formId, { vbillcode: false });
                    }

                    // //控制单据号是否可以操作
                    // this.controlBillno();
					this.state.buttonfalg = true;
				} else {
					this.state.buttonfalg = null;
                }
                
                this.props.cardTable.addRow(this.tableId,undefined,undefined,false);
				this.toggleShow();
			}
		},
		error: (res) => {
            //部分数据的编辑后事件后台抛错之后，前端需要渲染原值，所以该处做一个处理
            if(!changedrows ||Object.keys(changedrows).length ==0){
                changedrows ={
                    value : null,
                    display:null
                }
            }
            let str = String(res);
            let content = str.substring(6, str.length);
            this.props.form.setFormItemsValue(this.formId, { [key]: changedrows });
            toast({ color: 'danger', content: content });
            //选择主组织抛错之后需要重新控制按钮
            this.toggleShow();
		}
	});
}




//PJv+sWwcj8JgDOEq2zmS1GquPwP+uuvumPTsH7p4ohWc+MC9GE1KUIOh+6JZd7N2