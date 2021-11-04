//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * abandon
 * 这个参照不使用了
 */

import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = {
        		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
        refName: 'refer-000241',/* 国际化处理： 职务类别*/
        placeholder: 'refer-000241',/* 国际化处理： 职务类别*/
        refCode: 'uapbd.refer.org.JobTypeGridRef',
        queryGridUrl: '/nccloud/uapbd/org/JobTypeGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 编码,名称*/
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65