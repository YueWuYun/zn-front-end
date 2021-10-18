/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: "还款计划",
        refCode: "icdmc.refer.repayplan.repayplanGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/repayplanGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: ["编码", "还本日期", "应还本金"],
                code: ["planrepaycode", "planrepaydate", "premny"]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/