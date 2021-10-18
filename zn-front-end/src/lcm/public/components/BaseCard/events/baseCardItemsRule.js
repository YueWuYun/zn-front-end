/**
 * 卡片编辑后事件处理
 */
import * as card from '../../../container/card';
let MAP = null; // 相互影响字段映射数组

/**
 * @param {String} areacode - 区域编码
 * @param {String} key - 当前操作的key
 * @param {Object} data - 上次处理过后最新的data
 */

export async function baseCardItemsRule(areacode, key, data, index) {
	await function() {
		// 抽取 相互影响字段映射数组
		if (!MAP) MAP = ruleHandle.call(this);
	}.call(this);
	// 数据设置 并取设值之后的最新值
	let { cardData, newValue, oldValue } = await handleValueSet.call(this, areacode, key, data, index);
	// 将编辑后的data存储
	this.cardData = cardData;

	// meta重置
	await card.metaReset.call(this);

	// 按钮显隐
	await function() {
		// 按钮显示 规则
		this.buttonVisible.call(this, true);
		// 多子表页签规则
		this.tableTabsRule.call(this, areacode, newValue, oldValue, cardData);
	}.call(this);

	// 编辑性设置
	await disableItemsSet.call(this, cardData);
	// 必输性设置
	await requiredItemsSet.call(this, cardData);
}

/*************************** 数据赋值设置 *************************************/

