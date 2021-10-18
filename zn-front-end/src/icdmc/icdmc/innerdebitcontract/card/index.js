/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, getMultiLang, ajax, base, toast, high, cardCache } from 'nc-lightapp-front';
import { buttonClick, initTemplate, pageInfoClick, afterTableEvent,pageClick } from './events';
import { afterSetData } from "../../public/cardEvent";
import { constant, requesturl, tabs } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import { orgVersionUtil } from '../config/orgVersionUtil';
import { getCardData } from "../../public/cardEvent";
let { NCBackBtn, NCAffix, NCScrollElement, NCDiv } = base;
let { getCacheById, updateCache, addCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
const { NCUploader, PrintOutput } = high;

class Card extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pageId = constant.cpagecode;
		this.searchId = constant.searchcode;
		this.formId = constant.formcode1;
		this.cache = constant.cardCache; //缓存key
		this.cacheDataSource = constant.cacheDataSource;
		this.tablecode_plan = constant.tablecode_plan;
		this.tablecode_exe = constant.tablecode_exe;
		this.cardUrl = requesturl.querycard;
		this.buttonVisible = buttonVisible.bind(this); //按钮显示控制
		this.pkname = constant.pkname;
		this.tabOrder = tabs.tabOrder; //tab区域code排序
		this.tabShow = tabs.tabShow; //默认显示tab
		this.tabCache = tabs.tabCache;
		this.treeId = "tree";
		this.state = {
			isPaste: false, //tabs处是否粘贴
			billId:'',//单据id
			billno: '' ,// 单据编号
			addid: '',
			oldorg:'',
			oldorgDis:'',
			showUploader: false, // 附件弹框
			target: null,
			outputData: '', // 输出数据
			showNCbackBtn: true, // 返回按钮
			json: {}, // 多语
			inlt: null
		};
	}

	//浏览器页签关闭提示
	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				// //console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({ moduleId: constant.mutiLangCode, domainName: 'icdmc', callback });
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}
	}

	componentDidMount() {
		let pageType = this.props.getUrlParam("pageType");
		if(pageType == "version"){
			this.initVersionTree();
		} else {
			this.renderHtmlByStatus();
		}
	}

	// 根据不同状态渲染不同数据
	renderHtmlByStatus = () =>{
		let flag=false;
		let pk = this.props.getUrlParam('id');
		let data = { pk: pk, pageCode: this.pageId };
		let urlstatus = this.props.getUrlParam('status');
		// orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
		let statusflag = urlstatus === 'browse' ? false : true;
		if(statusflag){
			this.setState({ showNCbackBtn: false});
			buttonVisible(this.props);
			//设置看片翻页的显隐性
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
		}

		//查询单据详情
		if (urlstatus === 'browse') {
			if(pk){
				this.browseRender(pk);
			}
		}
	}

	// 浏览态数据渲染
	browseRender = (pkbill) =>{
		// let cardData,billstatus,billno,pk_debitcontract_icdmc
		let cardData,billno,pk_debitcontract_icdmc
		if(pkbill){
			cardData = getCacheById(pkbill, this.cacheDataSource);
			let queryData =  { pk: pkbill, pageCode: this.pageId };
			if(cardData){
				this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });

				billno = cardData[this.formId].rows[0].values.vbillno.value;
				pk_debitcontract_icdmc = cardData[this.formId].rows[0].values[this.pkname].value;
				// billstatus = cardData[this.formId].rows[0].values.billstatus.value;
				buttonVisible(this.props);
				this.props.form.setFormStatus(this.formId, 'browse');
				this.setState({ 
					billno: billno,
					addid: pk_debitcontract_icdmc,
					showNCbackBtn: true
					});
				orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
			// }else{
				// let cardurl;
				// if(this.props.getUrlParam("pageType") == "apply"){// 内部借款申请联查内部借款合同
				// 	cardurl = '/nccloud/icdmc/innerdebitcontract/querybyapplypk';
				// } else {//列表跳卡片
				// 	cardurl = '/nccloud/icdmc/innerdebitcontract/querysingle';
				// }
				// getCardData.call(
				// 	this,
				// 	cardurl,
				// 	pkbill,
				// 	true
				// );
			}
		}else{
			this.emptyData();
		}
		
	}

	emptyData = () => {
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse',
			id: null
		});
		buttonVisible(this.props);
		this.setState({ 
			billno: null,
			addid: null,
			showNCbackBtn: true
		});
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}

	// 按钮点击后渲染数据
	buttonAfter(billdata){
	
		let billno = billdata[this.formId].rows[0].values.vbillno.value;
		let id = billdata[this.formId].rows[0].values[this.pkname].value;
		// let billstatus = billdata[this.formId].rows[0].values.billstatus.value;

		// 更新缓存
		updateCache(this.pkname,id,billdata,this.formId,this.cacheDataSource, billdata[this.formId].rows[0].values);

		this.setState({
			billno: billno,
			showNCbackBtn: true
		});
		//动态修改地址栏中的id的值
		this.props.setUrlParam({
			status: 'browse',
			id: id
		});
		this.props.form.setAllFormValue({
			[this.formId]: billdata[this.formId]
		});
		this.props.form.setFormStatus(this.formId, 'browse');
		// buttonVisible(this.props, billstatus);
		buttonVisible(this.props);
	}

	// 更改组织确认按钮
	ortBeSureBtnClick = () => {
	};

	// 组织修改取消
	orgCancelBtnClick = () => {
		this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		this.props.form.setFormStatus(this.formId, 'edit');
	};

	// 更改组织清空输入数据
	orgchangecleandata = () => {
	}

	// 清空组织，清空其他数据
	emptyorgcleandata = () =>{
		this.orgchangecleandata();
	}
	
	// 取消弹框取消按钮操作
	cancelModalCancel = () => {

	};
	
	// 返回方法
	backClick = () =>{
		window.onbeforeunload = null;
		let scene = this.props.getUrlParam("scene");
		this.props.pushTo(constant.listpath,{
			resource:'card',
			scene: scene
		});
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

    initVersionTree = callback => {
        const treeRoot = {
            isleaf: false,
            pid: "__root__",
            refname: this.state.json['36362IDC-000049'], /* 国际化处理： 版本号*/
            refpk: "-1"
        };
        ajax({
            url: requesturl.linkversiontree,
            data: {
                queryAreaCode: "search",
                querytype: "tree",
                querycondition: {},
                pageCode: this.pageId,
                pageInfo: { pageIndex: 0, pageSize: "100" },
                def1: String(this.props.getUrlParam("id")) //主键
            },
            success: res => {
                let { success, data } = res;
                if (success) {
                    let treeData = this.props.syncTree.createTreeData(data.data.rows);
                    this.setState(
                        {isVersion: true},
                        () => {
                            this.props.syncTree.setSyncTreeData(this.treeId, [
                                Object.assign(treeRoot, { children: treeData })
                            ]);
                        }
					);
					if(treeData != null){
						this.onTreeSelect(treeData[0].refpk, treeData[0]);
					}
					
                }
            }
        });
	};
	
	//同步树节点点击事件
	onTreeSelect = (key, data) => {
		if (key == "-1") {
			return;
		}
		this.props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
		ajax({
			url: requesturl.linkversiondetail,
			data: {
				pk: key,
				pageCode: this.pageId
			},
			success: res => {
				let { success, data } = res;
				if (success) {
                    if (data && data.head) {
                        this.props.form.setAllFormValue({[this.formId]: data.head[this.formId]});
                    }
                    if (data.bodys && JSON.stringify(data.bodys) !== "{}") {
                        this.props.cardTable.setAllTabsData(
                            data.bodys,
                            this.tabOrder,
                            afterSetData.bind(
                                this,
                                this.props,
                                Object.keys(data.bodys)
                            ),
                            Object.keys(data.bodys)
                        );
                    } else {
                        this.props.cardTable.setAllTabsData(
                            null,
                            this.tabOrder,
                            null,
                            []
                        );
                    }
                }
				// if (res) {
                //     if (res.data) {
                //         this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                //         let billno = res.data.head[this.formId].rows[0].values.vbillno.value;
                //         let id = res.data.head[this.formId].rows[0].values.pk_debitcontract_icdmc.value;
                //         // this.props.setUrlParam(pks)//动态修改地址栏中的id的值
                //         this.setState({ billno: billno });
                //         buttonVisible(this.props);
                //         updateCache(constant.pk_debitcontract_icdmc, id, this.formId, this.cacheDataSource);

                //         if(res.data.bodys){
                //             if(res.data.bodys[this.tablecode_plan]){
                //                 this.props.cardTable.setMulTablesData({ [this.tablecode_plan]: res.data.bodys[this.tablecode_plan] });
                //             } else {
                //                 this.props.cardTable.setMulTablesData({ [this.tablecode_plan]: { rows: [] } });
                //             }

                //             if(res.data.bodys[this.tablecode_exe]){
                //                 this.props.cardTable.setMulTablesData({ [this.tablecode_exe]: res.data.bodys[this.tablecode_exe] });
                //             } else {
                //                 this.props.cardTable.setMulTablesData({ [this.tablecode_exe]: { rows: [] } });
                //             }
                //         }
                //     }
                // } else {
                //     this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                //     this.props.cardTable.setMulTablesData({ [this.tablecode_plan]: { rows: [] } });
                //     this.props.cardTable.setMulTablesData({ [this.tablecode_exe]: { rows: [] } });
                // }
			}
		});
	};

	//同步树鼠标滑过事件
	onTreeMouseEnter = key => {
		this.props.syncTree.hideIcon(this.treeId, key, {
			delIcon: false,
			editIcon: false,
			addIcon: false
		});
	};

	tabsChange = key => {
		buttonVisible(this.props);
        // //console.log(
        //     `${this.state.json["36630BLC-000008"]}${key}${
        //         this.state.json["36630BLC-000009"]
        //     }-----`
        // ); /* 国际化处理： 当前切换到,区域了*/
        // if (this.props.getUrlParam("status") == "change") {
        //     if (key == "repayrule" || key == "syndicatedloan") {
        //         this.props.button.setButtonVisible(
        //             ["addRow", "deleteRow"],
        //             false
        //         );
        //     } else {
        //         this.props.button.setButtonVisible(
        //             ["addRow", "deleteRow"],
        //             true
        //         );
        //     }
        // } else {
        //     if (this.props.getUrlParam("status") == "browse") {
        //         this.props.button.setButtonVisible(
        //             ["addRow", "deleteRow"],
        //             false
        //         );
        //     } else {
        //         this.props.button.setButtonVisible(
        //             ["addRow", "deleteRow"],
        //             true
        //         );
        //     }
        // }
    };

	render() {
		let { form, cardPagination, table, cardTable, syncTree, button, DragWidthCom } = this.props;
		let { createForm } = form;
		let { createSimpleTable } = table;
		let { createCardTable, createTabsTable } = cardTable;
		let { createSyncTree } = syncTree;
		let { createButtonApp } = button;
		const { createCardPagination } = cardPagination;
		let { showUploader, target, billno, billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let pageType = this.props.getUrlParam("pageType");
		// let isLink = this.props.getUrlParam("scene") == "linksce";
		// let status = this.props.getUrlParam("status") === "browse";
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: this.props.getUrlParam("pageType") != "apply",
			showBillCode: true,
			billCode: billno || billId
		});

        let treeDom = (
            <div className="left-area" style={{ marginLeft: "20px" }}>
                {createSyncTree({
                    treeId: this.treeId, // 组件id
                    needEdit: false, //是否需要编辑
                    needSearch: false, //是否需要查询框，默认为true,显示。false: 不显示
                    onSelectEve: this.onTreeSelect.bind(this), //选择节点回调方法
                    //  showLine :false,  //是否显示连线，默认不显示
                    onMouseEnterEve: this.onTreeMouseEnter.bind(this), //鼠标滑过节点事件
                    defaultExpandAll: true, //默认展开所有节点
                    disabledSearch: true //是否显示搜索框
                })}
            </div>
        );
        /* 右卡片区域 */
        let cardFormDom = (
            <div class="nc-bill-card">
                <div className="nc-bill-top-area">
                    <div
                        // className={
                        //     pageType === "version"
                        //         ? "card-area"
                        //         : "nc-bill-form-area"
						// }
						className={"nc-bill-form-area"}
                    >
                        {createForm(this.formId, {
                            // onAfterEvent: afterEvent.bind(this),
                            // onBeforeEvent: beforeEvent.bind(this)
                        })}
                    </div>
                </div>
				<div className="nc-bill-bottom-area">
					<NCScrollElement name='businfo'>
						<div className="nc-bill-table-area">
								{createTabsTable(this.tablecode_plan, {
									cancelCustomRightMenu : true,
									tableHead: ()=>{},
									onAfterEvent: afterTableEvent.bind(this),
									onTabChange: this.tabsChange.bind(this),
									onSelected: ()=>{}, // 左侧选择列单个选择框回调
									onSelectedAll: ()=>{}, // 左侧选择列全选回调
									showCheck: true,
									showIndex: true,
									modelSave: ()=>{},
									modelAddRow: (props, moduleId, index) => {},
									modelDelRow: (props, moduleId) => {}
								})}
						</div>						
					</NCScrollElement>
				</div>
            </div>
        );

		return (
            <div
                className={
                    pageType === "version" ? "nc-bill-tree-card" : "nc-bill-card"
                }
            >
				<NCAffix>
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title: this.state.json['36362IDC-000019'], //标题/* 国际化处理： 内部借款合同*/
                            billCode: billno || billId, //单据号
                            backBtnClick: () => {           //返回按钮的点击事件
								this.backClick();
							}
                        })}
                    </div>
                    {pageType !== "version" && (
                        <div className="header-button-area">
                            {createButtonApp({
                               area: 'card_head',
							   buttonLimit: 7,
							   onButtonClick: buttonClick.bind(this),
                            })}
                        </div>
					)}
					{/* 附件 */}
					<div className="nc-faith-demo-div2">
						{/* 这里是附件上传组件的使用，需要传入三个参数 */}
						{showUploader && <NCUploader
								billId={billId}
								target={target}
								placement={'bottom'}
								billNo={billno}
								onHide={this.onHideUploader} // 关闭功能
								/>
						}
					</div>
                    {pageType !== "version" && (
                        <div
                            className="header-cardPagination-area"
                            style={{ float: "right" }}
                        >
                            {createCardPagination({
								handlePageInfoChange: pageClick.bind(this),
								dataSource: this.cacheDataSource
                            })}
                        </div>
                    )}
				</NCDiv>
				</NCAffix>
                {/* 树卡区域 */}
                {pageType === "version" ? (
                    <div className="tree-card">
                        <DragWidthCom
                            leftDom={treeDom} //左侧区域dom
                            rightDom={cardFormDom} //右侧区域dom
                            defLeftWid="20%" // 默认左侧区域宽度，px/百分百
                        />
                    </div>
                ) : (
                    cardFormDom
                )}

				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
			</div>
		);
	}
}

Card = createPage({
	billinfo:{
		tabs: true,
		billtype: 'extcard',//一主多子
		pagecode: constant.cpagecode,
		headcode: constant.formcode1,
		bodycode: [constant.tablecode_plan, constant.tablecode_exe],
		orderOfHotKey: ["head", "rationrate"]
    },
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(Card);

export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/