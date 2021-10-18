import * as card from "../../../../public/container/card";
/**
 * form区域字段规则
 */

export function formItemsRule() {
	let {
		BillConfig,
		TableConfig
	} = this.props;
	// 业务状态
	let status = this.props.getUrlParam('status');
	let id = this.props.getUrlParam('id');
	let isEdit = id && status === 'edit'; // 编辑态
	let isAdd = status === 'add'; // 新增态
	let isCopy = status === 'copy'; //  复制态
	return {
		// 财务组织
		pk_org: {
			isDisabled: isEdit || isCopy, // 修改态 或复制态
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		// 信用证金额 默认不可编辑 从子表数据获取
		lcamount: {
			advanceKeys: {
				// 主表区域
				contractinfo: ['amount'] // 延期方式
			},
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		// 类型地域
		type: {
			// isDisabled: isEdit || isCopy, // 修改态 或复制态
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},

		// 信用证币种
		pk_lccurrtype: {
			advanceKeys: {
				// 主表区域
				header: ['type'] // 上游字段 受类型地域控制
			},
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		//仅当“兑付方式”为“延期付款”时，延期方式、远期天数 才可编辑
		postponetype: {
			advanceKeys: {
				// 主表区域
				header: ['paytype'] // 延期方式
			},
			isDisabled: (advanceObj) => {
				let {
					paytype
				} = advanceObj.header;
				return !(paytype && paytype.value === '4');
			},
			isRequired: (advanceObj) => {
				// 可编辑即必填
				let {
					paytype
				} = advanceObj.header; 
				return paytype && paytype.value === '4';
			},
			value: (advanceObj, newValue, oldValue) => {
				//  延期方式不可编辑状态下需要将值置空
				let {
					paytype
				} = advanceObj.header;
				if (!(paytype && paytype.value === '4')) {
					return {
						value: null,
						display: null
					};
				} else if (
					newValue &&
					newValue.header &&
					newValue.header.postponetype &&
					newValue.header.postponetype.value !== oldValue.header.postponetype.value
				) {
					return newValue.header.postponetype;
				} else {
					return {
						value: "1",
						display: "1"
					};
				}
				// 如果旧值不为空，则返回该值

			}
		},
		// 延期方式为特别指定日期 1.远期天数为不可编辑、非必填，值为空
		// 2.远期天数 可编辑、必填 赋空值
		futuredays: {
			advanceKeys: {
				// 主表区域
				header: ['postponetype', 'paytype'] // 延期方式
			},
			isDisabled: (advanceObj) => {
				let {
					postponetype,
					paytype
				} = advanceObj.header;
				let isDisabled = true; // 默认不可编辑
				// 兑付延期并且延期方式非特别指定日期 可编辑
				if (paytype && paytype.value === '4' && !(postponetype && postponetype.value === '3')) {
					isDisabled = false;
				}
				return isDisabled;
			},
			isRequired: (advanceObj) => {
				let {
					postponetype,
					paytype
				} = advanceObj.header;
				let isDisabled = true; // 默认不可编辑
				// 兑付延期并且延期方式非特别指定日期 可编辑
				if (paytype && paytype.value === '4' && !(postponetype && postponetype.value === '3')) {
					isDisabled = false;
				}
				// 可编辑即必填
				return !isDisabled;
			},
			value: (advanceObj, newValue, oldValue) => {
				if (
					newValue &&
					newValue.header &&
					newValue.header.futuredays &&
					newValue.header.futuredays.value !== oldValue.header.futuredays.value
				) {
					return newValue.header.futuredays;
				}
				let {
					postponetype,
					paytype
				} = advanceObj.header;
				let isDisabled = true; // 默认不可编辑
				// 兑付延期并且延期方式非特别指定日期 可编辑
				if (paytype && paytype.value === '4' && !(postponetype && postponetype.value === '3')) {
					isDisabled = false;
				}
				if (isDisabled) {
					//  置空
					return {
						value: null,
						display: null
					};
				}

			}
		},
		// 延期方式为特别指定日期 1.指定日期  可编辑 必填 赋空值
		// 非 2.指定日期 不可编辑、非必填，值为空
		specifydate: {
			advanceKeys: {
				// 主表区域
				header: ['postponetype'] // 延期方式
			},
			isDisabled: (advanceObj) => {
				let {
					postponetype
				} = advanceObj.header;
				return !(postponetype && postponetype.value === '3');
			},
			isRequired: (advanceObj) => {
				let {
					postponetype
				} = advanceObj.header;
				return postponetype && postponetype.value === '3';
			},
			value: (advanceObj, newValue, oldValue) => {
				if (
					newValue &&
					newValue.header &&
					newValue.header.specifydate &&
					newValue.header.specifydate.value !== oldValue.header.specifydate.value
				) {
					return newValue.header.specifydate;
				}
				let {
					postponetype
				} = advanceObj.header;
				if (!(postponetype && postponetype.value === '3')) {
					//  置空
					return {
						value: null,
						display: null
					};
				}

			}
		},

		// 开证行
		pk_bank_issuing: {
			// isDisabled: isEdit || isCopy, // 修改态 或复制态
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},
		// 汇率编辑后事件
		olcrate: {
			after: (newAfterData) => {
			  // 编辑后事件请求成功后的事件处理函数
			  // newAfterData必须返回
			  return newAfterData;
			},
		  },
		// 供应商
		pk_supplier: {
			after: (newAfterData) => {
				// 编辑后事件请求成功后的事件处理函数
				// newAfterData必须返回
				return newAfterData;
			}
		},

		// 上调比例
		overscale: {
			advanceKeys: {
				// 主表区域
				header: [
					['isoverflow'] // 溢短装
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					isoverflow
				} = advanceObj.header;
				if (isoverflow && isoverflow.value == 1) {
					return false;
				} else {
					return true;
				}
			},
			isRequired: (advanceObj) => {
				// 溢短装
				let {
					isoverflow
				} = advanceObj.header;
				// 如果勾选溢短装字段 必输
				return isoverflow && isoverflow.value;
			},
			value: (advanceObj, newValue, oldValue) => {
				if (
					newValue &&
					newValue.header &&
					newValue.header.overscale &&
					newValue.header.overscale.value !== oldValue.header.overscale.value
				) {
					let flag = card.checkFloatingRatio.call(
						this,
						"overscale",
						newValue.header.overscale
					);
					if (!flag) {
						return {
							display: null,
							value: null
						};
					}
					return newValue.header.overscale;
				}
				// 溢短装
				let {
					isoverflow
				} = advanceObj.header;
				if (isoverflow && isoverflow.value !== 1) {
					//  置空
					return {
						value: null,
						display: null
					};
				}

			}
		},

		// 下调比例
		lowscale: {
			advanceKeys: {
				// 主表区域
				header: [
					['isoverflow'] // 溢短装
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					isoverflow
				} = advanceObj.header;
				if (isoverflow && isoverflow.value == 1) {
					return false;
				} else {
					return true;
				}
			},
			isRequired: (advanceObj) => {
				// 是否为必输项 返回值为Boolean类型
				let {
					isoverflow
				} = advanceObj.header;
				// 如果勾选溢短装字段 必输
				return isoverflow && isoverflow.value;
			},
			value: (advanceObj, newValue, oldValue) => {

				// 溢短装
				if (
					newValue &&
					newValue.header &&
					newValue.header.lowscale &&
					newValue.header.lowscale.value !== oldValue.header.lowscale.value
				) {
					let flag = card.checkFloatingRatio.call(
						this,
						"lowscale",
						newValue.header.lowscale
					);
					if (!flag) {
						return {
							display: null,
							value: null
						};
					}
					return newValue.header.lowscale;

				}
				let {
					isoverflow
				} = advanceObj.header;
				if (isoverflow && isoverflow.value !== 1) {
					//  置空
					return {
						value: null,
						display: null
					};
				}
			}
		},
		/**=========================授信相关字段的编辑性===================================== */
		// 授信协议币种
		pk_cccurrtype: {
			advanceKeys: {
				// 主表区域
				header: ['pk_ccterm'] // 上游字段 受授信协议控制
			},
			value: (advanceObj, newValue, oldValue) => {
				// 取值函数
				// 返回值为Object
				let {
					pk_ccterm
				} = advanceObj.header;
				// 如果授信协议的新旧值不一样 走下面逻辑处理  解决编辑后授信协议不存在币种
				if (pk_ccterm && pk_ccterm.value) {
					if (
						newValue &&
						newValue.header &&
						newValue.header.pk_ccterm &&
						newValue.header.pk_ccterm.value !== oldValue.header.pk_ccterm.value
					) {
						return {
							value: newValue.header.pk_ccterm.values.pk_currtype.value,
							display: newValue.header.pk_ccterm.values.currname.value
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

		// 授信协议银行
		pk_bank_cc: {
			advanceKeys: {
				// 主表区域
				header: ['pk_ccterm'] // 上游字段 受授信协议控制
			},
			value: (advanceObj, newValue, oldValue) => {
				// 取值函数
				// 返回值为Object
				let {
					pk_ccterm
				} = advanceObj.header;
				if (pk_ccterm && pk_ccterm.value) {
					if (
						newValue &&
						newValue.header &&
						newValue.header.pk_ccterm &&
						newValue.header.pk_ccterm.value !== oldValue.header.pk_ccterm.value
					) {
						// 如果授信协议修改，清空授信协议币种
						return {
							value: newValue.header.pk_ccterm.values.pk_creditbank.value,
							display: newValue.header.pk_ccterm.values.bankdocname.value
						};
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
		// 授信种类
		cccategory: {
			advanceKeys: {
				// 主表区域
				header: ['pk_ccterm'] // 上游字段 受授信协议控制
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					pk_ccterm
				} = advanceObj.header;
				if (pk_ccterm && pk_ccterm.value) {
					// 如果授信协议有值 授信种类可编辑
					return false;
				} else {
					return true;
				}
			},
			value: (advanceObj, newValue, oldValue) => {
				let {
					pk_ccterm
				} = advanceObj.header;
				if (!(pk_ccterm && pk_ccterm.value)) {
					// 如果授信协议为空 清空
					return {
						value: null,
						display: null
					};
				}
				if (
					newValue &&
					newValue.header &&
					newValue.header.pk_ccterm &&
					newValue.header.pk_ccterm.value !== oldValue.header.pk_ccterm.value
				) {
					// 如果授信协议修改，清空授信种类
					return {
						value: null,
						display: null
					};
				}

			}
		},
		// 使用授信额度
		useccamount: {
			advanceKeys: {
				// 主表区域
				header: ['pk_ccterm'] // 上游字段 受授信协议控制
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					pk_ccterm
				} = advanceObj.header;
				if (pk_ccterm && pk_ccterm.value) {
					// 如果授信协议有值 授信种类可编辑
					return false;
				} else {
					return true;
				}
			},
			isRequired: (advanceObj) => {
				// 是否必输
				let {
					pk_ccterm
				} = advanceObj.header;
				if (pk_ccterm && pk_ccterm.value) {
					// 如果授信协议有值 授信种类可编辑
					return true;
				} else {
					return false;
				}
			},
			value: (advanceObj, newValue, oldValue) => {
				let {
					pk_ccterm
				} = advanceObj.header;
				if (!(pk_ccterm && pk_ccterm.value)) {
					// 如果授信协议为空 清空
					return {
						value: null,
						display: null
					};
				}
				if (
					newValue &&
					newValue.header &&
					newValue.header.pk_ccterm &&
					newValue.header.pk_ccterm.value !== oldValue.header.pk_ccterm.value
				) {
					// 如果授信协议修改，清空授信种类
					return {
						value: null,
						display: null
					};
				}

			}
		},
		// 授信协议
		pk_ccterm: {
			advanceKeys: {
				// 主表区域
				header: ['guaranteetype'] // 上游字段 担保类型
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					guaranteetype
				} = advanceObj.header;
				return guaranteetype && guaranteetype.value == 7; //票据池灰置
			},
			value: (advanceObj, srcValue, targetValue) => {
				let {
					guaranteetype
				} = advanceObj.header;
				if (guaranteetype && guaranteetype.value == 7) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		// 担保类型编辑后
		guaranteetype: {
			after: (newAfterData) => {
				return newAfterData;
			},
			exception: (advanceObj) => {
				return {
					value: null,
					display: null
				};
			},
		},
		/**=========================担保相关字段的编辑性===================================== */
		//担保合同 1.担保方式保证、抵押、质押、混合时，担保合同及占用金额可编辑
		pk_guaprotocol: {
			advanceKeys: {
				// 主表区域
				header: [
					['guaranteetype'] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 默认不可编辑
				let {
					guaranteetype
				} = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 3 ||
						guaranteetype.value == 4 ||
						guaranteetype.value == 5 ||
						guaranteetype.value == 6)
				) {
					isDisabled = false;
				}
				return isDisabled;
			},
			isRequired: (advanceObj) => {
				let {
					guaranteetype
				} = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 3 ||
						guaranteetype.value == 4 ||
						guaranteetype.value == 5 ||
						guaranteetype.value == 6)
				) {
					isDisabled = false;
				}
				// 可编辑即必填
				return !isDisabled;
			},
			value: (advanceObj) => {
				// 如果编辑性为不可编辑需要清空值
				let {
					guaranteetype
				} = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 3 ||
						guaranteetype.value == 4 ||
						guaranteetype.value == 5 ||
						guaranteetype.value == 6)
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
		pk_guacurrtype: {
			advanceKeys: {
				// 主表区域
				header: ['pk_guaprotocol'] // 上游字段 受授信协议控制
			},
			value: (advanceObj, newValue, oldValue) => {
				// 取值函数
				// 返回值为Object
				let {
					pk_guaprotocol
				} = advanceObj.header;
				if (pk_guaprotocol && pk_guaprotocol.value) {
					return {
						value: newValue.header.pk_guaprotocol.values.pk_currtype.value,
						display: newValue.header.pk_guaprotocol.values.currname.value
					};
				}
				if (
					newValue &&
					newValue.header &&
					newValue.header.pk_guaprotocol &&
					newValue.header.pk_guaprotocol.value !== oldValue.header.pk_guaprotocol.value
				) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		//使用担保金额
		guaranteeamont: {
			advanceKeys: {
				// 主表区域
				header: [
					['guaranteetype'] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 默认不可编辑
				let {
					guaranteetype
				} = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 3 ||
						guaranteetype.value == 4 ||
						guaranteetype.value == 5 ||
						guaranteetype.value == 6)
				) {
					isDisabled = false;
				}
				return isDisabled;
			},
			isRequired: (advanceObj) => {
				let {
					guaranteetype
				} = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 3 ||
						guaranteetype.value == 4 ||
						guaranteetype.value == 5 ||
						guaranteetype.value == 6)
				) {
					isDisabled = false;
				}
				// 可编辑即必填
				return !isDisabled;
			},
			value: (advanceObj, srcValue, targetValue) => {
				// 如果编辑性由可编辑变成不可编辑需要清空值 或者 如果担保类型为不可编辑的类型就清空
				console.log('srcValue=====================' + srcValue);
				console.log('targetValue=====================' + targetValue);
				let {
					guaranteetype
				} = advanceObj.header;
				let isDisabled = true;
				if (
					guaranteetype &&
					(guaranteetype.value == 3 ||
						guaranteetype.value == 4 ||
						guaranteetype.value == 5 ||
						guaranteetype.value == 6)
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
		/**=========================保证信息相关字段的编辑性===================================== */
		// 保证金账号
		pk_acc_pledge: {
			advanceKeys: {
				// 主表区域
				header: [
					['guaranteetype'] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					guaranteetype
				} = advanceObj.header;
				return guaranteetype && guaranteetype.value == 7; //票据池灰置
			},
			value: (advanceObj, srcValue, targetValue) => {
				let {
					guaranteetype
				} = advanceObj.header;
				if (guaranteetype && guaranteetype.value == 7) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		//保证金币种
		pk_pledgecurr: {
			advanceKeys: {
				// 主表区域
				header: ['pk_acc_pledge'] // 上游字段 受保证金账户控制
			},
			value: (advanceObj, newValue, oldValue) => {
				// 取值函数
				// 返回值为Object
				let {
					pk_acc_pledge
				} = advanceObj.header;
				if ( !(pk_acc_pledge && pk_acc_pledge.value)) {
					return {
						value: null,
						display: null
				};	
				}
				if (
					newValue &&
					newValue.header &&
					newValue.header.pk_acc_pledge &&
					newValue.header.pk_acc_pledge.value !== oldValue.header.pk_acc_pledge.value
				) {
					// 如果保证金账户修改
					return {
						value: newValue.header.pk_acc_pledge.values['bd_currtype.pk_currtype'].value,
						display: newValue.header.pk_acc_pledge.values['bd_currtype.name'].value
					};
				}
				
			}
		},
		// 保证金金额
		pledgeamount: {
			advanceKeys: {
				// 主表区域
				header: [
					['pk_acc_pledge'] // 保证金账户
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					pk_acc_pledge
				} = advanceObj.header;
				return !(pk_acc_pledge && pk_acc_pledge.value); //保证金账户
			},
			isRequired: (advanceObj) => {
				// 是否为必输项
				let {
					pk_acc_pledge
				} = advanceObj.header;
				return pk_acc_pledge && pk_acc_pledge.value; //保证金账户
			},
			value: (advanceObj,newValue, oldValue) => {
				if (
					newValue &&
					newValue.header &&
					newValue.header.pk_acc_pledge &&
					newValue.header.pk_acc_pledge.value !== oldValue.header.pk_acc_pledge.value
				) {
					// 如果保证金账户修改
					return {
						value: null,
						display: null
					};
				}
			},
			after: (newAfterData) => { // 编辑后事件 保证金金额触发编辑后 计算保证金比例
				return newAfterData;
			}
		},
		// 保证金编号
		pledgecode: {
			advanceKeys: {
				// 主表区域
				header: [
					['pk_acc_pledge'] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					pk_acc_pledge
				} = advanceObj.header;
				return !(pk_acc_pledge && pk_acc_pledge.value); //票据池灰置
			},
			value: (advanceObj,newValue, oldValue) => {
				if (
					newValue &&
					newValue.header &&
					newValue.header.pk_acc_pledge &&
					newValue.header.pk_acc_pledge.value !== oldValue.header.pk_acc_pledge.value
				) {
					// 如果保证金账户修改
					return {
						value: null,
						display: null
					};
				}
			}
		},
		// 保证金比例（%）
		pledgescale: {
			advanceKeys: {
				// 主表区域
				header: [
					['pk_acc_pledge'] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					pk_acc_pledge
				} = advanceObj.header;
				return !(pk_acc_pledge && pk_acc_pledge.value); //票据池灰置
			},
			isRequired: (advanceObj) => {
				// 是否为禁用
				let {
					pk_acc_pledge
				} = advanceObj.header;
				return pk_acc_pledge && pk_acc_pledge.value; //保证金账户为空
			},
			value: (advanceObj,newValue, oldValue) => {
				// 如果保证金账户为空 清空值
				if (
					newValue &&
					newValue.header &&
					newValue.header.pk_acc_pledge &&
					newValue.header.pk_acc_pledge.value !== oldValue.header.pk_acc_pledge.value
				) {
					// 如果授信协议修改，清空授信协议币种
					return {
						value: null,
						display: null
					};
				}
				if(newValue &&
					newValue.header &&
					newValue.header.pledgescale &&
					newValue.header.pledgescale.value){
					let flag = card.checkFloatingRatio.call(
						this,
						"pledgescale",
						newValue.header.pledgescale
					  );
					  if (!flag) {
						return {
						  display: null,
						  value: null
						};
					  }
				}
				
			},
			after: (newAfterData) => { // 编辑后事件 保证金比例触发编辑后 计算保证金金额
				return newAfterData;
			}
		},
		/**=========================票据池相关字段的编辑性===================================== */
		// 期初票据池
		initpoolflag: {
			advanceKeys: {
				// 主表区域
				header: [
					['guaranteetype'] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					guaranteetype
				} = advanceObj.header;
				return !(guaranteetype && guaranteetype.value == 7); //票据池
			},
			value: (advanceObj, srcValue, targetValue) => {
				let {
					guaranteetype
				} = advanceObj.header;
				if (!(guaranteetype && guaranteetype.value == 7)) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		//是否使用下拨额度
		downquotaflag: {
			advanceKeys: {
				// 主表区域
				header: [
					['guaranteetype'] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					guaranteetype
				} = advanceObj.header;
				return !(guaranteetype && guaranteetype.value == 7); //票据池
			},
			value: (advanceObj, srcValue, targetValue) => {
				let {
					guaranteetype
				} = advanceObj.header;
				if (!(guaranteetype && guaranteetype.value == 7)) {
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
			},
			exception: (advanceObj) => {
				return {
					value: null,
					display: null
				};
			},
		},
		// 使用费主键
		pk_usectmanage: {
			advanceKeys: {
				// 主表区域
				header: [
					['guaranteetype'] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					guaranteetype
				} = advanceObj.header;
				return !(guaranteetype && guaranteetype.value == 7); //票据池
			},
			value: (advanceObj, srcValue, targetValue) => {
				let {
					guaranteetype
				} = advanceObj.header;
				if (!(guaranteetype && guaranteetype.value == 7)) {
					return {
						value: null,
						display: null
					};
				}
			},
			isRequired: (advanceObj) => {
				let {
					guaranteetype
				} = advanceObj.header;
				return guaranteetype && guaranteetype.value == 7;
			}
		},
		// 占用共享质押额度
		occusharemoney: {
			advanceKeys: {
				// 主表区域
				header: [
					'guaranteetype', 'downquotaflag' // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					guaranteetype,downquotaflag
				} = advanceObj.header;
				return !(guaranteetype && guaranteetype.value == 7) || (downquotaflag && downquotaflag.value) ; //票据池
			},
			value: (advanceObj, srcValue, targetValue) => {
				let {
					guaranteetype
				} = advanceObj.header;
				if (!(guaranteetype && guaranteetype.value == 7)) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		// 占用单位质押额度
		occucommoney: {
			advanceKeys: {
				// 主表区域
				header: [
					['guaranteetype'] // 担保方式
				]
			},
			isDisabled: (advanceObj) => {
				// 是否为禁用
				let {
					guaranteetype
				} = advanceObj.header;
				return !(guaranteetype && guaranteetype.value == 7); //票据池
			},
			value: (advanceObj, srcValue, targetValue) => {
				let {
					guaranteetype
				} = advanceObj.header;
				if (!(guaranteetype && guaranteetype.value == 7)) {
					return {
						value: null,
						display: null
					};
				}
			}
		},
		pk_dept: {
			advanceKeys: {
			  // 主表区域
			  header: [
				["pk_entrustorg"], // 部门
			  ],
			},
			value: (advanceObj, newValue, oldValue) => {        
			  if (newValue &&
				newValue.header &&
				newValue.header.pk_entrustorg &&
				newValue.header.pk_entrustorg.value !== oldValue.header.pk_entrustorg.value) {
				  return{
					value: null,
					display: null,
				  }
			  } 
			},
		  },
	  
	  
		  pk_busipersion: {
			advanceKeys: {
			  // 主表区域
			  header: [
				["pk_entrustorg"], // 人员
			  ],
			},
			value: (advanceObj, newValue, oldValue) => {        
			  if (newValue &&
				newValue.header &&
				newValue.header.pk_entrustorg &&
				newValue.header.pk_entrustorg.value !== oldValue.header.pk_entrustorg.value) {
				  return{
					value: null,
					display: null,
				  }
			  } 
			},
		  },
	};
}

/**
 * table区域字段规则
 */
export function tableItemsRule() {
	let status = this.props.getUrlParam('status');
	let id = this.props.getUrlParam('id');
	let isEdit = id && status === 'edit'; // 编辑态
	let isCopy = status === 'copy'; //  复制态
	return {
		contractinfo: {
			pk_material: {
				advanceKeys: {
					// 子表区域
					contractinfo: [
						['pk_marbasclass'] // 货品劳务
					]
				},
				value: (advanceObj, newValue, oldValue) => {
					// 如果货品分类做修改需要将值置空
					// 取值函数
					if (
						newValue &&
						newValue.contractinfo &&
						newValue.contractinfo.pk_marbasclass &&
						newValue.contractinfo.pk_marbasclass.value !== oldValue.contractinfo.pk_marbasclass.value
					) {
						return {
							value: null,
							display: null
						};
					}
				},
				after: (newAfterData) => {
					// 触发后台编辑后事件给货品分类赋值
					// newAfterData必须返回
					return newAfterData;
				},
			},
			measure: {
				advanceKeys: {
					// 子表区域
					contractinfo: [
						['pk_material'] // 货品劳务
					]
				},
				value: (advanceObj, newValue, oldValue) => {
					//货品劳务置空 并且新值和老值不一样 赋空值 
					// 货品劳务修改 给计量单位赋值 
					let {
						pk_material
					} = advanceObj.contractinfo.values;
					
					if(newValue &&
							newValue.contractinfo &&
							newValue.contractinfo.pk_material &&
							newValue.contractinfo.pk_material.value !== oldValue.contractinfo.pk_material.value){
						if (!(pk_material && pk_material.value)) {
								return {
									value: null,
									display: null
								};
						}else{
							return {
								value: newValue.contractinfo.pk_material.value.values.pk_measdoc.value,
								display: newValue.contractinfo.pk_material.value.values.pk_measdoc.value
							};
						}
					} 
					
				}
			},
			quantity: {
				advanceKeys: {
					// 子表区域
					contractinfo: [
						['pk_marbasclass'] // 货品劳务
					]
				},
				value: (advanceObj, newValue, oldValue) => {
					// 取值函数
					if (
						newValue &&
						newValue.contractinfo &&
						newValue.contractinfo.pk_marbasclass &&
						newValue.contractinfo.pk_marbasclass.value !== oldValue.contractinfo.pk_marbasclass.value
					) {
						return {
							value: null,
							display: null
						};
					}
				},
				after: (newAfterData) => { // 编辑后事件 数量走编辑后给信用证金额赋值
					return newAfterData;
				}
			},
			unitprice:{
				after: (newAfterData) => { // 编辑后事件 单价走编辑后给信用证金额赋值
					return newAfterData;
				}
			},
			// 信用证金额
			amount: {
				value: (advanceObj, newValue) => {
					// 取值函数
					// 返回值为Object
					// 手工编辑 需大于0
					if (newValue.contractinfo.amount.value <= 0) {
						// 如果输入的值为小于0的数字 置空
						toast({
							color: 'warning',
							content: this.state.baseMultiLangData['3617PUB-000049'] /* 国际化处理 信用证金额必须大于0 */
						});
						return {
							value: null,
							display: null
						};
					}
				},
				// isDisabled: isEdit || isCopy, // 修改态 或复制态
				after: (newAfterData) => {
					return newAfterData;
				}
			}
			//
		}
	};
}