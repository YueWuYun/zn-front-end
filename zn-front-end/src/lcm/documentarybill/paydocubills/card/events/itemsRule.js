/**
 * form区域字段规则
 */

export function formItemsRule() {
  let { FormConfig, 
    TabsConfig, 
    TableConfig, 
    form: formUtil, 
    cardTable: cardTableUtil } = this.props;
  // 业务状态
  let status = this.props.getUrlParam("status");
  let id = this.props.getUrlParam("id");
  let isChange = id && status === "change"; // 变更态
  let isEdit = id && status === "edit"; // 编辑态
  let isAdd = status === "add"; // 新增态
  let isCopy = status === "copy"; //  复制态
  let isExtension = status === "extension";// 是否展期编辑态
  return {
    // 财务组织
    pk_org: {
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        return true;
      },
      isDisabled: isExtension || isEdit || isCopy, // 变更态 或 修改态 或复制态
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
    // 
    isinitial: {
      isDisabled: isExtension , // 展期态
    },
    // 
    pk_debitacct: {
      isDisabled: isExtension , // 展期态
    },
    // 
    paydate: {
      isDisabled: isExtension , // 展期态
    },
    // 
    payamount: {
      isDisabled: isExtension , // 展期态
    },
    // 
    pk_planitem: {
      isDisabled: isExtension , // 展期态
    },
    // 
    remark: {
      isDisabled: isExtension , // 展期态
    },
    
    // 合同编号
    pk_contract: {
      advanceKeys: {
        // 主表区域
        header: ["pk_org"], // 上游字段 受哪些字段控制
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        let { pk_org } = advanceObj.header;
        // 如果有组织字段 必输
        return pk_org && pk_org.value;
        // 是否为必输项
        // 返回值为Boolean类型
      },
      isDisabled: isExtension , // 展期态
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    // 放款计划编号
    pk_payplan: {
      advanceKeys: {
        // 主表区域
        header: ["pk_contract"], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        if((newValue && oldValue 
          && oldValue.header.pk_payplan && newValue.header.pk_payplan
          &&(oldValue.header.pk_payplan.value !== newValue.header.pk_payplan.value))
            || (!newValue || !newValue.header.pk_payplan || !newValue.header.pk_payplan.value)){
            // 清空子表所有数据
            if (TabsConfig && TabsConfig.tabOrder) {
              let allTableData = {};
              TabsConfig.tabOrder.map((item) => {
                // 对子表页签每一项都重置为空数组
                allTableData[item] = {};
                allTableData[item].rows = [];
              });
              // 重置所有页签数据
              cardTableUtil.setAllTabsData(
                allTableData,
                TabsConfig.tabOrder,
                () => {
                  this.props.cardTable.setCurrTabKey(TabsConfig.tabOrder[0]);
                },
                TabsConfig.tabOrder
              );
            }
          return newValue.header.pk_payplan;
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        let contflag = false;// 合同编号是否没有值
        let { pk_contract } = advanceObj.header;
        if(pk_contract && pk_contract.value){
          contflag = true;
        }
        return isExtension || contflag;
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let contflag = true;// 合同编号是否没有值
        let { pk_contract } = advanceObj.header;
        if(pk_contract && pk_contract.value){
          contflag = false;
        }
        return isExtension || contflag;
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
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
  let isExtension = status === "extension";// 是否展期编辑态
  return {
    repayplan: {
      // 还款日期
      repaydate: {
        // value: (advanceObj, newValue) => {
        //   // 取值函数
        //   // 返回值为Object
        // },
        isDisabled: isExtension , // 展期态
        // after: (newAfterData) => {
        //   // 编辑后事件请求成功后的事件处理函数
        //   // newAfterData必须返回
        //   return newAfterData;
        // },
      },
      // 预计还本金
      preamount: {
        value: (advanceObj, newValue) => {
          // 取值函数
          // 返回值为Object
          // 手工编辑 需大于0
          if (newValue.repayplan.preamount.value <= 0) {
            // 如果输入的值为小于0的数字 置空
            toast({
              color: "warning",
              content: "预计还本金必须大于0",
            });
            return {
              value: null,
              display: null,
            };
          }
        },
        isDisabled: isExtension , // 展期态
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },
      // 预计付利息
      preinterest: {
        value: (advanceObj, newValue) => {
          // 取值函数
          // 返回值为Object
          // 手工编辑 需大于0
          if (newValue.repayplan.preinterest.value <= 0) {
            // 如果输入的值为小于0的数字 置空
            toast({
              color: "warning",
              content: "预计付利息必须大于0",
            });
            return {
              value: null,
              display: null,
            };
          }
        },
        isDisabled: isExtension , // 展期态
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },
      // 展期开始日期
      extbegindate: {
        isDisabled: !isExtension , // 展期态
      },
      // 展期结束日期
      extenddate: {
        isDisabled: !isExtension , // 展期态
      },
      // 展期利率
      pk_extratecode: {
        isDisabled: !isExtension , // 展期态
      },


    },
  };
}
