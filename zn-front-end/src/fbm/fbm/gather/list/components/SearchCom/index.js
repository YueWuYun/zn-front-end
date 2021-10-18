/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 签收查询组件
 * @author：gaokung
 */
import React from "react";
import { base } from "nc-lightapp-front";
import buttonClick from "./../events/buttonClick";
const { NCModal } = base;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */
const SearchCom = props => {
    let { context, show, title, signCode, afterEvent } = props;
    let { createForm } = context.props.form;
    let { createButtonApp } = context.props.button;
    return (
        <NCModal fieldid={"generateSearch"} show={show} backdrop={"static"} className="senior" onHide={buttonClick.bind(context, context.props, 'Cancel')}>
            <NCModal.Header closeButton={true}>
                <NCModal.Title>{title}</NCModal.Title>
            </NCModal.Header>
            <NCModal.Body>{createForm(signCode, {
                onAfterEvent: afterEvent && afterEvent.bind(this)
            })}</NCModal.Body>
            <NCModal.Footer>
                {createButtonApp({
                    area: "search_com",
                    onButtonClick: buttonClick.bind(context)
                })}
            </NCModal.Footer>
        </NCModal>
    );
};

export default SearchCom;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/