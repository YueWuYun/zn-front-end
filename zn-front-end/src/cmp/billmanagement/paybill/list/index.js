/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import {
	createPage,
	ajax,
	base,
	cacheTools,
	viewModel
} from 'nc-lightapp-front';

let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;

const {
	NCBreadcrumb,
	NCTabsControl,
	NCButton,
	NCDiv
} = base;
const NCBreadcrumbItem = NCBreadcrumb.NCBreadcrumbItem;
import {
	cardCache,
	getMultiLang
} from 'nc-lightapp-front';
let {
	setDefData,
	getDefData
} = cardCache;
// import JointBill from '../../../../sscrp/refer/jointbill/JointBillTableRef/JointBillModal';
//引入常量定义
import {
	PAYBILL_CONST
} from '../cons/constant.js';
import {
	SCENE,
	URL_PARAM
} from '../../../../tmpub/pub/cons/constant.js';
import {
	commonurl
} from '../../../public/utils/constant';
import {
	high
} from 'nc-lightapp-front';
const {
	ExcelImport
} = high;
const {
	Refer,
	NCUploader,
	BillTrack,
	ApproveDetail,
	PrintOutput,
	Inspection,
	ApprovalTrans
} = high;
import {
	buttonClick,
	initTemplate,
	searchBtnClick,
	pageInfoClick,
	tableModelConfirm,
	tableButtonClick,
	buttonUsability
} from './events';
//const { NCTabs } = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"
const NCTabPane = NCTabs.NCTabPane;
 import InvoiceLink from 'sscivm/ivmpub/components/invoice-link';
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
import  {go2Card}  from '../util/goToCard.js';
import { saveMultiLangRes,loadMultiLang } from '../../../../tmpub/pub/util';




class List extends Component {
	constructor(props) {
		super(props);

		this.moduleId = '2052';
		this.searchId = 'search_D5';
		this.tableId = 'table_D5';
		this.pageId = '36070PBR_D5_list';
		this.navChange = '0';
		this.selectedPKS = []; //导出数据的主键pk
		// this.compositedata=null;
		// this.compositedisplay=null;
		this.state = {
			currentLocale: 'zh-CN',
			numvalues: {},
			billno: null, // 单据编号
			showUploader: false,
			target: null,
			billId: '',
			billid: '',
			billtype: '',
			tradetype: '',
			tpflag: true,
			showBackTrace: false,
			showAppr: false,
			shoWIns: false,
			sourceData: null,
			last_pk: null,
			billCodeModalShow: false,
			billCode: '',
			compositedata: '',
			getAssginUsedr: '',
			compositedisplay: false,
			record: null,
			index: null,
			activeKey: '0',
			sscrpLinkInvoiceData: {},
			showmodal:false,
			showTradeBtn:true,
			sscivmMessage:'',
			outputData: {
				funcode: '36070PBM', //功能节点编码，即模板编码
				nodekey: 'NCCLOUD', //模板节点标识
				printTemplateID: '1001Z610000000004R6L', //模板id
				oids: [],
				outputType: 'output'
			}
		};
		//initTemplate.call(this, props);
	}

