//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = {
        multiLang: {
                domainName: 'uapbd',
                currentLocale: 'zh-CN',
                moduleId: 'refer_uapbd',
        },
        refType: 'grid',
        refName: 'refer-000188',/* 国际化处理： 预算组织体系(所有)*/
        refCode: 'uapbd.refer.org.BudgetOrgStruAllGridRef',
        placeholder: 'refer-000188',/* 国际化处理： 预算组织体系(所有)*/
        queryGridUrl: '/nccloud/uapbd/ref/BudgetOrgStruAllGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 编码,名称*/
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65