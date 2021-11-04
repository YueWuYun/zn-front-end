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
        refName: 'refer-000365',/* 国际化处理： 产品线*/
        placeholder:'refer-000365',/* 国际化处理： 产品线*/
        refCode: 'uapbd.prodline.ProdLineDefaultGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/ProdLineDefaultGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [{name: [ 'refer-000366', 'refer-000367' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 产品线编码,产品线名称*/
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65