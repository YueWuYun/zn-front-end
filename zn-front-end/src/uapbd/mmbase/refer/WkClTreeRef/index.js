//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: '10140MMREFER',
		},

		refType: 'tree',
		refName: 'wkcrefer-000000',
		placeholder: 'wkcrefer-000000',
		rootNode: { refname: 'wkcrefer-000000', refpk: 'root' },
		//refCode: 'uapbd.taxinfo.TaxregionGridRef',
		queryTreeUrl: '/nccloud/mmbd/wk/wkclref.do',
		isMultiSelectedEnabled: false,
		treeConfig: {name: [ 'wkcrefer-000001', 'wkcrefer-000002' ],code: [ 'refcode', 'refname' ]},
		isShowUnit:true,
		unitValueIsNeeded:true,
	};
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65