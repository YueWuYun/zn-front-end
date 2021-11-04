//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax ,NCCreateSearch,toast,print,high,promptBox,getMultiLang,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
import { Map } from 'immutable';
import createUIDom from '../../../public/utils/BDCreateUIDom';
let { NCMessage:Message,NCCol:Col,NCRow:Row,NCDropdown:Dropdown,NCMenu:Menu,NCButton:Button,NCCheckbox:Checkbox,NCTooltip:Tooltip } = base;
const {NCMenu,NCDropdown,NCCheckbox,NCPopconfirm,NCMessage} = base;
const {NCMenuGroup} = NCMenu;
const { Item } = Menu;
const {NCDiv} = base;
const {PrintOutput,ExcelImport}=high;

/****************参数  开始***********************/
let treeId = 'OppdimenTree';//树组件Id
let pagecode = '10140MEAS_measdoc';
let tableid = 'measdoc';
const appcode='10140MEAS';
const billType ='measdoc_glo';
let urls={
    queryTempletUrl:"/nccloud/platform/templet/querypage.do",
    queryTableUrl:"/nccloud/uapbd/meas/QueryMeasdocsByOppdAction.do",
    setBaseUrl:"/nccloud/uapbd/meas/SetOppDimenBaseAction.do",
	saveUrl:'/nccloud/uapbd/meas/MeasdocSaveAction.do',	
	printUrl:'/nccloud/uapbd/meas/MeasdocPrintAction.do',
	delByPkUrl:'/nccloud/uapbd/meas/MeasdocDeleteByPkAction.do'
};





/* let nodeTitle = '计量单位';//节点标题
let kvMap = new Map([['W',this.state.json['10140MEAS-000000']],['L',this.state.json['10140MEAS-000001']],['A',this.state.json['10140MEAS-000002']],['V',this.state.json['10140MEAS-000003']],['P',this.state.json['10140MEAS-000004']],['T',this.state.json['10140MEAS-000005']],['E',this.state.json['10140MEAS-000006']]]); *//* 国际化处理： 重量,长度,面积,体积,件数,时间,其他*/
/***************参数  结束********************/


const tableBtnAry = ["DelLine","SetBase"];	
const keys = ['oppdimen','basecodeflag','bitnumber'];

/**
 * 计量单位
 */
class Meas extends Component {
    constructor(props){
        super(props)
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
		this.state={
			pks:[],	
			nodeTitle:'',
			kvMap:new Map(),
			json:{},
			inlt:null
		}
		this.initTemplate(this.props,()=>{
			this.loadTreeData();
		})
	}
	
	modifierMeta(props, meta,status) {
		let cthis = this;
		//.console.log(meta);
		meta.measdoc.items.map((ele)=>{
			if(ele.attrcode === 'oppdimen'){
				ele.disabled = true;
			}
		})
		let porCol = {
			attrcode: 'opr',
			label: cthis.state.json['10140MEAS-000023'],/* 国际化处理： 操作*/
			itemtype:'customer',
			width: '200px',
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			render(text, record, index) {
				
				return (
					props.button.createOprationButton(
						record.values.basecodeflag.value === true ? ["DelLine"] :tableBtnAry,
						{
							area: "table-opr-button",
							buttonLimit: 3,
							onButtonClick: (props, id) => {
								let cpk_measdoc = record.values.pk_measdoc.value;
								let cnums = props.editTable.getNumberOfRows(tableid);
								let isBase = (record.values.basecodeflag.value === true);
								let canDel = (isBase && cnums > 1);
								switch (id) {
									case 'DelLine':
							
									if(canDel){
										toast({ color: 'warning', content: cthis.state.json['10140MEAS-000013'] });/* 国际化处理： 在全部删除计量档案之前不能删除基本计量单位!*/
										return;
									}
							
											 ajax({
												url:urls.delByPkUrl,
												data:{
													"pk_measdoc":cpk_measdoc,
													"ts":record.values.ts.value
												},
												success: (e) => {
													toast({ color: 'success', title: cthis.state.json['10140MEAS-000022'] });/* 国际化处理： 删除成功！*/
													props.editTable.deleteTableRowsByIndex(tableid, index,true);
											}}); 
										
							
									return;
									break;
									case 'SetBase':
									promptBox({
										color:"warning",
										title:cthis.state.json['10140MEAS-000026'],/* 国际化处理： 询问*/
										size:'lg',
										content: cthis.state.json['10140MEAS-000025'],/* 确定将此设置为基本计量单位吗？一旦设置，其它计量档案的换算率将自动重算！*/
										beSureBtnClick: ()=>{
											if(isBase){
												return;
											}
											let doppd = record.values.oppdimen.value;//取出操作的量纲
											let dpk_measdoc = record.values.pk_measdoc.value;//取出操作的pk值
											
											ajax({
												url:urls.setBaseUrl,
												data:{
													pk_meas: dpk_measdoc,
													oppdimen:doppd,
												},	
												success:function(res){
													let { success ,data} = res;
													if(success)
														{
															if(data){
																props.editTable.setTableData(tableid,res.data[tableid]);
																}else{
																	props.editTable.setTableData(tableid,{rows:[]});
																}
														}
									
												}
											});							
									}
									});	
									break;									
									default:
									break;
								}								
							}
						}
					)
					
				)
				
			}
		};
		meta[tableid].items.push(porCol);
	
		return meta;
	}
	
