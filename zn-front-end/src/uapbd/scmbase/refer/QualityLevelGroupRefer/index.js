//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: 王龙华 
 * @PageInfo: 质量等级参照 
 * @Date: 2018-06-06 16:03:55 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2019-12-04 12:20:24
 */

import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function(props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer-scm'
		},
		refType: 'grid',
		refName: 'REFER-000003' /* 国际化处理： 质量等级组*/,
		refCode: 'scmf.refer.QualityLevelGroupRefer',
		queryGridUrl: '/nccloud/uapbd/refer/QualityLevelGroupRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000006', 'REFER-000007' ] /* 国际化处理： 质量等级组编码,质量等级组名称*/,
				// name: [ '质量等级组编码', '质量等级组名称' ],
				code: [ 'cqlgroupcode', 'cqlgroupname' ]
			}
		],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65