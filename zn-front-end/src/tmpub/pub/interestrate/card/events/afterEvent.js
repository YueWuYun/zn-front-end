/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/
import { promptBox, toast } from 'nc-lightapp-front';
import { clearAll, initForm } from './page';
import { CARD } from '../../cons/constant';
export function afterEvent(props, moduleId, key, value, oldValue) {
	let status = props.getUrlParam('status');
	let currentTabKey = props.cardTable.getCurTabKey();
	//console.log(key, value, oldValue);
	setItemDisabledFn(props, key, value.value); //设置字段编辑性
	if (key === 'pk_org') {
		//所属组织
		props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
		if (value.value && oldValue.value) {
			promptBox({
				color: 'warning',
				title: this.state.json['36010IR-000000'] /* 国际化处理： 确认修改*/,
				content: this.state.json['36010IR-000001'] /* 国际化处理： 是否修改组织，这样会清空您录入的信息？*/,
				beSureBtnClick: () => {
					clearAll.call(this, props);
					initForm.call(this, status);
					props.form.setFormItemsValue(CARD.form_id, { pk_org: value }); //清空表单后赋值所属组织
					props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
				}
			});
		}
	} else if (key === 'ratetype') {
		//利率类型
		if (value.value !== oldValue.value) {
			clearInterest(props); //清空利率内容
			clearBodyData(props);
			toggleBodyBtnDisabled(props, false);
			//融资利率时可以编辑融资利率类型
			if (value.value !== 'LRATE') {
				props.form.setFormItemsValue(CARD.form_id, {
					finance_rate_type: { display: this.state.json['36010IR-000002'], value: '1' }
				}); /* 国际化处理： 基准利率*/
			} else {
				props.form.setFormItemsDisabled(CARD.form_id, {
					begindays: true,
					beginamount: true,
					yoverrate: true,
					moverrate: true,
					overrate: true
				});
			}
		}
	} else if (key === 'finance_rate_type') {
		//融资利率类型
	} else if ([ 'rationflag', 'headflag', 'overdueflag' ].includes(key)) {
		//启用定额/逾期/提前利率
		let intObj = {
			rationflag: 'rationrate',
			headflag: 'advancerate',
			overdueflag: 'overduerate'
		};
		if (!value.value) {
			for (let k in intObj) {
				if (k === key) {
					props.cardTable.setTabData(currentTabKey, { rows: [] });
				}
			}
		} else {
			if (key === 'rationflag') {
				clearInterest(props); //清空利率内容
			} else if (key === 'overdueflag') {
				clearInterest(props, 'over'); //清空透支利率内容
			}
		}
		if (currentTabKey === intObj[key]) {
			toggleBodyBtnDisabled(props, value.value);
		}
	} else if ([ 'yrate', 'mrate', 'rate' ].includes(key)) {
		//年/月/日利率
		if (value.value) {
			const rateObj = {
				yrate: 'yrate',
				mrate: 'mrate',
				rate: 'rate'
			};
			setInterestrateVal.call(this, props, key, value, rateObj);
		}
	} else if ([ 'yoverrate', 'moverrate', 'overrate' ].includes(key)) {
		//年/月/日利率
		if (value.value) {
			const rateObj = {
				yoverrate: 'yrate',
				moverrate: 'mrate',
				overrate: 'rate'
			};
			setInterestrateVal.call(this, props, key, value, rateObj);
		}
	}
}

/* 
	年月日利率相互计算
	day:日利率天数
	type:年/月/日利率
*/
export function calInterestrate(props, day, type, val) {
	let paraInt = props.getUrlParam('paraInt');
	if (val === 'undefined' || val === null) return false;
	day = day || 360;
	let value = typeof val === 'string' ? val : val.value;
	let result = {
		yrate: 0,
		mrate: 0,
		rate: 0,
		flag: true
	};
	if (value === '') return { yrate: '', mrate: '', rate: '' }; //清空利率返回空字符串
	let yearRate = other2yearRate(type, value);
	result['yrate'] = Number(yearRate).toFixed(Number(paraInt));
	result['mrate'] = Number(yearRate / 12 * 10).toFixed(Number(paraInt));
	result['rate'] = Number(yearRate / day * 10).toFixed(Number(paraInt));
	if (result['yrate'] > 100) {
		result.flag = false;
	}

	//转成年利率
	function other2yearRate(type, value) {
		if (type === 'mrate') {
			return value / 10 * 12;
		} else if (type === 'rate') {
			return value / 10 * day;
		} else {
			return value;
		}
	}
	//console.log(result);
	return result;
}

