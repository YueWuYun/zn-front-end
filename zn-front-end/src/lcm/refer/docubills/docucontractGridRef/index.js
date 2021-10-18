import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "docuContractGridRef",
    },
    refType: "grid",
    refName: "docuContractGridRef-000000" /* 国际化处理： 押汇申请 */,
    refCode: "lcm.refer.docubills.docuContractGridRef",
    queryGridUrl: "/nccloud/lcm/refer/docuContractGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "docuContractGridRef-000001" /* 国际化处理： 合同编号*/,
          "docuContractGridRef-000002" /* 国际化处理： 押汇人*/,
          "docuContractGridRef-000003" /* 国际化处理： 押汇银行*/,
          "docuContractGridRef-000004" /* 国际化处理： 币种*/,
          "docuContractGridRef-000005" /* 国际化处理： 押汇金额*/,
          "docuContractGridRef-000006" /* 国际化处理： 已放本金*/,
          "docuContractGridRef-000007" /* 国际化处理： 已还本金*/,
          "docuContractGridRef-000008" /* 国际化处理： 起始日期*/,
        ],
        code: [
          "contractcode",
          "pk_debitorg",
          "pk_creditbank",
          "pk_currtype",
          "contractamount",
          "payamount",
          "repayamount",
          "begindate",
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
