//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 *  会计期间
 *  @author	yinshb
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import  Utils, {DateUtils} from '../../../public/utils';
import createUIDom from '../../../public/utils/BDCreateUIDom'
import './index.less'

import { createPage, ajax, base, high, toast ,print,promptBox,getMultiLang,createPageIcon, excelImportconfig} from 'nc-lightapp-front';
const {PrintOutput, ExcelImport} = high;
const { NCPopconfirm, NCCollapse, NCMessage, NCCheckbox, NCTable, NCPagination, NCAnchor, NCScrollElement, NCScrollLink,NCDiv, NCModal, NCButton } = base;

const pagecode = '10140AC_accperiod';
const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse', //浏览
	add: 'add' //新增
}

const areaId = {
	audiInfo: 'audiInfo',		//审计信息
	accperiod: 'accperiod',		//会计期间档案
	acchalfyear: 'acchalfyear',						//会计半年
	accperiodquart: 'accperiodquart',				//会計季度
	accperiodmonth: 'accperiodmonth',				//会计月份
	accperiodmonth2: 'accperiodmonth\u0026childform2',					//会计月份子表2
	accperiodmonthu0026childform1: 'accperiodmonth\u0026childform1',	//会计月份子表1
	childform2: 'acchalfyear\u0026childform2',		//会计半年 子表二
	accperiodadjust: 'accperiodadjust'				//会计调整期
}
const ajaxurls = {
	schemetreequery : '/nccloud/uapbd/accperiod/schemetreequery.do', 	  //会计期间方案树查询
	schemequery : '/nccloud/uapbd/accperiod/schemequery.do', 	  //会计期间方案查询按pk
	schemesave : '/nccloud/uapbd/accperiod/schemesave.do',	      //会计期间方案保存
	schemedelete : '/nccloud/uapbd/accperiod/schemedelete.do',	  //会计期间方案删除
	accperiodbatchsave : '/nccloud/uapbd/accperiod/accadjbatchsave.do',	  //会计期间批量保存
	accperiodsave : '/nccloud/uapbd/accperiod/accperiodsave.do',	      //会计期间新增
	accperiodupdate : '/nccloud/uapbd/accperiod/accperiodupdate.do',	      //会计期间更新
	accperioddelete : '/nccloud/uapbd/accperiod/accperioddelete.do',	          //会计期间删除
	dataload : '/nccloud/uapbd/accperiod/accquerycard.do',	          //会计期间 新增插查询
	accperiodprint : '/nccloud/uapbd/accperiod/accperiodprint.do'	          //会计期间 新增插查询
}
// 会计期间是否可以修改删除
let iseditdel = false;
// 是否向前新增
let onclickPreAdd = false;
// 会计调整期是否可以修改
let isEditline = false;

// 取消用备份
let buMonth ;
let buQuart ;
let buHalfyear ;
let buAdjust ;


const appid = '0001Z010000000002EDD';
const funcode = '10140AC';
let pageStatus = "browse";
let adjStatus = "browse";// 会计调整期表格状态
const schemeeditor = "10140AC_schemeeditor";
const showCode = "accperiodscheme";
const audiinfosch = "auditinfo";
let treeId= "accSchemeTree";
let nowNodeChose;
let nowNodepid;
let nowNodeSche;
let schemeid; // 方案主键
let accperiodid; // 期间主键
let mainSheet;
let showSheet;
let leftTreeData;
let isPreAdd = true; // 是否能够向前新增,true：不能；false：能
const keys = ['pk_accperiodscheme','pk_accperiod','isadj','pk_org'];  //过来空行时，忽略的字段
// 记住当前树节点
let nowNodeRefpk;
let saveDataTree;
const modalId = 'showModal';
const EMPTY_FN = function(){};

class Accp extends Component {
	constructor(props) {
		super(props);
		this.root = {
			"isleaf": false,
			"key":"~",
			"title":'10140AC-000003',/* 国际化处理： 会计期间*/
			"id":"~",
			"innercode":"~",
			"pid": "",
			"refname":'10140AC-000003',/* 国际化处理： 会计期间*/
			"refpk": "~"
		};
		this.config =Object.assign({
            title: '10140AC-000003',/* 国际化处理： 会计期间方案*/
            treeId: "accSchemeTree",
            nodeType:'GROUP_NODE',
        }, props.config);
		this.state = {
			jin: 'test',
			modalShow: false,
			isDisabledSearch: false,
            json:{}
		};
		this.dealTreeData = this.dealTreeData.bind(this);
		this.initLeftTree = this.initLeftTree.bind(this);
		this.onEditScheme = this.onEditScheme.bind(this);
	  	this.onAddPeriod = this.onAddPeriod.bind(this);
	  	this.onDeleteScheme = this.onDeleteScheme.bind(this);
		this.closeModalEve = this.closeModalEve.bind(this);
		this.tableButtonClick = this.tableButtonClick.bind(this);

		this.initTemplate(props,()=>{
            this.initLeftTree();
			ajax({
				url: ajaxurls['schemetreequery'],
				data: {
					pagecode: pagecode   	 //pagecode,在生成的json模板获取
				},
				success:(res) => {
					// this.props.cardTable.setTableData(pagecode, {rows: ['jin','hua']});
				}
			});
        })
	}

    /**
 * 单据模板
 * @param props
 */
	initTemplate = (props,callback)=>{
		createUIDom(props)(
			{
				pagecode : pagecode
			},
			{
				moduleId: "10140AC",domainName: 'uapbd'
			},
			(data, langData)=>{
				if(langData){
					this.state.json = langData
				}
				if(data){
					let meta = data.template;
					var handlerMetaAdatepicker = () =>{
						(Object.values(meta) || []).forEach( m =>{
							(m.items || []).forEach(item =>{
								if(item.itemtype && item.itemtype == 'datepicker'){
									item.itemtype = 'datePickerNoTimeZone';
								}
							});
						});
					};
					handlerMetaAdatepicker();

					meta['formrelation'].accperiodscheme=['auditinfo'];
					meta = this.modifierMeta(props, meta);
					props.meta.setMeta(meta);
					showSheet = meta;
					// mainSheet = meta.data;
                    data.button && props.button.setButtons(data.button);
                    
                    props.button.setUploadConfig("Import",excelImportconfig(this.props,"uapbd","accperiodschemeinfo",true,"",{'appcode':funcode, 'pagecode':pagecode},()=>{this.onClickButton(this.props, 'Refresh');}));
					
					props.button.setMainButton({Add:true});
					props.button.setPopContent('DelLine',this.state.json['10140AC-000000']) /* 国际化处理： 确认要删除该信息吗？*//* 设置操作列上删除按钮的弹窗提示 */
	
					callback&&callback()
				}
			}
		)
	}
	
	//对表格模板进行加工操作
	modifierMeta(props,meta) {
		let that = this;
		//添加表格操作列
		let event = {
			label: this.state.json['10140AC-000001'],/* 国际化处理： 操作*/
			attrcode: 'opr',
			key: 'opr',
			itemtype: 'customer',
			visible:true,
			render(text, record, index) {
	
				return props.button.createOprationButton(
					['DelLine'],
					{
						area: "table-opr-area",
						buttonLimit: 3,
						onButtonClick: (props, id) => {that.tableButtonClick(props, id, text, record, index)}
					}
				)
	
			}
		};
		meta[areaId.accperiodadjust].items.push(event);
		//props.renderItem('table',tableid,'creator',refer('creator'));
		return meta;
	}
	tableButtonClick(props, id, text, record, index){
		switch(id){
			case 'DelLine':
				if(props.cardTable.getStatus(areaId.accperiodadjust) === 'edit'){//编辑状态
					props.cardTable.delRowsByIndex(areaId.accperiodadjust, index);
				}else{//浏览态
					let delObj = {
						rowId: index,
						status: '3',
						values: {
						}
					};
					
					delObj.values = record.values;
					let indexArr=[];
					indexArr.push(index);
					let data = {
						model: {
							areaType: 'table',
							pageinfo: null,
							rows: [ delObj ]
						}
					};
					ajax({
						url: ajaxurls.accperiodbatchsave,
						data,
						success: function(res) {
							let { success, data } = res;
							if (success) {
								props.cardTable.delRowsByIndex(areaId.accperiodadjust, indexArr);
								let allD = props.cardTable.getAllData(areaId.accperiodadjust);
								Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
								props.cardTable.setTableData(areaId.accperiodadjust,allD);
								toast({title:this.state.json['10140AC-000002'],color:'success'});/* 国际化处理： 删除成功*/
							}
						}.bind(this)
					});
				}
			default:
				break;
	
		}
	}


