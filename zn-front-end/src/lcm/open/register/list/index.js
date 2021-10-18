/*
  开证登记列表页
*/
import React, { Component } from 'react';
import { createPage ,getBusinessInfo} from 'nc-lightapp-front';
import { initTemplate, state4headBtns, state4innerBtns, buttonClick,bodyButtonClick } from './events';
import {
	LIST,
	CARD,
	MODULE_ID,
	PUB_MULTILANG,
	DATA_SOURCE,
	SEARCH_CACHE,
	TABLE_CACHE,
	TABS_CACHE,
	TABKEY_CACHE,
	nodekey,
	API_URL,
	billtype,
	LinkConfig,
	mutliLangKey,
	PullBillConfig,
	PushBillConfig
} from '../cons/constant';
import BaseList from '../../../public/components/BaseList';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			record:null, //存放列表页行内记录
			multiLang: {}, // 多语文件 Object
			inlt: null // 可用来进行占位符的一些操作 Object
		};
	}

	componentWillMount() {
		this.props.MultiInit.getMultiLang({
			moduleId: mutliLangKey,
			domainName: MODULE_ID,
			callback: this.multiLangCallback
		});
	}
	// 点击确认按钮 弹出后台错误提示消息 如果没有错误消息不做提示
	handleLogoutConfirm() {
		if(this.state.record){
			bodyButtonClick.call(this, 'ConfirmModal', this.state.record);
			return ;
		}
		buttonClick.call(this, this.props, 'ConfirmModal');
	}
	//  modal关闭按钮处理函数
	onLogoutClose() {
		this.setState({ "registerCancleShow": false ,record: null });
    }
  	// 点击确认按钮 弹出后台错误提示消息 如果没有错误消息不做提示
	handleBatchConfirm() {
		buttonClick.call(this, this.props, 'BatchConfirm');
	}
	//  modal关闭按钮处理函数
	onBatchClose() {
		this.setState({ "batchEditShow": false });
	}
	/**
   * 多语加载成功回调函数
   * @param {*} multiLang 多语文件
   * @param {*} status 请求状态
   * @param {*} inlt 占位符
   */

	multiLangCallback = (multiLang, status, inlt) => {
		if (status) {
			this.setState({ multiLang, inlt });
		} else {
			console.log(this.state.multiLang['361701OR-000006']); /* 国际化处理： 未加载到本页面多语资源 */
		}
	};
	render() {
		let { multiLang } = this.state;
		let pageTitle = multiLang['361701OR-000000']; /* 国际化处理： 开证登记 */
		let businessInfo = getBusinessInfo();
		let businessDate = new String(businessInfo.businessDate);
		let tabs = [
			{
				key: 'nocommit',
				num: '(0)',
				status: '-1,0',
				content: multiLang['361701OR-000001'] /* 国际化处理： 待提交*/
			},
			{
				key: 'approving',
				num: '(0)', 
				status: '2,3',
				content: multiLang['361701OR-000002'] /* 国际化处理： 审批中*/
			},
			{
				key: 'all',
				num: '',
				status: '5',
				content: multiLang['361701OR-000005'] /* 国际化处理： 全部*/
			}
		]; // tab页签
		return (
			<BaseList
				BillConfig={{
					pageId: LIST.page_id,
					cardPageCode: CARD.page_id, // 卡片页面编码
					pageTitle: pageTitle, //节点标题
					moduleId: MODULE_ID, // 所属模块
					pub_multilang: PUB_MULTILANG, // 模块公共多语key
					mutliLangKey: mutliLangKey, // 本模块多语key
					billNo: LIST.billNo, //单据编号
					API_URL: API_URL, //接口地址
					nodekey: nodekey, //打印输出编码
					primaryId: LIST.primary_id,
					billtype, //单据类型，联查审批详情需要
					initTemplate: initTemplate,
					dataSource: DATA_SOURCE, // 应用节点缓存唯一标识
					tableCache: TABLE_CACHE, // 表格数据缓存key
					searchCache: SEARCH_CACHE, //查询区缓存
					tabsCache: TABS_CACHE, // 页签集合缓存参数
					tabKeyCache: TABKEY_CACHE // 激活页签缓存参数
				}}
				PullBillConfig={PullBillConfig} // 拉单配置
				PushBillConfig={PushBillConfig} // 推单配置
				BtnConfig={{
					btnArea: LIST.head_btn_code, //表头按钮区域
					btnsRule: state4headBtns // 表头按钮可用规则
				}}
				SearchConfig={{
					show: true, // 是否显示查询区
					searchId: LIST.search_id, // 查询区编码
					oid: LIST.search_oid // 查询区oid
				}}
				LinkConfig={LinkConfig} // 联查配置
				TabsConfig={{
					show: true, // 是否显示页签
					activeKey: 'nocommit', // 默认激活的页签 Key
					info: tabs // 页签描述
				}}
				TableConfig={{
					tableId: LIST.table_id,
					showOpr: true, // 是否添加列表操作列
					btnArea: 'list_inner', // 表格操作列中按钮区域
					btnsRule: state4innerBtns // 表格操作列中按钮可用规则
				}}
				ModalConfig={[
					{
						closeButtonShow: true, //  是否显示右上角 X 按钮
						title: multiLang['361701OR-000007'] /* 国际化处理：标题 */,
						defaultShow: false, // modal默认显示控制
						showKey: 'registerCancleShow', // modal显示控制字段key 设置其为true或false
						FormConfig: {
							formId: LIST.modal_logout_area, // modal中的form的id
							status: 'edit', // 状态
							defaultValue: [
								{
									originItem: businessDate,
									targetKey: "stopdate",
								  },
								  {
									originItem: new String("2"),
									targetKey: "stopreason",
								  },
							]
						}, // modal中 form区域参数
						BtnConfig: {
							btnArea: LIST.modal_logout_code,
							handleConfirm: this.handleLogoutConfirm,
							handleCancel: this.onLogoutClose,
							onClose: this.onLogoutClose
						}
					},
					{
						closeButtonShow: true, //  是否显示右上角 X 按钮
						title: multiLang['361701OR-000009'] /* 国际化处理：标题 */,
						defaultShow: false, // modal默认显示控制
						showKey: 'batchEditShow', // modal显示控制字段key 设置其为true或false
						FormConfig: {
							formId: LIST.modal_batch_area, // modal中的form的id
							status: 'edit', // 状态
						}, // modal中 form区域参数
						BtnConfig: {
							btnArea: LIST.modal_batch_code,
							handleConfirm: this.handleBatchConfirm,
							handleCancel: this.onBatchClose,
							onClose: this.onBatchClose
						}
					}
				]}
				LinkConfig={LinkConfig} // 联查配置
				{...this.props}
			/>
		);
	}
}

List = createPage({})(List);
export default List;
