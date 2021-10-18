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
      advanceKeys: {
        // 主表区域
        header: [""], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        return {
          value: null,
          display: null,
        };
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        return true;
      },
      isDisabled: isChange || isEdit || isCopy, // 变更态 或 修改态 或复制态
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
export function tableItemsRule() {}
