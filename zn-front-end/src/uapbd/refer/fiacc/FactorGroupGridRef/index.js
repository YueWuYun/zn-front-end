//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
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
        refName: 'refer-000106',/* 国际化处理： 核算要素组*/
        placeholder: 'refer-000106',/* 国际化处理： 核算要素组*/
        refCode: 'uapbd.refer.fiacc.FactorGroupGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/FactorGroupGridRef.do',
        columnConfig: [{name: [ 'refer-000107', 'refer-000108' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 要素组编码,要素组名称*/
        isMultiSelectedEnabled: false,
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65