/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { SimpleReport } from 'nc-report'
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';
import {searchId, } from '../cons/constant';
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
    meta[searchId].items.find((e) => e.attrcode === 'pk_currtype').isMultiSelectedEnabled = true;
    meta[searchId].items.find((e) => e.attrcode === 'pk_depositbank').isMultiSelectedEnabled = true;
    meta[searchId].items.find((e) => e.attrcode === 'pk_depositcode').isMultiSelectedEnabled = true;
    meta[searchId].items.find((e) => e.attrcode === 'pk_varieties').isMultiSelectedEnabled = true;
    // 参照过滤
    let items = meta[searchId].items;
    items.forEach((item) => {
      // 财务组织
      if (item.attrcode == 'pk_org') {
        //显示停用
        item.isShowDisabledData = true;
        item.queryCondition = () => {
          return {
            funcode: '36141FDQB',
            TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
          }
        }
      }
      // 过滤有权限的并且存在存款代理关系的存款单位,没找到pk_depositcode，先用pk_depositreceipt
      if (item.attrcode == 'pk_depositcode') {
        //显示停用 
        item.isShowDisabledData = true;
        item.queryCondition = () => {
          return {
            pk_org:(props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
            pk_depositbank:(props.search.getSearchValByField(searchId, 'pk_depositbank') || {}).value.firstvalue,
            pk_currtype:(props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
            GridRefActionExt: 'nccloud.web.fac.bankdepositbillsum.filter.NCCPkDepositreceiptFilter'
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
          onAfterEvent={this.onAfterEvent.bind(this)}
          getRowData={this.getRowData.bind(this)} />
      </div>
    )
  }
  getRowData(data, coords) {

  }

  setConnectionSearch(transSaveObject, obj, data, props, url, urlParams, sessonKey) {
    let linkpath;
    //默认回调
    let defaultCallBack = (res) => {
      if (res.success) {
        // let pagecode = '36140FDIB_C01';
        let appcode = '36140FDIB';
        let pks2=res.data;
        if(res.data.length===1){
          linkpath='/ifac/facbankinterestdeal/bankcenterinterestbill/main/#/card';
          props.openTo(linkpath, {
            appcode,
            pagecode:'36140FDIB_C01',
            islinkquery:true,
            pks:pks2,
            type: 'intercard',
          });
        }else{
          linkpath='/ifac/facbankinterestdeal/bankcenterinterestbill/main/#/list';
          props.openTo(linkpath, {
            appcode,
            pagecode:'36140FDIB_L01',
            islinkquery:true,
            pks2,
            type: 'interlist',
          });
        }
        
      }
    };
    let mm=data.querycondition.conditions;
    mm.map(function(items){
      if(items.field==="groupCondition"){
          data["groupCondition"]=items.value.firstvalue;
      }
    });
    data["pk_billtypecode"]="36EJ";
    ajax({
      url: '/nccloud/ifac/report/drillquery.do',
      data: data,
      method: 'post',
      success: defaultCallBack
    });

  }
}

ReactDOM.render(<Test />, document.getElementById('app'))
/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/