async function handleValueSet(areacode, initKey, cardData, index) {
	let { cardRule } = handleItemsRule.call(this);
	let { FormConfig, TabsConfig, TableConfig, form: formUtil, cardTable: cardTableUtil } = this.props;
	let newValue = {};
	let oldValue = {};
	let oldCardData = JSON.parse(JSON.stringify(cardData));

	/**
   * 核心数据处理函数
   * @param {String} key 受到影响的key
   * @param {Object} areacode 该key所在的区域
   */
	async function dataHandle(key, areacode) {
		if (!newValue[areacode]) {
			newValue[areacode] = {};
		}
		if (!oldValue[areacode]) {
			oldValue[areacode] = {};
		}

		newValue[areacode][key] = cardData.newvalue || {
			display: null,
			value: null
		};
		oldValue[areacode][key] = cardData.oldvalue || {
			display: null,
			value: null
		};

		if (!cardRule[areacode] || !cardRule[areacode][key]) {
			// 如果未定义当前字段规则处理 执行影响下游字段的事件处理函数
			await nextHandle.call(this, key, areacode);
		} else {
			// 主表数据
			let formDataValues = cardData.card.head[FormConfig.formId].rows[0].values;
			// 子表数据
			let tableDataValues = cardData.card.bodys;

			// 上游字段、字段取值、字段必输、字段禁用、编辑后事件请求处理函数
			let { advanceKeys, value, after, exception } = cardRule[areacode][key];
			// 上游字段数据
			let advanceKeysData = getAdvanceObj.call(this, advanceKeys, areacode, cardData, index);

			// 本次操作取值 value
			// 字段取值规则
			if (value !== undefined) {
				// value函数有定义
				value = value.call(this, advanceKeysData, newValue, oldValue, index);
			}
			// 如果value无正确返回值 但newvalue中该值存在 进行赋值
			if (!value && newValue[areacode][key].value && typeof newValue[areacode][key].value === 'string') {
				// 如果有新值
				value = {
					display: newValue[areacode][key].display || newValue[areacode][key].value,
					value: newValue[areacode][key].value
				};
				if (newValue[areacode][key].scale) {
					value.scale = newValue[areacode][key].scale;
				}
			}

			// 本次操作给主子表对应字段赋值
			if (areacode === FormConfig.formId) {
				// 如果是form区域的字段
				// 设置该字段是否必输
				if (value !== undefined) {
					formDataValues[key] = value;
					if (newValue[areacode][key]) {
						newValue[areacode][key].value = value.value || null;
						newValue[areacode][key].display = value.display || value.value || null;
						newValue[areacode][key].scale = value.scale || null;
					} else {
						newValue[areacode][key] = value;
					}
				}
			} else if (
				tableDataValues &&
				JSON.stringify(tableDataValues) !== '{}' &&
				TabsConfig &&
				TabsConfig.tabOrder.includes(areacode)
			) {
				// 如果是table区域的字段
				if (index === undefined) {
					// 如果index未定义，则为主表操作
					if (value !== undefined) {
						tableDataValues[areacode].rows.map((item, index) => {
							item.values[key] = value;
						});
					}
				} else {
					if (value !== undefined) {
						tableDataValues[areacode].rows[index].values[key] = value;
						//如果值有变化，给newvalue设置最新值
						if(cardData.newvalue.value != value.value){
							cardData.newvalue.value = value.value;
						}
					}
				}
      }
      /*** wangdengk编辑后事件增加异常处理事件 后台处理异常 需要处理字段的值 暂未考虑子表情况*/
      let resFlag = true;
			// 判断是否走编辑后事件
			await function() {
				// 默认返回类型为true
				if (after && checkNewValue.call(this, areacode, key, cardData, oldValue, index)) {
					// 如果该函数有定义 且对值进行了设置 则需要发送编辑后事件请求
					card.getAfterEventRes
						.call(this, cardData)
						.then((res) => {
							// 返回请求后的最新data
							cardData = after.call(this, cardData);
							// 执行编辑后事件请求成功后的处理函数
							cardData.card = res.data;
							resFlag = true;
						})
						.catch((res) => {
							// 后端返回异常的时候，处理函数 
							if (exception) {
								resFlag = false;
                exception = exception.call(this, cardData);
                formDataValues[key] = exception;
							}
						});
				}
      }.call(this);
      // 存在异常 返回不执行后续动作
			if (!resFlag) {
				return;
			}
			// 执行影响下游字段的事件处理函数
			await nextHandle.call(this, key, areacode);
		}
	}

	/**
   * 下游字段更新处理函数
   */
	async function nextHandle(key, areacode) {
		// 判断是否需要更新下游字段
		if (MAP[areacode] && MAP[areacode][key]) {
			// 如果当前key值的改变会影响下游字段 执行相应字段的更新
			for (let area in MAP[areacode][key]) {
				// 遍历该字段所影响每个区域的字段并执行更新
				for (let item of MAP[areacode][key][area]) {
					// 更新cardData的参数
					cardData = updateCardData.call(this, area, item, cardData, oldCardData);
					await dataHandle.call(this, item, area);
				}
			}
		}
	}

	/**
   * 更新cardData数据函数
   */
	function updateCardData(areacode, key, cardData, oldCardData) {
		// 更新cardData的参数
		cardData.newvalue = getOldAndNewValues.call(this, areacode, key, cardData, oldCardData).newValue[areacode][key];
		cardData.oldvalue = getOldAndNewValues.call(this, areacode, key, cardData, oldCardData).oldValue[areacode][key];
		cardData.attrcode = key;
		cardData.areacode = areacode;
		return cardData;
	}

	/**
   * 获取新旧values
   */
	function getOldAndNewValues(areacode, key, cardData, oldCardData) {
		if (!newValue[areacode]) {
			newValue[areacode] = {};
		}
		if (!oldValue[areacode]) {
			oldValue[areacode] = {};
		}

		// 主表数据
		let formDataValues = cardData.card.head[FormConfig.formId].rows[0].values;
		// 子表数据
		let tableDataValues = cardData.card.bodys;
		// 旧主表数据
		let oldFormDataValues = oldCardData.card.head[FormConfig.formId].rows[0].values;
		// 旧子表数据
		let oldTableDataValues = oldCardData.card.bodys;

		if (areacode === FormConfig.formId) {
			// 如果是form区域
			newValue[areacode][key] = formDataValues[key] || {
				display: null,
				value: null
			};
			oldValue[areacode][key] = oldFormDataValues[key] || {
				display: null,
				value: null
			};
		} else if (TabsConfig && TabsConfig.tabOrder && TabsConfig.tabOrder.includes(areacode)) {
			//   // 如果是table区域
			newValue[areacode][key] = (index !== undefined &&
				tableDataValues[areacode].rows[index] &&
				tableDataValues[areacode].rows[index].values[key]) || {
				display: null,
				value: null
			};
			oldValue[areacode][key] = (index !== undefined &&
				oldTableDataValues[areacode].rows[index] &&
				oldTableDataValues[areacode].rows[index].values[key]) || {
				display: null,
				value: null
			};
		}

		return { newValue, oldValue };
	}

	// 执行数据设置函数
	await dataHandle.call(this, initKey, areacode);
	// form数据设置
	let formData = cardData.card.head[FormConfig.formId] || null;
	formUtil.setAllFormValue({
		[FormConfig.formId]: formData
	});

	// table数据设置
	if (TableConfig && TableConfig.tableCode && cardData.card.bodys) {
		// table全部数据
		let tableData = cardData.card.bodys;

		let curTabKey = cardTableUtil.getCurTabKey();
		if (TabsConfig.tabOrder.includes(areacode)) {
			// 如果是子表编辑后事件
			cardTableUtil.setTabData(areacode, tableData[areacode] || { rows: [] });
		} else {
			// 设置整个子表数据值;
			cardTableUtil.setAllTabsData(
				tableData,
				TabsConfig.tabOrder,
				() => {
					cardTableUtil.setCurrTabKey(curTabKey);
				},
				TabsConfig.tabOrder
			);
		}
	}
	return { cardData, newValue, oldValue };
}

