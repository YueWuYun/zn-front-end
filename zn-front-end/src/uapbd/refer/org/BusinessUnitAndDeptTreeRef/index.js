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
		refName: 'refer-000196',/* 国际化处理： 业务单元及部门*/
		rootNode: { refname: 'refer-000196', refpk: 'root' },/* 国际化处理： 业务单元及部门*/
		refCode: 'uapbd.org.BusinessUnitAndDeptTreeRef',
		placeholder: 'refer-000196',/* 国际化处理： 业务单元及部门*/
		queryTreeUrl: '/nccloud/uapbd/ref/BusinessUnitAndDeptTreeRef.do',
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit: false,
		unitValueIsNeeded: true
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65