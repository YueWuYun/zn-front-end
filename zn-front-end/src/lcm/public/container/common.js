/*
    卡片/列表公共函数（与业务无关）
*/
import {
  ajax,
  toast,
  print,
  cacheTools,
  pageTo
} from "nc-lightapp-front";
import {
  card
} from "./index";

// 按钮操作名称
export const OPR_NAME = {
  commit: "3617PUB-000010" /* 国际化处理： 提交 */ ,
  uncommit: "3617PUB-000018" /* 国际化处理： 收回 */ ,
  delete: "3617PUB-000011" /* 国际化处理： 删除 */ ,
  terminate: "3617PUB-000014" /* 国际化处理： 终止 */ ,
  unterminate: "3617PUB-000015" /* 国际化处理： 取消终止 */ ,
  save: "3617PUB-000030" /* 国际化处理： 保存 */ ,
  saveCommit: "3617PUB-000030" /* 国际化处理： 保存 */ ,
  saveAdd: "3617PUB-000032" /* 国际化处理  保存新增 */ ,
  change: "3617PUB-000031" /* 国际化处理： 变更 */ ,
  deleteversion: "3617PUB-000019" /* 国际化处理： 删除版本 */ ,
  bookkeeping: "3617PUB-000035" /* 国际化处理： 记账 */ ,
  unbookkeeping: "3617PUB-000036" /* 国际化处理： 取消记账 */ ,
  honour: "3617PUB-000053" /* 国际化处理： 承付 */ ,
  cancelhonour: "3617PUB-000054" /* 国际化处理： 取消承付 */ ,
  makeVoucher: "3617PUB-000065" /* 国际化处理： 制证 */ ,
  cancelVoucher: "3617PUB-000066" /* 国际化处理： 取消制证 */ ,
  close: "3617PUB-000008" /* 国际化处理： 关闭成功 */ ,
  logout: "3617PUB-000059" /* 国际化处理： 注销成功 */ ,
  cancelconfirmcollect: "3617PUB-000064" /* 国际化处理： 取消确认收款成功 */ ,
  batchedit:"3617PUB-000075" /* 国际化处理： 批改 */ ,
  invoice:"3617PUB-000076" /* 国际化处理： 发票登记 */ ,
};

/**
 * 按钮接口操作 需要使用call调用。调用的接口需要在constant.js中定义
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
export function api(params) {
  let {
    name,
    data,
    success,
    error
  } = params;
  let {
    BillConfig
  } = this.props;
  ajax({
    url: BillConfig.API_URL[name],
    // async: false,
    data,
    success: (res) => {
      success && success(res);
    },
  });
}

/**
 * 打印
 *
 * @param {*} pks - 数组类型pk
 */
export function printFn(pks) {
  let {
    BillConfig
  } = this.props;
  print("pdf", BillConfig.API_URL.print, {
    appcode: BillConfig.appcode,
    nodekey: null,
    oids: pks,
  });
}

/**
 * 输出
 *
 * @param {*} pks - 数据主键
 */
export function output(pks) {
  let {
    BillConfig
  } = this.props;
  this.setState({
      outputData: {
        nodekey: BillConfig.nodekey, // 打印节点key
        oids: pks, // 要打印的pks
        outputType: "output", // 输出类型
      },
    },
    () => {
      this.refs.printOutput.open();
    }
  );
}

/**
 * 附件管理
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
export function fileMgr(billId, billNo) {
  this.setState({
    showUploader: !this.state.showUploader,
    billInfo: {
      billId,
      billNo
    },
  });
}

/**
 *
 * @param {*} props
 * @param {*} {
 *     url, 联查应用地址
 *     status = 'browse', 页面编辑状态，默认浏览态
 *     appcode, 小应用编码
 *     pagecode, 页面编码
 *     scene, 场景名称，默认联查
 *     id 被联查单据主键
 * }
 */
export function linkApp(
  props, {
    url,
    status = "browse",
    appcode,
    pagecode,
    scene = "linksce",
    id,
    billtype,
    ...other
  }
) {
  pageTo.openTo(url, {
    status,
    appcode,
    pagecode,
    scene,
    id,
    billtype,
    ...other,
  });
}

/*
    ====================联查====================
*/

