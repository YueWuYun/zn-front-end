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
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    // 还款日期
    repaydate: {
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
    },


      // 组织本币汇率
      olcrate: {
        advanceKeys: {
          // 主表区域
          header: ["pk_contract"], // 上游字段 合同
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { pk_contract } = advanceObj.header;
          if (pk_contract && pk_contract.value) {
            // return {
            //   value: newValue.header.pk_contract.values.ispayrelease.value,
            //   display: newValue.header.pk_contract.values.ispayrelease.display,
            // };
          } else {
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

      
      // 集团本币汇率
      glcrate: {
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
        
      },

      
      // 全局本币汇率
      gllcrate: {
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },

    // 借款单位账户
    pk_debitunitacct: {
      advanceKeys: {
        // 主表区域
        header: ["pk_org","isforeign"], // 上游字段 受哪些字段控制
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { isforeign } = advanceObj.header;
        if (isforeign && isforeign.value) {
          return {
            value: null,
            display: null,
          };
        } 
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 外汇还款
        let { isforeign } = advanceObj.header;
        if (isforeign && isforeign.value) {
          // 如果启用外汇还款
          return true;
        } else {
          return false;
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        let { pk_org ,isforeign} = advanceObj.header;
        if(pk_org && pk_org.value && !isforeign.value){
          return true;
        } else {
          return false;
        }
        // 如果有组织字段 必输
        // 返回值为Boolean类型
      },
    },

      // 外汇还款币种
      pk_foreigncurr: {
        advanceKeys: {
          // 主表区域
          header: ["isforeign"], // 上游字段 受哪些字段控制
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { isforeign } = advanceObj.header;
          if (! isforeign.value) {
            return {
              value: null,
              display: null,
            };
          } 
        },
        isDisabled: (advanceObj) => {
          // 是否为禁用
          // 返回值为Boolean类型
          // 外汇还款
          let { isforeign } = advanceObj.header;
          if (isforeign && isforeign.value) {
            // 如果启用外汇还款
            return false;
          } else {
            return true;
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

      //外汇还款账户pk_foreignacct
        // 外汇还款币种
        pk_foreignacct: {
        advanceKeys: {
          // 主表区域
          header: ["isforeign"], // 上游字段 受哪些字段控制
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { isforeign } = advanceObj.header;
          if (! isforeign.value) {
            return {
              value: null,
              display: null,
            };
          } 
        },
        isDisabled: (advanceObj) => {
          // 是否为禁用
          // 返回值为Boolean类型
          // 外汇还款
          let { isforeign } = advanceObj.header;
          if (isforeign && isforeign.value) {
            // 如果启用外汇还款
            return false;
          } else {
            return true;
          }
        },
        isRequired: (advanceObj, newValue, oldValue) => {
          // 是否为必输项
          let {isforeign} = advanceObj.header;
          if(isforeign && isforeign.value){
            return true;
          } else {
            return false;
          }
          // 如果有组织字段 必输
          // 返回值为Boolean类型
        },
      },

      //外汇汇率foreignrate
      foreignrate: {
        advanceKeys: {
          // 主表区域
          header: ["isforeign"], // 上游字段 受哪些字段控制
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { isforeign } = advanceObj.header;
          if (! isforeign.value) {
            return {
              value: null,
              display: null,
            };
          } 
        },
        isDisabled: (advanceObj) => {
          // 是否为禁用
          // 返回值为Boolean类型
          // 外汇还款
          let { isforeign } = advanceObj.header;
          if (isforeign && isforeign.value) {
            // 如果启用外汇还款
            return false;
          } else {
            return true;
          }
        },
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },
      //外汇还款金额foreignamount
      foreignamount: {
        advanceKeys: {
          // 主表区域
          header: ["isforeign"], // 上游字段 受哪些字段控制
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { isforeign } = advanceObj.header;
          if (! isforeign.value) {
            return {
              value: null,
              display: null,
            };
          } 
        },
        isDisabled: (advanceObj) => {
          // 是否为禁用
          // 返回值为Boolean类型
          // 外汇还款
          let { isforeign } = advanceObj.header;
          if (isforeign && isforeign.value) {
            // 如果启用外汇还款
            return false;
          } else {
            return true;
          }
        },
      },


       //利息金额
       interest: {
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },

      //合同金额 
      contractamount: {
      advanceKeys: {
        // 主表区域
        header: ["pk_contract"], // 上游字段 合同编号
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { pk_contract } = advanceObj.header;
        if (pk_contract && pk_contract.value) {
          return {
            value: newValue.header.pk_contract.values.contractamount.value,
            display: newValue.header.pk_contract.values.contractamount.display,
          };
        }
        if (
          newValue &&
          newValue.header &&
          newValue.header.pk_contract &&
          newValue.header.pk_contract.value !== oldValue.header.pk_contract.value
        ) {
          // 如果合同编号修改，清空合同金额
          return {
            value: null,
            display: null,
          };
        }
      },
    },
      //授信释放额度
      payreleaseamount :{
        advanceKeys: {
          // 主表区域
          header: ["repayamount","ispayrelease"], // 还本本金金额、还本释放额度
        },
        value: (advanceObj, newValue, oldValue) => {
          let { repayamount } = advanceObj.header;
          let { ispayrelease } = advanceObj.header;
          // if (newValue &&
          //   newValue.header &&
          //   newValue.header.ispayrelease &&
          //   newValue.header.ispayrelease.value != "false" &&  newValue.header.repayamount && newValue.header.repayamount.value != 0) {
          if(!ispayrelease || !ispayrelease.value || !repayamount||repayamount.value == 0) {
            return {
              value: null,
              display: null,
            };
          }
        },  
        isDisabled: (advanceObj) => {
          // 是否为禁用
          // 返回值为Boolean类型
          let { repayamount } = advanceObj.header;
          let { ispayrelease } = advanceObj.header;
          if (ispayrelease && ispayrelease.value && (repayamount && (repayamount.value != 0))) {
            // 释放授信额度
            return !ispayrelease;
          } else {
            return true;
          }
        },
      },

      //授信币种
      pk_procurr: {
        advanceKeys: {
          // 主表区域
          header: ["pk_contract"], // 上游字段 合同
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { pk_contract } = advanceObj.header;
          if (pk_contract && pk_contract.value) {
            return {
              value: newValue.header.pk_contract.values.pk_currtype.value,
              display: newValue.header.pk_contract.values.pk_currtype.display,
            };
          } else {
            return {
              value: null,
              display: null,
            };
          }
      },
    },


    
    //   //业务组织
    //   pk_entrustorg: {
    //     advanceKeys: {
    //       // 主表区域
    //       header: ["pk_contract"], // 上游字段 合同
    //     },
    //     value: (advanceObj, newValue, oldValue) => {
    //       // 取值函数
    //       // 返回值为Object
    //       let { pk_contract } = advanceObj.header;
    //       if (pk_contract && pk_contract.value) {
    //         return {
    //           value: newValue.header.pk_contract.values.pk_entrustorg.value,
    //           display: newValue.header.pk_contract.values.pk_entrustorg.display,
    //         };
    //       } else {
    //         return {
    //           value: null,
    //           display: null,
    //         };
    //       }
    //   },
    // },


    
      //还本释放额度
      ispayrelease: {
        advanceKeys: {
          // 主表区域
          header: ["pk_procurr","pk_contract"], // 上游字段 合同
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { pk_contract } = advanceObj.header;
          if (pk_contract && pk_contract.value) {
            // return {
            //   value: newValue.header.pk_contract.values.ispayrelease.value,
            //   display: newValue.header.pk_contract.values.ispayrelease.display,
            // };
          } else {
            return {
              value: null,
              display: null,
            };
          }
        },
        isDisabled: (advanceObj) => {
          // 是否为禁用
          // 返回值为Boolean类型
          let { pk_procurr } = advanceObj.header;
          if (pk_procurr && pk_procurr.value) {
            return false;
          } else {
            return true;
          }
        },
    },

      //币种
      pk_currtype: {
        advanceKeys: {
          // 主表区域
          header: ["pk_contract"], // 上游字段 合同
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { pk_contract } = advanceObj.header;
          if (pk_contract && pk_contract.value) {
            return {
              value: newValue.header.pk_contract.values.pk_currtype.value,
              display: newValue.header.pk_contract.values.pk_currtype.display,
            };
          } 
          // if (
          //   newValue &&
          //   newValue.header &&
          //   newValue.header.pk_contract &&
          //   newValue.header.pk_contract.value !== oldValue.header.pk_contract.value
          // ) {
          //   // 如果授信协议修改，清空授信协议币种
          //   return {
          //     value: null,
          //     display: null,
          //   };
          // }
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
  return{
    repayplan: {
      //还款计划
      // pk_repayplan: {
      //   after: (newAfterData) => {
      //     // 编辑后事件请求成功后的事件处理函数
      //     // newAfterData必须返回
      //     return newAfterData;
      //   },
      // },

    // 应还本金额
    aprepayamount: {
      advanceKeys: {
        // 主表区域
        repayplan:[
          ['pk_repayplan']
        ], // 上游字段 受还款计划影响
      },

      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { pk_repayplan } = advanceObj.repayplan.values;
        if (pk_repayplan && pk_repayplan.value) {
          return {
            value: newValue.repayplan.pk_repayplan.value.values.preamount.value,
            display: newValue.repayplan.pk_repayplan.value.values.preamount.value,
          };
        } else {
          // 如果repayplan置空，应还本金额置空
          return {
            value: null,
            display: null,
          };
        }
      },
  },

        olcaprepayamount:{
          advanceKeys: {
            // 主表区域
            repayplan:[
              ['pk_repayplan']
            ], // 上游字段 受还款计划影响
          },
          value: (advanceObj, newValue, oldValue) => {
            let { pk_repayplan } = advanceObj.repayplan.values;
            if (!(pk_repayplan && pk_repayplan.value)) {
              return {
                value: null,
                display: null,
              };
            } 
          },
        },

//   aprepayamount: {
//     advanceKeys: {
//       // 子表区域
//       repayplan: [
//         ['pk_material'] // 货品劳务
//       ],
//     },
//     value: (advanceObj, newValue, oldValue) => {
//       let { pk_material } = advanceObj.contractinfo.values;
//       // 取值函数
//       if (
//       newValue &&
//         newValue.contractinfo &&
//         newValue.contractinfo.pk_material &&
//         newValue.contractinfo.pk_material.value !== oldValue.contractinfo.pk_material.value
//       ) {
//         if(!(pk_material && pk_material.value)){
//         return {
//           value: null,
//           display: null
//           };
//         } else {
//         return {
//         value: newValue.contractinfo.pk_material.value.values.pk_measdoc.value,
//           display: newValue.contractinfo.pk_material.value.values.measdoc_name.value
//         };
//       }
//       }    
//     }
//   },

      //实际还本金额
      repayamount: {
        advanceKeys: {
          // 主表区域
          repayplan:[
            ['pk_repayplan']
          ], // 上游字段 受还款计划影响
        },
  
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { pk_repayplan } = advanceObj.repayplan.values;
          if (pk_repayplan && pk_repayplan.value && newValue.repayplan.repayamount.value == oldValue.repayplan.repayamount.value) {
            return {
              value: newValue.repayplan.pk_repayplan.value.values.preamount.value,
              display: newValue.repayplan.pk_repayplan.value.values.preamount.value,
            };
          } 
        },
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },
    

    }
  }
}
