/**
 * form区域字段规则
 */

export function formItemsRule() {
  return {
    // 财务组织
    pk_org: {
      isDisabled: true, // 变更态 或 修改态 或复制态
      after: (newAfterData) => {
        // 编辑后事件请求成功后的事件处理函数
        // newAfterData必须返回
        return newAfterData;
      },
    },
    //延期方式
    postponetype : {
      advanceKeys: {
        // 主表区域
        header: ["paytype"], // 上游字段 受哪些字段控制 兑付方式
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { paytype } = advanceObj.header;
        if(paytype.value != "4"){//延期付款
          return {
            value: null,
            display: null,
          };
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let { paytype } = advanceObj.header;
        if(paytype.value === "4"){//延期付款
          return true;
        }else{
          return false;
        }
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let { paytype } = advanceObj.header;
        if(paytype.value === "4"){//延期付款
          return false;
        }else{
          return true;
        }
      },
    },
    //特别指定日期 
    specifydate : {
      advanceKeys: {
        // 主表区域
        header: ["postponetype"], // 上游字段 受哪些字段控制 延期方式
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { postponetype } = advanceObj.header;
        if(postponetype && postponetype.value != "3"){//特别指定日期
          return {
            value: null,
            display: null,
          };
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let { postponetype } = advanceObj.header;
        if(postponetype && postponetype.value === "3"){//特别指定日期
          return true;
        }else{
          return false;
        }
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let { postponetype } = advanceObj.header;
        if(postponetype && postponetype.value === "3"){//特别指定日期
          return false;
        }else{
          return true;
        }
      },
    },
    //远期天数
    futuredays : {
      advanceKeys: {
        // 主表区域
        header: ["paytype","postponetype"], // 上游字段 受哪些字段控制 兑付方式 延期方式
      },
      value: (advanceObj, newValue, oldValue) => {
        // 取值函数
        // 返回值为Object
        let { paytype, postponetype } = advanceObj.header;
        if(paytype && paytype.value != "4"){ //延期付款
          return {
            value: null,
            display: null,
          };
        }
      },
      isRequired: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let { paytype, postponetype } = advanceObj.header;
        if(paytype.value === "4" && postponetype && postponetype.value != "3"){//延期付款
          return true;
        }else{
          return false;
        }
      },
      isDisabled: (advanceObj, newValue, oldValue) => {
        // 是否为必输项
        // 返回值为Boolean类型
        let { paytype } = advanceObj.header;
        if(paytype.value === "4"){//延期付款
          return false;
        }else{
          return true;
        }
      },
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
export function tableItemsRule() {}
