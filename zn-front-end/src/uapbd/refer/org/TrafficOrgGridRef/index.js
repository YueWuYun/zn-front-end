//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65

import { high } from 'nc-lightapp-front';
const {Refer} = high;
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
export default function(props= {}){
  var conf = { 
    refName:'refer-000296',  /* 国际化处理： 物流组织*/
    placeholder: 'refer-000296',  /* 国际化处理： 物流组织*/
    refCode:'uapbd.refer.org.TrafficOrgGridRef',
    queryGridUrl:'/nccloud/uapbd/org/TrafficOrgGridRef.do',
    isMultiSelectedEnabled:false,
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType:'grid',
    columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
    unitProps: unitConf,
    isShowUnit:false
  };
  return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65