/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax, toast } from 'nc-lightapp-front';
//引入配置常量定义
import { base_url, pageCodeCard, formId, tableId, processHeadOlcRateEditable } from '../../cons/constant';
import moment from "moment";

let OrgOldValue = {};
//表头字段属性值：props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
export default function afterEvent(props, moduleId, key, value, changedrows, index, record, type) {
	// let status = props.getUrlParam('status');
	let eventData, newvalue, oldvalue, extParam;
	switch (key) {
		// 组织
		case 'pk_org':
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			OrgOldValue = JSON.stringify(oldvalue);
			if (oldvalue.value != null && newvalue.value != null && oldvalue.value != newvalue.value) {
				props.modal.show('MessageDlg', {
					title: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000000'), // 弹框表头信息/* 国际化处理： 提示*/
					content: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000001'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					leftBtnName: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000002'),/* 国际化处理： 确定*/
					rightBtnName: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000003'),/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						//handleOrgChangeSure.call(this, props, moduleId, key, value, changedrows, index, eventData);//点击确定按钮
						afterEventEdit.call(this, props, moduleId, key, value);
					},
					cancelBtnClick: () => {
						handleOrgChangeCancel.call(this, props, moduleId, key, value, oldvalue, eventData);
					}
				});
			} else if (newvalue && newvalue.value) {
				//handleOrgChangeSure.call(this, props, moduleId, key, value, changedrows, index, eventData);
				afterEventEdit.call(this, props, moduleId, key, value);
			} else if (!newvalue || !newvalue.value) {
				//清空数据
				props.modal.show('MessageDlg', {
					title: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000041'), // 弹框表头信息/* 国际化处理： 提示*/
					content: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000042'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改存单号，这样会清空您录入存单的信息?*/
					leftBtnName: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000043'),/* 国际化处理： 确定*/
					rightBtnName: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000044'),/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						props.form.EmptyAllFormValue(formId);
						props.initMetaByPkorg();
					},
					cancelBtnClick: () => {
						handleOrgChangeCancel.call(this, props, moduleId, key, value, oldvalue, eventData);
					}
				});
			}
			break;
		//结算账户
		case 'pk_settleacc': // 结算账号 
			if (!changedrows || !changedrows.value) {
				props.form.setFormItemsValue(formId, { 'pk_settleacc.name': { value: value.values["subaccnum"].value, display: value.values["subaccname"].value } })
			} else if (changedrows && value.value == null) {
				props.form.setFormItemsValue(formId, { 'pk_settleacc.name': { value: null } })
				return;
			}
			else {
				props.form.setFormItemsValue(formId, { 'pk_settleacc.name': { value: value.values["subaccnum"].value, display: value.values["subaccname"].value } })
			}
			break;

		case 'pk_depositacc': // 定期账号
			if (!changedrows || !changedrows.value) {
				props.form.setFormItemsValue(formId, { 'pk_depositacc.name': { value: value.values["subaccnum"].value, display: value.values["subaccname"].value } })

			} else if (changedrows && value.value == null) {
				props.form.setFormItemsValue(formId, { 'pk_depositacc.name': { value: null } })
				return;
			}
			else {
				props.form.setFormItemsValue(formId, { 'pk_depositacc.name': { value: value.values["subaccnum"].value, display: value.values["subaccname"].value } })
			}
			break;
		case 'pk_currtype': // 币种
			if (changedrows && value.value == null) {
				props.form.setFormItemsValue(formId, { 'olcrate': { value: null } })
				props.form.setFormItemsValue(formId, { 'glcrate': { value: null } })
				props.form.setFormItemsValue(formId, { 'gllcrate': { value: null } })
				return;
			}
			else {
				afterEventEdit.call(this, props, moduleId, key, value);
				//获取页面数据
				//eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				//获取编辑的值
				//newvalue = eventData.newvalue;
				//oldvalue = eventData.oldvalue;
				//let status = props.getUrlParam('status');
				//let extParam = { 'uiState': status };
				//let oldvalue = eventData.oldvalue;
				//ajax({
					//url: base_url + 'FDSREditAfteraction.do',
					//data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
					//success: (res) => {
						//let { success, data } = res;
						//if (success) {
							//props.form.setAllFormValue({ [formId]: res.data.form[formId] });
							//props.form.setFormItemsValue(formId, { "pk_settleacc.name": { value: null, display: null } });
							//props.form.setFormItemsValue(formId, { "pk_depositacc.name": { value: null, display: null } });
							//props.form.setFormItemsValue(formId, { "intervalunit": { value: null, display: null } });
						//}
					//},
				//});
				props.form.setFormItemsValue(formId, { 'pk_settleacc': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_settleacc.name': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositacc': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositacc.name': { value: null } })
				props.form.setFormItemsValue(formId, { 'businessvariety': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositrate': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_aiacrate': { value: null } })
				props.form.setFormItemsValue(formId, { 'intervalunit': { value: null } })
				props.form.setFormItemsValue(formId, { 'depositinterval': { value: null } })
				props.form.setFormItemsValue(formId, { 'deposityrate': { value: null } })
				props.form.setFormItemsValue(formId, { 'enddate': { value: null } })
			}
			break;
		case "olcrate": // 组织本币汇率
            afterEventEdit.call(this, props, moduleId, key, value); //处理汇率编辑后事件
        	break;
        case "glcrate": // 集团本币汇率
            afterEventEdit.call(this, props, moduleId, key, value); //处理汇率编辑后事件
        	break;
        case "gllcrate": // 全局本币汇率
            afterEventEdit.call(this, props, moduleId, key, value); //处理汇率编辑后事件
            break;
		case 'businessvariety': // 定期业务品种
			//let pkvarieties = props.form.getFormItemsValue(formId, 'businessvariety').value;
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			if (oldvalue && newvalue.value == null) {
				props.form.setFormItemsValue(formId, { 'businessvariety': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositrate': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_aiacrate': { value: null } })
				props.form.setFormItemsValue(formId, { 'intervalunit': { value: null } })
				props.form.setFormItemsValue(formId, { 'depositinterval': { value: null } })
				props.form.setFormItemsValue(formId, { 'deposityrate': { value: null } })
				props.form.setFormItemsValue(formId, { 'enddate': { value: null } })
				return;
			}else{
				let data = props.createFormAfterEventData(pageCodeCard, tableId);
				ajax({
					url: base_url + 'BankProcessVarietyAfteraction.do',
					data: data,
					async: false,
					success: res => {
						if (res.success) {
							props.form.setAllFormValue({ [formId]: res.data[formId] });
						}
					},
					error: res => {
						if (key === "pk_org") {
							props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
						}
						toast({ color: "warning", content: res.message });
					}
				});
			}
			break;

		case "depositamount": // 存入原币余额-xuechh
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
            if (!oldvalue || !oldvalue.value) {
				afterEventEdit.call(this, props, moduleId, key, value);
                //props.form.setFormItemsValue(formId, { 'olcdepositamount': { value: newvalue.value, display: newvalue.value } })

            }//else if(oldvalue && newvalue.value == null){
                //props.form.setFormItemsValue(formId, { 'olcdepositamount': { value: null } })
                //return;
            //}
             //else {
                //props.form.setFormItemsValue(formId, { 'olcdepositamount': { value: newvalue.value, display: newvalue.value } })
			//}
			else if (newvalue.value == null || newvalue.value == '') {
                props.form.setFormItemsValue(this.formId, { 'olcdepositamount': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'gllcdepositamount': { value: null } })
                props.form.setFormItemsValue(this.formId, { 'glcdepositamount': { value: null } })
                return;
            } else {
                afterEventEdit.call(this, props, moduleId, key, value);
            }
            break;

		case "depositdate": //存款日期
            let begindate = props.form.getFormItemsValue(formId, "depositdate").value; // 开始日期
            let periodcount = props.form.getFormItemsValue(formId, "depositinterval").value; // 期间
            let periodunit = props.form.getFormItemsValue(formId, "intervalunit").value; // 期间单位
            let enddate
            if (begindate && periodcount && periodunit) {

                if (periodunit.includes('D')) {
                    enddate = moment(begindate).add(periodcount, 'day');
                }
                if (periodunit.includes('M')) {
                    enddate = moment(begindate).add(periodcount, 'months');
                }
                if (periodunit.includes('S')) {
                    enddate = moment(begindate).add(periodcount, 'quarters');
                }
                if (periodunit.includes('Y')) {
                    if (periodunit.includes('HALFYEAR')) {
                        let numb = 6 * periodcount;
                        enddate = moment(begindate).add(numb, 'months');
                    } else {
                        enddate = moment(begindate).add(periodcount, 'years');
                    }
                }
                props.form.setFormItemsValue(formId, { 'enddate': { value: moment(enddate).format('YYYY-MM-DD HH:mm:ss'), display: moment(enddate).format('YYYY-MM-DD HH:mm:ss') } })
            }
            afterEventEdit.call(this, props, moduleId, key, value);
            break;

		case 'pk_depositbank': // 存款银行
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			if ((!oldvalue || !oldvalue.value) && newvalue.value != null) {
				props.form.setFormItemsValue(formId, { 'pk_settleacc': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_settleacc.name': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositacc': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositacc.name': { value: null } })
			} else if (oldvalue && newvalue.value == null) {
				props.form.setFormItemsValue(formId, { 'pk_settleacc': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_settleacc.name': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositacc': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositacc.name': { value: null } })
			}else if (oldvalue && newvalue.value != null && oldvalue !=newvalue.value) {
				props.form.setFormItemsValue(formId, { 'pk_settleacc': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_settleacc.name': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositacc': { value: null } })
				props.form.setFormItemsValue(formId, { 'pk_depositacc.name': { value: null } })
			}
			else {
			}
		break;
            
		default:
			break;
	}
}

//组织改变确定
export const handleOrgChangeSure = function (props, moduleId, key, value, changedrows, index, eventData) {
	//组织选中值则恢复其余字段的编辑性
	props.resMetaAfterPkorgEdit();
	let newvalue = eventData.newvalue;
	if (!newvalue || !newvalue.value) {
		props.form.EmptyAllFormValue(formId);
		props.initMetaByPkorg();
	} else {
		let pkorg = props.form.getFormItemsValue(formId, "pk_org");
		props.form.EmptyAllFormValue(formId);
		props.form.setFormItemsValue(formId, { 'pk_org': { value: pkorg.value, display: pkorg.display } });
		eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
		handleOrgAfterEdit.call(this, props, moduleId, key, value, changedrows, index, eventData);
	}
}

// 组织改变取消
const handleOrgChangeCancel = function (props, formId, key, value, oldvalue, eventData) {
	//组织选中值则恢复其余字段的编辑性
	let oldorg = JSON.parse(OrgOldValue);
	props.resMetaAfterPkorgEdit();
	props.form.setFormItemsValue(formId, { 'pk_org': { value: oldorg.value, display: oldorg.display } });
	setHeadItemProp(card_from_id, ['pk_clearinplan']);//清算传入计划项目
}
// 组织启用报错时，清空值
const handleOrgChangeError = function (props, oldvalue) {
	let oldorg = JSON.parse(OrgOldValue);
	props.resMetaAfterPkorgEdit();
	if (!oldorg || !oldorg.value) {
		props.form.EmptyAllFormValue(formId);
		props.form.setFormItemsValue(formId, { pk_org: { value: null, display: null } });
		props.initMetaByPkorg();
	} else {
		props.form.setFormItemsValue(formId, { pk_org: { value: oldorg.value, display: oldorg.display } });
	}
}

/**
 * 处理组织编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 * @param {*} eventData 
 */
const handleOrgAfterEdit = function (props, formId, key, value, changedrows, i, eventData) {
	let status = props.getUrlParam('status');
	let extParam = { 'uiState': status };
	let oldvalue = eventData.oldvalue;
	ajax({
		url: base_url + 'FDSREditAfteraction.do',
		data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { form } = data;
				//更新表单数据
				props.form.setAllFormValue({ [formId]: form[formId] });
				//props.form.setFormItemsDisabled(formId, { 'pk_depositacc': true });
				if (extParam.hasOwnProperty('warning')) {
					toast({ color: 'warning', content: extParam.warning });
					handleOrgChangeCancel.call(this, props, formId, key, value, oldvalue, eventData)
				}
			}
		},
		error: (res) => {
			handleOrgChangeError(props, oldvalue);
			toast({ color: 'warning', content: res.message });
		}
	});
}

/**
 * 汇率字段
 *  @param {*} props     页面内置对象
 */
//export function disableamount(props) {
const  disableamount = function (props) {
    let olcrate = props.form.getFormItemsValue(formId, 'olcrate').value;
    let glcrate = props.form.getFormItemsValue(formId, 'glcrate').value;
    let gllcrate = props.form.getFormItemsValue(formId, 'gllcrate').value;

	if(olcrate==="1" || olcrate==="1.0" || olcrate==="1.00" || olcrate==="1.000" || olcrate==="1.0000" || olcrate==="1.00000" || olcrate==="1.000000" || olcrate==="1.0000000" || olcrate==="1.00000000" ){
        props.form.setFormItemsDisabled(formId, { 'olcrate': true });
    }
    if(glcrate==='1' || glcrate==='1.0' || glcrate==='1.00' || glcrate==='1.000' || glcrate==='1.0000' || glcrate==='1.00000' || glcrate==='1.000000' || glcrate==='1.0000000'  || glcrate==='1.00000000' ){
        props.form.setFormItemsDisabled(formId, { 'glcrate': true });
    }
    if(gllcrate==='1' || gllcrate==='1.0' || gllcrate==='1.00' || gllcrate==='1.000' || gllcrate==='1.0000' || gllcrate==='1.00000' || gllcrate==='1.000000' || gllcrate==='1.0000000' || gllcrate==='1.00000000'){
        props.form.setFormItemsDisabled(formId, { 'gllcrate': true });
    }
}
/**
 * 财务组织、币种、金额等编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 */
export function afterEventEdit(props, moduleId, key, value) {
    if (value.value) {
        if (key === "pk_org") {
            // props.initMetaByPkorg();
            props.form.EmptyAllFormValue(formId);
            props.form.setFormItemsValue(formId, {
                pk_org: value,
                // pk_org_v: value
            });
        }
        let data = props.createHeadAfterEventData(
            pageCodeCard,
            formId,
            "",
            moduleId,
            key,
            value
        );
        // 解决首次财务组织编辑后事件传值问题
        data.oldvalue = {
            display: null,
            value: null
        };
        ajax({
            url: `/nccloud/ifac/fixdepositprocess/FDSRAmtEditAfteraction.do`,
            data,
            async: false,
            success: res => {
                if (res.success) {
                    if (key === "pk_org") {
                        props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
                        //props.form.setFormItemsDisabled(formId, {
                            //adjustmount: true
                        //});
					}
					if(res.data.userjson){
						let userjson = JSON.parse(res.data.userjson);
						let {retExtParam} =userjson;
						//设置组织本币列编辑性
						processHeadOlcRateEditable(props, retExtParam);
					}
                    props.form.setAllFormValue({
                        [formId]:
                            res.data &&
                            res.data.head &&
                            res.data.head[formId]
					});
					//disableamount.call(props);
					//disableamount.call(this);
								}
							},
			error: res => {
				if (key === "pk_org") {
					props.resMetaAfterPkorgEdit(); //组织选中值则恢复其余字段的编辑性
                }
                toast({ color: "warning", content: res.message });
            }
        });
    } else if (key === "pk_org") {
        props.initMetaByPkorg();
        props.form.EmptyAllFormValue(formId);
    } else if (key === "pk_currtype") {
        //props.form.setFormItemsValue(this.formId, { 'creditaccount': { value: null } }) // 贷款账号
        //props.form.setFormItemsValue(this.formId, { 'innercreditaccount': { value: null } }) // 内部贷款账号
        //props.form.setFormItemsValue(this.formId, { 'unitdebitaccount': { value: null } }) // 单位借款账号
	}
	
}


/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/