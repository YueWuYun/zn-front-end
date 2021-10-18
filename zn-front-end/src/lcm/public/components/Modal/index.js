/**
 * 自定义弹框
 */
import { base } from "nc-lightapp-front";
import React, { Component } from "react";
import buttonClick from "./buttonClick";
const { NCModal, NCButton, NCAffix } = base;

export default class Modal extends Component {
  constructor(props) {
    super(props);
  }

  hanleDefaultValue = ()=>{
    let {
      ModalConfig,
      BillConfig,
      TableConfig,
      form: formUtil,
      table: tableUtil,
    } = this.props;
    let { FormConfig } = ModalConfig;
    let { defaultValue } = FormConfig;
    // 默认数据
    let defaultData = {};
    if(!defaultValue) return
    for (let item of defaultValue) {
      let { originItem, targetKey } = item;
      if (!originItem) return;
      if (originItem instanceof String) {
        // 如果是字符串 则直接将其赋值到字段上
        defaultData[targetKey] = { display: originItem.toString(), value: originItem.toString() };
      } else if (originItem instanceof Object) {
        let { areacode, originKey } = originItem;
        if (!areacode || !originKey) {
          // 如果没有该参数
          if (JSON.stringify(originItem) !== "{}") {
            // 如果不是空对象
            defaultData[targetKey] = originItem;
          } else {
            // 如果是空对象
            defaultData[targetKey] = { display: null, value: null };
          }
        } else {
          let originKeyValue = null;
          if (areacode === BillConfig.formId) {
            // 如果是主表区域
            originKeyValue = formUtil.getFormItemsValue(
              BillConfig.formId,
              originKey
            );
          } else if (areacode === TableConfig && TableConfig.tableId) {
            // 如果是列表区域
            let checkedRows = tableUtil.getCheckedRows(TableConfig.tableId);
            originKeyValue =
              checkedRows[0] && checkedRows[0].data.values[originKey];
          }
          defaultData[targetKey] = originKeyValue;
        }
      } else {
        console.log("your defaultData in ModalConfig ix wrong!");
      }
    }
    Object.keys(defaultData).length &&
      formUtil.setFormItemsValue(FormConfig.formId, defaultData);
  }
  componentDidMount() {
    let {
      ModalConfig,
    } = this.props;
    let { FormConfig } = ModalConfig;
    if (!FormConfig) return;
    this.hanleDefaultValue();
  }

  componentWillReceiveProps() {
    let { ModalConfig, form: formUtil } = this.props;
    let { FormConfig } = ModalConfig;

    if (!FormConfig) return;
    let { status } = FormConfig;
    // 设置主表状态
    formUtil.setFormStatus(FormConfig.formId, status);
    this.hanleDefaultValue();
  }

  render() {
    let { ModalConfig, form: formUtil, button: buttonUtil } = this.props;
    let {
      defaultShow,
      showModal,
      title,
      closeButtonShow,
      FormConfig,
      BtnConfig,
      TableConfig,
      TabsConfig,
    } = ModalConfig;

    return (
      <NCModal
        fieldid={"modal"}
        show={showModal}
        size="sm"
        onHide={BtnConfig.onClose}
      >
        <NCModal.Header closeButton={closeButtonShow}>
          <NCModal.Title>{title}</NCModal.Title>
        </NCModal.Header>
        <NCModal.Body
          size="lg"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            {FormConfig &&
              FormConfig.formId &&
              formUtil.createForm(FormConfig.formId, {
                onAfterEvent: FormConfig.afterEvent && FormConfig.afterEvent,
                onBeforeEvent: FormConfig.beforeEvent && FormConfig.beforeEvent,
              })}
          </div>
        </NCModal.Body>
        <NCModal.Footer>
          {BtnConfig &&
            BtnConfig.btnArea &&
            buttonUtil.createButtonApp({
              area: BtnConfig.btnArea,
              onButtonClick: buttonClick.bind(this),
            })}
        </NCModal.Footer>
      </NCModal>
    );
  }
}
