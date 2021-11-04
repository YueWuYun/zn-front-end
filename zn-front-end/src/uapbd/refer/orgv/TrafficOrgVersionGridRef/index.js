//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
import { high } from 'nc-lightapp-front';
const {Refer} = high;
export default function(props= {}){
  var conf = { 
    refName:'refer-000350',  /* 国际化处理： 物流组织版本*/
    placeholder: 'refer-000350', /* 国际化处理： 物流组织版本*/
    refCode:'uapbd.refer.orgv.TrafficOrgVersionGridRef',
    queryGridUrl:'/nccloud/uapbd/orgv/TrafficOrgVersionGridRef.do',
    isMultiSelectedEnabled:false,
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType:'grid',
    columnConfig: [{name: [ 'refer-000252', 'refer-000251' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 版本号,版本名称*/
    unitProps: unitConf,
    isShowUnit:false
  };
  return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65