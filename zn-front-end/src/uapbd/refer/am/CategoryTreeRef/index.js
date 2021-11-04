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
        refName: 'refer-000007',/* 国际化处理： 资产类别*/
        placeholder: 'refer-000007',/* 国际化处理： 资产类别*/
        refCode: 'uapbd.refer.am.CategoryTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/CategoryTreeRef.do',
        rootNode: { refname: 'refer-000007', refpk: 'root' },/* 国际化处理： 资产类别*/
        treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false,
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65