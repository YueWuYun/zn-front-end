//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { base, high,ajax ,toast} from 'nc-lightapp-front';
import {component} from '../../../public/platwapper/index.js'; const {Refer} = component;
const { PopRefer,MultiLangWrapper } = high.Refer, // 引入PopRefer类
      { NCRadio: Radio ,NCTree, NCMenu, NCDropdown,NCButton, NCFormControl,NCCheckbox,NCPopover} = base,
      { NCRadioGroup: RadioGroup } = Radio;
const TreeNode = NCTree.NCTreeNode;
import './index.less';
class ReferTree extends Component {

	static defaultProps = {
		defaultExpandAll: false
    };
    
	constructor(props) {
		super(props);
		this.showed = false;
		this.state = {
			datas: [],
			searchValue: undefined
		};
	}
	componentWillMount() {
		this.state.datas = this.props.data;
		this.setState(this.state);
	}

	componentWillReceiveProps(nextProps) {
		this.state.datas = nextProps.data;
		this.state.searchValue = nextProps.searchValue;
		this.setState(this.state);
	}
	onExpand(){
		console.log('onExpand');
	}
	render() {
		// var renderTitle = (item) => {
		// 	return item.refpk == 'root' ? item.refname :  item.nodeData.nodecode + ' ' + item.nodeData.nodetitle;
		// }
		// const { data, ...otherProps } = this.props;
		// const loop = (datas) => datas.map((item) => {
		// 	var children = item.children || [];
        //     return (<NCTree.NCTreeNode title={renderTitle(item)} key={item.refpk} isLeaf={children.length == 0}  treeNodeData={item.nodeData|| {}} nodeData={item.nodeData|| {}} >{children.length == 0? '' :loop(children)}</NCTree.NCTreeNode>)
        // });
		// return (
		// 	<NCTree{...otherProps}>{loop(this.state.datas)}</NCTree>
		// );
		//---------------------------------------------------------------
		 const { data, ...otherProps } = this.props;
		var textValue = this.state.searchValue;
        var renderTreeTitle = (item, icon) => {
			
			var isLeaf = !item.children  || item.children  == 0,
				isExpand = this.props.expandedKeys.includes(item.refpk);
				
				
            // if(item && item.hasOwnProperty('children')&& item.children.length !=null){
            //     className = this.props.expandedKeys.includes(item.refpk)?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia";
            // }else{
            //     className = "refer-tree-point";
            // }
            var drawTitleString = (title,icon) =>{
				let className = icon?(isLeaf?"refer-tree-point":isExpand?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia"):'';
                if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ){
                    var start = title.indexOf(textValue) , end = start + textValue.length;
                    return (
						[<span className={className} />,
							<span className='refer-tree-title' style={{margin:0,padding:0,border:'none'}}>
								<span>
									{title.substring(0, start)}
								</span>
								<span style={{ 'color':'#f50','transition':'all .3s?ease','font-weight': 'bold'}} className="uapbd-cashflow-treefilter-highlight" >
								{textValue}
								</span>
								<span>{title.substring(end, title.length)}</span>
							</span>
						]
					)
                }else{
                    return [
                        <span className={className}/>,<span className='refer-tree-title'  style={{margin:0,padding:0,border:'none'}}>{title}</span>
                    ];
                }
            };
            var title = item.refpk == 'root' ? ' ': item.nodeData.nodetitle;
            var code = item.refpk == 'root' ? '' : item.nodeData.nodecode;

            return [drawTitleString(code, true),<span className='refer-tree-title'  style={{margin:0,padding:0,border:'none'}} >&nbsp;&nbsp;</span>,drawTitleString(title, false)];
        };
		const loop = (datas, pdata) => {
            return  datas.filter( item => {
                return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
            }).map((item) => {
                var children = item.children || [];
                return (<NCTree.NCTreeNode liAttr={{"fieldid":item.refpk == 'root'? "root_node":item.nodeData.nodecode+"_node"}} title={renderTreeTitle(item)} key={item.refpk} isLeaf={children.length == 0}  treeNodeData={item.nodeData|| {}} nodeData={item.nodeData|| {}} >{children.length == 0 ? '': loop(children)}</NCTree.NCTreeNode>);    
            });
		};
		return (
			<div className='refer-tree-wrapper refer-tree-wrapper-use-style'><div className='refer-tree-container'><NCTree {...{focusable:true,tabIndexValue:4}} {...otherProps}>{loop(this.state.datas)}</NCTree></div></div>
		);
	}
}

