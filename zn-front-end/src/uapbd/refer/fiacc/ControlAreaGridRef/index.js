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
                refName: 'refer-000089',/* 国际化处理： 管控范围*/
                refCode: 'uapbd.refer.controlarea.ControlAreaGridRef',
                placeholder: 'refer-000089',/* 国际化处理： 管控范围*/
                queryGridUrl: '/nccloud/uapbd/controlarea/ControlAreaGridRef.do',
                isMultiSelectedEnabled: false,
                columnConfig: [{ name: ['refer-000090', 'refer-000091'], code: ['refcode', 'refname'] }],/* 国际化处理： 管控范围编码,管控范围名称*/
                isHasDisabledData: false

        };

        return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65