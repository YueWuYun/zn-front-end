/*azDOvWl/0tEhREAS0pMPz+dRX8jQRtjoPhjN+bUbp8Q=*/
import { ajax, cardCache, toast, viewModel } from "nc-lightapp-front";
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { baseReqUrl, card, javaUrl, PK_CODE } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import initPage, { afterSetData, resolveContractinfo } from "./initPage";
import { resolveThreeType } from "./resolve";
import { copy } from "./buttonClick";
let { getCacheById, updateCache, addCache, setDefData, getDefData } = cardCache;
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
/**
 * 新增
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
  props.setUrlParam({ id: pks });
  getCardData.call(this, pks);
}

/**
 * 新增
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCardData(id, isFirst = false, isRefresh = false, callback) {
  let cardData = getCacheById(id, this.dataSource);
  let status = this.props.getUrlParam("status");
  if (cardData && !isRefresh && !isFirst) {
    //有缓存且不是刷新按钮
    initPage.call(this, this.props);
    return;
  }
  ajax({
    url: `${baseReqUrl}${javaUrl.card}.do`,
    data: {
      pk: id,
      pageCode:
        this.props.getUrlParam("scene") === "linksce_card"
          ? card.pageCode_link
          : this.pageId
    },
    success: res => {
      let { success, data } = res;
      let keys = [];
      if (success) {
        if (data && data.head) {
          let ts = data.head[this.formId].rows[0].values.ts.value;
          let partdebtor =
            data.head[this.formId].rows[0].values.partdebtor.value;
          let owerdebtor =
            data.head[this.formId].rows[0].values.owerdebtor.value;
          let indebtor = data.head[this.formId].rows[0].values.indebtor.value;
          let partguarantor =
            data.head[this.formId].rows[0].values.partguarantor.value;
          let owerguarantor =
            data.head[this.formId].rows[0].values.owerguarantor.value;
          let inguarantor =
            data.head[this.formId].rows[0].values.inguarantor.value;
          let fincreditor =
            data.head[this.formId].rows[0].values.fincreditor.value;
          let partcreditor =
            data.head[this.formId].rows[0].values.partcreditor.value;
          let increditor =
            data.head[this.formId].rows[0].values.increditor.value;
          let owercreditor =
            data.head[this.formId].rows[0].values.owercreditor.value;
          // 债务人  债务人外部单位、债务人本单位、债务人内部单位
          this.debtor = partdebtor || owerdebtor || indebtor;
          // 担保人  担保人外部单位、担保人本单位、担保人内部单位
          this.guarantor = partguarantor || owerguarantor || inguarantor;
          // 债权人 债权人金融机构、债权人外部单位、债权人内部单位、债权人本单位
          this.creditor =
            fincreditor || partcreditor || increditor || owercreditor;
          this.idTs = { id, ts };
          if (status === "change") {
            let guatype = data.head[this.formId].rows[0].values.guatype;
            setGlobalStorage(
              "localStorage",
              "guatype",
              JSON.stringify(guatype),
              () => {}
            );
            resolveChange.call(this, guatype.value);
          } else if (status === "edit") {
            resolveThreeType.call(
              this,
              this.props,
              data.head && data.head[this.formId]
            );
          }
          this.props.form.setAllFormValue({
            [this.formId]: data.head[this.formId]
          });
        }
        if (data && data.bodys) {
          let resolut = resolveTabKey.call(this, data);
          keys = resolut.keys;
          this.props.cardTable.setAllTabsData(
            resolut.data.bodys,
            this.tabOrder,
            afterSetData.bind(this, this.props, keys),
            keys
          );
        }
        callback && callback.call(this);
        resolveContractinfo.call(this, this.props, data);
        orgVersionView(this.props, this.formId); //组织版本视图
        buttonVisible.call(this, this.props);
        // 把显示的key存到缓存里面，便于下次取缓存
        let tabDefData =
          getDefData(this.tabCache, this.dataSource) || new Map();
        tabDefData.set(id, keys);
        setDefData(this.tabCache, this.dataSource, tabDefData);
        // if (isFirst || isRefresh) {//didmount或者刷新按钮
        //     //保存卡片缓存
        //     addCache(id, data, this.formId, this.cache);
        // } else {
        //     // 更新卡片缓存
        //     updateCache(this.primaryId, id, data, this.formId, this.cache);
        // }
        if (isRefresh || isFirst) {
          // 更新列表缓存
          updateCache(this.primaryId, id, data, this.formId, this.dataSource);
        }
      }
      //错误弹出信息
      let sagaGtxid = this.props.form.getFormItemsValue(
        this.formId,
        "saga_gtxid"
      );
      let sagaStatus = this.props.form.getFormItemsValue(
        this.formId,
        "saga_status"
      );
      if (sagaGtxid && sagaStatus && sagaStatus.value == "1") {
        this.props.socket.showToast({
          gtxid: sagaGtxid.value,
          billpk: this.props.form.getFormItemsValue(this.formId, PK_CODE).value
        });
      }
    },
    error: res => {
      toast({ color: "danger", content: res.message });
      this.props.cardTable.setAllTabsData(null, this.tabOrder);
    }
  });
}
/**
 * 新增
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCopyCardData(id, isFirst = false, isRefresh = false) {
  ajax({
    url: `${baseReqUrl}${javaUrl.copy}.do`,
    data: {
      pk: id,
      pageCode:
        this.props.getUrlParam("scene") === "linksce_card"
          ? card.pageCode_link
          : this.pageId
    },
    success: res => {
      let { success, data } = res;
      let keys = [];
      if (success) {
        if (data && data.head) {
          let {
            ts,
            partdebtor,
            owerdebtor,
            indebtor,
            partguarantor,
            owerguarantor,
            inguarantor,
            fincreditor,
            partcreditor,
            increditor,
            owercreditor,
            guatype
          } = data.head[this.formId].rows[0].values;
          ts = ts && ts.value;
          partdebtor = partdebtor && partdebtor.value;
          owerdebtor = owerdebtor && owerdebtor.value;
          indebtor = indebtor && indebtor.value;
          partguarantor = partguarantor && partguarantor.value;
          owerguarantor = owerguarantor && owerguarantor.value;
          inguarantor = inguarantor && inguarantor.value;
          fincreditor = fincreditor && fincreditor.value;
          partcreditor = partcreditor && partcreditor.value;
          increditor = increditor && increditor.value;
          owercreditor = owercreditor && owercreditor.value;
          // 担保方式
          guatype = guatype && guatype.value;
          // 债务人  债务人外部单位、债务人本单位、债务人内部单位
          this.debtor = partdebtor || owerdebtor || indebtor;
          // 担保人  担保人外部单位、担保人本单位、担保人内部单位
          this.guarantor = partguarantor || owerguarantor || inguarantor;
          // 债权人 债权人金融机构、债权人外部单位、债权人内部单位、债权人本单位
          this.creditor =
            fincreditor || partcreditor || increditor || owercreditor;
          this.idTs = { id, ts };
          this.props.form.setAllFormValue({
            [this.formId]: data.head[this.formId]
          });
          resolveThreeType.call(
            this,
            this.props,
            data.head && data.head[this.formId]
          );
          this.props.form.setFormItemsDisabled(this.formId, {
            pk_org: true
          });
          if (data.bodys) {
            let resolut = resolveTabKey.call(this, data);
            keys = resolut.keys;
            this.props.cardTable.setAllTabsData(
              resolut.data.bodys,
              this.tabOrder,
              afterSetData.bind(this, this.props, keys),
              keys
            );
            // 当担保方式为保证或者混合时
            if (guatype === "1" || guatype === "4") {
              //循环保证信息表体，根据保证类型控制后续三个字段的编辑性
              let rows = this.props.cardTable.getVisibleRows("warrantyinfo");
              for (let row of rows) {
                let index = row.values.numberindex.value - 1;
                //获取保证人类型
                let val = row.values.warrantortype.value;
                this.props.cardTable.setEditableByIndex(
                  "warrantyinfo",
                  index,
                  ["warrantorou"],
                  val == "1"
                );
                this.props.cardTable.setEditableByIndex(
                  "warrantyinfo",
                  index,
                  ["warrantorin"],
                  val == "2"
                );
                this.props.cardTable.setEditableByIndex(
                  "warrantyinfo",
                  index,
                  ["warrantorfin"],
                  val == "3"
                );
              }
            }
          }
        }
        resolveContractinfo.call(this, this.props, data);
        orgVersionView(this.props, this.formId); //组织版本视图
        buttonVisible.call(this, this.props);
        // 把显示的key存到缓存里面，便于下次取缓存
        let tabDefData =
          getDefData(this.tabCache, this.dataSource) || new Map();
        tabDefData.set(id, keys);
        setDefData(this.tabCache, this.dataSource, tabDefData);
        if (isRefresh) {
          // 更新列表缓存
          updateCache(this.primaryId, id, data, this.formId, this.dataSource);
        }
      }
    },
    error: res => {
      toast({ color: "danger", content: res.message });
      this.props.cardTable.setAllTabsData(null, this.tabOrder);
    }
  });
}

export function resolveTabKey(data) {
  let keys = Object.keys(data.bodys);
  let guatype = data.head[this.formId].rows[0].values.guatype.value;
  if (guatype === "4") {
    if (!keys.includes("warrantyinfo")) {
      data.bodys.warrantyinfo = {
        areacode: "warrantyinfo",
        rows: []
      };
    }
    if (!keys.includes("guarantyinfo")) {
      data.bodys.guarantyinfo = {
        areacode: "guarantyinfo",
        rows: []
      };
    }
    if (!keys.includes("pledgeinfo")) {
      data.bodys.pledgeinfo = {
        areacode: "pledgeinfo",
        rows: []
      };
    }
  }
  keys = Object.keys(data.bodys);
  return {
    data,
    keys
  };
}

// 页面初始化方法
export function initMethod(props, callback) {
  let status = props.getUrlParam("status");
  let id = this.props.getUrlParam("id");
  if (status === "add") {
    let pk_org = props.form.getFormItemsValue(this.formId, "pk_org").display;
    props.form.setFormItemsValue(this.formId, {
      contracttype: {
        display: this.state.json["36620GC-000003"],
        value: "1"
      }, //合同类型/* 国际化处理： 担保合同*/
      iscontrary: {
        display: this.state.json["36620GC-000022"],
        value: true
      }, //是否需要反担保/* 国际化处理： 是*/
      guatype: { display: this.state.json["36620GC-000023"], value: "4" }, //担保方式/* 国际化处理： 混合*/
      // creditortype: {display: "本单位", value: "4"},       //债权人类型
      creditor: { display: pk_org, value: pk_org }, //债权人
      olcrate: { display: "", value: "1.00" } //组织本币汇率
    });
    callback && callback();
    return;
  } else if (status === "copy") {
    if (id) {
      copy.call(this, this.props, "copy", id);
    }
  }
}

