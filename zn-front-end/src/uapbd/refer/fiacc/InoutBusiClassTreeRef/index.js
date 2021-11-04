//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-000114',/* 国际化处理： 收支项目*/
		placeholder: 'refer-000114',/* 国际化处理： 收支项目*/
		rootNode: { refname: 'refer-000114', refpk: 'root' },/* 国际化处理： 收支项目*/
		refCode: 'uapbd.fiacc.InoutBusiClassTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/InoutBusiClassTreeRef.do',
		isMultiSelectedEnabled: false,
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		unitProps: unitConf,
		isShowUnit: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65