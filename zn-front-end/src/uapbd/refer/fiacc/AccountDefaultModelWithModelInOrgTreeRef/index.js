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

		refType: 'tree',
        refName: '',
        placeholder:'refer-000069',/* 国际化处理： 带科目表过滤的会计科目*/
        rootNode:{refname:'refer-000069',refpk:'root'},/* 国际化处理： 带科目表过滤的会计科目*/
        refCode: 'uapbd.fiacc.AccountDefaultModelWithModelInOrgTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/AccountDefaultModelTreeRef.do',
        isMultiSelectedEnabled: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65