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
		rootNode: { refname: 'refer-000019', refpk: 'root' },/* 国际化处理： 货位*/
		refName: 'refer-000019',/* 国际化处理： 货位*/
        placeholder: 'refer-000019',/* 国际化处理： 货位*/
		refCode: 'uapbd.refer.busiinfo.RackDefaultTreeRef',
		queryTreeUrl: '/nccloud/uapbd/busiinfo/RackDefaultTreeRef.do',
		isMultiSelectedEnabled: false,
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65