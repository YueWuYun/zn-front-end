//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 自定义档案定义
 * @author	yinshb
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,promptBox,print,createPageIcon,excelImportconfig } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
let {NCDiv, NCPopconfirm,NCModal } = base;
const {PrintOutput, ExcelImport} = high;
import './index.less';

//const searchid = '10140UDDDBQ';
const tableid = 'defdoclist';
const pagecode = '10140UDDDB_page';
const appid = '0001Z010000000000O1C';
const treeid = 'publishTree';
const urls = {
	save : '/nccloud/riamm/defdoclist/save.do',
	query : '/nccloud/riamm/defdoclist/query.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do',
	print : '/nccloud/riamm/defdoclist/print.do',
	queryTree : '/nccloud/platform/appregister/menuitemregref.do',
	publish : '/nccloud/riamm/defdoclist/publish.do'
};
const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};
const keys = ['doclevel','isgrade','isrelease','mngctlmode'];  //过来空行时，忽略的字段

//对表格模板进行加工操作
function modifierMeta(props,meta) {
	//添加表格操作列
	let event = {
		label: props.MutiInit.getIntl("10140UDDDB") && props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000001'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
		itemtype: 'customer',
		visible:true,
		fixed: 'right',
		render(text, record, index) {
			let doclevel = record.values['doclevel'].value;
			let isrelease = record.values['isrelease'].value;
			return doclevel!=='0'||isrelease?'':props.button.createOprationButton(
                ['DeleteOpr'],
                {
                    area:'table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => {onTableInnerButtonClick(props, id, text, record, index);}
                }
            );
		}
	};
	meta[tableid].items.push(event);
	return meta;
}

