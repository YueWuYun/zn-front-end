//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const {Refer} = high;
export default function(props= {}){
  var conf = { 
    refName:'refer-000291',  /* 国际化处理： 库存统计体系成员*/
    placeholder: 'refer-000291',/* 国际化处理： 库存统计体系成员*/
    refCode:'uapbd.org.StockStatStruMemberDefaultTreeRef',
    rootNode: { refname: 'refer-000291', refpk: 'root' },/* 国际化处理： 库存统计体系成员*/
    queryTreeUrl:'/nccloud/uapbd/ref/StockStatStruMemberDefaultTreeRef.do',
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