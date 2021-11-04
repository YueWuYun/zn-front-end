//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from "../../org/BusinessUnitTreeRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-000315',/* 国际化处理： 部门版本*/
		rootNode: { refname: 'refer-000315', refpk: 'root' },/* 国际化处理： 部门版本*/
		placeholder: 'refer-000315',/* 国际化处理： 部门版本*/
		refCode: 'uapbd.orgv.DeptVersionTreeRef',
		queryTreeUrl: '/nccloud/uapbd/org/DeptVersionTreeRef.do',
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit: false,
		unitValueIsNeeded: true
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65