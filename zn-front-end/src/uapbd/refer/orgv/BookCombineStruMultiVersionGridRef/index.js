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
                refName: 'refer-000303',/* 国际化处理： 账簿合并体系（多版本）*/
                refCode: 'uapbd.refer.org.BookCombineStruMultiVersionGridRef',
                placeholder: 'refer-000304',/* 国际化处理： 账簿合并体系(多版本)*/
                queryGridUrl: '/nccloud/uapbd/orgv/BookCombineStruMultiVersionGridRef.do',
                isMultiSelectedEnabled: false,
                columnConfig: [{ name: ['refer-000305', 'refer-000251', 'refer-000097', 'refer-000098', 'refer-000306', 'refer-000307'], code: ['refcode', 'refname', 'code', 'name', 'vstartdate', 'venddate'] }],/* 国际化处理： 版本编号,版本名称,体系编码,体系名称,版本生效日期,版本失效日期*/
                isHasDisabledData: false
        };

        return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65