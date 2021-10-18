/*
  列表页按钮操作方法
*/
import {
  ajax,
  cardCache,
  cacheTools,
  toast,
  promptBox,
} from "nc-lightapp-front";
import { api, toggleListHeadBtnDisabled } from "./listUtils";
import {
  OPR_NAME,
  printFn,
  voucherLinkBill,
  compositeTurnOff,
  getPullBillConfig,
} from "./common";
import { apiSaga } from "src/tmpub/pub/util/apisaga/apisaga";
let { setDefData, getDefData, deleteCacheById, updateCache } = cardCache;

/**
 * 列表操作列按钮操作
 *
 * @param {*} name - 操作名称
 * @param {*} data - 请求数据
 * @param {*} other - 其他参数
 */
function listBtnOper(name, data, other) {
  let { BillConfig, TableConfig, cardTable: cardTableUtil } = this.props;
  // 操作行数据索引 成功后回调 pk和操作数据index的索引
  let { index, successAfter, pkMapRowIndex } = other;
  // 复制data参数
  let orgsdata = data;
  // 是否为多条数据操作
  let isMulti = data.pks.length > 1;
  api.call(this, {
    name,
    data,
    success: (res) => {
      let { success, data } = res;
      if (success) {
        //提交即指派
        if (
          res.data.workflow &&
          (res.data.workflow == "approveflow" ||
            res.data.workflow == "workflow")
        ) {
          this.setState({
            compositedata: res.data,
            compositedisplay: true,
          });
        } else if (res.data.confirmFlag) {
          // 返回确认标志为true 弹出提示信息
          orgsdata = Object.assign(orgsdata, res.data);
          handleConfirmMsg.call(this,name, orgsdata, other);
        } else {
          // 非提交即指派
          // 数据操作提示
          multiToast.call(this, name, data, isMulti);

          successAfter && successAfter.call(this, data);

          // 是否有查询区缓存
          let searchCache = getDefData(
            BillConfig.searchCache.key,
            BillConfig.searchCache.dataSource
          );
          if (!searchCache) {
            // 如果无查询区缓存 则需要更新缓存来刷新列表数据
            if (name === "delete" || name === "return") {
              // 如果是删除 或 退回 删除该条数据
              updateListCache.call(
                this,
                "delete",
                data,
                pkMapRowIndex,
                isMulti
              );
            } else {
              // 更新缓存中的数据
              updateListCache.call(
                this,
                "update",
                data,
                pkMapRowIndex,
                isMulti
              );
            }
          } else {
            // 重新查询数据
            getListData.call(
              this,
              BillConfig.API_URL.queryList,
              null,
              false,
              "",
              true
            );
          }

          // 取消选择列表数据
          cardTableUtil.selectAllRows(TableConfig.tableId);
          // 设置头部按钮启用状态
          toggleListHeadBtnDisabled.call(this);
        }
      }
    },
  });
}

/**
 * 接口返回批量提示
 *
 * @param {String} name - 操作名称
 * @param {Object} data - 接口返回数据
 * @param {Boolean} isMulti - 是否多条数据操作
 */
