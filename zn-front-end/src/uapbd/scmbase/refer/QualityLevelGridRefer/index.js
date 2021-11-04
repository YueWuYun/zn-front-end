//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: 王龙华 
 * @PageInfo: 质量等级参照 
 * @Date: 2018-06-06 16:03:55 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2019-12-04 12:20:27
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
		refName: 'REFER-000000' /* 国际化处理： 质量等级*/,
		refCode: 'scmf.ref.QualityLevelGridRefer',
		queryGridUrl: '/nccloud/uapbd/refer/QualityLevelGridRefer.do',
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