import * as card from '../../../../public/container/card';
import { toast } from 'nc-lightapp-front';
/**
 * form区域字段规则
 */
export function formItemsRule() {
	let { BillConfig, TableConfig } = this.props;
	// 业务状态
	let status = this.props.getUrlParam('status');
	let id = this.props.getUrlParam('id');
	let isChange = id && status === 'change'; // 变更态
	let isExtension = status === 'extension'; // 展期态
	let isEdit = id && status === 'edit'; // 编辑态
	let isAdd = status === 'add'; // 新增态
	let isCopy = status === 'copy'; //  复制态
	return {
		// 财务组织
		pk_org: {
			isDisabled: true, // 编辑或变更或复制态 禁用
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData为主表所有数据 必须返回
				return newAfterData;
			}
		},
		// 合同编号
		contractcode:{
			isDisabled: isExtension, // 展期时 不可编辑
		},
		// 合同金额
		contractamount: {
			value: (advanceObj, newValue) => {
				// 取值函数
				// 返回值为Object
				// 手工编辑 需大于0
				if (newValue.header.contractamount.value <= 0) {
					// 如果输入的值为小于0的数字 置空
					toast({
						color: 'warning',
						content: this.state.baseMultiLangData['3617PUB-000058'] /* 国际化处理 押汇金额必须大于0 */
					});
					return {
						value: null,
						display: null
					};
				}
			},
			isDisabled: isChange || isExtension, // 变更态时 不可编辑
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		// 押汇银行
		pk_creditbank:{
			isDisabled: isChange || isExtension, // 变更态时 不可编辑
		},
		//融资品种
		tradefinsort:{
			isDisabled: isChange || isExtension, // 变更态时 不可编辑
		},
		//还本释放授信
		ispayrelease:{
			isDisabled: isChange || isExtension, // 变更态时 不可编辑
		},
		// 放款方式
		paymode: {
			advanceKeys: {
				// 主表区域
				header: [ 'tradefinsort' ] // 上游字段 受类型地域控制
			},
			value: (advanceObj, newValue, oldValue) => {
				// 取值函数
				let { tradefinsort } = advanceObj.header; //贸易类型为出口信用证押汇
				if (tradefinsort && tradefinsort.value !== 'OUTWORDLCLOCU') {
					return {
						value: 'PAYDIRECTLY',
						display: "直接放款"
					};
				}
			},
			isDisabled: (advanceObj) => {
				// 不可编辑
				let { tradefinsort } = advanceObj.header; //贸易类型为出口信用证押汇
				// 首先判断页面状态 如果是展期 或者变更不可编辑
				if(isChange || isExtension){
                   return true;
				}
				if(tradefinsort && tradefinsort.value === 'OUTWORDLCLOCU'){
					return true;
				}
				
			
			}
		},
		/**====================== 担保相关信息编辑后 担保合同  担保合同币种  占用担保金额**/
		pk_guarantee: {
			advanceKeys: {
				// 主表区域
				header: [
					[ 'guaranteetype' ] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 默认不可编辑
				let { guaranteetype } = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 'warrant' ||
						guaranteetype.value == 'guaranty' ||
						guaranteetype.value == 'pledge' ||
						guaranteetype.value == 'mixed')
				) {
					isDisabled = false;
				}
				return isDisabled;
			},
			isRequired: (advanceObj) => {
				let { guaranteetype } = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 'warrant' ||
						guaranteetype.value == 'guaranty' ||
						guaranteetype.value == 'pledge' ||
						guaranteetype.value == 'mixed')
				) {
					isDisabled = false;
				}
				// 可编辑即必填
				return !isDisabled;
			},
			value: (advanceObj) => {
				// 如果编辑性为不可编辑需要清空值
				let { guaranteetype } = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 'warrant' ||
						guaranteetype.value == 'guaranty' ||
						guaranteetype.value == 'pledge' ||
						guaranteetype.value == 'mixed')
				) {
					isDisabled = false;
				}
				if (isDisabled) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		//担保币种
		pk_gpmcurr: {
			advanceKeys: {
				// 主表区域
				header: ['pk_guarantee'] // 上游字段 受授信协议控制
			},
			value: (advanceObj, newValue, oldValue) => {
				// 取值函数
				// 返回值为Object
				let {
					pk_guarantee
				} = advanceObj.header;
				if (pk_guarantee && pk_guarantee.value) {
					return {
						value: newValue.header.pk_guarantee.values.pk_currtype.value,
						display: newValue.header.pk_guarantee.values.currname.value
					};
				}
				if (
					newValue &&
					newValue.header &&
					newValue.header.pk_guarantee &&
					newValue.header.pk_guarantee.value !== oldValue.header.pk_guarantee.value
				) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		//使用担保金额
		guaranteeamount: {
			advanceKeys: {
				// 主表区域
				header: [
					[ 'guaranteetype' ] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 默认不可编辑
				let { guaranteetype } = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 'warrant' ||
						guaranteetype.value == 'guaranty' ||
						guaranteetype.value == 'pledge' ||
						guaranteetype.value == 'mixed')
				) {
					isDisabled = false;
				}
				return isDisabled;
			},
			isRequired: (advanceObj) => {
				let { guaranteetype } = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 'warrant' ||
						guaranteetype.value == 'guaranty' ||
						guaranteetype.value == 'pledge' ||
						guaranteetype.value == 'mixed')
				) {
					isDisabled = false;
				}
				// 可编辑即必填
				return !isDisabled;
			},
			value: (advanceObj, srcValue, targetValue) => {
				// 如果编辑性由可编辑变成不可编辑需要清空值 或者 如果担保类型为不可编辑的类型就清空
				let { guaranteetype } = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 'warrant' ||
						guaranteetype.value == 'guaranty' ||
						guaranteetype.value == 'pledge' ||
						guaranteetype.value == 'mixed')
				) {
					isDisabled = false;
				}
				if (isDisabled) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		guaranteetype:{
			isDisabled:  isExtension, // 展期态 可编辑
		},
		/**=============授信 */
		pk_bankprotocol:{
			isDisabled:  isChange || isExtension, // 展期态 可编辑
		},
		// 授信协议币种
		pk_cccurrtype: {
			advanceKeys: {
				// 主表区域
				header: [ 'pk_bankprotocol' ] // 上游字段 受授信协议控制
			},
			value: (advanceObj, newValue, oldValue) => {
				// 取值函数
				// 返回值为Object
				let { pk_bankprotocol } = advanceObj.header;
				// 如果授信协议的新旧值不一样 走下面逻辑处理  解决编辑后授信协议不存在币种
				if (pk_bankprotocol && pk_bankprotocol.value) {
					if (
						newValue &&
						newValue.header &&
						newValue.header.pk_bankprotocol &&
						newValue.header.pk_bankprotocol.value !== oldValue.header.pk_bankprotocol.value
					) {
						return {
							value: newValue.header.pk_bankprotocol.values.pk_currtype.value,
							display: newValue.header.pk_bankprotocol.values.currname.value
						};
					}
				} else {
					// 如果授信协议为空 清空
					return {
						value: null,
						display: null
					};
				}
			}
		},
		//授信类型
		cctype: {
			advanceKeys: {
				// 主表区域
				header: [ 'pk_bankprotocol' ] // 上游字段 受哪些字段控制
			},
			value: (advanceObj, newValue, oldValue) => {
				let { pk_bankprotocol } = advanceObj.header;
				// 如果授信协议的新旧值不一样 走下面逻辑处理  解决编辑后授信协议不存在币种
				if (pk_bankprotocol && pk_bankprotocol.value) {
					if (
						newValue &&
						newValue.header &&
						newValue.header.pk_bankprotocol &&
						newValue.header.pk_bankprotocol.value !== oldValue.header.pk_bankprotocol.value
					) {
						return {
							value: newValue.header.pk_bankprotocol.values.typevalue.value,
							display: newValue.header.pk_bankprotocol.values.protocoltype.value
						};
					}
				} else {
					// 如果授信协议为空 清空
					return {
						value: null,
						display: null
					};
				}
			}
		},
	//授信银行
    pk_bank_cc: {
		advanceKeys: {
		  // 主表区域
		  header: ["pk_bankprotocol"], // 上游字段 受哪些字段控制
		},
		value: (advanceObj, newValue,oldValue) => {
		 // 取值函数
				  // 返回值为Object
				  let {
					  pk_bankprotocol
				  } = advanceObj.header;
				  if (pk_bankprotocol && pk_bankprotocol.value) {
					  if (
						  newValue &&
						  newValue.header &&
						  newValue.header.pk_bankprotocol &&
						  newValue.header.pk_bankprotocol.value !== oldValue.header.pk_bankprotocol.value
					  ) {
						  // 如果授信协议修改，清空授信协议币种
						  return {
							  value: newValue.header.pk_bankprotocol.values.pk_creditbank.value,
							  display: newValue.header.pk_bankprotocol.values.bankdocname.value
						  };
					  }
  
				  } else {
					  // 如果授信协议为空 赋空值
					  return {
						  value: null,
						  display: null
					  };
				  }
		},
	  },
		// 授信种类
		pk_cctype: {
			advanceKeys: {
				// 主表区域
				header: [ 'pk_bankprotocol' ] // 上游字段 受授信协议控制
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let { pk_bankprotocol } = advanceObj.header;
				if (pk_bankprotocol && pk_bankprotocol.value) {
					// 如果授信协议有值 授信种类可编辑
					return false;
				} else {
					return true;
				}
			},
			value: (advanceObj, newValue, oldValue) => {
				let { pk_bankprotocol } = advanceObj.header;
				if (!(pk_bankprotocol && pk_bankprotocol.value)) {
					// 如果授信协议为空 清空
					return {
						value: null,
						display: null
					};
				}
			}
		},
		// 使用授信额度
		ccamount: {
			advanceKeys: {
				// 主表区域
				header: [ 'pk_bankprotocol' ] // 上游字段 受授信协议控制
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let { pk_bankprotocol } = advanceObj.header;
				if (pk_bankprotocol && pk_bankprotocol.value) {
					// 如果授信协议有值 授信种类可编辑
					return false;
				} else {
					return true;
				}
			},
			value: (advanceObj, newValue, oldValue) => {
				let { pk_bankprotocol } = advanceObj.header;
				if (!(pk_bankprotocol && pk_bankprotocol.value)) {
					// 如果授信协议为空 清空
					return {
						value: null,
						display: null
					};
				}
			}
		},
		//贷款利率浮动比例(%)
		floatratescale: {
			isDisabled:   isExtension, // 展期态 可编辑
		},
		//逾期利率浮动比例(%)
		overratescale: {
			isDisabled:  isExtension, // 展期态 可编辑
		},
		//提前利率浮动比例(%)
		headratescale: {
			isDisabled:   isExtension, // 展期态 可编辑li
		},
	
		/**========== 展期字段修改 */
		// 合同版本日期
		versiontime:{
			isRequired: isExtension,
			isDisabled:  !(isChange || isExtension), // 变更态时 可编辑
		},
		// 展期利率
		pk_extratecode: {
			isRequired: isExtension,
			isDisabled: !isExtension, // 展期态 可编辑
		},
		// 展期开始日期
		extbegindate: {
			isDisabled:  !isExtension, // 展期态 
			isRequired: isExtension,
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			},
			exception: (advanceObj) => {
				return {
					value: null,
					display: null
				};
			},
		},
		// 展期到期日期
		extenddate: {
			isDisabled:  !isExtension, // 展期态 可编辑
			isRequired: isExtension,
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			},
			exception: (advanceObj) => {
				return {
					value: null,
					display: null
				};
			},
		},
		//逾期利息计复利
		isoverduplirate: {
			isDisabled:  isChange || isExtension, // 展期态 可编辑
		},
		//启用固定汇率
		isfixrate: {
			isDisabled:  isChange || isExtension, // 展期态 可编辑
		},
		/**========== 用合同利率计复利 */
		isnormalduplirate: {
			advanceKeys: {
				// 主表区域
				header: [
					[ 'isoverduplirate' ] // 逾期利息计复利
				]
			},
			isDisabled: (advanceObj) => {
				// 默认不可编辑
				let { isoverduplirate } = advanceObj.header;
				let isDisabled = true;
				if (isoverduplirate && isoverduplirate.value) {
					isDisabled = false;
				}
				return isDisabled;
			},
			value: (advanceObj, srcValue, targetValue) => {
				// 如果编辑性由可编辑变成不可编辑需要清空值 或者 如果担保类型为不可编辑的类型就清空
				let { isoverduplirate } = advanceObj.header;
				let isDisabled = true;
				if (isoverduplirate && isoverduplirate.value) {
					isDisabled = false;
				}
				if (isDisabled) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		//借款单位账户
		pk_debitunitacct:{
			isDisabled: isChange || isExtension, // 变更态时 不可编辑
		},
		//合同签订日期
		signdate:{
			isDisabled: isChange || isExtension, // 变更态时 不可编辑
		},
		/**==========还款方式 结息日字段 */
		returnmode: {
		    isDisabled: isChange || isExtension, // 变更态时 不可编辑
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		pk_settledate: {
			advanceKeys: {
				// 主表区域
				header: [
					[ 'returnmode' ] // 还款方式
				]
			},
			isDisabled: (advanceObj) => {
				// 默认不可编辑
				let { returnmode } = advanceObj.header;
				let isDisabled = false;
				if (returnmode && returnmode.value == 'A') {
					isDisabled = true;
				}
				//如果是展期状态 不可编辑
				if(isExtension || isChange){
					isDisabled = true;
				}
				return isDisabled;
			},
			value: (advanceObj, newValue, oldValue) => {
				if (
					newValue &&
					newValue.header &&
					newValue.header.pk_settledate &&
					newValue.header.pk_settledate.value !== oldValue.header.pk_settledate.value
				) {
					// 如果授信协议修改，清空授信协议币种
					return newValue.header.pk_settledate;
				}
				let { returnmode } = advanceObj.header;
				let isDisabled = true;
				if (returnmode || returnmode.value == 'A') {
					return {
						value: null,
						display: null
					};
				}
			
			},
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		// 币种
		pk_currtype: {
			isDisabled: isChange || isExtension, // 变更态时 不可编辑
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		// 组织本币汇率
		olcrate: {
			isDisabled: isChange || isExtension, // 变更态时 不可编辑
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		// 集团本币汇率
		glcrate: {
			isDisabled: isChange, // 变更态时 不可编辑
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		// 全局本币汇率
		gllcrate: {
			isDisabled: isChange, // 变更态时 不可编辑
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		//利率编码
		pk_ratecode: {
			advanceKeys: {
				// 主表区域
				header: [
					'begindate', // 开始日期
				]
			}, // 上游字段 受哪些字段控制
			isDisabled:  isExtension, // 变更态时 不可编辑
			value: (advanceObj, newValue, oldValue) => {
				// 开始日期修改 清空
				if (
					newValue &&
					newValue.header &&
					newValue.header.begindate &&
					newValue.header.begindate.value !== oldValue.header.begindate.value
				) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		// 年利率 yrate
		yrate: {
			advanceKeys: {
				// 主表区域
				header: [
					'pk_ratecode', // 利率编码
				]
			}, // 上游字段 受哪些字段控制
			value: (advanceObj, newValue, oldValue) => {
				  // 返回值为Object
				  let {
					pk_ratecode
				} = advanceObj.header;
				if (pk_ratecode && pk_ratecode.value) {
					if (
						newValue &&
						newValue.header &&
						newValue.header.pk_ratecode &&
						newValue.header.pk_ratecode.value !== oldValue.header.pk_ratecode.value
					) {
						// 如果授信协议修改，清空授信协议币种
						return  newValue.header.pk_ratecode.values.yrate;
					}

				} else {
					// 如果授信协议为空 赋空值
					return {
						value: null,
						display: null
					};
				}
			
			}
		},
		// 开始日期
		begindate: {
			isDisabled: isChange || isExtension, // 变更态时 不可编辑
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			},
			exception: (advanceObj) => {
				return {
					value: null,
					display: null
				};
			},
		},
		// 期间单位
		periodunit: {
			isDisabled: isChange || isExtension// 变更态时 不可编辑
		},
		// 期间
		periodcount: {
			isDisabled: isChange || isExtension // 变更态时 不可编辑
		},
		// 结束日期
		enddate: {
			advanceKeys: {
				// 主表区域
				header: [
					'begindate', // 开始日期
				]
			}, // 上游字段 受哪些字段控制
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			},
			exception: (advanceObj) => {
				return {
					value: null,
					display: null
				};
			},
			isDisabled: isChange  || isExtension// 变更态时 不可编辑
		},
		// 核算利息
		isinterest: {
			isDisabled: isChange  || isExtension// 变更态
		},

		// 资金用途
		capitaluse: {},

		// 固定利率
		isfixednumberrate: {
			isDisabled: isChange // 变更态
		},
	};
}

/**
 * table区域字段规则
 */
export function tableItemsRule() {
	// 业务状态
	let status = this.props.getUrlParam('status');
	let id = this.props.getUrlParam('id');
	let isChange = id && status === 'change'; // 变更态
	let isEdit = id && status === 'edit'; // 编辑态
	let isAdd = status === 'add'; // 新增态
	return {
		// 放款计划
		payinfo: {
			delrow: {
				after: (newAfterData) => {
					// 编辑后事件请求成功后的事件处理函数
					// newAfterData为子表所有数据 必须返回
					return newAfterData;
				}
			},
			addrow: {
				after: (newAfterData) => {
					// 编辑后事件请求成功后的事件处理函数
					// newAfterData为子表所有数据 必须返回
					return newAfterData;
				}
			},
			paycode:{
				isDisabled: isChange,
			},
			// 放款日期
			paydate: {
				advanceKeys: {
					// 主表区域
					header: [
						'begindate' // 开始日期
					]
				}, // 上游字段 受哪些字段控制
				value: (advanceObj, newValue, oldValue) => {
					// 取值函数
					// 返回值为Object
					if (
						newValue &&
						newValue.payinfo &&
						newValue.payinfo.paydate &&
						newValue.payinfo.paydate.value !== oldValue.payinfo.paydate.value
					) {
						// 如果自行设置值，则返回该值
						return newValue.payinfo.paydate;
					}

					return advanceObj['header']['begindate'];
				},
				isDisabled: isChange // 变更态
			},
			// 放款金额
			payamount: {
				isDisabled: isChange, // 变更态
				after: (newAfterData) => {
					// 编辑后事件请求成功后的事件处理函数
					// newAfterData为子表所有数据 必须返回
					return newAfterData;
				}
			}
		},
		// 还款计划
		repayinfo: {
			// 预计还本金
			preamount: {
				after: (newAfterData) => {
					// 编辑后事件请求成功后的事件处理函数
					// newAfterData为子表所有数据 必须返回
					return newAfterData;
				}
			},
			// 预计付利息
			preinterest: {
				after: (newAfterData) => {
					// 编辑后事件请求成功后的事件处理函数
					// newAfterData为子表所有数据 必须返回
					return newAfterData;
				}
			}
		}
	};
}