class Ref extends PopRefer { // 继承PopRefer类
    constructor(props) {
		super(props);
		this.interval = 0;
        this.state = {
			...this.state, // 继承state
			uapbdselftreedata: [],
			uapbdselfexpandedKeys:[],
			treetype: 'type',
			textValue: undefined,
			subOrg:{
				defaultChecked :false,
				checked : false,
				tabIndex: this.getTabIndex(this.hotKeyElement.includeChildren),
				onKeyDown: this.resetHotKeyLoop.bind(this, this.hotKeyElement.includeChildren),
                onChange: (val) => {
					this.state.subOrg.checked = val;
					this.state.includeChildren = val;
                    this.setState(this.state, () =>{});
                }
			},
			mshowoff:{
				defaultChecked :false,
				checked : false,
				tabIndex: this.getTabIndex(this.hotKeyElement.showDisabledData),
				onKeyDown: this.resetHotKeyLoop.bind(this, this.hotKeyElement.showDisabledData),
                onChange: (val) => {
					this.state.mshowoff.checked = val;
                    this.setState(this.state, () =>{
						this.onTreeTypeChange(this.state.treetype);
					});
                }
			},
			refGroup: {
				value: undefined,
				refType: 'tree',
				refName: '集团(所有)',
				placeholder: '集团(所有)',
				refCode: 'uapbd.org.GroupDefaultTreeRef',
				queryTreeUrl: '/nccloud/uapbd/ref/GroupDefaultTreeRef.do',
				treeConfig: { name: ['编码', '名称'], code: ['refcode', 'refname'] },
				rootNode: { refname: '集团(所有)', refpk: 'root' },
				isMultiSelectedEnabled: false,
				onChange:(val) =>{
					this.state.refGroup.value = val;
					this.setState(this.state, () => {
						this.onTreeTypeChange(this.state.treetype);
					});
				}
			},
			search:{
				className :'AccountBookTreeref-Search',
				valueTemp: undefined,
				value: undefined,
				placeholder: '账簿编码/账簿名称',
				tabIndex: this.getTabIndex(this.hotKeyElement.treeSearchInput),
				onKeyDown: this.resetHotKeyLoop.bind(this, this.hotKeyElement.treeSearchInput),
				onChange: (value) => {
					this.interval = new Date().getTime();
					let s = setTimeout(() => {//停止输入0.5s后执行
							if (new Date().getTime() - this.interval >= 500) {
								this.state.search.value = this.state.search.valueTemp;
								this.setState(this.state,() =>{
									//this.state.search.onSearch();
								});
							}
							clearTimeout(s);
					}, 500);
					this.state.search.valueTemp = value;
					this.setState(this.state);
				},
				onSearch:() =>{
					var textValue = this.state.search.value || '',
						expandKeys =[];
					const loopsearch = (nodes = []) => {
						var parendExpand = false;
						(nodes || [] ).forEach(child => {
							var expand = loopsearch( child.children || [] );
							child.needExpand = expand;
							child.needShow = expand ? true: ( !textValue || textValue.length == 0 ||  child.nodeData.nodedata == 'nodeclass'|| child.nodeData.nodecode.indexOf(textValue) != -1 || child.title.indexOf(textValue)  != -1? true: false);
							parendExpand = parendExpand ? parendExpand :child.needShow;
							if(expand){
								expandKeys.push(child.key);
							}
						});
						return parendExpand;
					}

					var rootExpand = loopsearch(this.state.treeData|| []);
					expandKeys.push('root');
					this.state.expandedKeys = textValue && textValue.length != 0 ? expandKeys :[];
					this.setState(this.state);
				}
			}
		};

		this.selectRootKeys =[];
		this.showGroup = props.showGroup;
		this.showInCludeChildren = props.showInCludeChildren;
		this.disabledDataShow = props.disabledDataShow || false;
    }

