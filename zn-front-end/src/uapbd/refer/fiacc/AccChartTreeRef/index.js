//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
		fieldid: 'refchart',
		refType: 'tree',
		refName: 'refer-000060',/* 国际化处理： 科目表*/
		placeholder: 'refer-000060',/* 国际化处理： 科目表*/
		rootNode: { refname: 'refer-000060', refpk: 'root' },/* 国际化处理： 科目表*/
		refCode: 'uapbd.refer.fiacc.AccCharTreetRef',
		queryTreeUrl: '/nccloud/uapbd/fiacc/AccChartTreeRef.do',
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname'],},/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit:false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65