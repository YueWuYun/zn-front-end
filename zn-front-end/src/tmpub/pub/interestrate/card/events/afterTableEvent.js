/*yrJb1LOfoOHhNP+PrTGyMlwVz9IiLdIAQVSFAsP/e+S9VY37I34PlViIIKxjZsFV*/
import { toast } from 'nc-lightapp-front';
import { CARD } from '../../cons/constant';
import { calInterestrate } from './afterEvent';
export function afterTableEvent(props, moduleId, key, value, changedrows, index, record, type, method) {
	let curKey = CARD.tab_code;
	let oldValue = changedrows[0] && changedrows[0].oldvalue.value;
	let currentTabKey = props.cardTable.getCurTabKey();
	let currentItem = {
		props,
		moduleId,
		key,
		value,
		oldValue,
		index,
		record,
		type,
		method,
		state: this.state
	};
	//console.log('当前操作tab', currentTabKey);
	//console.log(moduleId, key, value, oldValue, index);
	if (key === 'endamount') {
		//终点金额
		if (currentTabKey === 'rationrate') {
			//定额利率页签
			clearRate.call(currentItem, props, {
				yrate: 'yrate',
				mrate: 'mrate',
				rate: 'rate'
			});
			checkEndamountVal.call(currentItem);
		}
	} else if (value && (key === 'yrate' || key === 'mrate' || key === 'rate')) {
		//年/月/日利率
		if (checkNormalRate.call(currentItem)) {
			setInterestrateVal.call(currentItem, props, {
				yrate: 'yrate',
				mrate: 'mrate',
				rate: 'rate'
			});
		}
	} else if (value && [ 'yoverrate', 'moverrate', 'overrate' ].includes(key)) {
		//透支年/月/日利率
		if (checkNormalRate.call(currentItem, 'over')) {
			setInterestrateVal.call(currentItem, props, {
				yoverrate: 'yrate',
				moverrate: 'mrate',
				overrate: 'rate'
			});
		}
	} else if (key === 'enddays') {
		//终点天数
		if (currentTabKey === 'overduerate') {
			//逾期利率页签
			checkEnddaysVal.call(currentItem);
		}
	}
}

//检查终点金额
function checkEndamountVal() {
	let endamountCol = this.props.cardTable.getTabColValue(this.moduleId, 'endamount'); //终点金额列数据
	let zeroIndex = endamountCol && endamountCol.map((item) => item.value).findIndex((item) => +item === 0);
	if (+this.value > 0) {
		if (zeroIndex === -1 || this.index < zeroIndex) {
			toast({ color: 'warning', content: `${this.state.json['36010IR-000007']}${this.index + 1}${this.state.json['36010IR-000070']}` }); // 定额利率表体第行的终点金额不能大于0
			this.props.cardTable.setValByKeyAndIndex(this.moduleId, this.index, this.key, { value: 0 });
			return;
		}
	}
	if (this.value !== '') {
		//最后一行可以为空
		ascColData.call(this, {
			begin: 'beginamount',
			end: 'endamount',
			content: `${this.state.json['36010IR-000007']}${this.index + 1}${this.state.json['36010IR-000009']}`// 定额利率表体第行的终点金额必须大于起点金额
		});
	}
}

//校验终点天数
function checkEnddaysVal() {
	ascColData.call(this, {
		begin: 'begindays',
		end: 'enddays',
		content: `${this.state.json['36010IR-000010']}${this.index + 1}${this.state.json['36010IR-000011']}` // 逾期利率表体第行的终点天数必须大于起点天数
	});
}

/**
 * 校验列数据必须是由小到大排列
 *
 * @param {*} begin - 起始字段
 * @param {*} end - 终止字段
 * @param {*} content - 提示信息
 */
function ascColData({ begin, end, content }) {
	let rowNums = this.props.cardTable.getNumberOfRows(this.moduleId); //总行数
	let beginVal = this.props.cardTable.getValByKeyAndIndex(this.moduleId, this.index, begin);
	let endCol = this.props.cardTable.getTabColValue(this.props.cardTable.getCurTabKey(), end);
	let endColData = endCol.map((item) => +item.value);
	let colSort = [ ...endColData ].sort((a, b) => a - b); //升序
	if ((rowNums > 1 && +this.value <= +beginVal.value) || JSON.stringify(endColData) !== JSON.stringify(colSort)) {
		//终点值必須大于起点值
		toast({ color: 'warning', content });
		this.props.cardTable.setValByKeyAndIndex(this.moduleId, this.index, this.key, { value: this.oldValue });
	} else if (rowNums - 1 != this.index) {
		//修改终点值需要一同修改下一行的起点值
		this.props.cardTable.setValByKeyAndIndex(this.moduleId, this.index + 1, begin, { value: this.value });
	}
}

//检测普通利率
function checkNormalRate(checkType = 'normal') {
	let valid = true;
	let currentTabKey = this.props.cardTable.getCurTabKey();
	let endamount =
		this.props.cardTable.getValByKeyAndIndex(this.moduleId, this.index, 'endamount') &&
		this.props.cardTable.getValByKeyAndIndex(this.moduleId, this.index, 'endamount').value;
	//检查年月日利率
	if (currentTabKey === 'rationrate') {
		if (checkType === 'normal') {
			if (endamount !== '' && endamount !== null && +endamount <= 0) {
				toast({ color: 'warning', content: this.state.json['36010IR-000005'] }); // 终点金额小于等于0时，不能输入普通利率
				this.props.cardTable.setValByKeyAndIndex(this.moduleId, this.index, this.key, { value: '' });
				valid = false;
			}
		} else if (checkType === 'over') {
			//检查透支年月日利率
			if (endamount === '' || +endamount > 0) {
				toast({ color: 'warning', content: this.state.json['36010IR-000006'] }); // 终点金额为空或大于0时，不能输入透支利率
				this.props.cardTable.setValByKeyAndIndex(this.moduleId, this.index, this.key, { value: '' });
				valid = false;
			}
		}
	}
	return valid;
}

//设置年月日利率
function setInterestrateVal(props, items) {
	let dayofyear = props.form.getFormItemsValue(CARD.form_id, 'dayofyear');
	let rateAll = calInterestrate(props, dayofyear.value, items[this.key], this.value);
	let paraInt = props.getUrlParam('paraInt');
	if (!rateAll.flag) {
		toast({ color: 'warning', content: this.state.json['36010IR-000003'] }); // 年利率不能超过100!
		for (let k in items) {
			props.cardTable.setValByKeyAndIndex(this.moduleId, this.index, k, { value: '' });
		}
		return;
	}
	for (let k in items) {
		props.cardTable.setValByKeyAndIndex(this.moduleId, this.index, k, {
			value: rateAll[[ items[k] ]],
			scale: Number(paraInt)
		});
	}
}

// 清空月日年利率
function clearRate(props, items) {
	for (let k in items) {
		props.cardTable.setValByKeyAndIndex(this.moduleId, this.index, k, { value: '' });
	}
}

/*yrJb1LOfoOHhNP+PrTGyMlwVz9IiLdIAQVSFAsP/e+S9VY37I34PlViIIKxjZsFV*/