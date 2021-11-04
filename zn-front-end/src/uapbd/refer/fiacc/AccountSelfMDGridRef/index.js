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
        refName: 'refer-000074',/* 国际化处理： 科目表独立参照*/
        placeholder: 'refer-000074',/* 国际化处理： 科目表独立参照*/
        refCode: 'uapbd.refer.fiacc.AccountSelfMDGridRef',
        queryGridUrl: '/nccloud/uapbd/fiacc/AccountSelfMDGridRef.do',
        columnConfig: [{
            name: ['refer-000067', 'refer-000068']/* 国际化处理： 科目编码,科目名称*/
            , code: ['refcode', 'refname']
        }],
        isMultiSelectedEnabled: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65