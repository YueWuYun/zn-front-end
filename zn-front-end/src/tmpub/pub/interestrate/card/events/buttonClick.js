/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import {
  ajax,
  base,
  toast,
  cardCache,
  print,
  promptBox
} from "nc-lightapp-front";
import { CARD, API_URL, nodekey } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import {
  getCardData,
  setEditStatus,
  clearAll,
  initForm,
  billHeadVisible,
  initByBtn,
  showOrg
} from "./page";

let { updateCache, addCache } = cardCache;

export default function(props, id, tableId) {
  let pk = props.getUrlParam("id");
  let cardData = this.props.createExtCardData(this.pageId, this.formId, [
    this.tableId
  ]);
  switch (id) {
    //头部 新增
    case "Add":
      add.call(this, props);
      break;
    //头部保存
    case "Save":
      confirmReCal.call(this, props);
      break;
    //头部 修改
    case "Edit":
      edit.call(this, props, cardData, pk);
      break;
    //头部 删除
    case "Delete":
      delBill.call(this);
      break;
    //复制
    case "Copy":
      copyBill.call(this, props, pk);
      break;
    //启用
    case "Enable":
      setEnableStatus.call(
        this,
        "enable",
        this.state.json["36010IR-000019"]
      ); /* 国际化处理： 启用成功*/
      break;
    //停用
    case "Disable":
      setEnableStatus.call(
        this,
        "disable",
        this.state.json["36010IR-000020"]
      ); /* 国际化处理： 停用成功*/
      break;
    //创建版本
    case "createVersion":
      createVersion.call(this, props, pk);
      break;
    //头部 查看版本
    case "queryVersion":
      queryVersion.call(this);
      break;
    // 头部 删除版本
    case "deleteVersion":
      deleteVersion.call(this, pk);
      break;
    // 头部 取消
    case "Cancel":
      cancelBill.call(this, props);
      break;
    //头部 打印
    case "Print":
      printBill.call(this, pk);
      break;
    //头部 输出
    case "Output":
      outPutBill.call(this, pk);
      break;
    //头部 预览
    case "Preview":
      toast({
        color: "warning",
        content: this.state.json["36010IR-000021"]
      }); /* 国际化处理： 功能待开发*/
      break;
    //头部 刷新
    case "Refresh":
      getCardData.call(this, pk, true, true, () => {
        toast({
          color: "success",
          content: this.state.json["36010IR-000072"] /* 国际化处理： 刷新成功 */
        });
      });
      break;
    default:
      break;
  }
}

/**
 * 查看版本
 * @param {*} props  页面内置对象
 */
export function queryVersion() {
  this.setState({ cardVersion: true }, initVersionTree.call(this));
}
/**
 * 新增
 * @param {*} props  页面内置对象
 */
