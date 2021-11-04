//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitConf} from "../../pubinfo/AccPeriodSchemeDefaultTreeRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
		refName: 'refer-000078',/* 国际化处理： 会计期间*/
		refCode: 'uapbd.pubinfo.AccperiodTreeGridRef',
		placeholder: 'refer-000435',/* 国际化处理： 会计期间档案2*/
		queryTreeUrl: '/nccloud/uapbd/ref/AccperiodDefaultTreeRef.do',
		rootNode: { refname: 'refer-000080', refpk: 'root' },/* 国际化处理： 会计年度*/
		queryGridUrl: '/nccloud/uapbd/ref/AccperiodGridRef.do',
		columnConfig: [
			{
				name: [ 'refer-000430', 'refer-000431','refer-000432' ],/* 国际化处理： 月份,开始期间,结束期间*/
				code: [ 'refname', 'begindate','enddate' ]
			}
		],
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit:false,
		isHasDisabledData:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65