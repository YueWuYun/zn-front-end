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
		refName: 'refer-000041',/* 国际化处理： 客户物料码*/
		placeholder: 'refer-000041',/* 国际化处理： 客户物料码*/
		refCode: 'uapbd.customer.CustMaterialGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/CustMaterialGridRef.do',
		columnConfig: [{ name: ['refer-000041', 'refer-000042','refer-000043','refer-000044','refer-000045'], code: ["bd_custmaterial.code","bd_custmaterial.name","bd_material.code as material_code","bd_material.name as material_name","bd_material.version"] }],/* 国际化处理： 客户物料码,客户物料名称,物料编码,物料名称,物料版本*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65