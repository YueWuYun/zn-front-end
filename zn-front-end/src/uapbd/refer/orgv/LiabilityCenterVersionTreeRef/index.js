//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
import { high } from 'nc-lightapp-front';
const {Refer} = high;
export default function(props= {}){
  var conf = { 
    refName:'refer-000333',  /* 国际化处理： 责任组织版本*/
    placeholder: 'refer-000333', /* 国际化处理： 责任组织版本*/
    rootNode:{refname:'refer-000333',refpk:'root'},  /* 国际化处理： 责任组织版本*/
    refCode:'uapbd.refer.org.LiabilityCenterVersionTreeRef',
    queryTreeUrl:'/nccloud/uapbd/org/LiabilityCenterVersionTreeRef.do',
    isMultiSelectedEnabled:false,
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType:'tree',
    treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']} ,/* 国际化处理： 编码,名称*/
    unitProps: unitConf,
    isShowUnit:false
  };
  return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65