    onTreeTypeChange = (value) =>{
		this.state.treetype = value;
		this.setState(this.state, () => {
			this.loadTreeData(this.getParam()).then((data) => {
				var rootTitle = value === 'type' ? '账簿类型': '主账簿'
				var root = {
					refname: rootTitle,
					refpk: 'root'
				};
                this.setTreeData('treeData', root, data);
            });

		});
	};
	
	show = () => {
		let { disabled, isTreelazyLoad, idKey } = this.props;
		if (disabled) {
			return false;
		}
		!this.hasOwnProperty('prevOverFlow') && (this.prevOverFlow = document.body.style.overflow);
		//清空查询
		this.setState({
			isShow: true,
			isFirstShow: false,
			dropDownShow: false,
			isSelectedShow: false,
			searchVal: '',
			treeSearchVal: '',
			selectedShow: false
		},() =>{

			// this.state.search.valueTemp = undefined;
			// this.state.search.value = undefined;
			this.setState(this.state, () => {
				let { disabled, isTreelazyLoad, idKey } = this.props,
				{ selectedValues, isFirstShow, treeData, selectedKeys, activeKey, expandedKeys } = this.state;
				console.log('优先获取',selectedKeys, '--', expandedKeys);
				if (disabled) {
					return false;
				}
				document.body.style.overflow = 'hidden';
				//缓存旧数据，做取消用
				let { refType, isCacheable, queryGridUrl, queryTreeUrl, rootNode, pageSize } = this.props,
					{ tableData, isSearch, searchVal, isTreeSearch, treeSearchVal } = this.state,
					param;
				// if (isFirstShow) {
				if (refType === 'grid') {
					param = this.__getParam({
						pageInfo: tableData[0].page
					});
					// isSearch && (param.keyword = searchVal);
					this.loadAndSetTableData(param);
				} else {
					param = this.__getParam({
						pid: isTreelazyLoad ? rootNode[idKey] : '',
						pageInfo: {
							pageSize,
							pageIndex: -1
						}
					});
					// isTreeSearch && (param.keyword = treeSearchVal);
					this.loadAndSetTreeDataRewrite(param, rootNode, ()=>{
						console.log('最终优先获取',this.state.selectedKeys, '--', this.state.expandedKeys);
						this.setState({
							tableData,
							expandedKeys:expandedKeys
						});
					});
					
					
				}
				setTimeout(() => {
					this.popWindow && this.popWindow.focus();
				}, 0);
			});
		});
	};

	loadAndSetTreeDataRewrite = (_param, rootNode,callback) => {
		let param = this.__getParam(_param);
		this.loadTreeData(param).then(data => {
			this.setTreeData('treeData', rootNode, data, callback);
		});

		// this.state.search.valueTemp = undefined;
		// this.state.search.value = undefined;
		
		// var handlerAfter = () => {
			
		// };
		// this.setState(this.state, () => {
		// 	handlerAfter();
		// });
	};

    getParam = (param = {}) => {
		var { queryCondition } = this.props,
		queryCondition = queryCondition ? typeof queryCondition === 'function' ? queryCondition(): typeof queryCondition === 'object' ? queryCondition : {}: {};
		var groupParam= {};
		if(this.props.showGroup){
			groupParam = { refpkGroup: this.state.refGroup.value && this.state.refGroup.value.refpk ? this.state.refGroup.value.refpk : '-1', showGroup: true };
		}
		return {
			queryCondition: {
				...queryCondition, 
				treetype: this.state.treetype, 
				textValue: this.state.textValue,
				...groupParam,
				isshow: this.state.isShow,
				disabledDataShow: this.props.disabledDataShow ? (this.state.mshowoff.checked || false) : false
			},
			pageInfo:{pageSize: 10, pageIndex: 1}, //放置报错
			
		};
    };

