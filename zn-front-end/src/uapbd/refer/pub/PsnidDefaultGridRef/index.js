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
                refName: 'refer-000406',/* 国际化处理： 证件类型*/
                refCode: 'uapbd.refer.pub.PsnidDefaultGridRef',
                placeholder: 'refer-000406',/* 国际化处理： 证件类型*/
                queryGridUrl: '/nccloud/uapbd/ref/PsnidDefaultGridRef.do',
                isMultiSelectedEnabled: false,
                columnConfig: [{ name: ['refer-000407', 'refer-000408'], code: ['refcode', 'refname'] }],/* 国际化处理： 证件类型编码,证件类型名称*/
                isHasDisabledData: false
        };

        return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65