	/**
	 * 单据模板
	 * @param props
	 */
	 initTemplate = (props,callback)=>{
	
		createUIDom(props)({
			pagecode : pagecode,
		},
		{
            moduleId: "10140MEAS",domainName: 'uapbd'
        },  
		(data,langData,inlt)=>{
			if(langData){
                this.state.json = langData
                if(inlt){
                    this.state.inlt = inlt
				}
				this.state.kvMap.set('W',this.state.json['10140MEAS-000000']);/* 国际化处理： 重量*/
				this.state.kvMap.set('L',this.state.json['10140MEAS-000001']);/* 国际化处理： 长度*/
				this.state.kvMap.set('A',this.state.json['10140MEAS-000002']);/* 国际化处理： 面积*/
				this.state.kvMap.set('V',this.state.json['10140MEAS-000003']);/* 国际化处理： 体积*/
				this.state.kvMap.set('P',this.state.json['10140MEAS-000004']);/* 国际化处理： 件数*/
				this.state.kvMap.set('T',this.state.json['10140MEAS-000005']);/* 国际化处理： 时间*/
				this.state.kvMap.set('E',this.state.json['10140MEAS-000006']);		/* 国际化处理： 其他*/
				this.state.nodeTitle = this.state.json['10140MEAS-000007'];/* 国际化处理： 计量单位*/				
			}
			this.setState(this.state,()=>{
			if(data){
			let meta = data.template;
			//console.log(data);
			meta[tableid].showindex=true;
			meta = this.modifierMeta(props, meta)
			props.meta.setMeta(meta);
		  if(data.button){
			  props.button.setButtons(data.button);
			  props.button.setPopContent('DelLine',this.state.json['10140MEAS-000019']) /* 设置操作列上删除按钮的弹窗提示 */
			  let excelimportconfig = excelImportconfig(props,'uapbd',billType,true,'',{appcode: appcode,pagecode: pagecode},()=>{
				this.onRefresh();
			  });
			  props.button.setUploadConfig("import",excelimportconfig);
			}
		}

			callback && callback();
	});

		
		});
	
	
	}
	
	componentWillMount() {
		/*
		let callback = (json) => {
			this.state.json = json;
			this.state.kvMap.set('W',this.state.json['10140MEAS-000000']);// 国际化处理： 重量
			this.state.kvMap.set('L',this.state.json['10140MEAS-000001']);// 国际化处理： 长度
			this.state.kvMap.set('A',this.state.json['10140MEAS-000002']);// 国际化处理： 面积
			this.state.kvMap.set('V',this.state.json['10140MEAS-000003']);// 国际化处理： 体积
			this.state.kvMap.set('P',this.state.json['10140MEAS-000004']);// 国际化处理： 件数
			this.state.kvMap.set('T',this.state.json['10140MEAS-000005']);// 国际化处理： 时间
			this.state.kvMap.set('E',this.state.json['10140MEAS-000006']);		// 国际化处理： 其他
			this.state.nodeTitle = this.state.json['10140MEAS-000007'];// 国际化处理： 计量单位
			this.setState(this.state,()=>{
				this.loadTreeData();
			});

		}
		getMultiLang({moduleId: "10140MEAS",domainName: 'uapbd',callback})
		*/
	}	

