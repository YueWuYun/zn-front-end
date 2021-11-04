//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * 计量器具级别参照
 * @Author: yangls7 
 * @Date: 2019-06-12 13:25:19 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-07-17 15:49:30
 */
import React from 'react';
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
		placeholder: 'REFER-000011' /**国际化：计量器具级别 */,
		refName: 'REFER-000011',
		refCode: 'nccloud.web.ic.mscl.ref.MsclGridReferAction',
		queryGridUrl: '/nccloud/uapbd/icbasedoc/MsclGridRef.do',
		columnConfig: [
			{
				name: [ 'REFER-000012', 'REFER-000013' ],
				code: [ 'classcode', 'classname' ]
			}
		],
		isMultiSelectedEnabled: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65