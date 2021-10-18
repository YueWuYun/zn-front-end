/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
// import { processHeadOlcRateEditable } from '../../../../public/cmppubutil';
import { CARD_PAGE_INFO } from '../../cons/constant';
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {
	let cpagecode=constant.cpagecode;
	let formcode1=constant.formcode1;
	const headItems = ['billdate'];
	//处理表头编辑后事件
    if (headItems.includes(key)) {
        headItemAfterEditHandler(props, key, value);
    }else{

	// 财务组织编辑后事件
	if (key === 'pk_org') {
		let changedata = props.createFormAfterEventData(cpagecode, formcode1);
		let pkorg=props.form.getFormItemsValue(moduleId, 'pk_org').value;
		let newvalue = pkorg;
		let oldvalue = changedrows.value;
		let oldorgDis=changedrows.display;
		if (oldvalue != newvalue && oldvalue != null) {
			this.setState({
				oldorg: oldvalue,
				oldorgDis:oldorgDis
			});
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070WC-000013'], // 弹框表头信息/* 国际化处理： 确认修改*/
				content: this.state.json['36070WC-000014'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
				// noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				// noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
				// hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: this.ortBeSureBtnClick.bind(this),   // 确定按钮点击调用函数,非必输
				cancelBtnClick: this.orgCancelBtnClick.bind(this),  // 取消按钮点击调用函数,非必输
				onEscapeKeyUp: this.orgCancelBtnClick.bind(this), // esc关闭对话框
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			});
		}

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
							//begin lidyu 选择组织后  这段逻辑提前  
							props.resMetaAfterPkorgEdit();//选择主组织以后，恢复其他字段的编辑性
							//设置组织本币列编辑性
							processHeadOlcRateEditable(props, retExtParam);
						}
						// processHeadOlcRateEditable.call(this,res.data.userjson);
						this.disablefield();
						props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
					}
				}
			});
		}
		// if(pkorg){
		// 	props.resMetaAfterPkorgEdit();//选择主组织以后，恢复其他字段的编辑性
		// }
	}

	if (key === 'pk_currency') {
		// props.form.setFormItemsDisabled(moduleId,{'olcrate':false});
		this.undisablerate();
		let currency = props.form.getFormItemsValue(moduleId, 'pk_currency').value;
		let changedata = props.createFormAfterEventData(cpagecode, formcode1);
		if (currency) {
			ajax({
				url: requesturl.currencychange,
				data: changedata,
				async: false,
				success: (res) => {
					if (res.success) {
						let olcrate
						if(res.data[formcode1].rows[0].values.olcrate){
							olcrate = res.data[formcode1].rows[0].values.olcrate.value;
						}
						if(res.data.userjson){
							let userjson = JSON.parse(res.data.userjson);
							let {retExtParam} =userjson;
							//设置组织本币列编辑性
							processHeadOlcRateEditable(props, retExtParam);
						}
						// processHeadOlcRateEditable.call(this,res.data.userjson);
						props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
						props.form.setFormItemsValue(moduleId, {
							pk_bankaccount: { display: null, value: null }
						});
						if(!olcrate){
							this.emptymoney();
						}
					}
				}
			});
		}else{
			props.form.setFormItemsValue(moduleId, {
				pk_cashaccount: { display: null, value: null }
			});
			props.form.setFormItemsValue(moduleId, {
				pk_bankaccount: { display: null, value: null }
			});
			this.emptyrate();
			props.form.getFormItemsValue();
		}
	}

	if (key === 'olcrate') {
		let olcrate = props.form.getFormItemsValue(moduleId, 'olcrate').value;
		let money = props.form.getFormItemsValue(moduleId, 'money').value;
		let currency = props.form.getFormItemsValue(moduleId, 'pk_currency').value;
		if (olcrate && money && currency) {
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
	// 集团本币汇率编辑后事件
	if (key === 'glcrate') {
		//begin lidyu  注掉无用代码
		// let olcrate = props.form.getFormItemsValue(moduleId, 'olcrate').value;
		// let glcrate = props.form.getFormItemsValue(moduleId, 'glcrate').value;
		// let money = props.form.getFormItemsValue(moduleId, 'money').value;
		// let currency = props.form.getFormItemsValue(moduleId, 'pk_currency').value;
		// if (olcrate && money && currency) {
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
			
		// } lidyu end
	}
	// 全局本币汇率编辑后事件
	if (key === 'gllcrate') {
		// let gllcrate = props.form.getFormItemsValue(moduleId, 'gllcrate').value;
		// let money = props.form.getFormItemsValue(moduleId, 'money').value;
		// let currency = props.form.getFormItemsValue(moduleId, 'pk_currency').value;
		// if (olcrate && money && currency) {
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
			
		// }
	}

	if (key === 'money') {
		// let olcrate = props.form.getFormItemsValue(moduleId, 'olcrate').value;
		// let money = props.form.getFormItemsValue(moduleId, 'money').value;
		// if (olcrate && money) {
			let moneyevent = props.createFormAfterEventData(cpagecode, formcode1);
			ajax({
				url: requesturl.oclmoneyevent,
				data: moneyevent,
				async:false, // 同步
				success: (res) => {
					if(res.data){
						this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
					}
				}
			});
		// }
	}

	if (key === 'pk_bankaccount') {
		let  bankdocname,pk_bankdoc
		if(i && i.values){
			bankdocname=i.refcode;
			pk_bankdoc=i.refpk;
			props.form.setFormItemsValue(moduleId, {
				'pk_bankaccount': {
					display: bankdocname,
					value: pk_bankdoc
				}
			});
			//如果所选为内部账户 将内部账户标识设置为true
			if(i.values && i.values['bd_banktype.pk_banktype'] && i.values['bd_banktype.pk_banktype'].value==constant.innerId){
				props.form.setFormItemsValue(constant.formcode1, {'isinneracc': {value:true}});
				props.form.setFormItemsValue(constant.formcode1, {'pk_fundorg': {value:i.values['bd_bankdoc.pk_bankdoc'].value,display:i.values['bd_bankdoc.name'].value}});
			}else{
				props.form.setFormItemsValue(constant.formcode1, {'isinneracc': {value:false}});
				// props.form.setFormItemsValue(constant.formcode1, {'pk_fundorg': {value:i.values['bd_bankdoc.pk_bankdoc'].value,display:i.values['bd_bankdoc.name'].value}});
			}
		}
	}
}
}

/**
 * 设置表头组织本币汇率的编辑性
 * @param {*} props 
 */
const processHeadOlcRateEditable = function (props, extParam) {
    if (extParam.hasOwnProperty('bodyOlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyOlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(constant.formcode1, {   olcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(constant.formcode1, {   glcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGllcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGllcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(constant.formcode1, {   gllcrate: flag });
   }
}
//处理表头字段编辑后事件
const headItemAfterEditHandler = function (props, key, value) {
    //获取页面数据
    let eventData = props.createHeadAfterEventData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [], CARD_PAGE_INFO.HEAD_CODE, key, value);
    //获取编辑的值
    const newvalue = JSON.parse(JSON.stringify(eventData.newvalue));
    const oldvalue = JSON.parse(JSON.stringify(eventData.oldvalue));
    //规避平台组件bug，eventData中的值还是旧值
	eventData.card.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values[key] = newvalue;
   	if (!oldvalue || !oldvalue.value || newvalue.value != oldvalue.value) {
        //处理组织编辑后事件(修改组织需要涉及到交互)        
		let data = buildHeadAfterEditReqData(props, key, eventData);
		ajax({
			url: requesturl.afteredit,
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
    props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });   
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/