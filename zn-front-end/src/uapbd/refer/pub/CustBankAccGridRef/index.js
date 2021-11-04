//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitProps} from "../../org/BusinessUnitTreeRef/index";
const { Refer } = high;

//客户、客商、供应商银行账户参照

export default function (props = {}) {
    let title = 'refer-000393';/* 国际化处理： 客户银行账户*/
    if(props.title == 'refer-000393'/* 国际化处理： 客户银行账户*/
        || props.title == 'refer-000394'/* 国际化处理： 供应商银行账户*/
        || props.title == 'refer-000395'){/* 国际化处理： 客商银行账户*/
            title = props.title;
    }else{
        props.title = title;
    }
	var conf = {
        refName: title,
        placeholder: title,
		refCode: 'uapbd.refer.pub.CustBankAccGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/CustBankAccGridRef.do',
        isMultiSelectedEnabled: false, 
        columnConfig:[
        {
            name: [ 'refer-000012', 'refer-000013','refer-000381','refer-000015','refer-000384' ],/* 国际化处理： 账号,户名,开户银行,银行类别,币种*/
            code: [ "accnum", "accname", "bankdoc_name", "banktype_name", "currtype_name"  ]
        }],
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
        isShowUnit:false,
        unitProps: unitProps, 
    };
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65