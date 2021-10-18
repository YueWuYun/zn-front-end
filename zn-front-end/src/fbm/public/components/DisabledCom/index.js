/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 作废组件
 * @author：gaokung
 */
import React from "react";
import { base } from "nc-lightapp-front";
import buttonClick from "./events/buttonClick";
const { NCModal, NCTooltip, NCButton, NCHotKeys } = base;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */
const DisableCom = props => {
    let _this = this;
    let { context, show, title, signCode, onSureCallback } = props;
    let { createForm } = context.props.form;
    let { createButtonApp, createButton } = context.props.button;
    return (
        <NCModal
            show={show}
            fieldid={"disablenote"}
            backdrop={false}
            className="senior"
            onHide={buttonClick.bind(
                context,
                signCode,
                onSureCallback,
                props,
                "onCancel"
            )}
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
                    onButtonClick: buttonClick.bind(
                        context,
                        signCode,
                        onSureCallback
                    )
                })}
            </NCModal.Footer>
        </NCModal>
    );
};

export default DisableCom;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/