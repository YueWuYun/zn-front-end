/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: "贷款合同",
        refCode: "cdmc.refer.contract.contractGridRef",
        queryGridUrl: "/nccloud/cdmc/refer/contractGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "合同编号",
                    "融资品种",
                    "金融机构",
                    "币种",
                    "合同金额",
                    "合同本币金额",
                    "开始日期",
                    "结束日期",
                    "期初"
                ],
                code: [
                    "vbillno",
                    "transacttype",
                    "financorganization",
                    "pk_currtype",
                    "loanmny",
                    "olcloanmny",
                    "begindate",
                    "enddate",
                    "initflag"
                ]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/