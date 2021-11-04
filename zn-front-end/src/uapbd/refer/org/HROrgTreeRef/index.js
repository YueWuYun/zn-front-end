//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';

const { Refer } = high;

export var conf = {
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
	refName: 'refer-000234',/* 国际化处理： 人力资源组织*/
	placeholder: 'refer-000234',/* 国际化处理： 人力资源组织*/
	rootNode: { refname: 'refer-000234', refpk: 'root' },/* 国际化处理： 人力资源组织*/
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	refCode: 'uapbd.refer.org.HROrgTreeRef',
	queryTreeUrl: '/nccloud/uapbd/org/HROrgTreeRef.do',
	isShowDisabledData: false,
	unitProps: unitConf
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65