/**
 * 规则配置数据处理 （相互影响字段映射数组抽取）
 */
function ruleHandle() {
	if (!MAP) MAP = {};
	let { FormConfig } = this.props;
	let { cardRule } = handleItemsRule.call(this);
	for (let areacode in cardRule) {
		// 设置MAP相应区域为空对象
		// MAP[areacode] = {};
		// 所遍历的cardRule的当前area 是对象
		const area = cardRule[areacode];
		for (const key in area) {
			// 当前所遍历的字段 即受影响字段
			const element = area[key];
			if (element.advanceKeys) {
				// 上游字段所属区域
				let _areacodes;
				// 上游字段的keys
				let _keys;
				if (element.advanceKeys instanceof Array) {
					// 如果上游字段为数组，则默认上游字段所属区域为form区域
					_areacodes = [ FormConfig.formId ];
					_keys = element.advanceKeys;
				} else if (element.advanceKeys instanceof Object) {
					// 如果上游字段为对象
					_areacodes = Object.keys(element.advanceKeys);
				} else if (element.advanceKeys instanceof String) {
					// 如果上游字段为字符串，则默认上游字段所属区域为form区域
					_areacodes = [ FormConfig.formId ];
					_keys = [ element.advanceKeys ];
				}
				_areacodes.map((_areacode) => {
					if (!MAP[_areacode]) {
						MAP[_areacode] = {};
					}

					if (_keys !== undefined) {
						// 如果上游keys有定义
						_keys.map((_key) => {
							if (!MAP[_areacode][_key]) {
								MAP[_areacode][_key] = {};
							}
							if (!MAP[_areacode][_key][areacode]) {
								MAP[_areacode][_key][areacode] = [];
							}
							MAP[_areacode][_key][areacode].push(key);
						});
					} else {
						_keys = element.advanceKeys[_areacode];
						if (typeof _keys === 'string') {
							_keys = [ _keys ];
						}
						_keys.map((_key) => {
							if (!MAP[_areacode][_key]) {
								MAP[_areacode][_key] = {};
							}
							if (!MAP[_areacode][_key][areacode]) {
								MAP[_areacode][_key][areacode] = [];
							}
							MAP[_areacode][_key][areacode].push(key);
						});
					}
				});
			}
		}
	}
	return MAP;
}

/**
 * 检查某字段是否变化
 */
function checkNewValue(areacode, key, cardData) {
	//   let { FormConfig, TabsConfig } = this.props;
	let newVal, oldVal;
	newVal = cardData.newvalue && cardData.newvalue.value;
	oldVal = cardData.oldvalue && cardData.oldvalue.value;
	//   if (newVal !== oldVal) {
	if (Boolean(newVal) && Boolean(oldVal)) {
		// 如果newVal 和 oldVal 都为非null 或 非undefined 或非空字符
		if (newVal !== oldVal) {
			return true;
		} else {
			return false;
		}
	} else if (!Boolean(newVal)) {
		// 如果新值为null 空字符串 或undefined 不走编辑后事件
		return false;
	} else if (!Boolean(oldVal) && Boolean(newVal)) {
		// 如果旧值为null 空字符串 或undefined 但newVal存在 则发生了改变
		return true;
	} else {
		return false;
	}
}

/*************************** 字段编辑性设置 *************************************/
/**
 * 字段编辑性设置
 * @param {Object} cardData - 整单数据
 * @param {Object} config - 配置参数 {form: true, table: true } 执行对应规则
 * @param {Number} index - 开始设置数据的索引 非必输
 */
