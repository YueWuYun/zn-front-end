/**
 * form区域字段规则
 */
import { toast } from "nc-lightapp-front";

export function formItemsRule() {
  let {
    BillConfig,
    TableConfig
  } = this.props;
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
      // isDisabled: isChange || isEdit || isCopy, // 变更态 或 修改态 或复制态
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //汇率
    olcrate :{
      after: newAfterData => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    //汇率
    olcrate :{
      after: newAfterData => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    //币种
    pk_currtype: {
      after: newAfterData => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    // 借款单位账户
    pk_debitunitacct: {
      advanceKeys: {
        // 主表区域
        header: [
          "pk_currtype" //币种
        ]
      }, // 上游字段 受哪些字段控制
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        // 借款单位类型
        let { loanunittype } = advanceObj.header;
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_currtype &&
          newValue.header.pk_currtype.value !==
            oldValue.header.pk_currtype.value
        ) {
          // 如果修改币种，清空借款金融机构账户
          return {
            value: null,
            display: null
          };
        }
      },
    },
    //用合同利率计复利
    isnormalduplirate :{
      advanceKeys: {
        // 主表区域
        header: ["isoverduplirate"], // 上游字段 受哪些字段控制
      },
      isDisabled: advanceObj => {
        let {
          isoverduplirate
        } = advanceObj.header;
        return !(isoverduplirate && isoverduplirate.value);
      },
    },
    //放款方式
    paymode :{
      advanceKeys: {
        // 主表区域
        header: ["tradefinsort"], // 上游字段 受哪些字段控制
      },
      isRequired: advanceObj => {
        return false;
      },
      isDisabled: advanceObj => {
        let {
          tradefinsort
        } = advanceObj.header;
        return tradefinsort && tradefinsort.value === "OUTWORDLCLOCU";//出口信用证不可编辑
      },
    },
    //融资品种
    tradefinsort :{
      isRequired: advanceObj => {
        return false;
      }
    },
    //还款方式
    returnmode :{
      isRequired: advanceObj => {
        return false;
      },
    },
    //分期付息/到期一次还本=C,分期还本/分期付息=F,到期一次结息/本利付清=A,分期计息/到期一次还本付息=B,分期还本不结息/到期一次结清=E
    //结息日根据还款方式控制
    pk_settledate: {
      advanceKeys: {
        // 主表区域
        header: ["returnmode"], // 上游字段 受哪些字段控制
      },
      isDisabled: advanceObj => {
        let {
          returnmode
        } = advanceObj.header;
        return returnmode && returnmode.value === "A";
      },
      isRequired: advanceObj => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 兑付方式
        let {
          returnmode
        } = advanceObj.header;
        return !(returnmode && returnmode.value === "A");
      },
      value: (advanceObj, srcValue, targetValue) => {
				let { returnmode } = advanceObj.header;
				let isDisabled = false;
				if (returnmode && returnmode.value == 'A') {
					isDisabled = true;
				}
				if (isDisabled) {
					return {
						value: null,
						display: null
					};
				}
			},
    },
    //授信类型
    cctype: {
      advanceKeys: {
        // 主表区域
        header: ["pk_bankprotocol"], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 授信协议
        // let cctype = newValue.header.pk_bankprotocol.values.protocoltype;
        if (!(newValue.header.pk_bankprotocol && newValue.header.pk_bankprotocol.values)) {
          return {
            value: null,
            display: null
          };
        }
        if (newValue.header.pk_bankprotocol.values.typevalue && newValue.header.pk_bankprotocol.values.typevalue.value === "1") {
          return {
            value: "1",
            display: "企业授信"
          };
        } else if (newValue.header.pk_bankprotocol.values.typevalue && newValue.header.pk_bankprotocol.values.typevalue.value === "2") {
          return {
            value: "2",
            display: "集团授信"
          };
        }
      },
    },
    docuscale :{
      value: (advanceObj, newValue) => {
        // 取值函数
        // 返回值为Object
        // 手工编辑 需大于0
        if (newValue.header.docuscale.value <= 0) {
          // 如果输入的值为小于0的数字 置空
          toast({
            color: "warning",
            content: this.state.baseMultiLangData[
              "3617PUB-000072"
            ] /* 国际化处理 比例必须大于0 */
          });
          return {
            value: null,
            display: null
          };
        }
      },
    },
    contractamount :{
      value: (advanceObj, newValue) => {
        // 取值函数
        // 返回值为Object
        // 手工编辑 需大于0
        if (newValue.header.contractamount.value <= 0) {
          // 如果输入的值为小于0的数字 置空
          toast({
            color: "warning",
            content: this.state.baseMultiLangData[
              "3617PUB-000067"
            ] /* 国际化处理 金额必须大于0 */
          });
          return {
            value: null,
            display: null
          };
        }
      },
      after: newAfterData => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      }
    },
    //授信种类
    pk_cctype: {
      advanceKeys: {
        // 主表区域
        header: ["pk_bankprotocol"], // 上游字段 受哪些字段控制
      },
      isDisabled: advanceObj => {
        let {
          pk_bankprotocol
        } = advanceObj.header;
        return !(pk_bankprotocol && pk_bankprotocol.value);
      },
      value: (advanceObj, newValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 授信协议
        // let cctype = newValue.header.pk_bankprotocol.values.protocoltype;
        let {
          pk_bankprotocol
        } = advanceObj.header;
        if (!(pk_bankprotocol && pk_bankprotocol.value)) {
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
      value: (advanceObj, newValue) => {
        // 取值函数
        // 返回值为Object
        // 如果自行设置值，则返回该值
        if (!(newValue.header.pk_bankprotocol && newValue.header.pk_bankprotocol.value)) {
          return {
            value: null,
            display: null
          };
        } else if (newValue.header.pk_bankprotocol != "" && newValue.header.pk_bankprotocol.value != "") {
          return {
            value: newValue.header.pk_bankprotocol.values.pk_creditbank.value,
            display: newValue.header.pk_bankprotocol.values.bankdocname.value
          };
        }
      },
    },
    //使用授信金额
    ccamount: {
      advanceKeys: {
        // 主表区域
        header: ["pk_bankprotocol"], // 上游字段 受哪些字段控制
      },
      isRequired: advanceObj => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 担保方式
        let {
          pk_bankprotocol
        } = advanceObj.header;
        return pk_bankprotocol && pk_bankprotocol.value;
      },
      isDisabled: advanceObj => {
        let {
          pk_bankprotocol
        } = advanceObj.header;
        return !(pk_bankprotocol && pk_bankprotocol.value);
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        // 如果自行设置值，则返回该值
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_bankprotocol &&
          newValue.header.pk_bankprotocol.value !== oldValue.header.pk_bankprotocol.value
        ) {
          return {
            value: null,
            display: null
          };
        }
      },
    },
    //授信币种
    pk_cccurrtype: {
      advanceKeys: {
        // 主表区域
        header: ["pk_bankprotocol"], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue) => {
        // 取值函数
        // 返回值为Object
        // 如果自行设置值，则返回该值
        if (!(newValue.header.pk_bankprotocol && newValue.header.pk_bankprotocol.value)) {
          return {
            value: null,
            display: null
          };
        } else if (newValue.header.pk_bankprotocol != "" && newValue.header.pk_bankprotocol.value != "") {
          return {
            value: newValue.header.pk_bankprotocol.values.pk_currtype.value,
            display: newValue.header.pk_bankprotocol.values.currname.value
          };
        }
      },
    },
  };
}

/**
 * table区域字段规则
 */
export function tableItemsRule() {}