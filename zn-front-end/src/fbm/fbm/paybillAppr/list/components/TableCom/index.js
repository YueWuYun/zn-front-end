/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 签收查询结果列表组件
 * @author：gaokung
 */
import React from "react";
import { base } from "nc-lightapp-front";
import buttonClick from "./../events/buttonClick";
const { NCModal } = base;
const SearchCom = props => {
    let { context, show, title, signCode } = props;
    let { createSimpleTable } = context.props.table;
    let { createButtonApp } = context.props.button;
    return (
        <NCModal show={show} backdrop={false} size="xlg">
            <NCModal.Header>
                <NCModal.Title>
                    {
                        <span
                            style={{
                                "font-weight": "bold",
                                color: "#111",
                                "font-size": "14px"
                            }}
                        >
                            {title}
                        </span>
                    }
                </NCModal.Title>
            </NCModal.Header>
            <NCModal.Body>
                {createSimpleTable(signCode, {
                    showCheck: true,
                    showIndex: true
                })}
            </NCModal.Body>
            <NCModal.Footer>
                {createButtonApp({
                    area: "table_com",
                    onButtonClick: buttonClick.bind(context)
                })}
            </NCModal.Footer>
        </NCModal>
    );
};

export default SearchCom;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/