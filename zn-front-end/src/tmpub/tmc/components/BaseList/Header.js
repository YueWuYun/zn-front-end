/*a+tHrGApwJIb8puqyXq5NJBO2OFZqp5CsTy3pXcw9Jr4xXlfkdM70QXmdcBg7DUM*/
import React from "react";
import { base } from "nc-lightapp-front";
const { NCAffix, NCDiv } = base;

const Header = ({ title, children, BillHeadInfo }) => {
    const { createBillHeadInfo } = BillHeadInfo;
    return (
        <NCAffix>
            <NCDiv
                areaCode={NCDiv.config.HEADER}
                className="nc-bill-header-area"
            >
                <div className="header-title-search-area">
                    {createBillHeadInfo({
                        title: title,
                        initShowBackBtn: false
                    })}
                </div>
                <div className="header-button-area">{children}</div>
            </NCDiv>
        </NCAffix>
    );
};
export default Header;

/*a+tHrGApwJIb8puqyXq5NJBO2OFZqp5CsTy3pXcw9Jr4xXlfkdM70QXmdcBg7DUM*/