/*a+tHrGApwJIb8puqyXq5NJBO2OFZqp5CsTy3pXcw9Jr4xXlfkdM70QXmdcBg7DUM*/
import React from 'react';
import { base } from 'nc-lightapp-front';
const { NCDiv: Div } = base;

const Header = ({ children }) => {
    return (
		<Div
			areaCode={Div.config.HEADER}
			className="nc-bill-header-area"
		>
			<div className="nc-bill-header-area">
				<div className="header-title-search-area">{children[0]}</div>
				<div className="header-button-area">{children[1]}</div>
				<div className="header-cardPagination-area">{children[2]}</div>
			</div>
		</Div>
    )
}
	
export default Header;

/*a+tHrGApwJIb8puqyXq5NJBO2OFZqp5CsTy3pXcw9Jr4xXlfkdM70QXmdcBg7DUM*/