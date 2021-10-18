/**
 * form区域字段规则
 */
import { toast } from "nc-lightapp-front";
export function formItemsRule() {
  let { BillConfig, TableConfig } = this.props;
  // 业务状态
  let status = this.props.getUrlParam("status");
  let id = this.props.getUrlParam("id");
  let isChange = id && status === "change"; // 变更态
  let isEdit = id && status === "edit"; // 编辑态
  let isHonour = id && status === "honour"; // 承付态
  let isAdd = status === "add"; // 新增态
  let isCopy = status === "copy"; //  复制态
  return {
    // 财务组织
    pk_org: {
      // 财务组织出不来，先注释掉
      // advanceKeys: {
      //   // 主表区域
      //   header: [""], // 上游字段 受哪些字段控制
      // },
      // value: (advanceObj, newValue, oldValue) => {
      //   // 取值函数
      //   // 返回值为Object
      //   return {
      //     value: null,
      //     display: null,
      //   };
      // },
      // isRequired: (advanceObj, newValue, oldValue) => {
      //   // 是否为必输项
      //   // 返回值为Boolean类型
      //   return true;
      // },
      isDisabled: true, // 因为是拉单，所以不可编辑
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    // 汇率编辑后事件
    olcrate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    glcrate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    gllcrate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    // 承付类型
    // 付款=1,承诺=2,承兑=3,拒付=4
    committype: {
      advanceKeys: {
        // 主表区域
        header: ["cashway"], // 上游字段 受哪些字段控制
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        return isHonour;
      },
      isDisabled: !isAdd && !isEdit && !isHonour, 
      // after: (newAfterData) => {
      //   // 编辑后事件请求成功后的事件处理函数
      //   // newAfterData必须返回
      //   return newAfterData;
      // },
    },
    // 承付日期
    commitdate: {
      advanceKeys: {
        // 主表区域
        header: ["committype"], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { committype } = advanceObj.header;
        let committypeValue = committype && committype.value;
        if (committypeValue == "4") {
          return {
            value: null,
            display: null,
          };
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        if(isHonour){
          // 返回值为Boolean类型
          let { committype } = advanceObj.header;
          let committypeValue = committype && committype.value;
          if (committypeValue != "4") {
            return true;
          } else {
            return false;
          }
        }
        return false;
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 返回值为Boolean类型
        if(isHonour){
          let { committype } = advanceObj.header;
          let committypeValue = committype && committype.value;
          if (committypeValue == "4") {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
    },
    // 发票已到
    isinvoice: {
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 返回值为Boolean类型
        return !isAdd && !isEdit && !isHonour;
      },
    },
    // 期初
    isinitial: {
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 返回值为Boolean类型
        return !isAdd && !isEdit && !isHonour;
      },
    },
    // 付款日期
    // 当承付表示为“付款、承诺/承兑”时才可录入
    // 含义：即期付款、延期付款的付款日，承兑付款的到期日
    paydate: {
      advanceKeys: {
        // 主表区域
        header: ["committype"], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { committype } = advanceObj.header;
        let committypeValue = committype && committype.value;
        if (committypeValue == "4") {
          return {
            value: null,
            display: null,
          };
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        if(isHonour){
          // 返回值为Boolean类型
          let { committype } = advanceObj.header;
          let committypeValue = committype && committype.value;
          if (committypeValue != "4") {
            return true;
          } else {
            return false;
          }
        }
        return false;
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 返回值为Boolean类型
        if(isHonour){
          let { committype } = advanceObj.header;
          let committypeValue = committype && committype.value;
          if (committypeValue == "4") {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
    },
    // 拒付原因
    disreason: {
      advanceKeys: {
        // 主表区域
        header: ["committype"], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { committype } = advanceObj.header;
        let committypeValue = committype && committype.value;
        if (committypeValue != "4") {
          return {
            value: null,
            display: null,
          };
        }
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 返回值为Boolean类型
        let { committype } = advanceObj.header;
        let committypeValue = committype && committype.value;
        if (committypeValue != "4") {
          return true;
        } else {
          return false;
        }
      },
    },
    // 票据号
    // 当承付表示为承兑时，才可录入，且必须录入
    billno: {
      advanceKeys: {
        // 主表区域
        header: ["committype"], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { committype } = advanceObj.header;
        let committypeValue = committype && committype.value;
        if (committypeValue != "3") {
          return {
            value: null,
            display: null,
          };
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let { committype } = advanceObj.header;
        let committypeValue = committype && committype.value;
        if (committypeValue == "3") {
          return true;
        } else {
          return false;
        }
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 返回值为Boolean类型
        let { committype } = advanceObj.header;
        let committypeValue = committype && committype.value;
        if (committypeValue != "3") {
          return true;
        } else {
          return false;
        }
      },
    },
    // 付款(承兑)金额
    // 当承付表示为承兑时才可录入
    payamount: {
      advanceKeys: {
        // 主表区域
        header: ["committype"], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { committype } = advanceObj.header;
        let committypeValue = committype && committype.value;
        if (committypeValue != "3") {
          return {
            value: null,
            display: null,
          };
        }
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 返回值为Boolean类型
        let { committype } = advanceObj.header;
        let committypeValue = committype && committype.value;
        if (committypeValue == "3") {
          return false;
        } else {
          return true;
        }
      },
    },
    // 到单类型 分批勾选时可以编辑
    arrivalstatus: {
      advanceKeys: {
        // 主表区域
        header: ["isbatch"], // 上游字段 受哪些字段控制
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let { isbatch } = advanceObj.header;
        let isbatchValue = isbatch && isbatch.value ;
        return !isbatchValue || isHonour;
      },
    },
    // 到单日期 分批勾选时可以编辑
    arrivaldate: {
      isDisabled: isHonour,
    },
  };
}

/**
 * table区域字段规则
 */
export function tableItemsRule() {
  let status = this.props.getUrlParam("status");
  let id = this.props.getUrlParam("id");
  let isEdit = id && status === "edit"; // 编辑态
  let isCopy = status === "copy"; //  复制态
  return {
    arrivalinfo: {
      // 到货金额
      arrivalamnt: {
        value: (advanceObj, newValue) => {
          // 取值函数
          // 返回值为Object
          // 手工编辑 需大于0
          if (newValue.arrivalinfo.arrivalamnt.value <= 0) {
            // 如果输入的值为小于0的数字 置空
            // toast({
            //   color: "warning",
            //   content: this.state.baseMultiLangData[
            //     "3617PUB-000049"
            //   ] /* 国际化处理 信用证金额必须大于0 */,
            // });
            return {
              value: null,
              display: null,
            };
          }
        },
        // isDisabled: isEdit || isCopy, // 修改态 或复制态
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },
      // 付款原币金额
      payamount: {
        value: (advanceObj, newValue) => {
          // 取值函数
          // 返回值为Object
          // 手工编辑 需大于0
          if (newValue.arrivalinfo.payamount.value <= 0) {
            // 如果输入的值为小于0的数字 置空
            // toast({
            //   color: "warning",
            //   content: this.state.baseMultiLangData[
            //     "3617PUB-000049"
            //   ] /* 国际化处理 信用证金额必须大于0 */,
            // });
            return {
              value: null,
              display: null,
            };
          }
        },
        // isDisabled: isEdit || isCopy, // 修改态 或复制态
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },

      //如货品分类值变化，则清空货品劳务、计量单位、数量
      pk_material: {
        advanceKeys: {
          // 子表区域
          arrivalinfo: [
            ['pk_marbasclass'] // 货品劳务
          ]
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          if (
            newValue &&
            newValue.arrivalinfo &&
            newValue.arrivalinfo.pk_marbasclass &&
            newValue.arrivalinfo.pk_marbasclass.value !== oldValue.arrivalinfo.pk_marbasclass.value
          ) {
            return {
              value: null,
              display: null
            };
          }
        },
      	after: (newAfterData) => { // 编辑后事件 给计量单位和货品分类赋值
      		return newAfterData;
      	}
      },
      pk_measdoc: {
        advanceKeys: {
          // 子表区域
          arrivalinfo: [
            ['pk_material'] // 货品劳务
          ]
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          //货品劳务置空 并且新值和老值不一样 赋空值 
					// 货品劳务修改 给计量单位赋值 
					let {
						pk_material
					} = advanceObj.arrivalinfo.values;
          if (newValue &&
            newValue.arrivalinfo &&
            newValue.arrivalinfo.pk_material &&
            newValue.arrivalinfo.pk_material.value !== oldValue.arrivalinfo.pk_material.value) {
            if (!(pk_material && pk_material.value)) {
              return {
                value: null,
                display: null
              };
            }else{
              let doc = newValue.arrivalinfo.pk_material.value.values.pk_measdoc;
              let docname = newValue.arrivalinfo.pk_material.value.values.measdoc_name;
              return {
                value: doc.value,
                display: docname.value
              };
            }
          }
                    
        }
      },
    },
  };
}
