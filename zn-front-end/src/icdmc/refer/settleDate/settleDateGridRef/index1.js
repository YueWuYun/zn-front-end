/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: "结息日",
        refCode: "tmpub.refer.tmbd.SettleDateGridRef",
        queryGridUrl: "/nccloud/tmpub/refer/settledategridref.do",
        isMultiSelectedEnabled: false,
        columnConfig: [{ name: ["编码", "名称"], code: ["refcode", "refname"] }]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/