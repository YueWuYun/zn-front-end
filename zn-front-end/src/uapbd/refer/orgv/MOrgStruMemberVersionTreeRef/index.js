//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const {Refer} = high;

export default function(props= {}){
  var conf = { 
    refName:'refer-000335',  /* 国际化处理： 维修组织体系成员版本*/
    placeholder: 'refer-000335',/* 国际化处理： 维修组织体系成员版本*/
    rootNode:{refname:'refer-000335',refpk:'root'},/* 国际化处理： 维修组织体系成员版本*/
    refCode:'uapbd.refer.orgstructv.MOrgStruMemberVersionTreeRef',
    queryTreeUrl:'/nccloud/uapbd/orgstructv/MOrgStruMemberVersionTreeRef.do',
    treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
    isMultiSelectedEnabled:false,
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType:'tree' ,
    isHasDisabledData: false
  };
  return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65