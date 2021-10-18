/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "cdmc",
            currentLocale: "zh-CN",
            moduleId: "rateGridRef"
        },
        refType: "grid",
        refName: "rateGridRef-000000" /* 国际化处理： 利率*/,
        refCode: "tmpub.refer.ratecode.RateGridRef",
        queryGridUrl: "/nccloud/tmpub/refer/RateGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: ["rateGridRef-000001", "rateGridRef-000002"],
                code: ["refcode", "refname"]
            }
        ] /* 国际化处理： 编码,名称*/
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/