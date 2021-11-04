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
                refName: 'refer-000409',/* 国际化处理： 质量等级*/
                refCode: 'uapbd.refer.pub.QualityLevelGridRef',
                placeholder: 'refer-000409',/* 国际化处理： 质量等级*/
                queryGridUrl: '/nccloud/uapbd/ref/QualityLevelGridRef.do',
                isMultiSelectedEnabled: false,
                columnConfig: [{ name: ['refer-000410', 'refer-000411', 'refer-000412', 'refer-000413', 'refer-000414'], code: ['refcode', 'refname', 'bqualified', 'cdefectprocess', 'cbatchsuffix'] }],/* 国际化处理： 质量等级编码,质量等级名称,是否合格品,建议处理方式,批次后缀*/
                isHasDisabledData: false
        };

        return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65