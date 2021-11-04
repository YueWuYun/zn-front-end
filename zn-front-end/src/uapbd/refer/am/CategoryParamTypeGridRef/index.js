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
        refName: 'refer-000004',/* 国际化处理： 技术参数类型*/
        placeholder: 'refer-000004',/* 国际化处理： 技术参数类型*/
        refCode: 'uapbd.ref.CategoryParamTypeGridRef',
        queryGridUrl: '/nccloud/uapbd/amcategory/categoryparamref.do',
        columnConfig: [{name: [ 'refer-000005', 'refer-000006' ],code: [ 'refcode', 'refname']}],/* 国际化处理： 实体编码,实体名称*/
        isMultiSelectedEnabled: false,
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65