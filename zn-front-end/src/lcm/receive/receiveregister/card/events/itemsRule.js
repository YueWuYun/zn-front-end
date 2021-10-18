import * as card from "../../../../public/container/card";
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
      
      isDisabled: isEdit || isCopy, // 修改态 或复制态
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    // 业务组织
    pk_entrustorg: {          
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //货品/劳务
    goodsorlabor: {      
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //货品分类
    itemtype: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //收证日期
    receivedate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //开证日期
    billdate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //信用证有效期
    validdate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },            
    //客户
    customer: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //信用证币种
    pk_lccurrtype: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //组织本币汇率
    olcrate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //集团本币汇率
    glcrate: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //全局本币汇率
    gllcrate: {
        after: (newAfterData) => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData必须返回
          return newAfterData;
        },
    },
    //通知行
    pk_advisingbank: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //收证行
    pk_receivebank: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //议付行
    pk_negotiatedbank: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //收证计划项目
    pk_planitem: {
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //部门
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
    //业务员
    pk_busipersion: {
      advanceKeys: {
        // 主表区域
        header: [
          ["pk_entrustorg"], // 业务组织
        ],
        // 主表区域
        header: [
          ["pk_dept"], // 部门
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
        
        if (newValue &&
          newValue.header &&
          newValue.header.pk_dept &&
          newValue.header.pk_dept.value !== oldValue.header.pk_dept.value) {
            return{
              value: null,
              display: null,
            }
        } 
      },
    },

    //延期方式：仅当“兑付方式”为“延期付款”时，延期方式、远期天数 才可编辑
    postponetype: {
			advanceKeys: {
				// 主表区域
				header: [ 'paytype' ] // 延期方式
      },
      
			isDisabled: (advanceObj) => {
				let { paytype } = advanceObj.header;
				return !(paytype && paytype.value === '4');
			},
			isRequired: (advanceObj) => {
				// 可编辑即必填
				let { paytype } = advanceObj.header;
				return paytype && paytype.value === '4';
			},
      value: (advanceObj, newValue, oldValue) => {
        let { paytype } = advanceObj.header;
				//  延期方式不可编辑状态下需要将值置空
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
        }else {
					return {
						value: "1",
						display: "1"
					};
				}
			}      
      
    },
		// 延期方式为特别指定日期 1.远期天数为不可编辑、非必填，值为空
		// 远期天数： 可编辑、必填 赋空值
		futuredays: {
			advanceKeys: {
				// 主表区域
				header: [ 'postponetype', 'paytype' ] // 延期方式
			},
			isDisabled: (advanceObj) => {
				let { postponetype, paytype } = advanceObj.header;
				let isDisabled = true; // 默认不可编辑
				// 兑付延期并且延期方式非特别指定日期 可编辑
				if (paytype && paytype.value === '4' && !(postponetype && postponetype.value === '3')) {
					isDisabled = false;
				}
				return isDisabled;
			},
			isRequired: (advanceObj) => {
				let { postponetype, paytype } = advanceObj.header;
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
		// 特别指定日期：非 2.指定日期 不可编辑、非必填，值为空
		specifydate: {
			advanceKeys: {
				// 主表区域
				header: [ 'postponetype' ] // 延期方式
			},
			isDisabled: (advanceObj) => {
				let { postponetype } = advanceObj.header;
				return !(postponetype && postponetype.value === '3');
			},
			isRequired: (advanceObj) => {
				let { postponetype } = advanceObj.header;
				return postponetype && postponetype.value === '3';
			},
			value: (advanceObj) => {
				let { postponetype } = advanceObj.header;
				if(!(postponetype && postponetype.value === '3')){
					//  置空
          return {
            value: null,
            display: null
          };
				}
			}
		},
    //上浮比例
    overscale : {
		advanceKeys: {
		  // 主表区域
		  header: ["isoverflow"], // 上游字段 受哪些字段控制 溢短装
		},
		value: (advanceObj, newValue, oldValue) => {
		  // 取值函数
		  // 返回值为Object
		  let { isoverflow } = advanceObj.header;
		  if(!isoverflow.value){
			return {
			  value: null,
			  display: null,
			};
		  }
		},
		isRequired: (advanceObj, newValue, oldValue) => {
		  // 是否为必输项
		  // 返回值为Boolean类型
		  let { isoverflow } = advanceObj.header;
		  if(isoverflow.value){
			return true;
		  }else{
			return false;
		  }
		},
		isDisabled: (advanceObj, newValue, oldValue) => {
		  // 是否为必输项
		  // 返回值为Boolean类型
		  let { isoverflow } = advanceObj.header;
		  if(isoverflow.value){//延期付款
			return false;
		  }else{
			return true;
		  }
		}
	  },
	  //下浮比例
	  lowscale : {
		advanceKeys: {
		  // 主表区域
		  header: ["isoverflow"], // 上游字段 受哪些字段控制 溢短装
		},
		value: (advanceObj, newValue, oldValue) => {
		  // 取值函数
		  // 返回值为Object
		  let { isoverflow } = advanceObj.header;
		  if(!isoverflow.value){
			return {
			  value: null,
			  display: null,
			};
		  }
		},
		isRequired: (advanceObj, newValue, oldValue) => {
		  // 是否为必输项
		  // 返回值为Boolean类型
		  let { isoverflow } = advanceObj.header;
		  if(isoverflow.value){
			return true;
		  }else{
			return false;
		  }
		},
		isDisabled: (advanceObj, newValue, oldValue) => {
		  // 是否为必输项
		  // 返回值为Boolean类型
		  let { isoverflow } = advanceObj.header;
		  if(isoverflow.value){
			return false;
		  }else{
			return true;
		  }
		}
	  }
   
  };
}

/**
 * table区域字段规则
 */
export function tableItemsRule() {
  // 业务状态
  let status = this.props.getUrlParam("status");
  let id = this.props.getUrlParam("id");
  let isEdit = id && status === "edit"; // 编辑态
  let isAdd = status === "add"; // 新增态
  return {
    // 合同明细
    contractinfo: {
      // 货品分类
      pk_marbasclass: {
        advanceKeys: {
          // 主表区域
          header: [
            "begindate" // 开始日期
          ]
        }, // 上游字段 受哪些字段控制
        value: (advanceObj, newValue, oldValue) => {
          // 取值函数
          // 返回值为Object
          if (
            newValue &&
            newValue.payplan &&
            newValue.payplan.paydate &&
            newValue.payplan.paydate.value !== oldValue.payplan.paydate.value
          ) {
            // 如果自行设置值，则返回该值
            return newValue.payplan.paydate;
          }

          return advanceObj["header"]["begindate"];
        },
        
      },
      // 货品/劳务
      pk_material: {        
        after: newAfterData => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData为子表所有数据 必须返回
          return newAfterData;
        }
      },
      // 计量单位
			measure: {
				advanceKeys: {
					// 子表区域
					contractinfo: [
						['pk_material'] // 货品劳务
					]
				},
				value: (advanceObj, newValue, oldValue) => {		
					// 取值函数
					if (
						newValue &&
						newValue.contractinfo &&
						newValue.contractinfo.pk_material &&
						newValue.contractinfo.pk_material.value !== oldValue.contractinfo.pk_material.value
					) {
						return {
                value: newValue.contractinfo.pk_material.value.values.pk_measdoc.value,
                display: newValue.contractinfo.pk_material.value.values.measdoc_name.value
            };
					}
					
                    
				}
			},
      // 数量
      quantity: {
				advanceKeys: {
					// 子表区域
					contractinfo: [
						['pk_material'] // 货品劳务
					]
				},
				value: (advanceObj, newValue, oldValue) => {
					// 取值函数
					if (
						newValue &&
						newValue.contractinfo &&
						newValue.contractinfo.pk_material &&
						newValue.contractinfo.pk_material.value !== oldValue.contractinfo.pk_material.value
					) {
						return {
							value: null,
							display: null
						};
					}
				},
				after: (newAfterData) => { // 编辑后事件 数量走编辑后给信用证金额赋值
					return newAfterData;
				}
			},
      // 单价
      unitprice: {        
        after: newAfterData => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData为子表所有数据 必须返回
          return newAfterData;
        }
       },      
      // 金额
      amount: {        
        after: newAfterData => {
          // 编辑后事件请求成功后的事件处理函数
          // newAfterData为子表所有数据 必须返回
          return newAfterData;
        }
       } 
       
    }

  };    
     
}
