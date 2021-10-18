import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "docuApplyGridRef",
    },
    refType: "grid",
    refName: "docuApplyGridRef-000000" /* 国际化处理： 押汇申请 */,
    refCode: "lcm.refer.docubills.docuApplyGridRef",
    queryGridUrl: "/nccloud/lcm/refer/docuApplyGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      //DocuApplyVO.enddate  begindate
      {
        name: [
          "docuApplyGridRef-000001" /* 国际化处理： 押汇申请*/,
          "docuApplyGridRef-000002" /* 国际化处理： 申请押汇金额*/,
          "docuApplyGridRef-000003" /* 国际化处理： 押汇银行*/,
          "docuApplyGridRef-000004" /* 国际化处理： 币种*/,
          "docuApplyGridRef-000005" /* 国际化处理： 融资品种*/,
          "docuApplyGridRef-000006" /* 国际化处理： 开始时间*/,
          "docuApplyGridRef-000007" /* 国际化处理： 结束时间*/,
        ],
        code: [
          "pk_apply",
          "contractamount",
          "pk_creditbank",
          "pk_currtype",
          "tradefinsort",
          "begindate",
          "enddate"
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
