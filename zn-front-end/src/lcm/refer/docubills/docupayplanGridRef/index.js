import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "docuPayplanGridRef",
    },
    refType: "grid",
    refName: "docuPayplanGridRef-000000" /* 国际化处理： 押汇申请 */,
    refCode: "lcm.refer.docubills.docuPayplanGridRef",
    queryGridUrl: "/nccloud/lcm/refer/docuPayPlanGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "docuPayplanGridRef-000001" /* 国际化处理： 放款编号*/,
          "docuPayplanGridRef-000002" /* 国际化处理： 放款日期*/,
          "docuPayplanGridRef-000003" /* 国际化处理： 币种*/,
          "docuPayplanGridRef-000004" /* 国际化处理： 放款金额*/,
        ],
        code: [
          "lcm_payplan.paycode",
          "lcm_payplan.paydate",
          "lcm_docucontract.pk_currtype",
          "lcm_payplan.payamount",
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
