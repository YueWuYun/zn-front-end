//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const {Refer} = high;

//此参照取自于uap的参照uap/refer/riart/bdmdMainentityAndEnumRef/index.js
export default function (props = {}) {
    var conf = {
        queryTreeUrl:'/nccloud/riart/ref/bdmdEntityAndEnumRefTreeAction.do',
        queryGridUrl:'/nccloud/riart/ref/bdmdEntityAndEnumRefTableAction.do',
        columnConfig:[
            {
                name: [ 'refer-000005', 'refer-000006'],/* 国际化处理： 实体编码,实体名称*/
                code: [ 'name', 'displayName']
            }
        ],
        		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType:"gridTree",
        isMultiSelectedEnabled:false,
        isTreelazyLoad:false,
        refName:'refer-000463'/* 国际化处理： 档案主实体及枚举*/
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65