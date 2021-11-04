//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

import { conf as unitConf }  from '../../../../uapbd/refer/org/GroupDefaultTreeRef/index';//集团

const { Refer } = high;

export var conf = {
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
	refName: 'refer-000061',/* 国际化处理： 科目表(跨集团)*/
	placeholder: 'refer-000061',/* 国际化处理： 科目表(跨集团)*/
	rootNode: { refname: 'refer-000061', refpk: 'root' },/* 国际化处理： 科目表(跨集团)*/
	refCode: 'uapbd.refer.fiacc.AccChartWithGroupTreeRef',
	queryTreeUrl: '/nccloud/uapbd/fiacc/AccChartWithGroupTreeRef.do',
	treeConfig:{name:['refer-000002', 'refer-000003','refer-000047'],/* 国际化处理： 编码,名称,所属组织*/
	idKey:'pk_accchart',
	pidKey:'innercode',
	code: ['refcode', 'refname','orgname'],
	checked:{
		orgname:false
	}},
	isMultiSelectedEnabled: false,
	isShowDisabledData: false,
	isShowUnit:false,
	unitProps: unitConf,
	isHasDisabledData: false
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65