function multiToast(name, data = {}, isMulti) {
  let { successNum, failNum, total, msg, msgDetail, errormessages } = data;
  // 将字符串转为数字
  successNum =
    isNaN(Number(successNum)) || !successNum ? 0 : Number(successNum);
  failNum = isNaN(Number(failNum)) || !failNum ? 0 : Number(failNum);
  total = isNaN(Number(total)) || !total ? 0 : Number(total);
  if (!isMulti) {
    // 如果是单条数据操作
    if (total && failNum === total) {
      // 如果全部失败
      toast({
        duration: "infinity",
        color: "danger",
        content:
          (errormessages && errormessages[0]) || (msgDetail && msgDetail[0]),
      });
    } else {
      toast({
        duration: 5,
        color: "success",
        content: `${this.state.baseMultiLangData[OPR_NAME[name]]}${
          this.state.baseMultiLangData["3617PUB-000002"]
        }` /* [操作]成功 */,
      });
    }

    return;
  }
  let title = `${this.state.baseMultiLangData[OPR_NAME[name]]}${
    this.state.baseMultiLangData["3617PUB-000033"]
  }，${msg}`; /* 国际化处理： [操作]完毕 */
  let content = `${this.state.baseMultiLangData["3617PUB-000001"]}${total}${this.state.baseMultiLangData["3617PUB-000003"]}${this.state.baseMultiLangData["3617PUB-000002"]}${successNum}${this.state.baseMultiLangData["3617PUB-000003"]}${this.state.baseMultiLangData["3617PUB-000004"]}${failNum}${this.state.baseMultiLangData["3617PUB-000005"]}`; /* 国际化处理： 共,条,成功,条,失败,条*/

  if (successNum === total) {
    //全部成功
    toast({
      duration: 5,
      color: "success",
      title,
      content: content,
      groupOperation: true,
    });
  } else if (failNum === total) {
    //全部失败
    toast({
      duration: "infinity",
      color: "danger",
      title,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.baseMultiLangData["3617PUB-000006"],
        this.state.baseMultiLangData["3617PUB-000007"],
        this.state.baseMultiLangData["3617PUB-000008"],
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail || errormessages, //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  } else if (successNum < total) {
    //部分失败
    toast({
      duration: "infinity",
      color: "danger",
      title,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.baseMultiLangData["3617PUB-000006"],
        this.state.baseMultiLangData["3617PUB-000007"],
        this.state.baseMultiLangData["3617PUB-000008"],
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail || errormessages, //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  }
}

/**
 * @param {*} value 某数据
 * 提交即指派
 */
export function getAssginUsedr(value) {
  listCommit.call(this, {
    data: {
      pks: this.state.curPk,
      userObj: value,
    },
    successAfter: () => {
      compositeTurnOff.call(this);
    },
  });
}

/**
 * 列表页按钮操作
 *
 * @param {*} name 操作名称
 * @param {*} isMulti 是否为表头批量操作
 * @param {*} data 传入数据
 * @param {*} isSingle 是否只能对一条数据进行操作
 * @param {*} other 其他参数
 * }
 */
export function listOperation({
  name,
  isMulti = false,
  data,
  isSingle = false,
  ...other
}) {
  let { BillConfig } = this.props;
  data = { pageCode: BillConfig.pageId, ...data };
  // 设置当前操作数据的pks
  this.setState({ curPk: data.pks });
  if (isMulti) {
    // 表头批量操作
    if (!isSelected.call(this, isSingle)) {
      return;
    }
  }
  listBtnOper.call(this, name, data, other);
}

/**
 * 是否选中数据
 *
 * @param {*} isSingle 要求只能 选中一条数据 的标识
 */
export function isSelected(isSingle = false) {
  let { table: tableUtil, TableConfig } = this.props;
  let checkRows = tableUtil.getCheckedRows(TableConfig.tableId);
  let len = checkRows.length;
  if (len === 0) {
    toast({
      color: "warning",
      content: this.state.baseMultiLangData[
        "3617PUB-000009"
      ] /* 国际化处理： 请选择数据操作！*/,
    });
    return false;
  } else if (len > 1 && isSingle) {
    // 要求只能选择一条进行操作
    toast({
      color: "warning",
      content: this.state.baseMultiLangData[
        "3617PUB-000016"
      ] /* 国际化处理： 只能选择一条数据！*/,
    });
    return false;
  }
  return true;
}

/**
 * 列表新增
 */
export function listAdd() {
  let { BillConfig, pushTo } = this.props;
  pushTo("/card", {
    status: "add",
    id: "",
    pagecode: BillConfig.cardPageCode,
  });
}

/**
 * 列表修改
 * @param {*} pk - 主键
 */
export function listEdit(pk) {
  let { BillConfig, pushTo } = this.props;
  let data = {
    pk: pk,
    fieldPK: BillConfig.primaryId,
    tableName: BillConfig.tableName,
  };
  apiSaga.call(this, {
    data,
    success: (res) => {
      pushTo("/card", {
        status: "edit",
        id: pk,
        pagecode: BillConfig.cardPageCode,
      });
    },
  });
}
/**
 * 列表行内承付(仿照修改逻辑)
 * @param {*} pk - 主键
 */
export function listHonour(pk) {
  let { BillConfig, pushTo } = this.props;
  let data = {
    pk: pk,
    fieldPK: BillConfig.primaryId,
    tableName: BillConfig.tableName,
  };
  // apiSaga.call(this, {
  //   data,
  //   success: (res) => {
      pushTo("/card", {
        status: "honour",
        id: pk,
        pagecode: BillConfig.cardPageCode,
      });
  //   },
  // });
}
/**
 * 列表行内取消承付
 * @param {*} args - listOperation的参数
 */
export function listCancelHonour(args) {
  listOperation.call(this, {
    name: "cancelhonour",
    ...args,
  });
}

/**
 * 列表行内确认收款(仿照修改逻辑)
 * @param {*} pk - 主键
 */
export function listConfirmCollect(pk) {
  let { BillConfig, pushTo } = this.props;
    pushTo("/card", {
      status: "confirmcollect",
      id: pk,
      pagecode: BillConfig.cardPageCode,
    });
}
/**
 * 列表行内取消确认收款
 * @param {*} args - listOperation的参数
 */
export function listCancelConfirmCollect(args) {
  listOperation.call(this, {
    name: "cancelconfirmcollect",
    ...args,
  });
}


/**
 * 发票登记
 * @param {*} args - listOperation的参数
 */
export function listInvoice(args) {
  listOperation.call(this, {
    name: "invoice",
    ...args,
  });
}
/**
 * 列表提交
 * @param {*} args - listOperation的参数
 */
export function listCommit(args) {
  listOperation.call(this, {
    name: "commit", // 提交
    ...args,
  });
}

/**
 * 列表收回
 * @param {*} args - listOperation的参数
 */
export function listUncommit(args) {
  listOperation.call(this, { name: "uncommit", ...args });
}

/**
 * 列表删除
 * @param {*} args - listOperation的参数
 */
export function listDelete(args) {
  listOperation.call(this, { name: "delete", ...args });
}
/**
 * 列表删除版本
 * @param {*} args - listOperation的参数
 */
export function listDeleteVersion(args) {
  listOperation.call(this, { name: "deleteversion", ...args });
}
/**
 * 行内关闭按钮
 * @param {*} args - listOperation的参数
 */
export function listClose(args) {
  listOperation.call(this, { name: "terminate", ...args });
}
/**
 * 行内取消关闭按钮
 * @param {*} args - listOperation的参数
 */
export function listCancleClose(args) {
  listOperation.call(this, { name: "unterminate", ...args });
}
/**
 * 列表注销行内按钮
 * @param {*} args - listOperation的参数
 */
export function listLogout(args) {
  this.setState({ registerCancleShow: true });
  // 设置当前操作数据的pks
  this.setState({ record: args.data });
}


/**
 * 列表注销确认按钮
 * @param {*} args - listOperation的参数
 */
export function listLogoutConfirm(args) {
  let { form: formUtil } = this.props;
  // 注销日期
  let stopdate = formUtil.getFormItemsValue("header_logout", "stopdate");
  // 注销原因
  let stopreason = formUtil.getFormItemsValue("header_logout", "stopreason");
  let stopdateValue = stopdate && stopdate.value;
  let stopreasonValue = stopreason && stopreason.value;
  let extParam = new Map();
  extParam.set("stopdate", stopdateValue);
  extParam.set("stopreason", stopreasonValue);
  let { data } = args;
  data = { extParam, ...data };
  args["data"] = data;
  listOperation.call(this, { name: "logout", ...args });
}
/**
 * 列表批改确认按钮
 * @param {*} args - listOperation的参数
 */
export function listBatchConfirm(args) {
  let { form: formUtil } = this.props;
  // 注销日期
  let occucommoney = formUtil.getFormItemsValue("header_batch", "occucommoney");
  // 注销原因
  let occusharemoney = formUtil.getFormItemsValue(
    "header_batch",
    "occusharemoney"
  );
  let occucommoneyValue = occucommoney && occucommoney.value;
  let occusharemoneyValue = occusharemoney && occusharemoney.value;
  let extParam = new Map();
  extParam.set("occucommoney", occucommoneyValue);
  extParam.set("occusharemoney", occusharemoneyValue);
  let { data } = args;
  data = { extParam, ...data };
  args["data"] = data;
  listOperation.call(this, { name: "batchedit", ...args });
}
/**
 * 列表刷新
 */
export function listRefresh() {
  let { BillConfig } = this.props;
  getListData.call(
    this,
    BillConfig.API_URL.queryList,
    undefined,
    true,
    this.state.baseMultiLangData["3617PUB-000021"] /*国际化处理  刷新成功 */,
    true
  );
}

/**
 * 列表打印
 * @param {*} pks - 主键数组
 */
export function listPrint(pks) {
  if (isSelected.call(this)) {
    printFn.call(this, pks);
  }
}

/**
 * 列表关闭申请
 *
 * @param {*} pk - 主键
 */
export function listCloseApply(args) {
  listOperation.call(this, { name: "close", ...args });
}

/**
 * 列表制证
 *
 * @param {*} args - listOperation的参数
 */
export function listMakeVoucher(args) {
  listOperation.call(this, { name: "makeVoucher", ...args });
}

/**
 * 列表取消制证
 *
 * @param {*} args - listOperation的参数
 */
export function listCancelVoucher(args) {
  listOperation.call(this, { name: "cancelVoucher", ...args });
}

/**
 * 页签筛选
 * @param {*} tabKey  页签key
 */
export function handleTabChange(tabKey) {
  // 切换页签时，将之前页签内容勾选的内容清空
  let { BillConfig, TableConfig, table:tableUtil } = this.props;
  tableUtil.selectAllRows(TableConfig.tableId, false);
  
  this.setState(
    {
      tabKey,
    },
    () => {
      // 设置tabKey缓存
      setDefData(
        BillConfig.tabKeyCache.key,
        BillConfig.tabKeyCache.dataSource,
        tabKey
      );
      // 获取列表数据
      getListData.call(
        this,
        BillConfig.API_URL.queryList,
        undefined,
        false,
        "",
        true
      );
    }
  );
}

/**
 * 点击查询，获取查询区数据
 * @param {*} props          页面内置对象
 */
export function searchBtnClick(props, condition, type, querycondition, msg) {
  let { BillConfig, SearchConfig, search: searchUtil } = this.props;

  let { tabKey } = this.state;
  // 设置tabKey缓存
  setDefData(
    BillConfig.tabKeyCache.key,
    BillConfig.tabKeyCache.dataSource,
    tabKey
  );
  // 设置查询区缓存
  setDefData(
    BillConfig.searchCache.key,
    BillConfig.searchCache.dataSource,
    searchUtil.getQueryInfo(SearchConfig.searchId)
  );

  getListData.call(
    this,
    BillConfig.API_URL.queryList,
    undefined,
    true,
    msg,
    true
  );
}
/**
 * 列表变更
 *
 * @param {*} pk - 主键
 */
export function listChange(pk) {
  let { BillConfig, pushTo } = this.props;
  pushTo("/card", {
    status: "change",
    id: pk,
    pagecode: BillConfig.cardPageCode
  });
}
/**
 * 列表展期
 *
 * @param {*} pk - 主键
 */
export function listExtension(pk) {
  let { BillConfig, pushTo } = this.props;
  pushTo("/card", {
    status: "extension",
    id: pk,
    pagecode: BillConfig.cardPageCode
  });
}

/**
 * 获取列表数据数据
 * @param {String} path - url路径
 * @param {Object} conditions - 自定义查询条件
 * @param {Boolean} showMsg - 是否提示信息
 * @param {String} msg - 提示信息内容
 * @param {Boolean} isRefresh - 是否刷新页面
 */
export function getListData(path, conditions, showMsg, msg, isRefresh) {
  let {
    table: tableUtil,
    search: searchUtil,
    TableConfig,
    SearchConfig,
    BillConfig,
  } = this.props;
  // 表格数据缓存
  let tableCache = getDefData(
    BillConfig.tableCache.key,
    BillConfig.tableCache.dataSource
  );
  if (!isRefresh && tableCache) {
    // 如果不是刷新 并且有缓存数据 将缓存数据设置为表格数据
    listRender.call(this, { success: true, data: tableCache });
  }
  let pageInfo = tableUtil.getTablePageInfo(TableConfig.tableId);
  let searchCache = getDefData(
    BillConfig.searchCache.key,
    BillConfig.searchCache.dataSource
  );
  if (!searchCache) {
    // 如果无查询区缓存 返回
    return;
  }
  // 请求查询条件
  let searchData = {};

  // 如果刷新 判断是否缓存查询区条件
  // 如果查询 查询区条件作为过滤条件
  searchData = isRefresh
    ? searchCache
      ? searchCache
      : searchUtil.getQueryInfo(SearchConfig.searchId)
    : searchUtil.getQueryInfo(SearchConfig.searchId);

  if (!searchData || !searchData.queryAreaCode) {
    return;
  }
  // 设置其他查询条件 分页信息等
  searchData.pageCode = BillConfig.pageId;
  searchData.pageInfo = pageInfo;
  // 如果不是拉单状态
  conditions = conditions ? conditions : getConditionsOfTabs.call(this);
  searchData.custcondition = {
    logic: "and", //逻辑操作符，and、or
    conditions: [conditions],
  };

  if (!showMsg || !msg) {
    // tab切换 或 点击查询
    searchData.pageInfo.pageIndex = 0;
  }
  ajax({
    url: path,
    data: searchData,
    success: (res) => {
      let { data } = res;
      if (data && data.groupData && data.groupData.ALL > 0) {
        showMsg &&
          toast({
            color: "success",
            content: msg
              ? msg
              : this.state.baseMultiLangData[
                  "3617PUB-000020"
                ] /* 国际化处理： 查询成功 */,
          });
        // 设置表格数据
        listRender.call(this, res);
      } else {
        toast({
          color: "warning",
          content: this.state.baseMultiLangData[
            "3617PUB-000000"
          ] /* 国际化处理： 未查询出符合条件的数据！*/,
        });

        listRender.call(this, { success: false });
      }

      // 设置页签状态及缓存
      setTabsData.call(this, data.groupData);
      // 刷新时 设置表体数据缓存
      isRefresh && cacheTools.set(BillConfig.tableCache.dataSource, data);
    },
    error: (res) => {
      toast({ color: "danger", content: res.message });
      listRender.call(this, { success: false });
    },
  });
}
/**
 * 获取拉单列表数据数据
 * @param {String} msg - 提示信息内容
 * @param {Boolean} isRefresh - 是否刷新页面
 */
export function getPullListData(msg, isRefresh) {
  let {
    search: searchUtil,
    TableConfig,
    SearchConfig,
    BillConfig,
  } = this.props;
  // 表格数据缓存
  let tableCache = getDefData(BillConfig.tableCache.key, BillConfig.dataSource);
  if (!isRefresh && tableCache) {
    // 如果不是刷新 并且有缓存数据 将缓存数据设置为表格数据
    listRender.call(this, { success: true, data: tableCache });
  }

  let searchCache = getDefData(
    BillConfig.searchCache.key,
    BillConfig.searchCache.dataSource
  );

  // 请求查询条件
  let searchData = {};

  searchData = isRefresh
    ? searchCache
      ? searchCache
      : searchUtil.getQueryInfo(SearchConfig.searchId)
    : searchUtil.getQueryInfo(SearchConfig.searchId);

  if (!searchData || !searchData.queryAreaCode) {
    return;
  }
  // 设置其他查询条件 分页信息等
  searchData.pageCode = BillConfig.pageId;

  // 拉单列表页面配置
  let { target } = getPullBillConfig.call(this);
  // 拉单列表页请求地址
  let { ajaxUrl } = target;
  ajax({
    url: ajaxUrl,
    data: searchData,
    success: (res) => {
      let { data } = res;
      if (
        data &&
        data.grid &&
        data.grid[TableConfig.tableId] &&
        data.grid[TableConfig.tableId].rows.length > 0
      ) {
        toast({
          color: "success",
          content: msg,
        });
        // 设置表格数据
        transferListRender.call(this, res);
      } else {
        toast({
          color: "warning",
          content: this.state.baseMultiLangData[
            "3617PUB-000000"
          ] /* 国际化处理： 未查询出符合条件的数据！*/,
        });

        transferListRender.call(this, { success: false });
      }
      // 设置表格数据缓存
      setDefData(BillConfig.tableCache.key, BillConfig.dataSource, data);
    },
    error: (res) => {
      toast({ color: "danger", content: res.message });
      transferListRender.call(this, { success: false });
    },
  });
}

/**
 * 转单列表数据渲染
 */
export function transferListRender(res) {
  let { success, data } = res;
  let {
    BillConfig,
    TableConfig,
    transferTable: transferTableUtil,
  } = this.props;
  if (success && data && data.grid && data.grid[TableConfig.tableId]) {
    let tableData = data.grid[TableConfig.tableId];
    transferTableUtil.setTransferTableValue(
      TableConfig.tableId,
      "",
      tableData,
      BillConfig.primaryId,
      ""
    );
  } else {
    transferTableUtil.setTransferTableValue(
      TableConfig.tableId,
      "",
      { rows: [] },
      BillConfig.primaryId,
      ""
    );
  }
}

/**
 * 渲染列表数据
 * @param {*} res   后台返回的res
 */
export function listRender(res) {
  let { success, data } = res;
  let { TableConfig, table: tableUtil } = this.props;
  if (success && data && data.grid && data.grid[TableConfig.tableId]) {
    let tableData = data.grid[TableConfig.tableId];
    tableUtil.setAllTableData(TableConfig.tableId, tableData);
  } else {
    tableUtil.setAllTableData(TableConfig.tableId, { rows: [] });
  }
  toggleListHeadBtnDisabled.call(this);
}

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
  let { BillConfig } = this.props;
  ajax({
    url: BillConfig.API_URL.queryByPks,
    data: { pks, pageCode: BillConfig.pageId },
    success: (res) => {
      listRender.call(this, res);
    },
    error: (res) => {
      toast({ color: "danger", content: res.message });
      listRender.call(this, { success: false });
    },
  });
}

/**
 * 预算反联查单据
 * @param {*} url - 请求地址
 * @param {*} data - 请求数据
 * @param {*} tableId - 表格区域编码
 */
export function ntbLinkBill(url, data, tableId) {
  let { BillConfig, TableConfig, pushTo, table: tableUtil } = this.props;
  ajax({
    url,
    data,
    success: (res) => {
      let { data, success } = res;
      if (success && data) {
        let { grid, head } = data;
        let gridRows = grid && grid.table.rows;
        if (!gridRows) return;
        if (gridRows.length > 1) {
          tableUtil.setAllTableData(
            tableId || TableConfig.tableId,
            data.grid.table
          );
          // 设置scene为 linksce 供卡片页使用
          this.props.setUrlParam({ scene: "linksce" });
        } else if (gridRows.length == 1) {
          let pk = grid.table.rows[0].values[BillConfig.primaryId].value;
          pushTo("/card", {
            status: "browse",
            id: pk,
            scene: "linksce",
          });
        }
      }
    },
  });
}

/**
 * 设置页签状态及缓存
 * @param {*} groupData 状态值
 */
export function setTabsData(groupData) {
  let { BillConfig } = this.props;
  let { tabs } = this.state;
  for (let item of tabs) {
    item.num = item.key === "all" ? "" : `(${groupData[item.key]})`;
  }
  // 设置页签状态并写入缓存以备卡片跳回到列表应用
  this.setState({ tabs }, () => {
    setDefData(BillConfig.tabsCache.key, BillConfig.tabsCache.dataSource, tabs);
  });
}
/**
 * 获取页签信息等查询条件
 */
export function getConditionsOfTabs() {
  let { tabKey, tabs } = this.state;
  let conditions =
    tabKey !== "all"
      ? {
          field: "vbillstatus",
          value: {
            firstvalue: tabs.find((item) => item.key === tabKey).status,
          },
          oprtype: "in",
          display: null,
        }
      : {};
  return conditions;
}

/**
 * 凭证联查单据
 * @param {*} url - 请求地址
 * @param {*} data - 请求数据
 * @param {*} tableCode - 表格区域编码
 * @param {*} primaryId - 页面主键
 */

export function linkList(pageId, tableCode, primaryId) {
  let { BillConfig, getUrlParam ,pushTo} = this.props;
  let scene = getUrlParam("scene"); // 凭证反联差
  let pk_ntbparadimvo = getUrlParam("pk_ntbparadimvo"); // 预算反联查
  let pk = getUrlParam("id");
  let data = {}; // 请求数据
  let url = ""; // 请求地址
  if (scene === "fip") {
    // 凭证反联查
    // 缓存中的key为 checkedData
    let checkedData = cacheTools.get("checkedData");
    url = BillConfig.API_URL.voucherlink;
    data = {
      operatingLogVO: checkedData,
      pageCode: BillConfig.pageId,
    };
    voucherLinkBill.call(this, url, data, tableCode, primaryId);
  } else if (pk_ntbparadimvo) {
    // 预算联查单据
    url = BillConfig.API_URL.ntbLink;
    data = {
      pageCode: pageId,
      extParam: {
        pk_ntbparadimvo,
      },
    };
    ntbLinkBill.call(this, url, data, tableCode);
  } else if (!!scene) {
    // 如果是普通联查
    url = BillConfig.API_URL.linklist;
    let pkArray = pk && pk.split(",");
    data = {
      pageInfo: {
        pageIndex: 0,
        pageSize: "1000",
      },
      pks: [...pkArray],
      pageCode: getUrlParam("pagecode"),
    };
    if (pkArray && pkArray.length == 1) {
      pushTo("/card", {
        status: "browse",
        id: pk,
        scene: "linksce",
      });
      return;
    }
    linkCommomPage.call(this, url, data, tableCode);
  }
}

/**
 * 反联查一般单据单据
 * @param {*} url - 请求地址
 * @param {*} data - 请求数据
 * @param {*} tableId - 表格区域编码
 */
export function linkCommomPage(url, data, tableId) {
  let { BillConfig, TableConfig, pushTo, table: tableUtil } = this.props;
  ajax({
    url,
    data,
    success: (res) => {
      let { data, success } = res;
      if (success && data) {
        let { grid, head } = data;
        let gridRows = grid && grid[tableId].rows;
        if (!gridRows) return;
        if (gridRows.length > 1) {
          tableUtil.setAllTableData(
            tableId || TableConfig.tableId,
            data.grid[tableId]
          );
          // 设置scene为 linksce 供卡片页使用
          this.props.setUrlParam({ scene: "linksce" });
        } else if (gridRows.length == 1) {
          let pk = grid[tableId].rows[0].values[BillConfig.primaryId].value;
          pushTo("/card", {
            status: "browse",
            id: pk,
            scene: "linksce",
          });
        }
      }
    },
  });
}

/**
 * 更新卡片缓存数据
 * @param {String} name - 更新列表缓存操作
 * @param {Object} data - 请求返回的 数据
 * @param {Map} pkMapRowIndex - pk和操作数据的index的map
 * @param {Boolean} isMulti - 是否为多数据操作
 */
export function updateListCache(name, data, pkMapRowIndex, isMulti) {
  let { BillConfig, TableConfig, table: tableUtil } = this.props;
  let { successNum, failNum, total, msg, msgDetail, errormessages } = data;

  // 将字符串转为数字
  successNum =
    isNaN(Number(successNum)) || !successNum ? 0 : Number(successNum);
  failNum = isNaN(Number(failNum)) || !failNum ? 0 : Number(failNum);
  total = isNaN(Number(total)) || !total ? 0 : Number(total);
  // 要操作数据的pk
  let pks = [];
  // 要操作数据的索引
  let indics = [];
  if (isMulti) {
    // 表头按钮操作
    if (successNum === total) {
      // 如果为全部成功
      for (let key of pkMapRowIndex.keys()) {
        pks.push(key);
      }
      for (let value of pkMapRowIndex.values()) {
        indics.push(value);
      }
    } else if (successNum < total) {
      // 如果为部分成功
      data.billCards.map((item) => {
        let pk =
          item.head[TableConfig.tableId].rows[0].values[BillConfig.primaryId]
            .value;
        pks.push(pk);
        let index = pkMapRowIndex.get(pk);
        indics.push(index);
      });
    } else {
      return;
    }
  } else {
    // 表体操作
    if (total && failNum === total) {
      // 如果全部失败
    } else {
      // 全部成功
      for (let key of pkMapRowIndex.keys()) {
        pks.push(key);
      }
      for (let value of pkMapRowIndex.values()) {
        indics.push(value);
      }
    }
  }

  //删除缓存
  if (name === "delete") {
    // 删除数据缓存
    pks.map((pk) => {
      deleteCacheById(BillConfig.primaryId, pk, BillConfig.dataSource);
    });
    tableUtil.deleteTableRowsByIndex(TableConfig.tableId, indics);
  } else {
    let updateDataArr = [];
    pks.map((pk, index) => {
      let newData = (data.billCards && data.billCards[index]) || data;
      // 更新缓存
      updateCache(
        BillConfig.primaryId, // 单据主键
        pk, // 单据id
        newData, // 单据数据
        TableConfig.tableId,
        BillConfig.dataSource // 应用节点缓存key 卡片和列表共用
      );
      // 更新列表
      updateDataArr.push({
        index: indics[index],
        data:
          newData &&
          newData.head[TableConfig.tableId].rows &&
          newData.head[TableConfig.tableId].rows[0],
      });
    });
    tableUtil.updateDataByIndexs(TableConfig.tableId, updateDataArr);
  }
}

/**
 * 获取拉单页面参数
 * @param {Object} PullBillConfig
 */
export function getPullBillListPageParams(PullBillConfig) {
  let name = this.props.getUrlParam("name");
  if (PullBillConfig[name]) {
    let { target } = PullBillConfig[name]
    // 多来源拉单
    let {
      pagecode,
      transferTablePk,
      head_btn_code,
      search_id,
      search_oid,
      transferTableId,
    } = target;
    return {
      pagecode,
      transferTablePk,
      head_btn_code,
      search_id,
      search_oid,
      transferTableId,
    };
  } else {
    let { target } = PullBillConfig;
    let {
      pagecode,
      transferTablePk,
      head_btn_code,
      search_id,
      search_oid,
      transferTableId,
    } = target;
    return {
      pagecode,
      transferTablePk,
      head_btn_code,
      search_id,
      search_oid,
      transferTableId,
    };
  }
}


/**
 * 批改、注销 提示信息处理
 * @param {String} name - name联查名称
 * @param {Object} orgsdata - 参数数据
 * @param {Object} orgsdata - 后台返回数据
 */
export function handleConfirmMsg(name, orgsdata,other) {
  orgsdata &&
  orgsdata.extParam &&
  orgsdata.extParam.set("confirmFlag", true);
  // 设置提示框显示
  promptBox({
    color: "warning",
    content: orgsdata.warnInfo,
    beSureBtnClick: () => {
      // 关闭注销弹框
      if(name == "logout"){
          this.setState({ "registerCancleShow": false });
          listLogoutConfirm.call(this, {
            data: orgsdata,
            other,
          });
      }
      // 关闭批改弹框
      if(name == "batchedit"){
          this.setState({ "batchEditShow": false });
          listBatchConfirm.call(this, {
            data: orgsdata,
            other,
          });
      }
  
    },
  });
}
