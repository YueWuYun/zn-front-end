/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from "nc-lightapp-front";
const { Refer } = high;

export default function(props = {}) {
    var conf = {
        multiLang: {
            domainName: "icdmc",
            currentLocale: "zh-CN",
            moduleId: "debitapplyGridRef"
        },
        refType: "grid",
        refName: "applyGridRef-000000" /* 国际化处理： 贷款申请,贷款申请*/,
        refCode: "icdmc.refer.debitapply.debitapplyGridRef",
        queryGridUrl: "/nccloud/icdmc/refer/debitapplyGridRef.do",
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: [
                    "debitapplyGridRef-000001" /* 国际化处理： 申请编号,申请编号*/,
                    "debitapplyGridRef-000002" /* 国际化处理： 融资品种,融资品种*/,
                    "debitapplyGridRef-000003" /* 国际化处理： 贷款机构,贷款机构*/,
                    "debitapplyGridRef-000004" /* 国际化处理： 币种,币种*/,
                    "debitapplyGridRef-000005" /* 国际化处理： 申请金额,申请金额*/,
                    "debitapplyGridRef-000006" /* 国际化处理： 申请本币金额,申请本币金额*/,
                    "debitapplyGridRef-000007" /* 国际化处理： 申请日期,申请日期*/
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

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/