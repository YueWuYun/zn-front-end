import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "paymentRegisterGridRef",
    },
    refType: "grid",
    refName: "paymentRegisterGridRef-000000" /* 国际化处理： 付款登记 */,
    refCode: "lcm.refer.open.paymentRegGridRef",
    queryGridUrl: "/nccloud/lcm/refer/paymentRegGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "paymentRegisterGridRef-000001" /* 国际化处理： 信用证号 */,
          "paymentRegisterGridRef-000002" /* 国际化处理： 类型 */,
          "paymentRegisterGridRef-000003" /* 国际化处理： 币种 */,
          "paymentRegisterGridRef-000004" /* 国际化处理： 金额 */,
          "paymentRegisterGridRef-000005" /* 国际化处理： 期限 */,
          "paymentRegisterGridRef-000006" /* 国际化处理： 开证行 */,
          "paymentRegisterGridRef-000007" /* 国际化处理： 供应商 */,
          "paymentRegisterGridRef-000008" /* 国际化处理： 有效期 */,
        ],
        code: [
          "lcno",
          "type",
          "pk_lccurrtype",
          "lcamount",
          "term",
          "pk_bank_issuing",
          "pk_supplier",
          "validdate",
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