/**
 * 联查审批详情
 * @param {Object} record - 列表选中行数据
 */
export function linkApproveDetail(record) {
  let {
    BillConfig,
    FormConfig,
    form: formUtil
  } = this.props;
  let billId;
  if (record) {
    // 列表页操作
    billId = record.data.values[BillConfig.primaryId];
  } else {
    // 卡片页操作
    billId = formUtil.getFormItemsValue(
      FormConfig.formId,
      BillConfig.primaryId
    );
  }
  billId = billId && billId.value;
  if (!billId) {
    toast({
      color: "warning",
      content: `${this.state.baseMultiLangData["3617PUB-000038"]}${BillConfig.primaryId}${this.state.baseMultiLangData["3617PUB-000039"]}`,
      /* 国际化处理 该单据主键[pk]对应的value无值 */
    });
  }
  this.setState({
    showApproveDetail: true,
    billInfo: {
      billId
    },
  });
}
/**
 * 反联查单据公共方法
 * @param {String} name - 联查名称
 * @param {Object} record - 列表选中行数据
 */
export function linkBillWithoutTargetPk(name, record) {
  let {
    BillConfig,
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  let {
    params,
    url,
    appcode,
    pagecode,
    billtype,
    linkurl
  } = LinkConfig[name];
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000044"]}` /* 国际化处理 该字段[key]不存在 */ ,
      });
      return;
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000039"]}` /* 国际化处理 该字段[key]对应的value无值 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  data = Object.assign(data, {
    billtype: billtype
  });
  api.call(this, {
    name: linkurl,
    data,
    success: (res) => {
      let {
        success
      } = res;
      let resData = res.data;
      if (!resData.flag) {
        toast({
          color: "warning",
          content: this.state.baseMultiLangData[
            "3617PUB-000051"
          ] /* 国际化处理 该单据无相关联数据信息 */ ,
        });
        return;
      }
      if (success) {
        linkApp(this.props, {
          url,
          appcode,
          pagecode,
          billtype,
          ...resData,
        });
      }
    },
  });
}

/**
 * 联查目标单据单据公共方法 - 目标单据pk已包含在本单据中
 * @param {String} name - name联查名称
 * @param {Object} record - 列表选中行数据
 */
export function linkBillWithTargetPk(name, record) {
  let {
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  const {
    [name]: linkItem
  } = LinkConfig;
  if (!linkItem) {
    toast({
      color: "warning",
      content: `${this.state.baseMultiLangData["3617PUB-000055"]}${name}${this.state.baseMultiLangData["3617PUB-000044"]}` /* 国际化处理 您的linkConfig中，名为[key]的联查配置不存在 */ ,
    });
    return;
  }
  let {
    params,
    url,
    appcode,
    pagecode,
    billtype
  } = linkItem;
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000044"]}` /* 国际化处理 该字段[key]不存在 */ ,
      });
      return;
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000051"]}` /* 国际化处理 该单据无相关联数据信息 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  linkApp(this.props, {
    url,
    appcode,
    pagecode,
    billtype,
    ...data,
  });
}

/**
 * 押汇申请多联查 - 目标单据pk已包含在本单据中
 * @param {String} name - name联查名称
 * @param {String} srcBilll - 来源单据类型
 * @param {Object} record - 列表选中行数据
 */
export function linkDocuBillWithTargetPk(name, srcBill, record) {
  let {
    FormConfig,
    form: formUtil,
    LinkConfig
  } = this.props;
  const {
    [name]: linkItem
  } = LinkConfig;
  if (!linkItem) {
    toast({
      color: "warning",
      content: `${this.state.baseMultiLangData["3617PUB-000055"]}${name}${this.state.baseMultiLangData["3617PUB-000044"]}` /* 国际化处理 您的linkConfig中，名为[key]的联查配置不存在 */ ,
    });
    return;
  }
  let data = {};
  let {
    params,
    url,
    appcode,
    pagecode
  } = linkItem[srcBill]
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000044"]}` /* 国际化处理 该字段[key]不存在 */ ,
      });
      return;
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000039"]}` /* 国际化处理 该字段[key]对应的value无值 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  linkApp(this.props, {
    url,
    appcode,
    pagecode,
    billtype: null,
    ...data,
  });
}

