/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { SimpleReport } from 'nc-report'
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';
import { VoucherDataConst,searchId } from '../cons/constant';
import { ajax, cacheTools, toast } from 'nc-lightapp-front';
export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  // 给查询区赋默认值
  setDefaultVal(searchId, props, flag, template) {
  }
  // 参照筛选
  disposeSearch(meta, props) {
    // 参照过滤
    let items = meta['light_report'].items;
    items.forEach((item) => {
      // 资金组织
      if (item.attrcode == 'pk_org') {
        //显示停用
        item.isShowDisabledData = true;
        item.queryCondition = () => {
          return {
            funcode: '36341FDQB',
            TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
          }
        }
      }
      //根据资金组织、币种过滤业务品种
      if (item.attrcode == 'pk_varieties') {
        //显示停用
        item.isShowDisabledData = true;
        item.queryCondition = () => {
          return {
            pk_org:(props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
            pk_currtype:(props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
            GridRefActionExt: 'nccloud.web.ifac.centerinterestsummary.filter.NCCPkVarietiesFilter'
          }
        }
      }
      // 过滤有权限的并且存在存款代理关系的存款单位
      if (item.attrcode == 'pk_depositorg') {
        //显示停用
        item.isShowDisabledData = true;
        item.queryCondition = () => {
          return {
            pk_org:(props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
            TreeRefActionExt: 'nccloud.web.ifac.centerinterestsummary.filter.NCCPkDepositorgFilter'
          }
        } 
      }
       // 过滤有权限的并且存在存款代理关系的存款单位,没找到pk_depositcode，先用pk_depositreceipt
       if (item.attrcode == 'pk_depositreceipt') {
        //显示停用
        item.isShowDisabledData = true;
        item.queryCondition = () => {
          return {
            pk_org:(props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
            pk_depositorg:(props.search.getSearchValByField(searchId, 'pk_depositorg') || {}).value.firstvalue,
            pk_currtype:(props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
            GridRefActionExt: 'nccloud.web.ifac.centerinterestsummary.filter.NCCPkDepositreceiptFilter'
          }
        }
      }
      //根据资金组织、存款单位过滤清单编号
      if (item.attrcode == 'pk_interest') {
        //显示停用
        item.isShowDisabledData = true;
        item.queryCondition = () => {
          return {
            pk_org:(props.search.getSearchValByField("light_report", 'pk_org') || {}).value.firstvalue,
            pk_depositorg:(props.search.getSearchValByField(searchId, 'pk_depositorg') || {}).value.firstvalue,
            pk_currtype:(props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
            GridRefActionExt: 'nccloud.web.ifac.centerinterestsummary.filter.NCCPkInterestFilter'
          }
        }
      }
    });

    return meta; // 处理后的过滤参照返回给查询区模板
  }
  /**
   * 
   * @param  items: 查询区查询数据，如需拓展查询区参数，请返回与items相同格式的查询数据
   */
  expandSearchVal(items) {
    return items
  }

  /**
  * props: props
  * searchId: 查询区需要的searchId参数
  * field: 编辑后的key
  * val: 编辑后的value
  */
  onAfterEvent(props, searchId, field, val) {
  }

  render() {
    return (
      <div className='table'>
        <SimpleReport
          showAdvBtn={true} //对查询区高级按钮是否显示的拓展
          expandSearchVal={this.expandSearchVal.bind(this)}
          disposeSearch={this.disposeSearch.bind(this)}
          setDefaultVal={this.setDefaultVal.bind(this)}
          setConnectionSearch={this.setConnectionSearch.bind(this)}//对联查报表时进行的拓展
          onAfterEvent={this.onAfterEvent.bind(this)} />
      </div>
    )
  }

  setConnectionSearch(transSaveObject, obj, data, props, url, urlParams, sessonKey) {
    if (obj.key == 'linkbill') {
      drillToBill(props, data, 'pk_sourcebill', 'billtype');
    }

  }
}

ReactDOM.render(<Test />, document.getElementById('app'))
/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/