	loadTreeData = async (param) => {
		return await new Promise((resolve) => {
			this.setState({loading: true},() => {
				let { currentLevel, referVal } = this.state;
				let { queryTreeUrl, queryCondition, isCacheable } = this.props;
				//判断是否启用了集团，
				ajax({
					url: queryTreeUrl,
					data: param,
					loading: false,
					success: (res) => {
						this.setState({loading: false}, () =>{
							if (!res.success) {
								throw new Error(res.error.message);
								return;
							}
							// res.data.datarows.forEach((e) => {
							// 	e.nodeData.refpk = e.nodeData.nodeid;
							// 	e.nodeData.refname = e.nodeData.nodetitle;
							// 	e.nodeData.refcode = e.nodeData.nodecode;
							// 	e.refcode = e.nodeData.nodecode;
							// })  bug fix for NCCLOUD-161316
							var newData = { //满足平台的格式
								rows: res.data.datarows 
							};

							var listData = [];
							var listLoop = (nodes = [] ) => {
								nodes.forEach(n => {
									n.nodeData.refpk = n.nodeData.nodeid;
								n.nodeData.refname = n.nodeData.nodetitle;
								n.nodeData.refcode = n.nodeData.nodecode;
								n.refcode =n.nodeData.nodecode;
									listData.push(n);
									if(n.children){
										listLoop(n.children || []);
									}
								});	
							};
							listLoop(res.data.datarows || []);
                            if((param.queryCondition.isshow ==false&&param.queryCondition.searchFlag &&param.queryCondition.searchFlag ==true)||param.searchPks&&param.searchPks.length>0){
                                newData.rows = listData;
                            }

							this.setCacheData(queryTreeUrl, param, {rows:listData});
							resolve(newData || {}); // modify by qiaojie
						});
					},
					error: (e) => {
						toast({ color: 'danger', content: e.message });
						this.setState({
							loading: false
						});
						//throw new Error(e); jira问题
					}
				});
			});
		});
	};

    onTreeNodeSelectWapper(selectedKeys, { selected, selectedNodes, node, event }, ...rest){
		if(!node.props.treeNodeData){
			debugger;
		}
        if(this.state.treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass'){
			var expandedKeys = this.state.expandedKeys,
				nodeKey = node.props.eventKey;
			expandedKeys = expandedKeys.indexOf(nodeKey) == -1 ? [...expandedKeys, nodeKey] :  expandedKeys.filter(e => e != nodeKey);
			this.state.expandedKeys = expandedKeys;
			this.setState(this.state);
			return;
		}
        this.onTreeNodeSelect(selectedKeys, { selected, selectedNodes, node, event },  ...rest);
	};
	onTreeNodeDoubleClickWapper(selectedKeys, { selected, selectedNodes, node, event }, ...rest){
        if(this.state.treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass'){
			return;
		}
		console.log('enter');
        this.onTreeNodeDoubleClick(selectedKeys, { selected, selectedNodes, node, event },  ...rest);   
	};

    onTreeNodeCheckWapper (checkedKeys, { checked, checkedNodes, node, event }){
		// if(this.state.treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass')
		// 	return;
        this.onTreeNodeCheck(checkedKeys, { checked, checkedNodes, node, event });
	};

	onTreeNodeCheck = (checkedKeys, { checked, checkedNodes, node, event }) => {
		// console.log(checkedKeys, { checked, checkedNodes, node, event });
		const { rootNode, onlyLeafCanSelect, idKey } = this.props;
		let { selectedValues, treeData } = this.state;
		selectedValues = this.getSelectTreeValuesThroughIncludeChildrenforme(node,checked);
		this.setState({
			selectedValues
		});
	};

