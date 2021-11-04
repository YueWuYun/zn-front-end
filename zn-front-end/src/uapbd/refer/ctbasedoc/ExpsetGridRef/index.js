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
    refName: 'refer-000021',/* 国际化处理： 合同费用*/
    placeholder: 'refer-000021',/* 国际化处理： 合同费用*/
    refCode: 'uapbd.refer.ctbasedoc.ExpsetGridRef',
    queryGridUrl: '/nccloud/uapbd/ctbasedoc/ExpsetGridRef.do',
    isMultiSelectedEnabled: false,
    columnConfig: [{ name: ['refer-000022', 'refer-000023', 'refer-000024'], code: ['refcode', 'refname', 'memo'] }],/* 国际化处理： 费用项编号,费用项名称,备注*/
    isHasDisabledData: false
};

export default function (props = {}) {
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65