	componentDidMount() {


	}
	componentWillMount() {
		let callback = (json) => {
			this.setState({
				json
			});
			saveMultiLangRes(this.props, json); //缓存多语资源
			
			
			initTemplate.call(this, this.props);
 
		};
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [PAYBILL_CONST.appcode, '36070']
			},
			callback
		});
	}
	initData = () => {

		this.restoreData();
		//计划预算
		if (this.props.getUrlParam('pk_ntbparadimvo')) {
			setDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey, true);
			this.getLinkData();
			//fip 凭证
		} else if (this.props.getUrlParam('scene') === SCENE.FIP) {
			setDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey, true);
			this.voucherLinkBill();
			//资金联查单据 
			//
		} else if (this.props.getUrlParam('scene') === SCENE.LINK && this.props.getUrlParam(URL_PARAM.PK_SRC)) {
			setDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey, true);
			let pks = this.props.getUrlParam(URL_PARAM.PK_SRC);
			//let pks='1001Z610000000004L7U';
			this.linkQueryForFTS(pks);
			//联查场景
		} else if (this.props.getUrlParam('id') && !this.props.getUrlParam(URL_PARAM.PK_SRC)) {
			setDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey, true);
			this.linkGoToCard(this.props.getUrlParam('id'));
		}
	};
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	//联查列表
	linkQuery = (queryData) => {
		ajax({
			url: '/nccloud/cmp/paybills/querybypks.do',
			data: queryData,
			success: (res) => {
				let {
					success,
					data
				} = res;
				if (data) {
					this.props.table.setAllTableData(this.tableId, data[this.tableId]);
				}
			}
		});
	};
	//资金结算被联查
	linkQueryForFTS = (pks) => {
		let queryData = {
			pk: pks,
			pageid: '36070PBR_D5_list',
			card: false
		};
		ajax({
			url: '/nccloud/cmp/paybills/linkQueryForFTS.do',
			data: queryData,
			success: (res) => {
				let {
					success,
					data
				} = res;
				if (data) {
					if (data[this.tableId].rows.length > 1) {
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
					} else {
						this.linkGoToCard(data[this.tableId].rows[0].values.pk_paybill.value);
					}
				}
			}
		});
	};
	linkGoToCard = (id) => {
		this.props.pushTo('/card', {
			status: 'browse',
			id: id,
			scene: 'linksce',
			auto: true
		});
	};

	//联查单据
	GetQuery = (query) => {
		let theRequest = {};
		if (query.indexOf('?') != -1) {
			let str = query.substr(1);
			if (str.indexOf('&') != -1) {
				let strs = str.split('&');
				for (let i = 0; i < strs.length; i++) {
					theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
				}
			} else {
				theRequest[str.split('=')[0]] = str.split('=')[1];
			}
		}
		return theRequest;
	};
	linkQueryData = (searchData) => {
		let sendArr = {
			pks: searchData
		};
		ajax({
			url: '/nccloud/cmp/paybills/linkqueryrecbill.do',
			data: sendArr,
			success: (res) => {
				let {
					success,
					data
				} = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, {
							rows: []
						});
					}
				}
			}
		});
	};
	getLinkData = (serval) => {
		ajax({
			url: '/nccloud/cmp/paybills/linkplanquery.do',
			data: {
				pk: this.props.getUrlParam('pk_ntbparadimvo'),
				pageCode: this.pageId
			},
			success: (res) => {
				let {
					success,
					data
				} = res;
				if (success) {
					if (data.grid) {
						if (data.grid[this.tableId].rows.length > 1) {
							this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
							if (data.statusNum) {
								this.setState({
									numvalues: data.statusNum
								});
							}
						} else {
							this.linkGoToCard(data.grid[this.tableId].rows[0].values.pk_paybill.value);
						}

					} else {
						this.props.table.setAllTableData(this.tableId, {
							rows: []
						});
					}
				}
			}
		});
	};

	// 凭证联查单据
	voucherLinkBill = () => {
		let checkedData = [];
		//缓存中的key为’checkedData’,
		checkedData = cacheTools.get('checkedData');
		if (checkedData && checkedData.length > 0) {
			let data = {
				operatingLogVO: checkedData,
				pageCode: PAYBILL_CONST.list_page_id
			};
			ajax({
					url: '/nccloud/cmp/paybills/voucherLinkBill.do',
					data: data,
					success: (res) => {
						let {
							success,
							data
						} = res;
						if (success) {
							if (data.grid) {
								if (data.grid[this.tableId].rows.length > 1) {
									this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
								} else {
									this.linkGoToCard(data.grid[this.tableId].rows[0].values.pk_paybill.value);
								}
							} else {
								this.props.table.setAllTableData(this.tableId, {
									rows: []
								});
							}
						}
					}
				
			});
	}
};
//serval
getData = (groupCondition) => {
	let oid = PAYBILL_CONST.oid;
	if (this.props.meta.getMeta()[this.searchId].oid) {
		oid = this.props.meta.getMeta()[this.searchId].oid; //动态获取oid
	}
	let searchVal = getDefData(PAYBILL_CONST.search_key, PAYBILL_CONST.paybillCacheKey);

	if (!searchVal) {
		return;
	}

	let pageInfo = this.props.table.getTablePageInfo(this.tableId);
	let conditions = Array.isArray(groupCondition) ? groupCondition : [groupCondition];
	let data = {
		querycondition: searchVal,
		custcondition: {
			logic: 'or', //逻辑操作符，and、or
			conditions
		},
		pageInfo: {
			pageIndex: 0,
			pageSize: 10
		},
		pagecode: this.pageId,
		queryAreaCode: this.searchId,
		oid: oid,

		querytype: 'tree'
	};
	ajax({
		url: '/nccloud/cmp/paybills/query.do',
		data: data,
		success: (res) => {
			let {
				success,
				data
			} = res;
			if (success) {
				//this.props.table.setAllTableData(this.tableId, res.data[this.tableId]);
				if (data.grid) {
					this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
					this.setState({
						last_pk: data.grid[this.tableId].allpks[0]
					});
				} else {
					//this.props.table.setAllTableData(this.tableId, { rows: [] });
					this.props.table.setAllTableData(this.tableId, {
						rows: [],
						pageInfo: {
							pageIndex: 0,
							pageSize: 10,
							total: 0,
							totalPage: 0
						}
					});
				}
				if (data.statusNum) {
					this.setState({
						numvalues: data.statusNum
					});
				}
			}
		}
	});
};

