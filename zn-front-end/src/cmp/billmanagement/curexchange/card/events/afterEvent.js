/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax } from 'nc-lightapp-front';
import { changeOrgShow } from "../buttonClick/changeOrgShow";
import { CARD_PAGE_INFO } from '../../cons/constant.js';
import { Rateinfo } from "../../util/commonUtil";

export default function afterEvent(props, moduleId, key, value, changedrows, i) {


	const headItems = ['billdate'];
	//处理表头编辑后事件
    if (headItems.includes(key)) {
        headItemAfterEditHandler(props, key, value);
    }else{

	//相同值不变化--不同值可以进行编辑后
	let check_init = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
	if (check_init.oldvalue.value == check_init.newvalue.value) {
		return;
	}
	//点选财务组织，编辑后事件
	if (key === 'pk_org') {
		let testorg = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		//禁止参照差选和取消调用
		if (testorg.oldvalue.value == null && testorg.newvalue.value == null) {
			return;
		}
		if (value.value == null || value.display == null) {
			//叉选组织/清空组织的时候调用	
			changeOrgShow.call(this);
		} else {
			props.resMetaAfterPkorgEdit();//选择主组织以后，恢复其他字段的编辑性
		}
		if (value.value && Object.keys(value.value).length != 0) {
			let orgdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
			let org_new = orgdata.newvalue.value;//新输入值
			let org_new_dly = orgdata.newvalue.display;//新输入值
			let org_old = orgdata.oldvalue.value;//修改之前的值
			let org_old_dly = orgdata.oldvalue.display;//修改之前的显示值
			if (org_new != org_old) {
				if (org_old != null) {
					//叉选组织后取消后还要赋值
					this.setState({
						org_value: org_old,
						org_display: org_old_dly
					});
				} else if (org_old == null && org_new != null) {
					this.setState({
						org_value: org_new,
						org_display: org_new_dly
					});
				}
				//先清空之前做的修改
				if (org_old != null && org_old_dly != null) {
					//首次填写财务组织，不进行清空				
					changeOrgShow.call(this);
				} else {
					ajax({
						url: '/nccloud/cmp/curexchange/curexchangeorgafterevent.do',
						data: orgdata,
						async: false,//1909新增:编辑后事件改为同步ajax请求
						success: (res) => {
							if (res.success) {
								//后台只进行了相关数据操作
								this.props.form.setAllFormValue({ [moduleId]: res.data[moduleId] });
								this.props.resMetaAfterPkorgEdit();//选择主组织以后，恢复其他字段的编辑性
								//汇率编辑性控制
								Rateinfo.call(this, res.data.userjson, 'pk_chargecurrtype');
							}
						}
					});
				}

			}
		} else {
			props.initMetaByPkorg();//单据有主组织，新增时,将其他字段设置为不可编辑. 
		}
	}
	//编辑后----->业务类型
	else if (key === 'busitype') {
		//业务类型：1，买入外汇；2，卖出外汇；3，外币兑换
		let busitype = props.form.getFormItemsValue(moduleId, 'busitype').value;
		//[买入外汇]
		//设置编辑属性
		//1，PK_BUYCURRTYPE可以进行编辑
		//2，BUYOLCRATE可以进行编辑
		//3,PK_SELLCURRTYPE不可以进行编辑
		if (busitype === 'BUY') {
			props.form.setFormItemsDisabled(moduleId, { 'pk_sellcurrtype': true });//卖出币种
			props.form.setFormItemsDisabled(moduleId, { 'sellolcrate': true });//卖出本币汇率
			props.form.setFormItemsDisabled(moduleId, { 'sellolcamount': true });//卖出本币金额
			props.form.setFormItemsDisabled(moduleId, { 'pk_buycurrtype': false });//买入币种
			props.form.setFormItemsDisabled(moduleId, { 'buyolcrate': false });//买入本币汇率
			//卖出信息赋值
			let buytypedata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
			let buytype_new = buytypedata.newvalue.value;
			let buytype_old = buytypedata.oldvalue.value;
			let buytype_data = {
				key: key,
				form: buytypedata
			}
			if (buytype_new != buytype_old) {
				ajax({
					url: '/nccloud/cmp/curexchange/afterHandler.do',
					data: buytype_data,
					async: false,//1909新增:编辑后事件改为同步ajax请求
					success: (res) => {
						let { success, data } = res;
						if (success) {
							props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							Rateinfo.call(this, res.data.userjson, null);//汇率编辑性控制
						}
					}
				});
			}

		}
		//[卖出外汇]
		//设置编辑属性
		//1,PK_SELLCURRTYPE可以编辑
		//2,SELLOLCRATE可以编辑
		//3,PK_BUYCURRTYPE不可以进行编辑
		if (busitype === 'SELL') {

			props.form.setFormItemsDisabled(moduleId, { 'pk_buycurrtype': true });
			props.form.setFormItemsDisabled(moduleId, { 'buyolcrate': true });
			props.form.setFormItemsDisabled(moduleId, { 'buyolcamount': true });
			props.form.setFormItemsDisabled(moduleId, { 'pk_sellcurrtype': false });
			props.form.setFormItemsDisabled(moduleId, { 'sellolcrate': true });
			props.form.setFormItemsDisabled(moduleId, { 'sellolcamount': true });
			//卖出外汇
			let selltypedata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
			let selltype_new = selltypedata.newvalue.value;
			let selltype_old = selltypedata.oldvalue.value;
			let selltype_data = {
				key: key,
				form: selltypedata
			}
			if (selltype_new != selltype_old) {

				ajax({
					url: '/nccloud/cmp/curexchange/afterHandler.do',
					data: selltype_data,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							Rateinfo.call(this, res.data.userjson, null);//汇率编辑性控制
						}
					}
				});
			}


		}
		//[外币兑换]
		//1,PK_BUYCURRTYPE可以编辑
		//2,PK_SELLCURRTYPE可以编辑
		//3,BUYOLCRATE可以编辑
		//4,SELLOLCRATE可以编辑
		//5,PK_BUYCURRTYPE设置为null，并且调用此编辑后事件
		//6,PK_SELLCURRTYPE设置为null，并且调用此编辑后事件
		//7,GAINORLOSS设置为null
		if (busitype === 'EXCHANGE') {
			//编辑性设置
			props.form.setFormItemsDisabled(moduleId, { 'pk_buycurrtype': false });
			props.form.setFormItemsDisabled(moduleId, { 'buyolcrate': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_buyacct': false });
			props.form.setFormItemsDisabled(moduleId, { 'buyamount': false });
			props.form.setFormItemsDisabled(moduleId, { 'tradeprice': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_sellcurrtype': false });
			props.form.setFormItemsDisabled(moduleId, { 'sellolcrate': false });
			props.form.setFormItemsDisabled(moduleId, { 'pk_sellacct': false });
			props.form.setFormItemsDisabled(moduleId, { 'sellamount': false });

			let exchangedata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
			let exchange_new = exchangedata.newvalue.value;
			let exchange_old = exchangedata.oldvalue.value;
			let exchtype_data = {
				key: key,
				form: exchangedata
			}
			if (exchange_new != exchange_old) {
				ajax({
					url: '/nccloud/cmp/curexchange/afterHandler.do',
					data: exchtype_data,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							Rateinfo.call(this, res.data.userjson, null);//汇率编辑性控制
						}
					}
				});
			}
		}
	}
	//编辑后----->卖出金额
	else if (key === 'sellamount') {

		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		let sell_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_sellcurrtype') && this.props.form.getFormItemsValue(this.formId, 'pk_sellcurrtype').value;
		if(!sell_currtype){
			return;
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
					}
				}
			});
		}

	}
	//编辑后----->买入金额
	else if (key === 'buyamount') {
		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		let buy_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_buycurrtype') && this.props.form.getFormItemsValue(this.formId, 'pk_buycurrtype').value;
		if(!buy_currtype){
			return;
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
					}
				}
			});
		}
	}
	//编辑后----->手续费金额
	else if (key === 'chargeamount') {
		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		let charge_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_chargecurrtype') && this.props.form.getFormItemsValue(this.formId, 'pk_chargecurrtype').value;
		if(!charge_currtype){
			return;
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
					}
				}
			});
		}
	}
	//编辑后----->交易价
	else if (key === 'tradeprice') {
		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		let buy_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_buycurrtype') && this.props.form.getFormItemsValue(this.formId, 'pk_buycurrtype').value;
		if(!buy_currtype){
			return;
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
					}
				}
			});
		}

	}
	//编辑后----->买入币种
	else if (key === 'pk_buycurrtype') {
		//显隐性控制
		//本币币种
		let local_currtype = props.form.getFormItemsValue(moduleId, 'pk_chargecurrtype').value;
		let buy_currtype = props.form.getFormItemsValue(moduleId, 'pk_buycurrtype').value;
		//控制显隐性
		if (local_currtype != buy_currtype) {
			props.form.setFormItemsDisabled(moduleId, { 'buyolcrate': false });
		} else {
			props.form.setFormItemsDisabled(moduleId, { 'buyolcrate': true });
		}

		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
						Rateinfo.call(this, res.data.userjson, key);//汇率控制
					}
				}
			});
		}
	}
	//编辑后----->卖出币种
	else if (key === 'pk_sellcurrtype') {
		//显隐性控制
		let local_currtype = props.form.getFormItemsValue(moduleId, 'pk_chargecurrtype').value;
		let sell_currtype = props.form.getFormItemsValue(moduleId, 'pk_sellcurrtype').value;
		//币种等于组织本币的设置汇率显隐性
		if (local_currtype != sell_currtype) {
			props.form.setFormItemsDisabled(moduleId, { 'sellolcrate': false });
		} else {
			props.form.setFormItemsDisabled(moduleId, { 'sellolcrate': true });
		}
		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
						Rateinfo.call(this, res.data.userjson, key);//汇率控制
					}
				}
			});
		}
	}
	//编辑后----->手续费币种
	else if (key === 'pk_chargecurrtype') {
		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
						Rateinfo.call(this, res.data.userjson, key);//汇率控制
					}
				}
			});
		}
	}
	//编辑后----->买入本币汇率
	else if (key === 'buyolcrate' || key === 'buygllcrate' || key === 'buyglcrate') {
		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		let buy_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_buycurrtype') && this.props.form.getFormItemsValue(this.formId, 'pk_buycurrtype').value;
		if(!buy_currtype){
			return;
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
					}
				}
			});
		}
	}
	//编辑后----->卖出本币汇率
	else if (key === 'sellolcrate' || key === 'sellglcrate' || key === 'sellgllcrate') {
		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		let sell_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_sellcurrtype') && this.props.form.getFormItemsValue(this.formId, 'pk_sellcurrtype').value;
		if(!sell_currtype){
			return;
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
					}
				}
			});
		}
	}
	//手续费汇率
	else if (key === 'chargeolcrate' || key === 'chargegllcrate' || key === 'chargeglcrate') {
		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		let formdata = {
			key: key,
			form: afterdata
		}
		let charge_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_chargecurrtype') && this.props.form.getFormItemsValue(this.formId, 'pk_chargecurrtype').value;
		if(!charge_currtype){
			return;
		}
		if (newvalue != oldvalue) {

			ajax({
				url: '/nccloud/cmp/curexchange/afterHandler.do',
				data: formdata,
				async: false,//1909新增:编辑后事件改为同步ajax请求
				success: (res) => {
					let { success, data } = res;
					if (success) {
						props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
					}
				}
			});
		}
	}
	//买入账户
	else if (key == 'pk_buyacct') {
		if (value.value == null || value.display == null) {
			//叉选买入账户
			return;
		}
		let afterdata = props.createFormAfterEventData(this.pageId, moduleId, moduleId, key, value);
		let newvalue = afterdata.newvalue.value;
		let oldvalue = afterdata.oldvalue.value;
		if (newvalue != oldvalue) {
			if (i) {
				//如果所选为内部账户 将内部账户标识设置为true
				if (i.values['bd_banktype.pk_banktype'].value == CARD_PAGE_INFO.INNER_ID) {
					props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { 'isinner': { value: true } });
				} else {
					//tm begin lidyu 20200327 不是内部账户 标识设为flase 
					props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { 'isinner': { value: false } });
					//end lidyu 20200327
					//如果所选为内部账户 将内部账户标识设置为true
					if (i.values['bd_banktype.pk_banktype'].value == CARD_PAGE_INFO.INNER_ID) {
						props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { 'isinner': { value: false } });
					}
				}
			}
		}
	}
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
			url: '/nccloud/cmp/curexchange/curexchangeafteredit.do',
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