/**
 * 联查担保合同
 * @param {Object} record - 列表选中行数据
 */
export function linkGuarantyContract(record) {
  let {
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  const {
    GuarantyContract
  } = LinkConfig;
  if (!GuarantyContract) return;
  let {
    params,
    url,
    appcode,
    pagecode,
    billtype
  } = GuarantyContract;
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: this.state.baseMultiLangData[
          "3617PUB-000040"
        ] /* 国际化处理 该单据无担保合同单可联查 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  if (data.guaranteetype === "CREDIT") {
    // 如果担保方式为信用
    toast({
      color: "warning",
      content: this.state.baseMultiLangData[
        "3617PUB-000040"
      ] /* 国际化处理 该单据无担保合同单可联查 */ ,
    });
    return;
  }
  linkApp(this.props, {
    url,
    appcode,
    pagecode,
    billtype,
    ...data,
  });
}

/**
 * 联查利率
 * @param {Object} record - 列表选中行数据
 */
export function linkInterestrate(record) {
  let {
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  const {
    Interestrate
  } = LinkConfig;
  if (!Interestrate) return;
  const page_config = {
    "2": {
      url: "/tmpub/pub/interestrate_global/main/index.html#/card", // 联查跳转地址
      appcode: "36010IRC", // 应用编码
      pagecode: "36010IRC_CARD", // 页面编码
    },
    "1": {
      url: "/tmpub/pub/interestrate_group/main/index.html#/card", // 联查跳转地址
      appcode: "36010IRCG", // 应用编码
      pagecode: "36010IRCG_CARD", // 页面编码
    },
    "0": {
      url: "/tmpub/pub/interestrate_org/main/index.html#/card", // 联查跳转地址
      appcode: "36010IRCO", // 应用编码
      pagecode: "36010IRCO_CARD", // 页面编码
    },
  };
  let {
    params,
    billtype
  } = Interestrate;
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: this.state.baseMultiLangData[
          "3617PUB-000041"
        ] /* 国际化处理 该单据无利率可联查 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  ajax({
    url: "/nccloud/tmpub/tmbd/linkinterest.do", // 联查利率类型
    data: {
      pk: data.id
    },
    success: (res) => {
      if (res.success) {
        let {
          rateclass
        } = res.data;
        if (!rateclass) {
          toast({
            color: "warning",
            content: this.state.baseMultiLangData[
              "3617PUB-000041"
            ] /* 国际化处理 该单据无利率可联查 */ ,
          });
          return;
        }
        let {
          url,
          appcode,
          pagecode
        } = page_config[rateclass];
        linkApp(this.props, {
          url,
          appcode,
          pagecode,
          billtype,
          ...data,
        });
      }
    },
  });
}

/**
 * 联查结息日
 * @param {Object} record - 列表选中行数据
 */
