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
		refName: 'refer-000256',/* 国际化处理： 组织类型分类的组织单元(所有)*/
        placeholder: 'refer-000256',/* 国际化处理： 组织类型分类的组织单元(所有)*/
		refCode: 'uapbd.refer.org.OrgAndOrgTypeCompositeTreeRef',
        queryTreeUrl: '/nccloud/uapbd/org/OrgAndOrgTypeCompositeTreeRef.do',
        rootNode: { refname: 'refer-000255', refpk2: 'root' },/* 国际化处理： 组织*/
		isMultiSelectedEnabled: false,
        isShowUnit:false,
        unitProps: unitConf, 
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']} ,/* 国际化处理： 编码,名称*/
		isHasDisabledData: false
	};
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65