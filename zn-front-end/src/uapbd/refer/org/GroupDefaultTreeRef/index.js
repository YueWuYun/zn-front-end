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
	refName: 'refer-000232',/* 国际化处理： 集团(所有)*/
	placeholder: 'refer-000232',/* 国际化处理： 集团(所有)*/
	refCode: 'uapbd.org.GroupDefaultTreeRef',
	queryTreeUrl: '/nccloud/uapbd/ref/GroupDefaultTreeRef.do',
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	rootNode: { refname: 'refer-000232', refpk: 'root' },/* 国际化处理： 集团(所有)*/
	isMultiSelectedEnabled: false,
	isHasDisabledData: false
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65