/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
const { NCButton }= base;

export default class PageJump extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let { first, pre, next, last, onClick, show }= this.props;
        
        return (<div className="header-cardPagination-area" >
			<div className={`cardPagination-lightapp-component ${show ? 'show' : 'hide'}`}>
                <NCButton 
                    className={`cardPaginationBtn ${!first && 'disable'}`} 
                    onClick={() => {(first && onClick) && onClick(first)}}
                >
                    <span className="icon iconfont icon-shangyiye"/>
                </NCButton>
                <NCButton 
                    className={`cardPaginationBtn ${!pre && 'disable'}`} 
                    onClick={() => {(pre && onClick) && onClick(pre)}}
                >
                    <span className="icon iconfont icon-jiantouzuo"/>
                </NCButton>
                <NCButton 
                    className={`cardPaginationBtn ${!next && 'disable'}`} 
                    onClick={() => {(next && onClick) && onClick(next)}}
                >
                    <span className="icon iconfont icon-jiantouyou"/>
                </NCButton>
                <NCButton 
                    className={`cardPaginationBtn ${!last && 'disable'}`} 
                    onClick={() => {(last && onClick) && onClick(last)}}
                >
                    <span className="icon iconfont icon-xiayiye"/>
                </NCButton>
			</div>
		</div>);
	}
}

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/