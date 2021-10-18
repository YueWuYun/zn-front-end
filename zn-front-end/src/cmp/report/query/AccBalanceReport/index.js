/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
/*
 * @Author: zhanghe
 * @PageInfo: 账户余额查询
 * @Date: 2018-07-04 12:23:05 
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { SimpleReport } from "nc-report";
import { createPage, ajax } from 'nc-lightapp-front';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';
class AccBalanceReport extends Component {
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
    // meta['light_report'].items.find((e) => e.attrcode === 'pk_account').isMultiSelectedEnabled = true;
    // meta['light_report'].items.find((e) => e.attrcode === 'pk_billtype').isMultiSelectedEnabled = true;
    // meta['light_report'].items.find((e) => e.attrcode === 'pk_curr').isMultiSelectedEnabled = true;

    //财务组织:全加载
    meta['light_report'].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

    let items = meta['light_report'].items;
    items.forEach((item) => {
      item.isShowDisabledData = true;
      //财务组织
      if (item.attrcode == 'pk_org') {
        item.queryCondition = () => {
          return {
            DataPowerOperationCode: 'TMDefault',//使用权组
            funcode: '36071BDDB',
            isDataPowerEnable: 'Y',
            TreeRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportOrgBuilder'
          };
        };
      }
      //银行账户
      if (item.attrcode == 'pk_account') {
        item.queryCondition = () => {
          let pk_org = props.search.getSearchValByField('light_report', 'pk_org').value.firstvalue; // 获取前面选中参照的值
          let pk_curr = props.search.getSearchValByField('light_report', 'pk_curr').value.firstvalue; // 获取前面选中参照的值
          return {
            pk_org: pk_org,
            pk_curr: pk_curr,
            refnodename: props.MutiInit.getIntl("36070REPORT") && props.MutiInit.getIntl("36070REPORT").get('36070REPORT-000000'),/* 国际化处理： 使用权参照*/
            GridRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportBankSubAccBuilder',
            noConditionOrg:'Y'
          };
        };
      }
      //交易类型
      if (item.attrcode == 'pk_billtype') {
        item.queryCondition = () => {
          return {
            mode: '0',
            TreeRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportBillTypeBuilder'
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
    if (field == 'pk_org') {
      props.search.setSearchValByField(searchId, 'pk_account', { value: null });
    }
  }

  /**
    * transSaveObject: transSaveObject参数
    * obj: 点击的联查item信息
    * data: 联查需要的参数
    * props: 平台props
    * url: 平台openTo第一个参数
    * urlParams: 平台openTo第二个参数
    * sessonKey: sessionStorage的key
  */
  setConnectionSearch(transSaveObject, obj, data, props, url, urlParams, sessonKey) {
    if (obj.key == '0001') {
      drillToBill(props, data, 'pk_bill', 'billtype_');
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
          setConnectionSearch={this.setConnectionSearch.bind(this)}
        />
      </div>
    );
  }
}
AccBalanceReport = createPage({
  mutiLangCode: '36070REPORT'
})(AccBalanceReport);

export default AccBalanceReport;
ReactDOM.render(<AccBalanceReport />, document.getElementById("app"));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/