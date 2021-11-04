//ldZJBr9DFLxxEiCCfFC9ZRf4Mw1DKgToIIpQwexY9rRNycEjrQFgoXMlpZRNjlvg
/**
 * 税率
 * @author	zouj
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,promptBox,getMultiLang,createPageIcon } from 'nc-lightapp-front';
import  Utils, {DateUtils} from '../../../public/utils';
let { NCPopconfirm,NCModal } = base;
const { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu, NCButton: Button } = base;
import './index.less';
let {BDselect} = Utils;
let mdClassId = 'ecefe1fe-928c-4d04-a93d-2972523f69ee';//元数据id管控模式使用

//mazheng 导入税务组织
// import Org from  '../../../../uapbd/refer/org/TaxOrgDefaultTreeRef'  
import Org from '../../../../uapbd/refer/org/TaxOrgTreeRef' 

//const searchid = '200X0089';
const tableid = 'pk_taxrate';
const pagecode = '10140TAXRB_20160009';
const urls = {
	add : '/nccloud/uapbd/taxrate/taxrateadd.do',
	save : '/nccloud/uapbd/taxrate/taxratesave.do',
	query : '/nccloud/uapbd/taxrate/taxratequery.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};
const isShowOffEnable = true;			//是否启用“显示停用”功能
const maxdateconst = '2999-12-31 23:59:59';
let allTableData = {};
let keys = ['pk_org','pk_group','pk_taxkind']; //过来空行时，忽略的字段

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		// this.props.button.setButtonsVisible({
		// 	Add: false,
		// 	Edit: false,
		// 	Save: false,
		// 	Cancel: false,
		// 	Delete: false,
		// 	Print: false,
		// 	Refresh: false
		// });
		this.state={
			searchValue:'',
			searchDisable:true,				//简单搜索框是否禁用	true：禁用		false：可用
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isOrgAble: false,
			isShowOff:false,				//列表是否显示停用数据
			curOrg: ''	,				    //mz: 当前选中组织
			json:{}
		};
		this.checklist = [];
		//mazheng 导入的参数,如果为空 默认为全局
		this.config = props.config || { title: this.state.json['10140TAXRB-000005'], pkorg: 'GLOBLE00000000000000',  nodetype: 'glb' };/* 国际化处理： 全局*/
		props.config.initTemplate.call(this, props,this.getData);
	}

   //mazheng添加组织选中事件
	onOrgChange(val){			
		this.state.curOrg = val; 
		this.setState(this.state.curOrg);
		setTimeout(() => { this.getData(); });
		
        this.updateButtonStatus();
	}

	componentDidMount() {
		//setTimeout(() => { this.getData(); });
	}
	componentWillMount() {
    	let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
       		this.setState({json})       // 保存json和inlt到页面state中并刷新页面
		}
    	getMultiLang({moduleId: '10140TAXRB',domainName: 'uapbd',callback})
    }
	componentDidUpdate(){
		let tableStatus = this.props.editTable.getStatus(tableid);
		if(tableStatus != 'add' && tableStatus != 'edit'){
			window.onbeforeunload = null;
		}else{
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}
	//请求列表数据
	//mazheng 此处需要重构代码，获取查询参数必须放到内部。
	getData = () => {
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理

		// 处理管控模式
		var bdselect =  new BDselect([mdClassId]);
		bdselect.getModeByClassid(mdClassId,(mode) => {
            var managemode = mode[0].managemode;
            var nodetype = this.config.nodetype;
            if (managemode == BDselect.SCOPE_GLOBE && nodetype ==='org'){
				toast({color: 'warning',content : this.state.json['10140TAXRB-000006']});/* 国际化处理： 可见范围为全局无组织节点*/
				setTimeout(() => {
					
					this.props.button.setButtonsVisible({
						Add: false,
						Edit: false,
						Delete: false,
						Save:false,
						Cancel:false,
						Refresh:false,
						Print:false,
						Output:false
					});
				}, 0);
                return;
            } 
                
			//mazheng 重构代码, 设置查询参数
			var param = {
				pagecode: pagecode,
				// showOff: this.state.isShowOff,
				pk_org: this.config.nodetype === 'org' ? this.state.curOrg.refpk : this.config.pkorg,
				nodetype: this.config.nodetype
			};

			ajax({
				url: urls['query'],
				data: param,
				success: (res) => {
					let { success, data} = res;
					if (success) { //此处要处理返回值长度为0的情况
						Utils.handleTableReData({
							data : data,
							tableid : tableid,
							props : this.props,
							empty : (data) => {	//数据为空时执行回调方法
								this.props.editTable.setTableData(tableid, {rows: []});
								this.checklist = [];
							},
							notEmpty : (data)=>{	//数据不为空时执行回调方法
								//适配显示公式
								Utils.showFormular(this.props,res,{tableid:"editTable"});
								var checklist = [];
								data[tableid].rows.forEach((item, index, array)=>{

									//组织级页面，全局的税种也不能修改
									if (this.config.nodetype === 'org' && item.values['pk_org'].value==='GLOBLE00000000000000' ) { 
										checklist.push(index);
									}
								});
								this.checklist = checklist;

								//是否启用转换成开关
								// Utils.convertGridEnablestate(data[tableid].rows); 
								allTableData = data[tableid];
								this.props.editTable.setTableData(tableid, data[tableid]);
								
								// 不能删除的行，CheckBox不能选择
								checklist.forEach((item, index) => {
									this.props.editTable.setCheckboxDisabled(tableid,item,false);
								});
								// 不能删除的行，行不能编辑
								this.props.editTable.setEditableRowByIndex(tableid,this.checklist, false);
							},
							after : (data)=> {	//数据处理完成后执行回调方法
								allTableData = data[tableid];
							}
						});
					}
				}
			});
        });

	};

	//点击查询按钮  单表页面去除查询区
	/* onSearchBtnClick(props) {
		let searchVal = this.props.search.getAllSearchData(searchid);
		let metaData = this.props.meta.getMeta();
		let data={
			"conditions":searchVal,
			//editTable不提供分页
			"pagecode": pagecode,
			"queryAreaCode":searchid,  //查询区编码
			"oid":"0001Z010000000004GIF",  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			"queryType":"simple"
		 }
	
		ajax({
			url: '/nccloud/riamm/defdoclist/query.do',
			data: data,
			success:  (res)=> {
				let { success, data } = res;
				if (success) {
					this.props.editTable.setTableData(tableid, data[tableid]);
				}
			}
		}); 
	} */

	//表格编辑后事件
	onAfterEvent(props, tableid , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//自动增行
		// setTimeout(() => {
		// 	let length = this.props.editTable.getNumberOfRows(tableid);
		// 	if(((length-1)===index)&&data.status==='2'){
		// 		this.props.editTable.filterEmptyRows(tableid,keys);
		// 		this.addTableRow(false);
		// 	}
		// }, 2);
		if (key === 'taxrate') {
			let taxrate = data.values['taxrate'].value;
			if (Number(taxrate) < 0 || Number(taxrate) > 100) {
				setTimeout(() => {
					this.props.editTable.setValByKeyAndIndex(tableid, index, 'taxrate', {value: ''});
				}, 0)
				
				toast({content:this.state.json['10140TAXRB-000007'],color:'warning'});/* 国际化处理： 输入值必须介于[0,100]*/
				return;
			}
		}
		// 起始日期
		if(key === 'startdate'){
			// 当前行开始日期
			let oldstart = data.values['startdate'].value;
			if (oldstart === null) {
				return;
			}
			// 当前行组织
			let oldorg = data.values['pk_org'].value;
			//获取列表总行数
			// let rownum = this.props.editTable.getNumberOfRows(tableid);

			let allRows = this.props.editTable.getAllData(tableid);
			let datelist = [];
			let datemap = new Map();
			// 遍历所有数据

			// forEach 改为for
			// allRows.rows.forEach((item,indexrow) => {
			for(let indexrow = 0; indexrow < allRows.rows.length; indexrow++) {
				let item = allRows.rows[indexrow];
				// 开始日期
				let otherstart = item.values['startdate'].value;
				if (otherstart != 'undefined' && otherstart != '') {
					
					// 组织
					let otherorg = item.values['pk_org'].value;
					// 校验启用日期重复
					if (indexrow != index && oldorg === otherorg && DateUtils.isSame(oldstart,otherstart, 'YYYY-MM-DD hh:mm:ss', 'd')) {
						data.values['startdate'].value = '';
						data.values['enddate'].value = '';
						toast({content:this.state.json['10140TAXRB-000008'],color:'warning'});/* 国际化处理： 税率启用日期重复！*/
						return;
					}

					// 是否同一税务组织设置设置数据
					if (indexrow != index && oldorg === otherorg) {
						datelist.push(otherstart);
						datemap.set(otherstart, indexrow);
						// 校验设置日期是否介于其他税率期间
							let otherend = item.values['enddate'].value;
						// if (oldstart < otherstart && otherend < maxdate) {
						if (DateUtils.isBefore(oldstart, otherend, 'YYYY-MM-DD hh:mm:ss', 'd') && 	!DateUtils.isSame(otherend, maxdateconst, 'YYYY-MM-DD hh:mm:ss', 'd')) {
							data.values['startdate'].value = '';
							data.values['enddate'].value = '';
							toast({content:this.state.json['10140TAXRB-000009'],color:'warning'});/* 国际化处理： 税率期间不能重合！*/
							return;
						}
					}
				}
				
			}

			let changedate = this.getMaxDate(datelist, oldstart);
			this.setEndDate(index, oldstart, datemap, changedate);
		}
		// 失效日期
		if(key === 'enddate') {
			let startdate = data.values['startdate'].value;
			// 当前行失效日期
			let oldend = data.values['enddate'].value;
			if (oldend === '') {
				toast({content:this.state.json['10140TAXRB-000010'],color:'warning'});/* 国际化处理： 请输入税率的失效日期！*/
				return;
			}
			if (oldend < startdate) {
				data.values['enddate'].value = '';
				toast({content:this.state.json['10140TAXRB-000011'],color:'warning'});/* 国际化处理： 税率失效日期不能小于或等于启用日期！*/
				return;
			}
		}
	}
	
	// 设置失效日期
	setEndDate(index, oldstart, datemap, changedate) {
		let mindate = changedate[0];
		let maxdate = changedate[1];
		// 大于最大值，给最大值失效日期设为选中日期，将选中税率的失效日期设为2999
		if (maxdate == null) {
			if (datemap.size > 0) {
                let dateBefore = DateUtils.getBeforeDay(oldstart, 1, 'YYYY-MM-DD hh:mm:ss');
				let minrow = datemap.get(mindate);
				// TODO minrow index or num

				setTimeout(() => {
					this.props.editTable.setValByKeyAndIndex(tableid, minrow, 'enddate', {value: dateBefore});//设置默认值

					let statusrow = this.props.editTable.getRowStatus(tableid, minrow);
					if (statusrow == 0) {
						this.props.editTable.setRowStatus(tableid, minrow, '1');
					}
					console.log(this.props.editTable.getAllData(tableid));
				}, 0)

				// this.props.editTable.getAllData(tableid).rows[minrow].status = 1;
			}
			this.props.editTable.setValByKeyAndIndex(tableid, index, 'enddate', {value: maxdateconst});//设置默认值
			// this.props.editTable.getAllData(tableid).rows[index].status = '1';
			// getBillCardPanel().setBodyValueAt(maxDate, row, TaxrateVO.ENDDATE);
		} else if (mindate == null) {
			if (datemap.size > 0) {
				this.props.editTable.setValByKeyAndIndex(tableid, index, 'enddate', {value: maxdate});//设置默认值
				// this.props.editTable.getAllData(tableid).rows[index].status = '1';
				// getBillCardPanel().setBodyValueAt(maxdate, row,
				// 		TaxrateVO.ENDDATE);
			}

		}
		// 修改选中税率失效日期为maxdate
		else {
			this.props.editTable.setValByKeyAndIndex(tableid, index, 'enddate', {value: maxdate});//设置默认值
			// this.props.editTable.getAllData(tableid).rows[index].status = '1';
			// getBillCardPanel().setBodyValueAt(maxdate, row, TaxrateVO.ENDDATE);
		}
	}
	// 校验设置日期是否介于其他税率期间
	checkBetweenDate(index, oldstart, indexrow, otherstart) {
		
		if (oldstart < otherstart) {
			let otherend = item.values['enddate'];
			if (otherend < maxdateconst) {
				data.values['startdate'].value = '';
				data.values['enddate'].value = '';
				return true;
			}
		}
		return false;
	}
	/**
	 * 按由大到小排序 取选择日期 区间两端日期
	 */
	getMaxDate(list, seldate) {
		let result = [2];
		if (list != null && list.length > 0) {
			for (let i = 0; i < list.length; i++) {
				// 从第i+1为开始循环数组
				for (let j = i + 1; j < list.length; j++) {
					// if (list.get(i).before(list.get(j))) {
					// if (list.get(i) < (list.get(j))) {
					if (DateUtils.isBefore(list[i], (list[j]), 'YYYY-MM-DD hh:mm:ss')) {
						let date = list[i];
						// list.set(i, list[j]);
						list[i] =  list[j];
						// list.set(j, date);
						list[j] = date;
					}
				}
			}

			// 选中日期大于最大日期 ，返回最大日期 和 NULL
			// if (seldate.after(list.get(0))) {
			// if (seldate > (list.get(0))) {
			if (DateUtils.isAfter(seldate, (list[0]), 'YYYY-MM-DD hh:mm:ss')) {
				result[0] = list[0];
				result[1] = null;

			}
			// 选中日期小于最小日期 ，返回 NULL 和 返回最小日期
			else if (DateUtils.isBefore(seldate, list[list.length - 1], 'YYYY-MM-DD hh:mm:ss')) {
				result[0] = null;
				result[1] = list[list.length - 1];

			}
			// 选中日期介于两个期间之间 返回 大值的起始时间 和 小值的截止时间
			else {
				for (let i = 0; i < list.length; i++) {
					if (DateUtils.isBefore(list[i], seldate, 'YYYY-MM-DD hh:mm:ss')) {
						result[0] = list[i];
						result[1] = list[i - 1];
						break;
					}
				}
			}
		}
		return result;
	}
	//更新按钮状态
	updateButtonStatus(){
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		if(length === 0){//未选择数据
			this.props.button.setDisabled({
				Delete: true
			});
		}else if(length === 1){//选择一行数据
			this.props.button.setDisabled({
				Delete: false
			});
		}else {//选择多行数据
			this.props.button.setDisabled({
				Delete: false
			});
		}
		if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: false,
				Save: true,
				Cancel: true,
				Delete: true,
				Print: false,
				Refresh:false
			});
			this.setState({
				searchDisable:true,
				isOrgAble: true,
				showOffDisable:true
			});
			this.props.button.setMainButton({Save:true,Add:false});
			this.props.button.setPopContent('DelLine','');
		}else{//浏览态
			// this.props.button.setDisabled({
			// 	addButton: false,
			// 	editButton: false,
			// 	delButton: false,
			// });	

			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Save: false,
				Cancel: false,
				Print: true,
				Refresh: true
			});
			if (this.config.nodetype === 'org' && this.state.curOrg.refpk) {
				// 组织参照选中后，按钮可用
				this.props.button.setDisabled({
					Add: false,
					Edit: false,
					Refresh: false,
				});
			}
			if (this.config.nodetype === 'org' && !this.state.curOrg.refpk) {
				// 组织参照清除后，按钮不可用
				this.props.button.setDisabled({
					Add: true,
					Edit: true,
					Refresh: true,
				});
			}
			this.setState({
				searchDisable:false,
				isOrgAble: false,
				showOffDisable:false
			});
			this.props.button.setMainButton({Save:false,Add:true});
			this.props.button.setPopContent('DelLine',this.state.json['10140TAXRB-000001']);/* 国际化处理： 确认要删除该信息吗？*/

			//组织页面，且没有选择组织，所有按钮不可用
			// if (this.config.nodetype === 'org' && this.state.curOrg === '')	{
			// 	this.props.button.setDisabled({
			// 		addButton: true,
			// 		editButton: true,
			// 		delButton: true,
			// 	});	
				
			// 	this.setState({
			// 		searchDisable:true,
			// 		showOffDisable:true
			// 	});				
			// }		
		}
	}

	//显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
		});
		//mazheng 重构代码, 查询参数放到getData函数内部获取,以便查询复用
		setTimeout(() => { this.getData(); });
		
	}

	addTableRow(isFocus){
		if (this.config.nodetype == 'org') {
			if (this.state.curOrg.refpk == null) {
				toast({content: this.state.json['10140TAXRB-000012'], color:'info'})/* 国际化处理： 请选择组织参照*/
				return
			}
		}

		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		// 获取列表数据为pk_taxkind赋值
		let dataall = this.props.editTable.getAllData(tableid);
		this.props.editTable.addRow(tableid,num,isFocus);
		if (this.config.nodetype == 'glb') { //全局页面
			this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_org', {value: 'GLOBLE00000000000000', display:this.state.json['10140TAXRB-000005']});//设置组织默认值/* 国际化处理： 全局*/
		} else { //组织页面
			this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_org', {value: this.state.curOrg.refpk, display:this.state.curOrg.refname});//设置组织默认值
		}
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_taxkind', {value: dataall.rows[0].values['pk_taxkind'].value, display:dataall.rows[0].values['pk_taxkind'].display});
	}
	// 确认取消
	cancelConfirmModal(props){
        this.props.editTable.cancelEdit(tableid,()=>{
			this.checklist.forEach((item, index) => {
				this.props.editTable.setCheckboxDisabled(tableid,item,false);
			});
		});
		this.props.editTable.showColByKey(tableid,'opr');//显示操作列
		// 不能删除的行，CheckBox不能选择
				
        this.updateButtonStatus();
	}
	
	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'Add':	
				if (this.config.nodetype == 'org') {
					if (this.state.curOrg.refpk == null) {
						toast({content: this.state.json['10140TAXRB-000012'], color:'info'})/* 国际化处理： 请选择组织参照*/
						return;
					}
				}
				ajax({
                    url:urls.add,
                    data:{'nodetype':this.config.nodetype},
                    success:(res)=>{
                        let{success,data} = res;
                        if(success){
							// this.props.editTable.setStatus(tableid,'edit');
							// this.addTableRow(true);
							let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
							this.props.editTable.addRow(tableid,num,true);
							if (this.config.nodetype == 'glb') { //全局页面
								this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_org', {value: 'GLOBLE00000000000000', display:this.state.json['10140TAXRB-000005']});//设置组织默认值/* 国际化处理： 全局*/
							} else { //组织页面
								this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_org', {value: this.state.curOrg.refpk, display:this.state.curOrg.refname});//设置组织默认值
							}
							//设置税种默认值
							this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_taxkind', {value: data[tableid].rows[0].values['pk_taxkind'].value, display:data[tableid].rows[0].values['pk_taxkind'].display});
							
							// 行不能编辑设置
							this.props.editTable.setEditableRowByIndex(tableid,this.checklist, false);
                        }
                    }
                });
				break;
			case 'Edit':
				// let datatable = this.props.editTable.getAllData(tableid);
				// let enableindex = [];
				// datatable.rows.forEach((item, index, array)=>{
				// 	//组织级页面，全局的税种也不能修改
				// 	if (this.config.nodetype === 'org' && item.values['pk_org'].value==='GLOBLE00000000000000' ) { 
				// 		enableindex.push(index);
				// 	}
				// });
				let datatable = this.props.editTable.getAllData(tableid);
				if (datatable.rows.length > 0) {
					// 行不能编辑设置
					this.props.editTable.setEditableRowByIndex(tableid,this.checklist, false);
				}
				this.props.editTable.setStatus(tableid, 'edit');
				break;
			case 'Cancel':
				// this.props.modal.show('cancelConfirmModal');
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140TAXRB-000013'],/* 国际化处理： 确认取消*/
					content:this.state.json['10140TAXRB-000014'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick:()=>{this.cancelConfirmModal()}
					})
				// return;
				// this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
					
				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid,keys);
					let tableData = this.props.editTable.getChangedRows(tableid, true);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					console.log(tableData);
					if(tableData === undefined || tableData.length==0) {
						// toast({content: '没有要保存的数据', color:'info'})
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
						toast({title: this.state.json['10140TAXRB-000015'], color:'success'});/* 国际化处理： 保存成功！*/
						return
					}
					let tableAllData = this.props.editTable.getAllRows(tableid, true);
					if(!this.props.editTable.checkRequired(tableid,tableAllData)) return;
					// 调整启用日期，失效日期的格式
					tableData.forEach((item, index) => {
						let startdatev = item.values['startdate'].value;
						let enddatev = item.values['enddate'].value;
						item.values['startdate'].value = DateUtils.setDateFactor(startdatev, 'YYYY-MM-DD HH:mm:ss').setHour(0).setMinute(0).setSecond(0).format();
						if (enddatev) {
							item.values['enddate'].value = DateUtils.setDateFactor(enddatev, 'YYYY-MM-DD HH:mm:ss').setHour(23).setMinute(59).setSecond(59).format();
						}
					});
	
					let data = {
						pageid:pagecode,
						model : {
							areaType: "table",
							pageinfo: null,
							rows: [],
							areacode: tableid//添加表单的areacode编码
						}
					}
					// Utils.convertGridEnablestate(tableData); ////保存前，switch开关true和false转换成数值1,2,3
					data.model.rows = tableData;
					// 验证公式
					this.props.validateToSave(data,()=>{
						ajax({
							url: urls['save'],
							data,
							success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
		
									Utils.handleTableReData({
										data : data,
										tableid : tableid,
										props : this.props,
										empty : (data) => {	//数据为空时执行回调方法
										},
										notEmpty : (data)=>{	//数据不为空时执行回调方法
											let allD = this.props.editTable.getAllData(tableid);
											Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
											Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
											// Utils.convertGridEnablestate(data[tableid].rows);
											this.props.editTable.setTableData(tableid,allD);
											
											// 不能删除的行，CheckBox不能选择
											this.checklist.forEach((item, index) => {
												this.props.editTable.setCheckboxDisabled(tableid,item,false);
											});								
										}
									});
									
									toast({title: this.state.json['10140TAXRB-000015'], color:'success'})/* 国际化处理： 保存成功！*/
								}
							}.bind(this)
						});				
					},{[tableid]: "editTable"});
					
				}, 0);
				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content: this.state.json['10140TAXRB-000016'], color:'info'})/* 国际化处理： 请选择要删除的数据*/
					return 
				}

				// delOnEdit 编辑状态下删除
				if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
					let indexArr=[];
					let lastrate;
					selectedData.forEach((val) => {
						indexArr.push(val.index);
						let enddate = val.data.values['enddate'].value;
						if (enddate && DateUtils.isSame(enddate, maxdateconst, 'YYYY-MM-DD hh:mm:ss', 'd')) {
							lastrate = val;
						}
						// this.props.editTable.getAllData(tableid).rows[val.index];
					});

					
					let pk_org = lastrate ? lastrate.data.values['pk_org'].value : '';
					let allData = this.props.editTable.getAllData(tableid);
					let changedate;
					let changerow = -1;
					for (let i = 0; i < allData.rows.length; i++) {
						if (indexArr.indexOf(i) > -1 ) {
							continue;
						}
						// if (((TaxrateVO) list.get(i)).getPk_org().equals(pk_org)) {
						if (allData.rows[i].values['pk_org'].value === pk_org) {
							let startdate = allData.rows[i].values['startdate'].value;
							if (changedate == undefined) {
								changedate = startdate;
								changerow = i;
							} else {
								if (DateUtils.isAfter(startdate, changedate, 'YYYY-MM-DD hh:mm:ss')) {

									changedate = startdate;
									changerow = i;
								}
							}
						}
					}
					if (changerow != -1) {
						setTimeout(() => {
							this.props.editTable.setValByKeyAndIndex(tableid, changerow, 'enddate', {value: maxdateconst});
							let statusrow = this.props.editTable.getRowStatus(tableid, changerow);
							if (statusrow == 0) {
								this.props.editTable.setRowStatus(tableid, changerow, '1');
							}
						}, 0)
						// allData.rows[changerow].values['enddate'].value = maxdateconst;

					}
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);

				} else { // delOnNotEdit非编辑状态下删除
					// this.props.modal.show('modal',{
					// 	title : '确认删除',
					// 	content : '您确认删除所选数据？',
					// 	beSureBtnClick : this.onDelForBrowse.bind(this)
					// });
					promptBox({
						color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title:this.state.json['10140TAXRB-000017'],/* 国际化处理： 删除提醒*/
						content:this.state.json['10140TAXRB-000018'],/* 国际化处理： 确定要删除数据吗？*/
						beSureBtnClick:()=>{this.onDelForBrowse()}
						})
				}
				break;
			case "Refresh":
				this.setState({ searchValue:'' });
				this.getData();
				console.log(this.state.json)
				console.log(this.state.json['10140TAXRB-000019'])
				toast({title: this.state.json['10140TAXRB-000019'], color:'success'});/* 国际化处理： 刷新成功！*/
				break;	
		}
	
	}

	onSelectMoreButton({ key }) {
		toast({content: this.state.json['10140TAXRB-000020'], color:'info'});/* 国际化处理： 努力开发中......*/
	 
	}
	
	//表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData = Utils.clone(allTableData);
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
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		// 日期最后的税率
		let lastrate;
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					// ts: {
					// 	display: '时间戳',
					// },
					// pk_taxrate: {
					// 	display: '主键',
					// }
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values = val.data.values;
			// delObj.values.ts.value=val.data.values.ts.value;
			// delObj.values.pk_taxrate.value=val.data.values.pk_taxrate.value;
			dataArr.push(delObj);
			indexArr.push(val.index);
			// lastrate allData.rows[changerow].values['enddate'].value
			let enddate = val.data.values.enddate.value;
			if (enddate && DateUtils.isSame(enddate, maxdateconst, 'YYYY-MM-DD hh:mm:ss', 'd')) {
				lastrate = val;
			}
		});
		let pk_org;
		if (lastrate) {
			pk_org = lastrate.data.values.pk_org.value;
		}
		let allData = this.props.editTable.getAllData(tableid);
		let changedate;
		let changerow = -1;
		for (let i = 0; i < allData.rows.length; i++) {
			if (indexArr.indexOf(i) > -1 ) {
				continue;
			}
			// if (((TaxrateVO) list.get(i)).getPk_org().equals(pk_org)) {
			if (pk_org && allData.rows[i].values['pk_org'].value === pk_org) {
				let startdate = allData.rows[i].values['startdate'].value;
				if (changedate == undefined) {
					changedate = startdate;
					changerow = i;
				} else {
					if (DateUtils.isAfter(startdate, changedate, 'YYYY-MM-DD hh:mm:ss')) {

						changedate = startdate;
						changerow = i;
					}
				}
			}
		}
		if (changerow != -1) {
			// 因为异步的问题，下面的请求代码全部拿到if里面写了一遍
			setTimeout(() => {
				this.props.editTable.setValByKeyAndIndex(tableid, changerow, 'enddate', {value: maxdateconst});
				let statusrow = this.props.editTable.getRowStatus(tableid, changerow);
				if (statusrow == 0) {
					this.props.editTable.setRowStatus(tableid, changerow, '1');
				}
				
				let allDatanew = this.props.editTable.getAllData(tableid);
				dataArr.push(allDatanew.rows[changerow]);
				console.log('dataArr', dataArr)
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
							this.props.editTable.setTableData(tableid,allD);
							toast({title: this.state.json['10140TAXRB-000021'], color: 'success'});/* 国际化处理： 删除成功！*/
						}
					}
				});
			}, 0)
			return true
		}
		// 请求
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
					this.props.editTable.setTableData(tableid,allD);
					toast({title: this.state.json['10140TAXRB-000021'], color: 'success'});/* 国际化处理： 删除成功！*/
				}
			}
		});
	
	}
	// 自动增行后的回调
	addRowAutoCallback() {
		ajax({
			url:urls.add,
			data:{'nodetype':this.config.nodetype},
			success:(res)=>{
				let{success,data} = res;
				if(success){

					let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
					if (this.config.nodetype == 'glb') { //全局页面
						this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'pk_org', {value: 'GLOBLE00000000000000', display:this.state.json['10140TAXRB-000005']});//设置组织默认值/* 国际化处理： 全局*/
					} else { //组织页面
						this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'pk_org', {value: this.state.curOrg.refpk, display:this.state.curOrg.refname});//设置组织默认值
					}
					//设置税种默认值
					this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'pk_taxkind', {value: data[tableid].rows[0].values['pk_taxkind'].value, display:data[tableid].rows[0].values['pk_taxkind'].display});

				}
			}
		});

	}

	render() {
		let { table, button, search,editTable,modal } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { NCFormControl,NCCheckbox } = base;
		let { createModal } = modal;
		//const { Item } = NCMenu;
		// let moreButton = (
		// 	<NCMenu
        //           onSelect={this.onSelectMoreButton.bind(this)}>
        //               <NCMenu.Item key="1">自定义档案维护-全局</Item>
		// 			  <Item key="2">自定义档案维护-集团</Item>
		// 			  <Item key="3">自定义档案维护-业务单元</Item>
        //         </NCMenu>
		// );

		//mazheng 添加渲染组织参照判断
		var createOrgRender = () => {
			return  this.config.nodetype === 'org' ? (
				<div className="search-box"  style={{position:'relative'}}>
				{(this.state.curOrg && this.state.curOrg.refpk)
                             ? '' : <span style={{color: 'red',position:'absolute',left: 3,top: 8,zIndex: 1}}>*</span>}
				{Org({
					onChange:this.onOrgChange.bind(this),
					value:this.state.curOrg,
					disabled: this.state.isOrgAble,
					//placeholder: '重写这个参照的名字',
					//如果需要对参照过滤 可以加queryCondition参数
					queryCondition: function() {
                        return {
//                             "AppCode": '10140TAXRB',
                            TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
                        }
                    }
				})}
				</div>
		    ) : '';
		};
		return (
			<div className="nc-single-table">
				{/* 头部 header */}
				<div className="nc-singleTable-header-area" style={{borderBottom:'none'}}>			
					{/* 标题 title */}
					<div className="header-title-search-area">
					{createPageIcon()}{/* 大图标 */}
				<h2 className="title-search-detail">{this.state.json[this.config.title]}</h2>	{/*  mazheng 更换标题,取配置文件标题 */}

						{/*  mazheng 添加渲染函数创建组织 */}
						<div className="title-search-detail">	
							{createOrgRender()}  
						</div>
					   
						{/* 简单查询 */}
						{/* <div className="title-search-detail">					
							<NCFormControl
								placeholder="请输入编码或名称筛选"
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
								disabled={this.state.searchDisable}
							/>
						</div> */}

						{/* 显示停用数据 */}
						{/* <div className='title-search-detail'>
							{isShowOffEnable?(
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										disabled={this.state.showOffDisable}
									>显示停用</NCCheckbox>
								</span>
							):('')}
						</div> */}
					</div>	

					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
						{/* <NCDropdown
							trigger={['hover']}
							overlayClassName={'overlay-button'}
							overlay={moreButton}
							animation="slide-up">
							<NCButton 
							buttonColor='secondary - button' 
							className={
								`${  this.state.moreButton ? 'show' : 'hide' }  button-component `
								}
							style={{'height':'30px','line-height':'20px'}}>更多</NCButton>
						</NCDropdown> */}
					</div>
				</div>
				{/* 单表页面去除查询区 */}
				{/* <div className="search-area">
					{NCCreateSearch(searchid, {//查询区
						clickSearchBtn: this.onSearchBtnClick.bind(this),		//查询按钮点击事件绑定
						defaultConditionsNum:2		//默认显示查询添加个数，如果不传该参数则全部显示 
						//saveSearchPlan:true			//是否显示保存方案，默认false不显示
					})}
				</div> */}
				
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
					{createEditTable(tableid, {//列表区
						//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
						onAfterEvent:this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
						useFixedHeader:true,    
						adaptionHeight:true,//空白自动扩充
						//onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
						//onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
						selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
						statusChange: function(){
							setTimeout(() => {
								this.updateButtonStatus();
							}, 0)
						}.bind(this),				//表格状态监听
						showIndex:true,				//显示序号
						isAddRow:true, 	// 失去焦点是否自动增行
						addRowCallback: this.addRowAutoCallback.bind(this),	// 自动增行后的回调
						showCheck:true			//显示复选框
						//params: 'test',                                  // 自定义传参

					})}
				</div>
				{/* 删除前确认模态框 */}
				{/* {createModal('modal',{
					title : '确认删除',										//标题
					content : '确认删除所选数据？',							//内容
					beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
					//cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
					// leftBtnName : '关闭',   								//左侧按钮名称
    				// rightBtnName : '确认'   								//右侧按钮名称
				})} */}
				{/* {createModal('cancelConfirmModal', {
						   title: "注意",
						   content: '是否确认要取消？',
						   beSureBtnClick: this.cancelConfirmModal.bind(this)
			   })} */}
			</div>
		);
	}
}

export default SingleTable;

//ldZJBr9DFLxxEiCCfFC9ZRf4Mw1DKgToIIpQwexY9rRNycEjrQFgoXMlpZRNjlvg