export function disableItemsSet(cardData, config = { form: true, table: true }, index) {
	// form区域字段编辑性设置
	config && config.form && formDisabledSet.call(this, cardData);
	// table区域字段编辑性设置
	config && config.table && tableDisabledSet.call(this, cardData, index);
}

/**
 * form区域字段编辑性设置
 * @param {Object} cardData - 整单数据
 */
export function formDisabledSet(cardData) {
	let status = this.props.getUrlParam('status');
	if (!status || status === 'browse') return;
	let { formDisabledRule } = handleItemsRule.call(this);
	if (!cardData || !formDisabledRule) return;
	let { FormConfig, form: formUtil } = this.props;

	let formDisabledItems = {};
	for (let item of formDisabledRule) {
		let { key, advanceKeys, rule } = item;
		let isDisabled;
		if (rule !== undefined) {
			// 如果定义了规则
			// 转换advanceKeys为指定格式
			advanceKeys = exchangeAdvanceKeys.call(this, advanceKeys, FormConfig.formId);
			let advanceObj = getAdvanceObj.call(this, advanceKeys, FormConfig.formId, cardData);

			if (rule instanceof Function) {
				// 如果rule为函数
				isDisabled = Boolean(rule.call(this, advanceObj));
			} else if (rule instanceof Boolean) {
				// 如果rule为布尔值
				isDisabled = rule;
			} else {
				isDisabled = Boolean(rule);
			}
			formDisabledItems[key] = isDisabled;
		}
	}

	// 设置主表某些字段是否禁用
	formUtil.setFormItemsDisabled([ FormConfig.formId ], formDisabledItems);
}
/**
 * table区域字段编辑性设置
 * @param {Object} cardData - 整单数据
 * @param {Number} index - 开始设置数据的索引 非必输
 */
export function tableDisabledSet(cardData, index) {
	let status = this.props.getUrlParam('status');
	if (!status || status === 'browse') return;
	let { tableDisabledRule } = handleItemsRule.call(this);
	if (!cardData || !tableDisabledRule) return;
	let { TabsConfig, TableConfig, cardTable: tableUtil } = this.props;
	if (!(TabsConfig && TabsConfig.tabOrder)) {
		// 如果未定义子表
		console.warn('your TabsConfig is wrong!');
		return;
	}

	let tableDisabledItems = {};
	for (let area in tableDisabledRule) {
		tableDisabledItems[area] = {};
		// 当前区域数据
		let tableValues = tableUtil.getTabData(area).rows;
		let areaRule = tableDisabledRule[area];
		areaRule &&
			areaRule.map((item) => {
				let { key, advanceKeys, rule } = item;
				let advanceObj = {};
				if (advanceKeys !== undefined) {
					// 转换advanceKeys为指定格式
					advanceKeys = exchangeAdvanceKeys.call(this, advanceKeys, area);
				}
				if (rule !== undefined) {
					tableDisabledItems[area][key] = {};
					tableValues &&
						tableValues.map((record, i) => {
							let isDisabled;
							if ((index !== undefined && i >= index) || index === undefined) {
								// 如果规定了开始设置数据的索引并且当前数据是开始索引及之后 或 index未定义
								advanceObj = getAdvanceObj.call(this, advanceKeys, area, cardData, i);
								if (rule instanceof Function) {
									// 如果rule为函数
									isDisabled = Boolean(rule.call(this, advanceObj, i));
								} else if (rule instanceof Boolean) {
									// 如果rule为布尔值
									isDisabled = rule;
								} else {
									isDisabled = Boolean(rule);
								}
								tableDisabledItems[area][key][i] = isDisabled;
							}
						});
				}
			});
	}

	let { disabled, enabled } = exchangeDisabledItems(tableDisabledItems);

	// 当前活动页签
	let area = tableUtil.getCurTabKey();
	for (let index in disabled[area]) {
		let keys = disabled[area][index];
		tableUtil.setEditableByIndex(TableConfig.tableCode, index, keys, false);
	}
	for (let index in enabled[area]) {
		let keys = enabled[area][index];
		tableUtil.setEditableByIndex(TableConfig.tableCode, index, keys, true);
	}
}
/**
 * 转换table区域的disabledItems格式
 * @param {Object} disabledItems - 转换前禁用字段集合
 */
