/*w/8iNiAH+zj8WJF4+Br6+mgDEjHDz7v5E8SGAvbf7IEZiLlSv1Wt87dKtx2uh5bj*/
import { ajax, cardCache, toast } from "nc-lightapp-front";
import { list, listQueryUrl } from "../../cons/constant";
import { buttonVisible } from "./buttonVisible";
let { setDefData, getDefData } = cardCache;
/**
 * 查询计算贴现试算
 * @param {*} props          页面内置对象
 * @param {*} showToast      是否显示查询提示语
 * @param {*} afterEvent     是否是编辑后事件
 * @param {*} refresh        刷新按钮
 */
export function searchButtonClick(props, showToast, afterEvent, refresh) {
  let interest_date_year = props.form.getFormItemsValue(
    list.headCode,
    "interest_date_year"
  ).value;
  let discount_date = props.form.getFormItemsValue(
    list.headCode,
    "discount_date"
  ).value;
  let interest_days = props.form.getFormItemsValue(
    list.headCode,
    "interest_days"
  ).value;
  let auto_calculate = props.form.getFormItemsValue(
    list.headCode,
    "auto_calculate"
  ).value;
  let delay_days = props.form.getFormItemsValue(list.headCode, "delay_days")
    .value;
  let isCalculate = true;
  if (!interest_date_year || !discount_date || !interest_days) {
    isCalculate = false;
  }

  if (showToast == "undefined") {
    showToast = true;
  }

  if (!afterEvent && !refresh) {
    if (!discount_date) {
      return toast({
        color: "warning",
        content:
          this.props.MutiInit.getIntl("36180DTC") &&
          this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000001")
      }); /* 国际化处理： 请输入贴现日期！*/
    }
    if (!interest_date_year) {
      return toast({
        color: "warning",
        content:
          this.props.MutiInit.getIntl("36180DTC") &&
          this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000002")
      }); /* 国际化处理： 请输入贴现年利率！*/
    }
    if (!interest_days) {
      return toast({
        color: "warning",
        content:
          this.props.MutiInit.getIntl("36180DTC") &&
          this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000003")
      }); /* 国际化处理： 请输入利率天数！*/
    }
  }

  let indexArray = [];
  props.editTable.getCheckedRows(this.tableId).forEach(item => {
    indexArray.push(item.index);
  });
  let querycondition = props.search.getAllSearchData(this.searchId);
  if (querycondition && querycondition.conditions) {
    querycondition.conditions.forEach(item => {
      if (item.field.indexOf("def") > -1 && item.value.firstvalue) {
        item.value.firstvalue = item.value.firstvalue + "";
      }
    });
  } else {
    let searchCache = getDefData(this.searchCache.key, this.searchCache.dataSource);
    let queryInfo = this.props.search.getQueryInfo(
      this.searchId,
      false
    );
    if (searchCache && JSON.stringify(queryInfo) != "{}") {
      querycondition = searchCache.querycondition;
    }
  }
  let searchdata = {
    isCalculate,
    querycondition,
    pagecode: this.pageId,
    queryAreaCode: this.searchId,
    oid: this.searchOid,
    querytype: "tree",
    discount_date: discount_date,
    interest_date_year: interest_date_year,
    interest_days: interest_days,
    delay_days: delay_days,
    auto_calculate: auto_calculate
  };
  queryAjax.call(this, listQueryUrl, searchdata, showToast).then(data => {
    // 设置查询区缓存
    setDefData(this.searchCache.key, this.searchCache.dataSource, searchdata);
    props.editTable.setStatus(this.tableId, "browse");
    if ("" != data.digit) {
      this.props.form.setFormItemsValue("head", {
        interest_date_year: {
          value: interest_date_year,
          display: interest_date_year,
          scale: data.digit
        }
      });
    }
    let rows = data.grid[this.tableId];
    this.props.editTable.setTableData(this.tableId, rows);
    // 最后调用按钮显隐性控制
    buttonVisible.call(this, props);
    if (null != data.validMessage) {
      toast({
        color: "warning",
        content: data.validMessage
      });
    }
  });
}

/**
 * 查询ajax
 * @param {*} url      请求url
 * @param {*} sendData 传输数据
 */
export function queryAjax(url, sendData, showToast) {
  return new Promise(resolve => {
    ajax({
      url: url,
      data: sendData,
      success: res => {
        let interest_date_year = this.props.form.getFormItemsValue(
          list.headCode,
          "interest_date_year"
        ).value;

        if ("" != res.data.digit) {
          this.props.form.setFormItemsValue("head", {
            interest_date_year: {
              value: interest_date_year,
              display: interest_date_year,
              scale: res.data.digit
            }
          });
        }
        let { success, data } = res;
        if (success && data && data.grid) {
          resolve(res.data);
          if (showToast) {
            toast({
              color: "success",
              content: `${this.props.MutiInit.getIntl("36180DTC") &&
                this.props.MutiInit.getIntl("36180DTC").get(
                  "36180DTC-000017"
                )}，${this.props.MutiInit.getIntl("36180DTC") &&
                this.props.MutiInit.getIntl("36180DTC").get(
                  "36180DTC-000018"
                )}${
                data.grid[this.tableId].pageInfo.total
                }${this.props.MutiInit.getIntl("36180DTC") &&
                this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000019")}`
            }); /* 国际化处理： 查询成功,共,条*/
          }
        }
      }
    });
  });
}

/*w/8iNiAH+zj8WJF4+Br6+mgDEjHDz7v5E8SGAvbf7IEZiLlSv1Wt87dKtx2uh5bj*/