refresh = () => {
	let search_Id = 'search_D5';
	let table_Id = 'table_D5';
	let page_Id = '36070PBR_D5_list';
	let oid = PAYBILL_CONST.oid;
	if (this.props.meta.getMeta()[this.searchId].oid) {
		oid = this.props.meta.getMeta()[this.searchId].oid; //动态获取oid
	}
	//查询condition
	let pageInfo = props.table.getTablePageInfo(table_Id);
	let refreshsearchVal = props.search.getAllSearchData(search_Id);
	let data = {
		querycondition: refreshsearchVal,
		custcondition: {
			logic: 'and', //逻辑操作符，and、or
			conditions: []
		},
		pageInfo: pageInfo,
		pagecode: '36070PBR_D5_list',
		queryAreaCode: 'search_D5', //查询区编码
		oid: oid,
		querytype: 'tree'
	};
	ajax({
		url: '/nccloud/cmp/paybills/query.do',
		data: data,
		success: (res) => {
			let {
				success,
				data
			} = res;
			if (success) {
				if (data) {
					props.table.setAllTableData(table_Id, data.grid[table_Id]);
					this.setState({
						last_pk: data.grid[this.tableId].allpks[0]
					});
					if (data.statusNum) {
						this.setState({
							numvalues: data.statusNum
						});
					}
				} else {
					props.table.setAllTableData(table_Id, {
						rows: []
					});
				}
			}
		}
	});
};
closeApprove = () => {
	this.setState({
		showAppr: false
	});
};
cancel = () => {
	this.setState({
		shoWIns: false
	});
};
closeModal = () => {
	this.setState({
		billCodeModalShow: false
	});
};

affirm = (info) => {
	console.log(info);
	this.setState({
		shoWIns: false
	});
};

// 附件的关闭点击
onHideUploader = () => {
	this.setState({
		showUploader: false
	});
};

setStateCache = () => {
	let thisstate = this.state;
	setDefData(PAYBILL_CONST.paybill_stateKey, PAYBILL_CONST.paybillCacheKey, thisstate);
};

