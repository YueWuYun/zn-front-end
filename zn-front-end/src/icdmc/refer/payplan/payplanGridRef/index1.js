/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: "放款计划",
        refCode: "cdmc.refer.payplan.payplanGridRef",
        queryGridUrl: "/nccloud/cdmc/refer/payplanGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "放款编号",
                    "放款日期",
                    "放款金额",
                    "放款本币金额",
                    "可放款金额",
                    "可放款本币金额"
                ],
                code: [
                    "payplancode",
                    "creditdate",
                    "paymny",
                    "olcpaycdtlnamt",
                    "canpaymny",
                    "canpaymny"
                ]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/