function exchangeDisabledItems(disabledItems) {
	let disabled = {}; // 子表禁用项
	let enabled = {}; // 子表启用项
	for (let area in disabledItems) {
		disabled[area] = {};
		enabled[area] = {};
		for (let key in disabledItems[area]) {
			for (let index in disabledItems[area][key]) {
				if (!disabled[area][index]) {
					disabled[area][index] = [];
				}
				if (!enabled[area][index]) {
					enabled[area][index] = [];
				}
				if (disabledItems[area][key][index]) {
					// 如果该index下key的disabled为true
					disabled[area][index].push(key);
				} else {
					enabled[area][index].push(key);
				}
			}
		}
	}
	return { disabled, enabled };
}

/*************************** 字段必输性设置 *************************************/

/**
 * 字段必输性设置
 * @param {Object} cardData - 整单数据
 * @param {Object} config - 配置参数 {form: true, table: true } 执行对应规则
 * @param {Number} index - 开始设置数据的索引 非必输
 */
export function requiredItemsSet(cardData, config = { form: true, table: true }, index) {
	// form区域字段必输性设置
	config && config.form && formReruiredSet.call(this, cardData);
	// table区域字段必输性设置
	config && config.table && tableRequiredSet.call(this, cardData, index);
}

/**
 * form区域字段必输性设置
 * @param {Object} cardData - 整单数据
 */
export function formReruiredSet(cardData) {
	let status = this.props.getUrlParam('status');
	if (!status || status === 'browse') return;
	let { formRequiredRule } = handleItemsRule.call(this);
	if (!cardData || !formRequiredRule) return;
	let { FormConfig, form: formUtil } = this.props;

	let formRequiredItems = {};
	for (let item of formRequiredRule) {
		let { key, advanceKeys, rule } = item;
		let isRequired;
		let advanceObj = {};
		if (advanceKeys !== undefined) {
			// 转换advanceKeys为指定格式
			advanceKeys = exchangeAdvanceKeys.call(this, advanceKeys, FormConfig.formId);
			advanceObj = getAdvanceObj.call(this, advanceKeys, FormConfig.formId, cardData);
		}
		if (rule !== undefined) {
			// 如果定义了规则
			if (rule instanceof Function) {
				// 如果rule为函数
				isRequired = Boolean(rule.call(this, advanceObj));
			} else if (rule instanceof Boolean) {
				// 如果rule为布尔值
				isRequired = rule;
			} else {
				isRequired = Boolean(rule);
			}
			formRequiredItems[key] = isRequired;
		}
	}

	// 设置主表某些字段是否禁用
	formUtil.setFormItemsRequired([ FormConfig.formId ], formRequiredItems);
}

/**
 * table区域字段必输性设置
 * @param {Object} cardData - 整单数据
 * @param {Number} index - 开始设置数据的索引 非必输
 */
export function tableRequiredSet(cardData, index) {
	let status = this.props.getUrlParam('status');
	if (!status || status === 'browse') return;
	let { tableRequiredRule } = handleItemsRule.call(this);
	if (!cardData || !tableRequiredRule) return;
	let { TabsConfig, TableConfig, cardTable: tableUtil } = this.props;
	if (!(TabsConfig && TabsConfig.tabOrder)) {
		// 如果未定义子表
		console.warn('your TabsConfig is wrong!');
		return;
	}

	let tableRequiredItems = {};
	for (let area in tableRequiredRule) {
		tableRequiredItems[area] = {};
		// 当前区域数据
		let tableValues = tableUtil.getTabData(area).rows;
		let areaRule = tableRequiredRule[area];
		areaRule &&
			areaRule.map((item) => {
				let { key, advanceKeys, rule } = item;
				let advanceObj = {};
				if (advanceKeys !== undefined) {
					// 转换advanceKeys为指定格式
					advanceKeys = exchangeAdvanceKeys.call(this, advanceKeys, area);
				}
				if (rule !== undefined) {
					tableValues &&
						tableValues.map((record, i) => {
							let isRequired;
							if ((index !== undefined && i >= index) || index === undefined) {
								// 如果规定了开始设置数据的索引并且当前数据是开始索引及之后 或 index未定义
								advanceObj = getAdvanceObj.call(this, advanceKeys, area, cardData, i);
								if (rule instanceof Function) {
									// 如果rule为函数
									isRequired = Boolean(rule.call(this, advanceObj, i));
								} else if (rule instanceof Boolean) {
									// 如果rule为布尔值
									isRequired = rule;
								} else {
									isRequired = Boolean(rule);
								}
								tableRequiredItems[area][key] = isRequired;
							}
						});
				}
			});
			setTableValueRequired.call(this, area, tableRequiredItems[area]);
	}
}

