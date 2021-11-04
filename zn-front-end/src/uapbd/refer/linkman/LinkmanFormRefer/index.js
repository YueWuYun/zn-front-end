//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import LinkmanReferWrapper from "../component/LinkmanRef";

export const conf = {
    placeholder:'refer-000033',/* 国际化处理： 联系人*/
    refName:'refer-000033',/* 国际化处理： 联系人*/
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType:'grid',
    queryGridUrl:'/nccloud/uapbd/ref/QueryReferLinkman.do',
    columnConfig:[{
            name: [ 'refer-000002', 'refer-000003' ],/* 国际化处理： 编码,名称*/
            code: [ 'refcode', 'refname' ]
        }],


}

export default function (props = {}) {
    return <LinkmanReferWrapper {...conf} {...props} />
}


/***********************************************************************************************
 *  联系人参照使用说明：
 *
 *  1、新增联系人：直接设置refcode即可
 *
 *  2、修改联系人：设置queryCondition属性 pk_linkman 为要修改的联系人主键值，如 item.queryCondition['pk_linkman']='xxxxxxx'
 *
 *  3、需要设置 onAfterEdit 方法，在点击确定后：会执行 onAfterEdit，把表单当前值作为参数传给onAfterEdit
 *                              在点击取消后：会执行 onAfterEdit，把表单原有值作为参数传给onAfterEdit
 *
 *  4、联系人表单模板的areacode 统一叫做 linkmanRefer
 *  
 *  5、节点中使用：
 *      A、在节点的模板中添加联系人模板，areacode 就命名为 linkmanRefer
 *      B、在使用前找到联系人参照字段，配置传参：
 *               {
 *                   linkmanReferId:'linkmanRefer',      //参照Form areacode 必传
 *                   form:props.form,                    //form组件 必传
 *                   validateToSave:props.validateToSave,//验证公式，不传不校验 
 *                   dealFormulamsg:props.dealFormulamsg,//显示公式，不传不校验
 *                   pageid:this.props.pagecode,         //pageid
 *                   onAfterEdit:this.onLinkmanReferEditAfter.bind(this)//保存后事件
 *               }
 *
 *  由于是表单型参照，所以  显示停用、多选、组织切换、已选 等功能都没有意义
 *
 *
 ***********************************************************************************************/


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65