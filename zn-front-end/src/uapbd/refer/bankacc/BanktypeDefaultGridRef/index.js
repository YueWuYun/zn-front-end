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
		refName: 'refer-000015',/* 国际化处理： 银行类别*/
		refCode: 'uapbd.bankacc.BanktypeDefaultGridRef',
		placeholder:'refer-000015',/* 国际化处理： 银行类别*/
		queryGridUrl: '/nccloud/uapbd/ref/BanktypeDefaultGridRef.do',
		columnConfig: [{name: [ 'refer-000016', 'refer-000017' , 'refer-000018' ],code: [ 'refcode', 'refname' ,'combinecode' ]}],/* 国际化处理： 银行类别编码,银行类别名称,人行行别编码*/
		isMultiSelectedEnabled: false,
		isHasDisabledData:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65