//设置年月日利率
function setInterestrateVal(props, key, val, items) {
	let paraInt = props.getUrlParam('paraInt');
	let dayofyear = props.form.getFormItemsValue(CARD.form_id, 'dayofyear');
	let rateAll = calInterestrate(props, dayofyear.value, items[key], val);
	if (!rateAll.flag) {
		toast({ color: 'warning', content: this.state.json['36010IR-000003'] }); /* 国际化处理： 年利率不能超过100!*/
		for (let k in items) {
			props.form.setFormItemsValue(CARD.form_id, { [k]: { value: '', scale: Number(paraInt) } });
		}
		return;
	}
	for (let k in items) {
		props.form.setFormItemsValue(CARD.form_id, { [k]: { value: rateAll[[ items[k] ]], scale: Number(paraInt) } });
	}
}

//设置利率复选框编辑性
function setInterestCheckboxStatus(props, rateType) {
	let editableObj = {
		CRATE: [ 'rationflag' ], //活期利率 -> 启用定额利率
		LRATE: [ 'headflag', 'overdueflag' ] //融资利率 -> 启用提前利率、启用逾期利率
	};
	for (let key in editableObj) {
		editableObj[key].map((item) => {
			if (key === rateType) {
				props.form.setFormItemsDisabled(CARD.form_id, { [item]: false });
			} else {
				props.form.setFormItemsDisabled(CARD.form_id, { [item]: true });
				props.form.setFormItemsValue(CARD.form_id, { [item]: { value: 0 } });
			}
		});
	}
}

//设置利率编辑性
function setInterestStatus(props, key, val) {
	const rateDisabled = [ 'yrate', 'mrate', 'rate' ];
	const overdrawDisabled = [ 'begindays', 'beginamount', 'overrate', 'yoverrate', 'moverrate' ];
	let disabledArr = overdrawDisabled;
	switch (key) {
		case 'ratetype': //利率类型
			if (val === 'CRATE' || val === 'LRATE') {
				//活期/贷款利率可以编辑利率
				[ ...rateDisabled, ...overdrawDisabled ].map((item) =>
					props.form.setFormItemsDisabled(CARD.form_id, { [item]: false })
				);
				rateDisabled.map((item) => props.form.setFormItemsRequired(CARD.form_id, { [item]: true }));
			} else {
				rateDisabled.map((item) => props.form.setFormItemsDisabled(CARD.form_id, { [item]: false }));
				overdrawDisabled.map((item) => props.form.setFormItemsDisabled(CARD.form_id, { [item]: true }));
			}
			break;
		case 'rationflag': //启用定额利率
			disabledArr = [ ...rateDisabled, ...overdrawDisabled ];
			disabledArr.map((item) => {
				props.form.setFormItemsDisabled(CARD.form_id, { [item]: val });
			});
			rateDisabled.map((item) => props.form.setFormItemsRequired(CARD.form_id, { [item]: !val })); //年月日利率必输性
			break;
		case 'overdueflag': //启用逾期利率
			disabledArr = overdrawDisabled;
			disabledArr.map((item) => {
				props.form.setFormItemsDisabled(CARD.form_id, { [item]: val });
			});
			rateDisabled.map((item) => props.form.setFormItemsRequired(CARD.form_id, { [item]: true }));
			break;
		default:
			rateDisabled.map((item) => props.form.setFormItemsRequired(CARD.form_id, { [item]: true }));
			break;
	}
}

//设置字段编辑性
export function setItemDisabledFn(props, key, value) {
	if (key === 'ratetype') {
		//利率类型
		setInterestCheckboxStatus(props, value);
		setInterestStatus(props, key, value);
		//融资利率时可以编辑融资利率类型
		if (value === 'LRATE') {
			props.form.setFormItemsDisabled(CARD.form_id, { finance_rate_type: false });
		} else {
			props.form.setFormItemsDisabled(CARD.form_id, { finance_rate_type: true });
		}
	} else if ([ 'rationflag', 'headflag', 'overdueflag' ].includes(key)) {
		setInterestStatus(props, key, value);
	}
}

//清空利率信息
function clearInterest(props, type = 'all') {
	const overArr = [ 'begindays', 'beginamount', 'overrate', 'yoverrate', 'moverrate' ];
	let interestItems = props.meta.getMeta()['interest'].items.map((item) => item.attrcode); //从模板中拿到利率信息字段
	if (type === 'over') interestItems = overArr;
	interestItems.map((item) => {
		props.form.setFormItemsValue(CARD.form_id, { [item]: { value: '' } });
	});
}

//清空表体数据
function clearBodyData(props) {
	let data = {};
	for (let item of CARD.tab_order) {
		data[item] = { rows: [] };
	}
	props.cardTable.setAllTabsData(data, CARD.tab_order);
}

//切换表体肩部按钮
export function toggleBodyBtnDisabled(props, status) {
	if (status) {
		props.button.setButtonDisabled([ 'addRow' ], false);
	} else {
		props.button.setButtonDisabled([ 'addRow', 'deleteRow' ], true);
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/