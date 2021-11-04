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

		refType: 'gridTree',
        refName: 'refer-000000',/* 国际化处理： 地点档案*/
        placeholder:'refer-000000',/* 国际化处理： 地点档案*/
        refCode: 'uapbd.address.AddrDocGridTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/AreaclTreeRef.do',
        rootNode: { refname: 'refer-000001', refpk: 'root' },/* 国际化处理： 地区分类*/
        treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
        queryGridUrl: '/nccloud/uapbd/ref/AddrDocGridRef.do',
        columnConfig: [{name: ['refer-000002', 'refer-000003'],code: [ 'refcode', 'refname']}],/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65