function onTableInnerButtonClick(props, id, text, record, index){
	if(props.editTable.getStatus(tableid) === 'edit'){//编辑状态
		props.editTable.deleteTableRowsByIndex(tableid, index);
	}else{//浏览态
		let delObj = {
			rowId: index,
			status: '3',
			values: {
				ts: {
					display: props.MutiInit.getIntl("10140UDDDB") && props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000002'),/* 国际化处理： 时间戳*/
					value: record.values.ts.value
				},
				pk_defdoclist: {
					display: props.MutiInit.getIntl("10140UDDDB") && props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000003'),/* 国际化处理： 主键*/
					value: record.values.pk_defdoclist.value
				},
				name : {
					display : props.MutiInit.getIntl("10140UDDDB") && props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000004'),/* 国际化处理： 自定义档案名称*/
					value : record.values.name.value
				},
				code : {
					display : props.MutiInit.getIntl("10140UDDDB") && props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000005'),/* 国际化处理： 自定义档案编码*/
					value : record.values.code.value
				}
			}
		};
		let indexArr=[];
		indexArr.push(index);
		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: [ delObj ]
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: (res)=> {
				let { success, data } = res;
				if (success) {
					props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					allTableData = allD;
					props.editTable.setTableData(tableid,allD);
					toast({content:props.MutiInit.getIntl("10140UDDDB") && props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000006'),color:'success'});/* 国际化处理： 删除成功*/
				}
			}
		});
	}
}

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state={
			searchValue:'',
			searchDisable:false,				//简单搜索框是否禁用	true：禁用		false：可用
			showOffDisable:false,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false,				//列表是否显示停用数据
			ids : [],
			publishConfig : {
				pk_defdoclist : '',//自定义档案主键
				mngctlmode : '',//档案管控模式  0:全局  1:集团  2:集团+业务单元  3:业务单元  4:全局+集团+业务单元
				glbCode : '',//全局节点编码
				glbName : '',//全局节点名称
				grpCode : '',//集团节点编码
				grpName : '',//集团节点名称
				orgCode : '',//组织节点编码
				orgName : ''//组织节点名称
			},
			treeData : [],
			menuData:[],
            currentLangSeq:'1'
		}
		this.initTemplate(props,this.handleData);
	}

	//获取并初始化模板
	initTemplate = (props,callback) => {
	
		let count = 0;
		let result ;
	
		let handleCallBack = () => {
			if(count === 2){
				callback(result);
			}
		}
	
		let pageInfo={
				pageIndex:0,
				pageSize:'10'
			}
	
		ajax({
			url: urls['query'],
			data:{
				"pagecode": pagecode,
				"showOfff":false,
				"pageIndex":pageInfo.pageIndex,
				"pageSize":pageInfo.pageSize
			},
			success: (res) => {
				count = count + 1;
				result = res;
				handleCallBack();
			}
		});
	
		props.createUIDom({
			pagecode : pagecode
		},
		(data)=>{
			let meta = data.template;
			meta = modifierMeta(props, meta)
			if(data.context&&data.context!=null){
                this.state.currentLangSeq = data.context.currentLangSeq
			}
			props.meta.setMeta(meta,()=>{
				count = count + 1;
				handleCallBack();
			});
			data.button && props.button.setButtons(data.button,()=>{
				props.button.setButtonsVisible({
					Add: true,
					Edit: true,
					Delete: true,
					Save: false,
					Cancel: false,
					Maintain:true,
					Maintain_glb:true,
					Maintain_grp:true,
					Maintain_org:true,
					Print:true,
					Outut:true,
					Refresh:true,
					Publish:true
				});
				props.button.setDisabled({
					Add: false,
					Edit: false,
					Delete: true,
					Save: false,
					Cancel: false,
					Refresh:false,
					Maintain_glb:true,
					Maintain_grp:true,
					Maintain_org:true,
					Publish:true
				});
				props.button.setPopContent('DeleteOpr',props.MutiInit.getIntl("10140UDDDB") && props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000000'));/* 国际化处理： 确认删除？*/
	
				let excelimportconfig = excelImportconfig(props,'riamm','defdoclist',true,'',{appcode: '10140UDDDB',pagecode: pagecode},()=>{
					this.getData();
				});
				props.button.setUploadConfig("import",excelimportconfig);
				props.button.setButtons(data.button);
			});
		});
	}

	componentDidMount(){
	}
	componentWillUpdate() {
        if(this.props.editTable.getStatus(tableid) === 'edit'){
            window.onbeforeunload = () =>{
                return this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000007')/* 国际化处理： 页面还没有保存，确定离开页面？*/
            }
        }else{
			window.onbeforeunload = null;
		}
	}
	
	handleData = (res) => {
		if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
			this.props.dealFormulamsg(
				res.formulamsg,  //参数一：返回的公式对象
				{                //参数二：界面使用的表格类型
					"defdoclist":"editTable"
				}
			);
		}

		let { success, data } = res;
		if (success) {
			Utils.handleTableReData({
				data : data,
				tableid : tableid,
				props : this.props,
				empty : (data) => {	//数据为空时执行回调方法
				},
				notEmpty : (data)=>{	//数据不为空时执行回调方法
					data[tableid].rows.forEach(function(item, index, array){
						if (item.values['doclevel'].value === '1') {
							item.values['code'].disabled = 'on';
							item.values['name'].disabled = 'on';
							item.values['mngctlmode'].disabled = 'on';
							item.values['isgrade'].disabled = 'on';
							if(!item.values['coderule']){item.values['coderule']={value:null,display:null}}
							if(!item.values['codectlgrade']){item.values['codectlgrade']={value:null,display:null}}
							item.values['coderule'].disabled = 'on';
							item.values['codectlgrade'].disabled = 'on';
						}else{
							if(!item.values['isgrade'].value){
								if(!item.values['coderule']){item.values['coderule']={value:null,display:null}}
								if(!item.values['codectlgrade']){item.values['codectlgrade']={value:null,display:null}}
								item.values['coderule'].disabled = 'on';
								item.values['codectlgrade'].disabled = 'on';
							}else{
								if(!(item.values['coderule'] && item.values['coderule'].value && (item.values['mngctlmode'].value === '2' || item.values['mngctlmode'] === 4))){
									if(!item.values['codectlgrade']){item.values['codectlgrade']={value:null,display:null}}
									item.values['codectlgrade'].disabled = 'on';
								}
							}
						}
					});
					this.props.editTable.setTableData(tableid,data[tableid]);
					setTimeout(() => {
						this.props.editTable.setStatus(tableid,'browse');
					}, 0);
				},
				after : (data)=> {	//数据处理完成后执行回调方法
					allTableData = data[tableid];
					this.props.editTable.setStatus(tableid,'browse');
				}
			});
		}
	}

	//请求列表数据
	getData = () => {
		let showOff = this.state.isShowOff;
		let pageInfo = this.props.editTable.getTablePageInfo(tableid);
		if(!pageInfo){
			pageInfo={
				pageIndex:0,
				pageSize:'10'
			}
		}
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:{
				"pagecode": pagecode,
				"showOfff":showOff,
				"pageIndex":pageInfo.pageIndex,
				"pageSize":pageInfo.pageSize
			},
			success: (res) => {
				this.handleData(res);
			}
		});
	};

	/**
	 * 自动增行后回调
	 */
	addRowCallback = () => {
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'doclevel', {value: '0', display:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000010')});//设置档案属性默认值/* 国际化处理： 用户档案*/
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'isgrade', {value: false });//设置分级默认值
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'isrelease', {value: false });
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'mngctlmode', {value: '1', display:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000011') });/* 国际化处理： 集团*/
		this.props.editTable.setEditableRowKeyByIndex(tableid,num-1,['coderule','codectlgrade'],false);
	}

	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		if(key === 'coderule'){
			var reg = new RegExp('^(([1-9]+\d*\/){1,9}[1-9]+\d*)$');
            if(!reg.test(value[0].newvalue.value)){
                toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000008'),color:'warning'});/* 国际化处理： 档案编码级次格式错误，例如‘2/2/2’，且编码级次不能大于10*/
                props.editTable.setValByKeyAndRowId(tableid, value[0].rowid, 'coderule', {value: '',display:''});
            }else{
				let i = value[0].newvalue.value.split('/');
				let sum = 0;
				i.forEach(item=>{sum += Number(item)});
				if(sum >40){
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000009'),color:'warning'});/* 国际化处理： 编码级次的各级总长度不能大于40*/
                	props.editTable.setValByKeyAndRowId(tableid, value[0].rowid, 'coderule', {value: '',display:''});
				}
			}
		}
		if(key === 'isgrade' && data.values['doclevel'].value === '0'){
			if(value[0].newvalue.value){
				props.editTable.setEditableByKey(tableid,value[0].rowid,'coderule',true);
			}else{
				props.editTable.setValByKeyAndRowId(tableid,value[0].rowid,'coderule',{value:null});
				props.editTable.setValByKeyAndRowId(tableid,value[0].rowid,'codectlgrade',{value:null});
				props.editTable.setEditableByKey(tableid,value[0].rowid,'coderule',false);
				props.editTable.setEditableByKey(tableid,value[0].rowid,'codectlgrade',false);
			}
		}
		if(key === 'coderule'){
			let mngctlmode = data.values['mngctlmode'].value;
			if(mngctlmode === '2' || mngctlmode === '4'){
				if(!value[0] || !value[0].newvalue || !value[0].newvalue.value || value[0].newvalue.value === ''){
					props.editTable.setEditableByKey(tableid,value[0].rowid,'codectlgrade',false);
				}else{
					props.editTable.setEditableByKey(tableid,value[0].rowid,'codectlgrade',true);
				}
			}
		}

		if(key === 'mngctlmode'){
			if(value[0].newvalue.value === '2' || value[0].newvalue.value === '4'){
				if(data.values['isgrade'].value && (data.values['coderule'] && data.values['coderule'].value)){
					props.editTable.setEditableByKey(tableid,value[0].rowid,'codectlgrade',true);
				}
			}else{
				props.editTable.setValByKeyAndRowId(tableid,value[0].rowid,'codectlgrade',{value:null});
				props.editTable.setEditableByKey(tableid,value[0].rowid,'codectlgrade',false);
			}
		}

		//自动增行
		/* setTimeout(() => {
			let length = this.props.editTable.getNumberOfRows(moduleId);
			if(((length-2)===index)&&data.status==='2'){
				this.props.editTable.filterEmptyRows(tableid,keys);
				this.addTableRow(false);
			}
		}, 2); */
	}

	//更新按钮状态
	updateButtonStatus(){
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		let isSys = false;
		for(let i = 0;i<length;i++){
			if(tableData[i].data.values['doclevel'] && tableData[i].data.values['doclevel'].value === '1'){
				isSys = true;
				break;
			}
		}
		if(length === 0){//未选择数据
			this.props.button.setDisabled({
				Delete: true,
				Maintain_glb:true,
				Maintain_grp:true,
				Maintain_org:true,
				Publish:true
			});
		}else if(length === 1){//选择一行数据
			let mngctlmode = tableData[0].data.values['mngctlmode'].value;
			let glb = true,grp=true,org=true;
			if(mngctlmode==='0'){//全局
				glb = false;
			}else if(mngctlmode === '1'){//集团
				grp = false;
			}else if(mngctlmode === '2'){//集团+业务单元
				grp = false;
				org = false;
			}else if(mngctlmode === '3'){//业务单元
				org = false;
			}else if(mngctlmode === '4'){//全局+集团+业务单元
				glb = false;
				grp = false;
				org = false;
			}
			this.props.button.setDisabled({
				Delete: isSys,
				Maintain_glb : glb,
				Maintain_grp : grp,
				Maintain_org : org,
				Publish : false
			});
		}else {//选择多行数据
			this.props.button.setDisabled({
				Delete: isSys,
				Maintain_glb:true,
				Maintain_grp:true,
				Maintain_org:true,
				Publish:true
			});
		}
		if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			this.props.button.setPopContent('DeleteOpr','');
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: false,
				Save: true,
				Cancel: true,
				Delete: true,
				Maintain:false,
				Maintain_glb:false,
				Maintain_grp:false,
				Maintain_org:false,
				Print:false,
				Outut:false,
				Refresh:false,
				Publish:false,
				import: false,
				export: false
			});
			this.props.button.setMainButton({
				'Add' : false
			});
			this.setState({
				searchDisable:true,
				showOffDisable:true
			});
		}else{//浏览态
			this.props.button.setPopContent('DeleteOpr',this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000000'));/* 国际化处理： 确认删除？*/
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Save: false,
				Cancel: false,
				Maintain:true,
				Maintain_glb:true,
				Maintain_grp:true,
				Maintain_org:true,
				Print:true,
				Outut:true,
				Refresh:true,
				Publish:true,
				import: true,
				export: true
			});
			if(this.props.editTable.getNumberOfRows(tableid)>0){
				this.props.button.setDisabled({
					Print: false,
					Output : false,
				});
			}else{
				this.props.button.setDisabled({
					Print: true,
					Output : true,
				});
			}

			this.props.button.setMainButton({
				'Add' : true
			});
			this.setState({
				searchDisable:false,
				showOffDisable:false
			});
		} 
	}

	//显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
		});
		setTimeout(() => {
			this.getData();
		}, 10);
		
	}

	addTableRow(isFocus){
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.addRow(tableid,num,isFocus);
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'doclevel', {value: '0', display:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000010')});//设置档案属性默认值/* 国际化处理： 用户档案*/
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'isgrade', {value: false });//设置分级默认值
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'isrelease', {value: false });
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'mngctlmode', {value: '1', display:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000011') });/* 国际化处理： 集团*/
		this.props.editTable.setEditableRowKeyByIndex(tableid,num,['coderule','codectlgrade'],false);
	}

	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'Add':
				this.addTableRow(true);
				break;
			case 'Edit':
				this.props.editTable.setStatus(tableid, 'edit');
				//this.props.editTable.hideColByKey(tableid,'opr');//隐藏操作列
				break;
			case 'Cancel':
				promptBox({
					color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000012'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000013'),             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000014'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000015'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
					}
				});
				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid,keys);
					let allTableRows = this.props.editTable.getAllRows(tableid,true);
					if(!this.props.editTable.checkRequired(tableid,allTableRows)){
						return;
					}
					let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					if(!tableData || tableData.length === 0) {
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
						toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000016'),color:'success'});/* 国际化处理： 保存成功*/
						return;
					}
					let data = {
						pageid:pagecode,
						model : {
							areaType: "table",
							areacode:tableid,
							pageinfo: null,
							rows: []
						}
					};
					data.model.rows = tableData;
					let saveFunction = () => {
						ajax({
							url: urls['save'],
							data,
							success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000016'),color:'success'});/* 国际化处理： 保存成功*/
									this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
									Utils.handleTableReData({
										tableid : tableid,
										props : this.props,
										data : data,
										notEmpty : (data) => {
											let allD = this.props.editTable.getAllData(tableid);
											Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
											Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
											allD.rows.forEach(function(item, index, array){
												if (item.values['doclevel'].value === '1') {
													item.values['code'].disabled = 'on';
													item.values['name'].disabled = 'on';
													item.values['mngctlmode'].disabled = 'on';
													item.values['isgrade'].disabled = 'on';
													if(!item.values['coderule']){item.values['coderule']={value:null,display:null}}
													if(!item.values['codectlgrade']){item.values['codectlgrade']={value:null,display:null}}
													item.values['coderule'].disabled = 'on';
													item.values['codectlgrade'].disabled = 'on';
												}else{
													if(!item.values['isgrade'].value){
														if(!item.values['coderule']){item.values['coderule']={value:null,display:null}}
													if(!item.values['codectlgrade']){item.values['codectlgrade']={value:null,display:null}}
														item.values['coderule'].disabled = 'on';
														item.values['codectlgrade'].disabled = 'on';
													}else{
														if(!(item.values['coderule'] && item.values['coderule'].value && (item.values['mngctlmode'].value === '2' || item.values['mngctlmode'] === 4))){
															if(!item.values['codectlgrade']){item.values['codectlgrade']={value:null,display:null}}
															item.values['codectlgrade'].disabled = 'on';
														}
													}
												}
											});
											allTableData = allD;
											this.props.editTable.setTableData(tableid,allD);
										}
									});
								}
							}.bind(this)
						});
					}
					this.props.validateToSave(data,saveFunction,{'defdoclist':'table'},'grid');
				}, 0);
				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000017'),color:'warning'});/* 国际化处理： 请选择要删除的数据*/
					return 
				}
				if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
					let indexArr=[];
					selectedData.forEach((val) => {
						indexArr.push(val.index);
					});
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
				}else{
					promptBox({
						color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000018'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
						content: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000019'),             // 提示内容,非必输/* 国际化处理： 您确认删除所选数据？*/
						noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
						noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
						beSureBtnName: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000014'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
						cancelBtnName: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000015'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
						beSureBtnClick:  this.onDelForBrowse
					});
				}
				break;
			case 'Print':
				let printData = this.props.editTable.getAllRows(tableid);
				if(printData.length === 0){
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000020'),color:'warning'});/* 国际化处理： 无可打印数据*/
					return;
				}
				let printIds = [];
				printData.forEach(item => {printIds.push(item.values['pk_defdoclist'].value)});
				print('pdf',
				urls['print'],
				{
					funcode : '10140UDDDB',//'13050UDDDB',
					appcode:'10140UDDDB',
					nodekey : 'defdoclist_ncc',
					oids : printIds
				});
				break;
			case 'Output':
				let outputData = this.props.editTable.getAllRows(tableid);
				if(outputData.length === 0){
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000021'),color:'warning'});/* 国际化处理： 无可输出的数据*/
					return;
				}
				let outputIds = [];
				outputData.forEach(item => {outputIds.push(item.values['pk_defdoclist'].value)});
				this.setState({
					ids : outputIds
				},this.refs.printOutput.open());
				break;
			case "Refresh":
				this.setState({ searchValue:'' });
				this.getData();
				break;
			case 'Maintain_glb':
				this.OpenMaintain('glb');
				break;
			case 'Maintain_grp':
				this.OpenMaintain('grp');
				break;
			case 'Maintain_org':
				this.OpenMaintain('org');
				break;
			case 'Publish':
				let publishRow = this.props.editTable.getCheckedRows(tableid);
				if(publishRow.length !== 1) return;
				this.setState({
					publishConfig : {
						pagecode : pagecode,
						pk_defdoclist : publishRow[0].data.values.pk_defdoclist.value,//自定义档案主键
						mngctlmode : publishRow[0].data.values.mngctlmode.value,//档案管控模式  0:全局  1:集团  2:集团+业务单元  3:业务单元  4:全局+集团+业务单元
						glbCode : '',//全局节点编码
						glbName : '',//全局节点名称
						grpCode : '',//集团节点编码
						grpName : '',//集团节点名称
						orgCode : '',//组织节点编码
						orgName : ''//组织节点名称
					}
				},this.props.modal.show('publish'));
				ajax({
					url : urls['queryTree'],
					success : (res) => {
						let treeData = this.creatTreeData(res.data.rows);
						this.setState({treeData:treeData});
						this.props.syncTree.setSyncTreeData(treeid , treeData);
					}
				});
				break;
			case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
				break;
			default:
                break;
		}
	
	}

	OpenMaintain(key){
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		if(length !== 1){
			return;
		}
		let pk = tableData[0].data.values['pk_defdoclist'].value;
		let code = tableData[0].data.values['code'].value;
        let Langname = this.state.currentLangSeq =='1'?'name':'name'+this.state.currentLangSeq
		let name = tableData[0].data.values[Langname].value;
		let isgrade = tableData[0].data.values['isgrade'].value;
        let coderule = tableData[0].data.values['coderule']?tableData[0].data.values['coderule'].value:null;

        switch(key){
			case 'glb':
				this.props.openTo('/uapbd/userdef/defdoc_glb/main/index.html',{
					pk : pk,
					code : code,
					name : name,
					coderule : coderule,
					isgrade : isgrade?'Y':'N',
					from : 'defdoclist',
					appcode : '10140UDDB',
					pagecode : '10140UDDB_glb'
				});
				break;
			case 'grp':
				this.props.openTo('/uapbd/userdef/defdoc_grp/main/index.html',{
					pk : pk,
					code : code,
					name : name,
					coderule : coderule,
					isgrade : isgrade?'Y':'N',
					from : 'defdoclist',
					appcode : '10140UDDG',
					pagecode : '10140UDDG_grp'
				});
				break;
			case 'org':
				this.props.openTo('/uapbd/userdef/defdoc_org/main/index.html',{
					pk : pk,
					code : code,
					name : name,
					coderule : coderule,
					isgrade : isgrade?'Y':'N',
					from : 'defdoclist',
					appcode : '10140UDDO',
					pagecode : '10140UDDO_org'
				});
				break;
		}
	}

	//表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData =   Utils.clone(allTableData);
		if(value.trim()===''){
			
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['code'].value.indexOf(value)>-1 || row.values['name'].value.indexOf(value)>-1){
					rows.push(row);
				}
			}
			allData.rows = rows;
		}
		this.props.editTable.setTableData(tableid,allData);
	}

	//浏览态确认删除事件
	onDelForBrowse=()=>{
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000002'),/* 国际化处理： 时间戳*/
					},
					pk_defdoclist: {
						display: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000003'),/* 国际化处理： 主键*/
					},
					name : {
						display :this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000004')/* 国际化处理： 自定义档案名称*/
					},
					code : {
						display : this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000005')/* 国际化处理： 自定义档案编码*/
					}
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values.ts.value=val.data.values.ts.value;
			delObj.values.pk_defdoclist.value=val.data.values.pk_defdoclist.value;
			delObj.values.name.value=val.data.values.name.value;
			delObj.values.code.value=val.data.values.code.value;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					allTableData = allD;
					this.props.editTable.setTableData(tableid,allD);
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000006'),color:'success'});/* 国际化处理： 删除成功*/
				}
			}
		});
	}

	/**
	 * 组织发布自定义档案节点面板内容
	 */
	getPublishContent = () => {
		const {NCFormControl,NCCol,NCRow}=base;
		return (
			<div className="copyapp-content">
				<div className="copyapp-menutree">
					{this.props.syncTree.createSyncTree({
                        treeId :treeid,
                        needEdit: false, //不启用编辑
                        showLine: false, //显示连线
                        needSearch: false, //是否需要搜索框
                        onSelectEve: this.onSelectTree,//选择
                        showModal:false
                    })}
                </div>
				<div className="copyapp-form">
					<NCRow>
						{(this.state.publishConfig.mngctlmode === '0' || this.state.publishConfig.mngctlmode === '4') ?
						<NCCol lg = '6'>
							<span>{this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000036')/* 国际化处理： 全局节点编码*/}：</span>
							<NCFormControl
								type="text"
								value={this.state.publishConfig.glbCode}
								onChange={(value)=>{this.state.publishConfig.glbCode=value;this.setState(this.state)}}
								size="sm"
							/>
						</NCCol>:''}
						{(this.state.publishConfig.mngctlmode === '0' || this.state.publishConfig.mngctlmode === '4') ?
						<NCCol lg = '6'>
							<span>{this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000037')/* 国际化处理： 全局节点名称*/}：</span>
							<NCFormControl
								type="text"
								value={this.state.publishConfig.glbName}
								onChange={(value)=>{this.state.publishConfig.glbName=value;this.setState(this.state)}}
								size="sm"
							/>
						</NCCol>:''}
						{(this.state.publishConfig.mngctlmode === '1' || this.state.publishConfig.mngctlmode === '2' || this.state.publishConfig.mngctlmode === '4') ?
						<NCCol lg = '6'>
							<span>{this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000038')/* 国际化处理： 集团节点编码*/}：</span>
							<NCFormControl
								type="text"
								value={this.state.publishConfig.grpCode}
								onChange={(value)=>{this.state.publishConfig.grpCode=value;this.setState(this.state)}}
								size="sm"
							/>
						</NCCol>:''}
						{(this.state.publishConfig.mngctlmode === '1' || this.state.publishConfig.mngctlmode === '2' || this.state.publishConfig.mngctlmode === '4') ?
						<NCCol lg = '6'>
							<span>{this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000039')/* 国际化处理： 集团节点名称*/}：</span>
							<NCFormControl
								type="text"
								value={this.state.publishConfig.grpName}
								onChange={(value)=>{this.state.publishConfig.grpName=value;this.setState(this.state)}}
								size="sm"
							/>
						</NCCol>:''}
						{(this.state.publishConfig.mngctlmode === '2' || this.state.publishConfig.mngctlmode === '3' || this.state.publishConfig.mngctlmode === '4') ?
						<NCCol lg = '6'>
							<span>{this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000040')/* 国际化处理： 业务单元节点编码*/}：</span>
							<NCFormControl
								type="text"
								value={this.state.publishConfig.orgCode}
								onChange={(value)=>{this.state.publishConfig.orgCode=value;this.setState(this.state)}}
								size="sm"
							/>
						</NCCol>:''}
						{(this.state.publishConfig.mngctlmode === '2' || this.state.publishConfig.mngctlmode === '3' || this.state.publishConfig.mngctlmode === '4') ?
						<NCCol lg = '6'>
							<span>{this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000041')/* 国际化处理： 业务单元节点名称*/}：</span>
							<NCFormControl
								type="text"
								value={this.state.publishConfig.orgName}
								onChange={(value)=>{this.state.publishConfig.orgName=value;this.setState(this.state)}}
								size="sm"
							/>
						</NCCol>:''}
					</NCRow>
				</div>
			</div>
		);
	}

	/**
	 * 树节点选中事件
	 */
	onSelectTree = (refpk,node)  => {
		console.log('node',node);
		if(node.refcode.length > 6){
			promptBox({
				color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000022'),/* 国际化处理： 提示*/
				content: `${this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000042',{nodeName:node.refcode,nodePid:node.pid})}`,
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000014'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000015'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick:  () => {
					this.props.syncTree.setNodeSelected(node.pid);
					let parentNode = [];
					this.findTreeNode(parentNode,node.pid);
					if(parentNode.length>0){
						this.props.syncTree.setNodeSelected(treeid,parentNode[0].refpk);
						this.onSelectTree('',parentNode[0]);
					}
				},
				cancelBtnClick:() => {this.props.syncTree.cancelSelectedNode(treeid);},
				closeBtnClick:() => {this.props.syncTree.cancelSelectedNode(treeid);}
			});
			return;
		}
		if(node.refcode.length !== 6){
			this.props.syncTree.cancelSelectedNode(treeid);
			return;
		}
		let selectRow = this.props.editTable.getCheckedRows(tableid);
		if(!selectRow || selectRow.length !== 1){
			return;
		}
		let name = selectRow[0].data.values.name.value;
		let grpcode = '',glbcode='',orgcode='',grpname='',glbname='',orgname='';
		switch(this.state.publishConfig.mngctlmode){
			case '0':
				glbcode = node.refcode + '01';
				glbname = this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000023',{name:name});/* 国际化处理： -全局*/
				break;
			case '1':
				grpcode = node.refcode+ '02';
				grpname = this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000024',{name:name});/* 国际化处理： -集团*/
				break;
			case '2':
				grpcode = node.refcode+ '02';
				orgcode = node.refcode+ '03';
				grpname = this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000024',{name:name});/* 国际化处理： -集团*/
				orgname = this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000025',{name:name});/* 国际化处理： -业务单元*/
				break;
			case '3':
				orgcode = node.refcode+ '02';
				orgname = this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000025',{name:name});/* 国际化处理： -业务单元*/
				break;
			case '4':
				glbcode = node.refcode+ '01';
				grpcode = node.refcode+ '02';
				orgcode = node.refcode+ '03';
				glbname = this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000023',{name:name});/* 国际化处理： -全局*/
				grpname = this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000024',{name:name});/* 国际化处理： -集团*/
				orgname = this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000025',{name:name});/* 国际化处理： -业务单元*/
				break;
		}
		this.state.publishConfig.glbCode = glbcode;
		this.state.publishConfig.grpCode = grpcode;
		this.state.publishConfig.orgCode = orgcode;
		this.state.publishConfig.glbName = glbname;
		this.state.publishConfig.grpName = grpname;
		this.state.publishConfig.orgName = orgname;
		this.setState(this.state);
	}

	findTreeNode = (treenode,code,treeData) => {
		if(!treeData){
			treeData = this.props.syncTree.getSyncTreeValue(treeid);
		}
		for(let i=0;i<treeData.length;i++){
			let node = treeData[i];
			if(node.refcode === code){
				treenode.push(node);
			}else if(!node.isleaf){
				this.findTreeNode(treenode,code,node.children);
			}
		}
	}


	/**
	 * 发布自定义档案节点
	 */
	publish = () => {
		//TODO  验证
		let validate = this.validate();
		if(!validate) return;
		ajax({
			url : urls['publish'],
			data : this.state.publishConfig,
			success : (res) => {
				//提示发布成功
				toast({title:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000048')/* 国际化处理： 发布成功！*/,color:'success'})
			}
		});
	}
	publishClick = () => {
		promptBox({
			color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000034'),		//标题/* 国际化处理： 询问信息*/
			content: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000035'),	//内容/* 国际化处理： 发布节点以后不能取消发布，确认发布节点吗？*/
			noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
			noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
			beSureBtnName: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000014'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
			cancelBtnName: this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000015'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
			beSureBtnClick:  this.publish
		});
	}

	validate = () => {
		switch(this.state.publishConfig.mngctlmode){
			case '0'://全局
				if(this.state.publishConfig.glbName.trim() === ''){
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000026'),color:'warning'});/* 国际化处理： 新菜单名称必填*/
					return false;
				}
				return this.validateCode(this.state.publishConfig.glbCode);
				break;
			case '1'://集团
				if(this.state.publishConfig.grpName.trim() === ''){
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000026'),color:'warning'});/* 国际化处理： 新菜单名称必填*/
					return false;
				}
				return this.validateCode(this.state.publishConfig.grpCode);
				break;
			case '2'://集团+业务单元
				if(this.state.publishConfig.grpName.trim() === '' || this.state.publishConfig.orgName.trim() === ''){
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000026'),color:'warning'});/* 国际化处理： 新菜单名称必填*/
					return false;
				}
				return this.validateCode(this.state.publishConfig.grpCode)&&this.validateCode(this.state.publishConfig.orgCode);
				break;
			case '3'://业务单元
				if(this.state.publishConfig.orgName.trim() === ''){
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000026'),color:'warning'});/* 国际化处理： 新菜单名称必填*/
					return false;
				}
				return this.validateCode(this.state.publishConfig.orgCode);
				break;
			case '4'://全局+集团+业务单元
				if(this.state.publishConfig.glbName.trim() === '' || this.state.publishConfig.grpName.trim() === '' || this.state.publishConfig.orgName.trim() === ''){
					toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000026'),color:'warning'});/* 国际化处理： 新菜单名称必填*/
					return false;
				}
				return this.validateCode(this.state.publishConfig.glbCode)&&this.validateCode(this.state.publishConfig.grpCode)&&this.validateCode(this.state.publishConfig.orgCode);
				break;
		}
		return true;
	}

	/**
	 * 验证菜单编码是否符合规范
	 */
	validateCode = (value) => {
		if(value.length<8){
			toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000027'),color:'warning'});/* 国际化处理： 新菜单编码长度最少为8*/
			return false;
		}
		let target = this.state.menuData.find(item=>{
			return (
				item.refcode.length === 6 &&
				item.refcode === value.slice(0, 6)
			);
		});
		if (target) {
			let targetRepeat = this.state.treeData.find(
				item => {
					return (
						item.refcode.length > 6 &&
						item.refcode === value
					);
				}
			);
			if (targetRepeat) {
				toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000028'),color:'warning'});/* 国际化处理： 请规范填写新菜单编码*/
				return false;
			} else {
				return true;
			}
		} else {
			toast({content:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000028'),color:'warning'});/* 国际化处理： 请规范填写新菜单编码*/
				return false;
		}
	}

	/**
	 * 创建生成树结构数据
	 */
	creatTreeData=(data)=>{
		data.forEach((item,index)=>{
			data[index].refname =  `${item.refcode} ${item.refname}`;
			if(item.pid){
				data.forEach((node,index1)=>{
					if(item.pid === node.refcode){
						if(node.children){
							data[index1].children.push(data[index]);
						}else{
							data[index1].children = [data[index]];
						}
					}
				})
			}
		});
		let treeData = [];
		data.forEach((item,index)=>{
			if(!item.pid){
				item.pid = '~';
				treeData.push(item);
			}
		});
		this.setState({menuData:data});
		return treeData;
	}

	handlePageInfoChange=(props,config)=>{
		this.getData();
	}

	render() {
		let { table, button, search,editTable,modal,BillHeadInfo } = this.props;
		const {createBillHeadInfo} = BillHeadInfo;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let {NCFormControl,NCCheckbox} = base;
		let {createModal} = modal;

		return (
			<div className="nc-single-table">
				<NCDiv  areaCode={NCDiv.config.HEADER}  className="nc-singleTable-header-area">
				{/* 标题 title */}
				<div className="header-title-search-area">
					{/*{createPageIcon()}*/}
					{/*<h2 className="title-search-detail">*/}
					{/*this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000046')/* 国际化处理： 自定义档案定义*/ }
					{/*</h2>*/}
					{createBillHeadInfo({
                                        title:this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000046'),
                                        initShowBackBtn:false
                                    })}
					{/* 简单查询 */}
					<div className="title-search-detail">
						<NCFormControl
							placeholder={this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000029')}/* 国际化处理： 请输入编码或名称筛选*/
							value={this.state.searchValue}
							onChange={this.onSearch.bind(this)}
							type="search"
							disabled={this.state.searchDisable}
						/>
					</div>
					{/* 显示停用数据 */}
					{isShowOffEnable?(
						<div className="title-search-detail">
							<span className="showOff">
								<NCCheckbox
									checked={this.state.isShowOff}
									onChange={this.showOffChange.bind(this)}
									disabled={this.state.showOffDisable}
								>{this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000047')/* 国际化处理： 显示停用*/}</NCCheckbox>
							</span>
						</div>
					):('')}
					</div>
					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list-actions',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
					</NCDiv>
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
						{createEditTable(tableid, {//列表区
							onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
							useFixedHeader:true,    
							selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
							statusChange: function(){
								setTimeout(() => {
									this.updateButtonStatus();
								}, 0)
							}.bind(this),				//表格状态监听
							showIndex:true,				//显示序号
							showCheck:true,			//显示复选框
							showPagination:true,
							isAddRow:true,
							addRowCallback:this.addRowCallback,
							handlePageInfoChange:this.handlePageInfoChange,
							adaptionHeight:true
						})}
				</div>

				{createModal('publish',{
					title : this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000033'),										//标题/* 国际化处理： 发布自定义档案节点*/
					content : this.getPublishContent(),							//内容
					beSureBtnClick : this.publishClick,		//确定按钮事件回调
					leftBtnName : this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000014'),   								//左侧按钮名称/* 国际化处理： 确定*/
    				rightBtnName : this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000015')   								//右侧按钮名称/* 国际化处理： 取消*/
				})}
				{createModal('tip',{
					title : '',										//标题
					content : "",						//内容
					beSureBtnClick : ()=>{},		//确定按钮事件回调
					leftBtnName : this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000014'),   								//左侧按钮名称/* 国际化处理： 确定*/
    				rightBtnName : this.props.MutiInit.getIntl("10140UDDDB") && this.props.MutiInit.getIntl("10140UDDDB").get('10140UDDDB-000015')   								//右侧按钮名称/* 国际化处理： 取消*/
				})}
				<PrintOutput
					ref='printOutput'
					url={urls['print']}
					data={{
						funcode : '10140UDDDB',//'10140UDDDB',
						appcode:'10140UDDDB',
						nodekey : 'defdoclist_ncc',
						oids : this.state.ids,
						outputType : 'output'
					}}
				/>
				<ExcelImport
					{...this.props}
					moduleName ='riamm'//模块名
					billType = 'defdoclist'//单据类型
					selectedPKS = {[]}
					appcode = '10140UDDDB'
					pagecode = {pagecode}
				/>
			</div>
		);
	}
}

SingleTable = createPage({
	billinfo:{
        billtype: 'grid',
        pagecode: '10140UDDDB',
        bodycode: 'defdoclist'
    },
	initTemplate: ()=>{},
	mutiLangCode: '10140UDDDB'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65