/*************************** form和table区域规则抽取 *************************************/

/**
 * form和table区域规则抽取
 */
function handleItemsRule() {
	let { FormConfig } = this.props;
	// 获取字段规则
	let { formItemsRule, tableItemsRule } = this.props._itemsRule;
	// 初始化卡片字段规则为空对象
	let cardRule = {};
	let formDisabledRule;
	let formRequiredRule;
	let formValueSetRule;
	let tableDisabledRule;
	let tableRequiredRule;
	let tableValueSetRule;
	if (formItemsRule instanceof Function) {
		// 如果form规则有定义
		let formRule = formItemsRule.call(this);
		if (formRule) {
			cardRule = { ...cardRule, [FormConfig.formId]: formRule };
			if (!formDisabledRule) {
				formDisabledRule = [];
			}
			if (!formRequiredRule) {
				formRequiredRule = [];
			}
			if (!formValueSetRule) {
				formValueSetRule = [];
			}
			Object.keys(formRule).map((key) => {
				// 设置form禁用规则
				formDisabledRule.push({
					key: key,
					advanceKeys: formRule[key].advanceKeys,
					rule: formRule[key].isDisabled
				});

				// 设置form必输规则
				formRequiredRule.push({
					key: key,
					advanceKeys: formRule[key].advanceKeys,
					rule: formRule[key].isRequired
				});

				// 设置form设值规则
				formValueSetRule.push({
					key: key,
					advanceKeys: formRule[key].advanceKeys,
					rule: formRule[key].value,
					after: formRule[key].after
				});
			});
		}
	}

	if (tableItemsRule instanceof Function) {
		// 如果table规则有定义
		let tableRule = tableItemsRule.call(this);
		if (tableRule) {
			// 如果tableRule存在

			cardRule = { ...cardRule, ...tableRule };

			if (!tableDisabledRule) {
				tableDisabledRule = {};
			}

			if (!tableRequiredRule) {
				tableRequiredRule = {};
			}

			// 设置table设值规则
			if (!tableValueSetRule) {
				tableValueSetRule = {};
			}
			Object.keys(tableRule).map((areacode) => {
				if (!tableDisabledRule[areacode]) {
					tableDisabledRule[areacode] = [];
				}
				if (!tableRequiredRule[areacode]) {
					tableRequiredRule[areacode] = [];
				}
				if (!tableValueSetRule[areacode]) {
					tableValueSetRule[areacode] = [];
				}
				Object.keys(tableRule[areacode]).map((key) => {
					// 设置table禁用规则
					tableDisabledRule[areacode].push({
						key: key,
						advanceKeys: tableRule[areacode][key].advanceKeys,
						rule: tableRule[areacode][key].isDisabled
					});
					// 设置table必输规则
					tableRequiredRule[areacode].push({
						key: key,
						advanceKeys: tableRule[areacode][key].advanceKeys,
						rule: tableRule[areacode][key].isRequired
					});

					tableValueSetRule[areacode].push({
						key: key,
						advanceKeys: tableRule[areacode][key].advanceKeys,
						rule: tableRule[areacode][key].value,
						after: tableRule[areacode][key].after
					});
				});
			});
		}
	}
	return {
		cardRule,
		formDisabledRule,
		formRequiredRule,
		formValueSetRule,
		tableDisabledRule,
		tableRequiredRule,
		tableValueSetRule
	};
}

/**
 * 转换acvanceKeys为特定格式
 * @param {*} advanceKeys - 待转换的advanceKeys
 * @param {String} areacode - 当前要转换字段所在区域
 */
