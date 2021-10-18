/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "cdmc",
            currentLocale: "zh-CN",
            moduleId: "investmentDefaultGridRef"
        },
        refType: "grid",
        refName: "investmentDefaultGridRef-000000",
        /* 国际化处理： 投融资品种*/ refCode:
            "tmpub.refer.investment.InvestmentDefaultGridRef",
        queryGridUrl: "/nccloud/tmpub/refer/ifvGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "investmentDefaultGridRef-000001",
                    "investmentDefaultGridRef-000002",
                    "investmentDefaultGridRef-000003",
                    "investmentDefaultGridRef-000004"
                ] /* 国际化处理： 编码,分类,品种大类,品种名称*/,
                code: ["refcode", "type", "variety_category", "variety_name"]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/