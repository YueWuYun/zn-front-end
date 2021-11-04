//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 关账检查
 * @author	xuewenc
 */
import { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, promptBox } from 'nc-lightapp-front';
import Report from './report.js';
import {component} from '../../../public/platwapper/index.js';
const { NCTree } = component;
const { NCMessage, NCDropdown, NCMenu, NCCheckbox, NCPopconfirm, NCIcon ,NCDiv} = base;
const NCTreeNode = NCTree.NCTreeNode;

class Closecheck extends Component {
	constructor(props) {
		super(props);
		this.config = Object.assign(
			{
				treeId: 'closeTree',
				rootName: (props.config.checkconfig&&props.config.checkconfig.json['101006-000000'])?props.config.checkconfig.json['101006-000000']:'月结检查项类别',/* 国际化处理： 月结检查项类别*/
				accperiod: '', //会计期间
				treeData: [],
				urls: ''
			},
			props.config.checkconfig
		);

		//自定义根节点
		this.root = {
			isleaf: false,
			key: '~',
			title: this.config.rootName,
			id: '~',
			innercode: '~',
			pid: '',
			refname: this.config.rootName,
			refpk: '~'
		};

		this.state = {
			autoExpandParent: true,
			checkRes: {}, //检查结果
			itemvos: {}, //检查项
			expandedKeys: [ '~' ], //指定展开的节点(controlled)
			selectedKeys: [ '~' ], //指定选中的节点keys(controlled)
			comps: {},
			curComp: undefined,
			pk_checkitem: '', //月结检查项主键
			print : null,
			json : (props.config.checkconfig&&props.config.checkconfig.json['101006-000000']) ? props.config.checkconfig.json : {},
			isReport : false,  //是否为自由报表
			reportParam : {}   //功能节点id
		};

		this.initButtonVisib();
	}

	initButtonVisib(){
		if(this.isHasPrint()){
			this.props.button.setButtonsVisible(['Print','Output'], true);
		}else{
			this.props.button.setButtonsVisible(['Print','Output'], false);
		}
	}

	//是否有打印功能，应收应付费用现金暂无
	isHasPrint(){
		let moduleid = this.config['moduleid'];
		//by wangyongy
		if(moduleid==='2011' || moduleid==='3607' || moduleid==='2006' || moduleid==='2008' || moduleid==='3815'){//2011费用管理、3607现金管理、2006应收管理、2008应付管理、3815成本中心
			return false;
		}else{
			return true;
		}
	}

	/**
     * react 生命周期函数 组件渲染完后触发事件
     */
	componentDidMount() {
		if(this.config.isCheck){
			this.onCheckClose();
		}
	}

	onExpand = (expandedKeys) => {
		this.setState({
			expandedKeys,
			autoExpandParent: false
		});
	};

	/**
     * 处理树数据
     * @param data
     * @returns {*}
     */
	dealTreeData(data) {
		let deleteDataChildrenProp = function(node) {
			if (!node.children || node.children.length == 0) {
				delete node.children;
			} else {
				node.isLeaf = false;
				node.children.forEach((e) => {
					deleteDataChildrenProp(e);
				});
			}
		};
		data.forEach((e) => {
			deleteDataChildrenProp(e);
		});
		return data;
	}

	onButtonClick(props,id){
		switch (id) {
			case 'Check'://关账检查
				promptBox({
					color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['101006-000001'],/* 国际化处理： 询问*/
					content: this.state.json['101006-000002'],/* 国际化处理： 关账检查需要的时间可能比较长，确认关账检查？*/
					beSureBtnClick: ()=>{
						this.onCheckClose();
					}
				});
				break;
			case 'Print'://关账打印
				this.onPrintClose();
				break;
			case 'Output'://关账打印
				this.onOutputClose();
				break;
			case 'OneKeySign'://一键签字 库存专用
				this.oneKeySign();
				break;
			default:
                break;
		}
	}

