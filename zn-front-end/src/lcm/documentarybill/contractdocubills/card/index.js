/* 
  押汇合同卡片页
*/
import { createPage, promptBox, toast } from "nc-lightapp-front";
import React, { Component } from "react";
import {
  API_URL,
  billtype,
  CARD,
  DATA_SOURCE,
  PULL_DATA_SOURCE,
  PULL_ARR_DATA_CACHE,
  PULL_SUB_DATA_CACHE,
  LinkConfig,
  LIST,
  MODULE_ID,
  PUB_MULTILANG,
  mutliLangKey,
  nodekey,
  PullBillConfig
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
        this.state.multiLang["361703DBC-000006"]
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
    let flag = true;
    return flag;
  }

  // 复制时主子表事件处理函数
  handleCopy() {}

  // 变更时主子表事件处理函数
  handleChange() {}
  // 获取拉单数据缓存
  getPullDataSourceInfo = () => {
    let name = this.props.getUrlParam("name");
    let pullDataSource = PULL_DATA_SOURCE;
    let pullPrimaryId = LIST.pk_apply;
    if (name === "Arrival") {
      pullDataSource = PULL_ARR_DATA_CACHE;
      pullPrimaryId = LIST.pk_arrival;
    } else if (name === "Submission") {
      pullDataSource = PULL_SUB_DATA_CACHE;
      pullPrimaryId = LIST.pk_submissionregister;
    }
    return {
      pullDataSource,
      pullPrimaryId
    };
  };
  render() {
    let { multiLang } = this.state;
    let pageTitle = multiLang["361703DBC-000000"]; /* 国际化处理： 押汇合同 */
    // 不同场景下 页面 ID 及页面模板
       // 单据场景信息获取 (页面 ID 、是否联查场景以及页面模板)
    let { initTemplateFun, pageId, currentScene } = 
    sceneInfo.call(this, { 
      page_id: CARD.page_id, 
      page_id_link: CARD.page_id_link, 
      page_id_approve: CARD.page_id_approve, 
      initTemplate 
    });
    let {pullDataSource,pullPrimaryId } = this.getPullDataSourceInfo();
    return (
      <BaseCard
        BillConfig={{
          pageId: pageId, // 页面编码
          ListPageCode: LIST.page_id, // 卡片页面编码
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
          pullDataSource:pullDataSource, //拉单列表页面数据缓存
          pullPrimaryId: pullPrimaryId, // 拉单列表页面数据主键
        }}
        BtnConfig={{
          btnArea: CARD.head_btn_code, // 表头按钮区域编码
          btnsRule: state4headBtns, // 表头按钮可用规则
        }}
        FormConfig={{
          formId: CARD.form_id, // 主表区域编码
        }}
        TreeConfig={{
          treeId: CARD.treeId, // 版本树id
          needSearch: false, // 是否需要查询框
          defaultExpandAll: true, // 默认展开所有节点
          disabledSearch: true, // 是否显示搜索框
        }}
        TabsConfig={{
          tabOrder: CARD.tab_order, // tab排序
          tabPrimaryIdOrder:CARD.tab_primaryId_order, //tab对应子表主键集合
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
        PullBillConfig={PullBillConfig} // 拉单配置
        LinkConfig={LinkConfig} // 联查配置
        _beforeEvent={beforeEvent} // 主表编辑前函数
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
    bodycode: ["contractexeinfo","payinfo","repayinfo"],
  },
})(Card);
export default Card;