// 还原列表页数据
restoreData = () => {
	//获取页签数据
	let cachestate = getDefData(PAYBILL_CONST.paybill_stateKey, PAYBILL_CONST.paybillCacheKey);
	if (cachestate) {
		let keys = Object.keys(cachestate);
		for (let i = 0, l = keys.length; i < l; i++) {
			let key = keys[i];
			if(key!='sscrpLinkInvoiceData'){
				this.state[key] = cachestate[key];
			}
		
		}
	}
};
// 查询区渲染完成回调函数
renderCompleteEvent = () => {
	let cachesearch = getDefData(PAYBILL_CONST.search_key, PAYBILL_CONST.paybillCacheKey);
	if (cachesearch && cachesearch.conditions) {
		// this.props.search.setSearchValue(this.searchId, cachesearch);
		for (let item of cachesearch.conditions) {
			if (item.field == 'bill_date') {
				// 时间类型特殊处理
				let time = [];
				time.push(item.value.firstvalue);
				time.push(item.value.secondvalue);
				this.props.search.setSearchValByField(this.searchId, item.field, {
					display: item.display,
					value: time
				});
			} else {
				this.props.search.setSearchValByField(this.searchId, item.field, {
					display: item.display,
					value: item.value.firstvalue
				});
			}
		}
	}
};
//指派
getAssginUsedr = (value) => {
	if (this.state.record) {
		this.setState({
				getAssginUsedr: value
			},
			() => {
				tableButtonClick.call(
					this,
					this.props,
					'tableCommitConfirm',
					null,
					this.state.record,
					this.state.index
				);
			}
		);
	} else {
		this.setState({
				getAssginUsedr: value
			},
			() => {
				buttonClick.call(this, this.props, 'CommitConfirm');
			}
		);
	}
};
turnOff = () => {
	this.setState({
		compositedisplay: false
	});
};

DoubleClick = (record, index, props, e) => {
	let ISlINK = getDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey);
	if (ISlINK) {
		go2Card(props,{
			status: 'browse',
			id: record.pk_paybill.value,
			scene: 'link'
		} ,{} );

	} else {
		this.setStateCache();

		go2Card(props,{
			status: 'browse',
			id: record.pk_paybill.value,
			bill_status: record.bill_status.value,
			is_cf: record.is_cf.value
		} ,{} );
	}
}
//页签筛选
navChangeFun = (status, className, e) => {
	let groupCondition;
	buttonUsability.call(this, this.props, status);
	switch (status) {
		case '0':
			this.setState({
				activeKey: '0'
			});
			groupCondition = PAYBILL_CONST.SAVED;
			this.getData(groupCondition);
			break;

		case '2':
			//this.navChange = '2';
			this.setState({
				activeKey: '2'
			});
			groupCondition = PAYBILL_CONST.APPROVING;
			this.getData(groupCondition);
			break;
		case '3':
			this.setState({
				activeKey: '3'
			});
			groupCondition = [];
			this.getData(groupCondition);
			break;
	}
};

