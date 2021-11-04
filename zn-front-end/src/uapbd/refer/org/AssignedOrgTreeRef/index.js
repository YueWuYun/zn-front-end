//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
    var conf = {
        idKey:'refpk2',
		pidKey:'pid2',
        		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
        refName: 'refer-000185',/* 国际化处理： 主组织参照*/
        rootNode:{refname:'refer-000185',refpk2:'root'},/* 国际化处理： 主组织参照*/
        placeholder: 'refer-000185',/* 国际化处理： 主组织参照*/
        refCode: 'uapbd.org.AssignedOrgTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/AssignedOrgTreeRef.do',
        treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false,
        unitProps: unitConf,
        isShowUnit:false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65