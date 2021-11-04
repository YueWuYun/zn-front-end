//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export var conf = {
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
    refName: 'refer-000025',/* 国际化处理： 合同条款档案*/
    placeholder: 'refer-000025',/* 国际化处理： 合同条款档案*/
    refCode: 'uapbd.refer.ctbasedoc.TermTypeOrgGridRef',
    queryGridUrl: '/nccloud/uapbd/ctbasedoc/TermTypeOrgGridRef.do',
    isMultiSelectedEnabled: false,
    columnConfig: [{ name: ['refer-000026', 'refer-000027', 'refer-000028'], code: ['refcode', 'refname', 'vtermcontent'] }],/* 国际化处理： 合同条款编码,合同条款名称,合同条款内容*/
    isHasDisabledData: false
};

export default function (props = {}) {
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65