/**
 * form区域字段规则
 */

export function formItemsRule() {
  let { BillConfig, TableConfig } = this.props;
  // 业务状态
  let status = this.props.getUrlParam("status");
  let id = this.props.getUrlParam("id");
  let isEdit = id && status === "edit"; // 编辑态
  let isAdd = status === "add"; // 新增态
  let isCopy = status === "copy"; //  复制态
  let afterObj = {
    after: (newAfterData) => {
      // 编辑后事件请求成功后的事件处理函数
      // newAfterData必须返回
      return newAfterData;
    }
  };
  //卖汇相关对象
  let buyremittanceamtObj = {
    advanceKeys: {
      // 主表区域
      header: ["buyremittanceamt"], // 上游字段 受哪些字段控制 买汇金额
    },
    isRequired: (advanceObj, newValue, oldValue) => {
      // 是否为必输项
      let { buyremittanceamt } = advanceObj.header;
      return buyremittanceamt && buyremittanceamt.value;
    },
    isDisabled: advanceObj => {
      // 是否为禁用
      let { buyremittanceamt } = advanceObj.header;
      // 如果买汇金额不为空 可编辑
      return !(buyremittanceamt && buyremittanceamt.value);
    },
    after: (newAfterData) => {
      // 编辑后事件请求成功后的事件处理函数
      // newAfterData必须返回
      return newAfterData;
    }
  };
  //保证金相关对象
  let depositObj = {
    advanceKeys: {
      // 主表区域
      header: ["pk_pledgecurr", "depositaccount"], // 上游字段 保证金币种 保证金账户
    },
    isDisabled: advanceObj => {
      // 是否为禁用
      let { pk_pledgecurr } = advanceObj.header;
      let { depositaccount } = advanceObj.header;
      // 如果币种和账户不为空 可编辑
      return !(pk_pledgecurr.value && depositaccount.value);
    },
    after: (newAfterData) => {
      // 编辑后事件请求成功后的事件处理函数
      // newAfterData必须返回
      return newAfterData;
    }
  };
  return {
    // 财务组织
    pk_org: {
      isDisabled: true,
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    //释放授信额度
    free_ccamount : {
      advanceKeys: {
        // 主表区域
        header: ["pk_ccprotocol"], // 上游字段 授信协议
      },
      isDisabled: advanceObj => {
        // 是否为禁用
        let { pk_ccprotocol } = advanceObj.header;
        // 如果币种和账户不为空 可编辑
        return !(pk_ccprotocol && pk_ccprotocol.value);
      }
    },
    // 现汇支付金额
    spotamt: {
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        if(newValue.header.spotamt.value === ""){
          return {
            value: "0",
            display: null,
          }
        }
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    //现汇支付账户
    spotaccount: {
      advanceKeys: {
        // 主表区域
        header: ["spotamt"], // 上游字段 受哪些字段控制 现汇支付金额
      },
      isRequired: advanceObj =>  {
        let { spotamt } = advanceObj.header;
        return spotamt && spotamt.value;
      },
      isDisabled: advanceObj =>  {
        let { spotamt } = advanceObj.header;
        return !(spotamt && spotamt.value);
      }
    },
    //买汇金额
    buyremittanceamt: {
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        if(newValue.header.buyremittanceamt.value === ""){
          return {
            value: "0",
            display: null,
          }
        }
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    // 卖汇币种
    pk_sell_currtype: buyremittanceamtObj,
    // 卖汇账户
    sellaccount: buyremittanceamtObj,
    // 卖汇金额
    sellamt: buyremittanceamtObj,
    // 卖汇本币汇率
    selllcrate: buyremittanceamtObj,
    //委托放款金额
    delegatesendamt: {
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        if(newValue.header.delegatesendamt.value === ""){
          return {
            value: "0",
            display: null,
          }
        }
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    //手续费
    poundageamount: {
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        if(newValue.header.poundageamount.value === ""){
          return {
            value: "0",
            display: null,
          }
        }
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    //保证金支付信用证金额
    depositpaylcmamt: {
      advanceKeys: {
        // 主表区域
        header: ["pk_pledgecurr", "depositaccount"], // 上游字段 保证金币种 保证金账户
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        if(newValue.header.depositpaylcmamt.value === ""){
          return {
            value: "0",
            display: null,
          }
        }
      },
      isDisabled: advanceObj => {
        // 是否为禁用
        let { pk_pledgecurr } = advanceObj.header;
        let { depositaccount } = advanceObj.header;
        // 如果币种和账户不为空 可编辑
        return !(pk_pledgecurr.value && depositaccount.value);
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    //保证金支付金额
    depositpayamt: {
      advanceKeys: {
        // 主表区域
        header: ["depositpaylcmamt"], // 上游字段 保证金支付信用证金额
      },
      isDisabled: advanceObj => {
        // 是否为禁用
        let { depositpaylcmamt } = advanceObj.header;
        // 如果币种和账户不为空 可编辑
        return !(depositpaylcmamt.value);
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        let { depositpaylcmamt } = advanceObj.header;
        return depositpaylcmamt && depositpaylcmamt.value;
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    //保证金币种折本位币汇率
    deposittolcrate: depositObj,
    //期初
    isinitial: {
      advanceKeys: {
        // 主表区域
        header: ["pk_register.isinitial"], // 上游字段 保证金支付信用证金额
      },
      isDisabled: advanceObj => {
        // 是否为禁用
        let { ["pk_register.isinitial"] : isinitial } = advanceObj.header;
        // 如果币种和账户不为空 可编辑
        return (isinitial.value === "N");
      },
    },
    //释放单位票据池金额
    relcommoney:{
      advanceKeys: {
        // 主表区域
        header: ["pk_register.guaranteetype"], // 上游字段 担保方式
      },
      isDisabled: advanceObj => {
        // 是否为禁用
        let { ["pk_register.guaranteetype"] : guaranteetype } = advanceObj.header;
        // 如果担保方式为票据池 可编辑
        return (guaranteetype.value !== "7");
      },
    },
    //释放共享票据池金额
    relsharemoney: {
      advanceKeys: {
        // 主表区域
        header: ["pk_register.guaranteetype"], // 上游字段 担保方式
      },
      isDisabled: advanceObj => {
        // 是否为禁用
        let { ["pk_register.guaranteetype"] : guaranteetype } = advanceObj.header;
        // 如果担保方式为票据池 可编辑
        return (guaranteetype.value !== "7");
      },
    }
  };
}

/**
 * table区域字段规则
 */
export function tableItemsRule() {
  return{
    // 合同信息
    contractinfo: {
      // 付款金额
      payamount: {
        after: newAfterData => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData为子表所有数据 必须返回
          return newAfterData;
        }
      }
    },
  }
 }
