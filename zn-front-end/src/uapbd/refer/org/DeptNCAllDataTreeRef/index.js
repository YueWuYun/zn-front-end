//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

import { conf as unitConf } from '../BusinessUnitTreeRef/index';

const { Refer } = high;

export var conf = {
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
	refName: 'refer-000215',/* 国际化处理： 部门(所有)*/
	placeholder: 'refer-000215',/* 国际化处理： 部门(所有)*/
	rootNode: { refname: 'refer-000215', refpk: 'root' },/* 国际化处理： 部门(所有)*/
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	refCode: 'uapbd.refer.org.DeptNCAllDataTreeRef',
	queryTreeUrl: '/nccloud/uapbd/org/DeptNCAllDataTreeRef.do',
	isShowUnit: false,
	unitProps: unitConf
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65