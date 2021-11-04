//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;

export var conf = {
	placeholder: 'refer-000199',/* 国际化处理： 业务单元+集团*/
	rootNode: { refname: 'refer-000199', refpk: 'root' },/* 国际化处理： 业务单元+集团*/
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
	refName: 'refer-000200',/* 国际化处理： 业务单元+集团参照*/
	refCode: 'uapbd.org.BusinessUnitAndGroupTreeRef',
	queryTreeUrl: '/nccloud/uapbd/ref/BusinessUnitAndGroupTreeRef.do',
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	isMultiSelectedEnabled: false,
	unitProps: unitConf,
	isShowUnit: false
};

export default function (props = {}) {

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65