export function linkInterestday(record) {
  let {
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  const {
    Interestday
  } = LinkConfig;
  if (!Interestday) return;
  let {
    params,
    url,
    appcode,
    pagecode,
    billtype
  } = Interestday;
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: this.state.baseMultiLangData[
          "3617PUB-000042"
        ] /* 国际化处理 该单据无结息日可联查 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  linkApp(this.props, {
    url,
    appcode,
    pagecode,
    billtype,
    ...data,
  });
}

/**
 * 联查凭证
 * @param {Object} record - 列表选中行数据
 */
export function linkVoucher(record) {
  let {
    BillConfig
  } = this.props;
  let {
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  const {
    Voucher
  } = LinkConfig;
  if (!Voucher) return;
  let {
    params,
    url,
    appcode,
    pagecode
  } = Voucher;
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000044"]}` /* 国际化处理 该字段[key]不存在 */ ,
      });
      return;
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000039"]}` /* 国际化处理 该字段[key]对应的value无值 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  let relationID;
  if (record) {
    // 列表操作
    relationID = record.data.values[BillConfig.primaryId];
  } else {
    relationID = formUtil.getFormItemsValue(
      FormConfig.formId,
      BillConfig.primaryId
    );
  }
  relationID = relationID && relationID.value;
  data.relationID = relationID;
  data.pk_billtype = BillConfig.billtype; // 单据类型
  data = [data];
  ajax({
    url,
    data,
    success: (res) => {
      if (res.success) {
        let srcCode = res.data.src;
        if ("_LinkVouchar2019" == srcCode) {
          //走联查
          if (res.data.des) {
            //跳转到凭证界面
            if (res.data.pklist) {
              let {
                url,
                appcode,
                pagecode,
                pklist
              } = res.data;
              let params = {};
              if (res.data.pklist.length == 1) {
                //单笔联查
                params.id = pklist[0];
                params.backflag = "noback";
              } else {
                //多笔联查
                cacheTools.set("checkedData", pklist);
              }
              linkApp(this.props, {
                url,
                appcode,
                pagecode,
                billtype: BillConfig.billtype,
                n: this.state.baseMultiLangData["3617PUB-000017"], //  联查凭证
                ...params,
              });
            }
          }
        } else {
          //跳转到会计平台 这里的appcode是业务组的小应用编码
          //cacheTools.set(appcode + srcCode, res.data.pklist);
          toast({
            color: "warning",
            content: this.state.baseMultiLangData["3617PUB-000037"],
          }); /* 未联查到凭证 */
          return;
        }
      }
    },
  });
}

/**
 * 凭证联查单据
 * @param {*} url - 请求地址
 * @param {*} data - 请求数据
 * @param {*} tableCode - 表格区域编码
 * @param {*} primaryId - 页面主键
 */
export function voucherLinkBill(url, data, tableCode, primaryId) {
  if (data.operatingLogVO && data.operatingLogVO.length > 0) {
    ajax({
      url,
      data,
      success: (res) => {
        let {
          success,
          data
        } = res;
        if (success && data) {
          let rowlength = data[tableCode].rows;
          if (rowlength.length == 1) {
            let record = rowlength[0];
            //1条数据跳转到卡片页面
            this.props.pushTo("/card", {
              status: "browse",
              id: record.values[primaryId] && record.values[primaryId].value,
              scene: "linksce",
            });
          } else {
            //多条数据跳转到列表页面
            this.props.table.setAllTableData(tableCode, data[tableCode]);
            // 设置scene为 linksce 供卡片页使用
            this.props.setUrlParam({
              scene: "linksce"
            });
          }
        } else {
          // 如果为false 置空表格数据
          this.props.table.setAllTableData(tableCode, {
            rows: [],
          });
        }
      },
    });
  }
}

/**
 * 联查计划预算
 * @param {Object} record - 列表选中行数据
 */
export function linkFundPlan(record) {
  let {
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  const {
    FundPlan
  } = LinkConfig;
  if (!FundPlan) return;
  let {
    params,
    url,
    appcode,
    pagecode
  } = FundPlan;
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000044"]}` /* 国际化处理 该字段[key]不存在 */ ,
      });
      return;
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000039"]}` /* 国际化处理 该字段[key]对应的value无值 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  ajax({
    url,
    data,
    success: (res) => {
      let {
        data
      } = res;
      if (data.hint) {
        toast({
          color: "warning",
          content: res.data.hint
        });
      } else {
        this.setState({
          showFundPlan: true,
          fundPlanData: data,
        });
      }
    },
  });
}

/**
 * 联查账户余额
 * @param {Object} record - 列表选中行数据
 *
 */
export function linkBalance(record) {
  let {
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  const {
    Balance
  } = LinkConfig;
  if (!Balance) return;
  let {
    params,
    url,
    appcode,
    pagecode
  } = Balance;
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000044"]}` /* 国际化处理 该字段[key]不存在 */ ,
      });
      return;
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: `${this.state.baseMultiLangData["3617PUB-000043"]}${params[key]}${this.state.baseMultiLangData["3617PUB-000039"]}` /* 国际化处理 该字段[key]对应的value无值 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  this.setState({
    showOriginalData: data,
    showOriginalBalance: true,
  });
}

/**
 * 联查授信
 * @param {Object} record - 列表选中行数据
 *
 */
