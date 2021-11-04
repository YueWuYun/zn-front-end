//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,promptBox } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
let { NCPopconfirm,NCModal,NCDiv } = base;
const { NCDropdown:Dropdown, NCIcon:Icon, NCMenu:Menu, NCButton:Button }=base;
//用户参照原路径
//import '../../../../uapbd/refer/riart/userRefer/index.js';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
const tableid = 'orgmanager';
const pagecode = '10100ORGMR_orgmanager';
const appId='0001Z0100000000081E1';

const urls = {
	qryPsninfo:'/nccloud/baseapp/dept/qryPsninfo.do',
	save:'/nccloud/baseapp/dept/mngsave.do',
	query:'/nccloud/baseapp/dept/mngqry.do'
};


class Orgmanager extends Component {
	constructor(props){
		super(props);
		this.loadMeta(()=>{
			this.loadListData();
			this.updateButtonStatus('browse');
		});
	}

	loadMeta(initData){
		let prop=this.props;
		prop.createUIDom({
			pagecode : pagecode//,
			//appid : appId
		},
		(data)=>{
			let listmeta = data.template;
			listmeta[tableid].items.map((item)=>{
				if(item.attrcode=="cuserid"){
					item.isMultiSelectedEnabled=false//用户参照改成单选
					item.queryCondition=()=>{
						return {
							GridRefActionExt: 'nccloud.web.org.orgunit.action.UserFilter'
						}
					};
					//modified by wangying16 for NCCLOUD-96773
                    //此处需给item赋值参照内所有columnConfig属性，只赋值checked会覆盖参照columnConfig导致报错
					item.columnConfig= [
						{
							name: ['1880000025-000002','1880000025-000003','1880000025-000012','1880000025-000013'],/* 国际化处理： 编码,名称,所属用户组,所属组织*/
							code: [ 'refcode', 'refname','groupname','name' ],
							checked: {name:false,groupname:false}
						}
					];
				}
			});
			prop.meta.setMeta(listmeta);
			data.button && prop.button.setButtons(data.button);
			initData();
		});
	}

	updateButtonStatus(status){
		if(!status||status=='browse'){
			this.props.button.setMainButton('add',true);
			this.props.button.setButtonsVisible({
				add: true,
				update: true,
				delete: true,
				save: false,
				cancel: false,
				refresh:true
			});
		}else{
			this.props.button.setMainButton('add',false);
			this.props.button.setButtonsVisible({
				add: true,
				update: false,
				delete: true,
				save: true,
				cancel: true,
				refresh:false
			});
		}
		
	}

