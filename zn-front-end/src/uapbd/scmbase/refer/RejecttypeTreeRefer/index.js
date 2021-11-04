//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: yinliang 
 * @PageInfo: 质量不合格类型-参照
 * @Date: 2019-03-29 09:51:08 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2019-12-04 13:30:06
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
		refType: 'tree',
		rootNode: { refname: 'REFER-000008', refpk: 'root' },
		placeholder: 'REFER-000008',
		refName: 'REFER-000008',
		refCode: 'nccloud.web.scmf.rejecttype.ref.RejecttypeRefAction',
		queryTreeUrl: '/nccloud/uapbd/refer/RejecttypeRef.do',
		treeConfig: {
			name: [ 'REFER-000009', 'REFER-000010' ],
			code: [ 'refcode', 'refname' ]
		},
		isMultiSelectedEnabled: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65