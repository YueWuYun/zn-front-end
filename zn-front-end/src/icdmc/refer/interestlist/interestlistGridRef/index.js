/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "icdmc",
            currentLocale: "zh-CN",
            moduleId: "interestlistGridRef"
        },
        refType: "grid",
        refName: "interestlistGridRef-000000" /* 国际化处理： 内部利息清单*/,
        refCode: "icdmc.refer.interestlist.interestlistGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/interestlistGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "interestlistGridRef-000001" /* 国际化处理： 清单编号*/,
                    "interestlistGridRef-000002" /* 国际化处理： 币种*/,
                    "interestlistGridRef-000003" /* 国际化处理： 清单类型*/,
                    "interestlistGridRef-000004" /* 国际化处理： 结息日期*/,
                    "interestlistGridRef-000005" /* 国际化处理： 利息合计*/,
                ],
                code: [
                    "vbillno",
                    "pk_currtype",
                    "iabilltype",
                    "settledate",
                    "totalintstmny",
                ]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/