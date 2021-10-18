/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "icdmc",
            currentLocale: "zh-CN",
            moduleId: "contractGridRef"
        },
        refType: "grid",
        refName: "contractGridRef-000000" /* 国际化处理： 贷款合同*/,
        refCode: "icdmc.refer.contract.contractGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/contractGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "contractGridRef-000001" /* 国际化处理： 合同编号*/,
                    // "contractGridRef-000002" /* 国际化处理： 融资品种*/,
                    // "contractGridRef-000003" /* 国际化处理： 金融机构*/,                    
                    "contractGridRef-000005" /* 国际化处理： 合同金额*/,
                    "contractGridRef-000006" /* 国际化处理： 合同本币金额*/,
                    "contractGridRef-000007" /* 国际化处理： 开始日期*/,
                    "contractGridRef-000008" /* 国际化处理： 结束日期*/,
                    "contractGridRef-000009" /* 国际化处理： 期初*/,
                    "contractGridRef-000004" /* 国际化处理： 币种*/,
                ],
                code: [
                    "contractno",
                    // "transacttype",
                    // "financorganization",                    
                    "loanmny",
                    "olcloanmny",
                    "begindate",
                    "enddate",
                    "initflag",
                    "pk_currtype"
                ]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/