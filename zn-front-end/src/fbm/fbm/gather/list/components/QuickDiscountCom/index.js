/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 快捷贴现组件
 * @author：lifft
 */
import React from "react";
import { base } from "nc-lightapp-front";
import quickDiscountButtonClick from "../events/quickDiscountButtonClick";
const { NCModal } = base;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */
const QuickDiscountCom = props => {
    let { context, show, title, signCode, afterEvent } = props;
    let { createForm } = context.props.form;
    let { createButtonApp } = context.props.button;
    return (
        <NCModal fieldid={"generateSearch"} show={show} backdrop={"static"} className="senior" onHide={quickDiscountButtonClick.bind(context, context.props, 'Cancel')}>
            <NCModal.Header closeButton={true}>
                <NCModal.Title>{title}</NCModal.Title>
            </NCModal.Header>
            <NCModal.Body>{createForm(signCode, {
                onAfterEvent: afterEvent && afterEvent.bind(this)
            })}</NCModal.Body>
            <NCModal.Footer>
                {createButtonApp({
                    area: "search_com",
                    onButtonClick: quickDiscountButtonClick.bind(context)
                })}
            </NCModal.Footer>
        </NCModal>
    );
};

export default QuickDiscountCom;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/