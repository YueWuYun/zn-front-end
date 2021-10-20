/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";

const { Refer } = high;

export default function(prop = {}) {
    var conf = {
        multiLang: {
            domainName: "gpmc",
            currentLocale: "zh-CN",
            moduleId: "guapropGridRef"
        },
        refType: "grid",
        refName: "guapropGridRef-000000" /* 国际化处理： 担保物权*/,
        refcode: "gpmc.refer.guaproperty.guapropGridRef",
        queryGridUrl: "/nccloud/gpmc/refer/guapropGridRef.do",
        isCacheable: false,
        columnConfig: [
            {
                name: [
                    "guapropGridRef-000001",
                    "guapropGridRef-000002",
                    "guapropGridRef-000003",
                    "guapropGridRef-000004",
                    "guapropGridRef-000005"
                ] /* 国际化处理： 单据编号,物权名称,物权分类,可抵质押价值,剩余可抵质押价值*/,
                code: [
                    "vbillno",
                    "propertyname",
                    "guagptype",
                    "maxpledge",
                    "restpledge"
                ]
            }
        ]
    };

    return <Refer {...Object.assign(conf, prop)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/