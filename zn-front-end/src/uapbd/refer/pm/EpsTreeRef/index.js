//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export var conf = {
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
	refName: 'refer-000357',/* 国际化处理： 项目基本分类*/
	placeholder: 'refer-000357',/* 国际化处理： 项目基本分类*/
	rootNode: { refname: 'refer-000357', refpk: 'root' },/* 国际化处理： 项目基本分类*/
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	refCode: 'uapbd.refer.pm.EpsTreeRef',
	queryTreeUrl: '/nccloud/uapbd/pm/EpsTreeRef.do',
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65