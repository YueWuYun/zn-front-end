/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import {processHeadOlcRateEditable} from '../../pubutil/util';
import baseApp from '../../base';
const { cons } = baseApp;
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {

	let cpagecode = constant.cpagecode;
	let formcode1 = constant.formcode1; 
	const headItems = ['billdate'];
	//处理表头编辑后事件
    if (headItems.includes(key)) {
        headItemAfterEditHandler(props, key, value);
    }else{
		// 财务组织
		if (key === 'pk_org') {
			let changedata = props.createFormAfterEventData(cpagecode, formcode1);
			let newvalue = props.form.getFormItemsValue(moduleId, 'pk_org').value;
			let oldvalue = changedrows.value;
			let oldorgDis = changedrows.display;		
			if (oldvalue == null) {
				ajax({
					url: requesturl.orgchange,
					data: changedata,
					async: false,
					success: (res) => {
						if (res.success) {
							if(res.data.userjson){
								let userjson = JSON.parse(res.data.userjson);
								let {retExtParam} =userjson;
								props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
								//设置组织本币列编辑性
								processHeadOlcRateEditable(props, retExtParam);
							}
							props.form.setAllFormValue({
								[formcode1]: res.data[formcode1]
							});
							this.disablemoney();						
						}
					}
				});
			}

			if (oldvalue != newvalue && oldvalue != null) {
				this.setState({
					oldorg: oldvalue,
					oldorgDis: oldorgDis
				});
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['36070TBR-000017'], // 弹框表头信息/* 国际化处理： 确认修改*/
					content: this.state.json['36070TBR-000018'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					// noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					// noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					// beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
					// cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
					// hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
					beSureBtnClick: this.orgBeSureBtnClick.bind(this),   // 确定按钮点击调用函数,非必输
					cancelBtnClick: this.orgCancelBtnClick.bind(this),  // 取消按钮点击调用函数,非必输
					onEscapeKeyUp: this.orgCancelBtnClick.bind(this), // esc关闭对话框
					// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
					// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
				})
			}		
		}

		// 币种
		if (key === 'pk_currtype') {
			this.undisablerate();
			// 清空账户和银行
			// 划出银行
			props.form.setFormItemsValue(moduleId, {
				'transformoutbank': {
					display: null,
					value: null
				}
			}); 
			// 划出账户
			props.form.setFormItemsValue(moduleId, {
				'transformoutaccount': {
					display: null,
					value: null
				}
			});
			// 划入银行
			props.form.setFormItemsValue(moduleId, {
				'transforminbank': {
					display: null,
					value: null
				}
			});
			// 划入账户
			props.form.setFormItemsValue(moduleId, {
				'transforminaccount': {
					display: null,
					value: null
				}
			});

			let changedata = props.createFormAfterEventData(cpagecode, formcode1);
			let currency = props.form.getFormItemsValue(moduleId, 'pk_currtype').value;
			if (currency) {
				ajax({
					url: requesturl.currencychange,
					data: changedata,
					async: false,
					success: (res) => {
						if (res.success) {							
							if(res.data.userjson){
								let userjson = JSON.parse(res.data.userjson);
								let {retExtParam} =userjson;
								//设置组织本币列编辑性
								processHeadOlcRateEditable(props, retExtParam);
							}
							props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
							if (res.data[formcode1]&& res.data[formcode1].rows[0] &&  res.data[formcode1].rows[0].values &&res.data[formcode1].rows[0].values.olcrate) {
								let olcrate = res.data[formcode1].rows[0].values.olcrate.value;
								if(!olcrate){
									this.emptymoney();
								}
							}
							
						}
					}
				});
			} else {
				this.emptyrate();
				// props.form.setFormItemsValue(moduleId, {
				// 	olcrate: {
				// 		display: null,
				// 		value: null
				// 	}
				// });
			}
		}

		// 组织本币汇率
		if (key === 'olcrate') {
			let olcrate = props.form.getFormItemsValue(moduleId, 'olcrate').value;
			let amount = props.form.getFormItemsValue(moduleId, 'amount').value;
			if (olcrate && amount) {
				let olcrateevent = props.createFormAfterEventData(cpagecode, formcode1);
				ajax({
					url: requesturl.oclmoneyevent,
					data: olcrateevent,
					async: false,
					success: (res) => {
						if(res.data){
							this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
							// this.props.form.setFormItemsValue(this.formId,{'glcmoney':{ display: null, value: null }});
							// this.props.form.setFormItemsValue(this.formId,{'gllcmoney':{ display: null, value: null }});
						}
					}
				});
			}
		}
		// 集团组织本币汇率
		if (key === 'glcrate') {
			let glcrate = props.form.getFormItemsValue(moduleId, 'glcrate').value;
			let amount = props.form.getFormItemsValue(moduleId, 'amount').value;
			if (glcrate && amount) {
				let olcrateevent = props.createFormAfterEventData(cpagecode, formcode1);
				ajax({
					url: requesturl.oclmoneyevent,
					data: olcrateevent,
					async: false,
					success: (res) => {
						if(res.data){
							this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
						}
					}
				});
			}
		}
		// 全局组织本币汇率
		if (key === 'gllcrate') {
			let gllcrate = props.form.getFormItemsValue(moduleId, 'gllcrate').value;
			let amount = props.form.getFormItemsValue(moduleId, 'amount').value;
			if (gllcrate && amount) {
				let olcrateevent = props.createFormAfterEventData(cpagecode, formcode1);
				ajax({
					url: requesturl.oclmoneyevent,
					data: olcrateevent,
					async: false,
					success: (res) => {
						if(res.data){
							this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
						}
					}
				});
			}
		}

		if (key === 'amount') {
			let olcrate = props.form.getFormItemsValue(moduleId, 'olcrate').value;
			let amount = props.form.getFormItemsValue(moduleId, 'amount').value;
			if (olcrate && amount) {
				let amountevent = props.createFormAfterEventData(cpagecode, formcode1);
				ajax({
					url: requesturl.oclmoneyevent,
					data: amountevent,
					async:false, // 同步
					success: (res) => {
						if(res.data){
							this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
						}
					}
				});
			}
		}
		// 划出银行
		if (key === 'transformoutbank') {
			props.form.setFormItemsValue(moduleId, {
				'transformoutaccount': {
					display: null,
					value: null
				}
			});
		}

		// 划出账户
		if (key === 'transformoutaccount') {

			let transformoutaccount = props.form.getFormItemsValue(moduleId, 'transformoutaccount');
			let transformoutbank = props.form.getFormItemsValue(moduleId, 'transformoutbank');
			let bankdocname, pk_bankdoc, accname, accpk
			accname = i.refcode;
			accpk = i.refpk;
			props.form.setFormItemsValue(moduleId, {
				'transformoutaccount': {
					display: accname,
					value: accpk
				}
			});

			if(transformoutaccount.value && !transformoutaccount.value == ''){
				if (transformoutbank.value == '' || transformoutbank.value == null) {
					if (i) {
						bankdocname = i.values['bd_bankdoc.name'].value;
						pk_bankdoc = i.values['bd_bankdoc.pk_bankdoc'].value;
						props.form.setFormItemsValue(moduleId, {
							'transformoutbank': {
								display: bankdocname,
								value: pk_bankdoc
							}
						});
					}
				}
			}
		}

		// 划入银行
		if (key === 'transforminbank') {
			props.form.setFormItemsValue(moduleId, {
				'transforminaccount': {
					display: null,
					value: null
				}
			});
		}

		// 划入账户
		if (key === 'transforminaccount') {
			let transforminaccount = props.form.getFormItemsValue(moduleId, 'transforminaccount');
			let transforminbank = props.form.getFormItemsValue(moduleId, 'transforminbank');
			let bankdocname, pk_bankdoc, inaccname, inaccpk
			inaccname = i.refcode;
			inaccpk = i.refpk;
			props.form.setFormItemsValue(moduleId, {
				'transforminaccount': {
					display: inaccname,
					value: inaccpk
				}
			});

			if(transforminaccount.value && !transforminaccount.value == ''){

				let bd_bankaccsubcode = i.refcode;
				let bd_bankaccsubname = i.refname;
				props.form.setFormItemsValue(moduleId, {
					'inaccount_name': {
						value: bd_bankaccsubname
					}
				});
				props.form.setFormItemsValue(moduleId, {
					'inaccount_num': {
						value: bd_bankaccsubcode
					}
				});

				if (transforminbank.value == '' || transforminbank.value == null) {
					if (i) {
						bankdocname = i.values['bd_bankdoc.name'].value;
						pk_bankdoc = i.values['bd_bankdoc.pk_bankdoc'].value;
		
						props.form.setFormItemsValue(moduleId, {
							'transforminbank': {
								display: bankdocname,
								value: pk_bankdoc
							}
						});
					}
				}
			}
		}
	}
	

}



