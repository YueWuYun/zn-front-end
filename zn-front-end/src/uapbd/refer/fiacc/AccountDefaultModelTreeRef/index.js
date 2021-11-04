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
        refName: 'refer-000066',/* 国际化处理： 会计科目*/
        placeholder:'refer-000066',/* 国际化处理： 会计科目*/
        rootNode:{refname:'refer-000066',refpk:'root'},/* 国际化处理： 会计科目*/
        refCode: 'uapbd.fiacc.AccountDefaultModelTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/AccountDefaultModelTreeRef.do',
        isMultiSelectedEnabled: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65