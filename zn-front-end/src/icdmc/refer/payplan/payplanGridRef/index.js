/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "icdmc",
            currentLocale: "zh-CN",
            moduleId: "payplanGridRef"
        },
        refType: "grid",
        refName: "payplanGridRef-000000" /* 国际化处理： 放款计划*/,
        refCode: "icdmc.refer.payplan.payplanGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/payplanGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "payplanGridRef-000001" /* 国际化处理： 放款编号*/,
                    "payplanGridRef-000002" /* 国际化处理： 放款日期*/,
                    "payplanGridRef-000003" /* 国际化处理： 放款金额*/,
                    "payplanGridRef-000004" /* 国际化处理： 放款本币金额*/
                    // ,
                    // "payplanGridRef-000005" /* 国际化处理： 可放款金额*/,
                    // "payplanGridRef-000006" /* 国际化处理： 可放款本币金额*/
                ],
                code: [
                    "payplancode",
                    "creditdate",
                    "loanmoney",
                    "olcloanmoney"
                    // ,
                    // "canpaymny",
                    // "canpaymny"
                ]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/