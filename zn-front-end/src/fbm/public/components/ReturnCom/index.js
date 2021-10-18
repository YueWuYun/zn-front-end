/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 退回组件
 * @author：gaokung
 */
import React from "react";
import { base } from "nc-lightapp-front";
import buttonClick from "./events/buttonClick";
const { NCModal, NCHotKeys } = base;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */

const ReturnCom = props => {
  let { context, show, title, signCode, onSureCallback } = props;
  let { createForm, setFormItemFocus } = context.props.form;
  let { createButtonApp } = context.props.button;
  return (
    <NCModal
      show={show}
      backdrop={false}
      fieldid={"returnreason"}
      className="senior"
      onHide={buttonClick.bind(
        context,
        signCode,
        onSureCallback,
        context.props,
        "onCancel"
      )}
      onEntered={() => {
        // 等待 dom 创建成功之后再执行获取焦点的代码
        setTimeout(() => {
          // 打开弹框并激活退回原因字段光标
          setFormItemFocus(signCode, "returnreason");
        }, 100);
      }}
      ref={NCModal => (context.NCModal = NCModal)}
    >
      <NCHotKeys
        keyMap={{
          sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
          cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
        }}
        handlers={{
          sureBtnHandler: () => {
            buttonClick.call(
              context,
              signCode,
              onSureCallback,
              context.props,
              "onSure"
            );
          },
          cancelBtnHandler: () => {
            buttonClick.call(
              context,
              signCode,
              onSureCallback,
              context.props,
              "onCancel"
            );
          }
        }}
        className="simpleModal-hotkeys-wrapper"
        focused={true}
        attach={document.body}
        display="inline-block"
      />
      <NCModal.Header closeButton={"true"}>
        <NCModal.Title>{title}</NCModal.Title>
      </NCModal.Header>
      <NCModal.Body>{createForm(signCode, {})}</NCModal.Body>
      <NCModal.Footer>
        {createButtonApp({
          area: signCode,
          tipKeybodard: "underline",
          onButtonClick: buttonClick.bind(context, signCode, onSureCallback)
        })}
      </NCModal.Footer>
    </NCModal>
  );
};
export default ReturnCom;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/