function add(props) {
  props.setUrlParam({ status: "add" });
  clearAll.call(this, props);
  initForm.call(this, "add");
  this.setState({
    bckStatus: false
  });
  billHeadVisible.call(this, false, false);
  props.form.setFormItemsDisabled(this.formId, {
    rateid: false,
    ratename: false,
    ratetype: false,
    dayofyear: false,
    inputdate: false,
    revisedate: false,
    note: false,
    yrate: false,
    mrate: false,
    rate: false
  });
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit(props, cardData, pk) {
  ajax({
    url: API_URL["checkRef"],
    data: { pks: [pk] },
    success: res => {
      if (res.data) {
        if (res.data.successNum === "1") {
          props.setUrlParam({ status: "edit" });
          this.setState({
            cardpaStatus: false
          });
          setEditStatus.call(this, "edit");
          initByBtn.call(this, "edit");
          billHeadVisible.call(
            this,
            false,
            true,
            cardData.head[this.formId].rows[0].values.rateid.value
          );
        } else {
          toast({
            color: "danger",
            content: this.state.json["36010IR-000022"]
          }); /* 国际化处理： 该利率已被引用，无法修改!*/
        }
      }
    }
  });
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
function cancelBill(props) {
  promptBox({
    color: "warning",
    title: this.state.json["36010IR-000023"] /* 国际化处理： 取消*/,
    content: this.state.json["36010IR-000024"] /* 国际化处理： 确认要取消吗？*/,
    beSureBtnClick: () => {
      handelCancel.call(this, props);
    }
  });
}

/**
 * 取消回调
 * @param {*} props  页面内置对象
 */
function handelCancel(props) {
  let id = props.getUrlParam("id");
  props.setUrlParam({ status: "browse" });
  if (id) {
    props.form.cancel(this.formId);
    props.cardTable.resetTableData(this.tabCode);
    setEditStatus.call(this, "browse");
    getCardData.call(this, id);
  } else {
    setEditStatus.call(this, "browse");
    clearAll.call(this, this.props);
    billHeadVisible.call(this, true);
  }
}

/**
 * 删除
 */
function delBill() {
  promptBox({
    color: "warning",
    title: this.state.json["36010IR-000025"] /* 国际化处理： 删除*/,
    content: this.state.json[
      "36010IR-000026"
    ] /* 国际化处理： 将删除该利率的所有版本，是否确定？*/,
    beSureBtnClick: () => {
      this.btnOperation(
        "delete",
        this.state.json["36010IR-000027"]
      ); /* 国际化处理： 删除成功!*/
    }
  });
}

/**
 * 复制
 * @param {*} props  页面内置对象
 */
function copyBill(props, pk) {
  props.pushTo("/card", {
    status: "copy",
    id: pk,
    pagecode: CARD.page_id
  });
  setEditStatus.call(this, "edit");
  getCardData.call(this, pk, true, true);
}

/**
 * 创建版本
 * @param {*} props  页面内置对象
 */
function createVersion(props, pk) {
  props.setUrlParam({ status: "createVersion" });
  props.cardTable.setStatus(this.tabCode, "edit");
  // 保存起效日期，需要校验
  let oldReviseDate = props.form.getFormItemsValue(this.formId, "revisedate")
    .value;
  this.setState({
    oldReviseDate: getDateDetail(oldReviseDate.split(" ")[0])
  });
  setEditStatus.call(this, "edit");
  initByBtn.call(this, "createVersion");
  props.form.setFormItemsDisabled(this.formId, {
    rateid: true,
    inputdate: true,
    ratename: true,
    ratetype: true,
    dayofyear: true,
    finance_rate_type: true
  });
}

/**
 * 删除版本
 * @param {*} props  页面内置对象
 */
function deleteVersion(pk) {
  promptBox({
    color: "danger", // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
    title: this.state.json["36010IR-000028"], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 删除版本*/
    content: this.state.json["36010IR-000029"], // 提示内容,非必输/* 国际化处理： 当前利率设置最新版本将要删除，是否继续？*/
    beSureBtnClick: () => {
      handelDeleteVersion.call(this, { pk });
    } // 确定按钮点击调用函数,非必输
  });
}
/**
 * 加载查看版本页面
 *
 * @param {*} callback - 回调函数
 */
function initVersionTree(callback) {
  const treeRoot = {
    isleaf: false,
    pid: "__root__",
    refname: this.state.json["36010IR-000071"],
    /* 国际化处理： 版本号*/
    refpk: "-1"
  };
  let id = this.props.getUrlParam("id");
  ajax({
    url: API_URL.queryVersion,
    data: {
      queryAreaCode: "search",
      querytype: "tree",
      querycondition: {},
      pageCode: this.pageId,
      pageInfo: {
        pageIndex: 0,
        pageSize: "100"
      },
      def1: id //主键
    },
    success: res => {
      let { success, data } = res;
      if (success) {
        let treeData = this.props.syncTree.createTreeData(data.data.rows);
        this.setState(
          {
            isVersion: true
          },
          () => {
            this.props.syncTree.setSyncTreeData(this.treeId, [
              Object.assign(treeRoot, {
                children: treeData
              })
            ]);
            getCardData.call(this, id);
          }
        );
      }
    }
  });
}
/**
 * 打印
 * @param {*} props  页面内置对象
 */
function printBill(pk) {
  print("pdf", API_URL.print, {
    appcode: this.appcode,
    nodekey: this.nodekey,
    oids: [pk]
  });
}

/**
 * 输出
 * @param {*} props  页面内置对象
 */
function outPutBill(pk) {
  this.setState(
    {
      outputData: {
        nodekey: this.nodekey,
        oids: [pk],
        outputType: "output"
      }
    },
    () => {
      this.refs.printOutput.open();
    }
  );
}

/**
 * 是否重算还款计划
 * @param {*} props  页面内置对象
 */
function confirmReCal(props) {
  let status = props.getUrlParam("status");
  if (status === "createVersion") {
    let reCalFlag = false;
    promptBox({
      color: "warning",
      title: this.state.json["36010IR-000030"] /* 国际化处理： 重算还款计划*/,
      content: this.state.json[
        "36010IR-000031"
      ] /* 国际化处理： 确定要重算当前利率档案关联的放款单、债券发行所有单据的还款计划吗?*/,
      beSureBtnClick: () => {
        reCalFlag = true;
        saveBill.call(this, props, reCalFlag);
      },
      cancelBtnClick: () => {
        saveBill.call(this, props);
      }
    });
  } else {
    saveBill.call(this, props);
  }
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
function saveBill(props, reCalFlag = false) {
  let data = this.props.createTabsCardData(
    this.pageId,
    this.formId,
    this.tabOrder
  );
  let status = this.props.getUrlParam("status");
  let url = status === "createVersion" ? "createVersion" : "save";
  let saveData = getSaveData(props, data);
  let tableTypeObj = {
    rationrate: "cardTable",
    overduerate: "cardTable",
    advancerate: "cardTable"
  };
  let pkMapTs = new Map();
  let pk =
    this.props.form.getFormItemsValue(this.formId, this.primaryId).value ||
    this.props.getUrlParam("id");
  let ts =
    this.props.form.getFormItemsValue(this.formId, "ts") &&
    this.props.form.getFormItemsValue(this.formId, "ts").value;
  //主键与tsMap
  if (pk && ts) {
    pkMapTs.set(pk, ts);
  }
  saveData.pkMapTs = pkMapTs;
  // 是否重算还款计划
  if (reCalFlag) {
    saveData.userjson = "needRecalculate";
  }
  if (
    this.props.form.isCheckNow(this.formId) &&
    this.props.cardTable.checkTabRequired(this.tabOrder, this.tabOrder)
  ) {
    if (saveBeforeValid.call(this, saveData, url)) {
      this.props.validateToSave(
        saveData,
        () => {
          ajax({
            url: API_URL[url],
            data: saveData,
            success: res => {
              this.setState({
                bckStatus: true
              });
              if (res.success) {
                if (res.data) {
                  let id =
                    res.data.head[this.formId].rows[0].values[this.primaryId]
                      .value;
                  toast({
                    color: "success",
                    content: this.state.json["36010IR-000032"]
                  }); /* 国际化处理： 保存成功*/
                  props.setUrlParam({
                    id,
                    status: "browse"
                  });
                  setEditStatus.call(this, "browse");
                  getCardData.call(this, id, false, true);
                  // 缓存
                  if (status === "add" || status === "copy") {
                    addCache(id, res.data, this.formId, this.dataSource);
                  } else {
                    updateCache(
                      this.primaryId,
                      id,
                      res.data,
                      this.formId,
                      this.dataSource
                    );
                  }
                }
              }
            }
          });
        },
        tableTypeObj,
        ""
      );
    }
  }
}

//启用/停用
function setEnableStatus(type, content) {
  let pkMapTs = new Map();
  let pk = this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
  let ts =
    this.props.form.getFormItemsValue(this.formId, "ts") &&
    this.props.form.getFormItemsValue(this.formId, "ts").value;
  //主键与tsMap
  if (pk && ts) {
    pkMapTs.set(pk, ts);
  }
  ajax({
    url: API_URL[type],
    data: {
      pk,
      pkMapTs,
      pageCode: this.pageId
    },
    success: res => {
      let { data } = res;
      if (res.success && data) {
        updateCache(
          this.primaryId,
          pk,
          data,
          this.formId,
          this.dataSource,
          data.head[this.formId].rows[0].values
        );
        if (data.head) {
          data.head[this.formId] = showOrg.call(this, data.head[this.formId]);
          this.props.form.setAllFormValue({
            [this.formId]: data.head[this.formId]
          });
        }
        if (data.bodys) {
          this.props.cardTable.setAllTabsData(data.bodys, this.tabOrder);
        }
        buttonVisible.call(this, this.props);
        toast({ color: "success", content });
      }
    }
  });
}

//保存时将表头的利率复选框放到表体alter中
function getSaveData(props, data) {
  let status = props.getUrlParam("status");
  let newData = JSON.parse(JSON.stringify(data));
  let { rationflag, headflag, overdueflag } = data.head[
    CARD.form_id
  ].rows[0].values;
  newData.bodys.alter = {
    areaType: "table",
    areacode: "alter",
    rows: [
      {
        status: status === "add" ? 2 : 0, // 试试修改保存勾选还在不在
        values: {
          rationflag,
          headflag,
          overdueflag
        }
      }
    ]
  };
  //console.log("newdata", newData);
  return newData;
}

//删除版本回调
function handelDeleteVersion(data) {
  ajax({
    url: API_URL.deleteVersion,
    data,
    success: res => {
      if (res.success) {
        toast({
          color: "success",
          content: this.state.json["36010IR-000033"]
        }); /* 国际化处理： 删除版本成功*/
        getCardData.call(this, data.pk, false, true);
      }
    }
  });
}

//保存前校验
function saveBeforeValid(saveData, method) {
  let valid = true;
  let rowNums = this.props.cardTable.getNumberOfRows("rationrate"); //总行数
  let rationflag = this.props.form.getFormItemsValue(this.formId, "rationflag");
  if (method === "createVersion") {
    // 创建版本起效日期校验
    let reviseDate = this.props.form
      .getFormItemsValue(this.formId, "revisedate")
      .value.split(" ")[0];
    let newReviseDate = getDateDetail.call(this, reviseDate);
    let paramDate = this.props.getUrlParam("reviseDate");
    let oldReviseDate = paramDate
      ? getDateDetail.call(this, paramDate.split(" ")[0])
      : this.state.oldReviseDate;
    if (newReviseDate.year < oldReviseDate.year) {
      valid = false;
    } else if (newReviseDate.year === oldReviseDate.year) {
      if (newReviseDate.month < oldReviseDate.month) {
        valid = false;
      } else if (newReviseDate.month === oldReviseDate.month) {
        if (newReviseDate.day <= oldReviseDate.day) {
          valid = false;
        }
      }
    }
    if (!valid)
      toast({
        color: "warning",
        content: `${this.state.json["36010IR-000034"]}`
      }); /* 国际化处理： 新版本起效日期应在旧版本起效日期之后*/
  }
  if (
    rationflag &&
    rationflag.value &&
    saveData.bodys["rationrate"].rows.length === 0
  ) {
    toast({
      color: "warning",
      content: `${this.state.json["36010IR-000035"]}，${this.state.json["36010IR-000036"]}`
    }); /* 国际化处理： 勾选定额利率时,定额利率表体不能为空*/
    valid = false;
  } else if (saveData.bodys["rationrate"].rows.length > 0) {
    //定额利率
    let endamountCol = this.props.cardTable.getTabColValue(
      "rationrate",
      "endamount"
    ); //终点金额列数据
    let beginamountCol = this.props.cardTable.getTabColValue(
      "rationrate",
      "beginamount"
    ); //起点金额列数据
    let negEndamountData = endamountCol.map(item =>
      +item.value <= 0 ? item.value : false
    );
    let posEndamountData = endamountCol.map(item =>
      +item.value > 0 ? item.value : false
    );
    if (negEndamountData.length > 0) {
      for (let index of Object.keys(negEndamountData)) {
        let yoverrate = this.props.cardTable.getTabValByKeyAndIndex(
          "rationrate",
          index,
          "yoverrate"
        ); //透支年利率
        if (
          negEndamountData[index] &&
          (!yoverrate.value || +yoverrate.value === 0)
        ) {
          toast({
            color: "warning",
            content: `${this.state.json["36010IR-000007"]}${+index + 1}${
              this.state.json["36010IR-000037"]
            }，${this.state.json["36010IR-000038"]}0${
              this.state.json["36010IR-000039"]
            }，${this.state.json["36010IR-000040"]}`
          }); /* 国际化处理： 定额利率表体第,行,终点金额小于等于,时,必须输入透支利率*/
          valid = false;
          break;
        }
      }
    }
    if (valid && posEndamountData.length > 0) {
      for (let index of Object.keys(posEndamountData)) {
        let yrate = this.props.cardTable.getTabValByKeyAndIndex(
          "rationrate",
          index,
          "yrate"
        ); //年利率
        if (posEndamountData[index] && (!yrate.value || +yrate.value === 0)) {
          toast({
            color: "warning",
            content: `${this.state.json["36010IR-000007"]}${+index + 1}${
              this.state.json["36010IR-000037"]
            }，${this.state.json["36010IR-000041"]}0${
              this.state.json["36010IR-000039"]
            }，${this.state.json["36010IR-000042"]}`
          }); /* 国际化处理： 定额利率表体第,行,终点金额大于,时,必须输入普通利率*/
          valid = false;
          break;
        }
      }
    }
    if (
      valid &&
      beginamountCol[rowNums - 1] &&
      beginamountCol[rowNums - 1].value < 0
    ) {
      toast({
        color: "warning",
        content: `${this.state.json["36010IR-000043"]}，${this.state.json["36010IR-000044"]}0`
      }); /* 国际化处理： 定额利率表体最后一行,起点金额不能小于*/
      valid = false;
    } else if (
      valid &&
      endamountCol[rowNums - 1] &&
      endamountCol[rowNums - 1].value &&
      endamountCol[rowNums - 1].value !== "" &&
      endamountCol[rowNums - 1].value !== null
    ) {
      toast({
        color: "warning",
        content: `${this.state.json["36010IR-000043"]}，${this.state.json["36010IR-000045"]}`
      }); /* 国际化处理： 定额利率表体最后一行,终点金额必须为空*/
      valid = false;
    } else {
      let lastyrate = this.props.cardTable.getTabValByKeyAndIndex(
        "rationrate",
        rowNums - 1,
        "yrate"
      );
      if (valid && lastyrate && !lastyrate.value) {
        toast({
          color: "warning",
          content: `${this.state.json["36010IR-000043"]}，${this.state.json["36010IR-000042"]}`
        }); /* 国际化处理： 定额利率表体最后一行,必须输入普通利率*/
        valid = false;
      }
    }
  }
  return valid;
}

// 获取日期年月日
// date格式为2016-11-12
function getDateDetail(date) {
  let dateDetail = {};
  dateDetail.year = date.split("-")[0];
  dateDetail.month = date.split("-")[1];
  dateDetail.day = date.split("-")[2];
  return dateDetail;
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/