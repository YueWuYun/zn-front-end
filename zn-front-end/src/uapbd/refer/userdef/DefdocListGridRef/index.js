//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';

const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000529',/* 国际化处理： 自定义档案定义*/
		placeholder: 'refer-000529',/* 国际化处理： 自定义档案定义*/
		refCode: 'uapbd.refer.userdef.DefdocListGridRef',
		queryGridUrl: '/nccloud/uapbd/userdef/DefdocListGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{ name: ['refer-000530', 'refer-000531'], code: ['refcode', 'refname'] }],/* 国际化处理：自定义档案编码,自定义档案名称*/
		isHasDisabledData: false,
		unitProps: unitConf,
		isShowUnit: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65