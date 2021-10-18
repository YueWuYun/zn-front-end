/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { base, toast} from 'nc-lightapp-front';
const { NCFormControl, NCPagination, NCSelect, NCButton }= base;
import './index.less';

export default class PageJump extends Component {
	static defaultProps = {
		pageSize: 10,
		activePage: 1,
		pageSizeShow: true,
		pageJumpShow: true,
		changeSizeShow: true,
		maxButtons: 5,
		maxPage: 1, 
		totalSize: 0,
		pageSizeDisabled: false,
		type: 'list',
		changePageShow: true
	};

	constructor(props) {
		super(props);

		this.state = {
			page: '',
		};
	}

	componentWillReceiveProps(nextProps) {
		
	}
	
	render() {
		let { pageSize, activePage, changeSizeShow, pageSizeShow, pageJumpShow, maxButtons, maxPage, totalSize, pageSizeDisabled, type, changePageShow, lang }= this.props;
		let { all, bar, jump, num, ok, pageLang }= lang;
		let { page }= this.state;
		const changeColor = obj => {
            return window.top.nccColor==='black' ? obj : {};
        }

		let sizeLst= type=== 'list' ? [10, 20, 50, 100] : [50, 100, 200, 500];
		// return <div className={`page-jump simpleTable-component-paginationDiv ${totalSize && 'show'}`}>
		return <div className="page-jump simpleTable-component-paginationDiv" fieldid="pagination-div" style={changeColor({backgroundColor: '#27272a'})}>
			<div className="page-size" fieldid="page-size" style={{display: pageSizeShow ? 'block' : 'none'}}>
				{changeSizeShow && <NCSelect
					fieldid="page-size"
					value={pageSize}
					disabled={pageSizeDisabled}
					style={{ width: 85, marginRight: 10 }}
					onSelect={(val) => {this.props.onChangePageSize(Number(val))}}
				>
					{
						sizeLst.map((item, index) => {
							return <NCSelect.NCOption  value={item} key={index}>{item}{bar}/{pageLang}</NCSelect.NCOption>
						})
					}
				</NCSelect>}
			</div>
			<div className="page-size"style={{display: pageSizeShow ? 'block' : 'none'}}>	
				<br/>
				<span style={changeColor({color: '#bdbdbd'})}>{all} </span> 
				<span  style={changeColor({color: '#bdbdbd'})} >{totalSize || 0} </span>
				<span  style={changeColor({color: '#bdbdbd'})}>{bar}</span>
			</div>
			{/* {(totalSize>= pageSize) && changePageShow ? */}
			{changePageShow ?
				<div className="pagination" >
					<NCPagination
						prev
						next
						first
						last
						boundaryLinks
						items={maxPage}
						maxButtons={maxPage> 10 ? maxButtons : maxPage}
						activePage= {activePage}
						onSelect= {(val) => {this.props.onChangePageIndex(Number(val));}}
					/>
					<span className="toPage" style={{display: pageJumpShow && maxPage> 10 ? 'block' : 'none'}}>
						{jump} 
						<NCFormControl 
							fieldid="pagenum"
							iconStyle="one" 
							className="toPage-input"
							min= {1}
							max= {maxPage}
							value= {page}
							onChange= {val => {
								let reg= /^[1-9][0-9]*$/;
								if (!reg.test(val) && val) {
									toast({color: 'warning', content: num});
									return ;
								}
								this.setState({page: val});
							}}
							onKeyDown = {(e) => {
								if(e.keyCode=== 13) {
									this.props.onChangePageIndex(Number(page));
								}
							}}
						/> 
						{pageLang}
						<NCButton
							fieldid="jump"
							className="toPage-button"
							onClick={() => {
								let pages= page;
								if (!pages) {
									pages= 1;
								}
								if (pages > maxPage) {
									pages= maxPage;
								}
								this.props.onChangePageIndex(Number(pages));
								this.setState({
									page: ''
								})
							}}
						>{ok}</NCButton>
					</span>
				</div>
			: ''	
			}
		</div>;
	}
}

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/