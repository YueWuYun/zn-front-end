//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: zhaopym 
 * @Date: 2019-03-19 18:03:50 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2019-12-04 12:20:55
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
		placeholder: 'REFER-000014' /**价格模板 */,
		refName: 'REFER-000014',
		refCode: 'nccloud.web.ct.priceTemplate.ref.PriceTemplateGridRefer',
		queryGridUrl: '/nccloud/uapbd/refer/priceTemplateGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000015', 'REFER-000016' ],
				code: [ 'vcode', 'vname' ]
			}
		],
		isMultiSelectedEnabled: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65