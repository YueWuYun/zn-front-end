//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitProps } from '../../../../uapbd/refer/org/BusinessUnitTreeRef/index';

const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
		refName: 'refer-000369',/* 国际化处理： 人员*/
		placeholder: 'refer-000369',/* 国际化处理： 人员*/
		rootNode: { refname: 'refer-000216', refpk: 'root' },/* 国际化处理： 部门*/
		refCode: 'uapbd.refer.psninfo.PsndocRiartTreeGridRef',
		queryTreeUrl: '/nccloud/uapbd/ref/PsndocRiartTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/PsndocRiartGridRef.do',
		columnConfig: [
			{
				name: ['refer-000370', 'refer-000371', 'refer-000216'],/* 国际化处理： 人员编码,姓名,部门*/
				code: ['psndoccode', 'psndocname', 'deptname'],
				fullTxtCode: { 'psndoccode': true, 'psndocname': true }
			}
		],
		isMultiSelectedEnabled: false,
		isShowUnit: false,
		unitProps: unitProps
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65