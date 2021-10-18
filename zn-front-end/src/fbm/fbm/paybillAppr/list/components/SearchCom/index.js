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
    let { context, show, title, signCode } = props;
    let { createForm } = context.props.form;
    let { createButtonApp } = context.props.button;
    return (
        <NCModal show={show} backdrop={false} size="sm">
            <NCModal.Header>
                <NCModal.Title>
                    <span
                        style={{
                            "font-weight": "bold",
                            color: "#111",
                            "font-size": "14px"
                        }}
                    >
                        {title}
                    </span>
                </NCModal.Title>
            </NCModal.Header>
            <NCModal.Body>{createForm(signCode, {})}</NCModal.Body>
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