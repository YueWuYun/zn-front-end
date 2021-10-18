import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "openModifyGridRef",
    },
    refType: "grid",
    refName: "openModifyGridRef-000000" /* 国际化处理： 开证修改 */,
    refCode: "lcm.refer.open.modifyGridRef",
    queryGridUrl: "/nccloud/lcm/refer/openModifyGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "openModifyGridRef-000001" /* 国际化处理： 信用证号 */,
          "openModifyGridRef-000002" /* 国际化处理： 类型 */,
          "openModifyGridRef-000003" /* 国际化处理： 币种 */,
          "openModifyGridRef-000004" /* 国际化处理： 金额 */,
          "openModifyGridRef-000005" /* 国际化处理： 期限 */,
          "openModifyGridRef-000006" /* 国际化处理： 开证行 */,
          "openModifyGridRef-000007" /* 国际化处理： 供应商 */,
          "openModifyGridRef-000008" /* 国际化处理： 有效期 */,
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
