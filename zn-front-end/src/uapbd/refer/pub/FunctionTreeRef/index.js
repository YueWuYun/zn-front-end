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
		refName: 'refer-000396',/* 国际化处理： 功能*/
        placeholder: 'refer-000396',/* 国际化处理： 功能*/
		refCode: 'uapbd.pub.FunctionTreeRef',
		rootNode: { refname: 'refer-000396', refpk: 'root' },/* 国际化处理： 功能*/
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		queryTreeUrl: '/nccloud/uapbd/ref/FunctionTreeRef.do',
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};
	return <Refer {...conf} {...props} />
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65