	//关账检查
	onCheckClose() {
		ajax({
			url: '/nccloud/uapbd/org/DoCheckCloseAccNCCAction.do',
			data: this.config.data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						let { isPass, itemvos, checkRes, pk_checkitem } = data;
						let pkitems = [];
						this.setState(
							{
								checkRes: checkRes,
								itemvos: itemvos,
								expandedKeys: this.getCheckItemTypeIds(this.config.treeData), //指定展开的节点(controlled)
								selectedKeys: [ pk_checkitem ], //指定选中的节点keys(controlled)
								autoExpandParent: true,
								pk_checkitem: pk_checkitem
							},
							() => {
								this.selectTree({ refpk: pk_checkitem });
							}
						);
					}
				}
			}
		});
	}

	//关账打印
	onPrintClose() {
		//toast({content: '打印调用成功',color:'success'});
		this.state.print && this.state.print();
	}

	//关账预览
	onprintPreVIewClose() {
		this.state.printPreVIew && this.state.printPreVIew();
	}

	//关账输出
	onOutputClose() {
		this.state.output && this.state.output();
	}

	//一键签字 库存专用
	oneKeySign(){
		this.state.oneKeySign && this.state.oneKeySign();
	}

	//获取检查类别主键数组
	getCheckItemTypeIds(data) {
		let checkItemTypeIds = ['~'];
		let setCheckItemTypeId = function(node) {
			if (node.nodeData && node.nodeData['iSchecktypevo']) {//检查类别
				checkItemTypeIds[checkItemTypeIds.length] = node.refpk;
			}
			if (node.children && node.children.length>0) {
				node.children.forEach((e) => {
					setCheckItemTypeId(e);
				});
			}
		};
		data.forEach((e) => {
			setCheckItemTypeId(e);
		});
		return checkItemTypeIds;
	}

	//判断是否为检查类别
	isCheckItem(treeData, itempk) {
		let flag = false;
		for (let i = 0; i < treeData.length; i++) {
			let item = treeData[i];
			if (item['refpk'] === itempk && item.nodeData['iScheckitemvo']) {
				return true;
			}
			if (item.children) {
				flag = this.isCheckItem(item.children, itempk);
				if (flag) {
					return true;
				}
			}
		}
		return flag;
	}

	onSelectTree(key, e) {
		this.setState(
			{
				selectedKeys: key,
				pk_checkitem: key[0]
			},
			() => {
				this.selectTree({ refpk: key[0] });
			}
		);
	}

	/**
     * 点击树节点
     * @param refpk
     */
	selectTree({ refpk = '' } = {}) {
		//若不是检查项则不加载右侧检查界面
		let treeData = this.config.treeData;
		if (treeData.length == 0 || !this.isCheckItem(treeData, refpk)) {
			return;
		}
		let url = this.getUrl(treeData, refpk); //获得选中节点
		if (!url) {
			toast({ content: this.state.json['101006-000003'], color: 'danger' });/* 国际化处理： 未查询到此检查项对应的url，请检查是否填写！*/
			//url = '../../../../uapbd/orgcloseacc/closeaccbook/closecheck/nourlprompt';
			return;
		}

		if(url.indexOf('report##')!=-1 || url.indexOf('appid##')!=-1){//处理自由报表节点的检查项
			const funid =url.split('report##')[1];
			const appid =url.split('appid##')[1];
			ajax({
				url: '/nccloud/uapbd/org/QueryReportParambyFunid.do',
				data: {funid :funid,appid:appid},
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							let { appCode, pagecode, pk_report, flag, reportName } = data;
							if(flag==='1'){
								this.setState({
									isReport : true,
									reportParam : data
								},()=>{
									if(this.isHasPrint()){
										this.props.button.setButtonsVisible(['Print','Output'], false);
									}
								});
							}else{
								toast({ content: this.state.json['101006-000048'], color: 'warning' });/* 国际化处理： 需将此报表发布为web应用后，才可查看与检查！*/
								this.setState({
									isReport : false,
									reportParam : {}
								},()=>{

								});
							}
						}
					}
				}
			});
		}else{//处理非报表功能节点的检查项
			if (url.indexOf('../../../../') != -1) {
				url = url + '.js';
			} else {
				url = '../../../../' + url + '.js'; //'../../../../gl/public/components/reckoningReport/index'+'.js';
			}
			let moduleName = url.substring(12, url.length - 3);
			let script = document.createElement('script');
			script.src = url;
			script.type = 'text/javascript';
			script.onload = () => {
				debugger;
				let moduleClass = window[moduleName];
				if (!moduleClass) {
					toast({ content: 'load panel class error!', color: 'danger' });
					return;
				}
				this.state.comps[moduleName] = moduleClass.default;
				this.state.curComp = moduleClass.default;
				this.state.isReport = false;
				this.setState(this.state,()=>{
					if(this.isHasPrint()){
						this.props.button.setButtonsVisible(['Print','Output'], true);
					}
				});
			};
			script.onerror = () => {
				toast({ content: this.state.json['101006-000004'], color: 'danger' });/* 国际化处理： 检查界面js组件引入失败！*/
			};
			document.body.appendChild(script);
		}
		return;
	}

	//获取检查项url || 报表节点的功能主键associpoint
	getUrl(treeData, itempk) {
		let url = null;
		for (let i = 0; i < treeData.length; i++) {
			let item = treeData[i];
			if (item['refpk'] === itempk && item.nodeData['iScheckitemvo']) {
				//若checkclass为空则为自由报表
				if(item.nodeData['checkitemvo']['checkclass']){
					return item.nodeData['checkitemvo']['checkitem_url'];
				}else if(item.nodeData['checkitemvo']['associappid']){
					return 'appid'+'##'+item.nodeData['checkitemvo']['associappid']
				}else{
					return 'report'+'##'+item.nodeData['checkitemvo']['associpoint'];
				}
			}
			if (item.children) {
				url = this.getUrl(item.children, itempk);
				if (url) {
					return url;
				}
			}
		}
		return url;
	}

	//右侧区域dom
	createRightPanel() {
		if(this.state.isReport){

			let userdefObj = {
				pk_checkitem: this.state.pk_checkitem,
				period: this.config.selref_pk_accperiodmonth,
				pk_accountingbook: this.config.data.model1.rows[0].values.pk_checkaccbook.value,
				pk_org: this.config.data.exdata['pk_org'],
				moduleid: this.config.data.exdata['moduleid'], 
				selref_pk_accperiodmonth: this.config.data.exdata['selref_pk_accperiodmonth'],
				selref_accperiodmonth_name: this.config.data.exdata['selref_accperiodmonth_name'],
				isShowOnclose: this.config.data.exdata['isShowOnclose'],
				key_time_offset: this.config.data.exdata['key_time_offset'],
				data: this.config.data
			};

			let pk_financialOrg = this.config.data.exdata['pk_org'];
			let pk_org = this.config.data.model1.rows[0].values['pk_org'].value;
			let pk_storedoc = this.config.data.model1.rows[0].values['pk_storedoc'].value;
			let closeAccOrgPks = pk_org;
			if(userdefObj['moduleid']==='STOREDOC'){
				userdefObj['moduleid']='4008';
			}
			if(userdefObj['moduleid']==='2016'){
				closeAccOrgPks = this.config.data.model1.rows[0].values['pk_checkaccbook'].value;
			}else if(userdefObj['moduleid']==='3824'){
				closeAccOrgPks = this.config.data.model1.rows[0].values['pk_liabilitybook'].value;
			}else if(userdefObj['moduleid']==='2014'){
				closeAccOrgPks = this.config.data.model1.rows[0].values['pk_checkaccbook'].value+
				this.config.data.model1.rows[0].values['pk_costregion'].value;
			}

			if(userdefObj['moduleid']==='2016'){
				pk_org = closeAccOrgPks;
			}else if(userdefObj['moduleid']==='2014'){
				pk_org = closeAccOrgPks.substring(0,20);
			}

			switch (userdefObj['moduleid']) {
				case "2002": 
				case "2016": 
					userdefObj['pk_accountingbook'] = pk_org;
					break;
				case "2014": 
					userdefObj['pk_costorg'] = pk_org;
					break;
				case "STOREDOC": 
				case "4008":
					userdefObj['pk_inventory'] = pk_org;
					userdefObj['pk_store'] = pk_storedoc;
					break;
				case "3830": 
					userdefObj['pk_product'] = pk_org;
				case "3880": 
					userdefObj['pk_product'] = pk_org;
			}

			let config = {
				appcode: this.state.reportParam['appcode'],
				pagecode: this.state.reportParam['pagecode'],
				LinkReport: JSON.stringify({"logic":"and","conditions":[]}),
				reportName: this.state.reportParam['reportName'],
				userdefObj: userdefObj
			};
			return <Report {...config}/>;
		}else{
			var linkParam = {};
	
			let panel = this.state.curComp;
			let paramData = {
				pk_checkitem: this.state.pk_checkitem,
				period: this.config.selref_pk_accperiodmonth,
				pk_accountingbook: this.config.data.model1.rows[0].values.pk_checkaccbook.value,
				data: this.config.data,
				linkParam: linkParam,
				fthis : this,
				ref: (item) => {
					this.curCompInstance = item;
					this.linkParam = this.linkParam ? this.linkParam : linkParam;
				}
			};
			return !panel ? '' : panel(paramData);
		}
	}

	/**
     * 渲染
     * @returns {*}
     */
	render() {
		/**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
		const { asyncTree, syncTree, button, modal, search, DragWidthCom ,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
		//DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
		//const {createSyncTree} = syncTree;//创建同步树 需要引入这个
		let { createButtonApp } = button;

		let treedat = this.dealTreeData([ Object.assign({ ...this.root }, { children: this.config.treeData }) ]);
		const loop = (data) => 
			data.map((item) => {
				const name = item.refname;
				let icon = '';
				if (item.nodeData && item.nodeData['iSchecktypevo']) {
					//检查类别
					icon = <NCIcon type="uf-4square-3" />;
				} else if (item.nodeData && item.nodeData['iScheckitemvo']) {
					//检查项
					let flag = this.state.checkRes[item.refpk];
					icon = flag ? (
						//<NCIcon type="uf-pass" /> √
						<span style={{marginTop: 3,marginRight: 6}}>
							<div style={{display: 'flex',height: 15,width: 15,justifyContent: 'center',alignItems: 'center',overflow: 'hidden',borderRadius: 15}}>
								<i style={{color: '#69AC4E',fontSize: 24,marginTop: 5}} className="uf uf-pass-3"/>
							</div>
						</span>
					) : flag != undefined && flag != null && flag === false ? (
						item.nodeData['checkitemvo']['checkstrategy']=='1' ?
						 //<NCIcon type="uf-close-c" /> x
						 <span style={{marginRight: 6}}><i style={{color: '#F35118',fontSize: 17}} className="uf uf-close-c"/></span>
						 :
						 //<NCIcon type="uf-exc-c-2" /> !
						 <span style={{marginRight: 6}}><i style={{color: '#F35118',fontSize: 20}} className="uf uf-exc-c-2"/></span>
					) : (
						''
					);
				} else {
					//模块
					icon = <NCIcon type="uf-folder-o" />
				}
				const title = (
					<span style={{display: 'flex'}}>
						{icon}
						<span>{name}</span>
					</span>
				);
				if (item.children) {
					return (
						<NCTreeNode liAttr={{fieldid:(item.code||item.name||item.refname||item.refpk)+"_node"}} key={item.refpk} title={title}>
							{loop(item.children)}
						</NCTreeNode>
					);
				}
				return <NCTreeNode liAttr={{fieldid:(item.code||item.name||item.refname||item.refpk)+"_node"}} key={item.refpk} title={title} isLeaf={item.isLeaf} />;
			});

		let leftDom = (
			<NCDiv areaCode={NCDiv.config.TreeCom} fieldid = 'closecheck' className="tree-area">
				{/* {createSyncTree({
						treeId: this.config.treeId,
						needSearch: false,
						needEdit: false,
						onSelectEve: this.onSelectTree.bind(this),
						showModal:false
					})} */}
				<div style={{height: 380,overflow: 'auto'}}>
					<NCTree
						selectedKeys={this.state.selectedKeys} //指定选中的节点keys(controlled)
						onExpand={this.onExpand.bind(this)}
						expandedKeys={this.state.expandedKeys}
						autoExpandParent={this.state.autoExpandParent}
						onSelect={this.onSelectTree.bind(this)}
						openIcon= {<i class="icon iconfont icon-shu_zk tree-swich"></i>}/* 国际化处理： 树开关*/
						closeIcon= {<i class="icon iconfont icon-shushouqi tree-swich"></i>}/* 国际化处理： 树开关*/
					>
						{loop(treedat)}
					</NCTree>
				</div>
			</NCDiv>
		);
		let rightDom = <div className="card-area" style={this.state.isReport?{}:{overflow:'hidden'}}>{this.createRightPanel()}</div>;
		return (
			<div>
				{/* 头部 header*/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="header" style={{height:40,paddingBottom:0,marginTop:-15}}>
                    {
                        createBillHeadInfo(
                            {
                                title :this.state.json['101006-000006']+"："+this.config.accperiod /* 国际化处理： 会计期间*/,             //标题
                                initShowBackBtn:false
                            }
                        )}
					{/* 按钮组 btn-group*/}
					<div className="btn-group">
                        {createButtonApp({
                            area: "check-area",
							onButtonClick: this.onButtonClick.bind(this),
							modalRelation: "checkmodal"
                        })}
                    </div>
				</NCDiv>
				{/* 树卡区域 */}
				<div className="tree-card" style={{height: 420}}>
					<DragWidthCom
						leftDom={leftDom} //左侧区域dom
						rightDom={rightDom} //右侧区域dom
						defLeftWid="20%" // 默认左侧区域宽度，px/百分百
					/>
				</div>
			</div>
		);
	}
}

/**
 * 创建页面
 */
export default Closecheck;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65