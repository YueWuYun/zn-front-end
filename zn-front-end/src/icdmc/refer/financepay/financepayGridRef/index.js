/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "icdmc",
            currentLocale: "zh-CN",
            moduleId: "financepayGridRef"
        },
        refType: "grid",
        refName: "financepayGridRef-000000" /* 国际化处理： 贷款放款*/,
        refCode: "icdmc.refer.financepay.financepayGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/financepayGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "financepayGridRef-000001" /* 国际化处理： 放款编号*/,
                    "financepayGridRef-000002" /* 国际化处理： 放款日期*/,
                    "financepayGridRef-000003" /* 国际化处理： 币种*/,
                    "financepayGridRef-000004" /* 国际化处理： 放款金额*/,
                    "financepayGridRef-000005" /* 国际化处理： 放款本币金额*/,
                    "financepayGridRef-000006" /* 国际化处理： 结束日期*/,
                    "financepayGridRef-000007" /* 国际化处理： 利率*/,
                    "financepayGridRef-000008" /* 国际化处理： 期初*/
                ],
                code: [
                    "vbillno",
                    "loandate",
                    "pk_currtype",
                    "loanmny",
                    "olcloanmny",
                    "contenddate",
                    "pk_rate",
                    "initflag"
                ]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/