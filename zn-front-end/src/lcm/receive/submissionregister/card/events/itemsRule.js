/**
 * form区域字段规则
 */

export function formItemsRule() {
  let { BillConfig, TableConfig } = this.props;
  // 业务状态
  let status = this.props.getUrlParam("status");
  let id = this.props.getUrlParam("id");
  let isChange = id && status === "change"; // 变更态
  let isEdit = id && status === "edit"; // 编辑态
  let isAdd = status === "add"; // 新增态
  let isCopy = status === "copy"; //  复制态
  return {
    // 财务组织
    pk_org: {
      isDisabled: true, // 不可编辑
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
    // 交单类型 分批勾选时可以编辑
    submissiontype: {
      advanceKeys: {
        // 主表区域
        header: ["isbatch"], // 上游字段 受哪些字段控制
      },
      isRequired: false,
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let { isbatch } = advanceObj.header;
        let isbatchValue = isbatch && isbatch.value ;
        return !isbatchValue;
      },
    },
     // 期初
     isinitial: {
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 返回值为Boolean类型
        return !isAdd && !isEdit;
      },
    },
    //部门
    pk_dept: {
      advanceKeys: {
        // 主表区域
        header: [
          ["pk_entrustorg"], // 业务组织
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
    //业务员
    pk_busipersion: {
      advanceKeys: {
        // 主表区域
        header: [
          ["pk_entrustorg","pk_dept"], // 人员
        ],
      },
      value: (advanceObj, newValue, oldValue) => {
        //  更换部门清空人员信息
        let pk_dept =newValue &&
          newValue.header &&
          newValue.header.pk_dept &&
          newValue.header.pk_dept.value !== oldValue.header.pk_dept.value;
        if (pk_dept) {
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
  let status = this.props.getUrlParam("status");
  let id = this.props.getUrlParam("id");
  let isEdit = id && status === "edit"; // 编辑态
  let isCopy = status === "copy"; //  复制态
  return {
    contractinfo: {
      // 交单金额
      submissionamount: {
        value: (advanceObj, newValue) => {
          // 取值函数
          // 返回值为Object
          // 手工编辑 需大于0
          if (newValue.contractinfo.submissionamount.value <= 0) {
            // 如果输入的值为小于0的数字 置空
            // toast({
            //   color: "warning",
            //   content: "交单金额必须大于0",
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
      // 手续费
      poundage: {
        value: (advanceObj, newValue) => {
          // 取值函数
          // 返回值为Object
          // 手工编辑 需大于0
          if (newValue.contractinfo.poundage.value <= 0) {
            // 如果输入的值为小于0的数字 置空
            // toast({
            //   color: "warning",
            //   content: "交单金额必须大于0",
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
      // 发货数量
      materialcount: {
        after: (newAfterData) => { // 编辑后事件 数量走编辑后给信用证金额赋值
          return newAfterData;
        }
      },
      // 单价
      materialprice:{
        after: (newAfterData) => { // 编辑后事件 单价走编辑后给信用证金额赋值
          return newAfterData;
        }
      },
    },
  };
}
