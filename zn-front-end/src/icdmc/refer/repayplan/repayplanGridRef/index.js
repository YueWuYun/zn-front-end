/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "icdmc",
            currentLocale: "zh-CN",
            moduleId: "repayplanGridRef"
        },
        refType: "grid",
        refName: "repayplanGridRef-000000" /* 国际化处理： 还款计划*/,
        refCode: "icdmc.refer.repayplan.repayplanGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/repayplanGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "repayplanGridRef-000001",
                    "repayplanGridRef-000002",
                    "repayplanGridRef-000003"
                ] /* 国际化处理： 编码,还本日期,应还本金*/,
                code: ["planrepaycode", "planrepaydate", "premny"]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/