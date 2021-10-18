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
      isDisabled: isEdit || isCopy, // 修改态 或复制态
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },


    // negotiatingtype: {
    //   advanceKeys: {
    //     // 主表区域
    //     header: ["pk_org"], // 上游字段 财务组织
    //   },
    //   value: (advanceObj, newValue, oldValue) => {
    //     // 取值函数
    //     // 返回值为Object
    //     let { pk_org } = advanceObj.header;
    //     if (!pk_org) {
    //       return {
    //         value: null,
    //         display: null,
    //       };
    //     }
    //   },
    // },

    // // 授信协议
    // pk_ccterm: {
    //   //   advanceKeys: {
    //   //     // 主表区域
    //   //     header: [""], // 上游字段 受哪些字段控制
    //   //   },
    //   //   value: (advanceObj, newValue, oldValue) => {
    //   //     // 取值函数
    //   //     // 返回值为Object
    //   //     return {
    //   //       value: null,
    //   //       display: null,
    //   //     };
    //   //   },
    //   //   isRequired: (advanceObj, newValue, oldValue) => {
    //   //     // 是否为必输项
    //   //     // 返回值为Boolean类型
    //   //     return true;
    //   //   },
    //   isDisabled: isEdit || isCopy, // 修改态 或复制态
    //   after: (newAfterData) => {
    //     // 编辑后事件请求成功后的事件处理函数
    //     // newAfterData必须返回
    //     return newAfterData;
    //   },
    // },

    // 授信协议币种
    pk_cccurrtype: {
      advanceKeys: {
        // 主表区域
        header: ["pk_ccterm"], // 上游字段 受授信协议控制
      },
      isRequired: (advanceObj) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 授信协议
        let { pk_ccterm } = advanceObj.header;
        // 如果有授信协议 必输
        if (pk_ccterm && pk_ccterm.value) {
          return true;
        }
        else {
          return false;
        }
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { pk_ccterm } = advanceObj.header;
        if (pk_ccterm && pk_ccterm.value) {
          return {
            value: newValue.header.pk_ccterm.values.pk_currtype.value,
            display: newValue.header.pk_ccterm.values.currname.value,
          };
        }
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_ccterm &&
          newValue.header.pk_ccterm.value !== oldValue.header.pk_ccterm.value
        ) {
          // 如果授信协议修改，清空授信协议币种
          return {
            value: null,
            display: null,
          };
        }
      },
    },


    // 授信种类
    pk_cctype: {
      advanceKeys: {
        // 主表区域
        header: ["pk_ccterm"], // 上游字段 受授信协议控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { pk_ccterm } = advanceObj.header;
        if (!(pk_ccterm && pk_ccterm.value)) {
          return {
            value: null,
            display: null,
          };
        }
      },
      isRequired: (advanceObj) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 授信协议
        let { pk_ccterm } = advanceObj.header;
        // 如果有授信协议 必输
        if (pk_ccterm && pk_ccterm.value) {
          return true;
        }
        else {
          return false;
        }
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 受托单位类型
        let { pk_ccterm } = advanceObj.header;
        if (pk_ccterm && pk_ccterm.value) {
         // 如果有授信协议 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },

    // 授信金额
    useccamount : {
      advanceKeys: {
        // 主表区域
        header: ["pk_ccterm"], // 上游字段 受授信协议控制
      },
      value: (advanceObj, newValue, oldValue) => {
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_ccterm &&
          newValue.header.pk_ccterm.value !== oldValue.header.pk_ccterm.value
        ) {
          // 如果授信协议修改，清空授信金额
          return {
            value: null,
            display: null,
          };
        }
      },
      isRequired: (advanceObj) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 授信协议
        let { pk_ccterm } = advanceObj.header;
        // 如果有授信协议 必输
        if (pk_ccterm && pk_ccterm.value) {
          return true;
        }
        else {
          return false;
        }
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 受托单位类型
        let { pk_ccterm } = advanceObj.header;
        if (pk_ccterm && pk_ccterm.value) {
         // 如果有授信协议 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },

    // 授信协议银行
    pk_bank_cc: {
      advanceKeys: {
        // 主表区域
        header: ["pk_ccterm"], // 上游字段 受授信协议控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { pk_ccterm } = advanceObj.header;
        if (pk_ccterm && pk_ccterm.value) {
          return {
            value: newValue.header.pk_ccterm.values.pk_creditbank.value,
            display: newValue.header.pk_ccterm.values.bankdocname.value,
          };
        }
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_ccterm &&
          newValue.header.pk_ccterm.value !== oldValue.header.pk_ccterm.value
        ) {
          // 如果授信协议修改，清空授信协议币种
          return {
            value: null,
            display: null,
          };
        }
      },
    },

    // 授信类型
    pk_protocoltype: {
      advanceKeys: {
        // 主表区域
        header: ["pk_ccterm"], // 上游字段 受授信协议控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { pk_ccterm } = advanceObj.header;
        if (pk_ccterm && pk_ccterm.value) {
          return {
            value: newValue.header.pk_ccterm.values.typevalue.value,
            display: newValue.header.pk_ccterm.values.protocoltype.value,
          };
        }
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_ccterm &&
          newValue.header.pk_ccterm.value !== oldValue.header.pk_ccterm.value
        ) {
          // 如果授信协议修改，清空授信协议币种
          return {
            value: null,
            display: null,
          };
        }
      },
   
    },

    //   // swift号
    //   swiftno: {
    //     advanceKeys: {
    //       // 主表区域
    //       header: ["pk_bank_issuing"], // 上游字段 受授信协议控制
    //     },
    //     value: (advanceObj, newValue, oldValue) => {
    //       if (
    //         newValue &&
    //         newValue.header &&
    //         newValue.header.pk_bank_issuing &&
    //         newValue.header.pk_bank_issuing.value !==
    //           oldValue.header.pk_bank_issuing.value
    //       ) {
    //         // 如果授信协议修改，清空授信协议币种
    //         return {
    //           value: null,
    //           display: null
    //         };
    //       }
    //     },
    // },

    // 类型地域
    type: {
      // isDisabled: isEdit || isCopy, // 修改态 或复制态
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    // 信用证币种
    pk_lccurrtype: {
      advanceKeys: {
        // 主表区域
        header: ["type"], // 上游字段 受类型地域控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { type } = advanceObj.header;
        if (type && type.value === "2") {
          return {
            value: null,
            display: null,
          };
        }
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    // 指定日期
    specifydate: {
      advanceKeys: {
        // 主表区域
        header: ["postponetype"], // 延期方式
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { postponetype } = advanceObj.header;
        if (!(postponetype && postponetype.value === "3")) {
          return {
            value: null,
            display: null,
          };
        }
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 受托单位类型
        let { postponetype } = advanceObj.header;
        if (postponetype && postponetype.value === "3") {
          // 如果受托单位类型是金融机构 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
      isRequired: (advanceObj) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 授信协议
        let { postponetype } = advanceObj.header;
        // 如果有授信协议 必输
        if (postponetype && postponetype.value === "3") {
          return true;
        }
        else {
          return false;
        }
      },
    },


    // 延期方式
    postponetype: {
      advanceKeys: {
        // 主表区域
        header: ["paytype"], // 兑付方式
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { paytype } = advanceObj.header;

        if (paytype && paytype.value === "4" && oldValue.header.postponetype.value === null) {
          // 兑付方式为延期付款
          return {
            value: "1",
            display: "1",
          };
        } else if (paytype && paytype.value === "4" && oldValue.header.postponetype.value != null){
          return {
            value: newValue.header.postponetype.value,
            display: newValue.header.postponetype.display,
          };
        } else {
          return{
          value: null,
          display: null,
          }
        }
      },
      isRequired: (advanceObj) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 兑付方式类型
        let { paytype } = advanceObj.header;
        // 如果勾选溢短装字段 必输
        if (paytype && paytype.value === "4") {
          // 如果兑付方式为延期付款 必输
          return true;
        }
        else {
          return false;
        }
      },
      // get isRequired() {
      //   return this._isRequired;
      // },
      // set isRequired(value) {
      //   this._isRequired = value;
      // },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 兑付方式类型
        let { paytype } = advanceObj.header;
        if (paytype && paytype.value === "4") {
          // 如果兑付方式为延期付款 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },


    // 远期天数  futuredays
    futuredays: {
      advanceKeys: {
        // 主表区域
        header: ["paytype"], // 兑付方式
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { paytype } = advanceObj.header;

        if (paytype && paytype.value === "4") {

        } else {
          return {
            value: null,
            display: null,
          };
        }
      },
      isRequired: (advanceObj) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 兑付方式类型
        let { paytype } = advanceObj.header;
        // 如果勾选溢短装字段 必输
        if (paytype && paytype.value === "4") {
          // 如果兑付方式为延期付款 必输
          return true;
        } else {
          return false;
        }
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 兑付方式类型
        let { paytype } = advanceObj.header;
        if (paytype && paytype.value === "4") {
          // 如果兑付方式为延期付款 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },

    
    // 开证行
    pk_bank_issuing: {
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
      isDisabled: !(isEdit || isCopy || isAdd), // 修改态 或复制态
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    // 受益人
    beneficiary: {
      //   advanceKeys: {
      //     // 主表区域
      //     header: ["pk_supplier"], // 上游字段 受类型地域控制
      //   },
      //   value: (advanceObj, newValue,oldValue) => {
      //     // 取值函数
      //     // 返回值为Object
      //   let {pk_supplier} = advanceObj.header;

      //   if (
      //     pk_supplier == "" || pk_supplier.value == ""
      //   ) {
      //     // 如果修改受益人，清空受益人地址
      //     return {
      //       value: null,
      //       display: null
      //     };
      //   }
      // },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    // 受益人地址
    beneficiaryaddr: {
      advanceKeys: {
        // 主表区域
        header: ["beneficiary"], // 上游字段 受类型地域控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { beneficiary } = advanceObj.header;

        if (beneficiary == null || beneficiary.value == null) {
          // 如果修改受益人，清空受益人地址
          return {
            value: null,
            display: null,
          };
        }
      },
    },

    // 供应商
    pk_supplier: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    // 上调比例
    overscale: {
      advanceKeys: {
        // 主表区域
        header: [
          ["isoverflow"], // 溢短装
        ],
      },
      value: (advanceObj) => {
        // 取值函数
        // 返回值为Object
        // 溢短装
        let { isoverflow } = advanceObj.header;
        if (!(isoverflow && isoverflow.value) ) {
          // 如果受托单位类型是非内部单位 置空
          return {
            value: null,
            display: null
          };
        }
      },
      isRequired: (advanceObj) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 溢短装
        let { isoverflow } = advanceObj.header;
        // 如果勾选溢短装字段 必输
        return isoverflow && isoverflow.value;
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 兑付方式类型
        let { isoverflow } = advanceObj.header;
        if (isoverflow && isoverflow.value) {
          // 如果勾选溢短装 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },

    // 下调比例
    lowscale: {
      advanceKeys: {
        // 主表区域
        header: [
          ["isoverflow"], // 溢短装
        ],
      },
      value: (advanceObj) => {
        // 取值函数
        // 返回值为Object
        // 溢短装
        let { isoverflow } = advanceObj.header;
        if (!(isoverflow && isoverflow.value) ) {
          // 如果受托单位类型是非内部单位 置空
          return {
            value: null,
            display: null
          };
        }
      },
      isRequired: (advanceObj) => {
        // 是否为必输项
        // 返回值为Boolean类型
        // 溢短装
        let { isoverflow } = advanceObj.header;
        // 如果勾选溢短装字段 必输
        return isoverflow && isoverflow.value;
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 兑付方式类型
        let { isoverflow } = advanceObj.header;
        if (isoverflow && isoverflow.value) {
          // 如果勾选溢短装 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },

    // 组织本币
    olcrate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    // 集团本币
    glclcamount: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },


    
    // 全局本币
    gllcrate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    // // 信用证币种
    // pk_lccurrtype: {

    // },

  //  // 货品分类
  //   pk_marbasclass: {
  //     advanceKeys: {
  //       // 主表区域
  //       header: [
  //         ["pk_material"], // 货品分类
  //       ],
  //     },
  //     value: (advanceObj, newValue, oldValue) => {
  //       // 取值函数
  //       // 返回值为Object
  //       let { pk_material } = advanceObj.header;
  //       if (pk_material && pk_material.value) {
  //           return {
  //             value: newValue.header.pk_material.values.pk_currtype.value,
  //             display: newValue.header.pk_material.values.currname.value,
  //           };
  //       } 
  //     },

  //   }, 

    // 货品劳务
    pk_material: {
      advanceKeys: {
        // 主表区域
        header: [
          ["pk_marbasclass"], // 货品分类
        ],
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        //let { pk_marbasclass } = advanceObj.header;
        

        if (newValue &&
          newValue.header &&
          newValue.header.pk_marbasclass &&
          newValue.header.pk_marbasclass.value !== oldValue.header.pk_marbasclass.value) {
            return{
              value: null,
              display: null,
            }
        } 
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
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
  
    // // 期间
    // duration: {
    //   advanceKeys: {
    //     header: [
    //       "contractid", // 合同编号
    //       "enableplan", // 是否启用放款计划
    //       "pk_consignfinplan" // 放款计划
    //     ]
    //   }, // 上游影响字段
    //   value: (advanceObj, newValue) => {
    //     // 合同编号 启用放款计划
    //     let { contractid, enableplan, pk_consignfinplan } = advanceObj.header;
    //     if (
    //       !(contractid && contractid.value) ||
    //       (enableplan &&
    //         enableplan.value &&
    //         !(pk_consignfinplan && pk_consignfinplan.value))
    //     ) {
    //       // 如果合同编号无值 或 启用放款计划 但放款计划无值 清空当前字段值
    //       return { value: null, display: null };
    //     }
    //   },
    //   isDisabled: advanceObj => {
    //     // 合同编号 启用放款计划 放款计划
    //     let { contractid, enableplan, pk_consignfinplan } = advanceObj.header;
    //     return (
    //       isChange ||
    //       isExtension ||
    //       !(contractid && contractid.value) ||
    //       (enableplan &&
    //         enableplan.value &&
    //         !(pk_consignfinplan && pk_consignfinplan.value))
    //     );
    //   }
    // },
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
      // 货品劳务
    pk_material: {
      advanceKeys: {
        // 主表区域
        contractinfo: [
          ["pk_marbasclass"], // 货品分类
        ],
      },
      value: (advanceObj, newValue, oldValue) => {
        if (newValue &&
          newValue.contractinfo &&
          newValue.contractinfo.pk_marbasclass &&
          newValue.contractinfo.pk_marbasclass.value !== oldValue.contractinfo.pk_marbasclass.value) {
            return{
              value: null,
              display: null,
            }
        } 
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    pk_measdoc: {
      advanceKeys: {
        // 子表区域
        contractinfo: [
          ['pk_material'] // 货品劳务
        ],
      },
      value: (advanceObj, newValue, oldValue) => {
        let { pk_material } = advanceObj.contractinfo.values;
      //	let values = newValue.contractinfo.pk_material.value.values;
      //	if (!values) {
      //	  return {
      //		display: null,
      //		value: null
      //	  };
      //	}
        // 取值函数
        if (
        newValue &&
          newValue.contractinfo &&
          newValue.contractinfo.pk_material &&
          newValue.contractinfo.pk_material.value !== oldValue.contractinfo.pk_material.value
        ) {
          if(!(pk_material && pk_material.value)){
          return {
            value: null,
            display: null
            };
          } else {
          return {
          value: newValue.contractinfo.pk_material.value.values.pk_measdoc.value,
          display: newValue.contractinfo.pk_material.value.values.measdoc_name.value
          };
        }
        } 
        // else if( !pk_material || !pk_material.value){
        //     return {
        //   		display: null,
        //   		value: null
        //     }
        //   }        
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
        } else if (newValue.contractinfo.quantity.value === ""){
          return {
            value: "0",
            display: null,
          }
        }
      },
      after: (newAfterData) => { // 编辑后事件 数量走编辑后给信用证金额赋值
        return newAfterData;
      }
    },
    unitprice:{
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        if (newValue.contractinfo.unitprice.value === ""){
          return {
            value: "0",
            display: null,
          }
        }
      },
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
        //   if(newValue.contractinfo.collectamount.value === ""){
        //     return {
        //       value: "0",
        //       display: null,
        //     }
        //   }
        // },
          if (newValue.contractinfo.amount.value < 0) {
            // 如果输入的值为小于0的数字 置空
            toast({
              color: "warning",
              content: this.state.baseMultiLangData[
                "3617PUB-000049"
              ] /* 国际化处理 信用证金额必须大于0 */,
            });
            return {
              value: null,
              display: null,
            };
          } else if(newValue.contractinfo.amount.value === ""){
            return {
                    value: "0",
                    display: null,
                  }
          }
        },
        // isDisabled: isEdit || isCopy, // 修改态 或复制态
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },
    },
  };
}