        //请求列表数据
	getData = (treePk,callFn) => {
		ajax({
			url: urls.queryTableUrl,
			data:{
				"treePk":treePk,
			},
			success: (res) => {
                let { success, data } = res;                
				if (success) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						this.props.dealFormulamsg(res.formulamsg,
							{
								"measdoc":"editTable",
							})
					}
                    if(data){
						callFn && callFn();
					this.props.editTable.setTableData(tableid, data[tableid]);
					this.props.button.setDisabled({
						editButton:false,
						delButton:true,
						Print:false,
						Output:false
					});


                    }else{
						this.props.editTable.setTableData(tableid,{rows:[]});
						this.props.button.setDisabled({
							editButton:true,
							delButton:true,
							Print:true,
							Output:true
						});

					}

				}
			}
		});
    };

	loadTreeData = () =>{
		let treeData =[
			{				
				"refcode": "",
				"refname": this.state.json['10140MEAS-000008'],/* 国际化处理： 量纲*/
				"refpk": "root",
				"values": {},
				editIcon:true, 
				delIcon:false, 
				addIcon:false,
				"children":[
					{
						"isleaf":true,
						"pid": "root", //父元素pk
						"refcode": "",// 编码
						"refname": this.state.json['10140MEAS-000000'],//名称/* 国际化处理： 重量*/
						"refpk": "W",//主键
						"values": {},//自定义属性
					},
					{
						"isleaf":true,
						"pid": "root", //父元素pk
						"refcode": "",// 编码
						"refname": this.state.json['10140MEAS-000001'],//名称/* 国际化处理： 长度*/
						"refpk": "L",//主键
						"values": {}//自定义属性
					},
					{
						"isleaf":true,
						"pid": "root", //父元素pk
						"refcode": "",// 编码
						"refname": this.state.json['10140MEAS-000002'],//名称/* 国际化处理： 面积*/
						"refpk": "A",//主键
						"values": {}//自定义属性
					},
					{
						"isleaf":true,
						"pid": "root", //父元素pk
						"refcode": "",// 编码
						"refname": this.state.json['10140MEAS-000003'],//名称/* 国际化处理： 体积*/
						"refpk": "V",//主键
						"values": {}//自定义属性
					},
					{
						"isleaf":true,
						"pid": "root", //父元素pk
						"refcode": "",// 编码
						"refname": this.state.json['10140MEAS-000004'],//名称/* 国际化处理： 件数*/
						"refpk": "P",//主键
						"values": {}//自定义属性
					},
					{
						"isleaf":true,
						"pid": "root", //父元素pk
						"refcode": "",// 编码
						"refname": this.state.json['10140MEAS-000005'],//名称/* 国际化处理： 时间*/
						"refpk": "T",//主键
						"values": {}//自定义属性
					},
					{
						"isleaf":true,
						"pid": "root", //父元素pk
						"refcode": "",// 编码
						"refname": this.state.json['10140MEAS-000006'],//名称/* 国际化处理： 其他*/
						"refpk": "E",//主键
						"values": {}//自定义属性
					},					
				]
			},
		]; 
        this.props.syncTree.setSyncTreeData(treeId,treeData);
        this.props.syncTree.openNodeByPk(treeId, "root");//默认打开整棵树；
	}

	
	componentDidUpdate(){//fix--增加编辑态离开按钮提醒20180925 added  by liusenc 
		//form如果是编辑态，关闭浏览器需要给你提示
		let formstatus = this.props.editTable.getStatus(tableid);

		
		if((formstatus == undefined || formstatus == 'browse')){
			window.onbeforeunload = null;
		}else{
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
				return '';
				};
		}
	}      		
    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){

		//this.loadTreeData();
        //修改按钮状态
		this.initButtonStatus();


    }

	onMouseEnterEve(key){
		let obj = {
			delIcon:false, //false:隐藏； true:显示; 默认都为true显示
			editIcon:false,
			addIcon:false
		};
		this.props.syncTree.hideIcon(treeId, key, obj );
	}

    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus(){
		this.props.button.setButtonsVisible({
			saveButton:false,
			cancelButton:false,
			setBaseButton:false,

		});
		this.props.button.setDisabled({
			addButton:true,
			editButton:true,
			delButton:true,
			Print:true,
			Output:true,
			Refresh:true,
		});

    }

    /**
     * 点击树节点
     * @param refpk
     */
	onSelectTree= (pk,item) => {
		if (pk === "root"){
			this.props.button.setDisabled({
				addButton:true,
				editButton:true,
				delButton:true,
				Print:true,
				Output:true,
				Refresh:true,
			});
			return;
		}
		this.props.button.setDisabled({
			addButton:false,
			editButton:false,
			delButton:true,
			Print:false,
			Output:false,
			Refresh:false,
		});	
		//console.log(pk);
		//console.log(item);
		//只有选中树的时候才能把新增按钮放开；当树上有数据的时候，修改和删除才可用；

		this.getData(pk);//这里暂时将登陆的pk_org设置为空
	}

    onAdd(){
		let selNode = this.props.syncTree.getSelectNode('OppdimenTree');
		if(selNode === undefined || selNode === null){
			return;
		}
		this.props.editTable.setStatus(tableid, 'edit');
		this.props.syncTree.setNodeDisable(treeId,true);//禁用整棵树；		
		this.changeButtonStatus('add');			
		this.props.editTable.hideColByKey(tableid,'opr');//隐藏操作列
		let num = this.props.editTable.getNumberOfRows(tableid);
		this.props.editTable.addRow(tableid,num,true);
		//let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		let oppdi =this.props.syncTree.getSelectNode('OppdimenTree');//["refpk"];
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'oppdimen', {display:oppdi.refname,value: oppdi.refpk });//设置当前选中的量纲
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'basecodeflag', {value: false });//设置是否基本单位默认值
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'bitnumber',{value:'0',display:0});//设置默认小数点为0

	}

	onEdit(){
		this.props.editTable.setStatus(tableid, 'edit');
		this.props.editTable.hideColByKey(tableid,'opr');//隐藏操作列
        this.changeButtonStatus('edit');
        this.props.syncTree.setNodeDisable(treeId,true);//禁用整棵树；			
	}



 

    /**
     * 取消
     */
    onCancel(){
		promptBox({
			color:"warning",
			title:this.state.json['10140MEAS-000009'],/* 国际化处理： 提示*/
			size:'lg',
			content: this.state.json['10140MEAS-000010'],/* 国际化处理： 确定要取消吗*/
			beSureBtnClick: ()=>{

									
								
								this.props.editTable.filterEmptyRows(tableid,keys);
								this.props.editTable.cancelEdit(tableid,()=>{
									this.props.editTable.setStatus(tableid, 'browse');	
																	//设置树可用
								this.props.syncTree.setNodeDisable(treeId,false);
								//设置操作列显示
								this.props.editTable.showColByKey(tableid,'opr');
								//设置按钮状态
								this.changeButtonStatus('cancel');
								});
								
			
				
				

				

		}
		});	


	}

	onDel(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		if(selectedData.length==0){
			NCMessage.create({content: this.state.json['10140MEAS-000011'], color: 'error', position: 'bottom'})/* 国际化处理： 未选中数据，不能删除!*/
			return 
		}
		let containBase = false;
		let num = this.props.editTable.getNumberOfRows(tableid);
		let rows = [];
		let delIndexes = [];//这个记录在编辑态的时候，界面上新加的，但是并未写入到数据库中，且在这次操作中又被删除了的数据；
		let tableStatus = this.props.editTable.getStatus(tableid);
		if('browse' === tableStatus){
			promptBox({
				color:"warning",
				title:this.state.json['10140MEAS-000030'],/* 国际化处理： 删除*/
				size:'lg',
				content: this.state.json['10140MEAS-000012'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，是否继续？*/
				beSureBtnClick: ()=>{
					selectedData.forEach((val) => {
						if (val.data.values.basecodeflag.value === true ){
							containBase = true;
						}
						
						if(val.data.values.pk_measdoc && val.data.values.pk_measdoc.value && val.data.values.pk_measdoc.value !== ""){//说明是原有的
							val.data.status = '3';//将其设置为待删除项目
							rows.push(val.data);
			
						}
							delIndexes.push(val.index);
						
					});
					if(num > 1 && containBase){
						NCMessage.create({content: this.state.json['10140MEAS-000013'], color: 'error', position: 'bottom'});/* 国际化处理： 在全部删除计量档案之前不能删除基本计量单位!*/
						this.onRefresh();
						return 			
					}
					let data = {
						pageid:pagecode,
						model: {
							areaType: 'table',
							pageinfo: null,
							areacode:tableid,
							rows: rows,
						}
					};
					ajax({
						url: urls.saveUrl,
						data,
						success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
							let { success,data } = res;
							if (success) {
								if(data){
									//暂时不用这个办法，因为不止改动了两个数据，一个启用一个停用，因此，从新刷新一下数据
									this.props.editTable.setTableData(tableid,res.data[tableid]);										
								}else{
									this.props.editTable.setTableData(tableid,{rows:[]});
								}
								this.changeButtonStatus('del');			
							}
						}
					});	
				},
				cancelBtnClick:()=>{
					return;
				}
			});
		}else{//编辑态时，删除；
			selectedData.forEach((val) => {
				if (val.data.values.basecodeflag.value === true ){
					containBase = true;
				}
				/*
				if(val.data.values.pk_measdoc && val.data.values.pk_measdoc.value && val.data.values.pk_measdoc.value !== ""){//说明是原有的
					val.data.status = '3';//将其设置为待删除项目
					rows.push(val.data);
	
				}
				*/
					delIndexes.push(val.index);
				
			});
			if(delIndexes.length > 0){
				this.props.editTable.deleteTableRowsByIndex(tableid,delIndexes);//删除；			
			}	
		}
	}

	onSetBase(){
		let selData = this.props.editTable.getCheckedRows(tableid);
		if(!selData||selData.length ===0){
			toast({content: this.state.json['10140MEAS-000014'], color:'warning'})/* 国际化处理： 请先选择数据！*/
			return;
		}
		let rowIndex = selData[0].index;
		let oppd = selData[0].data.values.oppdimen.value;//取出操作的量纲
		let pk_measdoc = selData[0].data.values.pk_measdoc.value;//取出操作的pk值
		
		ajax({
			url:urls.setBaseUrl,
			data:{
				pk_meas: pk_measdoc,
				oppdimen:oppd,
			},	
			success:function(res){
				let { success ,data} = res;
				if(success)
					{
						//this.props.editTable.setValByKeyAndIndex(tableid,rowIndex,'basecodeflag',{value:true});//如果调用成功，那么前台将该行的启用状态打开
						//暂时不用这个办法，因为不止改动了两个数据，一个启用一个停用，因此，从新刷新一下数据
						// this.props.editTable.setTableData(tableid, data[tableid]);
						this.loadTreeData();
					}

			}.bind(this),
		});

	}


	//增加一个函数，用来做全表的数据重复行校验：
	checkDuplicate(){
		let allTableData = this.props.editTable.getAllRows(tableid);
		console.log(allTableData);
		if(!allTableData || allTableData.length == 0 ){
			return "";
		}
		let mySet = new Set();
		let cindex = 0;
		let checkString =this.state.json["10140MEAS-000027"];
		allTableData.forEach((ele)=>{
			cindex = cindex + 1;
			let ccode = ele.values.code.value;
			if(mySet.has(ccode)){
				checkString = checkString + this.state.json["10140MEAS-000015"]+cindex+this.state.json["10140MEAS-000028"]+ccode+this.state.json["10140MEAS-000029"];
			}else{
				mySet.add(ccode);
			}
		})
		if(checkString === this.state.json["10140MEAS-000027"]){
			checkString = "";
		}
		return checkString;

	}

	onSave(){

		this.props.editTable.filterEmptyRows(tableid,keys);
		let checkString = this.checkDuplicate();
		if(checkString.trim() !== ""){
			toast({content:checkString,color:'warning'});
			return;
		}
		let tableData = this.props.editTable.getChangedRows(tableid,true);

		if(!tableData || tableData.length === 0){
			//toast({content:this.state.json['10140MEAS-000017'],color:'info'});// 国际化处理： 没有要保存的数据
			toast({title : this.state.json['10140MEAS-000018'],color : 'success'});// 国际化处理： 保存成功！
			this.props.editTable.setStatus(tableid, 'browse');
			//设置树可用
			this.props.syncTree.setNodeDisable(treeId,false);
			//设置操作列显示
			this.props.editTable.showColByKey(tableid,'opr');
			//设置按钮状态
			this.changeButtonStatus('cancel');
			this.props.editTable.cancelEdit(tableid)
			this.props.syncTree.setNodeDisable(treeId,false);//禁用整棵树；
			return;
		}
		let tableAllData = this.props.editTable.getAllRows(tableid, true);
		if(!this.props.editTable.checkRequired(tableid,tableAllData)) return;
		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				areacode:tableid,
				rows: tableData,
			}
		};
		this.props.validateToSave(data,()=>{
			ajax({
				url: urls.saveUrl,
				data,
				success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success,data} = res;
					if (success) {
						if(data){
						toast({title : this.state.json['10140MEAS-000018'],color : 'success'});// 国际化处理： 保存成功！
						this.props.editTable.setTableData(tableid,res.data[tableid]);
						}else{
							this.props.editTable.setTableData(tableid,{rows:[]});
						}
						this.props.syncTree.setNodeDisable(treeId,false);//放开整颗树；
			//设置操作列显示
						this.props.editTable.setStatus(tableid, 'browse');//将表格放开
						this.props.editTable.showColByKey(tableid,'opr');                    
						this.changeButtonStatus('save');
					}
				}.bind(this)
			});	
		},{'measdoc':'editTable'},'grid');
		


	}

	/*
	onSave(){
		//校验一下整张表的数据；
		//this.props.editTable.filterEmptyRows(tableid,keys);
		let rownum = this.props.editTable.getNumberOfRows(tableid);
		let i = 0;
		for(;i<rownum;i++){
			let isCodeNameNull = (
				this.props.editTable.getValByKeyAndIndex(tableid,i,'code').value === "" ||
				this.props.editTable.getValByKeyAndIndex(tableid,i,'name').value === ""
			);
		if(isCodeNameNull){
			toast({color:'warning',content:this.state.json['10140MEAS-000015']+(i+1)+this.state.json['10140MEAS-000016']});// 国际化处理： 第,行[计量单位编码].[计量单位名称]不能为空！
			return;
		}
	}		
		//		
		let tableData = this.props.editTable.getChangedRows(tableid,true);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
		let rows = [];
		tableData.forEach((val) => {
			rows.push(val);
		});
		if(rows.length == 0 || !this.props.editTable.checkRequired(tableid,this.props.editTable.getAllRows(tableid,true))){
			//toast({content:this.state.json['10140MEAS-000017'],color:'info'});// 国际化处理： 没有要保存的数据
			toast({title : this.state.json['10140MEAS-000018'],color : 'success'});// 国际化处理： 保存成功！
			this.props.editTable.setStatus(tableid, 'browse');
			//设置树可用
			this.props.syncTree.setNodeDisable(treeId,false);
			//设置操作列显示
			this.props.editTable.showColByKey(tableid,'opr');
			//设置按钮状态
			this.changeButtonStatus('cancel');
			this.props.editTable.cancelEdit(tableid)
			this.props.syncTree.setNodeDisable(treeId,false);//禁用整棵树；
			return;
		}
		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				areacode:tableid,
				rows: rows,
			}
		};

		ajax({
			url: urls.saveUrl,
			data,
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success,data} = res;
				if (success) {
                    if(data){
					toast({title : this.state.json['10140MEAS-000018'],color : 'success'});// 国际化处理： 保存成功！
                    this.props.editTable.setTableData(tableid,res.data[tableid]);
                    }else{
                        this.props.editTable.setTableData(tableid,{rows:[]});
                    }
                    this.props.syncTree.setNodeDisable(treeId,false);//放开整颗树；
		//设置操作列显示
					this.props.editTable.setStatus(tableid, 'browse');//将表格放开
                    this.props.editTable.showColByKey(tableid,'opr');                    
                    this.changeButtonStatus('save');
				}
			}.bind(this)
		});
	}

	*/

    

	/*****button group end*****/
	

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(id){
		// let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点
		let allrows = this.props.editTable.getAllRows(tableid);
		let selNode = this.props.syncTree.getSelectNode(treeId) ;
		let isNull = (selNode === undefined || selNode === null) ;//是否选中了左树；
		let curCheckedRows = this.props.editTable.getCheckedRows(tableid);
		let delActionStatus = (curCheckedRows && curCheckedRows.length > 0);
		let hasData = ( allrows && allrows.length > 0);//是否有数据
		let edopAction = (!isNull && hasData);//如果选中了左树，且表中有数据，那么修改，删除，打印，输出是可以使用的；
		let edAction = !(!isNull && delActionStatus);
		switch(id){
			case 'add':
				this.props.button.setButtonsVisible({
					saveButton:true,
					addButton:true,
					delButton:true,
					cancelButton:true,
					editButton:false,
					setBaseButton:false,
					Print:false,
					Output:false,
					Refresh:false,
					import:false,
					export:false,	
				});
				if(edopAction){
					this.props.button.setDisabled({delButton:edAction})
					
				}else{
					this.props.button.setDisabled({delButton:edAction})
					
				}
				//编辑态时候，将新增按钮设为次要按钮,保存为主要按钮
				this.props.button.setMainButton({addButton:false,saveButton:true});
				this.props.button.setPopContent('DelLine',this.state.json['10140MEAS-000019']);/* 国际化处理： 确认要删除该信息吗？*/
                break;
            case 'edit':
				this.props.button.setButtonsVisible({
					saveButton:true,
					addButton:true,
					delButton:true,
					cancelButton:true,
					editButton:false,
					setBaseButton:false,
					Print:false,
					Output:false,
					Refresh:false,
					import:false,
					export:false,	
				});

				if(edopAction){
					this.props.button.setDisabled({
						addButton:false,
						delButton:edAction,
					});

				}else{
					this.props.button.setDisabled({
						addButton:false,
						delButton:edAction,
					});

				}
				//编辑态时候，将新增按钮设为次要按钮，保存为主要按钮
				this.props.button.setMainButton({addButton:false,saveButton:true});	
				this.props.button.setPopContent('DelLine','');			
                break;
			case 'del':
			this.props.button.setButtonsVisible({
				saveButton:false,
				addButton:true,
				delButton:true,
				cancelButton:false,
				editButton:true,
				setBaseButton:false,
				Print:true,
				Output:true,
				Refresh:true,	
			});				
				if(edopAction){
					this.props.button.setDisabled({
						Print:false,
						Output:false,
						addButton:false,
						editButton:false,
						delButton:edAction,
					});
				}else{
					this.props.button.setDisabled({
						Print:true,
						Output:true,
						addButton:false,
						editButton:true,
						delButton:edAction,
					});
				}
				this.props.button.setPopContent('DelLine',this.state.json['10140MEAS-000019']);			/* 国际化处理： 确认要删除该信息吗？*/
                break;
			case 'save':
			this.props.button.setButtonsVisible({
				saveButton:false,
				addButton:true,
				delButton:true,
				cancelButton:false,
				editButton:true,
				setBaseButton:false,
				Print:true,
				Output:true,
				Refresh:true,
				import:true,
				export:true,	
			});	
				if(edopAction){
					this.props.button.setDisabled({
						Print:false,
						Output:false,
						addButton:false,
						editButton:false,
						delButton:edAction,
					});
				}else{
					this.props.button.setDisabled({
						Print:true,
						Output:true,
						addButton:false,
						editButton:true,
						delButton:edAction,
					});

				}
				//浏览态时候，将新增按钮设为主要按钮，保存为次要按钮
				this.props.button.setMainButton({addButton:true,saveButton:false});	
				this.props.button.setPopContent('DelLine',this.state.json['10140MEAS-000019']);														/* 国际化处理： 确认要删除该信息吗？*/
				break;
			case 'cancel':
			this.props.button.setButtonsVisible({
				saveButton:false,
				addButton:true,
				delButton:true,
				cancelButton:false,
				editButton:true,
				setBaseButton:false,
				Print:true,
				Output:true,
				Refresh:true,	
				import:true,
				export:true,
			});	
			if(edopAction){
				this.props.button.setDisabled({
					Print:false,
					Output:false,
					addButton:false,
					editButton:false,
					delButton:edAction,
				});
			}else{
				this.props.button.setDisabled({
					Print:true,
					Output:true,
					addButton:false,
					editButton:true,
					delButton:edAction,
				});
			}	
			//浏览态时候，将新增按钮设为主要按钮，保存为次要按钮
			this.props.button.setMainButton({addButton:true,saveButton:false});	
			this.props.button.setPopContent('DelLine',this.state.json['10140MEAS-000019']);						/* 国际化处理： 确认要删除该信息吗？*/
				break;
            default :
                break;
        }
    }

	onClickButton(props, id){
		switch (id) {
			case 'editButton':
				this.onEdit();
			break;
			case 'setBaseButton':
				this.onSetBase();
			break;
			case 'delButton':
				this.onDel();
			break;
			case 'addButton':
				this.onAdd();
			break;
			case 'Refresh':
            /*    
                this.loadTreeData();
				 
				this.props.syncTree.setNodeSelected(treeId, "root");
				
                this.props.editTable.setTableData(tableid, {rows:[]});
                */
               this.onRefresh(()=>{
				toast({ color: 'success', title: this.state.json['10140MEAS-000020'] });/* 国际化处理： 刷新成功！*/
			   });

			break;
			case 'saveButton':
				this.onSave();
			break;
			case 'cancelButton':
				this.onCancel();
			break;
			case 'Print':
				let allD = this.props.editTable.getAllData(tableid);
				let pks = [];
				allD.rows.forEach((item,index) => {
					pks.push(item.values['pk_measdoc'].value);
				});
				print(
					'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
					urls.printUrl, 
					{
						//billtype:'',  //单据类型
						funcode: '10140MEAS',      //功能节点编码，即模板编码
						// nodekey:'assprinttem',     //模板节点标识(NC段默认模板配置)
						oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
					}
				);
				break;
			case 'Output':
				let allD1 = this.props.editTable.getAllData(tableid);
				let pks1 = [];
				allD1.rows.forEach((item,index) => {
					pks1.push(item.values['pk_measdoc'].value);
				});
				this.setState({
                    pks: pks1
                 },this.refs.printOutput.open());
				// print(
				// 	'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				// 	urls.printUrl, 
				// 	{
				// 		//billtype:'',  //单据类型
				// 		funcode: '10140MEAS',      //功能节点编码，即模板编码
				// 		// nodekey:'assprinttem',     //模板节点标识(NC段默认模板配置)
				// 		oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
				// 	}
				// );
				break;
				case 'export':
				console.log('export');
				this.props.modal.show('exportFileModal');
				break;
		default :
			break;
		}
	}
