/* 
  付款登记卡片页
*/
import { createPage, promptBox, toast } from "nc-lightapp-front";
import React, { Component } from "react";
import {
  API_URL,
  billtype,
  rateType,
  CARD,
  DATA_SOURCE,
  LinkConfig,
  LIST,
  MODULE_ID,
  PUB_MULTILANG,
  mutliLangKey,
  nodekey,
  PullBillConfig,
} from "../cons/constant.js";
import {
  tabsRule,
  beforeEvent,
  bodyButtonClick,
  initTemplate,
  state4headBtns,
  state4innerBtns,
  state4tableBtns,
  state4sideModalBtns,
  itemsRule,
  saveBill,
} from "./events";
import BaseCard from "../../../public/components/BaseCard";
import { sceneInfo } from "../../../public/container/utils";

// 溢短装金额校验
function checkIsoverflow(data) {
  let { FormConfig, form: formUtil } = this.props;
  let flag = true;
  // 溢短装
  let isoverflow = formUtil.getFormItemsValue(
    FormConfig.formId,
    "pk_register.isoverflow"
  );
  // 上浮比例
  let overscale = formUtil.getFormItemsValue(
    FormConfig.formId,
    "pk_register.overscale"
  );
  // 下浮比例
  let lowscale = formUtil.getFormItemsValue(
    FormConfig.formId,
    "pk_register.lowscale"
  );
  // 信用证金额
  let lcamount = formUtil.getFormItemsValue(
    FormConfig.formId,
    "pk_register.lcamount"
  );
  // 付款金额
  let payamount = formUtil.getFormItemsValue(
    FormConfig.formId,
    "pk_register.pay"
  );
  // 本次支付总金额
  let thispayamt = formUtil.getFormItemsValue(
    FormConfig.formId,
    "thispayamt"
  );
  let overlcamount = lcamount.value * (overscale.value / 100 + 1);
  let lowlcamount = lcamount.value * (1 - lowscale.value / 100);
  let totalpayamount = (payamount.value == null ? 0 : payamount.value) + thispayamt.value;
  if(isoverflow && isoverflow.value === "Y"){
    if(totalpayamount > overlcamount){
      flag = false;
      promptBox({
        color: "warning",
        content: this.state.baseMultiLangData[
          "361701PR-000010"
        ]  + overscale.value + "%" + 
          this.state.baseMultiLangData["361701PR-000011"]
        /* 国际化处理： 信用证累计支付总金额超过信用证金额*（1+{0}%），是否保存？*/,
        beSureBtnClick: () => { //子表校验通过，校验主表溢短装
          saveBill.call(this, this.name, this.url, true);
        },
        cancelBtnClick: () => {
          flag = false;
        }
      });
    }
  }else{
    if(totalpayamount > lcamount){
      flag = false;
      promptBox({
        color: "warning",
        content: this.state.baseMultiLangData[
          "361701PR-000012"
        ] /* 国际化处理： 信用证累计支付总金额超出信用证金额，是否保存？*/,
        beSureBtnClick: () => { //子表校验通过，校验主表溢短装
          saveBill.call(this, this.name, this.url, true);
        },
        cancelBtnClick: () => {
          flag = false;
        }
      });
    }
  }
  if(flag == true){
    saveBill.call(this, this.name, this.url, true);
  }
  return flag;
};
class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      multiLang: {}, // 多语文件 Object
      inlt: null, // 可用来进行占位符的一些操作 Object
    };
  }

  componentWillMount() {
    this.props.MultiInit.getMultiLang({
      moduleId: mutliLangKey,
      domainName: MODULE_ID,
      callback: this.multiLangCallback.bind(this),
    });
  }

  /**
   * 多语加载成功回调函数
   * @param {*} multiLang 多语文件
   * @param {*} status 请求状态
   * @param {*} inlt 占位符
   */

  multiLangCallback(multiLang, status, inlt) {
    if (status) {
      this.setState({ multiLang, inlt });
    } else {
      console.log(
        this.state.multiLang["361701PR-000006"]
      ); /* 国际化处理： 未加载到本页面多语资源 */
    }
  }

  /**
   * 保存前事件
   * @param {Object} data - 整单数据 保存前传入的参数
   */
  saveBefore(data) {
    // ... 可以进行一些操作 比如数据拼装
    // 必须返回data
    return data;
  }

  /**
   * 保存成功后事件
   * @param {String} data - 保存成功后返回的数据
   */
  saveAfter(data) {
    // ... 可以对请求返回的数据进行一些操作 比如数据拼装
    // 必须返回data
    return data;
  }

  /**
   * 自定义主子表数据校验
   * @param {Object} data - 要校验的主子表数据
   */
  handelVerificate(data) {
    //标志位 true为校验通过
    let flag = true;
    let tableValues = data.bodys;
    let lines = new Array();
    // 遍历合同信息子表数据
    tableValues.contractinfo.rows
      .map((item) => {
        let { values } = item;
        // 付款金额
        let payamount = values.payamount && values.payamount.value;
        // 到货金额
        let arrivalamnt = values.arrivalamnt && values.arrivalamnt.value;
        // 序号
        let numberindex = values.numberindex && values.numberindex.value;
        // 到货金额与付款金额不相等
        if(payamount != arrivalamnt){
          flag = false;
          lines.push(numberindex);
        }
      });
    if(flag == false){
      promptBox({
        color: "warning",
        content: this.state.baseMultiLangData[
          "361701PR-000008"
        ] + lines + 
        this.state.baseMultiLangData[
          "361701PR-000009"
        ]/* 国际化处理： 表体第lineNum行到货金额与付款金额不相等，是否保存？*/,
        beSureBtnClick: () => { //子表校验通过，校验主表溢短装
          //溢短装金额校验
          flag = checkIsoverflow.call(this, data);
        },
        cancelBtnClick: () => {
          return false;
        }
      });
    } else { //子表无需校验，校验主表溢短装
      //溢短装金额校验
      flag = checkIsoverflow.call(this,data);
    }
    return false; //必须返回false，否则回发两次请求
  }

  // 复制时主子表事件处理函数
  handleCopy() {}

  // 变更时主子表事件处理函数
  handleChange() {}

  render() {
    let { multiLang } = this.state;
    let pageTitle = multiLang["361701PR-000000"]; /* 国际化处理： 付款登记 */
    // 单据场景信息获取 (页面 ID 、是否联查场景以及页面模板)
    let { initTemplateFun, pageId, currentScene } = 
    sceneInfo.call(this, { 
      page_id: CARD.page_id, 
      page_id_link: CARD.page_id_link, 
      page_id_approve: CARD.page_id_approve, 
      initTemplate 
    });
    return (
      <BaseCard
        BillConfig={{
          pageId: pageId, // 页面编码
          ListPageCode: LIST.page_id, // 列表页面编码
          pageTitle: pageTitle, // 节点标题
          moduleId: MODULE_ID, // 所属模块
          pub_multilang: PUB_MULTILANG, // 模块公共多语key
          mutliLangKey: mutliLangKey, // 本模块多语key
          billNo: CARD.billNo, // 单据编号
          API_URL: API_URL, //接口地址
          nodekey: nodekey, //打印输出编码
          primaryId: CARD.primary_id, // 主键ID
          billtype: billtype, //单据类型，联查审批详情需要
          initTemplate: initTemplateFun, // 初始化模板
          dataSource: DATA_SOURCE, // 缓存key
          rateType: rateType, //汇率字段
        }}
        PullBillConfig={PullBillConfig} // 拉单配置
        BtnConfig={{
          btnArea: CARD.head_btn_code, // 表头按钮区域编码
          btnsRule: state4headBtns, // 表头按钮可用规则
        }}
        FormConfig={{
          formId: CARD.form_id, // 主表区域编码
          paymentinfo: CARD.paymentinfo_id //主表付款信息编码
        }}
        TreeConfig={{
          treeId: CARD.treeId, // 版本树id
          needSearch: false, // 是否需要查询框
          defaultExpandAll: true, // 默认展开所有节点
          disabledSearch: true, // 是否显示搜索框
        }}
        TabsConfig={{
          tabOrder: CARD.tab_order, // tab排序
          tabsRule: tabsRule, // 多子表页签规则
          btnArea: CARD.shoulder_btn_code, // 表体tab区域肩部区域按钮code
          btnsRule: state4tableBtns, // 子表肩部按钮可用规则
        }}
        TableConfig={{
          tableCode: CARD.tab_code, // 子表区域编码
          tableId: CARD.tab_id, //表体主键
          showOpr: true, // 是否添加列表操作列
          btnArea: CARD.body_btn_code, // 表格操作列中按钮区域
          btnsRule: state4innerBtns, // 表格操作列中按钮可用规则
          tableType: CARD.table_type, // 子表类型
        }}
        SideModalConfig={{
          btnsRule: state4sideModalBtns, // 侧拉弹框按钮可用规则
        }}
        LinkConfig={LinkConfig} // 联查配置
        // _beforeEvent={beforeEvent} // 主表编辑前函数
        _itemsRule={itemsRule} // 主子表字段规则
        _bodyButtonClick={bodyButtonClick} // 子表行内按钮函数
        _saveBefore={this.saveBefore} // 保存前事件处理函数
        _saveAfter={this.saveAfter} // 保存后事件处理函数
        _handelVerificate={this.handelVerificate} // 自定义主子表数据校验
        _templateInited={this.templateInited} // 模板加载后事件处理函数
        _handleCopy={this.handleCopy} // 复制时主表编辑性
        _handleChange={this.handleChange} // 变更时主子表事件处理函数
        {...this.props}
      />
    );
  }
}

Card = createPage({
  billinfo: {
    billtype: "extcard",
    pagecode: CARD.page_id,
    headcode: CARD.form_id,
    bodycode: ["contractinfo"],
  },
})(Card);
export default Card;
