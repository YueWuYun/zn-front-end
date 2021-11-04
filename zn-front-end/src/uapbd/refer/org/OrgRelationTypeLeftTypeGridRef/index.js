//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitProps} from '../../org/StockOrgGridRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000259',/* 国际化处理： 组织关系类型归属类型*/
        placeholder: 'refer-000259',/* 国际化处理： 组织关系类型归属类型*/
		refCode: 'uapbd.org.OrgRelationTypeLeftTypeGridRef',
		queryGridUrl: '/nccloud/uapbd/org/OrgRelationTypeLeftTypeGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
        isShowUnit:false,
		unitProps: unitProps,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65