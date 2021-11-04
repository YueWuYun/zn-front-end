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
        refName: 'refer-000241',/* 国际化处理： 职务类别*/
        placeholder: 'refer-000241',/* 国际化处理： 职务类别*/
        refCode: 'uapbd.ref.JobTypeTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/JobTypeTreeRef.do',
        isMultiSelectedEnabled: false,
        treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
        rootNode: { refname: 'refer-000241', refpk: 'root' },/* 国际化处理： 职务类别*/
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65