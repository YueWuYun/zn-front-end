import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "docupayrepayplangridref",
    },
    refType: "grid",
    refName: "docuPayRepayplanGridRef-000000" /* 国际化处理： 还款计划 */,
    refCode: "lcm.refer.docubills.docupayrepayplangridref",
    queryGridUrl: "/nccloud/lcm/refer/docupayrepayplangridref.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "docuPayRepayplanGridRef-000001" /* 国际化处理： 还款编号*/,
          "docuPayRepayplanGridRef-000002" /* 国际化处理： 还款日期*/,
          "docuPayRepayplanGridRef-000003" /* 国际化处理： 币种*/,
          "docuPayRepayplanGridRef-000004" /* 国际化处理： 应还本金金额*/,
          "docuPayRepayplanGridRef-000005" /* 国际化处理： 未还本金金额*/,
        ],
        code: [
          "repaycode",
          "repaydate",
          "pk_currtype",
          "preamount",
          "unamount",
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