//处理表头字段编辑后事件
const headItemAfterEditHandler = function (props, key, value) {
    //获取页面数据
    let eventData = props.createHeadAfterEventData(cons.card.pageCode, cons.card.headCode, [], cons.card.headCode, key, value);
    //获取编辑的值
    const newvalue = JSON.parse(JSON.stringify(eventData.newvalue));
    const oldvalue = JSON.parse(JSON.stringify(eventData.oldvalue));
    //规避平台组件bug，eventData中的值还是旧值
    eventData.card.head[cons.card.headCode].rows[0].values[key] = newvalue;
   	if (!oldvalue || !oldvalue.value || newvalue.value != oldvalue.value) {
        //处理组织编辑后事件(修改组织需要涉及到交互)        
		let data = buildHeadAfterEditReqData(props, key, eventData);
		ajax({
			url: cons.url.card.afteredit,
			data,
			async: false,
			success: (res) => {
				//处理请求返回数据
				processHeadAfterEidtRes(props, res, key);
			}
		});        
    }
}




//构建表头字段编辑后事件请求数据
const buildHeadAfterEditReqData = function (props, key, eventData) {
    let extParam = { 'uiState': props.getUrlParam('status') };
    return { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam };
}

//处理表头编辑后后事件相应数据
const processHeadAfterEidtRes = function (props, res, key) {
    let { card, extParam, headItemProps, columnPrecisions, rateInfo } = res.data;
    let { head } = card; 
    //更新表单数据
    props.form.setAllFormValue({ [cons.card.headCode]: head[cons.card.headCode] });   
}


/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/