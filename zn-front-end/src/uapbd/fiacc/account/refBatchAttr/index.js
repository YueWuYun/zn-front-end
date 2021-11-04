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
        fieldid: 'refitemselect',
		refType: 'grid',
        refName: 'refer-003080',
        placeholder: 'refer-003080',
        refCode: 'uapbd.account.RefBatchAttrAction.do',
        queryGridUrl: '/nccloud/uapbd/account/RefBatchAttrAction.do',
        columnConfig: [{name: [ 'refer-003081'],code: [ 'label' ]}],
        isMultiSelectedEnabled: true
    };
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65