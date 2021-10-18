/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
/***
 *
 * @Description: 贴现试算编辑后事件
 * @author: zhoulyu
 * @date: 2019年11月27日 下午5:05:41
 * @version ncc2004
 */
import { toast } from "nc-lightapp-front";
import { list, afterUrl } from "../../cons/constant";
import { searchButtonClick, queryAjax } from "./search";
/**
 * 表体编辑后事件
 * @param {*} props         页面内置对象
 * @param {*} moduleId      表体区域
 * @param {*} key           表头字段
 * @param {*} value         新值
 * @param {*} changedrows   旧值
 * @param {*} index         行序号
 * @param {*} record        行数据
 */
export function afterEvent(
  props,
  moduleId,
  key,
  value,
  changedrows,
  index,
  record
) {
  let { setValByKeyAndIndex, getValByKeyAndIndex } = this.props.editTable;
  let formData = props.createHeadAfterEventData(
    list.headCode,
    moduleId,
    [],
    moduleId,
    key,
    value
  );

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
  switch (key) {
    // 贴现日期
    case "discount_date":
    // 利率天数
    case "interest_days":
    // 是否自动计算
    case "auto_calculate":
      if (
        formData.newvalue.value == formData.oldvalue.value ||
        !auto_calculate
      ) {
        return;
      }
      searchButtonClick.call(this, props, false, true);
      break;
    //贴现年利率%
    case "interest_date_year":
      if (formData.newvalue.value == formData.oldvalue.value) {
        return;
      }
      if (auto_calculate) {
        searchButtonClick.call(this, props, false, true);
      } else {
        queryAjax.call(this, afterUrl, null, false).then(data => {
          if ("" != data.digit) {
            this.props.form.setFormItemsValue("head", {
              interest_date_year: {
                value: interest_date_year,
                display: interest_date_year,
                scale: data.digit
              }
            });
          }
        });
      }

      break;
    // 延迟天数
    case "delay_days":
      if (delay_days < 0) {
        return toast({
          color: "warning",
          content:
            this.props.MutiInit.getIntl("36180DTC") &&
            this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000004")
        }); /* 国际化处理： 天数应该大于0！*/
      }
      if (
        formData.newvalue.value == formData.oldvalue.value ||
        !auto_calculate
      ) {
        return;
      }
      if (interest_date_year && discount_date && interest_days) {
        searchButtonClick.call(this, props, false, true);
      }
      break;
    default:
      break;
  }
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/