/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/
import { ajax, cardCache, toast, getLangCode } from "nc-lightapp-front";
import { buttonVisible } from "./buttonVisible";
import { setSettleleapdayEdit } from "./buttonClick";
import { resolveSettleWay } from "./afterEvent";
import { baseReqUrl, javaUrl } from "../../cons/constant.js";
let { getCacheById, updateCache } = cardCache;

/**
 * 新增
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
  getCardData.call(this, pks);
  props.setUrlParam(pks);
}

/**
 * 新增
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 * @param {*} callback   请求成功回调函数
 */
export function getCardData(id, isFirst = false, isRefresh = false, callback) {
  let cardData = getCacheById(id, this.cache);
  if (cardData && !isRefresh) {
    //有缓存且不是刷新按钮
    this.props.form.setAllFormValue({
      [this.formId]: cardData.head[this.formId],
    });
    this.props.cardTable.setTableData(
      this.tableId,
      cardData.bodys[this.tableId] || { rows: [] }
    );
    buttonVisible.call(this, this.props);
    billHeadVisible.call(
      this,
      true,
      true,
      cardData.head[this.formId].rows[0].values[getLangSettleName.call(this)]
        .value
    );
    if (this.props.getUrlParam("status") !== "browse") {
      if (!this.props.getUrlParam("editStatus") === "edit") {
        let settleway = this.props.form.getFormItemsValue(
          this.formId,
          "settleway"
        ).value;
        resolveSettleWay.call(this, settleway, "", this.props); //控制编辑性
        setSettleleapdayEdit.call(this);
        //console.log(this.props.getUrlParam('status'));
      }
      billHeadVisible.call(
        this,
        false,
        true,
        cardData.head[this.formId].rows[0].values.settlename.value
      );
    }
    return;
  }
  ajax({
    url: `${baseReqUrl}${javaUrl.card}.do`,
    data: {
      pk: id,
      pageCode: this.pageId,
    },
    success: (res) => {
      let { success, data } = res;
      if (success) {
        if (data && data.head) {
          let sceneFlag = this.props.getUrlParam("scene") === "linksce";
          this.props.form.setAllFormValue({
            [this.formId]: data.head[this.formId],
          });
          billHeadVisible.call(
            this,
            !sceneFlag,
            true,
            data.head[this.formId].rows[0].values[getLangSettleName.call(this)]
              .value
          );
          if (this.props.getUrlParam("status") !== "browse") {
            if (!this.props.getUrlParam("editStatus") === "edit") {
              let settleway =
                data.head[this.formId] &&
                data.head[this.formId].rows[0] &&
                data.head[this.formId].rows[0].values.settleway.value;
              resolveSettleWay.call(this, settleway, "", this.props); //控制编辑性
            }
            billHeadVisible.call(
              this,
              false,
              true,
              data.head[this.formId].rows[0].values[
                getLangSettleName.call(this)
              ].value
            );
          }
        }
        if (data && data.bodys) {
          this.props.cardTable.setTableData(
            this.tableId,
            data.bodys[this.tableId] || { rows: [] }
          );
        }
        buttonVisible.call(this, this.props);
        callback && callback();
      }
    },
    error: (res) => {
      toast({ color: "danger", content: res.message && res.message.message });
      this.props.cardTable.setTableData(this.tableId, { rows: [] });
    },
  });
}

/**
 * 单据标题设置
 * @param {*} backBtnFlag       是否显示返回按钮，默认否
 * @param {*} billCodeFlag      是否显示单据号，默认否
 * @param {*} billCode          要显示的单据号，默认为空
 */
export function billHeadVisible(
  backBtnFlag = false,
  billCodeFlag = false,
  billCode = ""
) {
  //设置状态
  this.props.BillHeadInfo.setBillHeadInfoVisible({
    showBackBtn: backBtnFlag, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
    showBillCode: billCodeFlag, //控制显示单据号：true为显示,false为隐藏 ---非必传
    billCode: billCode, //修改单据号---非必传
  });
}

// 预置数据可编辑字段处理
export function handleSysDatas() {
  let sysMark = this.props.getUrlParam("sysMark");
  if (sysMark) {
    this.props.form.setFormItemsDisabled(this.formId, {
      code: true,
      settleway: true,
      settlecycle: true,
      cycleunit: true,
      endsettledate: true,
      remark: true,
    });
  }
}

/**
 * 获取多语环境结息日名称字段的key值
 */
export function getLangSettleName() {
  // 语种
  const langCode = getLangCode();
  let result;
  switch (langCode) {
    case "simpchn": // 简体中文
      result = "settlename";
      break;
    case "tradchn": // 繁体中文
      result = "settlename2";
      break;
    case "english": // 英文
      result = "settlename3";
      break;
  }
  return result;
}

/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/