// 变更时，处理主表字段的可编辑性
export function resolveChange(val) {
  this.props.initMetaByPkorg();
  setTimeout(() => {
    this.props.form.setFormItemsDisabled(this.formId, {
      pk_org: true, //组织
      guaamount: false, //担保总金额
      guarange: false, //担保范围
      guaenddate: false, //担保结束日期
      pridebtamount: false, //债务金额
      enddate: false, //债务终止日期
      guatype: val === "4" //担保方式
    });
  }, 0);
}

//变更时，处理tabs-table字段的可编辑性
export function resolveTabsChange(flag = true) {
  let currTab = this.props.cardTable.getCurTabKey();
  let result = getRowId.call(this);
  let change = [],
    add = [];
  switch (currTab) {
    case "warrantyinfo":
      change = ["warratio", "waramount"]; // 保证比例 保证金额
      add = [
        "warrantortype",
        "warrantorname",
        "warratio",
        "summary",
        "waramount"
      ];
      break;
    case "guarantyinfo":
      change = ["usinglcamount"];
      add = ["pledgeno", "usinglcamount", "summary"];
      break;
    case "pledgeinfo":
      change = ["usinglcamount"];
      add = ["pledgeno", "usinglcamount", "summary"];
      break;
    case "contractinfo":
      change = [];
      add = [];
      break;
    case "detailinfo":
      change = [
        "organname",
        "guaamount",
        "olcguaamount",
        "pk_currtype",
        "summary"
      ];
      add = [
        "organname",
        "guaamount",
        "olcguaamount",
        "pk_currtype",
        "summary"
      ];
      break;
  }
  if (result.change.length) {
    this.props.cardTable.setEditableByRowId(
      this.tabCode,
      result.change,
      change,
      flag
    );
  }
  if (result.add.length) {
    this.props.cardTable.setEditableByRowId(
      this.tabCode,
      result.add,
      add,
      flag
    );
  }
}

function getRowId() {
  let tabData = this.props.cardTable.getAllData(this.tabCode);
  let rows = tabData.rows || [];
  let result = {
    change: [],
    add: []
  };
  for (let item of rows) {
    if (["0", "1"].includes(item.status)) {
      result.change.push(item.rowid);
    } else if (item.status === "2") {
      result.add.push(item.rowid);
    }
  }
  return result;
}

/*azDOvWl/0tEhREAS0pMPz+dRX8jQRtjoPhjN+bUbp8Q=*/