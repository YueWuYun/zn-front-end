/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { SimpleReport } from 'nc-report'
import { ajax, toast,cacheTools } from 'nc-lightapp-front';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';


export default class Test extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  setDefaultVal(searchId,props,flag,template) {
    let meta =template.template;
    let org_Name=template.context.org_Name;
    let pk_org=template.context.pk_org;
    meta['light_report'].items.map((item) => {
      if (item.attrcode == 'pk_org') {
          item.initialvalue = { 'display': org_Name, 'value': pk_org }
      }
    });
    
  }

  disposeSearch (meta, props) {
    let items = meta['light_report'].items
    items.forEach((item) => {      
      if(item.attrcode == 'pk_finorg') {
        item.queryCondition = () => {
          return {
            funcode:'36181BPLD',
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
    // // 变量赋值拓展
    // console.log(items)
    // if (items.length > 0) {
    //   items.forEach(item => {
    //     if (item.field == 'user_name') { // 需要进行拓展的变量
    //       if (item.value.firstvalue == '11') {
    //         let obj = {  //obj对象内oprtype为between时firstvalue,secondvalue都有值，其他情况只有firstvalue有值
    //           field: 'user_other',
    //           oprtype: 'like',
    //           value: {firstvalue: '111', secondvalue: '222'}
    //         }
    //         items.push(obj)
    //       }
    //     }
    //   })
    // }
    return items
  }

   /**
  * props: props
  * searchId: 查询区需要的searchId参数
  * field: 编辑后的key
  * val: 编辑后的value
  */
 onAfterEvent(props, searchId, field, val) {
//   //查询区编辑后事件
//   //财务组织
//   if(field == 'pk_org'){
//     props.search.setSearchValByField(searchId, 'protocolcode', { value: null });   
//   }
//   //开户组织
//   if(field == 'pk_creditbank'){
//     props.search.setSearchValByField(searchId, 'protocolcode', { value: null });   
//   }
//   //币种
//   if(field == 'pk_currtype'){
//     props.search.setSearchValByField(searchId, 'protocolcode', { value: null });   
//   }
//   //币种
//   if(field == 'protocolstatus'){
//     props.search.setSearchValByField(searchId, 'protocolcode', { value: null });   
//   }
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