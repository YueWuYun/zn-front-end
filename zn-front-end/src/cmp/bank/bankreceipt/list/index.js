/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax, base, high, toast, print, createPageIcon, printService, printOnClient, printPreview } from 'nc-lightapp-front';
import { buttonConfig, list, searchData, columns, onSearchChange, headerConfig } from './events/commom';
import { CheckTable, HeaderList, Search, deepClone, getLangCode, PageJump, SbModal, setProp, getProp, getTableHeight } from '../../commom';
import moment from 'moment';
import './index.less';
const { NCButton, NCRangePickerClient, NCUpload, NCAffix, NCDiv, NCDropdown, NCMenu, NCIcon } = base;
const { PrintOutput } = high;
const format = "YYYY-MM-DD";
const moduleId= '360795';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataAll: [],
			dataList: [],
			dataListCopy: [],
			dataSelect: [],		
			dataBool: [],		
			data: {},
			status: '',
			searchMap: {},
			searchPrint: {},
			inputRecord: {
				vBegindate: moment().format('YYYY-MM-01'),
				vEnddate: moment().format('YYYY-MM-DD')
			},
			isBtnShow: false,
			pages: {
				page: 1,
				size: 10
			},
			isEdit: false, 
			isFullScreen: false, 
			currIndex: -1
		};
		this.moduleId= moduleId;
		this.lang= getLangCode.bind(this);
	}
	
	componentWillMount () {
		ajax({
			url: '/nccloud/cmp/contrastcommon/defaultorg.do',
			loading: false,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					searchData.pk_corp= data.orgId;
					searchData.pk_corpName= data.orgName;
					this.setState({
						searchMap: deepClone(searchData)
					});
				}
			}
		});
	}
	
	getList = () => {
		const { size, page }= this.state.pages;
		ajax({
			url: '/nccloud/cmp/bankreceipt/query.do',
			data: this.state.searchMap,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let dataAll= data.bankReceiptVOs || [];
					let index= 0;
					for (let item of dataAll) {
						item.rowid= index;
						index++;
					}
					let dataList= dataAll.filter((item, index) => index>= (page-1)*size && index< page*size);
					this.setState({
						data: data || {},
						dataAll,
						dataList,
						dataListCopy: deepClone(dataList),
						dataSelect: []
					});
				}
			},
			error: (res) => {
				toast({color: 'danger', content: res.message});
				this.setState({
					dataList: [],
					dataSelect: []
				});
			}
		});
	}

	statusOperation = (path, data, msg) => {
		ajax({
			url: '/nccloud/cmp/bankreceipt/' + path,
			data,
			success: (res) => {
				if (res.success) {
					if (path=== 'input.do') {
						setProp.call(this, 'inputModal', false);
					}
					if(res.data&&res.data.delete){
						toast({color: 'warning', content: res.data.delete});
					} else{
						toast({color: 'success', content: path=== 'input.do' ? `${this.lang('0050')}: ${res.data.add || 0}, ${this.lang('0051')} ${res.data.update || 0}` : msg});
					}
				
					this.setState(
						{
							status: '',
							currIndex: -1,
							isEdit: false
						}, () => {
							this.getList();
						}
					);
					//this.getList();
					//  this.setState({
				 	// //isEdit: false, 
					// 	//currIndex: -1,
					// 	//status: '',
					// });
				}
			}
		});
	}

	printResolve = () => {
		return {
			appcode: '3607BBS', 
			nodekey: 'bankreceipt',
			userjson: JSON.stringify(this.state.searchPrint)
		};
	}
	
	btnClick = item => {
		let { dataList, searchMap, isFullScreen }= this.state;
		switch (item.path) {
			case 'add':	//新增
				dataList.push({rowid: dataList.length});
				this.setState({
					status: 'add',
					isEdit: true, 
					currIndex: dataList.length -1,
					dataList
				});
				break;
			case 'full':	//新增
				this.setState({
					isFullScreen: !isFullScreen
				});
				break;
			case 'delete.do':	//删除
				if (!this.state.dataSelect.length) {
					toast({color: 'warning', content: this.lang('0047')});
					return;
				}	
				this.props.modal.show('deleteModal', {title: this.lang('0015'), content: this.lang('0041')});
				break;
			case 'input.do':	//从资金组织引入
				setProp.call(this, 'inputModal');
				break;
			case 'print.do':	//打印
				print(
					'pdf', 
					'/nccloud/cmp/bankreceipt/print.do',
					this.printResolve()
				);
				break;
			case 'export':	//输出
				this.refs.printOutput.open();
				break;
			case 'refresh':	//刷新
				if (!searchMap.pk_corp || !searchMap.contrastaccount) {
					toast({color: 'warning', content: this.lang('0045')});
					return;
				}
				this.getList();
				break;
		}
	}

	saveConfirm = () => {
		let { status, currIndex, searchPrint, dataList }= this.state;
		let record= dataList[currIndex];
		let data= status=== 'add' ? {...record, m_pk_corp: searchPrint.pk_corp, m_pk_contrastaccount: searchPrint.contrastaccount, pk_group: searchPrint.pk_group} : record;
		if (!data.m_checkdate) {
			toast({color: 'warning', content: this.lang('0037')});
			return ;
		}
		if (!Number(data.m_debitamount) && !Number(data.m_creditamount)) {
			toast({color: 'warning', content: this.lang('0038')});
			return ;
		}
		if (Number(data.m_debitamount) && Number(data.m_creditamount)) {
			toast({color: 'warning', content: this.lang('0039')});
			return ;
		}

		this.statusOperation('save.do', data, status=== 'add' ? this.lang('0011') + this.lang('0042') : this.lang('0012') + this.lang('0042'));
	}

	inputConfirm = () => {
		let { inputRecord, searchPrint, data }= this.state;
		if (!inputRecord.vBegindate) {
			toast({color: 'warning', content: this.lang('0043')});
			return;
		}
		this.statusOperation('input.do', {...inputRecord, pk_corp: searchPrint.pk_corp, pk_contrastaccount: searchPrint.contrastaccount, stopdate: data.stopdate}, this.lang('0044'));
	}

	inputContent = () => {
		let { inputRecord }= this.state;
		return <div fieldid="date">
			{this.lang('0009')}: <NCRangePickerClient
				fieldid="daterange"
				format={format}
				value= {inputRecord.vBegindate ? [inputRecord.vBegindate, inputRecord.vEnddate] : []}
				onChange={date => {
					inputRecord.vBegindate= date && date[0];
					inputRecord.vEnddate= date && date[1];
				}}
			/>	
		</div>
	}

	//上传文件前操作
	beforeUpload = (file) => {
		// const isUpload= (file.type=== 'application/vnd.ms-excel'|| file.type=== 'application/wps-office.xls');
		// if (!isUpload) {
		// 	toast({color: 'danger', content: this.lang('0040')});
		// }
		return true;
	};

	//上传文件后操作
	afterUpload = info => {
		if(info.file.status === 'done') {
            if(info.file.response.success){
				toast({
					color: 'success', 
					duration: 'infinity',
					content: this.lang('0048'),
					groupOperation: true,
					TextArr: [ this.lang('0056'), this.lang('0057'), this.lang('0058') ],
					groupOperationMsg: info.file.response.data || []
				});
				this.getList();
            } else {
                toast({color: 'danger', content: info.file.response.error ? info.file.response.error.message : this.lang('0049')});
            }
        }
	};

	onChange = (currIndex, val, name) => {
		let { dataList }= this.state;
		switch (name) {
			case 'm_explanation':
				dataList[currIndex].m_explanation= val.refname;
				dataList[currIndex].m_explanation= val.refname;
				break;
			case 'm_checkstyle':
				dataList[currIndex].m_checkstyle= val.refpk;
				dataList[currIndex].m_jsfsh= val.refname;
				break;
			default:
				dataList[currIndex][name]= val;
		}
		this.setState({dataList});
	}

	onlyPrint = () => {
		// printService(
		// 	this.props,
		// 	'pdf', 
		// 	'/nccloud/cmp/bankreceipt/noviewprint.do',
		// 	{
		// 		funcode: '3607BBS', 
		// 		nodekey: 'bankreceipt',
		// 		type:'client',
		// 		userjson: JSON.stringify(this.state.searchPrint)
		// 	}
		// );	
		printOnClient(
			this.props,
			'/nccloud/cmp/bankreceipt/noviewprint.do',
			{
				userjson: JSON.stringify(this.state.searchPrint),
				funcode: '3607BBS',
				appcode: '3607BBS',      //小应用编码
				nodekey: 'bankreceipt',     //模板节点标识
				download: "fileStream",
				type: '1',//1打印2预览3文件打印(需要调用者传过来)
				// ip: "127.0.0.1",
				// port: "8089"
		  	},
			true
		);
	}

	dropDownMenu = () => {
		return (<NCMenu
			className='apply-dropdown'
			onClick={(e) => {
				if (e.key== 1) {
					this.refs.printOutput.open();
				} else {
					this.onlyPrint();
					// this.props.modal.show('printService');
				}
			}}
		>
			<NCMenu.Item 
				fieldid="Output"
				key="1" 
				disabled={this.state.isBtnShow ? false : true}
			>{this.lang('0055')}</NCMenu.Item>
			<NCMenu.Item 
				fieldid="Direct_print"
				key="2" 
				disabled={this.state.isBtnShow ? false : true}
			>{this.lang('0075')}</NCMenu.Item>
		</NCMenu>);
	}

	render() {
		let { dataAll, dataList, dataBool, searchMap, data, pages, isFullScreen }= this.state;
		const { size, page }= pages;
		let { ncmodal }= this.props;
		let { createModal: createNCModal }= ncmodal;
		let {BillHeadInfo} = this.props;
		const {createBillHeadInfo} = BillHeadInfo;
		const props = {
			action: '/nccloud/cmp/bankreceipt/fileImport.do',
			beforeUpload: this.beforeUpload.bind(this),
			showUploadList: false,
			onChange: this.afterUpload.bind(this)
		};
		let outputData= {
			...this.printResolve(),
			outputType: 'output',
		};
		
		return (
			<div className="nc-bill-list bank-bankreceipt">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.lang('0010'),//{/* 国际化处理： 付款申请*/}
								initShowBackBtn: false
							}
						)}
							{/* {createPageIcon && createPageIcon()}
							<h2 className="title-search-detail">{this.lang('0010')}</h2> */}
						</div> 
						<div className="header-button-area">
							<span className="button-app-wrapper">
							{
								buttonConfig.call(this).map((item, index) => {
									if (item.path=== 'fileImport.do') {
										return (
											<span style={{display: 'inline-block', verticalAlign: 'middle'}} > 
												<NCUpload {...props}>
													<NCButton 
														fieldid="fileImport"
														disabled={!item.show} 
													> 
														{item.content}
													</NCButton>
												</NCUpload>
											</span>
										);
									} else if (item.path=== 'export') {
										return <NCDropdown
											fieldid="printbtn"
											trigger={['click']}
											overlay={this.dropDownMenu.call(this)}
											animation="slide-up"
											placement="bottomRight"
											overlayClassName="dropdown-component-list"
											>
											<NCButton className="btn-right btn-treearrow" fieldid="Print-arrow">
												<NCIcon className="btn-right-icon" type="uf-treearrow-down"/>
											</NCButton>
										</NCDropdown>
									} else {
										return <NCButton 
											fieldid={item.path==='add'?'add':item.path==='delete.do'?'del':item.path==='refresh'?'refresh':item.path==='print.do'?'print':item.path==='full'?'full':'export'}
											key={index} 
											colors={`${index< 1 ? 'primary' : ''}`}
											className={`${item.isSeperate ? 'seperate' : ''} ${['refresh', 'full'].includes(item.path) ? 'refresh-component' : ''} ${item.path=== 'delete.do' ? 'delete' : ''}`}
											onClick={this.btnClick.bind(this, item)}
											disabled={!item.show}
											
											>
											{item.content}
										</NCButton>
									}
								})
							}
							</span>		
						</div>
					</NCDiv>
				</NCAffix>
				<NCDiv areaCode={NCDiv.config.SEARCH}>
				<Search 
					list={list.call(this,searchMap)} 
					onChange={(name, val) => {onSearchChange.call(this, name, val);}}
					onSearch={() => {
						if (!searchMap.pk_corp || !searchMap.contrastaccount) {
							toast({color: 'warning', content: this.lang('0045')});
							return;
						}
						pages.page= 1;
						this.setState(
							{
								isBtnShow: true, 
								currIndex: -1,
								searchPrint: deepClone(searchMap),
								pages,
								isEdit: false
							}, () => {
								this.getList();
							}
						);
					}}
					onClear={() => {this.setState({searchMap: {}, isBtnShow: false});}}
					lang={{
						money:this.lang('0076'),
						search: this.lang('0061'),
						clear: this.lang('0062'),
						up: this.lang('0063'),
						more: this.lang('0064'),
						start: this.lang('0072'),
						end: this.lang('0073'),
					}}
				/>
				</NCDiv>
				<HeaderList 
					configList={headerConfig.call(this, data, searchMap)} 
					showType="more-column"
					borderTop	
				/>
				<div className={`nc-bill-table-area animated ${isFullScreen ? 'scaleFromOrigin' : ''}`}>
					<div className="lightapp-component-simpleTable">
						<div className="simpleTable-component-wrapper">
						<NCDiv fieldid="bankreceipt" areaCode={NCDiv.config.TableCom}>
            				<CheckTable
								columns= {columns.call(this,searchMap)}
								data= {dataList}
								rowKey= {record => record.rowid}
								selectedList={(select, bool) => {
									this.setState({
										dataBool: bool, 
										dataSelect: select
									});
								}}
								selectedBool= {dataBool}
								scroll={{x: true, y: getTableHeight()}}
								bodyStyle= {{minHeight: '410px'}}
							/>
							</NCDiv>
						</div>
						<PageJump
							pageSize = {size}
							activePage = {page}
							maxPage = {Math.ceil(dataAll.length/size)}
							totalSize = {dataAll.length}
							onChangePageIndex = {val => {
								pages.page= val;
								dataList= dataAll.filter((item, index) => index>= (val-1)*size && index< val*size);
								setTimeout(() => {
									this.setState({
										pages,
										dataList,
										dataListCopy: deepClone(dataList)
									});
								}, 100);
							}}
							onChangePageSize = {val => {
								pages.size= val;
								dataList= dataAll.filter((item, index) => index>= (page-1)*val && index< page*val);
								setTimeout(() => {
									this.setState({
										pages,
										dataList,
										dataListCopy: deepClone(dataList)
									});
								}, 100);
							}}
							lang={{
								all: this.lang('0067'),
								bar: this.lang('0068'),
								jump: this.lang('0069'),
								num: this.lang('0070'),
								ok: this.lang('0065'),
								pageLang: this.lang('0071')
							}}
						/>
					</div>
				</div>		
				<SbModal
					show={getProp.call(this, 'inputModal')}
					className="input-modal"
					title={this.lang.call(this, '0013')}
					content= {this.inputContent()}
					onOk={this.inputConfirm}
					onClose= {() => {setProp.call(this, 'inputModal', false)}}
					lang= {{
						ok: this.lang('0065'),
						close: this.lang('0066'),
					}}
				/>
				<PrintOutput
					ref="printOutput"
					url={`/nccloud/cmp/bankreceipt/print.do`}
					data={outputData}
				/>	
				{createNCModal('deleteModal', {
                    beSureBtnClick: () => {this.statusOperation('delete.do', this.state.dataSelect, this.lang('0046'));}
                })}	
				{/* {createNCModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{display: 'none'}}></iframe>	 */}
			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	mutiLangCode: moduleId
})(List);
export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/