export function linkCredit(record) {
  let {
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  const {
    Credit
  } = LinkConfig;
  if (!Credit) return;
  let {
    params,
    url,
    appcode,
    pagecode
  } = Credit;
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    // if (!temp) {
    //   toast({
    //     color: "warning",
    //     content: `${this.state.baseMultiLangData["3617PUB-000061"]}` /* 该单据没有占用授信，无法联查 */ ,
    //   });
    //   return;
    // }
    temp = temp && temp.value;
    // if (!temp) {
    //   toast({
    //     color: "warning",
    //     content: `${this.state.baseMultiLangData["3617PUB-000061"]}` /* 该单据没有占用授信，无法联查 */ ,
    //   });
    //   return;
    // }
    data[key] = temp;
  }
  this.setState({
    showCCCBalance: data,
    showCCC: true,
  });
}

/**
 * 联查历史版本
 * @param {Object} record - 列表选中行数据
 *
 */
export function linkHistoryVersion(record) {
  let {
    FormConfig,
    form: formUtil
  } = this.props;
  let {
    LinkConfig
  } = this.props;
  const {
    HistoryVersion
  } = LinkConfig;
  let {
    params,
    url,
    appcode,
    pagecode,
    billtype
  } = HistoryVersion;
  let data = {};
  for (let key in params) {
    let temp;
    if (record) {
      // 列表操作
      temp = record.data.values[params[key]];
    } else {
      // 卡片操作
      temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
    }
    temp = temp && temp.value;
    if (!temp) {
      toast({
        color: "warning",
        content: this.state.baseMultiLangData[
          "3617PUB-000045"
        ] /* 国际化处理 该单据无历史版本可联查 */ ,
      });
      return;
    }
    data[key] = temp;
  }
  linkApp(this.props, {
    pageType: "version",
    url,
    appcode,
    pagecode,
    billtype,
    ...data,
  });
}

// 取消提交指派
export function compositeTurnOff() {
  this.setState({
    compositedata: null, // 指派数据
    compositedisplay: false, // 指派弹框控制
  });
}

/**
 * 组织多版本视图
 * @param {Object} props - 父组件所传入参数集合对象 必输
 * @param {String} fomrId - 主表区域编码 必输
 * @param {Boolean} isBrowse - 是否为浏览态 非必输 默认false
 * @param {String} org - 编辑态 非必输 默认”pk_org“
 * @param {String} org_v - 浏览态 非必输 默认”pk_org_v“
 */
export const orgVersionView = function (
  props,
  fomrId,
  isBrowse = false,
  org = "pk_org",
  org_v = "pk_org_v"
) {
  //浏览态显示组织版本，编辑态显示组织
  props.form.setFormItemsVisible(fomrId, {
    [org]: !isBrowse,
    [org_v]: isBrowse,
  });
};

/**
 * 拉单函数
 * @param {Object} name - 操作名称
 */
export function handlePullBill(name) {
  this.props.setUrlParam({
    name
  });
  // 来源单据配置参数 目标单据配置参数
  let {
    origin,
    target
  } = getPullBillConfig.call(this);

  if (!origin || !target) {
    console.error(
      "please check the param: origin or target, in your BillConfig"
    );
    return;
  }

  let {
    url
  } = target;
  pageTo.pushTo(url, {
    isPull: true,
    name,
    pullBillListUrl: url,
  });
}

/**
 * 转单确认按钮点击事件
 * @param {Array} pks 所选数据集合 主要为pk的数据
 */
export function handleTransferListConfirm(pks) {
  // 所勾选单据主键集合
  pks = pks.map((item) => item.head);
  // 是否为拉单状态
  let {
    name,
    isPull
  } = getPullUrlParams.call(this);
  let {
    origin
  } = getPullBillConfig.call(this);
  isPull &&
    pageTo.pushTo(origin.url, {
      status: "add",
      id: "",
      isPull,
      pks,
      name,
    });
}

/**
 * 推单函数
 * @param {String} name - 操作名称
 * @param {Array} records - 选中的行数据
 */
