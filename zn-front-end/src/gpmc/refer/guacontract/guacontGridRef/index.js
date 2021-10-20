/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";

const { Refer } = high;

export default function(prop = {}) {
    var conf = {
        multiLang: {
            domainName: "gpmc",
            currentLocale: "zh-CN",
            moduleId: "guacontGridRef"
        },
        refType: "grid",
        refName: "guacontGridRef-000000" /* 国际化处理： 担保合同*/,
        isCacheable: false,
        refcode: "gpmc.refer.guacontract.guacontGridRef",
        queryGridUrl: "/nccloud/gpmc/refer/guacontGridRef.do",
        columnConfig: [
            {
                name: [
                    "guacontGridRef-000001",
                    "guacontGridRef-000002",
					"guacontGridRef-000003",
					"guacontGridRef-000004",
					"guacontGridRef-000005",
					"guacontGridRef-000006",
					"guacontGridRef-000007",
					"guacontGridRef-000008",
					"guacontGridRef-000009",
					"guacontGridRef-000010",
					"guacontGridRef-000011",
					"guacontGridRef-000012",
					"guacontGridRef-000013"
                ] /* 国际化处理： 合同号,单据编号,可用金额*/,
				/*担保合约编号、单据编号、保证责任、担保方式、币种、
				担保总金额、担保本币总金额、已用担保总金额、已用担保本币总金额、可用担保总金额、可用担保本币总金额、
				担保开始日期、担保结束日期*/
                code: ["contractno", "vbillno","warliability", "guatype","currname", 
				"guaamount","gualcamount", "usedamount","orgusedamount", "avaamount","orgavaamount", 
				"guastartdate","guaenddate"
				]
            }
        ]
    };

    return <Refer {...Object.assign(conf, prop)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/