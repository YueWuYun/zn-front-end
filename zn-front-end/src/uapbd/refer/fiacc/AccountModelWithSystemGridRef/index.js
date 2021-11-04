//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from "../../fiacc/AccSystemGridRef/index";

const { Refer } = high;

export var conf = {
    multiLang: {
        domainName: 'uapbd',
        currentLocale: 'zh-CN',
        moduleId: 'refer_uapbd',
    },

    refType: 'grid',
    refName: 'refer-000073',/* 国际化处理： 带有体系的会计科目*/
    placeholder: 'refer-000073',/* 国际化处理： 带有体系的会计科目*/
    refCode: 'uapbd.refer.fiacc.AccountModelWithSystemGridRef',
    queryGridUrl: '/nccloud/uapbd/ref/AccountModelWithSystemGridRef.do',
    isMultiSelectedEnabled: false,
    columnConfig: [{ name: ['refer-000067', 'refer-000068', 'refer-000065'], code: ['refcode', 'refname', 'cname'] }],/* 国际化处理： 科目编码,科目名称,所属科目表*/
    unitProps: unitConf,
    isShowUnit: false
};
export default function (props = {}) {
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65