/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "icdmc",
            currentLocale: "zh-CN",
            moduleId: "innerprotocolGridRef"
        },
        refType: "grid",
        refName:
            "innerprotocolGridRef-000000" /* 国际化处理：内部授信协议*/,
        refCode: "icdmc.refer.innerprotocol.innerprotocolGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/innerprotocolGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "innerprotocolGridRef-000001",//协议编码
                    "innerprotocolGridRef-000002",//控制方式
                    // "innerprotocolGridRef-000003",//授信资金组织
                    "innerprotocolGridRef-000004",//原币额度
                    "innerprotocolGridRef-000005",//可用额度
                    "innerprotocolGridRef-000006",//起始日期
                    "innerprotocolGridRef-000007",//结束日期
                    "innerprotocolGridRef-000008"//币种
                ],
                code: [
                    "protocolcode",
                    "ctrlmethod",
                    // "pk_creditorg",
                    "cdtlnamt",
                    "availcdtlnamt",
                    "begindate",
                    "enddate",
                    "pk_currtype"
                    ]
            }
        ] 
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/