import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "receiveRegisterGridRef",
    },
    refType: "grid",
    refName: "receiveRegisterGridRef-000000" /* 国际化处理： 收证登记 */,
    refCode: "lcm.refer.receive.registerGridRef",
    queryGridUrl: "/nccloud/lcm/refer/receiveRegisterGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "receiveRegisterGridRef-000001" /* 国际化处理： 信用证号 */,
          "receiveRegisterGridRef-000002" /* 国际化处理： 类型 */,
          "receiveRegisterGridRef-000003" /* 国际化处理： 币种 */,
          "receiveRegisterGridRef-000004" /* 国际化处理： 金额 */,
          "receiveRegisterGridRef-000005" /* 国际化处理： 期限 */,
          "receiveRegisterGridRef-000006" /* 国际化处理： 收证行 */,
          "receiveRegisterGridRef-000007" /* 国际化处理： 供应商 */,
          "receiveRegisterGridRef-000008" /* 国际化处理： 有效期 */,
        ],
        code: [
          "lcno",
          "lctype",
          "pk_lccurrtype",
          "lcamount",
          "lcterm",
          "pk_receivebank",
          "customer",
          "validdate",
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
