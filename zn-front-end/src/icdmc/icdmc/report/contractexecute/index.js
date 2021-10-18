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
      item.isShowDisabledData = true;
      //合同编号
      if (item.attrcode == 'pk_contract_icdmc') {
        // 如果user_name的参照需要根据前面选中参照的值进行过滤
        item.queryCondition = () => {
          // 添加过滤方法
          let data = props.search.getSearchValByField('light_report', 'pk_financorg'); // 获取前面选中参照的值
          let data1 = props.search.getSearchValByField('light_report', 'pk_org');
          let data2 = props.search.getSearchValByField('light_report', 'pk_currtype');
          // let data4 = props.search.getSearchValByField('light_report', 'busidate');
          data = (data && data.value && data.value.firstvalue) || ''; // 获取value
          data1 = (data1 && data1.value && data1.value.firstvalue) || ''; // 获取value
          data2 = (data2 && data2.value && data2.value.firstvalue) || ''; // 获取value
          // data4 = (data4 && data4.value && data4.value.firstvalue) || ''; // 获取value
          return {
            pk_org: data1,
            pk_financorg: data,
            pk_currtype: data2,
            isquery: 'TRUE',
            
            GridRefActionExt: 'nccloud.web.icdmc.icdmc.report.filter.ContractGridRefFilter'
          }
        
        }
        item.isMultiSelectedEnabled = true;
      }
      //放款编号
      if (item.attrcode == 'financepayno') {
        // 如果user_name的参照需要根据前面选中参照的值进行过滤
        item.queryCondition = () => {
          // 添加过滤方法
          let data = props.search.getSearchValByField('light_report', 'pk_contract_icdmc'); // 获取前面选中参照的值
          let data1 = props.search.getSearchValByField('light_report', 'pk_financorg'); // 获取前面选中参照的值
          let data2 = props.search.getSearchValByField('light_report', 'pk_org');
          let data3 = props.search.getSearchValByField('light_report', 'pk_currtype');
          data = (data && data.value && data.value.firstvalue) || ''; // 获取value
          data1 = (data1 && data1.value && data1.value.firstvalue) || ''; // 获取value
          data2 = (data2 && data2.value && data2.value.firstvalue) || ''; // 获取value
          data3 = (data3 && data3.value && data3.value.firstvalue) || ''; // 获取value
          return {
            contractno:data,
            pk_org:data2,
            pk_financorg:data1,
            pk_currtype:data3,
            GridRefActionExt: 'nccloud.web.icdmc.icdmc.report.filter.FinancepayGridRefFilter'
          }
        
        }
        item.isMultiSelectedEnabled = true;
      }
      
    });
    
    return meta; // 处理后的过滤参照返回给查询区模板
  }
  /**
   * 
   * @param  items: 查询区查询数据，如需拓展查询区参数，请返回与items相同格式的查询数据
   */
  expandSearchVal (items) {
    // 变量赋值拓展
    //console.log(items)
    if (items.length > 0) {
      items.forEach(item => {
        if (item.field == 'user_name') { // 需要进行拓展的变量
          if (item.value.firstvalue == '11') {
            let obj = {  //obj对象内oprtype为between时firstvalue,secondvalue都有值，其他情况只有firstvalue有值
              field: 'user_other',
              oprtype: 'like',
              value: {firstvalue: '111', secondvalue: '222'}
            }
            items.push(obj)
          }
        }
      })
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
  if(field == 'pk_org'){
    props.search.setSearchValByField(searchId, 'pk_contract_icdmc', { value: null });
    props.search.setSearchValByField(searchId, 'financepayno', { value: null });    
  }
  //借款单位
  if(field == 'pk_financorg'){
    props.search.setSearchValByField(searchId, 'pk_contract_icdmc', { value: null });
    props.search.setSearchValByField(searchId, 'financepayno', { value: null });     
  }
  //币种
  if(field == 'pk_currtype'){
    props.search.setSearchValByField(searchId, 'pk_contract_icdmc', { value: null });
    props.search.setSearchValByField(searchId, 'financepayno', { value: null });     
  }
  // 业务日期
  if(field == 'pk_contract_icdmc'){
    props.search.setSearchValByField(searchId, 'financepayno', { value: null });    
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
        //判断是选中的合同吗，如果是，就联查合同
        if(data.column==1) {
          data.column='4';
          drillToBill(props, data, 'pk_contract_icdmc','contractbilltypecode');
        }else {
          drillToBill(props, data, 'pk_billid','pk_billtypecode');
        }
        
      }
    }
   
  }

}

ReactDOM.render(<Test/>,document.getElementById('app'))


/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/