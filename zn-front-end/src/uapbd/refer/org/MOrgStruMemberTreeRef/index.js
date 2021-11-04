//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitConf} from "../../org/MOrgStruDefaultGridRef/index";
const {Refer} = high;

export default function(props= {}){
  var conf = { 
    refName:'refer-000253',  /* 国际化处理： 维修组织体系成员*/
    placeholder: 'refer-000253',/* 国际化处理： 维修组织体系成员*/
    rootNode:{refname:'refer-000253',refpk:'root'},/* 国际化处理： 维修组织体系成员*/
    refCode:'uapbd.refer.orgstruct.MOrgStruMemberTreeRef',
    queryTreeUrl:'/nccloud/uapbd/orgstruct/MOrgStruMemberTreeRef.do',
    treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
    isMultiSelectedEnabled:false,
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType:'tree' ,
    unitProps: unitConf,
    isShowUnit:false,
    isHasDisabledData: false
  };
  return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65