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
        refName: 'refer-000001',/* 国际化处理： 地区分类*/
        placeholder:'refer-000001',/* 国际化处理： 地区分类*/
        rootNode: { refname: 'refer-000001', refpk: 'root' },/* 国际化处理： 地区分类*/
        refCode: 'uapbd.address.AreaclTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/AreaclTreeRef.do',
        treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65