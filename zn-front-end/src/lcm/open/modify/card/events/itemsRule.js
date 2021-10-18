/**
 * form区域字段规则
 */

export function formItemsRule() {
  let {
    BillConfig,
    TableConfig
  } = this.props;
  // 业务状态
  let status = this.props.getUrlParam("status");
  let id = this.props.getUrlParam("id");
  let isEdit = id && status === "edit"; // 编辑态
  let isAdd = status === "add"; // 新增态
  let isCopy = status === "copy"; //  复制态
  return {
    // 财务组织
    pk_org: {
      //   advanceKeys: {
      //     // 主表区域
      //     header: [""], // 上游字段 受哪些字段控制
      //   },
      //   value: (advanceObj, newValue, oldValue) => {
      //     // 取值函数
      //     // 返回值为Object
      //     return {
      //       value: null,
      //       display: null,
      //     };
      //   },
      //   isRequired: (advanceObj, newValue, oldValue) => {
      //     // 是否为必输项
      //     // 返回值为Boolean类型
      //     return true;
      //   },
      // isDisabled: isEdit || isCopy, // 修改态 或复制态
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //下浮比例（%）
    lowscale: {
      advanceKeys: {
        // 主表区域
        header: ["isoverflow"], // 
      },
      isRequired: advanceObj => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 溢短装
        let {
          isoverflow
        } = advanceObj.header;
        return isoverflow && isoverflow.value;
      },
      isDisabled: advanceObj => {
        let {
          isoverflow
        } = advanceObj.header;
        return !(isoverflow && isoverflow.value);
      },
      value: (newValue, oldValue) => {
         if (
          !(newValue &&
          newValue.header &&
          newValue.header.isoverflow &&
          newValue.header.isoverflow.value) 
        ) {
          return {
            value: null,
            display: null
          };
        } 
        // 如果旧值不为空，则返回该值
      }
    },
    // 上浮比例（%）
    overscale: {
      advanceKeys: {
        // 主表区域
        header: ["isoverflow"], // 上游字段 受哪些字段控制
      },
      isRequired: advanceObj => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 溢短装
        let {
          isoverflow
        } = advanceObj.header;
        return isoverflow && isoverflow.value;
      },
      isDisabled: advanceObj => {
        let {
          isoverflow
        } = advanceObj.header;
        return !(isoverflow && isoverflow.value);
      },
      value: (newValue, oldValue) => {
         if (
          !(newValue &&
          newValue.header &&
          newValue.header.isoverflow &&
          newValue.header.isoverflow.value)
        ) {
          return {
            value: null,
            display: null
          };
        } 
        // 如果旧值不为空，则返回该值
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
      //如果后台抛异常，清空值
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
      value: (advanceObj, newValue,oldValue) => {
        // 如果编辑性为不可编辑需要清空值
        let {
          pk_guaprotocol
        } = advanceObj.header;
        if (
          newValue &&
          newValue.header &&
          newValue.header.guaranteetype &&
          newValue.header.guaranteetype.value !== oldValue.header.guaranteetype.value
        ) {
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
        header: ['pk_guaprotocol'] // 上游字段 受担保合同控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let {
          pk_guaprotocol
        } = advanceObj.header;
        if (pk_guaprotocol && pk_guaprotocol.value) {
          return {
            value: newValue.header.pk_guaprotocol.values && newValue.header.pk_guaprotocol.values.pk_currtype.value,
            display: newValue.header.pk_guaprotocol.values && newValue.header.pk_guaprotocol.values.currname.value
          };
        }
        if (
          newValue &&
          newValue.header &&
          newValue.header.guaranteetype &&
          newValue.header.guaranteetype.value !== oldValue.header.guaranteetype.value
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
      value: (advanceObj,newValue,oldValue) => {
        // 如果编辑性为不可编辑需要清空值
        if (
          newValue &&
          newValue.header &&
          newValue.header.guaranteetype &&
          newValue.header.guaranteetype.value !== oldValue.header.guaranteetype.value
        ) {
          return {
            value: null,
            display: null
          };
        }
      }
    },
    /**---------------------------------保证金页签------------------------ */
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
          ['pk_acc_pledge'] // 保证金账号
        ]
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        let {
          pk_acc_pledge
        } = advanceObj.header;
        return !(pk_acc_pledge && pk_acc_pledge.value);
      },
      // isRequired: (advanceObj) => {
      //   // 是否为禁用
      //   let {
      //     pk_acc_pledge
      //   } = advanceObj.header;
      //   return pk_acc_pledge && pk_acc_pledge.value;
      // },
      value: (newValue, oldValue) => {
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_acc_pledge &&
          newValue.header.pk_acc_pledge.value !== oldValue.header.pk_acc_pledge.value
        ) {
          // 如果修改，清空
          return {
            value: null,
            display: null
          };
        }
      }
    },
    // 保证金编号
    pledgecode: {
      advanceKeys: {
        // 主表区域
        header: [
          ['pk_acc_pledge'] // 保证金账号
        ]
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        let {
          pk_acc_pledge
        } = advanceObj.header;
        return !(pk_acc_pledge && pk_acc_pledge.value);
      },
      // isRequired: (advanceObj) => {
      //   // 是否为禁用
      //   let {
      //     pk_acc_pledge
      //   } = advanceObj.header;
      //   return pk_acc_pledge && pk_acc_pledge.value;
      // },
      value: (newValue, oldValue) => {
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_acc_pledge &&
          newValue.header.pk_acc_pledge.value !== oldValue.header.pk_acc_pledge.value
        ) {
          // 如果修改，清空
          return {
            value: null,
            display: null
          };
        }
      }
    },
    // 保证金比例（%）
    pledgescale: {
      after: (newAfterData) => { // 编辑后事件 保证金比例触发编辑后 计算保证金金额
				return newAfterData;
			},
      advanceKeys: {
        // 主表区域
        header: [
          ['pk_acc_pledge'] // 受保证金账户控制
        ]
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        let {
          pk_acc_pledge
        } = advanceObj.header;
        return !(pk_acc_pledge && pk_acc_pledge.value);
      },
      // isRequired: (advanceObj) => {
      //   // 是否为禁用
      //   let {
      //     pk_acc_pledge
      //   } = advanceObj.header;
      //   return pk_acc_pledge && pk_acc_pledge.value;
      // },
      value: (advanceObj,newValue, oldValue) => {
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_acc_pledge &&
          newValue.header.pk_acc_pledge.value !== advanceObj.header.pk_acc_pledge.value
        ) {
          // 如果修改，清空
          return {
            value: null,
            display: null
          };
        }
      }
    },
  };
}

/**
 * table区域字段规则
 */
export function tableItemsRule() {}