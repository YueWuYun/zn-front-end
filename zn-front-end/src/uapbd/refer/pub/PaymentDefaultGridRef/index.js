//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitProps } from '../../org/BusinessUnitTreeRef/index';

//import { conf as unitProps } from '../../org/GroupDefaultTreeRef/index';
const { Refer } = high;

export var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000402',/* 国际化处理： 付款协议*/
		placeholder: 'refer-000402',/* 国际化处理： 付款协议*/
		refCode: 'uapbd.pub.PaymentDefaultGridRef',	
        queryGridUrl: '/nccloud/uapbd/ref/PaymentDefaultGridRef.do',
        columnConfig: [{name: [ 'refer-000403', 'refer-000404' ],code: [ 'refcode', 'refname']}],/* 国际化处理： 付款协议编码,付款协议名称*/
		isMultiSelectedEnabled: false,
		isShowUnit: false,
		unitProps: unitProps,
		isHasDisabledData: false
		
	};
export default function (props = {}){
	return <Refer {...conf} {...props} />
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65