/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
/*
 * @Author: zhanghe
 * @PageInfo: 资金余额序时汇总查询
 * @Date: 2019年3月6日13:40:58
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { SimpleReport } from "nc-report";
import { createPage,ajax, base } from 'nc-lightapp-front';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';
let { NCMessage } = base;
class BalanceSequence extends Component {
  constructor(props) {
    super(props);
  }

  disposeSearch(meta, props) {   
    meta['light_report'].items.find((e) => e.attrcode === 'pk_orgs').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'pk_currtypes').isMultiSelectedEnabled = true;
   
    //财务组织:全加载
    meta['light_report'].items.find((e) => e.attrcode === 'pk_orgs').isTreelazyLoad = false;
    meta['light_report'].items.find((e) => e.attrcode === 'pk_currtypes').isTreelazyLoad = false;


    let items = meta['light_report'].items;
    items.forEach((item) => {
      item.isShowDisabledData = true;
    //财务组织
    if (item.attrcode == 'pk_orgs') {
      item.queryCondition = () => {
        return {
         DataPowerOperationCode: 'TMDefault',//使用权组
         funcode: '36071FBSGQ',
          isDataPowerEnable: 'N',
         TreeRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportOrgBuilder',
         noConditionOrg:'Y'
        };
      };
    }    
     });
    return meta; // 处理后的过滤参照返回给查询区模板
  }

   /**
    * 
    * items: 查询区查询数据，如需拓展查询区参数，请返回与items相同格式的查询数据
   */
  expandSearchVal(items) {
    // let arr = [];
    // if (items && items.length > 0) {
    //   items.forEach((item) => {
    //     if (item.field == 'begin' || item.field == 'end' ) {
    //       if (typeof (item.value.firstvalue) != "undefined") {
    //         arr.push(item.field);
    //       }
    //     }
    //   });
    // }
    // if (arr.length < 2) {
    //   NCMessage.create({ content: this.props.MutiInit.getIntl("36070REPORT") && this.props.MutiInit.getIntl("36070REPORT").get('36070REPORT-000001'), color: 'warning' });/* 国际化处理： 开始日期,结束日期 不允许为空！*/
    //   return;
    // }
    return items;
  }

    /**
    * searchId: 查询区需要的searchId参数
    * 'vname': 需要附默认值的字段
    * {value: '111'}: 显示值，区间为[]，具体可以对照平台查询区修改
    * 'like': 为oprtype字段值
  */
 setDefaultVal(searchId, props) {
  ajax({
    url: '/nccloud/cmp/report/orgdefault.do',
    success: (res) => {
      //查询财务组织设置默认值
      if (res.data) {
        props.search.setSearchValByField(searchId, 'pk_org', { value: res.data.value, display: res.data.display });
      }
    }
  });
  props.search.setSearchValByField(searchId, 'showModel', { value: 0, display: props.MutiInit.getIntl("36070REPORT") && props.MutiInit.getIntl("36070REPORT").get('36070REPORT-000004')/*'分别显示'*/ });
  props.search.setSearchValByField(searchId, 'sort', { value: 1, display: props.MutiInit.getIntl("36070REPORT") && props.MutiInit.getIntl("36070REPORT").get('36070REPORT-000005')/*'按币种排序'*/ });
  props.search.setDisabledByField(searchId,'showModel',true);
  props.search.setDisabledByField(searchId, 'sort',true);
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
   if(field === 'pk_orgs'){
    let pk_orgs = props.search.getSearchValByField(searchId,'pk_orgs');    
    let pkorgs = pk_orgs.value.firstvalue.split(',');
    if(pkorgs.length>1){
      props.search.setDisabledByField(searchId,'showModel',false);
      props.search.setDisabledByField(searchId, 'sort',false);
    }else{
      props.search.setDisabledByField(searchId,'showModel',true);
      props.search.setDisabledByField(searchId, 'sort',true);
      
    }
  }
}
 

  render() {
    return (
      <div className="table">
        <SimpleReport  
          setDefaultVal={this.setDefaultVal.bind(this)}
          disposeSearch={this.disposeSearch.bind(this)}
          expandSearchVal={this.expandSearchVal.bind(this)}
          onAfterEvent={this.onAfterEvent.bind(this)}
          showAdvBtn={true}
        />
      </div>
    );
  }
}
BalanceSequence = createPage({
	mutiLangCode: '36070REPORT'
})(BalanceSequence);

export default BalanceSequence;
ReactDOM.render(<BalanceSequence />, document.getElementById("app"));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/