/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/
import { ajax, cardCache } from "nc-lightapp-front";
import { buttonVisible } from "./buttonVisible";
import { CARD, API_URL } from "../../cons/constant";
import { setItemDisabledFn } from "./afterEvent";
import { queryVersion } from "./buttonClick";
let { getCacheById, updateCache } = cardCache;

/**
 * 卡片分页
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
  getCardData.call(this, pks);
  props.setUrlParam(pks);
}

/**
 * 卡片详情
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 * @param {*} callback   请求成功毁掉函数, 默认否
 */
export function getCardData(id, isFirst = false, isRefresh = false, callback) {
  let status = this.props.getUrlParam("status");
  let cardData = getCacheById(id, this.dataSource);
  if (cardData && !isRefresh) {
    //有缓存且不是刷新按钮
    // let data = {};
    // for (let item of this.tabOrder) {
    // 	data[item] = cardData.bodys[item] || { rows: [] };
    // }
    cardData = formatCardData.call(this, cardData); //将子表复选框放到表头
    cardData.head[this.formId] = showOrg.call(this, cardData.head[this.formId]);
    this.props.form.setAllFormValue({
      [this.formId]: cardData.head[this.formId]
    });
    setItemDisabled(this.props, status);
    initByBtn.call(this, status);
    this.props.cardTable.setAllTabsData(cardData.bodys, this.tabOrder);
    buttonVisible.call(this, this.props);
    billHeadVisible.call(
      this,
      true,
      true,
      cardData.head[this.formId].rows[0].values.rateid.value
    );
    if (this.props.getUrlParam("status") !== "browse") {
      billHeadVisible.call(
        this,
        false,
        true,
        cardData.head[this.formId].rows[0].values.rateid.value
      );
    }
    return;
  }
  ajax({
    url: API_URL.queryCard,
    data: {
      pk: id,
      pageCode: this.pageId
    },
    success: res => {
      let { success, data } = res;
      data = formatCardData.call(this, data); //将子表复选框放到表头
      if (success) {
        if (status === "browse") {
          let sceneFlag = this.props.getUrlParam("scene") === "linksce";
          billHeadVisible.call(
            this,
            !sceneFlag,
            true,
            data.head[this.formId].rows[0].values.rateid.value
          );
        } else if (status !== "browse") {
          billHeadVisible.call(
            this,
            false,
            true,
            data.head[this.formId].rows[0].values.rateid.value
          );
        }
        if (data && data.head) {
          data.head[this.formId] = showOrg.call(this, data.head[this.formId]);
          this.props.form.setAllFormValue({
            [this.formId]: data.head[this.formId]
          });
          setItemDisabled(this.props, status);
        }
        if (data && data.bodys) {
          this.props.cardTable.setAllTabsData(data.bodys, this.tabOrder);
        }
        buttonVisible.call(this, this.props);
        initByBtn.call(this, status);
        // 更新缓存
        updateCache(this.primaryId, id, data, this.formId, this.dataSource);
        callback && callback();
      }
    }
  });
}

// settable之前改组织的值（集团和全局）
export function showOrg(data) {
  const globalInfo =
    window.parent.GETBUSINESSINFO && window.parent.GETBUSINESSINFO();
  if (this.props.pageType === "group") {
    //集团时组织默认为集团
    data.rows[0].values.pk_org = {
      display: globalInfo.groupName,
      value: globalInfo.groupId
    };
  } else if (this.props.pageType === "global") {
    //全局
    data.rows[0].values.pk_org = {
      display: this.state.json["36010IR-000046"] /* 国际化处理： 全局*/,
      value: "GLOBLE00000000000000"
    };
  }
  return data;
}

/**
 * 将卡片页数据alter表体中利率复选框放到表头中
 *
 * @param {*} data - 卡片数据
 */
function formatCardData(data) {
  let result = JSON.parse(JSON.stringify(data));
  let { rationflag, headflag, overdueflag } =
    result.bodys && result.bodys.alter && result.bodys.alter.rows[0].values;
  result.head[this.formId].rows[0].values.rationflag = rationflag;
  result.head[this.formId].rows[0].values.headflag = headflag;
  result.head[this.formId].rows[0].values.overdueflag = overdueflag;
  return result;
}

