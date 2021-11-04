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
	refName: 'refer-000197',/* 国际化处理： 业务单元+集团(所有)*/
	rootNode: { refname: 'refer-000197', refpk: 'root' },/* 国际化处理： 业务单元+集团(所有)*/
	refCode: 'uapbd.ref.BusinessUnitAndGroupNCTreeRef',
	placeholder:'refer-000197',/* 国际化处理： 业务单元+集团(所有)*/
	treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
	queryTreeUrl: '/nccloud/uapbd/ref/BusinessUnitAndGroupAllTreeRef.do',
	isMultiSelectedEnabled: false,
	unitProps: unitConf,
	isShowUnit:false,
	isHasDisabledData: false,
	
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65