	loadListData(prompt){

		ajax({
			url: urls['query'],
			data:{
				pk_org:this.props.config.refpk
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					//allTableData = data[tableid];
					if(data&&data[tableid]){
						//适配显示公式
						if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
							this.props.dealFormulamsg(
								res.formulamsg,
								{
									tableid:"editTable"
								}
							);
						}
						
						this.props.editTable.setTableData(tableid, data[tableid]);
						this.props.button.setDisabled({
							update:false
						});
					}else{
						this.props.editTable.setTableData(tableid, {rows:[]});
						this.props.button.setDisabled({
							update:true
						});
					}
					//每次加载列表数据，都需将删除按钮禁用
					this.props.button.setDisabled({
						delete:true
					});
					//如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}
				}
			}
		});

	}

	//按钮点击事件
	onButtonClick(props,id) {
		//列表态按钮处理逻辑
		switch (id) {
			case 'add':
				let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
				this.props.editTable.addRow(tableid,num,false);
				let index=this.props.editTable.getNumberOfRows(tableid)-1;
				this.props.editTable.setValByKeyAndIndex(tableid, index, "pk_org", { value:this.props.config.refpk});
				this.props.editTable.setValByKeyAndIndex(tableid, index, "dataoriginflag", { value:'0'});
				this.updateButtonStatus('add');
                break;

            case 'delete':
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.props.json['10100ORGMNG-000000'],color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
					return 
				}
				if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
					let indexArr=[];
					selectedData.forEach((val) => {
						indexArr.push(val.index);
					});
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					this.props.button.setButtonDisabled(['delete'], true);
				}else{
					promptBox({
						color:'warning',
						title : this.props.json['10100ORGMNG-000001'],/* 国际化处理： 确认删除*/
						content : this.props.json['10100ORGMNG-000002'],/* 国际化处理： 您确认删除所选数据？*/
						beSureBtnClick : this.onDelForBrowse.bind(this)
					})
					
				}
				break;
            case 'update':
				this.props.editTable.setStatus(tableid, 'edit');
				this.updateButtonStatus('edit');
				break;
			case 'cancel':
				promptBox({
					color:'warning',
					title : this.props.json['10100ORGMNG-000003'],/* 国际化处理： 确认取消*/
					content : this.props.json['10100ORGMNG-000004'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick : ()=>{
						this.props.editTable.cancelEdit(tableid);
						this.loadListData();
						this.updateButtonStatus('browse');
					}
				});
				
				break;
			case 'save':
				this.props.editTable.filterEmptyRows(tableid,['pk_org','dataoriginflag']);
				this.props.editTable.filterEmptyRows(tableid);
				let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
				if(!tableData || tableData.length === 0){
					toast({title:this.props.json['10100ORGMNG-000005'],color:'success'});/* 国际化处理： 保存成功！*/
					this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
					this.loadListData();
					this.updateButtonStatus('browse');
					return
				} 

				let data = {
					pageid:pagecode,
					model : {
						areaType: "table",
						pageinfo: null,
						rows: []
					}
				};
				data.model.rows = tableData;
				ajax({
					url: urls['save'],
					data,
					success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
						let { success,data} = res;
						if (success) {
							toast({title:this.props.json['10100ORGMNG-000005'],color:'success'});/* 国际化处理： 保存成功！*/
							this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
							if(data){
								let allD = this.props.editTable.getAllData(tableid);
								//Utils.filterResult(allD,data[tableid].rows,'pk_transporttype','code');//将保存后返回的数据重新放置到页面
								this.props.editTable.setTableData(tableid,allD);
							}
							this.loadListData();
							this.updateButtonStatus('browse');
						}
					}.bind(this)
				});
				break;
				
            case 'refresh':
                this.loadListData(()=>{
					toast({title:this.props.json['10100ORGMNG-000006'],color:'success'});/* 国际化处理： 刷新成功！*/
				});
                break;
		}
	}
	
	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: this.props.json['10100ORGMNG-000007'],/* 国际化处理： 时间戳*/
					},
					pk_orgmanager: {
						display: this.props.json['10100ORGMNG-000008'],/* 国际化处理： 主键*/
					}
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values.ts.value=val.data.values.ts.value;
			delObj.values.pk_orgmanager.value=val.data.values.pk_orgmanager.value;
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
					toast({title:this.props.json['10100ORGMNG-000009'],color:'success'});/* 国际化处理： 删除成功！*/
					this.props.button.setButtonDisabled(['delete'], true);
					this.loadListData();
				}
			}
		});
	}

	//表格编辑后事件
	onAfterEvent(props, moduleId , key ,value , changedrows , index , record) {
		
		//设置元数据单据模板中用户参照的onchange事件，带出关联的人员编码和名称（平台显示公式目前不支持带点的显示公式）
		if(key=='cuserid'){
			if(!value.refpk){
				//参照没有数据，则清空界面值
				this.props.editTable.setValByKeyAndIndex(
					tableid,
					index,
					'cuserid.pk_psndoc.code',
					{
						value:null,
						display:null
					}
				);
				this.props.editTable.setValByKeyAndIndex(
					tableid,
					index,
					'cuserid.pk_psndoc.name',
					{
						value:null,
						display:null
					}
				);
				this.props.editTable.setValByKeyAndIndex(
					tableid,
					index,
					'cuserid.user_name',
					{
						value:null,
						display:null
					}
				);
				return;
			}
			ajax({
				url:urls['qryPsninfo'],
				data:{cuserid:value.refpk},
				success:(result)=>{
					let {success,data}=result;
					if(success&&data){
						this.props.editTable.setValByKeyAndIndex(
							tableid,
							index,
							'cuserid.pk_psndoc.code',
							data['cuserid.pk_psndoc.code']
						);
						this.props.editTable.setValByKeyAndIndex(
							tableid,
							index,
							'cuserid.pk_psndoc.name',
							data['cuserid.pk_psndoc.name']
						);
						this.props.editTable.setValByKeyAndIndex(
							tableid,
							index,
							'cuserid.user_name',
							data['cuserid.user_name']
						);
						//编辑后事件设置组织主管所属组织信息
						props.editTable.setValByKeyAndIndex(tableid, index, "pk_org", { value:props.config.refpk});
					}
				}
			})
		}
	}

	onRowDataSelect(props,moduleId,record,index,status){
		//列表态有选中的数据，则启用删除按钮，否则禁掉
		if(this.props.editTable.getCheckedRows(tableid).length>0){
			this.props.button.setDisabled({
				delete:false
			});
		}else{
			this.props.button.setDisabled({
				delete:true
			});
		}
	}

	//自动增行后的回调
	addRowCallback(){
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		let index=this.props.editTable.getNumberOfRows(tableid)-1;
		this.props.editTable.setValByKeyAndIndex(tableid, index, "pk_org", { value:this.props.config.refpk});
		this.props.editTable.setValByKeyAndIndex(tableid, index, "dataoriginflag", { value:'0'});
	}

	render() {

		const {button,modal,editTable,BillHeadInfo} = this.props;

		const {createButton}=button;

		const {createBillHeadInfo} = BillHeadInfo;
		
		let { createButtonApp } = button;

		let { createModal } = modal;  //模态框
		
		let { createEditTable } = editTable;  //模态框


		return(
			<div className="nc-bill-list">
				{createModal('modal', { noFooter: false })}
				{/* 头部 header*/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" style={{border:'none'}}>
					<div className="header-title-search-area" style={{'marginRight': '10px'}}>
						{this.props.json['10100ORGMNG-000010']}
                    </div>
                    {/*业务单元参照*/}
                    <div className="search-box">
                        {BusinessUnitTreeRef({
							fieldid:'orgunit',
                            //isTreelazyLoad:false,
                            //queryCondition:orgPermCondition,
                            //onChange:this.onOrgChange.bind(this),
                            value:{refpk:this.props.config.refpk,refname:this.props.config.refname},
                            disabled: true
                        })}
                    </div>
					{/* 按钮组 btn-group*/}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_btn',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
				</NCDiv>
				{/* 单表区/卡区域 */}
				<div className="nc-bill-table-area">
					{createEditTable(tableid, {//列表区
						//onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
						useFixedHeader:true,   
						isAddRow:true,//自动增行
						addRowCallback:this.addRowCallback.bind(this),//自动增行后回调
						onSelected:this.onRowDataSelect.bind(this),
						onSelectedAll:this.onRowDataSelect.bind(this),
						//statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
						showIndex:true,				//显示序号
						showCheck:true			//显示复选框
						//params: 'test',                                  // 自定义传参

					})}
				</div>

			</div>
		)

	}
}

export default Orgmanager = createPage({
	billinfo:{
        billtype:'grid',
        pagecode:pagecode,
        bodycode:tableid
    },
    initTemplate: ()=>{}
})(Orgmanager)



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65