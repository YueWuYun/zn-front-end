/*azDOvWl/0tEhREAS0pMPz+dRX8jQRtjoPhjN+bUbp8Q=*/
import { ajax, cardCache, toast } from "nc-lightapp-front";
import { buttonVisible } from "./buttonVisible";
import { resolveOwner, resolveRequiredMeta } from "./afterEvent";
import { baseReqUrl, javaUrl, PK_CODE } from "../../cons/constant.js";
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
let { getCacheById, updateCache, addCache, getDefData } = cardCache;

/**
 * 新增
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
  props.setUrlParam(pks);
  getCardData.call(this, pks);
}

/**
 * 新增
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCardData(id, isFirst = false, isRefresh = false) {
  let cardData = getCacheById(id, this.cache);
  let status = this.props.getUrlParam("status");
  let isEdit = status === "edit";
  if (cardData && !isRefresh && !isFirst) {
    //有缓存且不是刷新按钮
    this.props.form.setAllFormValue({
      [this.formId]: cardData.head[this.formId]
    });
    orgVersionView(this.props, this.formId); //组织版本视图
    buttonVisible.call(this, this.props);
    let measurable = cardData.head[this.formId].rows[0].values.measurable.value;
    let owner = cardData.head[this.formId].rows[0].values.owner;
    let ts = cardData.head[this.formId].rows[0].values.ts.value;
    this.idTs = { id, ts };
    if (isEdit) {
      this.props.resMetaAfterPkorgEdit();
      this.props.form.setFormItemsDisabled(
        this.formId,
        Object.assign(
          {},
          resolveMeasurable.call(this, !measurable, null, null),
          resolveOwner.call(this, this.props, owner)
        )
      );
    } else if (status === "change") {
      resolveChange.call(this, !measurable);
    }
    return;
  }
  ajax({
    url: `${baseReqUrl}${javaUrl.card}.do`,
    data: {
      pk: id,
      pageCode: this.pageId
    },
    success: res => {
      let { success, data } = res;
      if (success) {
        if (data && data.head) {
          this.props.form.setAllFormValue({
            [this.formId]: data.head[this.formId]
          });
          let { measurable, guagptype, owner, ts, datasource } = data.head[
            this.formId
          ].rows[0].values;
          measurable = measurable && measurable.value;
          ts = ts && ts.value;
          datasource = datasource && datasource.value;
          // 物权担保分类
          guagptype = guagptype && guagptype.value;
          this.idTs = { id, ts };
          if (isEdit) {
            this.props.resMetaAfterPkorgEdit();
            this.props.form.setFormItemsDisabled(
              this.formId,
              Object.assign(
                {},
                resolveMeasurable.call(this, !measurable, null, null),
                resolveOwner.call(this, this.props, owner),
                { ownunit: true }
              )
            );
            resolveRequiredMeta.call(
              this,
              this.props,
              this.formId,
              resolveOwner.call(this, this.props, owner)
            );
            // 物权担保分类 为抵押时, 资产编号 字段可以编辑
            this.props.form.setFormItemsDisabled(this.formId, {
              assetno: guagptype === "2"
            });
          } else if (status === "change") {
            resolveChange.call(this, !measurable);
          }
          // 物权来源 为商业汇票时 不可修改、删除、复制
          if (datasource === "2") {
            this.props.button.setButtonDisabled({
              Edit: true,
              Copy: true,
              Delete: true
            });
          }
        } else {
          // 返回数据为空时 显示提示
          toast({
            color: "warning",
            content: this.state.json["36620GP-000060"]
          }); /* 国际化处理： 单据已被修改，请重新查询！*/
        }
        orgVersionView(this.props, this.formId); //组织版本视图
        buttonVisible.call(this, this.props);
        if (isFirst || isRefresh) {
          //didmount或者刷新按钮
          //保存缓存
          addCache(id, data, this.formId, this.cache);
        } else {
          // 更新缓存
          updateCache(this.primaryId, id, data, this.formId, this.cache);
        }
        if (isRefresh) {
          toast({
            color: "success",
            content: this.state.json["36620GP-000059"]
          }); /* 国际化处理： 刷新成功！*/
          // 更新列表缓存
          updateCache(this.primaryId, id, data, this.formId, this.dataSource);
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
            billpk: this.props.form.getFormItemsValue(this.formId, PK_CODE)
              .value
          });
        }
      }
      // 需要在此处添加  单据已被修改，请重新查询！
    }
  });
}
/**
 * 复制
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCopyCardData(id, isFirst = false, isRefresh = false) {
  let status = this.props.getUrlParam("status");
  ajax({
    url: `${baseReqUrl}${javaUrl.copy}.do`,
    data: {
      pk: id,
      pageCode: this.pageId
    },
    success: res => {
      let { success, data } = res;
      if (success) {
        if (data && data.head) {
          let { measurable, owner, ts, guagptype } = data.head[
            this.formId
          ].rows[0].values;
          measurable = measurable && measurable.value;
          ts = ts && ts.value;
          // 物权担保分类
          guagptype = guagptype && guagptype.value;
          this.props.form.setAllFormValue({
            [this.formId]: data.head[this.formId]
          });
          this.idTs = { id, ts };
          if (status === "copy") {
            this.props.resMetaAfterPkorgEdit();
            this.props.form.setFormItemsDisabled(
              this.formId,
              Object.assign(
                {},
                resolveMeasurable.call(this, !measurable, null, null),
                resolveOwner.call(this, this.props, owner),
                { ownunit: true }
              )
            );
            resolveRequiredMeta.call(
              this,
              this.props,
              this.formId,
              resolveOwner.call(this, this.props, owner)
            );
            // 物权担保分类 为抵押时, 资产编号 字段可以编辑
            this.props.form.setFormItemsDisabled(this.formId, {
              assetno: guagptype === "2"
            });
          } else if (status === "change") {
            setTimeout(() => {
              resolveChange.call(this, !measurable);
            }, 0);
          }
        }
        orgVersionView(this.props, this.formId); //组织版本视图
        buttonVisible.call(this, this.props);
        this.props.form.setFormItemsDisabled(this.formId, {
          //编辑性
          pk_org: true
        });
        if (isFirst || isRefresh) {
          //didmount或者刷新按钮
          //保存缓存
          addCache(id, data, this.formId, this.cache);
        } else {
          // 更新缓存
          updateCache(this.primaryId, id, data, this.formId, this.cache);
        }
        if (isRefresh) {
          // 更新列表缓存
          updateCache(this.primaryId, id, data, this.formId, this.dataSource);
        }
      }
    }
  });
}

/**
 * 请求列表接口
 * @param {*} cusCondition     自定义查询条件
 */
