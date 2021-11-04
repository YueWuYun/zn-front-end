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

		refType: 'tree',
        refName: 'refer-000298',/* 国际化处理： 行政组织版本*/
        placeholder: 'refer-000298',/* 国际化处理： 行政组织版本*/
        refCode: 'uapbd.refer.org.AdminOrgVersionTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/AdminOrgVersionTreeRef.do',
        treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
        rootNode: { refname: 'refer-000176', refpk: 'root' },/* 国际化处理： 行政组织*/
        isMultiSelectedEnabled: false,
        unitProps: unitConf,
        isShowUnit:false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65