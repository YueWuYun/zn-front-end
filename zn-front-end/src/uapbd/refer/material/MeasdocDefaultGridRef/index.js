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
		refName: 'refer-000153',/* 国际化处理： 计量单位*/
		placeholder: 'refer-000153',/* 国际化处理： 计量单位*/
		refCode: 'uapbd.material.MeasdocDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/MaterialDefaultRefGrid.do',
		columnConfig: [
			{
				name: [ 'refer-000154', 'refer-000155' ,'refer-000156','refer-000157'],/* 国际化处理： 计量单位编码,计量单位名称,所属量纲,是否基本单位*/
				code: [ 'refcode', 'refname' ,'oppdimen_name','basecodeflag'],
				checked: {
					basecodeflag: false
				}
			}
		],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65