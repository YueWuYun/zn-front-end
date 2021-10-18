/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "cdmc",
            currentLocale: "zh-CN",
            moduleId: "settleDateGridRef"
        },
        refType: "grid",
        refName: "settleDateGridRef-000000" /* 国际化处理： 结息日*/,
        refCode: "tmpub.refer.tmbd.SettleDateGridRef",
        queryGridUrl: "/nccloud/tmpub/refer/settledategridref.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: ["settleDateGridRef-000001", "settleDateGridRef-000002"],
                code: ["refcode", "refname"]
            }
        ] /* 国际化处理： 编码,名称*/
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/