import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function (props = {}) {
  var conf = {
    multiLang: {
      domainName: "lcm",
      currentLocale: "zh-CN",
      moduleId: "receiveModifyGridRef",
    },
    refType: "grid",
    refName: "receiveModifyGridRef-000000" /* 国际化处理： 收证修改 */,
    refCode: "lcm.refer.receive.modifyGridRef",
    queryGridUrl: "/nccloud/lcm/refer/receiveModifyGridRef.do",
    isMultiSelectedEnabled: false,
    columnConfig: [
      {
        name: [
          "receiveModifyGridRef-000001" /* 国际化处理： 信用证号 */,
          "receiveModifyGridRef-000002" /* 国际化处理： 类型 */,
          "receiveModifyGridRef-000003" /* 国际化处理： 币种 */,
          "receiveModifyGridRef-000004" /* 国际化处理： 金额 */,
          "receiveModifyGridRef-000005" /* 国际化处理： 期限 */,
          "receiveModifyGridRef-000006" /* 国际化处理： 开证行 */,
          "receiveModifyGridRef-000007" /* 国际化处理： 供应商 */,
          "receiveModifyGridRef-000008" /* 国际化处理： 有效期 */,
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