	getSelectTreeValuesThroughIncludeChildrenforme = (node, checked) => {
		let { selectedValues, includeChildren,treetype} = this.state,
			treeNodeId = node.props.eventKey;
		const { idKey } = this.props;
		const isClassNode = this.state.treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass';
		includeChildren  = includeChildren ||  isClassNode;//点击的是分类节点按照包含下级处理

		
		if (includeChildren ) {
			// 包含下级
			//let mapFunc = selectedValues.get(treeNodeId) ? selectedValues.delete : selectedValues.set;
			let mapFunc = !checked ? selectedValues.delete : selectedValues.set;
			// 选中所有下级节点
			(function func(node) {
				let data = node.props.treeNodeData,
					children = node.props.children;
				if(treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass'){
				}else{
					mapFunc.call(selectedValues, data._path || data[idKey], data);
				}
				if (Array.isArray(children)) {
					children.forEach((e) => void func(e));
				}
			})(node);
		} else {
			// 选中单个节点
			let data = node.props.treeNodeData;
			!checked ? selectedValues.delete(treeNodeId, data) : selectedValues.set(treeNodeId, data);
		}
		if(isClassNode){
			this.selectRootKeys = checked ? [...this.selectRootKeys, node.props.nodeData.refpk] : this.selectRootKeys.filter( k => {return k != node.props.nodeData.refpk;});
			
		}

	
		return selectedValues;
	};

    setTreeData = (target, parentNode, data, cb) => {
		let { expandedKeys ,textValue} = this.state;
		(data.rows || [] ).forEach((e) => {
			e._display = e.title;
			e.pid = e.pid || 'root';
		});
		
		this.setState({
			[target]: data.rows || [] ,
			uapbdselftreedata : data.rows || [] 
			// search:{
			// 	...this.state.search,
			// 	value: undefined
			// }
		},() => {
				typeof cb === 'function' && cb();
		});
	};
	// 节点展开方法
	onTreeNodeExpandWapper = (expandedKeys)=>{
		this.state.uapbdselfexpandedKeys = expandedKeys;
		this.setState(this.state);
	}

