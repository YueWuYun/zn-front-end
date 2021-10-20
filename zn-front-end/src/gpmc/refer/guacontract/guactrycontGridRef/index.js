/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";

const { Refer } = high;

export default function(prop = {}) {
    var conf = {
        multiLang: {
            domainName: "gpmc",
            currentLocale: "zh-CN",
            moduleId: "guactrycontGridRef"
        },
        refType: "grid",
        refName: "guactrycontGridRef-000000" /* 国际化处理： 担保合同*/,
        isCacheable: false,
        refcode: "gpmc.refer.guacontract.guactrycontGridRef",
        queryGridUrl: "/nccloud/gpmc/refer/guactrycontGridRef.do",
        columnConfig: [
            {
                name: [
                    "guactrycontGridRef-000001",
                    "guactrycontGridRef-000002",
                    "guactrycontGridRef-000003"
                ] /* 国际化处理： 合同号,单据编号,可用金额*/,
                code: ["contractno", "vbillno", "avaamount"]
            }
        ]
    };

    return <Refer {...Object.assign(conf, prop)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/