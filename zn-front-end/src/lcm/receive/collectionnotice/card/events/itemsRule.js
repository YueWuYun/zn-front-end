
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
      // isDisabled: isChange || isEdit || isCopy, // 变更态 或 修改态 或复制态
      // after: (newAfterData) => {
      //   // 编辑后事件请求成功后的事件处理函数
      //   // newAfterData必须返回
      //   return newAfterData;
      // },
    },

    // 拒付原因
    nopayreason: {
      advanceKeys: {
        // 主表区域
        header: ["committype"], // 承付类型
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { committype } = advanceObj.header;
        if (!(committype && committype.value === "4" && status != "confirmcollect")) {
          return {
            value: null,
            display: null,
          };
        } 
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 承付类型
        let { committype } = advanceObj.header;
        //拒付 4
        if (committype && committype.value === "4" && status != "confirmcollect") {
          // 如果承付类型是拒付 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },


    // 预计收款日期
    precollectdate: {
      advanceKeys: {
        // 主表区域
        header: ["committype"], // 承付类型
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { committype } = advanceObj.header;
        if (committype && committype.value === "4") {
          return {
            value: null,
            display: null,
          };
        } 
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        let { committype } = advanceObj.header;
        // 是否为必输项
        // 返回值为Boolean类型
        if(committype && committype.value != "4" && status != "confirmcollect"){
          return true;
        }
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 承付类型
        let { committype } = advanceObj.header;
        if (committype && committype.value != "4" && status != "confirmcollect") {
          // 如果承付类型是拒付 启用 不可编辑
          return false;
        } else {
          return true;
        }
      },
    },


    // 预计收款金额
    precolaptamount: {
      advanceKeys: {
        // 主表区域
        header: ["committype"], // 承付类型
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { committype } = advanceObj.header;
        if (committype && committype.value == "4") {
          return {
            value: null,
            display: null,
          };
        } 
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 承付类型
        let { committype } = advanceObj.header;
        if (committype && committype.value != "4" && status != "confirmcollect") {
          // 如果承付类型是拒付 启用 不可编辑
          return false;
        } else {
          return true;
        }
      },
    },


    // 承付类型
    committype: {
      isDisabled: (advanceObj) => {
        if (status === "confirmcollect") {
          // 如果是确认收款编辑页面，则不可编辑
          return true;
        } else {
          return false;
        }
      },
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },


    // // 收款金额
    // sumcollectamount: {
    //   // isRequired: (advanceObj, newValue, oldValue) => {
    //   //   // 是否为必输项
    //   //   // 返回值为Boolean类型
    //   //   if(status === "confirmcollect"){
    //   //     return true;
    //   //   }
    //   // },
    //   advanceKeys: {
    //     // 主表区域
    //     header: ["sumcollectamount"], // 收款金额
    //   },
    //   isDisabled: (advanceObj) => {
    //     // 是否为禁用
    //     // 返回值为Boolean类型
    //     // 收款金额

    //     let { sumcollectamount } = advanceObj.header;
    //     if ((sumcollectamount && sumcollectamount.value) || status === "confirmcollect") {
    //       // 如果收款金额有值 启用 可编辑
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   after: (newAfterData) => {
    //     // 编辑后事件请求成功后的事件处理函数
    //     // newAfterData必须返回
    //     return newAfterData;
    //   },
    // },

    // sumcollectolcamount: {
    //   isDisabled: (advanceObj) => {
    //     // 是否为禁用
    //     return true;
    //   },
    // },

    // actualremitolcamount: {
    //   isDisabled: (advanceObj) => {
    //     // 是否为禁用
    //     return true;
    //   },
    // },


    // docbillrepayolcamount: {
    //   isDisabled: (advanceObj) => {
    //     // 是否为禁用
    //     return true;
    //   },
    // },

    // olcpoundageamount: {
    //   isDisabled: (advanceObj) => {
    //     // 是否为禁用
    //     return true;
    //   },
    // },

    // // 组织本币汇率
    // olcrate: {
    //   isDisabled: (advanceObj) => {
    //     // 是否为禁用
    //     // 返回值为Boolean类型
    //     return true;
    //   },
    // },

    // 手续费
    poundageamount: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },

    // 实收现汇金额
    actualremitamount: {
          advanceKeys: {
            // 主表区域
            header: ["sumcollectamount"], // 收款金额
          },
          value: (advanceObj, newValue, oldValue) => {
          if(newValue.header.actualremitamount.value === ""){
          return {
            value: "0",
            display: null,
          }
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        let { sumcollectamount } = advanceObj.header;
        // 是否为必输项
        // 返回值为Boolean类型
        if(sumcollectamount && sumcollectamount.value || status === "confirmcollect"){
          return true;
        }
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 收款金额
        let { sumcollectamount } = advanceObj.header;
        if (sumcollectamount && sumcollectamount.value || status === "confirmcollect") {
          // 如果收款金额有值 启用 可编辑
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

    // docbillrepayamount
    // 押汇还款金额
    docbillrepayamount: {
      advanceKeys: {
        // 主表区域
        header: ["isdocubills","sumcollectamount"], // 是否押汇
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 是否押汇
        let { isdocubills } = advanceObj.header;
        let { sumcollectamount } = advanceObj.header;
        if (isdocubills && isdocubills.value && sumcollectamount && sumcollectamount.value && sumcollectamount.value!=0) {
          // 如果收款金额有值 启用 可编辑
          return !isdocubills.value;
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
  

    


    // 实际收款日期
    actualcollectdate: {
      advanceKeys: {
        // 主表区域
        header: ["sumcollectamount"], // 收款金额
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 收款金额

        let { sumcollectamount } = advanceObj.header;
        if ((sumcollectamount && sumcollectamount.value) || status === "confirmcollect") {
          // 如果收款金额有值 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },


    // 收款账户
    collectaccount: {
      advanceKeys: {
        // 主表区域
        header: ["actualremitamount"], // 实汇收款金额
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { actualremitamount } = advanceObj.header;
        if (!(actualremitamount && actualremitamount.value != 0)) {
          return {
            value: null,
            display: null,
          };
        } else {
          return {
            value: newValue.header.collectaccount.value,
            display: newValue.header.collectaccount.value,
          };
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        let { actualremitamount } = advanceObj.header;
        // 是否为必输项
        //  实汇收款金额
        if(actualremitamount && actualremitamount.value && actualremitamount.value !=0){
          return true;
        }
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        //  实汇收款金额
        let { actualremitamount } = advanceObj.header;
        if (actualremitamount && actualremitamount.value && actualremitamount.value!=0) {
          // 如果 实汇收款金额有值 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },

    // 收款计划项目
    collectplan: {
      advanceKeys: {
        // 主表区域
        header: ["sumcollectamount"], // 收款金额相关
      },
      isDisabled: (advanceObj) => {
        // 是否为禁用
        // 返回值为Boolean类型
        // 收款金额
        let { sumcollectamount } = advanceObj.header;
        if (sumcollectamount && sumcollectamount.value) {
          // 如果收款金额有值 启用 可编辑
          return false;
        } else {
          return true;
        }
      },
    },

    // // 期初
    // isinitial: {
    //   isDisabled: (advanceObj, newValue, oldValue) => {
    //     // 取值函数
    //     // 返回值为Object
    //     if (newValue.header.isinitial.value != oldValue.header.isinitial.value) {
    //       return false;
    //     }
    //     if(!newValue.header.isinitial.value){
    //       return true;
    //     } 
    //   },
    // },

      // 部门
      pk_dept: {
      isDisabled: (advanceObj) => {
        if (status === "confirmcollect") {
          // 如果是确认收款编辑页面，则不可编辑
          return true;
        } else {
          return false;
        }
      },
    },

      // 业务员
      pk_busipersion: {
      isDisabled: (advanceObj) => {
        if (status === "confirmcollect") {
          // 如果是确认收款编辑页面，则不可编辑
          return true;
        } else {
          return false;
        }
      },
    },

      // 承付日期
      commitdate: {
        isDisabled: (advanceObj) => {
          if (status === "confirmcollect") {
            // 如果是确认收款编辑页面，则不可编辑
            return true;
          } else {
            return false;
          }
        },
      },

      // 票据号
      billno: {
        advanceKeys: {
          // 主表区域
          header: ["committype"], // 承付类型
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { committype } = advanceObj.header;
          if (committype && committype.value != "3") {
            return {
              value: null,
              display: null,
            };
          } 
        },
        isRequired: (advanceObj, newValue, oldValue) => {
          let { committype } = advanceObj.header;
          // 是否为必输项
          // 返回值为Boolean类型
          if(committype && committype.value == "3"){
            return true;
          }
        },
        isDisabled: (advanceObj) => {
          // 是否为禁用
          // 返回值为Boolean类型
          // 承付类型
          let { committype } = advanceObj.header;
          if (committype && committype.value == "3") {
            // 如果承付类型是拒付 启用 不可编辑
            return false;
          } else {
            return true;
          }
        },
      },

    //       // 收证日期
    // collectregdate: {
      
    //   value: (advanceObj, newValue, oldValue) => {
    //     // 取值函数
    //     // 返回值为Object
    //     let status = this.props.getUrlParam("status");
    //     let businessInfo = getBusinessInfo();
    //     let date = businessInfo.businessDate;
    //     if (status === "confirmcollect") {
    //       return {
    //         value: date,
    //         display: date,
    //       };
    //     } 
    //   },
    // },

    // // 收证人
    // collectregistrant: {
    //   value: (advanceObj, newValue, oldValue) => {
    //     // 取值函数
    //     // 返回值为Object
    //     let  status = this.props.getUrlParam("status");
    //     let businessInfo = getBusinessInfo();
    //     let collectregistrant = businessInfo.userId ;
    //     if (status === "confirmcollect") {
    //       return {
    //         value: collectregistrant,
    //         display: collectregistrant,
    //       };
    //     } 
    //   },
    // },
        // 组织本币汇率
        olcrate: {
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

  };
}

/**
 * table区域字段规则
 */
export function tableItemsRule() {
  let status = this.props.getUrlParam("status");
  return{
    contractinfo: {
      // 收款金额
      collectamount: {
        advanceKeys: {
          // 主表区域
          header: ["committype"], // 承付类型
        },
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          let { committype } = advanceObj.header;
          if (committype && committype.value === "4") {
            return {
              value: null,
              display: null,
            };
          } 
          if(newValue.contractinfo.collectamount.value === ""){
            return {
              value: "0",
              display: null,
            }
          }
        },
        isRequired: (advanceObj, newValue, oldValue) => {
          // 是否为必输项
          // 返回值为Boolean类型
          if(status === "confirmcollect"){
            return true;
          }
        },

        isDisabled: (advanceObj) => {
          // 是否为禁用
          // 返回值为Boolean类型
          // 承付类型
          if(status === "confirmcollect"){
            return false;
          }
        },

        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },

      // 组织本币汇率
      olcrate: {
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
      },

      // // 组织本币汇率
      // olcrate: {
      //   after: (newAfterData) => {
      //     // 编辑后事件请求成功后的事件处理函数
      //     // newAfterData必须返回
      //     return newAfterData;
      //   },
      // },


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

    // // 组织本币汇率
    // olcrate: {
    //   isRequired: (advanceObj, newValue, oldValue) => {
    //     // 是否为必输项
    //     // 返回值为Boolean类型
    //     if(status === "confirmcollect"){
    //       return true;
    //     }
    //   },
    // },



    }
  }
}
