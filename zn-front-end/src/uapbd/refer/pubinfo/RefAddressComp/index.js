//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import AddressRefWrapper from "./AddressRef";
export const conf = {
    placeholder:'refer-000455',/* 国际化处理： 地址簿*/
    refName:'refer-000455',/* 国际化处理： 地址簿*/
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType:'grid',
    queryGridUrl:'/nccloud/uapbd/custAddress/queryCustAddRef.do',
    saveCustAddRef:'/nccloud/uapbd/custAddress/saveCustAddRef.do'
}

export default function (props = {}) {
    return <AddressRefWrapper {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65