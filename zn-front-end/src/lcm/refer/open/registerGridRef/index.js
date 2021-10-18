import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "openRegisterGridRef",
    },
    refType: "grid",
    refName: "openRegisterGridRef-000000" /* 国际化处理： 开证登记 */,
    refCode: "lcm.refer.open.registerGridRef",
    queryGridUrl: "/nccloud/lcm/refer/openRegisterGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "openRegisterGridRef-000001" /* 国际化处理： 信用证号 */,
          "openRegisterGridRef-000002" /* 国际化处理： 类型 */,
          "openRegisterGridRef-000003" /* 国际化处理： 币种 */,
          "openRegisterGridRef-000004" /* 国际化处理： 金额 */,
          "openRegisterGridRef-000005" /* 国际化处理： 期限 */,
          "openRegisterGridRef-000006" /* 国际化处理： 开证行 */,
          "openRegisterGridRef-000007" /* 国际化处理： 供应商 */,
          "openRegisterGridRef-000008" /* 国际化处理： 有效期 */,
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
