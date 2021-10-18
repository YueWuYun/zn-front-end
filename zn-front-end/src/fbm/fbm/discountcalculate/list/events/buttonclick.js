/*dHXciX52Ha4O8WoaOM9NuZWWgQiErI856J0d6+wB/IN9e6sD0L4/dxPnw7DFA7YB*/
/***
 *
 * @Description: 贴现试算列表按钮点击事件
 * @author: zhoulyu
 * @date: 2019年11月27日 下午5:05:41
 * @version ncc2004
 */
import { cardCache, output, print, toast } from "nc-lightapp-front";
import { list, nodekey, printUrl } from "../../cons/constant";
import { searchButtonClick } from "./search";
let { setDefData, getDefData } = cardCache;

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export function buttonClick(props, id) {
  let { setStatus } = props.editTable;
  switch (id) {
    //贴现试算
    case "DiscountCalculate":
      let delay_days = props.form.getFormItemsValue(list.headCode, "delay_days")
    .value;
      if (delay_days < 0) {
        return toast({
          color: "warning",
          content:
            this.props.MutiInit.getIntl("36180DTC") &&
            this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000004")
        }); /* 国际化处理： 天数应该大于0！*/
      }
      searchButtonClick.call(this, props, false);
      break;
    //刷新
    case "Refresh":
      let searchCache = getDefData(
        this.searchCache.key,
        this.searchCache.dataSource
      );
      if (searchCache) {
        this.setState({ showToast: false });
        searchButtonClick.call(this, props, false, false, true);
      }
      toast({
        color: "success",
        /* 国际化处理： 刷新成功*/
        content:
          this.props.MutiInit.getIntl("36180DTC") &&
          this.props.MutiInit.getIntl("36180DTC").get("36180DTC-000020")
      });
      break;
    // 打印
    case "Print":
      doPrintOrOutput.call(this, props, "Print");
      break;
    // 输出
    case "Output":
      doPrintOrOutput.call(this, props, "Output");
      break;
    default:
      break;
  }
}

/**
 * 打印输出操作
 * @param {*} props
 */
function doPrintOrOutput(props, type) {
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
  let pkArray = [];
  let printData = props.editTable.getAllRows(this.tableId);
  printData.forEach(item => {
    pkArray.push(item.values.pk_register.value + "");
  });

  if ("Print" == type) {
    print(
      //支持两类: 'html'为模板打印, 'pdf'为pdf打印
      "pdf",
      printUrl,
      {
        isCalculate,
        pkArray: pkArray,
        discount_date: [discount_date],
        interest_date_year: [interest_date_year],
        interest_days: [interest_days],
        delay_days: [delay_days],
        auto_calculate: [auto_calculate],
        funcode: props.getSearchParam("c") || props.getUrlParam("c"), //小应用编码
        nodekey: nodekey
      }
    );
  } else {
    output({
      url: printUrl,
      data: {
        isCalculate,
        pkArray: pkArray,
        discount_date: discount_date,
        interest_date_year: interest_date_year,
        interest_days: interest_days,
        delay_days: delay_days,
        auto_calculate: auto_calculate,
        outputType: "output"
      }
    });
  }
}

/*dHXciX52Ha4O8WoaOM9NuZWWgQiErI856J0d6+wB/IN9e6sD0L4/dxPnw7DFA7YB*/