//根据返回数据设置字段编辑性
export function setItemDisabled(props, type, pkOrg) {
  let data = props.form.getAllFormValue(CARD.form_id);
  let headData = data && data.rows[0] && data.rows[0].values;
  if (headData && Object.keys(headData).length > 0) {
    if (
      (headData["rationflag"] && headData["rationflag"].value) ||
      (headData["headflag"] && headData["headflag"].value) ||
      (headData["overdueflag"] && headData["overdueflag"].value)
    ) {
      props.button.setButtonDisabled("addRow", false);
    }

    headData.ratetype &&
      setItemDisabledFn(props, "ratetype", headData.ratetype.value);
    if (headData.rationflag && headData.rationflag.value)
      setItemDisabledFn(props, "rationflag", headData.rationflag.value);
    if (headData.overdueflag && headData.overdueflag.value)
      setItemDisabledFn(props, "overdueflag", headData.overdueflag.value);
  }

  // if(type === 'add'){
  //     if (props.pageType === 'org' && !pkOrg){
  //         //单据有主组织，新增时,将其他字段设置为不可编辑.
  //         props.initMetaByPkorg('pk_org');
  //     }
  // }
  props.form.setFormItemsDisabled(CARD.form_id, { ratetype: type === "edit" });
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 */
export function setEditStatus(status) {
  buttonVisible.call(this, this.props);
  if (status === "edit") {
    Promise.resolve(setItemDisabled(this.props, status)); //异步执行设置编辑性，目的是等待卡片切换成编辑态之后再设置编辑性，也可以使用setTimeout
  }
}

export function clearAll(props) {
  let data = {
    rows: []
  };
  props.form.EmptyAllFormValue(CARD.form_id);
  props.cardTable.setAllTabsData(data, CARD.tab_order);
  buttonVisible.call(this, props);
}

//初始化表单
export function initForm(type, pkOrg, date) {
  const globalInfo =
    window.parent.GETBUSINESSINFO && window.parent.GETBUSINESSINFO();
  if (type === "add") {
    if (this.props.pageType === "org" && !pkOrg) {
      //组织

      let { pk_org, org_Name, pk_org_v, org_v_Name } = this.state.context;
      this.props.form.setFormItemsValue(this.formId, {
        pk_org: { value: pk_org, display: org_Name },
        pk_org_v: { value: pk_org_v, display: org_v_Name }
      });
      //单据有主组织，新增时,将其他字段设置为不可编辑.
      this.props.initMetaByPkorg("pk_org");
    } else if (this.props.pageType === "group") {
      //集团时组织默认为集团
      this.props.form.setFormItemsValue(CARD.form_id, {
        pk_org: { display: globalInfo.groupName, value: globalInfo.groupId }
      });
    } else if (this.props.pageType === "global") {
      //全局
      this.props.form.setFormItemsValue(CARD.form_id, {
        pk_org: {
          display: this.state.json["36010IR-000046"],
          value: "GLOBLE00000000000000"
        }
      }); /* 国际化处理： 全局*/
    }
    this.props.form.setFormItemsValue(CARD.form_id, {
      finance_rate_type: {
        display: this.state.json["36010IR-000002"],
        value: "1"
      } /* 国际化处理： 基准利率*/,
      dayofyear: { display: "360", value: "360" },
      enablestate: {
        display: this.state.json["36010IR-000047"],
        value: "2"
      } /* 国际化处理： 已启用*/,
      inputdate: { value: date && date.inputdate },
      revisedate: { value: date && date.revisedate }
    });
    let emptyData = {};
    for (let item of CARD.tab_order) {
      emptyData[item] = { rows: [] };
    }
    this.props.cardTable.setAllTabsData(emptyData, CARD.tab_order);
    billHeadVisible.call(this, false, false);
    // setItemDisabled(this.props, type, pkOrg);
  }
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
    billCode: billCode //修改单据号---非必传
  });
}

// 根据页面状态控制字段编辑性
export function initByBtn(status) {
  let rateType = this.props.form.getFormItemsValue(this.formId, "ratetype")
    .value;
  if (rateType === "LRATE") {
    this.props.form.setFormItemsDisabled(this.formId, {
      begindays: true,
      beginamount: true,
      yoverrate: true,
      moverrate: true,
      overrate: true
    });
  }
  if (status === "createVersion") {
    this.props.form.setFormItemsDisabled(this.formId, {
      rateid: true,
      inputdate: true,
      ratename: true,
      ratetype: true,
      dayofyear: true,
      finance_rate_type: true
    });
  } else if (status === "edit") {
    this.props.form.setFormItemsDisabled(this.formId, {
      rateid: false,
      ratename: false,
      dayofyear: false,
      inputdate: false
    });
  }
}

// 初始化页面数据
export function initData(pkOrg, date) {
  let id = this.props.getUrlParam("id");
  let status = this.props.getUrlParam("status");
  let pageType = this.props.getUrlParam("pageType");
  if (status === "add") {
    initForm.call(this, status, pkOrg, date);
  } else if (id) {
    if (status === "edit" || status === "createVersion") {
      this.props.cardTable.setStatus(this.tabCode, "edit");
      getCardData.call(this, id, true);
    } else if (status === "browse" && pageType === "version") {
      queryVersion.call(this);
    } else if (status === "browse") {
      getCardData.call(this, id, true);
    }
  }
}

/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/