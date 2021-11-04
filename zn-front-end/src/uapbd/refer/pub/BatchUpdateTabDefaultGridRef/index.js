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
                refName: 'refer-000390',/* 国际化处理： 批改页签*/
                placeholder: 'refer-000390',/* 国际化处理： 批改页签*/
                refCode: 'uapbd.pub.BatchUpdateTabDefaultGridRef',
                queryGridUrl: '/nccloud/uapbd/ref/BatchUpdateTabDefaultGridRef.do',
                columnConfig: [{ name: ['refer-000391', 'refer-000392'], code: ['refcode', 'refname'] }],/* 国际化处理： 页签编码,页签名称*/
                isMultiSelectedEnabled: false,
                isHasDisabledData: false
        };

        return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65