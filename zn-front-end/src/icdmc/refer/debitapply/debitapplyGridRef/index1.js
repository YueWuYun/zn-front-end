/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        refType: "grid",
        refName: "内部借款申请",
        refCode: "icdmc.refer.debitapply.debitapplyGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/debitapplyGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "申请编号",
                    "融资品种",
                    "贷款机构",
                    "币种",
                    "申请金额",
                    "申请本币金额",
                    "申请日期"
                ],
                code: [
                    "refcode",
                    "fin_variety",
                    "fininstitutionid",
                    "pk_currtype",
                    "financamount",
                    "olcfinancamount",
                    "begindate"
                ]
            }
        ]
    };
    return <Refer {...Object.assign(conf, props)} />;
}

/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/