export function getListData(cusCondition) {
  let cacheCondition = getDefData(this.searchKey, this.dataSource);
  let pageInfo = this.props.table.getTablePageInfo(this.tableId);
  pageInfo.pageIndex = 0;
  let meta = this.props.meta.getMeta();
  let searchdata = cacheCondition
    ? {
        querycondition: cacheCondition,
        pageInfo: pageInfo,
        oid: meta.search.oid,
        pageCode: this.pageId,
        queryAreaCode: this.searchId, //查询区编码
        querytype: "tree"
      }
    : this.props.search.getQueryInfo(this.searchId, false);
  if (cusCondition) {
    searchdata.custcondition = {
      logic: "and", //逻辑操作符，and、or
      conditions: cusCondition
    };
  }
  searchdata.pageCode = this.pageId;
  searchdata.pageInfo = pageInfo;
  //根据页签状态添加自定义查询条件
  if (this.state.activeTab && this.state.activeTab !== "all") {
    searchdata.custcondition = {
      logic: "and",
      conditions: [
        {
          field: "busistatus",
          oprtype: "=",
          value: {
            firstvalue: this.state.activeTab,
            secondvalue: null
          }
        }
      ]
    };
  }
  ajax({
    url: `${baseReqUrl}${list}.do`,
    data: searchdata,
    success: res => {
      listRender.call(this, res);
      this.queryListCallback && this.queryListCallback(res);
      toggleListHeadBtnDisabled.call(this);
    }
  });
}
/**
 * 处理是否可计量的联动效果
 * @param {*} bool         是否Disabled
 * @param {*} isSetVal     是否改变值
 * @param {*} isBack       是否改变值
 */
export function resolveMeasurable(bool, isSetVal = false, isBack = true) {
  let disabledObj = {
    p_specno: bool, //规格型号
    p_count: bool, //数量
    p_unit: bool, //单位
    p_price: bool, //单价
    p_quality: bool, //质量
    p_status: bool, //状况
    p_location: bool, //所在地
    originprice: !bool, //原值
    totalpledge: true, //累计已质（抵）押价值
    restpledge: true //剩余质（抵）押价值
    // srcbillno: true, 		//来源单据号
  };
  if (isBack) {
    this.props.form.setFormItemsDisabled(this.formId, disabledObj);
  }
  if (isSetVal) {
    this.props.form.setFormItemsValue(this.formId, {
      p_specno: { display: null, value: null }, //规格型号
      p_count: { display: null, value: null }, //数量
      p_unit: { display: null, value: null }, //单位
      p_price: { display: null, value: null }, //单价
      p_quality: { display: null, value: null }, //质量
      p_status: { display: null, value: null }, //状况
      p_location: { display: null, value: null }, //所在地
      originprice: { display: null, value: null }, //原值
      firstprice: { display: null, value: null }, //最初评估价值
      price: { display: null, value: null } //评估增减值
    });
  }
  return disabledObj;
}

// 变更时，处理字段的可编辑性
export function resolveChange(bool) {
  setTimeout(() => {
    this.props.initMetaByPkorg();
    this.props.form.setFormItemsDisabled(this.formId, {
      pk_org: true, //所属组织
      p_count: bool, //数量
      p_price: bool, //单价
      p_quality: bool, //质量
      p_status: bool, //状况
      p_location: bool, //所在地
      curprice: false, //当前评估价值
      assessorg: false, //评估机构
      pledgerate: false //抵质押率
    });
  }, 0);
}

/*azDOvWl/0tEhREAS0pMPz+dRX8jQRtjoPhjN+bUbp8Q=*/