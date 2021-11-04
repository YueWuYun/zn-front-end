//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitProps} from '../../org/StockOrgGridRef/index';
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
		refName: 'refer-003083',/* 国际化处理： 组织参照*/
        placeholder: 'refer-003083',/* 国际化处理： 组织参照*/
		refCode: 'uapbd.refer.org.OrgByParaUsedTreeRef',
        queryTreeUrl: '/nccloud/uapbd/org/OrgByParaUsedTreeRef.do',
        rootNode: { refname: 'refer-000255', refpk2: 'root' },/* 国际化处理： 组织*/
		isMultiSelectedEnabled: false,
        isShowUnit:false,
        unitProps: unitProps,
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']} ,/* 国际化处理： 编码,名称*/
	};
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65