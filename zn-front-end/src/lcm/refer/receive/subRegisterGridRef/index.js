import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "subRegisterGridRef",
    },
    refType: "grid",
    refName: "subRegisterGridRef-000000" /* 国际化处理： 交单登记 */,
    refCode: "lcm.refer.receive.subRegisterGridRef",
    queryGridUrl: "/nccloud/lcm/refer/subRegisterGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "subRegisterGridRef-000001" /* 国际化处理： 单据编号 */,
          "subRegisterGridRef-000002" /* 国际化处理： 信用证号 */,
          "subRegisterGridRef-000003" /* 国际化处理： 收单银行 */,
          "subRegisterGridRef-000004" /* 国际化处理： 交单日期 */,
          "subRegisterGridRef-000005" /* 国际化处理： 交单金额 */,
          "subRegisterGridRef-000006" /* 国际化处理： 客户 */,
          "subRegisterGridRef-000007" /* 国际化处理： 开证银行 */,
          "subRegisterGridRef-000009" /* 国际化处理： 最迟交单日 */,
          "subRegisterGridRef-000008" /* 国际化处理： 币种 */,
        ],
        code: [
          "vbillno",
          "lcno",
          "pk_receivebank",
          "submissiondate",
          "submissionamount",
          "pk_customer",
          "pk_issuingbank",
          "latestdeliverdate",
          "pk_currtype",
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
