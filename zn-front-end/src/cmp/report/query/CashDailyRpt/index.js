/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
/*
 * @Author: zhanghe 
 * @PageInfo: 现金日查询
 * @Date: 2018-07-04 12:23:05 
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { SimpleReport } from "nc-report";
import { createPage,ajax } from 'nc-lightapp-front';
class CashDailyRptQuery extends Component {
  constructor(props) {
    super(props);
  }
  /**
  *  参照过滤
  * @param {*} meta 
  * @param {*} props 
  */
  disposeSearch(meta, props) {
    //财务组织，银行账户多选
    meta['light_report'].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'pk_account').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'pk_billtype').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'pk_curr').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'systemcode').isMultiSelectedEnabled = true;

    //财务组织:全加载
    meta['light_report'].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;   
    //财务组织:全加载
    meta['light_report'].items.find((e) => e.attrcode === 'pk_account').isTreelazyLoad = false;

    //是否显示历史数据
    meta['light_report'].items.find((e) => e.attrcode === 'pk_account').showHistory = false;

    let items = meta['light_report'].items;
    items.forEach((item) => {
      item.isShowDisabledData = true;
      //财务组织
      if (item.attrcode == 'pk_org') {
        item.queryCondition = () => {
          return {
            DataPowerOperationCode: 'TMDefault',//使用权组
            funcode: '36071CDQ',
            isDataPowerEnable: 'Y',
            isTreeLazyLoad: 'false',
            TreeRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportOrgBuilder'
          };
        };
      }
      //现金账户
      if (item.attrcode == 'pk_account') {
        item.queryCondition = () => {
          let pk_org = props.search.getSearchValByField('light_report', 'pk_org').value.firstvalue; // 获取前面选中参照的值
          let pk_curr = props.search.getSearchValByField('light_report', 'pk_curr').value.firstvalue; // 获取前面选中参照的值
          return {
            pk_orgs: pk_org,
            pk_curr: pk_curr,           
            GridRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportCashAccBuilder'
          };
        };
      }

       //交易类型
       if (item.attrcode == 'pk_billtype') {
        item.queryCondition = () => {
          return {
            mode: '0',
            GridRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportBillTypeBuilder'
          };
        };
      }
    });
    return meta; // 处理后的过滤参照返回给查询区模板
  }

  /**
    * searchId: 查询区需要的searchId参数
    * 'vname': 需要附默认值的字段
    * {value: '111'}: 显示值，区间为[]，具体可以对照平台查询区修改
    * 'like': 为oprtype字段值
  */
  setDefaultVal(searchId, props) {
    //查询区默认显示字段值
    props.search.setSearchValByField(searchId, 'order', { value: 'corp' ,display:props.MutiInit.getIntl("36070REPORT") && props.MutiInit.getIntl("36070REPORT").get('36070REPORT-000008')/*'按组织排序'*/});
    // props.search.setSearchValByField(searchId, 'pk_curr', { value: '1002Z0100000000001K1',display:'人民币' }, '=');
    ajax({
      url: '/nccloud/cmp/report/orgdefault.do',
      success: (res) => {
        //查询财务组织设置默认值
        if (res.data) {
          props.search.setSearchValByField(searchId, 'pk_org', { value: res.data.value, display: res.data.display });
        }
      }
    }); 
  }

  /**
  *  //查询区编辑后事件
  * props: props
  * searchId: 查询区需要的searchId参数
  * field: 编辑后的key
  * val: 编辑后的value
  */
  onAfterEvent(props, searchId, field, val) {
    if(field=='pk_org'){
      props.search.setSearchValByField(searchId, 'pk_account', { value: null });
    }
  }


  render() {
    return (
      <div className="table">
        <SimpleReport
          showAdvBtn={true}
          setDefaultVal={this.setDefaultVal.bind(this)}
          disposeSearch={this.disposeSearch.bind(this)}
          onAfterEvent={this.onAfterEvent.bind(this)}         
        />
      </div>
    );
  }
}
CashDailyRptQuery = createPage({
	mutiLangCode: '36070REPORT'
})(CashDailyRptQuery);

export default CashDailyRptQuery;
ReactDOM.render(<CashDailyRptQuery />, document.getElementById("app"));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/