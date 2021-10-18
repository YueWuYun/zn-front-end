import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "openArrivalGridRef",
    },
    refType: "grid",
    refName: "openArrivalGridRef-000000" /* 国际化处理： 到单承付单 */,
    refCode: "lcm.refer.open.arrivalGridRef",
    queryGridUrl: "/nccloud/lcm/refer/openArrivalGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "openArrivalGridRef-000001" /* 国际化处理： 单据号 */,
          "openArrivalGridRef-000002" /* 国际化处理： 财务组织 */,
          "openArrivalGridRef-000003" /* 国际化处理： 信用证号 */,
          "openArrivalGridRef-000004" /* 国际化处理： 信用证币种 */,
          "openArrivalGridRef-000005" /* 国际化处理： 信用证金额 */,
          "openArrivalGridRef-000006" /* 国际化处理： 信用证余额 */,
          "openArrivalGridRef-000007" /* 国际化处理： 承付日期 */,
        ],
        code: [
          "vbillno",
          "pk_org",
          "pk_register",
          "pk_currtype",
          "lcamount",
          "lcbalance",
          "commitdate",
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
