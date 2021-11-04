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
		refName: 'refer-000446',/* 国际化处理： 币种档案*/
		placeholder:'refer-000446',/* 国际化处理： 币种档案*/
		refCode: 'uapbd.pubinfo.CurrtypeRef',
		queryGridUrl: '/nccloud/uapbd/ref/CurrtypeGridRef.do',
        isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000447', 'refer-000389','refer-000448','refer-000449' ],/* 国际化处理： 币种编码,币种名称,币种符号,金额小数位数*/
		code: [ 'refcode', 'refname','currtypesign','currdigit' ],
		checked:{
			currtypesign:false, 
			currdigit:false
		}}],
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65