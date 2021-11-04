//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-000399',/* 国际化处理： 模块信息*/
		placeholder: 'refer-000399',/* 国际化处理： 模块信息*/
		rootNode: { refname: 'refer-000399', refpk: 'root' },/* 国际化处理： 模块信息*/
		refCode: 'uapbd.ref.ModuleTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/ModuleTreeRef.do',
		treeConfig:{name:['refer-000400', 'refer-000401'],/* 国际化处理： 模块编码,模块名称*/
		code: ['refcode', 'refname']},
		isTreelazyLoad:false,
		isMultiSelectedEnabled: true,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65