	dealTreeData(data){
		let deleteDataChildrenProp = function(node){
			node.iconBox = {
				editIcon: false,
				addIcon: true,
				delIcon: false
			}
			if(!node.children || node.children.length == 0) {
				delete node.children;
			}
			else{
				node.isLeaf = false;
				node.children.forEach( (e) => {
					deleteDataChildrenProp(e);
				} );
			}
		};
		data.forEach( (e) => {
			
			e.iconBox = {
				editIcon: true,
				addIcon: true,
				delIcon: true
			}
			deleteDataChildrenProp(e);
		});
		return data;
	}
	initLeftTree() {
	  	let requestParam = {
	      checked: false,
	      pkorg: ''
		};
	  	ajax({
	    	url: '/nccloud/uapbd/accperiod/schemetreequery.do',
	    	data: requestParam,
	    	success:(result) => {
		        if(result.success) {
		        	// console.log(result.data);
		        	let data = [Object.assign( {...this.root} ,{title:this.state.json[this.root.title],refname:this.state.json[this.root.refname]}, {children : result.data} )];
		        	//同步树  加载全部数据
		        	leftTreeData = data;
					// console.log(data);
					// this.props.syncTree.setNodeSelected(this.config.treeId, '~');
					
					
					this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData(data));
					
					// 选中根节点
					this.props.syncTree.setNodeSelected(treeId, this.root.refpk);
					
					this.updateButtonStatus('root');
					//展开节点  设置默认展开项
					this.props.syncTree.openNodeByPk(treeId, this.root.refpk);
		        }
	    	}
	  	});
	}

	// 鼠标滑过节点事件
	onMouseEnterEve(key, node) {
        //  设置
        if(key === this.root.refpk) {
            let obj = {
                delIcon:false,		 //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon(treeId, key, obj );
		}
		if (node.nodeData && node.nodeData.Isnewdataforcurr) {
			iseditdel = true;
		}
		// NCCLOUD-164234会计期间方案树删改按钮缺失。
		// 规则参考重量端AccSchemeEditAction.isActionEnable
		// 是会计期间方案，方案code 是'0001' ，'NSSBPeriod' 只显示新增图标
		if (node.nodeData && node.nodeData.isScheme)  {
			let obj = {
                delIcon: node.nodeData.pcode != '0001' && node.nodeData.pcode != 'NSSBPeriod',		 //false:隐藏； true:显示; 默认都为true显示
                editIcon:node.nodeData.pcode != '0001' && node.nodeData.pcode != 'NSSBPeriod',
                addIcon:true
            };
            this.props.syncTree.hideIcon(treeId, key, obj );
		}

		
  	}
	  onClickButton(props, id){
        switch (id) {
            case 'Add':
                this.onAddPeriod(false);
                break;
            
			case 'PreAdd':
                this.onAddPeriod(true);
                break;
			case 'Save':
                this.onSavePeriod();
                break;
			case 'Edit':
				this.onEditPeriod();
				break;
			case 'Cancel':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140AC-000005'],/* 国际化处理： 确认取消*/
					content:this.state.json['10140AC-000006'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick:()=>{
						setTimeout(()=>{
							// 方案节点，清除卡片的值，叶子节点cancel
							if (nowNodeSche) {
								this.clearCardTable();
								this.props.form.setFormStatus(areaId.accperiod,'browse');
								this.setTableEditFalse();
							} else {
								// 调用节点选中的方法
								this.props.form.cancel(areaId.accperiod);
								let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);
								this.loadFormData({id: selectedTreeNode.refpk});

								// this.props.form.cancel(areaId.accperiod);
								// // 恢复表格数据
								// this.props.cardTable.setTableData(areaId.accperiodmonth, buMonth);
								// this.props.cardTable.setTableData(areaId.acchalfyear, buHalfyear);
								// this.props.cardTable.setTableData(areaId.accperiodquart, buQuart);
								// this.props.cardTable.setTableData(areaId.accperiodadjust, buAdjust);
								// 设置表格不可编辑
								this.setTableEditFalse();
								// this.props.form.cancel([areaId.accperiod,areaId.acchalfyear,areaId.accperiodmonth,areaId.accperiodquart,areaId.accperiodadjust]);
							}
							// this.clearCardTable();
							// this.props.form.setFormStatus(areaId.accperiod,'browse');
							// // 重新选中左侧的节点，触发加载右侧数据
							// this.props.syncTree.setNodeSelected(treeId,nowNodeChose);

							this.updateButtonStatus('leaf');
							
							// 树可编辑
							this.props.syncTree.setNodeDisable(treeId, false);
							
							this.setState({ isDisabledSearch: false});
						}, 0);
					}
				});

				break;
			case 'Delete':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140AC-000007'],/* 国际化处理： 删除提醒*/
					content:this.state.json['10140AC-000008'],/* 国际化处理： 确定要删除数据吗？*/
					beSureBtnClick:()=>{this.onDelForBrowse()}
					})
				break;
			case 'AddLine':
				this.props.cardTable.setStatus(areaId.accperiodadjust, 'edit');
				adjStatus = 'edit';
				let adjdata = this.props.cardTable.getAllData(areaId.accperiodadjust);
				let indexno = adjdata.rows.length;
				this.props.cardTable.addRow(areaId.accperiodadjust, indexno);
				this.props.cardTable.setValByKeyAndIndex(areaId.accperiodadjust, indexno, 'pk_accperiodscheme', {value: nowNodepid });
				this.props.cardTable.setValByKeyAndIndex(areaId.accperiodadjust, indexno, 'pk_accperiod', {value: nowNodeChose });
				this.props.cardTable.setValByKeyAndIndex(areaId.accperiodadjust, indexno, 'isadj', {value: true });
				this.props.cardTable.setValByKeyAndIndex(areaId.accperiodadjust, indexno, 'pk_org', {value: 'GLOBLE00000000000000' });
				// filterEmptyRows(areaId.accperiodadjust, keys, rule);
				this.updateButtonStatus('editLine');
				break;
			case 'EditLine':
				this.props.cardTable.setStatus(areaId.accperiodadjust, 'edit');
				this.updateButtonStatus('editLine');
				break;
			
			case 'SaveLine':
			    this.props.cardTable.filterEmptyRows(areaId.accperiodadjust,keys);
				let ischeck = this.props.cardTable.checkTableRequired(areaId.accperiodadjust);
				if (!ischeck) {
					return;
				}
				//保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
				let tableData = this.props.cardTable.getChangedRows(areaId.accperiodadjust);
				if (tableData.length == 0) {
					// toast({content:'没有可以保存的数据！',color:'warning'});
					this.props.cardTable.setStatus(areaId.accperiodadjust, 'browse');
					this.updateButtonStatus('browseLine');
					toast({content: this.state.json['10140AC-000009'], color:'success'});/* 国际化处理： 保存成功*/
					return;
				}
				let data = {
					pageid:areaId.accperiodadjust,
					model : {
						areaType: "table",
						pageinfo: null,
						rows: []
					}
				};
				data.model.rows = tableData;
				ajax({
					url: ajaxurls.accperiodbatchsave,
					data,
					success:  (res) => {
						setTimeout(() => {
							let { success, data } = res;
							let allD = this.props.cardTable.getAllData(areaId.accperiodadjust);
							
							// 修改是否可用		
							if (allD.rows.length > 0 ) {
								isEditline = true;
							} else {
								isEditline = false;
							}
							Utils.filterResult(allD,(data[areaId.accperiodadjust] || data[areaId.accperiodmonth]).rows);//将保存后返回的数据重新放置到页面
							allD.rows.forEach( (d)  => { 
								d.values.beginmonth.display = d.values.beginmonth.value;
								d.values.endmonth.display = d.values.endmonth.value;
							});
							this.props.cardTable.setTableData(areaId.accperiodadjust,allD);
							this.props.cardTable.setStatus(areaId.accperiodadjust, 'browse');
							// setTimeout(() => {
								this.updateButtonStatus('browseLine');
							// }, 20);

						})
					}
				});
				break;
			case 'CancelLine':
				// this.onAddPeriod();
				this.props.cardTable.setStatus(areaId.accperiodadjust, 'browse');
				this.props.cardTable.resetTableData(areaId.accperiodadjust);
				this.updateButtonStatus('browseLine');
				break;
			case 'Refresh':
				// this.onAddPeriod();
				this.initLeftTree();
				this.clearCardTable();
				toast({title: this.state.json['10140AC-000010'], color:'success'});/* 国际化处理： 刷新成功！*/
				break;
				
			case 'Print':
                this.output('print')
                break;
            case 'Output':
                this.output('output');
                break;
            case "Export":
                this.props.modal.show('exportFileModal');
                break
            default:
                break;
        }
	}

    output(type=''){

		let pk_accperiod = this.props.form.getFormItemsValue(areaId.accperiod, 'pk_accperiod').value;
        let pks = [];
        // formData.rows.forEach((row)=>{
            pks.push(pk_accperiod);
		// });
		if (type === "print") {
			print(
				'pdf',
				ajaxurls.accperiodprint,
				{
					billtype:'',  //单据类型
					funcode: funcode,     //功能节点编码
					nodekey:'accperiodcard',     //模板节点标识
					//userjson:JSON.stringify(pks),
					oids:pks
					// outputType:type
				}
			)
		}

		//输出
		if(type === "output"){
		this.setState({
			pks: pks
			},this.refs.printOutput.open());	
		}	
	

	}
	
	//浏览态确认删除事件
	onDelForBrowse(){
		ajax({
			url: ajaxurls.accperioddelete,
			data: {
				pk_accperiod: nowNodeChose
			},
			success:  (res) => {
				setTimeout(() => {
					this.initLeftTree();
					this.clearCardTable();
					this.props.form.setFormStatus(areaId.accperiod,'browse');
					this.setTableEditFalse();
					toast({title:this.state.json['10140AC-000013'],color:'success'});/* 国际化处理： 删除成功*/
				})
			}
		});
	}
	//浏览态确认删除事件
	onDelLineForBrowse(){
		let selectedData=this.props.cardTable.getCheckedRows(areaId.accperiodadjust);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: this.state.json['10140AC-000011'],/* 国际化处理： 时间戳*/
					},
					pk_accperiod: {
						display: this.state.json['10140AC-000012'],/* 国际化处理： 主键*/
					}
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values.ts.value=val.data.values.ts.value;
			delObj.values.pk_accperiod.value=val.data.values.pk_accperiod.value;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let data = {
			pageid: areaId.accperiodadjust,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: ajaxurls.accperiodbatchsave,
			data,
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					this.props.cardTable.deleteTableRowsByIndex(areaId.accperiodadjust, indexArr);
					let allD = this.props.cardTable.getAllData(areaId.accperiodadjust);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					this.props.cardTable.setTableData(areaId.accperiodadjust,allD);
					toast({title:this.state.json['10140AC-000013'],color:'success'});/* 国际化处理： 删除成功！*/
				}
			}.bind(this)
		});
	}


	// 清空卡片和子表的数据
	clearCardTable() {
		setTimeout(() => {
			this.props.form.EmptyAllFormValue(areaId.accperiod);
			this.props.cardTable.setTableData(areaId.accperiodmonth, {rows: []});
			this.props.cardTable.setTableData(areaId.acchalfyear, {rows: []});
			this.props.cardTable.setTableData(areaId.accperiodquart, {rows: []});
			this.props.cardTable.setTableData(areaId.accperiodadjust, {rows: []});
		},0)
	}
	// 会计期间修改
	onEditPeriod() {
		// 获得四个子表的值，取消按钮恢复
		let cardData =  this.props.createExtCardData(pagecode, areaId.accperiod, [areaId.acchalfyear,areaId.accperiodquart,areaId.accperiodmonth,areaId.accperiodadjust]);

		buMonth = cardData.bodys.accperiodmonth;
		buQuart = cardData.bodys.accperiodquart;
		buHalfyear = cardData.bodys.acchalfyear;
		buAdjust = cardData.bodys.accperiodadjust;
		this.props.form.setFormStatus(areaId.accperiod,'edit');
		accperiodid = this.props.form.getFormItemsValue(areaId.accperiod, 'pk_accperiod').value;
		// 会计月份
		let monthdata = this.props.cardTable.getAllData(areaId.accperiodmonth);
		// 设置表格可编辑
		this.props.cardTable.setStatus(areaId.accperiodmonth, 'edit');
		// 会计月份，开始日期不能编辑
		this.props.cardTable.setColEditableByKey(areaId.accperiodmonth, 'accperiodmth', true);
		this.props.cardTable.setColEditableByKey(areaId.accperiodmonth, 'begindate', true);
		// 除了最后一个期间，其他期间结束日期可编辑 
		this.props.cardTable.setEditableByIndex(areaId.accperiodmonth, monthdata.rows.length-1, 'enddate', false);

		// 会计季度
		let quartdata = this.props.cardTable.getAllData(areaId.accperiodquart);
		// 设置表格可编辑
		this.props.cardTable.setStatus(areaId.accperiodquart, 'edit');
		// 季度，开始月份不能编辑
		this.props.cardTable.setColEditableByKey(areaId.accperiodquart, 'quarter', true);
		this.props.cardTable.setColEditableByKey(areaId.accperiodquart, 'startmonth', true);
		// 除了最后一个季度，其他季度结束月份可编辑 
		this.props.cardTable.setEditableByIndex(areaId.accperiodquart, quartdata.rows.length-1, 'lastmonth', false);
		
		// 会计季度
		let halfdata = this.props.cardTable.getAllData(areaId.acchalfyear);
		// 设置表格可编辑
		this.props.cardTable.setStatus(areaId.acchalfyear, 'edit');
		// 季度，开始月份不能编辑
		this.props.cardTable.setColEditableByKey(areaId.acchalfyear, 'halfyear', true);
		this.props.cardTable.setColEditableByKey(areaId.acchalfyear, 'startmonth', true);
		// 除了最后一个季度，其他季度结束月份可编辑 
		this.props.cardTable.setEditableByIndex(areaId.acchalfyear, halfdata.rows.length-1, 'lastmonth', false);

		// 树不可编辑
		this.props.syncTree.setNodeDisable(treeId, true);
		this.setState({ isDisabledSearch: true});
		pageStatus = "edit";
		this.updateButtonStatus('edit');
	}
	// 会计期间保存
	onSavePeriod() {
		//表单校验必输项
		if(!this.props.form.isCheckNow('accperiod'))return;
		
		// 去掉调整期的空行
		this.props.cardTable.filterEmptyRows(areaId.accperiodadjust,keys);
		let CardData =  this.props.createExtCardData(pagecode, areaId.accperiod, [areaId.acchalfyear,areaId.accperiodquart,areaId.accperiodmonth,areaId.accperiodadjust]);

		let requestParam = {
            model: CardData,
            pageid: pagecode	//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
		ajax({
			url: ajaxurls.accperiodsave,
			data: CardData,
			success:  (result) => {
				// setTimeout(() => {
				// 	this.initLeftTree();
				// })
				 //更新右卡数据
				//  delete result.data['pageid'];
				
				setTimeout(()=>{

					// console.log(result.data.formData.head);
					let cardData = {rows: result.data.formData.head.accperiod.rows};
					let cardvalue = {accperiod: cardData}
					this.props.form.setAllFormValue(cardvalue);
	
					// 会计月份
					let rowsmonth = [];
					let tableMonthData = {
							areacode:'accperiodmonth',
							rows:rowsmonth
					};
					// 会计调整期
					let rowsadj = [];
					let tableAdjData = {
							areacode:'accperiodmonth',
							rows:rowsadj
					};
					
					let allmonth;
					if (result.data.formData.bodys.accperiodmonth) {
						allmonth = result.data.formData.bodys.accperiodmonth;
					} else {
						allmonth = result.data.formData.bodys.accperiodadjust;
					}

					// this.props.form.setAllFormValue(result.data.head);
					// result.data.formData.bodys.accperiodmonth.rows.forEach( (d)  => { 
						
					// 构造月份下拉选项
					let monthOption = [];

					allmonth.rows.forEach( (d)  => { 
						if (d.values.isadj.value) {
							d.values.beginmonth.display = d.values.beginmonth.value;
							d.values.endmonth.display = d.values.endmonth.value;
							rowsadj.push(d);
						} else {
							rowsmonth.push(d);
						}
							
						let optionvalue =  d.values.accperiodmth.value;
						let option = {display: optionvalue, value: optionvalue};
						// let option = {display: d.values.accperiodmth.value, value: d.values.accperiodmth.value};
						monthOption.push(JSON.parse(JSON.stringify(option)));
					});

					// 修改模板，给下拉选项赋值
					let meta = this.props.meta.getMeta();
					// 会计季度
					meta.accperiodquart.items.forEach((item) => {
						if (item.attrcode === 'startmonth') {
							item.options = monthOption;
						}
						if (item.attrcode === 'lastmonth') {
							item.options = monthOption;
						}
					});
					meta['accperiodadjust_childform1'].items.forEach((item) => {
						if (item.attrcode === 'startmonth') {
							item.options = monthOption;
						}
						if (item.attrcode === 'lastmonth') {
							item.options = monthOption;
						}
					});
					meta['accperiodadjust_childform2'].items.forEach((item) => {
						if (item.attrcode === 'startmonth') {
							item.options = monthOption;
						}
						if (item.attrcode === 'lastmonth') {
							item.options = monthOption;
						}
					});
					// 会计半年
					meta.acchalfyear.items.forEach((item) => {
						if (item.attrcode === 'startmonth') {
							item.options = monthOption;
						}
						if (item.attrcode === 'lastmonth') {
							item.options = monthOption;
						}
					});
					meta['acchalfyear_childform1'].items.forEach((item) => {
						if (item.attrcode === 'startmonth') {
							item.options = monthOption;
						}
						if (item.attrcode === 'lastmonth') {
							item.options = monthOption;
						}
					});
					meta['acchalfyear_childform2'].items.forEach((item) => {
						if (item.attrcode === 'startmonth') {
							item.options = monthOption;
						}
						if (item.attrcode === 'lastmonth') {
							item.options = monthOption;
						}
					});
					
					nowNodeChose = result.data.formData.pk_accperiod;
					nowNodepid = result.data.formData.pk_accperiodscheme;

					meta.accperiodadjust.items.forEach(item => {
						if(item.attrcode == 'beginmonth'){
							item.queryCondition = () =>{
								return {
									pk_accperiodscheme: nowNodepid,
									pk_accperiod: nowNodeChose
								};
							};
						}
						if(item.attrcode == 'endmonth'){
							item.queryCondition = () =>{
								return {
									pk_accperiodscheme: nowNodepid,
									pk_accperiod: nowNodeChose
								};
							};
						}
					});
					this.props.meta.setMeta(meta);
					result.data.formData.bodys.acchalfyear.rows.forEach( (d)  => { 
						d.values.startmonth = {};
						d.values.lastmonth = {};
						d.values.startmonth.value = d.values.beginmonth.value;
						d.values.startmonth.display = d.values.beginmonth.value;
						d.values.lastmonth.value = d.values.endmonth.value;
						d.values.lastmonth.display = d.values.endmonth.value;
					});
					result.data.formData.bodys.accperiodquart.rows.forEach( (d)  => { 
						d.values.startmonth = {};
						d.values.lastmonth = {};
						d.values.startmonth.value = d.values.beginmonth.value;
						d.values.startmonth.display = d.values.beginmonth.value;
						d.values.lastmonth.value = d.values.endmonth.value;
						d.values.lastmonth.display = d.values.endmonth.value;
					});
					var editTable = this.props.cardTable;
					editTable.setTableData(areaId.accperiodmonth, tableMonthData);
					editTable.setTableData(areaId.acchalfyear, result.data.formData.bodys.acchalfyear);
					editTable.setTableData(areaId.accperiodquart, result.data.formData.bodys.accperiodquart);
					editTable.setTableData(areaId.accperiodadjust, tableAdjData);
					// console.log(editTable.getAllRows(areaId.accperiodmonth));
	
					//处理左树数据
					let treeData = this.dealTreeData(result.data.treeData);
					if(pageStatus == 'edit'){
						//更新左树数据
						this.props.syncTree.editNodeSuccess(treeId,treeData[0]);
					}else{
						// 向前新增
						if (onclickPreAdd) {
							this.addPreNodeSuccess(treeId,treeData[0]);
						} else {
							this.props.syncTree.addNodeSuccess(treeId,treeData[0]);
							
						}
						
					 }
					// 会计期间是否能够修改删除
					iseditdel = treeData[0].nodeData.Isnewdataforcurr;

					// 展开父节点
					this.props.syncTree.openNodeByPk(treeId, treeData[0].pid);
					// 选中叶子节点
					this.props.syncTree.setNodeSelected(treeId,treeData[0].refpk);
					// 调用节点选中的方法
					this.onSelectTree(treeData[0].refpk, treeData[0], true,'', true);
					this.props.form.setFormStatus(areaId.accperiod,'browse');
					this.setTableEditFalse();
					this.updateButtonStatus('leaf');
					
					// 树可编辑
					this.props.syncTree.setNodeDisable(treeId, false);
					
					this.setState({ isDisabledSearch: false});
					
					toast({title: this.state.json['10140AC-000009'], color:'success'});/* 国际化处理： 保存成功！*/
				}, 0);

			}
		});
	}
	// 向前新增节点成功调用方法
	addPreNodeSuccess = (id, data) => {
		let thisTree = this.props.syncTree.getSyncTreeValue(id);
		if (Array.isArray(data)) {
			this.addIconBox(data);
			data.forEach((item) => this.addPreNodeFun(thisTree, item));
		} else {
			this.addIconBox([ data ]);
			this.addPreNodeFun(thisTree, data);
		}
        thisTree.firstTime = true; //新增节点成功时，需要重新分割当前树，用于查询定位树节点
        this.props.syncTree.setSyncTreeData(id, thisTree)
		this.setState({
			treeData: this.state.treeData
		});
	}
	/*
	*   添加 IconBox 描述节点显示哪些图标
	* */
	addIconBox = (data) => {
		if (data && data instanceof Array && data.length > 0 && data[0].iconBox) {
			data.forEach((item) => {
				item.iconBox = {
					addIcon: true,
					delIcon: true,
					editIcon: true
				};
				if (Array.isArray(item.children)) {
					this.addIconBox(item.children);
				}
			});
		}
	}
	//  新增节点，插入到对应的父节点中
	addPreNodeFun = (treeData, child) => {
		if (!child.pid) {
			treeData.push(child);
			return;
		}
		const loop = (data) => {
			data.forEach((item) => {
				if (item.refpk === child.pid) {
					if (Array.isArray(item.children)) {
						let childrenarr = item.children;
						childrenarr.splice(0,0,child);
						// item.children.push(childrenarr);
						// item.children.push(child);
					} else {
						item.children = [ child ];
					}
					item.isleaf = false;
					return true;
				} else if (Array.isArray(item.children)) {
					let res = loop(item.children, child);
					if (res) {
						return false;
					}
				}
			});
		};
		loop(treeData);
	}


	// 新增会计季度
	getQuarters(periodnum, quarternum, begindate, enddate, monthdata) {
		let rows = [];
		let tableQuarterData = {
				areacode:'accperiodquart',
				rows:rows
		};
		let step = parseInt(periodnum/quarternum) - 1;
		let beginmonth = 1;
		for(let i = 0; i < quarternum; i++){
			// 结束月等于开始月+跨度
			let endmonth = beginmonth + step;
			// 如果是最后一个季度,则结束月等于最后会计月
			if (i+1 == quarternum) {
				endmonth = periodnum;
			}

			let thebeginmonth = monthdata.rows[beginmonth - 1].values.accperiodmth;
			let theendmonth = monthdata.rows[endmonth - 1].values.accperiodmth;
			let values = {};
			values.quarter = {value : i+1};
			values.beginmonth = thebeginmonth;
			values.pk_org = {value : 'GLOBLE00000000000000'};
			// values.startmonth = {};
			// values.startmonth.value = thebeginmonth;
			
			let startmonthobj = {display: thebeginmonth.value, value: thebeginmonth.value};
			values.startmonth = startmonthobj;
			// values.startmonth = thebeginmonth;

			values.endmonth = theendmonth;

			let lastmonthobj = {display: theendmonth.value, value: theendmonth.value};
			values.lastmonth = lastmonthobj;
			// values.lastmonth = theendmonth;

			values.pk_accperiodscheme = {value : schemeid}
			values.pk_accperiod = {value : accperiodid}
			let row = {
				status : '2',
				values : values
			}
			rows.push(row);
			beginmonth = endmonth + 1;
		}
		return tableQuarterData;
	}

	// 新增会计半年
	getHalfYears(periodnum, halfyearnum, begindate, enddate, monthdata) {
		let rows = [];
		let tableHalfyearData = {
				areacode:'acchalfyear',
				rows:rows
		};
		let step = parseInt(periodnum/halfyearnum) - 1;
		let beginmonth = 1;
		for(let i = 1; i <= halfyearnum; i++){
			let endmonth = beginmonth + step;
			if (i == halfyearnum) {
				endmonth = periodnum;
			}
			let values = {};
			values.halfyear = {value : i}
			values.beginmonth = monthdata.rows[beginmonth - 1].values.accperiodmth;
			
			let valuetempstart = monthdata.rows[beginmonth - 1].values.accperiodmth.value;
			let startmonthobj = {display: valuetempstart, value: valuetempstart};
			values.startmonth = startmonthobj;
			// values.startmonth = monthdata.rows[beginmonth - 1].values.accperiodmth;

			values.endmonth = monthdata.rows[endmonth - 1].values.accperiodmth;

			let valuetemplast =  monthdata.rows[endmonth - 1].values.accperiodmth.value;
			let lastmonthobj = {display: valuetemplast, value: valuetemplast};
			values.lastmonth = lastmonthobj;
			// values.lastmonth = monthdata.rows[endmonth - 1].values.accperiodmth;
			
			values.pk_accperiodscheme = {value : schemeid}
			values.pk_accperiod = {value : accperiodid}
			values.pk_org = {value : 'GLOBLE00000000000000'}
			let row = {
				status : '2',
				values : values
			}
			rows.push(row);
			beginmonth = endmonth + 1;
		}
		return tableHalfyearData;
	}
	// 新增会计月份
	getMonths(periodnum, begindate, enddate) {
		let rows = [];
		let tableMonthData = {
				areacode:'accperiodmonth',
				rows:rows
		};
		let thebegindate = begindate;
		for(let i = 0; i < periodnum; i++){
			// 开始日期所在月份天数
			let dayinmonth = DateUtils.getDateFactor(thebegindate, 'YYYY-MM-DD HH:mm:ss').getDaysInMonth();
			// 开始日期的日
			let daydate = DateUtils.getDateFactor(thebegindate, 'YYYY-MM-DD HH:mm:ss').getDate();
			// 结束日期为与开始日期所在自然月份的最后一天
			let theenddate;
			if (dayinmonth-daydate == 0) {
				theenddate = DateUtils.endOfMonth(thebegindate, 'YYYY-MM-DD HH:mm:ss');
			} else {
				theenddate = DateUtils.getAfterDay(thebegindate, dayinmonth-daydate, 'YYYY-MM-DD HH:mm:ss');
			}
			theenddate = DateUtils.setDateFactor(theenddate, 'YYYY-MM-DD HH:mm:ss').setHour(23).setMinute(59).setSecond(59).format();
			// 如果结束日期超过了全年结束日期,则结束日期等于全年结束日期
			if (DateUtils.isAfter(theenddate, enddate, 'YYYY-MM-DD HH:mm:ss', 'd')) {
				theenddate = enddate;
			}
			// 如果是最后一个会计月,则结束日期等于全年结束日期
			if ((i+1) == periodnum) {
				theenddate = enddate;
			}
			// 会计月份
			let periodmth = i+1;
			if (Number(periodmth) < 10) {
				periodmth = '0' + String(periodmth);
			}
			let values = {};
			values.accperiodmth = {value : String(periodmth)}
			values.begindate = {value : thebegindate}
			values.enddate = {value : theenddate}
			values.isadj = {value : 'N'}
			values.pk_org = {value : 'GLOBLE00000000000000'}
			values.pk_accperiodscheme = {value : schemeid}
			values.pk_accperiod = {value : accperiodid}
			let row = {
				status : '2',
				values : values
			}
			rows.push(row);
			// 计算下一会计月起始日期
			if (DateUtils.isBefore(theenddate, enddate, 'YYYY-MM-DD HH:mm:ss', 'd')) {
				// 下月起始日期为本月终止日期+1
				thebegindate = DateUtils.getAfterDay(theenddate, 1, 'YYYY-MM-DD HH:mm:ss');
				thebegindate = DateUtils.setDateFactor(thebegindate, 'YYYY-MM-DD HH:mm:ss').setHour(0).setMinute(0).setSecond(0).format()
			} else {
				// 如果已经到全年终止日期,则下月起始日期仍为全年终止日期
				thebegindate = theenddate;
				// thebegindate = DateUtils.setDateFactor(thebegindate, 'YYYY-MM-DD HH:mm:ss').setHour(0).setMinute(0).setSecond(0).format()
			}
		}

		// reviewMonths
		// console.log(tableMonthData);
	// 	if (months == null || months.length == 0)
    //   return;
	// let len = tableMonthData.rows;
		let len = tableMonthData.rows.length;
		for(let j = len-1; j >=0; j--){
			let tempEnddate = tableMonthData.rows[j].values.enddate.value;
			let tempBegindate = tableMonthData.rows[j].values.begindate.value;
			if (DateUtils.isBefore(tempEnddate, tempBegindate, 'YYYY-MM-DD HH:mm:ss', 'd')) {
				tableMonthData.rows[j].values.begindate.value = DateUtils.setDateFactor(tempEnddate, 'YYYY-MM-DD HH:mm:ss').setHour(0).setMinute(0).setSecond(0).format();
			}
			if (j != 0) {
				let tempPreEnddate = tableMonthData.rows[j-1].values.enddate.value;
				if (!DateUtils.isAfter(tempBegindate, tempPreEnddate, 'YYYY-MM-DD HH:mm:ss', 'd')) {
					let tempPreEnddate = tableMonthData.rows[j-1].values.enddate.value;
					let afterbegin = tableMonthData.rows[j].values.begindate.value;
					let befBegin = DateUtils.getBeforeDay(afterbegin, 1, 'YYYY-MM-DD HH:mm:ss');
					befBegin = DateUtils.setDateFactor(befBegin, 'YYYY-MM-DD HH:mm:ss').setHour(23).setMinute(59).setSecond(59).format()
					tableMonthData.rows[j-1].values.enddate.value = befBegin;

					// tempPreEnddate = befBegin;
					let aftend = DateUtils.getAfterDay(befBegin, 1, 'YYYY-MM-DD HH:mm:ss');
					aftend = DateUtils.setDateFactor(aftend, 'YYYY-MM-DD HH:mm:ss').setHour(0).setMinute(0).setSecond(0).format()
					
					tableMonthData.rows[j].values.begindate.value = aftend;
				}
			}
			
		}
		return tableMonthData;
	}
	
	getNewEndDate(newStartDate) {
		// 默认结束日期为364(润年365)天之后
		// let tempEnddate = newStartDate.getDateAfter(364);
		let tempEnddate = DateUtils.getAfterDay(newStartDate, 364, 'YYYY-MM-DD HH:mm:ss');
		let monthnum = DateUtils.getDateFactor(newStartDate, 'YYYY-MM-DD HH:mm:ss').getMonth();
		let isLeap = monthnum > 2 ? DateUtils.isLeapYear(tempEnddate, 'YYYY-MM-DD HH:mm:ss') : DateUtils.isLeapYear(newStartDate, 'YYYY-MM-DD HH:mm:ss');
			// monthnum > 2 ? tempEnddate.isLeapYear() : newStartDate.isLeapYear();
		let thisEnddate = isLeap ? DateUtils.getAfterDay(tempEnddate, 1, 'YYYY-MM-DD HH:mm:ss') : tempEnddate;
			// isLeap ? tempEnddate.getDateAfter(1).asEnd(TimeZone.getDefault()) : tempEnddate
			// 	.asEnd(TimeZone.getDefault());
		return thisEnddate;
	}
	
    // 会计期间新增
  	onAddPeriod(preAdd) {
        if (nowNodeChose == '~') {
            // NCMessage.create({content: '会计节点上不能新增子节点！', color: 'warning'});
            return;
		}
		// 获得四个子表的值，取消按钮恢复
		let cardData =  this.props.createExtCardData(pagecode, areaId.accperiod, [areaId.acchalfyear,areaId.accperiodquart,areaId.accperiodmonth,areaId.accperiodadjust]);
		
		buMonth = cardData.bodys.accperiodmonth;
		buQuart = cardData.bodys.accperiodquart;
		buHalfyear = cardData.bodys.acchalfyear;
		buAdjust = cardData.bodys.accperiodadjust;

		// 树不可编辑
		this.props.syncTree.setNodeDisable(treeId, true);
		this.setState({
			isDisabledSearch: true
			});
		// 新增时期间主键清空
		accperiodid = '';
		onclickPreAdd = preAdd;
		// this.loadFormData({id: refpk});
		// let schemeid;
		// 会计年度
		let periodyear;
		// 开始日期
		let begindate;
		// 结束日期
		let enddate;
		// 方案节点
		let schemenode = this.props.syncTree.getSyncTreeValue(treeId, schemeid);
		// 没有叶子节点
		if (!schemenode.children) {
			
			let periodnum = '12';
			let halfyearnum = '2';
			let quarternum = '4';
			
			this.props.form.setFormItemsValue('accperiod',
				{ // 'periodyear':{value:String(periodyear)},
				'periodnum':{value:String(periodnum)},
				'halfyearnum':{value:String(halfyearnum)},
				'quarternum':{value:String(quarternum)},
				// 'begindate':{value:begindate},
				'pk_group':{value:'~'},
				'pk_org':{value:'GLOBLE00000000000000'},
				'islesstwelve' : {value:false},
				// 'enddate':{value:enddate},
				'pk_accperiodscheme':{value:schemenode.refpk}
				});
				
			// 没有叶子节点新增时，起始日期，终止日期都可以编辑
			this.props.form.setFormItemsDisabled('accperiod',{'begindate':false, 'enddate':false});
			// return;
		} else {
		
			// 新增取最大期间
			if (!preAdd) {
				// periodyear = DateUtils.getDateFactor(DateUtils.getCurrentDate('YYYY-MM-DD hh:mm:ss'), 'YYYY-MM-DD hh:mm:ss').getYear();
			// } else {
				// 最大的期间
				let maxaccnode = schemenode.children[schemenode.children.length - 1];
				periodyear = Number(maxaccnode.refname) + 1;
				// 最大期间的结束日期
				let maxenddate = maxaccnode.nodeData.preEnddate;

				// 开始日期为最大期间的结束日期+1day
				begindate = DateUtils.getAfterDay(maxenddate, 1, 'YYYY-MM-DD HH:mm:ss');
				begindate = DateUtils.setDateFactor(begindate, 'YYYY-MM-DD HH:mm:ss').setHour(0).setMinute(0).setSecond(0).format();
				enddate = this.getNewEndDate(begindate);
				enddate = DateUtils.setDateFactor(enddate, 'YYYY-MM-DD HH:mm:ss').setHour(23).setMinute(59).setSecond(59).format()
				
			// 新增时，起始日期不能编辑
			this.props.form.setFormItemsDisabled('accperiod',{'begindate':true, 'enddate':false});

			} else { // 向前新增取最小期间
				let minaccnode = schemenode.children[0];
				periodyear = Number(minaccnode.refname) - 1;
				// 最小期间的开始日期
				let minbegindate = minaccnode.nodeData.preBegindate;
				// 结束日期为最小期间的开始日期-1day
				enddate = DateUtils.getBeforeDay(minbegindate, 1, 'YYYY-MM-DD HH:mm:ss');
				enddate = DateUtils.setDateFactor(enddate, 'YYYY-MM-DD HH:mm:ss').setHour(23).setMinute(59).setSecond(59).format()
				let newmonth = DateUtils.getDateFactor(minbegindate, 'YYYY-MM-DD HH:mm:ss').getMonth();
				newmonth = newmonth  < 10 ? '0' + newmonth : newmonth;
				let newday = DateUtils.getDateFactor(minbegindate, 'YYYY-MM-DD HH:mm:ss').getDate();
				let newbegindate = periodyear + "-" + newmonth + "-" + newday;
				// 如果当前年份不是闰年，起始日期不允许是0229，日直接取28
				if (!DateUtils.isLeapYear(newbegindate, 'YYYY-MM-DD HH:mm:ss') && "0229" == (newmonth + newday)) {
					newday = "28";
				}
				begindate = DateUtils.setDateFactor(enddate, 'YYYY-MM-DD HH:mm:ss').setYear(periodyear).setMonth(newmonth).setDate(newday).setHour(0).setMinute(0).setSecond(0).format()
				// 向前新增时，终止日期不能编辑
				this.props.form.setFormItemsDisabled('accperiod',{'begindate':false, 'enddate':true});
			}

			// let begindate = periodyear + "-01-01 00:00:00";
			// let enddate = periodyear + "-12-31 23:59:59";
			let periodnum = '12';
			let halfyearnum = '2';
			let quarternum = '4';

			// 卡片赋值
			this.props.form.setFormItemsValue('accperiod',
				{'periodyear':{value:String(periodyear)},
				'periodnum':{value:String(periodnum)},
				'halfyearnum':{value:String(halfyearnum)},
				'quarternum':{value:String(quarternum)},
				'begindate':{value:begindate},
				'pk_group':{value:'~'},
				'pk_org':{value:'GLOBLE00000000000000'},
				'pk_accperiod':{value:''},
				'enddate':{value:enddate},
				'islesstwelve' : {value:false},
				'pk_accperiodscheme':{value:schemenode.refpk}
				});
			// 获得各个组件值
			this.getPeriodBodyData(periodyear, periodnum, halfyearnum, quarternum, begindate, enddate, schemenode.refpk);
			
		}
		this.props.form.setFormStatus(areaId.accperiod,'edit');
		pageStatus = "add";
		this.updateButtonStatus('edit');
	}
	
	// 根据卡片值，获得子表等值
	getPeriodBodyData(periodyear, periodnum, halfyearnum, quarternum, begindate, enddate) {

		this.props.cardTable.setTableData(areaId.accperiodmonth, {rows: []});
		this.props.cardTable.setTableData(areaId.acchalfyear, {rows: []});
		this.props.cardTable.setTableData(areaId.accperiodquart, {rows: []});

		var copyData = (data) =>{
			return JSON.parse(JSON.stringify(data))
		};
		setTimeout(()=>{
			// 会计月份
			let monthdata = this.getMonths(periodnum, begindate, enddate);
			this.props.cardTable.setTableData(areaId.accperiodmonth, monthdata);
			// 设置表格可编辑
			this.props.cardTable.setStatus(areaId.accperiodmonth, 'edit');
			// 会计月份，开始日期不能编辑
			this.props.cardTable.setColEditableByKey(areaId.accperiodmonth, 'accperiodmth', true);
			this.props.cardTable.setColEditableByKey(areaId.accperiodmonth, 'begindate', true);
			// 除了最后一个期间，其他期间结束日期可编辑 
			this.props.cardTable.setEditableByIndex(areaId.accperiodmonth, periodnum-1, 'enddate', false);
			
			// 构造月份下拉选项
			let monthOption = [];
			copyData(monthdata).rows.forEach((d) => {
				
				//let optionvalue =  d.values.accperiodmth.value;
				//let option = {display: optionvalue, value: optionvalue};
				let option = {display: d.values.accperiodmth.value, value: d.values.accperiodmth.value};
				monthOption.push(JSON.parse(JSON.stringify(option)));
			});
			// 修改模板，给下拉选项赋值
			let meta = this.props.meta.getMeta();
			// 会计季度
			meta.accperiodquart.items.forEach((item) => {
				if (item.attrcode === 'startmonth') {
					item.options = monthOption;
				}
				if (item.attrcode === 'lastmonth') {
					item.options = monthOption;
				}
			});
			meta['accperiodadjust_childform1'].items.forEach((item) => {
				if (item.attrcode === 'startmonth') {
					item.options = monthOption;
				}
				if (item.attrcode === 'lastmonth') {
					item.options = monthOption;
				}
			});
			meta['accperiodadjust_childform2'].items.forEach((item) => {
				if (item.attrcode === 'startmonth') {
					item.options = monthOption;
				}
				if (item.attrcode === 'lastmonth') {
					item.options = monthOption;
				}
			});
			// 会计半年
			meta.acchalfyear.items.forEach((item) => {
				if (item.attrcode === 'startmonth') {
					item.options = monthOption;
				}
				if (item.attrcode === 'lastmonth') {
					item.options = monthOption;
				}
			});
			meta['acchalfyear_childform1'].items.forEach((item) => {
				if (item.attrcode === 'startmonth') {
					item.options = monthOption;
				}
				if (item.attrcode === 'lastmonth') {
					item.options = monthOption;
				}
			});
			meta['acchalfyear_childform2'].items.forEach((item) => {
				if (item.attrcode === 'startmonth') {
					item.options = monthOption;
				}
				if (item.attrcode === 'lastmonth') {
					item.options = monthOption;
				}
			});
			this.props.meta.setMeta(meta);
			
			// 会计季度
			let quarterdata = this.getQuarters(periodnum, quarternum, begindate, enddate,copyData(monthdata));
			this.props.cardTable.setTableData(areaId.accperiodquart, quarterdata);
			// 设置表格可编辑
			this.props.cardTable.setStatus(areaId.accperiodquart, 'edit');
			// 季度，开始月份不能编辑
			this.props.cardTable.setColEditableByKey(areaId.accperiodquart, 'quarter', true);
			this.props.cardTable.setColEditableByKey(areaId.accperiodquart, 'startmonth', true);
			// 除了最后一个季度，其他季度结束月份可编辑 
			this.props.cardTable.setEditableByIndex(areaId.accperiodquart, quarternum-1, 'lastmonth', false);

			// 会计半年
			let halfyeardata = this.getHalfYears(periodnum, halfyearnum, begindate, enddate, copyData(monthdata));
			this.props.cardTable.setTableData(areaId.acchalfyear, halfyeardata);
			// 设置表格可编辑
			this.props.cardTable.setStatus(areaId.acchalfyear, 'edit');
			// 季度，开始月份不能编辑
			this.props.cardTable.setColEditableByKey(areaId.acchalfyear, 'halfyear', true);
			this.props.cardTable.setColEditableByKey(areaId.acchalfyear, 'startmonth', true);
			// 除了最后一个季度，其他季度结束月份可编辑 
			this.props.cardTable.setEditableByIndex(areaId.acchalfyear, halfyearnum-1, 'lastmonth', false);

			// 会计调整期
			this.props.cardTable.setTableData(areaId.accperiodadjust, {rows: []});
		}, 0);
	}

	// 删除会计期间方案
	onDeleteScheme(selectedTreeNode){
		promptBox({
			color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title:this.state.json['10140AC-000007'],/* 国际化处理： 删除提醒*/
			content:this.state.json['10140AC-000008'],/* 国际化处理： 确定要删除数据吗？*/
			beSureBtnClick: this.onDelForScheme.bind(this, selectedTreeNode)
			})

	}

	onDelForScheme(selectedTreeNode) {
		
        // let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);	//获得选中节点
		let requestParam = {};

		requestParam = {
			pk_accperiodscheme:selectedTreeNode.refpk     
		}

		ajax({
			url: ajaxurls.schemedelete,
			data: requestParam,
			success:(result)=>{
				if(result.success){        
					// this.props.form.EmptyAllFormValue(this.config.formId);
					//调用同步树的接口，删除该树节点
					this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
					toast({title:this.state.json['10140AC-000013'],color:'success'});/* 国际化处理： 删除成功*/
					//删除成功提示
					// Message.create({content: '删除成功！', color: 'success'});//默认top
				}
 
			}
		});

        // this.changeButtonStatus(selectedTreeNode,'del');
	}
	updateButtonStatus(status){ 
		switch (status) {
            case 'root':
				this.props.button.setButtonsVisible({
					Add: false,
					PreAdd: false,
					Edit: false,
					Delete: false,
					Save: false,
					Cancel: false,
					Refresh: true,
					Print: false,
					Output: false,
					AddLine: false,
					EditLine: false,
					SaveLine: false,
                    CancelLine: false,
                    Import: true,
                    Export: true
				});
				this.props.button.setDisabled({
					Add: true,
					PreAdd: true,
					Edit: true,
					Delete: true,
					Save: true,
					Cancel: true,
					Refresh: false,
					Print: true,
					Output: true,
					AddLine: true,
					EditLine: true,
					// DeleteLine: true,
					SaveLine: true,
					CancelLine: true
				});
				break;
			case 'scheme':
				this.props.button.setButtonsVisible({
					Add: true,
					PreAdd: true,
					Edit: false,
					Delete: false,
					Save: false,
					Cancel: false,
					Refresh: true,
					Print: false,
					Output: false,
					AddLine: false,
					EditLine: false,
					SaveLine: false,
                    CancelLine: false,
                    Import: true,
                    Export: true
				});
				this.props.button.setDisabled({
					Add: false,
					PreAdd: isPreAdd,
					Edit: true,
					Delete: true,
					Save: true,
					Cancel: true,
					Refresh: false,
					Print: false,
					Output: false,
					AddLine: true,
					EditLine: true,
					// DeleteLine: true,
					SaveLine: true,
					CancelLine: true
				});
				break;
			case 'leaf':
				this.props.button.setButtonsVisible({
					Add: true,
					PreAdd: true,
					Edit: true,
					Delete: true,
					Save: false,
					Cancel: false,
					Refresh: true,
					Print: true,
					AddLine: true,
					EditLine: true,
                    Output: true,
                    Import: true,
                    Export: true
				});
				this.props.button.setDisabled({
					Add: false,
					PreAdd: isPreAdd,
					Edit: !iseditdel,
					Delete: !iseditdel,
					Save: true,
					Cancel: true,
					Refresh: false,
					Print: false,
					Output: false,
					AddLine: false,
					EditLine: !isEditline,
					// DeleteLine: true,
					SaveLine: true,
					CancelLine: true
				});
				break;
			case 'edit':
				this.props.button.setButtonsVisible({
					Add: false,
					PreAdd: false,
					Edit: false,
					Delete: false,
					Save: true,
					Cancel: true,
					Refresh: false,
					AddLine: false,
					EditLine: false,
					Print: false,
                    Output: false,
                    Import: false,
                    Export: false
				});
				this.props.button.setDisabled({
					Add: true,
					PreAdd: isPreAdd,
					Edit: true,
					Delete: true,
					Save: false,
					Cancel: false,
					Refresh: true,
					Print: true,
					Output: true,
					AddLine: (pageStatus == 'add'),
					EditLine: !isEditline,
					// DeleteLine: true,
					SaveLine: true,
					CancelLine: true
				});
				break;
			case 'editLine':
				this.props.button.setButtonsVisible({
					AddLine: false,
					SaveLine: true,
					EditLine: false,
					CancelLine: true
				});
				this.props.button.setDisabled({
					AddLine: false,
					EditLine: true,
					// DeleteLine: false,
					SaveLine: false,
					CancelLine: false
				});
				this.props.button.setPopContent('DelLine','');
				break;
			case 'browseLine':
				this.props.button.setButtonsVisible({
					AddLine: true,
					SaveLine: false,
					EditLine: true,
					CancelLine: false
				});
				this.props.button.setDisabled({
					AddLine: false,
					EditLine: false,
					// DeleteLine: false,
					SaveLine: true,
					CancelLine: true
				});
				this.props.button.setPopContent('DelLine',this.state.json['10140AC-000000']) /* 国际化处理： 确认要删除该信息吗？*//* 设置操作列上删除按钮的弹窗提示 */
				break;
			// case 'SaveLine':
			// 	this.props.button.setDisabled({
			// 		AddLine: false,
			// 		EditLine: true,
			// 		// DeleteLine: false,
			// 		SaveLine: false,
			// 		CancelLine: false
			// 	});
				break;
			default:
				break;
		}
		this.setState(this.state);
	}
    onSelectTree(refpk, node, selected, nodepra, noload) {
		nowNodeChose = node.refpk;
		nowNodepid = node.pid;
		if (node.refpk == '~') {
			this.updateButtonStatus('root');
			return;
		}
		nowNodeSche = node.nodeData.isScheme;
		// 只有没有叶子节点才不可以向前新增
		if (nowNodeSche && node.children == undefined) {
			isPreAdd = true;
		} else {
			isPreAdd = false;
		}
		
		// 会计期间是否能够修改删除
		iseditdel = node.nodeData.Isnewdataforcurr;
		// 选中会计期间方案
		if (nowNodeSche) {
			schemeid = nowNodeChose;
		} else {
			// 选中会计期间，则给父节点
			schemeid = nowNodepid;
		}
        if (node.nodeData.isScheme) {
			this.updateButtonStatus('scheme');
			// this.props.form.EmptyAllFormValue(areaId.accperiod);
			this.clearCardTable();
			this.props.form.setFormStatus(areaId.accperiod,'browse');
			this.setTableEditFalse();
            return;
		}
    	if(nodepra.selected) {
            this.state.selectNode = node;
            if(node.refpk == 'root') {
                // this.props.form.EmptyAllFormValue(areaId.accperiod);
				this.clearCardTable();
				this.props.form.setFormStatus(areaId.accperiod,'browse');
				this.setTableEditFalse();
                return;
			}
			// 会计调整期的开始月，结束月参照增加条件
			var meta = this.props.meta.getMeta();
			meta.accperiodadjust.items.forEach(item => {
				if(item.attrcode == 'beginmonth'){
					item.queryCondition = () =>{
						return {
							pk_accperiodscheme: nowNodepid,
							pk_accperiod: nowNodeChose
						};
					};
				}
				if(item.attrcode == 'endmonth'){
					item.queryCondition = () =>{
						return {
							pk_accperiodscheme: nowNodepid,
							pk_accperiod: nowNodeChose
						};
					};
				}
			});
			this.props.meta.setMeta(meta);
			if (!noload) {
				this.loadFormData({id: refpk});
			}
		}
		
	}
	// 设置表格浏览态 
	setTableEditFalse() {
		this.props.cardTable.setStatus(areaId.accperiodmonth, 'browse');
		this.props.cardTable.setStatus(areaId.accperiodquart, 'browse');
		this.props.cardTable.setStatus(areaId.acchalfyear, 'browse');
	}
    loadFormData({id = undefined, pid = undefined, callback = EMPTY_FN}){
		// this.props.form.EmptyAllFormValue(areaId.accperiod);
		this.clearCardTable();
		this.props.form.setFormStatus(areaId.accperiod,'browse');
		this.setTableEditFalse();
        ajax({
            url: ajaxurls.dataload,
            data: {
                pk_accperiod: id
            },
            success:(result) => {
            	// console.log(result.data)
                if(!result.data){
                   return;
				}
				
                delete result.data['pageid'];
				
				// console.log(result.data.head);
				let cardData = {rows: result.data.head.accperiod.rows};
				let cardvalue = {accperiod: cardData}
				this.props.form.setAllFormValue(cardvalue);

				// 会计月份
				let rowsmonth = [];
				let tableMonthData = {
						areacode:'accperiodmonth',
						rows:rowsmonth
				};
				// 会计调整期
				let rowsadj = [];
				let tableAdjData = {
						areacode:'accperiodadjust',
						rows:rowsadj
				};
				// this.props.form.setAllFormValue(result.data.head);
				let allmonth;
				if (result.data.bodys.accperiodmonth) {
					allmonth = result.data.bodys.accperiodmonth;
				} else {
					allmonth = result.data.bodys.accperiodadjust;
				}

				// 构造月份下拉选项
				let monthOption = [];
				// result.data.bodys.accperiodmonth.rows.forEach( (d)  => { 
				allmonth.rows.forEach( (d)  => { 
                	if (d.values.isadj.value) {
						d.values.beginmonth.display = d.values.beginmonth.value;
						d.values.endmonth.display = d.values.endmonth.value;
						rowsadj.push(d);
					} else {
						rowsmonth.push(d);
					}
					let optionvalue =  d.values.accperiodmth.value;
					let option = {display: optionvalue, value: optionvalue};
					monthOption.push(JSON.parse(JSON.stringify(option)));
				});
				// 修改模板，给下拉选项赋值
				let meta = this.props.meta.getMeta();
				// 会计季度
				meta.accperiodquart.items.forEach((item) => {
					if (item.attrcode === 'startmonth') {
						item.options = monthOption;
					}
					if (item.attrcode === 'lastmonth') {
						item.options = monthOption;
					}
				});
				meta['accperiodadjust_childform1'].items.forEach((item) => {
					if (item.attrcode === 'startmonth') {
						item.options = monthOption;
					}
					if (item.attrcode === 'lastmonth') {
						item.options = monthOption;
					}
				});
				meta['accperiodadjust_childform2'].items.forEach((item) => {
					if (item.attrcode === 'startmonth') {
						item.options = monthOption;
					}
					if (item.attrcode === 'lastmonth') {
						item.options = monthOption;
					}
				});
				// 会计半年
				meta.acchalfyear.items.forEach((item) => {
					if (item.attrcode === 'startmonth') {
						item.options = monthOption;
					}
					if (item.attrcode === 'lastmonth') {
						item.options = monthOption;
					}
				});
				meta['acchalfyear_childform1'].items.forEach((item) => {
					if (item.attrcode === 'startmonth') {
						item.options = monthOption;
					}
					if (item.attrcode === 'lastmonth') {
						item.options = monthOption;
					}
				});
				meta['acchalfyear_childform2'].items.forEach((item) => {
					if (item.attrcode === 'startmonth') {
						item.options = monthOption;
					}
					if (item.attrcode === 'lastmonth') {
						item.options = monthOption;
					}
				});
				this.props.meta.setMeta(meta);
				if (rowsadj.length > 0 ) {
					isEditline = true;
				} else {
					isEditline = false;
				}
                result.data.bodys.acchalfyear.rows.forEach( (d)  => { 
                	d.values.startmonth = {};
                	d.values.lastmonth = {};
                	d.values.startmonth.value = d.values.beginmonth.value;
                	d.values.startmonth.display = d.values.beginmonth.value;
                	d.values.lastmonth.value = d.values.endmonth.value;
                	d.values.lastmonth.display = d.values.endmonth.value;
                });
                result.data.bodys.accperiodquart.rows.forEach( (d)  => { 
                	d.values.startmonth = {};
                	d.values.lastmonth = {};
                	d.values.startmonth.value = d.values.beginmonth.value;
                	d.values.startmonth.display = d.values.beginmonth.value;
                	d.values.lastmonth.value = d.values.endmonth.value;
                	d.values.lastmonth.display = d.values.endmonth.value;
                });
                var editTable = this.props.cardTable;
            	// editTable.setTableData(areaId.accperiodmonth, result.data.bodys.accperiodmonth);
            	editTable.setTableData(areaId.accperiodmonth, tableMonthData);
                editTable.setTableData(areaId.acchalfyear, result.data.bodys.acchalfyear);
				editTable.setTableData(areaId.accperiodquart, result.data.bodys.accperiodquart);
				editTable.setTableData(areaId.accperiodadjust, tableAdjData);
				// editTable.setTableData(areaId.audiInfo, tableAdjData);
				// console.log(editTable.getAllRows(areaId.accperiodmonth));

				this.updateButtonStatus('leaf');

                // callback();
            }
        });
    }
    getPageParam = (key) => {
		return this.props.getUrlParam(key);
	};
	componentDidMount() {
		// this.initLeftTree();
		// ajax({
		// 	url: ajaxurls['schemetreequery'],
		// 	data: {
		// 		pagecode: pagecode   	 //pagecode,在生成的json模板获取
		// 	},
		// 	success:(res) => {
		// 		// this.props.cardTable.setTableData(pagecode, {rows: ['jin','hua']});
		// 	}
		// });
	}
	
	componentWillMount() {
    	let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
       		this.setState({json})       // 保存json和inlt到页面state中并刷新页面
		}
    	getMultiLang({moduleId: '10140AC',domainName: 'uapbd',callback})
    }
	componentDidUpdate(){
		// 会计期间状态
		let formsStatus = this.props.form.getFormStatus(areaId.accperiod);
		//  会计期间方案状态
		let showCodeStatus = this.props.form.getFormStatus(showCode);
		// 会计调整期状态
		// let adjustStatus = this.props.cardTable.getStatus(areaId.accperiodadjust);
		// if((formsStatus != 'add' && formsStatus != 'edit') || (showCodeStatus != 'add' && showCodeStatus != 'edit') || (adjustStatus != 'add' && adjustStatus != 'edit')){
		if(formsStatus != 'add' && formsStatus != 'edit' && showCodeStatus != 'add' && showCodeStatus != 'edit'){
				window.onbeforeunload = null;
		}else{
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}
  	// 树节点编辑
  	onEditScheme(selectedTreeNode){
		// console.log('onEditScheme',selectedTreeNode);
		this.props.meta.setMeta(showSheet);
		this.props.modal.show(modalId,{
			title:this.state.json['10140AC-000004']
		});
		this.props.form.setFormStatus(showCode,'edit');
		// setTimeout(() => {
		// 	this.props.form.setFormStatus(showCode,'edit');
		// },0)
		ajax({
			url: ajaxurls.schemequery,
			data:{pk_accperiodscheme: selectedTreeNode.refpk},
			success:(result)=>{
				if(result.success){
					// this.props.form.EmptyAllFormValue(formId);

					let cardData = {rows:result.data.accperiodscheme.rows};
					let value = {'accperiodscheme':cardData}
					this.props.form.setAllFormValue(value);
					// this.props.form.setAllFormValue(result.data.areaclassForm);
					// this.toggleShow(pageStatus);
				}else{
					alert(result.message);
				}
			}
		});
  }
	onAddSchmeData(selectNode) {
		nowNodeRefpk = selectNode.refpk;
        // if (selectNode.refpk != '~' && !selectNode.nodeData.isScheme) {
        //     NCMessage.create({content: '会计节点上不能新增方案！', color: 'warning'});
        //     return;
        // }
		this.props.meta.setMeta(showSheet);
		this.props.modal.show(modalId,{
			title:this.state.json['10140AC-000004']
		});
		this.props.form.EmptyAllFormValue(showCode);
		this.props.form.setFormStatus(showCode,'edit');

	}
	unaddData() {
		this.props.meta.setMeta(mainSheet);
	}
	saveAddTreeData() {

		//nowNodeRefpk
		//	获取所有单据模板信息accperiodadjust
		let CardData =  this.props.createExtCardData(pagecode, areaId.accperiod, [areaId.acchalfyear,areaId.accperiodquart,areaId.accperiodmonth,areaId.accperiodadjust,areaId.audiInfo]);
		let requestParam = {
            model: CardData,
            pageid: pagecode	//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
		ajax({
			url: ajaxurls.accperiodsave,
			data: CardData.head.accperiod.rows,
			success:  (res) => {
				setTimeout(() => {
					this.initLeftTree();
				})
			}
		});
	}
	saveData() {
		let ischeck = this.props.form.isCheckNow(showCode);
		if (!ischeck) {
			return;
		}
		let data = this.props.form.getAllFormValue(showCode);
		let requestParam = {
            model: data,
            pageid: schemeeditor	//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
		ajax({
			url: ajaxurls.schemesave,
			method: "post",
			data: requestParam,
			success:  (res) => {
				setTimeout(() => {
					this.props.modal.close(modalId);
					this.initLeftTree();
					this.clearCardTable();
					toast({content: this.state.json['10140AC-000009'], color:'success'});/* 国际化处理： 保存成功*/
				})
			}
		});
	}

    closeModalEve() {
    	// this.props.meta.setMeta(mainSheet);
    	this.props.modal.close(modalId);
		// this.props.form.EmptyAllFormValue(showCode);
	}
	getTableHead() {
		let {createButtonApp} = this.props.button
		return (
		<div className="shoulder-definition-area">
			<div className="definition-icons">
				{createButtonApp({
					area: 'card_body',
					buttonLimit: 5,
					onButtonClick: this.onClickButton.bind(this),
					// popContainer: document.querySelector('.card_body')
				})}
			</div>	
		</div>
		)
	}
	// 会计期间卡片编辑后事件
	afterEventPeriodCard(props, moduleId, key, value, oldValue) {
		// 会计年度
		if (key != 'periodyear') {
			if (key == 'begindate') {
				//判断是否为空，为空则不做任何处理
				if(value && value.value){
					let begindate = DateUtils.setDateFactor(value.value, 'YYYY-MM-DD HH:mm:ss').setHour(0).setMinute(0).setSecond(0).format();
					this.props.form.setFormItemsValue(moduleId, {'begindate':{value: begindate}});
				}
			} else if (key == 'enddate') {
				//判断是否为空，为空则不做任何处理
				if(value && value.value){
					let enddate = DateUtils.setDateFactor(value.value, 'YYYY-MM-DD HH:mm:ss').setHour(23).setMinute(59).setSecond(59).format();
					this.props.form.setFormItemsValue(moduleId, {'enddate':{value: enddate}});
				}
			}
			if (key == 'begindate' || key == 'enddate') {
				let begindate1 = this.props.form.getFormItemsValue(moduleId, 'begindate').value;
				let enddate1 = this.props.form.getFormItemsValue(moduleId, 'enddate').value;
				if(!begindate1 || !enddate1){
					return;
				}
			}

			let isless = this.props.form.getFormItemsValue(moduleId, 'islesstwelve').value;
			let periodnum = this.props.form.getFormItemsValue(moduleId, 'periodnum').value;
			if (key == 'periodnum' || key == 'islesstwelve') {
				if (!periodnum) {
					periodnum = value.value;
				}
				
				if (key == 'islesstwelve' && !isless) {
					return;
				}
				if (isless) {
					if (key == 'islesstwelve') {
						toast({content:this.state.json['10140AC-000015'],color:'warning'});/* 国际化处理： 期间个数小于12,业务可能会出现问题*/
						return;
					} 
				}else if(periodnum && Number(periodnum) < 12) {
					toast({content:this.state.json['10140AC-000016'],color:'warning'});/* 国际化处理： 当前期间个数不允许小于12*/
					this.props.form.setFormItemsValue(moduleId,
						{'periodnum':{value: '12'}
						});
					return;
				}
			}
			let periodyear = this.props.form.getFormItemsValue(moduleId, 'periodyear').value;
			// let periodnum = this.props.form.getFormItemsValue(moduleId, 'periodnum');
			let halfyearnum = this.props.form.getFormItemsValue(moduleId, 'halfyearnum').value;
			let quarternum = this.props.form.getFormItemsValue(moduleId, 'quarternum').value;
			let begindate = this.props.form.getFormItemsValue(moduleId, 'begindate').value;
			let enddate = this.props.form.getFormItemsValue(moduleId, 'enddate').value;
			// 获得各个组件值
			this.getPeriodBodyData(periodyear, periodnum, halfyearnum, quarternum, begindate, enddate);
		
		} else {
			let periodyearv = value.value;
			if (periodyearv < '1582') {
				this.props.form.setFormItemsValue(moduleId,
					{'periodyear':{value: ''}
					});
				return;
			}
			if (!Number(periodyearv)) {
			// if (!Number.isNaN(value)) {
			// if (typeof(value.value) != "number") {
				toast({content:this.state.json['10140AC-000017'],color:'warning'});/* 国际化处理： 会计年度需为数字格式*/
				this.props.form.setFormItemsValue(moduleId,
					{'periodyear':{value: ''}
					});
				return;
			}

			let begindatev = periodyearv + "-01-01 00:00:00";
			let enddatev = periodyearv + "-12-31 23:59:59";
			// 卡片赋值
			this.props.form.setFormItemsValue('accperiod',
				{
				'begindate':{value:begindatev},
				'enddate':{value:enddatev}
				});

			let periodnumv = this.props.form.getFormItemsValue(moduleId,'periodnum').value;
			let halfyearnumv = this.props.form.getFormItemsValue(moduleId,'halfyearnum').value;
			let quarternumv = this.props.form.getFormItemsValue(moduleId,'quarternum').value;
			// let periodnum = this.props.form.getFormItemsValue(moduleId,'periodnum');
			// 获得各个组件值
			this.getPeriodBodyData(periodyearv, periodnumv, halfyearnumv, quarternumv, begindatev, enddatev);
		
		}
	}
	//会计月份表格编辑后事件
	onAfterEventMonth(props, moduleId , key, changerows, value, index, data) {
		// 结束日期
		if (key === 'enddate') {
			//判断是否为空，为空则不做任何处理
			if(changerows){
				// 本月终止日期格式化
				let theenddate = DateUtils.setDateFactor(changerows, 'YYYY-MM-DD HH:mm:ss').setHour(23).setMinute(59).setSecond(59).format();
				this.props.cardTable.setValByKeyAndIndex(areaId.accperiodmonth, index, 'enddate', {value: theenddate});
				// 下月起始日期为本月终止日期+1
				let thebegindate = DateUtils.getAfterDay(changerows, 1, 'YYYY-MM-DD HH:mm:ss');
				thebegindate = DateUtils.setDateFactor(thebegindate, 'YYYY-MM-DD HH:mm:ss').setHour(0).setMinute(0).setSecond(0).format();
				this.props.cardTable.setValByKeyAndIndex(areaId.accperiodmonth, index+1, 'begindate', {value: thebegindate});
			}
			
		}
	}
	//会计季度表格编辑后事件
	onAfterEventQuart(props, moduleId , key, changerows, value, index, data) {
		// 结束月
		if (key === 'lastmonth') {
			let nextmonth = Number(changerows) + 1;
			if(nextmonth < 10) {
				nextmonth = '0' + nextmonth.toString();
			} else {
				nextmonth = nextmonth.toString();
			}
			this.props.cardTable.setValByKeyAndIndex(areaId.accperiodquart, index, 'endmonth', {value: changerows});
			this.props.cardTable.setValByKeyAndIndex(areaId.accperiodquart, index, 'lastmonth', {value: changerows, display: changerows});

			this.props.cardTable.setValByKeyAndIndex(areaId.accperiodquart, index+1, 'beginmonth', {value: nextmonth});
			this.props.cardTable.setValByKeyAndIndex(areaId.accperiodquart, index+1, 'startmonth', {value: nextmonth, display: nextmonth});

		}
	}
	//会计半年表格编辑后事件
	onAfterEventHalfyear(props, moduleId , key, changerows, value, index, data) {
		// 结束月
		if (key === 'lastmonth') {
			let nextmonth = Number(changerows) + 1;
			if(nextmonth < 10) {
				nextmonth = '0' + nextmonth.toString();
			} else {
				nextmonth = nextmonth.toString();
			}
			this.props.cardTable.setValByKeyAndIndex(areaId.acchalfyear, index, 'endmonth', {value: changerows});
			this.props.cardTable.setValByKeyAndIndex(areaId.acchalfyear, index, 'lastmonth', {value: changerows, display: changerows});

			this.props.cardTable.setValByKeyAndIndex(areaId.acchalfyear, index+1, 'beginmonth', {value: nextmonth});
			this.props.cardTable.setValByKeyAndIndex(areaId.acchalfyear, index+1, 'startmonth', {value: nextmonth, display: nextmonth});

		}
	}
	//会计调整期表格编辑后事件
	onAfterEventAdj(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
		if(key === 'beginmonth' || key === 'endmonth'){
			// data.values[key].display取不到值了，换成changerows.refname
			// let displayvalue = data.values[key].display;
			let displayvalue = changerows.refname;
			this.props.cardTable.setValByKeyAndIndex(moduleId, index, key, {value: displayvalue});//设置默认值
		}
	}

	// 自动增行后的回调
	addRowAutoCallback() {
		let adjdata = this.props.cardTable.getAllData(areaId.accperiodadjust);
		let indexno = adjdata.rows.length - 1;
		this.props.cardTable.setValByKeyAndIndex(areaId.accperiodadjust, indexno, 'pk_accperiodscheme', {value: nowNodepid });
		this.props.cardTable.setValByKeyAndIndex(areaId.accperiodadjust, indexno, 'pk_accperiod', {value: nowNodeChose });
		this.props.cardTable.setValByKeyAndIndex(areaId.accperiodadjust, indexno, 'isadj', {value: true });
		this.props.cardTable.setValByKeyAndIndex(areaId.accperiodadjust, indexno, 'pk_org', {value: 'GLOBLE00000000000000' });
				
	}

	render() {
		const { table, button, search, form, editTable, syncTree, modal, DragWidthCom, cardTable ,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
    	let { createSyncTree } = syncTree;
		let { createButton } = button;
		const { createButtonApp } = button;
    	let { createForm } = form;
    	const { createCardTable } = cardTable;
    	let { NCCreateSearch } = search;
    	let { createModal } = modal;
		return (
			<div className="nc-bill-tree-card">
				<NCDiv areaCode={NCDiv.config.HEADER} className="header">
                    {
                        createBillHeadInfo(
                            {
                                title :this.state.json[this.config.title]/* 国际化处理： 会计期间*/,             //标题
                                initShowBackBtn:false
                            }
                        )}
				{createModal('modalCancel',{noFooter:false})}
					 {/* 按钮区  btn-group */}
					 <div className="btn-group">
                       {createButtonApp({
                            area: 'card_head',
                            buttonLimit: 5,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.card_head')
                        })}
                    </div>
				</NCDiv>
				<div className="tree-card">
					<DragWidthCom
						defLeftWid = '280px'
						leftDom = {
							<div className = "tree-area">
								{createSyncTree({
					                treeId : treeId,
					                needEdit: true,   //不启用编辑
					                showLine: false,  //显示连线
					                needSearch: true, //是否需要搜索框
					                onSelectEve: this.onSelectTree.bind(this),			 //选择
					                clickEditIconEve: this.onEditScheme.bind(this),  //编辑点击 回调
					                clickAddIconEve: this.onAddSchmeData.bind(this),    //新增点击 回调
									clickDelIconEve: this.onDeleteScheme.bind(this), // 删除点击 回调
									onMouseEnterEve:this.onMouseEnterEve.bind(this),//鼠标滑过节点事件
									showModal: false,
									disabledSearch: this.state.isDisabledSearch
				                })}
							</div>
						}
						rightDom = {
							<div>
								<div className="nc-bill-tableTab-area">
	      							{createForm(areaId.accperiod, {
										  onAfterEvent: this.afterEventPeriodCard.bind(this), 
									})}
								</div>
								
								{createModal(modalId, {
				                    title:this.state.json['10140AC-000004'],/* 国际化处理： 会计期间方案*/
				                    size:'xlg',									//模态框大小 sm/lg/xlg
									beSureBtnClick: this.saveData.bind(this), 	//点击确定按钮事件
									cancelBtnClick: ()=>{//无法控制是否关闭模态框
										// this.props.modal.show('warning',{
										// 	beSureBtnClick:()=>{
										// 		this.props.modal.close(modalId);
										// 		this.props.modal.close('warning');
										// 	}
										// });
										promptBox({
											color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
											title:this.state.json['10140AC-000021'],/* 国际化处理： 确认关闭*/
											content:this.state.json['10140AC-000022'],/* 国际化处理： 是否确认要关闭？*/
											beSureBtnClick:()=>{
												this.props.modal.close(modalId);
												this.props.form.setFormStatus(showCode,'browse');
											}
											})
									},
					                // cancelBtnClick: this.closeModalEve, 		//取消按钮事件回调
									//closeModalEve: this.closeModalEve, 			//关闭按钮事件回调
									userControl:true,//自己控制什么时候关闭窗口
				                    content: function() {
				                    	return (
				                    		<div>
												{createForm(showCode, {

												})}
											</div>
				                    	)
				                    }.bind(this)(),
								})}
							<NCAnchor>
                                <NCScrollLink
									to= {areaId.accperiodmonth}
									containerId = 'scroll_container'
                                    spy={true}
                                    smooth={true}
                                    duration={300}
                                    offset={-100}
                                >
                                    <p>{this.state.json['10140AC-000023']/* 国际化处理： 会计月份*/}</p>
                                </NCScrollLink>
                                <NCScrollLink
                                    to= {areaId.accperiodquart}
									containerId = 'scroll_container'
                                    spy={true}
                                    smooth={true}
                                    duration={300}
                                    offset={-100}
                                >
                                    <p>{this.state.json['10140AC-000024']/* 国际化处理： 会计季度*/}</p>
                                </NCScrollLink>
                                <NCScrollLink
                                    to= {areaId.acchalfyear}
									containerId = 'scroll_container'
                                    spy={true}
                                    smooth={true}
                                    duration={300}
                                    offset={-100}
                                >
                                    <p>{this.state.json['10140AC-000025']/* 国际化处理： 会计半年*/}</p>
                                </NCScrollLink>
                                <NCScrollLink
                                    to= {areaId.accperiodadjust}
									containerId = 'scroll_container'
                                    spy={true}
                                    smooth={true}
                                    duration={300}
                                    offset={-100}
                                >
                                    <p>{this.state.json['10140AC-000026']/* 国际化处理： 会计调整期*/}</p>
                                </NCScrollLink>
                                
               	 			</NCAnchor>
								
								<NCScrollElement name={areaId.accperiodmonth}>
									<div className="nc-bill-table-area">
										<div className="table-area-header">
											{/* <span className="table-area-header-title">付款协议</span> */}
											{ /* //会计月份 */ }
											{createCardTable(areaId.accperiodmonth, {
												onAfterEvent: this.onAfterEventMonth.bind(this),   

											})}
										</div>
									</div>
								</NCScrollElement>
								<NCScrollElement name={areaId.accperiodquart}>
									<div className="header-button-area nc-bill-tableTab-area">
										{/*  //会计季度  */}
										{createCardTable(areaId.accperiodquart, {
												onAfterEvent: this.onAfterEventQuart.bind(this),   

										})}
									</div>
								</NCScrollElement>
								<NCScrollElement name={areaId.acchalfyear}>
									<div className="header-button-area nc-bill-tableTab-area">
										{/* //会计半年 */}
										{createCardTable(areaId.acchalfyear, {
												onAfterEvent: this.onAfterEventHalfyear.bind(this),  

										})}
									</div>
								</NCScrollElement>
								<NCScrollElement name={areaId.accperiodadjust}>
									<div className="nc-bill-table-area">
									<div className="table-area-header">
											{/* <span className="table-area-header-title">付款协议</span> */}
											{ /* //会计调整期 */ }
											{createCardTable(areaId.accperiodadjust, { 
												tableHead: this.getTableHead.bind(this,),
												onAfterEvent: this.onAfterEventAdj.bind(this),                      // 控件的编辑后事件  
												isAddRow: true,   // 失去焦点是否自动增行
												addRowCallback: this.addRowAutoCallback.bind(this),	// 自动增行后的回调
												
											})}
										</div>
									</div>
								</NCScrollElement>
								<PrintOutput
									ref = 'printOutput'
									url = {ajaxurls.accperiodprint}
									data = {{
										funcode: funcode,      //功能节点编码，即模板编码
										nodekey: 'accperiodcard',     //模板节点标识
										oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
										outputType: "output"
									}}
									//callback={this.onSubmit}
								>
								</PrintOutput>
							</div>
						}
					/>
                    <ExcelImport
                        {...this.props}
                        moduleName = "uapbd"//模块名
                        pagecode= {pagecode}
                        appcode= {funcode}
                        selectedPKS = {[]}
                        billType = "accperiodschemeinfo"//单据类型
                    />
				</div>
			</div>
		)
	}
}

Accp = createPage({
	// initTemplate: initTemplate,
    // mutiLangCode: '10140AC'
})(Accp);

ReactDOM.render(<Accp/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65