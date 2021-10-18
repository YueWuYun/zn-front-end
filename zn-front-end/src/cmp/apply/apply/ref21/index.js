/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
/*
 * @Author: zhanghe 
 * @PageInfo: 单来源
 * 选择应付列表
 *   
 * @Date: 2018-06-14 16:20:44 
 * @Last Modified by: zhanghe 
 * @Last Modified time: 2018-08-06 22:31:36
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { REF21_CONST } from './const';
import { APP_INFO } from '../cons/constant';
import { initTemplate, initSingleTemplate } from './init';
import { serach_btnClick, buttonClick } from './btnClicks';
import { search_afterEvent } from './events';
const { NCBackBtn, NCSetColBtn, NCToggleViewBtn,NCDiv } = base;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;

class TransferTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ntotalnum: 0,
			ntotalmny: 0,
			queryInfo: null
		};
		initTemplate.call(this, props);
	}
	componentDidMount() {
		let { hasCache } = this.props.transferTable;
		if (!hasCache(REF21_CONST.Ref21DataSource)) {
			this.props.transferTable.setTransferTableValue(REF21_CONST.formId, REF21_CONST.tableId, [], REF21_CONST.pk_head, REF21_CONST.pk_body);
		}
	}

	// 计算合计
	calTotal = (flag, record, bodys) => {
		let ntotalnum = Number(this.state.ntotalnum);
		let ntotalmny = Number(this.state.ntotalmny);
		if (flag == true) {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum += Number(line.nnum.value);
					ntotalmny += Number(line.norigtaxmny.value);
				}
			} else {
				ntotalnum += Number(record.nnum.value);
				ntotalmny += Number(record.norigtaxmny.value);
			}
		} else {
			if (bodys && bodys.length > 0) {
				for (let bline of bodys) {
					ntotalnum -= Number(bline.nnum.value);
					ntotalmny -= Number(bline.norigtaxmny.value);
				}
			} else {
				ntotalnum -= Number(record.nnum.value);
				ntotalmny -= Number(record.norigtaxmny.value);
			}
		}
		this.setState({
			ntotalnum: ntotalnum,
			ntotalmny: ntotalmny
		});
	};

	// 点击返回
	clickReturn = () => {
		this.props.pushTo('/list', {pagecode:REF21_CONST.PAGE_CODE});
	};
	// 列设置
	handleClick = () => {
		// //console.log(this.props.MutiInit.getIntl("36070APM") && this.props.MutiInit.getIntl("36070APM").get('36070APM--000039'));/* 国际化处理： 平台功能还没完善！*/
	};

	//转单跳转目的小应用
	transfer = () => {
		ajax({
			url: '/nccloud/arap/arappub/getdesturl.do',
			data: {
				appcode: this.props.getUrlParam('dest_appcode'),
				pagecode: this.props.getUrlParam('dest_tradetype')
			},
			success: (res) => {
				if (res) {					
					this.props.pushTo(res.data, { type: 'ref21' ,status: 'add'});
				}
			}
		});
	}


	// 切换
	changeViewType = () => {
		if (!this.props.meta.getMeta()[REF21_CONST.singleTableId]) {
			initSingleTemplate.call(this, this.props); //加载主子拉平模板
		}
		this.props.transferTable.changeViewType();
	};
	// react：界面渲染函数
	render() {
		const { transferTable, button, search ,BillHeadInfo} = this.props;
		const { NCCreateSearch } = search;
		const { createButtonApp } = button;
		const { createTransferTable } = transferTable;
		const { createBillHeadInfo } = BillHeadInfo;	
		// let totalstr = `总数量：${this.state.ntotalnum}  ,  总金额：${this.state.ntotalmny}`;
		

		return (
			<div id="transferList" className="nc-bill-list">			
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area"> 	
					<NCBackBtn onClick={this.clickReturn} />
					<div className="header-title-search-area">
						{createBillHeadInfo(
						{
							title: this.props.MutiInit.getIntl("36070APM") && this.props.MutiInit.getIntl("36070APM").get('36070APM--000041'),//{/* /* 国际化处理： 选择应付单*/*/}
							initShowBackBtn: false
						}
						)}
					</div>

					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 8,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
						
						{/* <NCSetColBtn onClick={this.handleClick} />
						
						<NCToggleViewBtn expand={false} onClick={this.changeViewType} /> */}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(
						REF21_CONST.searchId,
						{
							clickSearchBtn: serach_btnClick.bind(this),
							onAfterEvent: search_afterEvent.bind(this)
						}
						//模块id
					)}
				</div>
				<div className="nc-bill-transferTable-area">
					{createTransferTable({
						tableType: 'simple',//表格默认显示的类型，默认为主子表 full:主子拉平 nest:主子表 simple:单表
						headTableId: REF21_CONST.formId, //表格组件id
						transferBtnText: this.props.MutiInit.getIntl("36070APM") && this.props.MutiInit.getIntl("36070APM").get('36070APM--000040'), //转单按钮显示文字/* 国际化处理： 确认*/
						containerSelector: '#transferList', 
						onTransferBtnClick: (ids) => {
							this.props.pushTo(REF21_CONST.destPageUrl, { status:'add',srcbilltype:'ref22',pagecode: REF21_CONST.TRANS_CARD_PAGE});
						},
						dataSource: REF21_CONST.Ref21DataSource,
						// showMasterIndex: true,
						// showChildIndex: false,
						// bodyTableId: REF21_CONST.tableId, //子表模板id						
						// onSelectedItemRemove: (record, bodys) => {
						// 	// 计算下方合计
						// 	this.calTotal(false, record, bodys);
						// },
						// onCheckedChange: (flag, record, index, bodys) => {
						// 	// 计算下方合计
						// 	this.calTotal(flag, record, bodys);
						// }
						// fullTableId: REF21_CONST.singleTableId,
						// onTransferBtnClick: (ids) => {
						// 	this.props.pushTo(REF21_CONST.destPageUrl, { type: 'ref21' });
						// },
						// selectArea: () => {
						// 	//已选列表个性化区域
						// 	return <span>{totalstr}</span>;
						// },
						// onClearAll: () => {
						// 	this.setState({
						// 		ntotalnum: 0,
						// 		ntotalmny: 0
						// 	});
						// },
					})}
				</div>
			</div>
		);
	}
}

TransferTable = createPage({
	mutiLangCode: APP_INFO.MODULE_ID
})(TransferTable);
// ReactDOM.render(<TransferTable />, document.querySelector('#app'));
export default TransferTable;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/