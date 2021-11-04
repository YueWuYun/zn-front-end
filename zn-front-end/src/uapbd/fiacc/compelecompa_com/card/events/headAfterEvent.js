//9oNSQ86zYBKgm3JBJdBE6F2gCP80zo46hMVrX03rfmOMAe9LpHxEQk5BUH28Ldj5
import { ajax, toast,promptBox } from 'nc-lightapp-front';
import toggleShow from './toggleShow';
import { pagecode,formId, tableId} from '../constants';
import {loadPageValue2,initAdd, loadPageValue} from './stuffCom';
import {errorDeal} from '../../../../public/excomponents/pubUtils/afterEventPubDeal';
/*
 *表头编辑后事件
 */
export default function headAfterEvent(props, moduleId, key, value, changedrows, i, s, g) {
    let that = this;
    if (moduleId == formId) {
        let data = null;
        switch (key) {
            case 'pk_org':
                if (value && value.value == null || value.value == '') {
                    //清空财务组织
                    promptBox({
                        color: 'warning',
                        title: that.state.json['10140CECA-000019'] /* 国际化处理： 确认修改*/,
                        content: that.state.json['10140CECA-000020'] /* 国际化处理： 确定​修改组织，这样会清空您录入的信息?*/,
                        beSureBtnName: that.state.json['10140CECA-000021'] /* 国际化处理： 确定*/,
                        cancelBtnName: that.state.json['10140CECA-000022'] /* 国际化处理： 取消*/,
                        beSureBtnClick: () => {
                            initAdd(that,true);
                        },
                        cancelBtnClick: () => {
                            that.props.form.setFormItemsValue(formId, { pk_org: changedrows });
                        },
                        closeBtnClick: () => {
                            that.props.form.setFormItemsValue(formId, { pk_org: changedrows });
                        }
                    });
                }else if (changedrows && changedrows.value != null && changedrows.value != ''){
                    //切换财务组织
                    promptBox({
                        color: 'warning',
                        title: that.state.json['10140CECA-000019'] /* 国际化处理： 确认修改*/,
                        content: that.state.json['10140CECA-000020'] /* 国际化处理： 确定​修改组织，这样会清空您录入的信息?*/,
                        beSureBtnName: that.state.json['10140CECA-000021'] /* 国际化处理： 确定*/,
                        cancelBtnName: that.state.json['10140CECA-000022'] /* 国际化处理： 取消*/,
                        beSureBtnClick: () => {
                            that.props.form.EmptyAllFormValue(formId);
                            that.props.cardTable.setTableData(tableId, { rows: [] });
                            that.props.form.setFormItemsValue(formId, { pk_org: value });
                            data = {
                                pageId: pagecode,
                                event: that.props.createHeadAfterEventData(pagecode, formId, tableId, moduleId, key, value),
                                uiState: that.props.getUrlParam('status')
                            }
                            headFieldAfterRequest.call(that, data, key, changedrows)
                        },
                        cancelBtnClick: () => {
                            that.props.form.setFormItemsValue(formId, { pk_org: changedrows });
                        },
                        closeBtnClick: () => {
                            that.props.form.setFormItemsValue(formId, { pk_org: changedrows });
                        }
                    });
                }else{
					data = {
						pageId: pagecode,
						event: that.props.createHeadAfterEventData(pagecode, formId, tableId, moduleId, key, value),
						uiState: that.props.getUrlParam('status')
					};
                    headFieldAfterRequest.call(that, data, key, changedrows)
                }
                
                break;
            case 'ccostcompstrucid':
                if (value && value.value == null || value.value == '') {  
                    // this.props.form.EmptyAllFormValue(this.formId);
                    this.props.cardTable.setTableData(tableId, { rows: [] });
                }  else if (changedrows && changedrows.value != null && changedrows.value != ''){
                    // that.props.form.EmptyAllFormValue(formId);
                    that.props.cardTable.setTableData(tableId, { rows: [] });
                    that.props.form.setFormItemsValue(formId, { ccostcompstrucid: value });
                    let ccostcompstrucid=value.refpk;
                    let billCard=this.props.createMasterChildData(pagecode, formId, tableId)
                    let data={
                        "ccostcompstrucid":ccostcompstrucid,
                        "billCard":billCard
                    }
                    headFieldAfterRequest.call(that, data, key, changedrows);
                }else{
                    
                    let ccostcompstrucid=value.refpk;
                    let billCard=this.props.createMasterChildData(pagecode, formId, tableId)
                    let data={
                        "ccostcompstrucid":ccostcompstrucid,
                        "billCard":billCard
                    }
                    headFieldAfterRequest.call(that, data, key, changedrows);
                }
                break;
			default:
				data = {
					pageId: pagecode,
					event: that.props.createHeadAfterEventData(pagecode, formId, tableId, moduleId, key, value),
					uiState: that.props.getUrlParam('status')
				};
                headFieldAfterRequest.call(that, data, key, changedrows)
                break;
        }
    }
};
export function headFieldAfterRequest(requestData, key, changedrows) {
//     if (key == 'pk_org') {
//         let pk_org = that.props.form.getFormItemsValue(formId, 'pk_org').value;
//         if (pk_org) {
//             that.props.resMetaAfterPkorgEdit();
//             that.state.buttonflag = true;
//         } else {
//             // that.props.initMetaByPkorg();
//             that.state.buttonflag = null;
//         }
//         // that.props.cardTable.addRow(tableId,undefined,null,false);
// }
    // toggleShow(that,that.props);
    if(key=='ccostcompstrucid'){
        let that = this;
	ajax({
		url: '/nccloud/uapbd/compelecompa/cardheadafterevent.do',
		data: requestData,
		async: false,
		success: (res) => {
            if(res.data){
            //渲染数据
			loadPageValue(res.data,that.props);
            successCallback(that.props, key,changedrows);
            }
        },
        error: (res) => {
            errorDeal(this, res,key, changedrows);
		}
    });
    }
	
           
}
/**
 * 后台处理成功处理
 */
export const successCallback = (props, key,changedrows) => {
	//成本中心
	if (key === 'ccostcenterid') {
        let tabledata = props.cardTable.getVisibleRows(tableId);
        for (var j = 0; j < tabledata.length; j++) {
            if(tabledata[j].values.cmaterialid && tabledata[j].values.cmaterialid.value)
            {//物料最新版本不为空，数量、单价、金额可编辑
                props.cardTable.setEditableByIndex(tableId, j, "nnum", true);
                props.cardTable.setEditableByIndex(tableId, j, "nprice", true);
                props.cardTable.setEditableByIndex(tableId, j, "nmoney", true);
            }
        }
	}
};


//9oNSQ86zYBKgm3JBJdBE6F2gCP80zo46hMVrX03rfmOMAe9LpHxEQk5BUH28Ldj5