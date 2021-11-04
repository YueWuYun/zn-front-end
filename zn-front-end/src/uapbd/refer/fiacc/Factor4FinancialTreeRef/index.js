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

        refType: 'tree',
        refName: 'refer-000103',/* 国际化处理： 核算要素*/
        placeholder: 'refer-000103',/* 国际化处理： 核算要素*/
        refCode: 'uapbd.refer.fiacc.Factor4FinancialTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/Factor4FinancialTreeRef.do',
        treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
        rootNode: { refname: 'refer-000103', refpk: 'root' },/* 国际化处理： 核算要素*/
        isMultiSelectedEnabled: false,
        isHasDisabledData: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65