/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/
import { ajax, cardCache, toast } from "nc-lightapp-front";
import { buttonVisible } from "./buttonVisible";
import { baseReqUrl, javaUrl, accList } from "../../cons/constant.js";
import { billHeadVisible } from "../../public/event";
let { getCacheById, setDefData, getDefData } = cardCache;

/**
 *
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
  getCardData.call(this, pks);
  props.setUrlParam(pks);
}
//初始化表单
export function initForm(props) {
  if (this.appcode == "36010NBFO") {
    //给全局的所属组织赋默认值

    props.form.setFormItemsValue(this.formId, {
      pk_org: {
        value: "GLOBLE00000000000000",
        display: this.state.json["36010NBFO-000046"]
      }
    });
  } else if (this.appcode == "36010NBFOG") {
    //给集团和组织赋当前登陆的集团
    let { groupId, groupName } = this.businessInfo;
    if (groupId && groupName) {
      props.form.setFormItemsValue(this.formId, {
        pk_org: { value: groupId, display: groupName }
      });
    }
  } else {
    //给组织赋当前组织
    let { pk_org, org_Name, pk_org_v, org_v_Name } = this.state.context;
    if (pk_org && pk_org != "GLOBLE00000000000000") {
      props.form.setFormItemsValue(this.formId, {
        pk_org: { value: pk_org, display: org_Name },
        pk_org_v: { value: pk_org_v, display: org_v_Name }
      });
    }
  }
}
/**
 * 卡片页查询
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCardData(id, isFirst = false, isRefresh = false) {
  let cardData = getCacheById(id, this.cache);
  let cardTableData = getDefData(
    this.cardDataCache.key,
    this.cardDataCache.dataSource
  );
  let serData = getQueryData.call(this, id);
  if (cardData && !isRefresh) {
    //有缓存且不是刷新按钮
    this.props.form.setAllFormValue({
      [this.formId]: cardData.head[this.formId]
    });
    cardTableData &&
      this.props.cardTable.setTableData(this.tableId, { rows: cardTableData });
    buttonVisible.call(this, this.props);
    if (this.props.getUrlParam("status") !== "browse") {
      billHeadVisible.call(
        this,
        false,
        true,
        cardData.head[this.formId].rows[0].values.name.value
      );
    } else if (this.props.getUrlParam("status") === "browse") {
      billHeadVisible.call(
        this,
        true,
        true,
        cardData.head[this.formId].rows[0].values.name.value
      );
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
          if (this.props.getUrlParam("status") === "browse") {
            billHeadVisible.call(
              this,
              true,
              true,
              data.head[this.formId].rows[0].values.name.value
            );
            this.setState({ showPagination: true });
          } else if (this.props.getUrlParam("status") !== "browse") {
            billHeadVisible.call(
              this,
              false,
              true,
              data.head[this.formId].rows[0].values.name.value
            );
            this.setState({ showPagination: false });
          }
        }
        ajax({
          url: `${baseReqUrl}${javaUrl.accListQuery}.do`,
          data: serData,
          success: res => {
            let { success, data } = res;
            if (success) {
              this.props.cardTable.setTableData(this.tableId, {
                rows: data.grid.table.rows
              });
              buttonVisible.call(this, this.props);
              setDefData(
                this.cardDataCache.key,
                this.cardDataCache.dataSource,
                data.grid.table.rows
              );
            }
          }
        });
      }
    },
    error: res => {
      toast({ color: "danger", content: res.message && res.message.message });
      this.props.cardTable.setTableData(this.tableId, { rows: [] });
      buttonVisible.call(this, this.props);
    }
  });
}

export function getQueryData(id) {
  let searchdata = {
    // 子表查询传参
    querycondition: {
      logic: "and",
      conditions: [
        {
          field: "nonbankfininstitution",
          datetype: "",
          display: "",
          isIncludedSub: false,
          oprtype: "=",
          refurl: "",
          value: {
            firstvalue: id,
            secondvalue: ""
          }
        }
      ]
    },
    custcondition: {},
    pageInfo: {
      pageIndex: 0,
      pageSize: "10"
    },
    pageCode: this.appcode + "_bankacc_list",
    queryAreaCode: "search",
    oid: accList.searchOid,
    querytype: "tree"
  };
  if (this.appcode === "36010NBFOO") {
    searchdata.querycondition.conditions.push({
      field: "orgflag",
      oprtype: "=",
      display: "组织",
      value: {
        firstvalue: 0,
        secondvalue: null
      }
    });
  } else if (this.appcode === "36010NBFOG") {
    searchdata.querycondition.conditions.push({
      field: "orgflag",
      oprtype: "=",
      display: "集团",
      value: {
        firstvalue: 1,
        secondvalue: null
      }
    });
  } else {
    searchdata.querycondition.conditions.push({
      field: "orgflag",
      oprtype: "=",
      display: "全局",
      value: {
        firstvalue: 2,
        secondvalue: null
      }
    });
  }
  return searchdata;
}

/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/