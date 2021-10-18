import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "docupaygridref",
    },
    refType: "grid",
    refName: "docuPayGridRef-000000" /* 国际化处理： 押汇放款 */,
    refCode: "lcm.refer.docubills.docupaygridref",
    queryGridUrl: "/nccloud/lcm/refer/docupaygridref.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "docuPayGridRef-000001" /* 国际化处理： 放款单号*/,
          "docuPayGridRef-000002" /* 国际化处理： 合同号*/,
          "docuPayGridRef-000003" /* 国际化处理： 币种*/,
          "docuPayGridRef-000004" /* 国际化处理： 所属组织*/,
          "docuPayGridRef-000005" /* 国际化处理： 放款金额*/,
          "docuPayGridRef-000006" /* 国际化处理： 放款日期*/,
        ],
        code: [
          "vbillno",
          "pk_contract",
          "pk_currtype",
          "pk_org",
          "payamount",
          "paydate",
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
