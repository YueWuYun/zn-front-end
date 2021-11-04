//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65

import { high } from 'nc-lightapp-front';
const {Refer} = high;
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
export default function(props= {}){
  var conf = { 
    refName:'refer-000246',  /* 国际化处理： 责任组织*/
    placeholder: 'refer-000246', /* 国际化处理： 责任组织*/
    rootNode:{refname:'refer-000246',refpk:'root'},/* 国际化处理： 责任组织*/
    refCode:'uapbd.refer.org.LiabilityCenterOrgTreeRef',
    queryTreeUrl:'/nccloud/uapbd/org/LiabilityCenterOrgTreeRef.do',
    isMultiSelectedEnabled:false,
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType:'tree',
    treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
    unitProps: unitConf,
    isShowUnit:false
  };
  return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65