export function handlePushBill(name, records) {
  let {
    PushBillConfig,
    form: formUtil,
    FormConfig
  } = this.props;
  //  目标单据配置参数
  let {
    params,
    pushname,
    url,
    appcode,
    pagecode
  } = PushBillConfig[name];
  let result = [];
  if (records) {
    // 列表操作
    records.map((item) => {
      let data = {}; // 存放每条数据的属性及其值的数据对象
      for (let key in params) {
        let temp = item.data.values[params[key]];
        temp = temp && temp.value;
        if (!temp) {
          toast({
            color: "warning",
            content: this.state.baseMultiLangData[
              "3617PUB-000052"
            ] /* 国际化处理 该单据无主键不存在 */ ,
          });
          return;
        }
        data[key] = temp;
      }
      result.push(data);
    });
  } else {
    // 卡片操作
    let data = {}; // 存放每条数据的属性及其值的数据对象
    for (let key in params) {
      let temp = formUtil.getFormItemsValue(FormConfig.formId, params[key]);
      temp = temp && temp.value;
      if (!temp) {
        toast({
          color: "warning",
          content: this.state.baseMultiLangData[
            "3617PUB-000052"
          ] /* 国际化处理 该单据无主键不存在 */ ,
        });
        return;
      }
      data[key] = temp;
    }
    result.push(data);
  }

  pageTo.openTo(url, {
    isPull: true,
    isPush: true,
    status: "add",
    pks: JSON.stringify(result),
    appcode,
    pagecode,
    pushname, // 针对下游是多拉单情况的，需要在推单时确认上游是哪个单据推单，constant中进行配置
  });
}

/**
 * 获取拉单url参数
 */
export function getPullUrlParams() {
  let isPull = this.props.getUrlParam("isPull");
  let pks = this.props.getUrlParam("pks");
  let name = this.props.getUrlParam("name");
  return {
    isPull,
    pks,
    name,
  };
}

/**
 * 转单左侧区域点击事件处理函数
 */
export function onTransferItemSelected(record, bool, index) {
  let {
    BillConfig,
    FormConfig
  } = this.props;
  // 设置拉单选中数据索引值
  this.pullListIndex = index;

  let headData =
    record &&
    record.head &&
    record.head[FormConfig.formId] &&
    record.head[FormConfig.formId].rows &&
    record.head[FormConfig.formId].rows[0] &&
    record.head[FormConfig.formId].rows[0].values;
  if (!headData) return;
  // 单据id
  let id = headData[BillConfig.primaryId].value;
  id = id ? id : "";
  this.props.setUrlParam({
    status: id ? "browse" : "add",
    id,
  });
  // 设置右侧卡片页面数据
  card.pullBillTemplateInited.call(this, null, {
    data: record
  });
}

/**
 * 获取拉单页面参数
 */
export function getPullBillConfig() {
  // 操作名称
  let name = this.props.getUrlParam("name");
  let pushname = this.props.getUrlParam("pushname"); // 多拉单场景适配
  // 拉单配置
  let {
    PullBillConfig
  } = this.props;
  if (!PullBillConfig) {
    toast({
      color: "warning",
      content: "please check your PullBillConfig"
    });
  }
  let origin, target;
  // 来源单据配置参数 目标单据配置参数
  if (PullBillConfig[pushname]) {
    // 如果为多来源单据拉单
    origin = PullBillConfig[pushname].origin;
    target = PullBillConfig[pushname].target;
  } else if (PullBillConfig[name]) {
    // 如果为多来源单据拉单
    origin = PullBillConfig[name].origin;
    target = PullBillConfig[name].target;
  } else {
    origin = PullBillConfig.origin;
    target = PullBillConfig.target;
  }
  return {
    origin,
    target
  };
}

/**
 * 按钮权限校验
 * @param {*} btnCode 
 * @param {*} pks
 * @returns {Boolean}
 */
export function checkBtnPermission(btnCode, pks) {
  let {
    BillConfig,
    getSearchParam,
    getUrlParam,
  } = this.props;
  let appCode = getSearchParam("c") || getUrlParam("c");
  let isOK = true;
  //判断url是否有值，没值直接返回
  let API_URL = BillConfig.API_URL.checkpermission
  if(!API_URL) return isOK;
  if(!pks) return isOK;
  ajax({
    url: API_URL,
    async: false,
    data: {
      extParam: {"actionCode":btnCode},
      pageCdoe: BillConfig.pageId, //页面code
      appcode: appCode, // 应用编码
      pks: Array.isArray(pks) ? pks : [pks]
    },
    success: ({
      data,
      success
    }) => {
      isOK = success;
    },
    error: (error) => {
      isOK = !error;
      toast({
        color: "waring",
        content: `${error.message}`
      });
    }
  });
  return isOK;
}