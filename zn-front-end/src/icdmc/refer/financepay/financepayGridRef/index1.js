/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: "贷款放款",
        refCode: "icdmc.refer.financepay.financepayGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/financepayGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "放款编号",
                    "放款日期",
                    "币种",
                    "放款金额",
                    "放款本币金额",
                    "结束日期",
                    "利率",
                    "期初"
                ],
                code: [
                    "vbillno",
                    "loandate",
                    "pk_currtype",
                    "loanmny",
                    "olcloanmny",
                    "contenddate",
                    "pk_rate",
                    "initflag"
                ]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/