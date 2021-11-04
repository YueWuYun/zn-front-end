//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
// 单表
import React, { Component } from 'react';
import { createPage, base, toast, ajax,cacheTools } from 'nc-lightapp-front';
import { initTemplate, searchBtnClick } from './event';
import ProfitCenterVersion from '../list/version';
let treeTableId = 'resaprofitcenter';
let searchid = 'profitcenterquery';
const dataSource = 'uapbd.reas.profitcenter.data'


class ProfitCenterTable extends Component {
	constructor(props) {
		super(props);
		this.config = Object.assign({
			formId: 'pfc_v_card',
			urls: {
				versionqry: "/nccloud/uapbd/profitcenter/versionqry.do",
				versionsave: "/nccloud/uapbd/profitcenter/version.do"
			}
		}, props.config);
		this.state = {
			versionparam: {},
			selectedPK: '',
			vstartdate:'',
			print_type: 'list',
			json: {},
			inlt: null
		}
	}
	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				debugger
				this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
			}

		}
		this.props.MultiInit.getMultiLang({ 'moduleId': 'resa-profitcenter', 'domainName': 'uapbd', callback });
	}

	cancelBtnClick() {
		debugger
		this.props.modal.close('modal');
	}

	//利润中心版本化
	version() {
		debugger
		// 利润中心版本化，如果没有填写版本说明，不允许操作，并给出提示
		if ((!this.state.versionparam.vname) || this.state.versionparam.vname.length == 0) {
			toast({ title: this.state.json['10100RESA-000016'], color: "warning" });/* 国际化处理： 新版本说明不能为空！*/
			return false;
		}
		//这里需要校验当前利润中心数据的版本开始日期,即每天只能版本化一次数据
		let vstartstr = this.state.vstartdate;//2018/08/22 00:00:00  2018/08/22 00:00:00
		vstartstr = vstartstr.replace(/-/g, '/');
		let vstartdate = new Date(vstartstr);
		let sysdatestr = new Date();
		sysdatestr = sysdatestr.getFullYear() + '/' + ((sysdatestr.getMonth() + 1) < 10 ? ('0' + (sysdatestr.getMonth() + 1)) : (sysdatestr.getMonth() + 1)) + '/' + (sysdatestr.getDate() < 10 ? ('0' + sysdatestr.getDate()) : sysdatestr.getDate()) + ' 00:00:00'
		let sysdate = new Date(sysdatestr);
		if (!(vstartdate.getTime() < sysdate.getTime())) {
			//此时，不允许利润中心版本化
			toast({title: this.state.json['10100RESA-000019'], color: "warning" });/* 国际化处理： 一天最多只能生成一个版本！,注意*/
			return;
		}

		let param = this.state.versionparam;//树版本化参数

		param.vstartdate = sysdatestr;//下个开始日期

		param.pk_profitcenter = this.state.selectedPK;

		ajax({
			url: this.config.urls['versionsave'],
			data: param,
			success: (result) => {
				if (result.success) {
					//版本化成功需要将form表单中版本生肖事件更新
					this.props.form.setFormItemsValue(this.config.formId, { 'vstartdate': { 'value': sysdatestr, 'display': sysdatestr } });
					toast({ title: this.state.json['10100DEPT-000019'], color: "success" });/* 国际化处理： 版本化成功！*/
					this.setState({
						versionparam: {}
					})
					this.props.modal.close('modal') ;
				}
			}
		})
	}


	onRowDoubleClick(record, index, props) {
		debugger
		props.pushTo('/card', {
			id: record.pk_profitcenter.value,
			status: 'browse'
		});
	}

	//部门版本化回调函数取vname信息 
	getVname(vname) {
		debugger
		this.setState({ versionparam: { vno: this.state.versionparam.vno, effectdate: this.state.versionparam.effectdate, vname: vname } });
	}
	/**
  * 树表数据选中事件
  * @param {*} record 
  * @param {*} index 
  * @param {*} e 
  */
	checkboxChange(record, index, e) {
		debugger
		this.setState({
			selectedPK: record.values.pk_profitcenter.value,
			vstartdate: record.values.vstartdate.value
		});
	}

	buttonClick(props, id) {

		switch (id) {
			case 'version'://版本化
				let pk_profitcenter = this.state.selectedPK;
				if (!pk_profitcenter) {
					toast({ color: 'danger', content: this.state.json['10100RESA-000015'] });/* 国际化处理： 请选择版本化数据！*/
				}
				ajax({
					url: this.config.urls['versionqry'],
					data: { pk_profitcenter: this.state.selectedPK },
					success: (result) => {
						if (result.success) {
							debugger
							//日期转换，将时分秒改为00：00：00
							let vstartdatestr = result.data.effectdate.replace(/-/g, '/');
							vstartdatestr = new Date(vstartdatestr);
							vstartdatestr = vstartdatestr.getFullYear() + '-' + ((vstartdatestr.getMonth() + 1) < 10 ? ('0' + (vstartdatestr.getMonth() + 1)) : (vstartdatestr.getMonth() + 1)) + '-' + (vstartdatestr.getDate() < 10 ? ('0' + vstartdatestr.getDate()) : vstartdatestr.getDate()) + ' 00:00:00'

							let vno = (new Date().getFullYear()) + result.data.nextvno;
							this.setState({ versionparam: { vno: vno, effectdate: result.data.effectdate, vname: '' } })
							let config = { json: this.state.json, listdata: result.data.listdata, carddata: result.data.carddata, vno: vno, vstartdate: vstartdatestr/*result.data.effectdate*/, getMemo: this.getVname.bind(this) };
							this.props.modal.show('modal', {
								userControl: true,
								title: this.state.json['10100RESA-000014'],/* 国际化处理： 版本化*/
								content: <ProfitCenterVersion fieldid={"version"} config={config} />,
								cancelBtnClick: this.cancelBtnClick.bind(this),
								beSureBtnClick: this.version.bind(this)
							});
						}
					}
				})
				break;
			case 'add'://新增
				this.props.pushTo('/card', {
					status: 'add',
					pk_profitcenter: '',
					pagecode: '10100PFC_profitcenter',
				});
				break;
			case 'delete'://删除
				debugger;
				break;
		}
	}


	render() {
		debugger
		let { search, treeTableManyCol, modal } = this.props;
		let { NCCreateSearch } = search;
		let { treeTableCol } = treeTableManyCol;
		let { createModal } = modal;  //模态框


		const { NCDiv } = base;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{createModal('modal', { noFooter: false })}
				<NCDiv areaCode={NCDiv.config.HEADER}>
					<div className="nc-bill-header-area">
						<div className="header-title-search-area">
							<span>
								{
									createBillHeadInfo(
										{
											title: this.state.json['10100RESA-000001'],
											initShowBackBtn: false          //标题
										}
									)}
							</span>
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: 'list_btn',
								onButtonClick: this.buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(searchid, {
						showAdvBtn: false,
						clickSearchBtn: searchBtnClick.bind(this)
					})}
				</div>
				<div className="treeTableCol">
					<div className="leftBox">
						{treeTableCol(treeTableId, {//不支持显示序号
						    dataSource:dataSource,
							async: false,    //数据同步加载为false,异步加载为true
							defaultExpandAll: true,   //初始化展开所有节点  ，默认参数为false,不展开
							showCheckBox: true,       // 是否显示复选框 ,默认false不显示
							checkboxChange: this.checkboxChange.bind(this), //新增勾选onChange事件
							checkedType: 'radio',      // 勾选方式，单选radio,多选 checkbox； 默认多选
							onRowDoubleClick: this.onRowDoubleClick.bind(this)
						})}
					</div>
				</div>

			</div>
		);
	}
}

ProfitCenterTable = createPage({
	initTemplate: initTemplate
})(ProfitCenterTable);
export default ProfitCenterTable;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65