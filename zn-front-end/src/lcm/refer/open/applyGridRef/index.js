import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "openApplyGridRef",
    },
    refType: "grid",
    refName: "openApplyGridRef-000000" /* 国际化处理： 开证申请 */,
    refCode: "lcm.refer.open.applyGridRef",
    queryGridUrl: "/nccloud/lcm/refer/openApplyGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "openApplyGridRef-000001" /* 国际化处理： 申请编号,申请编号*/,
          "openApplyGridRef-000002" /* 国际化处理： 申请人,申请人*/,
          "openApplyGridRef-000003" /* 国际化处理： 信用证编码,信用证编码*/,
          "openApplyGridRef-000004" /* 国际化处理： 合同号,合同号*/,
          "openApplyGridRef-000005" /* 国际化处理： 开证行,开证行*/,
          "openApplyGridRef-000006" /* 国际化处理： 通知行,通知行*/,
          "openApplyGridRef-000007" /* 国际化处理： 信用证金额,信用证金额*/,
        ],
        code: [
          "pk_apply",
          "pk_apply_org",
          "lcmno",
          "contractno",
          "pk_bank_issuing",
          "pk_bank_advising",
          "olclcamount",
        ],
      },
    ],
  };
  return <Refer {...Object.assign(conf, props)} />;
}
