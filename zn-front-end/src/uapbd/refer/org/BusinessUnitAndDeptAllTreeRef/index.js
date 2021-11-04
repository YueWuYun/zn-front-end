//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		placeholder: 'refer-000195',/* 国际化处理： 业务单元及部门(所有)*/
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-000195',/* 国际化处理： 业务单元及部门(所有)*/
		rootNode: { refname: 'refer-000195', refpk: 'root' },/* 国际化处理： 业务单元及部门(所有)*/
		placeholder: 'refer-000195',/* 国际化处理： 业务单元及部门(所有)*/
		refCode: 'uapbd.org.BusinessUnitAndDeptAllTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/BusinessUnitAndDeptAllTreeRef.do',
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit: false,
		unitValueIsNeeded: true
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65