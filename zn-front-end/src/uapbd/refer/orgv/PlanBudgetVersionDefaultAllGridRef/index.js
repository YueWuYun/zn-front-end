//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
    var conf = {
        multiLang: {
                domainName: 'uapbd',
                currentLocale: 'zh-CN',
                moduleId: 'refer_uapbd',
        },
        refType: 'grid',
        refName: 'refer-000337',/* 国际化处理： 预算组织版本(所有)*/
        refCode: 'uapbd.refer.orgv.PlanBudgetVersionDefaultAllGridRef',
        placeholder: 'refer-000337', /* 国际化处理： 预算组织版本(所有)*/
        queryGridUrl: '/nccloud/uapbd/ref/PlanBudgetVersionDefaultAllGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
        unitProps: unitConf,
        isShowUnit:false,
        isHasDisabledData: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65