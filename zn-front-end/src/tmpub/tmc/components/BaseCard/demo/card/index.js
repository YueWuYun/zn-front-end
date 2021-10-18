/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 债券契约卡片页
 created by：wangjzhi 2018-12-26
*/
import React, { Component } from 'react';
import { createPage, high, promptBox } from 'nc-lightapp-front';
const {Inspection} = high;
import {
	initTemplate,
	initTemplate1,
	initTemplate2,
	buttonClick,
	afterEvent,
	afterTableEvent,
	buttonVisible,
	bodyButtonClick,
	bodySelectedEvent,
	bodySelectedAllEvent
} from './events';
import {
	pageClick,
	initForm,
	queryCard,
	setChangeDisableItems,
	initVersionTree,
	checkUnderwriter
} from '../../public/container/page';
import { DISABLE_BTN_PARAM } from '../cons/constant.js';
import { AccSum } from '../../public/container/utils';
import BaseCard from '../../../../tmpub/tmc/components/BaseCard';
import { APP_CONFIG } from '../cons/constant';
const { CARD } = APP_CONFIG;
import NCCCCBalance from '../../../../ccc/public/Balance/list';
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list/index';

//componentDidMount
function cardDidMount() {
	let id = this.props.getUrlParam('id');
	let status = this.props.getUrlParam('status');
	let pageType = this.props.getUrlParam('pageType');
	if (status === 'add') {
		initForm.call(this, status);
	} else if (id) {
		if (pageType === 'version') {
			//查看版本
			initVersionTree.call(this);
		}
		if (status === 'change') {
			//变更禁用字段
			setChangeDisableItems.call(this);
		}
		queryCard.call(this);
	}
}

//保存前校验
function saveBefore(callback) {
	let underValid = checkUnderwriter.call(this, {
		registmny: 'registmny', //注册金额
		agreeAmount: 'aggredissuancemny', //约定承销金额
		actualAmount: 'issuancemny' //实际承销金额
	}); //承销商校验
	const registmny = this.props.form.getFormItemsValue(this.formId, 'registmny').value; //注册金额
	const creditoccupy = this.props.form.getFormItemsValue(this.formId, 'creditoccupy').value; //授信占用额度
	let occColData = this.props.cardTable.getColValue(this.tabCode, 'occupymny'); //占用担保金额列数据
	let occTotal =
		occColData && occColData.map((item) => item && item.value).reduce((prev, cur) => AccSum(+prev, +cur), 0);
	if (this.props.form.isCheckNow(this.formId)) {
		if (+creditoccupy + occTotal < +registmny && underValid) {
			promptBox({
				color: 'warning',
				title: '保存',
				content: '债券契约占用授信额度与占用担保金额之和小于注册金额，是否保存？',
				beSureBtnClick: () => {
					callback && callback();
				}
			});
		} else {
			if (underValid) {
				callback && callback();
			}
		}
	}
}

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {}

	//根据场景加载相应initTemplate
	getInitTemplate = () => {
		let scene = this.props.getUrlParam('scene');
		if (scene === 'linksce') {
			//联查场景
			return initTemplate1;
		} else if (scene === 'approvesce') {
			//审批详情场景
			return initTemplate2;
		} else {
			return initTemplate;
		}
	};

	render() {
		const { APP_INFO, CARD, TABS, API_URL } = APP_CONFIG;
		const config = { ...APP_INFO, ...CARD, ...TABS, API_URL };
		const cusState = {
			tableTypeObj:{
				uderwriter:'cardTable',
				guarantee:'cardTable'
			},
			headDisabledItems,	//表头禁用字段
			disableBtnsParam:DISABLE_BTN_PARAM,	//根据选中数据判断对应按钮禁用状态
			showCCC: false, //显示联查授信额度
			showCCCBalance: null, //授信pk
			showOriginalBalance: false, //显示联查余额
			showOriginalData: '', //联查余额数据
			showNtbDetail: false, //显示预算计划
			ntbdata: null, //预算计划数据
		};
		//表头禁用字段
		const headDisabledItems = [
			{
				//币种为人民币时禁用组织本币汇率
				key: 'olcrate',
				rules: () => {
					let pk_currtype = this.props.form.getFormItemsValue(CARD.form_id, 'pk_currtype');
					return pk_currtype && pk_currtype.value === '1002Z0100000000001K1';
				}
			}
		];
		return (
			<div>
				<BaseCard
					config={config}	//constant里的所有值
					initTemplate={this.getInitTemplate()}	//页面模板
					pageTitle={APP_INFO.pageTitle}	//小程序名字
					buttonClick={buttonClick}	//buttonClick
					headBtnArea={CARD.headBtnCode} //表头按钮区域
					shoulderBtnArea={CARD.shoulderBtnCode} //表体tab区域肩部区域按钮code
					customState={cusState}	//constant外其它自定义参数
					pageClick={pageClick}
					buttonVisible={buttonVisible}
					afterEvent={afterEvent}
					cardDidMount={cardDidMount} //componentDidMount

					//其它自己定义的函数
					formParams={{expandArr: [ 'credit' ]}}	//表头form参数
					linkItems={[ 'approveDetail', 'creditBalance' ]} //联查显示的组件
					afterTableEvent={afterTableEvent}
					bodyButtonClick={bodyButtonClick}
					bodySelectedEvent={bodySelectedEvent}
					bodySelectedAllEvent={bodySelectedAllEvent}
					saveBefore={saveBefore} //保存前校验
					{...this.props}
				>
					{/* 
						这里必须写成回调函数的形式，返回参数是BaseCard组件的this，
						这么写的目的是将这里写的内容通过函数传给子组件进行渲染,
						这里访问的state需要在父组件中定义然后通过customState传给子组件，
						这样就能访问在父组件中定义但是在子组件使用的state了
					*/}
					{
						(_this) => {
						return (
							<div>

								{/* 联查授信 */}
								{
									_this.props.linkItems.includes('creditBalance') && (
									<NCCCCBalance
										showmodal={_this.state.showCCC}
										showCCCBalance={_this.state.showCCCBalance}
										// 点击确定按钮的回调函数
										onSureClick={() => {
											//关闭对话框
											_this.setState({
												showCCC: false
											});
										}}
										onCloseClick={() => {
											//关闭对话框
											_this.setState({
												showCCC: false
											});
										}}
									/>
								)}

								{/* 联查余额 */}
								{
									_this.props.linkItems.includes('bankBalance') && (
									<NCCOriginalBalance
										showmodal={_this.state.showOriginalBalance}
										showOriginalData={_this.state.showOriginalData}
										// 点击确定按钮的回调函数
										onSureClick={() => {
											//关闭对话框
											_this.setState({
												showOriginalBalance: false
											});
										}}
										onCloseClick={() => {
											//关闭对话框
											_this.setState({
												showOriginalBalance: false
											});
										}}
									/>
								)}

								{/** 联查预算 **/}
								{
									_this.props.linkItems.includes('ntb') && (
									<Inspection
										show={_this.state.showNtbDetail}
										sourceData={_this.state.ntbdata}
										cancel={() => {
											_this.setState({ showNtbDetail: false });
										}}
										affirm={() => {
											_this.setState({ showNtbDetail: false });
										}}
									/>
								)}
							</div>
						);
					}}
				</BaseCard>
			</div>
		);
	}
}

Card = createPage({
	billinfo: {
		tabs: true, //tab多子表
		billtype: 'extcard',
		pagecode: CARD.pageId,
		headcode: CARD.formId,
		bodycode: CARD.tabOrder
	}
	// mutiLangCode: module_id
})(Card);
export default Card;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/