//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitProps} from '../StockOrgGridRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
		columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
		refType: 'grid',
		refName: '组织类型',/* 国际化处理： 组织类型*/
        placeholder: '组织类型',/* 国际化处理： 组织类型*/
		refCode: 'uapbd.org.OrgTypeGridRef',
		queryGridUrl: '/nccloud/uapbd/org/OrgTypeGridRef.do',
		isMultiSelectedEnabled: false,
        isShowUnit:false,
		unitProps: unitProps,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65