/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import { formatMoney } from '../../../../commom';
import './index.less';
const { NCIcon } = base;

export default class ListColumn extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
			isAdd: true
		};
    }   
	
	render() {
        let { title, sum, data, signal, area, ...others }= this.props;
        let { isAdd }= this.state;
        
        return (
            <ul className="list-column">
                <li className= "item-span-li-content">
                    <span className="item-span"  style={window.top.nccColor==='black' ? {color: '#bdbdbd'}:null}>
                        <i 
                            className={`icon-span iconfont ${isAdd ? 'icon-zengjia' : 'icon-shanchu2'}`}
                            onClick={() => {
                                this.setState({
                                    isAdd: !isAdd
                                });
                            }}
                        />
                        {title}
                    </span>
                    <span className="item-span">{sum}</span>
                </li>
                {!isAdd && data.length ?
                    data.map((item, index) => {
                        return (
                            <li className="item-span-li-content">
                                <span className="item-span">
                                    {item['m_vo']['m_checkdate']}
                                    <span className="explanation">{item['m_vo'][area=== 'bank' ? 'm_pk_check' : 'm_Vouchno']}</span>
                                    <span className="explanation">{item['m_vo']['m_Explanation']}</span>
                                </span>
                                <span className="item-span">{item['m_vo'][signal] ? Number(item['m_vo'][signal]).formatMoney() : ''}</span>
                            </li>
                        );
                    }) : null
                }
            </ul>
        );
	}
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/