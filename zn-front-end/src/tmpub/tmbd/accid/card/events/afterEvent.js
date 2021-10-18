/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';

import { 
	app_id, module_id, base_url, button_limit, oid, appcode,
	list_page_id,list_search_id, list_table_id,
	card_page_id,card_from_id,card_fromtail_id
} from '../../cons/constant.js';

export default function afterEvent(props, moduleId, key, value, changedrows, i, isAutoSet) {
	//点选资金组织，编辑后事件
	if (key === 'pk_org') {
		let orgid = value.value;
		if (orgid && Object.keys(orgid).length != 0) {
			//设置编辑属性
			// 账户分类--默认公司 确认标识 账户状态
			props.form.setFormItemsDisabled(moduleId, 
			{
				'accclass': false,
				'billstatus': false,
				'frozenflag': false
			});
			let saveAllData = props.form.getAllFormValue(card_from_id);
			let orgAfterData = props.createFormAfterEventData(card_page_id, card_from_id, moduleId, key, value);
			let newvalue = orgAfterData.newvalue.value;
			let oldvalue = orgAfterData.oldvalue.value;
			if(newvalue){
				// /清空表单form所有数据
				props.form.EmptyAllFormValue(this.formId);
				this.backAccidcode = null;
				if(isAutoSet){
					oldvalue = null;
				}
				if (newvalue != oldvalue) {
					//先清空之前做的修改
					if (oldvalue) {
						saveAllData.rows[0].values.pk_org.value = oldvalue;
						saveAllData.rows[0].values.pk_org.display = orgAfterData.oldvalue.display;
						//首次填写财务组织，不进行清空
						// props.modal.show('changeorg',{
						// 	//点击确定按钮事件
						// 	beSureBtnClick: this.changeOrgConfirm.bind(this, orgAfterData),
						// 	//取消按钮事件回调
						// 	cancelBtnClick: this.changeOrgCancel.bind(this, saveAllData),
						// });
						promptBox({
							color: "warning",
							/* 国际化处理： 确认修改*/
							title: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000019'),
							/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
							content: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000020'),
							// beSureBtnClick: this.changeOrgConfirm
							//点击确定按钮事件
							beSureBtnClick: this.changeOrgConfirm.bind(this, orgAfterData),
							//取消按钮事件回调
							cancelBtnClick: this.changeOrgCancel.bind(this, saveAllData),
						});
					} else {
						ajax({
							url: '/nccloud/tmpub/tmbd/accidafterevent.do',
							data: orgAfterData,
							async: false,
							success: (res) => {
								let { success, data } = res;
								if (success) {
									if(data){
										props.form.setAllFormValue({ [card_from_id]: data[card_from_id] });
										//选择主组织以后，恢复其他字段的编辑性
										props.resMetaAfterPkorgEdit();
										if(data[card_from_id].rows[0].values.pk_bankdoc.display == " "){
											props.form.setFormItemsValue(card_from_id,{
												'pk_bankdoc':{
													value : null,
													display: null
												}
											});
										}
										// 组织可编辑
										props.form.setFormItemsDisabled(card_from_id, 
										{
											'pk_org': false,
											'concertedmoney ': true,
										});
									}
								}
							}
						});
					}
				}
			}
		}else{
			//单据有主组织，新增时,将其他字段设置为不可编辑.
			props.initMetaByPkorg(); 
		}
	}
	// 账户类型 开户单位 编辑后
	if (key === 'pk_ownerorg' || key === 'acctype') {
		// props.form.setFormItemsValue(moduleId, { 'pk_sellcurrtype': { display: '人民币', value: '1002Z0100000000001K1' } });
		// 根据开户单位与主组织的关系来判定是否可编辑清算账户
		let acctype = props.form.getFormItemsValue(moduleId, 'acctype').value;
		props.form.setFormItemsValue(moduleId, { 'isaccounting': { value: false } });
		props.form.setFormItemsDisabled(moduleId, { 'isaccounting': false });

		if (acctype === 0 || acctype === 1 ) {
			props.form.setFormItemsDisabled(moduleId, { 'isaccounting': true });
		}
		if(key === 'acctype'){
			acctype = value.value;
			props.form.setFormItemsValue(moduleId, { 'istrade': { value: false } });
			props.form.setFormItemsDisabled(moduleId, { 'istrade': false });
			// 账户类型-活期 0
			if(acctype == 0){
				// false 可编辑
				props.form.setFormItemsDisabled(moduleId,
				{ 
					'arapprop': false ,
					'istrade': false,
					'overdraftmny': false,
					'concertedmoney': true,
					'overdrafttype': false,
					'isaccounting': false,
				});
				// 设置字段的默认值
				props.form.setFormItemsValue(moduleId, 
				{
					'arapprop':{value:"2",display:this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000000')},/* 国际化处理： 收支*/
					'overdraftmny':{value:0},
					'concertedmoney':{value:null},
					'overdrafttype':{value:"1",display:this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000001')}/* 国际化处理： 控制*/
				});
			}
			// 账户类型-协定 1
			else if(acctype == 1){
				// 字段的无条件可用性
				props.form.setFormItemsDisabled(moduleId,
				{
					'arapprop': false ,
					'istrade': false,
					'overdraftmny': false,
					'concertedmoney': false,
					'overdrafttype': false,
					'isaccounting': false,
				});
				// 设置字段的默认值
				props.form.setFormItemsValue(moduleId, 
				{
					'arapprop':{value:"2",display:this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000000')},/* 国际化处理： 收支*/
					'overdraftmny':{value:0},
					'overdrafttype':{value:"1",display:this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000001')}/* 国际化处理： 控制*/
				});
			}
			// 2=定期
			else if(acctype == 2){
				props.form.setFormItemsDisabled(moduleId,
				{
					'arapprop': true,
					'istrade': true,
					'overdraftmny': true,
					'concertedmoney': true,
					'overdrafttype': true,
					'isaccounting': true,
				});
				// 设置字段的默认值
				props.form.setFormItemsValue(moduleId, 
				{
					'arapprop':{value:null},
					'overdraftmny':{value:0},
					'concertedmoney':{value:null},
					'isaccounting':{value:null},
					'overdrafttype':{value:null}
				});
			}
			// 3=通知
			else if(acctype == 3){
				props.form.setFormItemsDisabled(moduleId,
				{
					'arapprop': true,
					'istrade': true,
					'overdraftmny': true,
					'concertedmoney': true,
					'overdrafttype': true,
					'isaccounting': true,
				});
				// 设置字段的默认值
				props.form.setFormItemsValue(moduleId, 
				{
					'arapprop':{value:null},
					'overdraftmny':{value:0},
					'concertedmoney':{value:null},
					'isaccounting':{value:null},
					'overdrafttype':{value:null}
				});
			}
			// 4=贷款，
			else if(acctype == 4){
				props.form.setFormItemsDisabled(moduleId,
				{
					'arapprop': true,
					'istrade': true,
					'overdraftmny': true,
					'concertedmoney': true,
					'overdrafttype': true,
					'isaccounting': true,
				});
				// 设置字段的默认值
				props.form.setFormItemsValue(moduleId, 
				{
					'arapprop':{value:null},
					'overdraftmny':{value:0},
					'concertedmoney':{value:null},
					'isaccounting':{value:null},
					'overdrafttype':{value:null}
				});
			}
			// 7=票据，
			else if(acctype == 7){
				props.form.setFormItemsDisabled(moduleId,
				{
					'arapprop': true,
					'istrade': true,
					'overdraftmny': true,
					'concertedmoney': true,
					'overdrafttype': true,
					'isaccounting': true,
				});
				// 设置字段的默认值
				props.form.setFormItemsValue(moduleId, 
				{
					'arapprop':{value:null},
					'overdraftmny':{value:0},
					'concertedmoney':{value:null},
					'isaccounting':{value:null},
					'overdrafttype':{value:null}
				});
			}else{
				props.form.setFormItemsDisabled(moduleId,
				{
					'arapprop': false ,
					'overdraftmny': false,
					'concertedmoney': true,
					'isaccounting': false,
					'istrade': false,
					'overdrafttype': false,
				});
				// 设置字段的默认值
				props.form.setFormItemsValue(moduleId, 
				{
					'arapprop':{value:null},
					'overdraftmny':{value:0},
					'concertedmoney':{value:null},
					'isaccounting':{value:null}
				});
			}
		}
	}
	//编辑后----->透支控制方式
	if (key === 'overdrafttype') {
		let overtype = value.value;
		//当透支方式为空时，透支额度不允许编辑，并设置默认值为零 
		if(overtype === '1'){
			props.form.setFormItemsDisabled(moduleId, { 'overdraftmny': false});
		}else{
			let overdrafttypeAfterData = props.createFormAfterEventData(card_page_id, card_from_id, moduleId, key, value);
			let newvalue = overdrafttypeAfterData.newvalue.value;
			let oldvalue = overdrafttypeAfterData.oldvalue.value;
			if(newvalue != oldvalue){
				ajax({
					url: '/nccloud/tmpub/tmbd/accidafterevent.do',
					data: overdrafttypeAfterData,
					async: false,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if(data){
								props.form.setAllFormValue({ [card_from_id]: data[card_from_id] });
								props.form.setFormItemsDisabled(moduleId, { 'overdraftmny': true});
							}
						}
					}
				});
				// props.form.setFormItemsDisabled(moduleId, { 'overdraftmny': true});
			}
		}
	}
	if (key === 'yearbeginymny' || key === 'incomeymny' || key === 'outymny'|| key =='pk_currtype' ) {
		let overtype = value.value;
		let orgAfterData = props.createFormAfterEventData(card_page_id, card_from_id, moduleId, key, value);
		let newvalue = orgAfterData.newvalue.value;
		let oldvalue = orgAfterData.oldvalue.value;
		if(newvalue && newvalue != oldvalue){
			ajax({
				url: '/nccloud/tmpub/tmbd/accidafterevent.do',
				data: orgAfterData,
				async: false,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if(data){
							props.form.setAllFormValue({ [card_from_id]: data[card_from_id] });
						}
					}
				}
			});
		}
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/