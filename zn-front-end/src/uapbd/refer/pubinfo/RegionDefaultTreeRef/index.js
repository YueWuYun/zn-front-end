//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from "../../pubinfo/CountryDefaultGridRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-000456',/* 国际化处理： 行政区划*/
		placeholder: 'refer-000456',/* 国际化处理： 行政区划*/
		rootNode: { refname: 'refer-000456', refpk: 'root' },/* 国际化处理： 行政区划*/
		refCode: 'uapbd.pubinfo.RegionDefaultTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/RegionDefaultTreeRef.do',
		treeConfig: {
			name: ['refer-000457', 'refer-000458', 'refer-000014'],/* 国际化处理： 行政区划编码,行政区划名称,助记码*/
			code: ['refcode', 'refname', 'memcode'],
			search: { 'mnecode': true }
		},
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit: false
	};

	return <Refer {...conf} {...props} />
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65