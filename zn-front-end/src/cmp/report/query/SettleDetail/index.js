/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
/*
 * @Author: shixin6 
 * @PageInfo: 结算明细查询
 * @Date: 2018-07-10 12:23:05 
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { SimpleReport } from "nc-report";
import { createPage, ajax, base } from 'nc-lightapp-front';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';
let { NCMessage } = base;
class BSettleDetailQuery extends Component {
  constructor(props) {
    super(props);
  }
  /**
  *  参照过滤
  * @param {*} meta 
  * @param {*} props 
  */
  disposeSearch(meta, props) {
    //多选：票据类型_维度，结算方式_维度，银行账户_维度,现金账户_维度，交易类型，币种，资金计划项目_维度，业务组织_维度，结算方式，
    meta['light_report'].items.find((e) => e.attrcode === 'notetype').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'balatype').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'bankaccount').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'cashaccount').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'pk_curr').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'pk_billtype').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'fundplan').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'busiorg').isMultiSelectedEnabled = true;
    meta['light_report'].items.find((e) => e.attrcode === 'cmp_bankaccdetail.pk_balancetype').isMultiSelectedEnabled = true;

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
            funcode: '36071BDDQ',
            isDataPowerEnable: 'Y',
            TreeRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportOrgBuilder'
          };
        };
      }
      //银行账户
      if (item.attrcode == 'bankaccount') {
        item.queryCondition = () => {
          let pk_org = props.search.getSearchValByField('light_report', 'pk_org').value.firstvalue; // 获取前面选中参照的值
          return {
            pk_org: pk_org,
            pk_curr: null,
            refnodename: props.MutiInit.getIntl("36070REPORT") && props.MutiInit.getIntl("36070REPORT").get('36070REPORT-000000'),/* 国际化处理： 使用权参照*/
            GridRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportBankSubAccBuilder',
            noConditionOrg:'Y'
          };
        };
      }
      //现金账户
      if (item.attrcode == 'cashaccount') {
        item.queryCondition = () => {
          let pk_org = props.search.getSearchValByField('light_report', 'pk_org').value.firstvalue; // 获取前面选中参照的值
          return {
            pk_org: pk_org
          };
        };
      }
      //资金计划项目
      if (item.attrcode == 'fundplan') {
        item.queryCondition = () => {
          let pk_org = props.search.getSearchValByField('light_report', 'pk_org').value.firstvalue; // 获取前面选中参照的值
          return {
            pk_org: pk_org
          };
        };
      }
      //业务组织
      if (item.attrcode == 'busiorg') {
        item.queryCondition = () => {
          let pk_org = props.search.getSearchValByField('light_report', 'pk_org').value.firstvalue; // 获取前面选中参照的值
          return {
            pk_org: pk_org
          };
        };
      }
      //对象内容
      if (item.attrcode == 'objvalue') {
        item.queryCondition = () => {
          let pk_org = props.search.getSearchValByField('light_report', 'pk_org').value.firstvalue; // 获取前面选中参照的值
          let objtype = props.search.getSearchValByField('light_report', 'objtype').value.firstvalue;

          if (objtype == 2) {//部门
            return {
              pk_org: pk_org,
              TreeRefActionExt: 'nccloud.web.cmp.report.refbuilder.CMPReportDepartmentBuilder'
            };
          } else if (objtype == 3) {//个人
            return {
              pk_org: pk_org,
              enablestate: 2,
            };
          } else {
            return {
              pk_org: pk_org
            };
          }

        };
      }
      //收支项目_维度
      if (item.attrcode == 'costsubj') {
        item.queryCondition = () => {
          let pk_org = props.search.getSearchValByField('light_report', 'pk_org').value.firstvalue; // 获取前面选中参照的值
          return {
            pk_org: pk_org
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
   * 查询区默认显示字段值
   * @param {*} searchId 
   * @param {*} props 
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
  * props: props
  * searchId: 查询区需要的searchId参数
  * field: 编辑后的key
  * val: 编辑后的value
  */
  onAfterEvent(props, searchId, field, val) {
    //查询区编辑后事件
    if (field === 'objtype') {
      let meta = props.meta.getMeta();
      // props.form.setFormItemsDisabled(searchId, { 'objvalue': false });
      props.search.setDisabledByField(searchId,'objvalue',false);
      props.search.setSearchValByField(searchId, 'objvalue');
      let item = meta[searchId].items.find(e => e.attrcode === 'objvalue');
      if (val == '1') {//客商
        item.refcode = 'uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
      } else if (val == '2') {//部门
        item.refcode = 'uapbd/refer/org/DeptTreeRef/index.js';
      } else if (val == '3') {//个人
        item.refcode = 'uapbd/refer/psninfo/PsndocTreeGridRef/index.js';
      } else if (val == '4') {//散户
        item.refcode = 'uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
        // item.refcode = 'uapbd/refer/customer/FreeCustGridRef/index.js';
      } else if (val == '5') {//银行
        item.refcode = 'uapbd/refer/bankacc/BankDocDefaultGridTreeRef/index.js';
      } else if (val == '6') {//财务组织
        item.refcode = 'uapbd/refer/org/FinanceOrgTreeRef/index.js';
      }
      props.renderItem('search', searchId, 'objvalue', null);
      props.meta.setMeta(meta);
    }
    //财务组织
    if (field === 'pk_org') {
      props.search.setSearchValByField(searchId, 'bankaccount', { value: null });
      props.search.setSearchValByField(searchId, 'costsubj', { value: null });
      props.search.setSearchValByField(searchId, 'busiorg', { value: null });
      props.search.setSearchValByField(searchId, 'fundplan', { value: null });
      props.search.setSearchValByField(searchId, 'cashaccount', { value: null });
    }
  }

  /**
    * 
    * items: 查询区查询数据，如需拓展查询区参数，请返回与items相同格式的查询数据
   */
  expandSearchVal(items) {
    let arr = [];
    if (items.conditions && items.conditions.length > 0) {
      items.conditions.forEach((item) => {
        if (item.field == 'costsubj' || item.field == 'notetype' || item.field == 'balatype' || item.field == 'bankaccount' || item.field == 'transtype'
          || item.field == 'fundsflag' || item.field == 'fundformcode' || item.field == 'cashaccount' || item.field == 'fundplan' || item.field == 'busiorg') {
          if (typeof (item.value.firstvalue) != "undefined") {
            arr.push(item.field);
          }
        }
      });
    }
    if (arr.length == 0) {
      NCMessage.create({ content: this.props.MutiInit.getIntl("36070REPORT") && this.props.MutiInit.getIntl("36070REPORT").get('36070REPORT-000002'), color: 'warning' });/* 国际化处理： 至少选择一个查询维度！*/
      return;
    } else if (arr.length > 5) {
      NCMessage.create({ content: this.props.MutiInit.getIntl("36070REPORT") && this.props.MutiInit.getIntl("36070REPORT").get('36070REPORT-000003'), color: 'warning' });/* 国际化处理： 查询维度不得多于5个！*/
      return;
    }
    return items;
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
        <SimpleReport showAdvBtn={true}
          setDefaultVal={this.setDefaultVal.bind(this)}
          disposeSearch={this.disposeSearch.bind(this)}
          expandSearchVal={this.expandSearchVal.bind(this)}
          onAfterEvent={this.onAfterEvent.bind(this)}
          setConnectionSearch={this.setConnectionSearch.bind(this)}
        />
      </div>
    );
  }
}

BSettleDetailQuery = createPage({
  mutiLangCode: '36070REPORT'
})(BSettleDetailQuery);
export default BSettleDetailQuery;
ReactDOM.render(<BSettleDetailQuery />, document.getElementById("app"));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/