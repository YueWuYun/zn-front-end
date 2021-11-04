//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitConf} from "../../fiacc/ElementSystemGridRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000110',/* 国际化处理： 带有体系的核算要素*/
		placeholder: 'refer-000110',/* 国际化处理： 带有体系的核算要素*/
		refCode: 'uapbd.fiacc.FactorRefModelWithSystemGridRef',	
        queryGridUrl: '/nccloud/uapbd/ref/FactorRefModelWithSystemGridRef.do',
        columnConfig: [{name: [ 'refer-000002', 'refer-000003','refer-000111' ],code: [ 'factorcode', 'factorname','factorchartname' ]}],/* 国际化处理： 编码,名称,所属要素表*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit:false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65