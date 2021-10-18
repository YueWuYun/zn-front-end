/* 
  开证登记卡片页
*/
import { createPage, promptBox, toast,getBusinessInfo } from "nc-lightapp-front";
import React, { Component } from "react";
import {
  API_URL,
  billtype,
  CARD,
  DATA_SOURCE,
  LinkConfig,
  LIST,
  MODULE_ID,
  PUB_MULTILANG,
  mutliLangKey,
  nodekey,
  PullBillConfig,
  PushBillConfig,
  rateType
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
  baseOperation,
  buttonClick
} from "./events";
import BaseCard from "../../../public/components/BaseCard";

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
        this.state.multiLang["361701OR-000006"]
      ); /* 国际化处理： 未加载到本页面多语资源 */
    }
  }

  // 联查信息处理
  linkInfo = () => {
    let scene = this.props.getUrlParam("scene");
    // 处理模板 meta 数据方法
    let initTemplateFun = initTemplate;
    // 正常卡片页面
    let pageID = CARD.page_id;
    if (scene === "linksce") {
      // 一般联查场景
      pageID = CARD.page_id_link;
      initTemplateFun = null;
    } else if (scene === "approvesce") {
      // 联查审批详情场景
      pageID = CARD.page_id_approve;
      initTemplateFun = null;
    }
    return {
      initTemplateFun,
      pageID,
    };
  };
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
  // 点击确认按钮 弹出后台错误提示消息 如果没有错误消息不做提示
  handleConfirm() {
    buttonClick.call(this, this.props, 'ConfirmModal');
  }
  //  modal取消按钮处理函数
  handleCancel() {
    this.setState({ registerCancleShow: false });
  }
  //  modal关闭按钮处理函数
  onClose() {
    this.setState({ registerCancleShow: false });
  }
  // 复制时主子表事件处理函数
  handleCopy() {}

  // 变更时主子表事件处理函数
  handleChange() {}

  render() {
    let { multiLang } = this.state;
    let pageTitle = multiLang["361701OR-000000"]; /* 国际化处理： 开证登记 */
    let businessInfo = getBusinessInfo();
    let businessDate = new String(businessInfo.businessDate);
    // 不同场景下 页面 ID 及页面模板
    let { initTemplateFun, pageID } = this.linkInfo();
    return (
      <BaseCard
        BillConfig={{
          pageId: pageID, // 页面编码
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
          rateType: rateType, //汇率字段
          ...PullBillConfig, // 拉单参数配置
        }}
        PullBillConfig={PullBillConfig} // 拉单配置
        PushBillConfig={PushBillConfig} // 推单配置
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
        ModalConfig={{
          closeButtonShow: true, //  是否显示右上角 X 按钮
          title: multiLang["361701OR-000007"] /* 国际化处理：标题 */,
          defaultShow: false, // modal默认显示控制
          showKey: "registerCancleShow", // modal显示控制字段key 设置其为true或false
          FormConfig: {
            formId: "header_logout", // modal中的form的id
            status: "edit", // 状态
            defaultValue: [
              {
                originItem: businessDate,
                targetKey: "stopdate",
              },
              {
                originItem: new String("2"),
                targetKey: "stopreason",
              },
            ],
          }, // modal中 form区域参数
          BtnConfig: {
            btnArea: CARD.modal_logout_code,
            handleConfirm: this.handleConfirm,
            handleCancel: this.handleCancel,
            onClose: this.onClose,
          },
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
