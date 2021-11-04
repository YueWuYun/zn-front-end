//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: 王龙华 
 * @PageInfo: 质量等级带质量等级组的参照 
 * @Date: 2018-06-08 10:40:16 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2019-12-04 11:23:47
 */

import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function(props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer-scm'
		},
		refType: 'gridTree',
		refName: 'REFER-000000' /* 国际化处理： 质量等级*/,
		placeholder: 'REFER-000000' /* 国际化处理： 质量等级*/,
		refCode: 'scmf.ref.QualityLevelBDefaultTreeGridRefer',

		queryTreeUrl: '/nccloud/uapbd/refer/QualityLevelBTreeRefer.do',
		queryGridUrl: '/nccloud/uapbd/refer/QualityLevelBGridRefer.do',
		treeConfig: { name: [ 'REFER-000001', 'REFER-000002' ], code: [ 'refcode', 'refname' ] } /* 国际化处理： 编码,名称*/,
		rootNode: { refname: 'REFER-000003', refpk: 'root' } /* 国际化处理： 质量等级组*/,
		columnConfig: [
			{
				name: [ 'REFER-000004', 'REFER-000005' ] /* 国际化处理： 质量等级编码,质量等级名称*/,
				code: [ 'cqualitylvcode', 'cqualitylvname' ]
			}
		],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65