	// 复写原型方法：渲染顶部 集团参照
	renderPopoverHeaderExtend = () => {
		return <div className="cancel-drag" style={{width: 200, paddingLeft: 10}}>{this.props.showGroup ? <Refer {...this.state.refGroup} {...{
			container:this.props.container,
			refName: this.props.multiLang['refer-000232']||'集团(所有)',          
			placeholder: this.props.multiLang['refer-000232']||'集团(所有)',  
			treeConfig: { name: [this.props.multiLang['refer-003068']||'编码', this.props.multiLang['refer-003069']||'名称'], code: ['refcode', 'refname'] },   
			rootNode: { refname: this.props.multiLang['refer-000232']||'集团(所有)', refpk: 'root' },
		}}/>:''}</div>
	}
    // 复写原型方法：渲染弹出层左侧
	renderPopoverLeft = () => {
		let { isSearch, selectedKeys, expandedKeys, selectedValues, treeData } = this.state;
		let {  uapbdselfexpandedKeys, uapbdselftreedata} = this.state;
		const { refType, isMultiSelectedEnabled, isTreelazyLoad, rootNode, onlyLeafCanSelect, disabledDataShow} = this.props;
		
		 //树表state
		 var loopNode = (nodes, handler) => {
            nodes.forEach( node => {
                handler && handler(node, node.children || []);
                loopNode(node.children || [], handler);
            });
		};
		
		var laybtns = [],
			createNumberBtns = (nodes) => { //获取树节点层级号数组
			var maxlaynumber = 1, i, btns = [],
				hander = (node, children) =>{ 
					var nodenumber = parseInt(node.nodeData ? node.nodeData.laynumber : 0);
					maxlaynumber = nodenumber <= maxlaynumber ? maxlaynumber: nodenumber;
				};
				loopNode(nodes, hander);
				for(i =0 ; i <= maxlaynumber; i++ ){
					let fieldid = "expandLevel" + i;
					laybtns.push(<NCMenu.Item fieldid={fieldid} key={i} expandLay={true}>{this.props.multiLang['refer-003076'] || '展开'}{i+1}{this.props.multiLang['refer-003077'] || '级'}</NCMenu.Item> );
				}
		};
		createNumberBtns(uapbdselftreedata || []);

		var onMenuSelect = (domEvent, item, key) => {
			this.moreButton && this.moreButton.focus();
			this.state.isMoreButtonShow = false;
			if(domEvent.key == 'expandAll'){
				var key = [],
					keyHander = (node, children) =>{ 
						key.push(node.key);
					};
				loopNode(uapbdselftreedata, keyHander);
				this.state.uapbdselfexpandedKeys = key;
				this.setState(this.state);
			}
			if(domEvent.key == 'unexpandAll'){
				this.state.uapbdselfexpandedKeys = [];
				this.setState(this.state);
			}
			if(domEvent.item.props.expandLay){
				var key = [],  layno = domEvent.key,
					keyHander = (node, children) =>{ 
						var nodenumber = parseInt(node.nodeData ? node.nodeData.laynumber : 0);
						if(nodenumber <= layno){
							key.push(node.key);
						}
				};
				loopNode(uapbdselftreedata, keyHander);
				this.state.uapbdselfexpandedKeys = key;
				this.setState(this.state);
			}
		};

		var createMore = () => {
			return (<NCMenu 
					className="account-book-menu-use-style" 
					onSelect={onMenuSelect} 
					keyboard 
					ref={dom => {
						this.moreButtonMenu = ReactDOM.findDOMNode(dom);
					}}>
				<NCMenu.Item fieldid="expandAll" key="expandAll">{this.props.multiLang['refer-003073'] || '展开全部'}</NCMenu.Item>
				<NCMenu.Item fieldid="unexpandAll" key="unexpandAll">{this.props.multiLang['refer-003074'] || '收起全部'}</NCMenu.Item>
				<NCMenu.NCSubMenu fieldid="expandlay_btn_menu" key="expandLay" title={this.props.multiLang['refer-003075'] || '展开级次'}>
					{laybtns}
				</NCMenu.NCSubMenu>
			</NCMenu>);
		};


		var initsearchAndExpandedkeys = (tds) => {
			var textValue = this.state.search.value || '',
				calexpandKeys =[];
			const loopsearch = (nodes = []) => {
				var parendExpand = false;
				(nodes || [] ).forEach(child => {
					var expand = loopsearch( child.children || [] );
					child.needExpand = expand;
					child.needShow = expand ? true: ( child.refpk == 'root'|| !textValue || textValue.length == 0 ||  child.nodeData.nodedata == 'nodeclass'|| child.nodeData.nodecode.indexOf(textValue) != -1 || child.title.indexOf(textValue)  != -1? true: false);
					parendExpand = parendExpand ? parendExpand :child.needShow;
					if(expand){
						calexpandKeys.push(child.key);
					}
				});
				return parendExpand;
			}

			var rootExpand = loopsearch(this.state.uapbdselftreedata|| []);
			calexpandKeys.push('root');
			var calexpandKeys = textValue && textValue.length != 0 ? calexpandKeys :[];
			return{
				data:tds,
				expandedKeys:[...calexpandKeys,...(this.state.uapbdselfexpandedKeys || [] ) ]
						
			}
		};
		var extreecfg = initsearchAndExpandedkeys(this.state.uapbdselftreedata);
		var renderSearch = {
			...this.state.search,
			value: this.state.search.valueTemp
		};
		
	
		return (
            <div style={{paddingLeft: 10}}>
				<div style={{paddingLeft: 10}}>
					<div className='accountBookGrid_wrap_neibu' style={{display:'flex',marginTop:10,justifyContent: 'flex-start',marginBottom:10}}>
						<div style={{position: 'relative'}} className="icon-qingkong-hover-container">
							<NCFormControl fieldid="search" {...renderSearch} {...{
									placeholder:  this.props.multiLang['refer-003070']|| '账簿编码/账簿名称'
							}}/>
							<i class="icon iconfont icon-sousuo syncTreeSearchIcon" style={{position: 'absolute',top: 7,right: 5,color: '#878b94'}}></i>
							{this.state.search.valueTemp && (<i  style={{position: 'absolute',top: 7,right: 20,color: '#878b94'}} className="refer-del-i iconfont icon-qingkong icon-qingkong-hover"
								onClick={() => {
									this.state.search.valueTemp = '';
									this.state.search.value = '';
									this.setState({
										search: this.state.search
									},() =>{
										this.state.search.onSearch();
									});
								}}/>
							)}
						</div>
						<div style={{marginLeft: 10,paddingTop: 2}}>
							{isMultiSelectedEnabled && this.props.showInCludeChildren ? <NCCheckbox className="AccountBookTreeref-Search-checkbox" {...this.state.subOrg}>{this.props.multiLang['refer-001008'] || '包含下级'}</NCCheckbox> : ''}
							{disabledDataShow ? <NCCheckbox  className="AccountBookTreeref-Search-checkbox" {...this.state.mshowoff}>{this.props.multiLang['refer-001030'] || '显示停用'}</NCCheckbox> : ''}
						
						</div>
						<NCPopover
							className="popover-in-refer more"
							trigger={'click'}
							placement={'bottom'}
							content={createMore()}
							show={this.state.isMoreButtonShow}
						>
						<span 
								className='more-button' 
								style={{marginTop: -3}} 
								tabIndex={this.getTabIndex(this.hotKeyElement.moreButton)}
								onClick={() => {
									this.setState({
										isMoreButtonShow: true
									});
								}}
								ref={dom => {
									this.moreButton = dom;
								}}
								onKeyDown={this.resetHotKeyLoop.bind(this, this.hotKeyElement.moreButton)}>{this.props.multiLang['refer-001035'] || '更多'}</span>
						
						 </NCPopover>
					</div>
					<div>
						<RadioGroup name="booktype" selectedValue={this.state.treetype} onChange={this.onTreeTypeChange.bind(this)}>
							<Radio value="type">{this.props.multiLang['refer-003071'] || '账簿类型'}</Radio>
							<Radio value="main">{this.props.multiLang['refer-003072'] || '主账簿'}</Radio>
						</RadioGroup>
					</div>
				</div>
				<div style={{height: 350,overflow: 'auto',paddingLeft: 10}}>
					<ReferTree
						checkStrictly={true}
						checkable={refType === 'tree' && isMultiSelectedEnabled}
						data={uapbdselftreedata}
						showLine={true}
						onSelect={this.onTreeNodeSelectWapper.bind(this)}
						onExpand={this.onTreeNodeExpandWapper.bind(this)}
						onCheck={this.onTreeNodeCheckWapper.bind(this)}
						checkedKeys={[ ...selectedValues.keys(), ...this.selectRootKeys ]}
						selectedKeys={selectedKeys}
						expandedKeys={uapbdselfexpandedKeys}
						autoExpandParent={false}
						isTreelazyLoad={isTreelazyLoad}
						root={rootNode}
						onlyLeafCanSelect={onlyLeafCanSelect}
						searchValue={this.state.search.value}
						onDoubleClick={this.onTreeNodeDoubleClickWapper.bind(this)}
						tabIndexValue={this.getTabIndex(this.hotKeyElement.referTree)}
						{...extreecfg}
					/>
				</div>
        </div>
		
		);
	};
}


export default function (props = {}) {
    var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
        refName:'refer-003078',  
        placeholder: 'refer-003078', 
        rootNode:{refname:'refer-003078',refpk:'root'},
        refCode: 'uapbd.ref.AccountBookTreeRef',
        queryTreeUrl:'/nccloud/uapbd/ref/AccountBookTreeRef.do',
		isMultiSelectedEnabled:false,
        refType:'tree',
        isTreelazyLoad: false,
		treeConfig:{name:['refer-003068', 'refer-003069'],code: ['refcode', 'refname']},
		showGroup: false,
		isCacheable:false,
		showInCludeChildren:true,
		disabledDataShow: false
    };
    conf.rootNode = {...conf.rootNode, treeid: 'root'};
    return <AccountBookWrapper {...conf} {...props} />
}

const AccountBookWrapper = MultiLangWrapper(Ref)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65