onRefresh(callFn){
	let cnode = this.props.syncTree.getSelectNode(treeId);
	if(cnode === undefined || cnode === null){
		return;
	}
    this.getData(cnode.refpk,callFn);
}
onSelectedChange(props, moduleId, newVal, oldVal){
	let selectedData=props.editTable.getCheckedRows(tableid);
	if(selectedData.length==0){
		props.button.setDisabled({delButton:true});

		return 
	}
	props.button.setDisabled({delButton:false});
	

}
onBeforeEdit(props,moduleid,item,index,value,record){
	let cattrCode = item.attrcode;//当前编辑的字段名
	let isBase = record.values.basecodeflag.value;//若编辑的当前行，为基本计量单位，返回的为true
	if(isBase && "scalefactor" === cattrCode){//
		return false;
	}else{//如果编辑的是别的字段
		
	}
	return true;


}

tableButtonClick(props, id, text, record, index){
	
	let cpk_measdoc = record.values.pk_measdoc.value;
	let isBase = (record.values.basecodeflag.value === true);
    switch (id) {
		case 'DelLine':

        if(isBase){
			toast({ color: 'warning', content: this.state.json['10140MEAS-000013'] });/* 国际化处理： 在全部删除计量档案之前不能删除基本计量单位!*/
            return;
        }

 				ajax({
					url:urls.delByPkUrl,
					data:{
						"pk_measdoc":cpk_measdoc,
						"ts":record.values.ts.value
					},
					success: (e) => {
						toast({ color: 'success', title: this.state.json['10140MEAS-000022'] });/* 国际化处理： 删除成功！*/
						props.editTable.deleteTableRowsByIndex(tableid, index,true);
				}}); 
			

		return;
        break;
        case 'SetBase':
        if(isBase){
            return;
        }
		let doppd = record.values.oppdimen.value;//取出操作的量纲
		let dpk_measdoc = record.values.pk_measdoc.value;//取出操作的pk值
		
		ajax({
			url:urls.setBaseUrl,
			data:{
				pk_meas: dpk_measdoc,
				oppdimen:doppd,
			},	
			success:function(res){
				let { success ,data} = res;
				if(success)
					{
                        if(data){
                            props.editTable.setTableData(tableid,res.data[tableid]);
                            }else{
                                props.editTable.setTableData(tableid,{rows:[]});
                            }
					}

			}
		});

        break;
        default:
        break;
    }
}
addRowAutoCallback(){
	let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
	let oppdi = this.props.syncTree.getSelectNode('OppdimenTree');
	this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'oppdimen', {display:oppdi.refname,value: oppdi.refpk });//设置当前选中的量纲
	this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'basecodeflag', {value: false });//设置是否基本单位默认值
	this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'bitnumber',{value:'0',display:0});//设置默认小数点为0

	

}
    /**
     * 渲染
     * @returns {*}
     */
    render(){
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const {syncTree,editTable,button,modal,search,DragWidthCom,BillHeadInfo} = this.props;
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createEditTable} = editTable;//创建表单，需要引入这个
		const { createButtonApp } = button;
        const {createButton}=button;
		const {createBillHeadInfo} = BillHeadInfo;
        let { createModal } = modal;  //模态框

        const {NCCreateSearch} = search;
        return(

            <div className="nc-bill-tree-card">
                {createModal('modal',{noFooter:false})}
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header">
					 {/*页面大图标*/}
                    {/* {createPageIcon()}	 */}
                    {/* 标题 title*/}
                    { <div className="title">
					{createBillHeadInfo({
						title : this.state.nodeTitle,
						initShowBackBtn:false
                    })}					
					</div> }
                    {/* 按钮组 btn-group*/}
                    <div className="btn-group">
					{createButtonApp({
                            area: 'list_head',
                            buttonLimit: 5,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.list_head')
					})}


                    
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-table">
                    <DragWidthCom
                         // 左树区域
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId :treeId,
                                    needEdit: true, //不启用编辑
                                    showLine: false, //显示连线
                                    needSearch: false, //是否需要搜索框
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve:this.onMouseEnterEve.bind(this),
                                    showModal:false

                                })}
                            </div>}     //左侧区域dom
                        // 右卡片区域
                        rightDom = {
                            <div className="table-area" style={{padding:0}}>
								{createEditTable(tableid, {//列表区
								
								selectedChange:this.onSelectedChange.bind(this),//使用平台的钩子函数，用来对按钮的使能状态进行设置
								onBeforeEvent:this.onBeforeEdit.bind(this),//增加一个编辑前事件，用来处理如果已设置为基本变量后更改换算系数不可用的问题：
                                    showCheck:true,			//显示复选框
									//params: 'test', 
									isAddRow: true, 	// 失去焦点是否自动增行
									adaptionHeight:true,
									addRowCallback: this.addRowAutoCallback.bind(this),	// 自动增行后的回调                                 // 自定义传参
                                    tableModelConfirm: function(){ alert(this.state.json['10140MEAS-000021']); }/* 国际化处理： 提交保存数据*/

                                })}
                            </div> }     //右侧区域dom

                        defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百
                    />
                </div>
				<PrintOutput
					ref='printOutput'
					url={urls.printUrl}
					data={{
						funcode:'10140MEAS',      //功能节点编码，即模板编码
						// nodekey:'',     //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
                >
                </PrintOutput>
				<ExcelImport
                {...Object.assign(this.props)}
                moduleName ='uapbd'//模块名
                billType = {billType} //单据类型
                selectedPKS = {[]}
                appcode={appcode}
                pagecode={pagecode}
            />
            </div>

        )
    }
}




export default Meas = createPage({
	billinfo:{
		billtype:'grid',
		pagecode:'10140MEAS_measdoc',
		bodycode:'measdoc'
	},
	

})(Meas)

/**
 * 渲染页面
 */
ReactDOM.render(<Meas />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65