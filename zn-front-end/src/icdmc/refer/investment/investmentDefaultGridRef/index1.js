/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: "投融资品种",
        refCode: "tmpub.refer.investment.InvestmentDefaultGridRef",
        queryGridUrl: "/nccloud/tmpub/refer/ifvGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: ["编码", "分类", "品种大类", "品种名称"],
                code: ["refcode", "type", "variety_category", "variety_name"]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/