render = () => {
	let numvalues = this.state.numvalues;
	let {
		table,
		button,
		search,
		BillHeadInfo
	} = this.props;

	let {
		createSimpleTable,
		getTablePageInfo
	} = table;
	
	let {
		NCCreateSearch
	} = search;
	let {
		createButton,
		getButtons,
		createButtonApp
	} = button;
	const {
		ncmodal
	} = this.props;
	//const { modal } = this.props;
	let {
		createModal
	} = ncmodal;
	const {
		createBillHeadInfo
	} = BillHeadInfo;
	let ISlINK = getDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey);

	let {
		showUploader,
		target,
		billno,
		billId,
		activeKey,
		showTest
	} = this.state; //附件相关内容变量

	let billTypeName =loadMultiLang(this.props, '36070PBR-000089') ;
	if(getGlobalStorage('sessionStorage','billTypeName')){
		billTypeName=getGlobalStorage('sessionStorage','billTypeName');
	}	
	let testMessage =loadMultiLang(this.props, '36070PBR-000035') ; // 弹框表头信息/* 国际化处理： 确认删除*/
	return ( 
		<div className = "nc-bill-list" > 
		{/**创建websocket连接 */}
		{api.comm.createListWebSocket(this.props, {
			tableAreaCode: cons.list.tableCode,
			tablePkName: cons.field.pk,
			billtype: cons.comm.billType
			// serverLocation: '10.16.2.231:9991'
        })}
		{
			/** 渲染标题栏 **/ } 
			<NCDiv areaCode = {NCDiv.config.HEADER} className = "nc-bill-header-area" >		
		<div className = "header-title-search-area" > {
			createBillHeadInfo({
				title: billTypeName,
				initShowBackBtn: false
			})
		} 
		</div> 
		<div className = "header-button-area" >
		
		<div className = "button-app-wrapper" > {
			this.state.tpflag &&!ISlINK &&this.state.showTradeBtn&& ( 
				<Refer placeholder = {loadMultiLang(this.props, '36070PBR-000032')
				} /* 国际化处理： 单据模板类型*/
				refName = {loadMultiLang(this.props, '36070PBR-000033')
				} /* 国际化处理： 付款交易类型*/
				refCode = {
					'tradetype001'
				}
				refType = {
					'grid'
				}
				queryGridUrl = {
					'/nccloud/riart/ref/fiBillTypeTableRefAction.do'
				}
				columnConfig = {
					[{
						name: [
							loadMultiLang(this.props, '36070PBR-000034'),
							loadMultiLang(this.props, '36070PBR-000032')
						] /* 国际化处理： 单据编号,单据模板类型*/ ,
						code: ['refcode', 'refname']
					}]
				}
				queryCondition = {
					{
						parentbilltype: 'F5' //过滤条件
					}
				}
				value = {
					this.state.tradetype
				}
				onChange = {
					(value) => {
						this.setState({
								tradetype: value
							},
							function () {

								setGlobalStorage('sessionStorage', 'sessionTP',	JSON.stringify(this.state.tradetype));
								// setGlobalStorage('sessionStorage', 'sessionTP', JSON.stringify(this.state.tradetype), ()=>{
								// 	//存储缓存失败的处理函数
								// 	//联查需要处理缓存存储失败的情况，失败时，把缓存信息转后台存放
								// });
								
								
							}
						);
					}
				}
				isMultiSelectedEnabled = {
					false
				}
				clickContainer = {
					
					<NCButton fieldid = 'trade_type' > {
						loadMultiLang(this.props, '36070PBR-000033')
					} 
					</NCButton>
				} /* 国际化处理： 付款交易类型*/
				/>
			)
		} 
		</div> 
		<div > {
			createButtonApp({
				area: 'list_head',
				buttonLimit: 12,
				onButtonClick: buttonClick.bind(this)
				//popContainer: document.querySelector('.header-button-area')
			})
		} 
		</div> 
		</div> 
		</NCDiv> {
			!ISlINK && ( 
				<div className = "nc-bill-search-area" > {
					NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						// defaultConditionsNum: 2,
						showAdvBtn: true //  显示高级按钮
						//onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
						//searchBtnName: multiLang && multiLang.get('3618-0029')
						//renderCompleteEvent: this.renderCompleteEvent
						//    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom
						// addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom
					})
				} 
				</div>
			)
		} {
			/* <div style={{ borderTop: '1px solid #CCC' }} /> */ }
			 {!ISlINK && ( 
				<div className = "tab-definInfo-area" >
				
				<NCTabs activeKey = {
					activeKey
				}
				onChange = {
					(v) => {
						this.navChangeFun.call(this, v);
					}
				} >
				
				<NCTabPane key = {
					'0'
				}
				tab = {
					<span>
					  {	loadMultiLang(this.props, '36070PBR-000090') +'(' }
					  <span>{((numvalues && numvalues.SAVED) || 0) }</span>{')'}
					</span>
				}		
				/>
				<NCTabPane key = {
					'2'
				}
				tab = {
					<span>
					    {loadMultiLang(this.props, '36070PBR-000092') +'(' }
					    <span>{((numvalues && numvalues.APPRING) || 0) }</span>{')'}
				  </span>
				}
				/> 
				<NCTabPane key = {
					'3'
				}
				tab = {
					<span>{loadMultiLang(this.props, '36070PBR-000093')}
					</span>
				}
				/> 
				</NCTabs> 
				</div>
			)
		} 
		<div className = "nc-bill-table-area" > {
			createSimpleTable(this.tableId, {
				handlePageInfoChange: pageInfoClick.bind(this),
				tableModelConfirm: tableModelConfirm,
				onRowDoubleClick: this.DoubleClick.bind(this),
				showCheck: true,
				showIndex: true,
				dataSource: PAYBILL_CONST.paybillCacheKey,
				pkname: PAYBILL_CONST.paybill_pkname,
				onSelected: buttonUsability.bind(this, this.props, null),
				onSelectedAll: buttonUsability.bind(this, this.props, null),
				componentInitFinished: () => {
					//缓存数据赋值成功的钩子函数
					//若初始化数据后需要对数据做修改，可以在这里处理
					
					buttonUsability.call(this, this.props, '');
					
				}
			})
		}
		</div> 
		<div className = "nc-faith-demo-div2" > {
			/* 这里是附件上传组件的使用，需要传入三个参数 */ } {
			showUploader && ( 
				<NCUploader billId = {
					billId
				}
				target = {
					target
				}
				placement = {
					'bottom'
				}
				billNo = {
					billno
				}
				onHide = {
					this.onHideUploader
				}
				customInterface = {
					{
						queryLeftTree: commonurl.lefttreequery,
						queryAttachments: PAYBILL_CONST.upload_url
					}
				}


				/>
			)
		} 
		</div> 
		<div>	
		<BillTrack show = {
			this.state.showBackTrace
		}
		close = {
			() => {
				this.setState({
					showBackTrace: false
				});
			}
		}
		pk = {
			billId
		} //单据id
		type = "F5" //单据类型
		/>
		
		</div> 
		<div>
		
		<PrintOutput ref = "printOutput"
		url = "/nccloud/cmp/paybills/paybillsprint.do"
		data = {
			this.state.outputData
		}
		callback = {
			this.onSubmit
		}
		/> 
		</div> 		
		<div>
		
		<ApproveDetail billtype = {
			this.state.billtype
		}
		billid = {
			this.state.billid
		}
		show = {
			this.state.showAppr
		}
		close = {
			this.closeApprove
		}
		/> 
		</div> 


		<div>
		
		<Inspection show = {
			this.state.shoWIns
		}
		sourceData = {
			this.state.sourceData
		}
		cancel = {
			this.cancel.bind(this)
		}
		affirm = {
			this.affirm.bind(this)
		}
		/> 
		</div> 
		<div>
		
		<div>
         <InvoiceLink 
          {...this.state.sscrpLinkInvoiceData}
        table={this.props.table}
         />
	</div> 

		
		</div>  
		<div> {
			this.state.compositedisplay ? ( 
				<ApprovalTrans title = {
					loadMultiLang(this.props, '36070PBR-000114')
				}
				data = {
					this.state.compositedata
				}
				display = {
					this.state.compositedisplay
				}
				getResult = {
					this.getAssginUsedr
				}
				cancel = {
					this.turnOff
				}
				/>
			) : (
				''
			)
		} 
		</div> 
		<div> {
			/* {导入} */ } {
			createModal('importModal', {
				noFooter: true,
				className: 'import-modal',
				hasBackDrop: false,
			})
		} 
		<ExcelImport {
			...Object.assign(this.props)
		}
		moduleName = "cmp" //模块名
		billType = {
			'F5'
		} //单据类型
		pagecode = '36070PBR_D5_card'
		appcode = {
			PAYBILL_CONST.appcode
		}
		selectedPKS = {
			this.selectedPKS
		}
		/> 
		</div> 
		<div/> {
			createModal('delmodal', {
				title: testMessage,
				content: loadMultiLang(this.props, '36070PBR-000036'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
				beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
				cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
				userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
				noFooter: false, //是否需要底部按钮,默认true
				rightBtnName: loadMultiLang(this.props, '36070PBR-000037'),//左侧按钮名称,默认关闭/* 国际化处理： 取消*/
				leftBtnName:loadMultiLang(this.props, '36070PBR-000038'),//右侧按钮名称， 默认确认/* 国际化处理： 确认*/
			})
		} {
			createModal('delete', {
				title: loadMultiLang(this.props, '36070PBR-000035'),	 /* 国际化处理： 确认删除*/ 
				content: loadMultiLang(this.props, '36070PBR-000036'),//this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
			})
		} 
		</div>
	);
};
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: '36070PBR',
	domainName:'cmp'
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));
export default List;
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/