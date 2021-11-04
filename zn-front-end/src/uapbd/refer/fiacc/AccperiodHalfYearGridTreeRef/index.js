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

		refType: 'gridTree',
		refName: 'refer-000075',/* 国际化处理： 会计半年*/
        placeholder: 'refer-000075',/* 国际化处理： 会计半年*/
		refCode:'uapbd.refer.fiacc.AccperiodHalfYearGridTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/AccperiodHalfYearTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/AccperiodHalfYearGridRef.do',
        columnConfig: [{
            name: [ 'refer-000075', 'refer-000076' ,'refer-000077'],/* 国际化处理： 会计半年,开始月,结束月*/
            code: [ 'refcode', 'refname' ,"endmonth"],
            checked: {
                endmonth: false
            }
        }],
        rootNode: { refname: 'refer-000078', refpk: 'root' },/* 国际化处理： 会计期间*/
        isMultiSelectedEnabled: false,
        isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65