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
        refName: 'refer-000508',/* 国际化处理： 等级体系*/
        placeholder:'refer-000508',/* 国际化处理： 等级体系*/
        refCode: 'uapbd.refer.supplier.SupplierGradeSysGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/SupplierGradeSysGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [{name: [ 'refer-000536', 'refer-000537' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 等级体系编码 ,等级体系名称*/
        isHasDisabledData: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65