function exchangeAdvanceKeys(advanceKeys, areacode) {
	let { FormConfig, form: formUtil } = this.props;

	let result = {};
	if (!areacode) {
		// 如果areacode无 默认为formId
		areacode = FormConfig.formId;
	}
	if (advanceKeys instanceof Array) {
		// 如果是数组
		result[areacode] = advanceKeys;
	} else if (advanceKeys instanceof String) {
		// 如果是字符串
		advanceKeys = [ advanceKeys ];
		result[areacode] = advanceKeys;
	} else if (advanceKeys instanceof Object) {
		// 如果是对象
		for (let area in advanceKeys) {
			if (advanceKeys[area] instanceof Array) {
				// 如果是数组
				result[area] = advanceKeys[area];
			} else if (advanceKeys[area] instanceof String) {
				// 如果是字符串
				result[area] = [ advanceKeys[area] ];
			} else {
				result[area] = [];
			}
		}
	} else {
		return result;
	}
	return result;
}

/**
 * 获取上游字段值
 * @param {Object} advanceKeys - 上游字段集合 必输
 * @param {String} tempArea - 当前key所在区域 必输
 * @param {Object} cardData - card整单数据 必输
 * @param {Number} index - 当前操作子表数据索引 非必输
 *
 */
function getAdvanceObj(advanceKeys, tempArea, cardData, index) {
	let { FormConfig, form: formUtil, TabsConfig, cardTable: cardTableUtil } = this.props;
	let advanceKeysData = {};
	if (advanceKeys !== undefined) {
		// 如果定义了advanceKeys
		// 是否跨区域
		let isDiffArea = false;
		for (let areacode in advanceKeys) {
			if (!advanceKeysData[areacode]) {
				advanceKeysData[areacode] = {};
			}
			// 主表所有数据
			let formValues = cardData.card.head[FormConfig.formId].rows[0].values;

			if (areacode === FormConfig.formId) {
				// 如果上游字段所属区域是form
				for (let key of advanceKeys[areacode]) {
					// 遍历每一个上游字段区域
					advanceKeysData[areacode][key] = formValues[key];
				}
			} else if (TabsConfig && TabsConfig.tabOrder && TabsConfig.tabOrder.includes(areacode)) {
				// 判断当前字段所在区域与上游字段所在区域是否一致
				isDiffArea = tempArea !== areacode;

				// 子表数据
				let tableDataValues = cardData.card.bodys;
				// 当前table区域数据
				let tableValues = tableDataValues[areacode] || null;
				if (index !== undefined) {
					// 如果index有定义，即操作特定某一行数据
					if (isDiffArea) {
						// 如果是跨区域取值 取上游区域该key所有值
						for (let key of advanceKeys[areacode]) {
							advanceKeysData[areacode][key] = tableValues
								? tableValues.rows.map((item) => item.values[key])
								: null;
						}
					} else {
						// 如果不是跨区域 取当前操作字段所在行数据
						advanceKeysData[areacode] = tableValues.rows[index];
					}
				} else {
					// 如果index未定义 则当前操作字段在form区域 为跨区域取值
					for (let key of advanceKeys[areacode]) {
						advanceKeysData[areacode][key] = tableValues
							? tableValues.rows.map((item) => item.values[key])
							: null;
					}
				}
			} else {
				// 该区域编码不存在于header和bodys中
				console.log(`请确认该字段${key}的上游字段所属区域编码${_areacode}是否正确`);
			}
		}
	} else {
		// 如果未定义advanceKeys
		if (tempArea === FormConfig.formId) {
			// 如果是form区域
			// 主表所有数据
			let formValues = cardData.card.head[FormConfig.formId].rows[0].values;
			advanceKeysData[tempArea] = formValues;
		} else if (TabsConfig && TabsConfig.tabOrder && TabsConfig.tabOrder.includes(tempArea)) {
			// 如果是table区域
			// 当前table区域数据
			// 子表数据
			let tableDataValues = cardData.card.bodys;
			let tableValues = tableDataValues[tempArea] || null;
			advanceKeysData[tempArea] = tableValues.rows[index];
		}
	}

	return advanceKeysData;
}


/**
 * 通过key设置列是否必输
 * @param {*} tableId 表格id
 * @param {*} requiredObj  必输项的 key - value 对象
 */
function setTableValueRequired(tableId, requiredObj) {
	let {meta: metaUtil} = this.props;
	let metaData = metaUtil.getMeta();
  if (metaData) {
    metaData[tableId].items.map(function (elem) {
      if (elem.attrcode in requiredObj) {
        elem.required = !!requiredObj[elem.attrcode];
      }
		});
		metaUtil.setMeta(metaData);
  }
}
