//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from "../../org/AdminOrgDefaultTreeRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-000204',/* 国际化处理： 所有部门(业务人员来源)*/
		placeholder: 'refer-000204',/* 国际化处理： 所有部门(业务人员来源)*/
		refCode: 'uapbd.org.BusiRoleDeptTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/BusiRoleDeptTreeRef.do',
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		rootNode: { refname: 'refer-000204', refpk: 'root' },/* 国际化处理： 所有部门(业务人员来源)*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit: false,
		unitValueIsNeeded: true
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65