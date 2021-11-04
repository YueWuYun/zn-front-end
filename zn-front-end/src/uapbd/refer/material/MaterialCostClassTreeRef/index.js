//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';

const { Refer } = high;

export var conf = {
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
	refName: 'refer-000141',/* 国际化处理： 物料成本分类*/
	placeholder: 'refer-000141',/* 国际化处理： 物料成本分类*/
	rootNode: { refname: 'refer-000141', refpk: 'root' },/* 国际化处理： 物料成本分类*/
	treeConfig: { name: ['refer-000142', 'refer-000143'], code: ['refcode', 'refname'] },/* 国际化处理： 分类编码,分类名称*/
	refCode: 'uapbd.refer.material.MaterialCostClassTreeRef',
	queryTreeUrl: '/nccloud/uapbd/material/MaterialCostClassTreeRef.do',
	isShowDisabledData: false,
	unitProps: unitConf
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65