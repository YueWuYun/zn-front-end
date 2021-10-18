/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "cdmc",
            currentLocale: "zh-CN",
            moduleId: "cccProtocolGridRef"
        },
        refType: "grid",
        refName:
            "cccProtocolGridRef-000000" /* 国际化处理： 授信协议,授信协议*/,
        refCode: "ccc.refer.ccc.CCCProtocolGridRef",
        queryGridUrl: "/nccloud/ccc/bankprotocol/CCCProtocolGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "cccProtocolGridRef-000001",
                    "cccProtocolGridRef-000002"
                ],
                code: ["refcode", "refname"]
            }
        ] /* 国际化处理： 编码,名称,编码,名称*/
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/