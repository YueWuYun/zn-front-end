/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { SimpleReport } from 'nc-report'
import { ajax, toast,cacheTools,getBusinessInfo  } from 'nc-lightapp-front';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';


export default class Test extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  setDefaultVal(searchId,props,flag,template) {
    let businessInfo = getBusinessInfo();

    console.log(businessInfo.groupId);
    console.log(businessInfo.groupName);
    /*
    {
        businessDate //业务日期
        groupId //业务集团信息
        groupName //集团名称
        userId //用户id
        userName //用户名称
        userCode 用户编码
        projectCode //项目编码
    }
    */

    let meta =template.template;
    let org_Name=template.context.org_Name;
    let pk_org=template.context.pk_org;
    meta['light_report'].items.map((item) => {
      if (item.attrcode == 'pk_org') {
        props.search.setSearchValByField(searchId, 'pk_org', { value: pk_org,display: org_Name });  
      }
      if (item.attrcode == 'pk_group') {
       
        props.search.setSearchValByField(searchId, 'pk_group', { value: businessInfo.groupId,display: businessInfo.groupName });  

      }
    }); 
  }

  disposeSearch (meta, props) {
    let items = meta['light_report'].items
    items.forEach((item) => {      
      if(item.attrcode == 'pk_org') {
        item.queryCondition = () => {
          return {
            funcode:'36201PLS',
            TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
          }
        }        
      };   
    });  
    return meta; // 处理后的过滤参照返回给查询区模板
  }
  /**
   * 
   * @param  items: 查询区查询数据，如需拓展查询区参数，请返回与items相同格式的查询数据
   */
  expandSearchVal (items) {
    // 变量赋值拓展
    console.log(items)
    if (items.conditions.length > 0) {
      let obj = {}
      items.conditions.forEach(item => {
        if (item.field == 'queryGroupAll') { // 需要进行拓展的变量 
          // 不按照集团查 ，则按照组织+集团进行分组            
          if(item.value.firstvalue == '0'){
            obj = {  //obj对象内oprtype为between时firstvalue,secondvalue都有值，其他情况只有firstvalue有值
              field: 'dyngroup_report',
              oprtype: '=',
              value: {firstvalue: 'groupname,finaceorgname,currname,', secondvalue: ''}
            }
          }
          // 按照集团查，则按照集团分组
          else{
            obj = {  //obj对象内oprtype为between时firstvalue,secondvalue都有值，其他情况只有firstvalue有值
              field: 'dyngroup_report',
              oprtype: '=',
              value: {firstvalue: 'groupname,currname,', secondvalue: ''}
            }
          }
                
        }
      })
      items.conditions.push(obj)    
    }
    return items
  }

   /**
  * props: props
  * searchId: 查询区需要的searchId参数
  * field: 编辑后的key
  * val: 编辑后的value
  */
 onAfterEvent(props, searchId, field, val) {
  //查询区编辑后事件
  //财务组织
  if(field == 'queryGroupAll'){
    if(val == '1'){
      props.search.setSearchValByField(searchId, 'pk_org', { value: null,display: null });  
      props.search.setDisabledByField(searchId, 'pk_org', true);  
      props.search.setRequiredByField(searchId, 'pk_org', false);  
    }else{
      // props.search.setSearchValByField(searchId, 'pk_finorg', { value: null });  
      props.search.setDisabledByField(searchId, 'pk_org', false);  
      props.search.setRequiredByField(searchId, 'pk_org', true);  
    }     
  }
}
  render () {
    return (
      <div className='table'>
        <SimpleReport showAdvBtn={true} 
        expandSearchVal={this.expandSearchVal.bind(this)}
        setDefaultVal={this.setDefaultVal.bind(this)} 
        disposeSearch={this.disposeSearch.bind(this)} 
        setConnectionSearch={this.setConnectionSearch.bind(this)} 
        onAfterEvent={this.onAfterEvent.bind(this)}/>
      </div>
    )
  }

  setConnectionSearch(transSaveObject, obj, data, props, url, urlParams, sessonKey,rowdata) {
    if (obj && obj.key) {
        if (obj.key == 'linkbill') {
          drillToBill(props, data, 'pk_bill','pk_billtypecode');
        } else {
          props.openTo(url, urlParams);
        }
    }
  }

}

ReactDOM.render(<Test/>,document.getElementById('app'))


/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/