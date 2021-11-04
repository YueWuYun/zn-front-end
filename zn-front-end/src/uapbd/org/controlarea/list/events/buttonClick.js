//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax, base, toast,cardCache,promptBox ,print,output} from 'nc-lightapp-front';
import { tableId,searchId,dataSource} from '../constants';
let { setDefData, getDefData } = cardCache;
export default function buttonClick(props, id) {
	let appcode = this.props.getSearchParam("c");
    switch (id) {
        case 'Add':
            props.pushTo('/card', {
				status: 'add'
            })
            break;
		case 'Refresh': //刷新
			//获取查询条件的缓存，有缓存就再次查询渲染界面，没有缓存的话就清空表格数据信息
			let refreshData = getDefData(this.searchId, dataSource);
			if (refreshData) {
				let pageInfo = props.table.getTablePageInfo(this.tableId);
				refreshData.queryInfo.pageInfo = pageInfo;
				ajax({
					url: '/nccloud/web/controlarea/ControlareaQueryAction.do',
					data: refreshData.queryInfo,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if (data) {
								toast({ color: 'success', title: this.state.json['38200CA-000009'] }); /* 国际化处理： 刷新成功*/
								this.props.table.setAllTableData(this.tableId, data[this.tableId]);
							} else {
                                toast({ color: 'warning', content: this.state.json['38200CA-000004'] }); /* 国际化处理： 未查询到数据*/
								this.props.table.setAllTableData(this.tableId, { rows: [] });
							}
							setDefData(this.tableId, dataSource, data); //放入缓存
							this.onSelected();
						}
					}
				});
			} else {
				toast({ color: 'success', title: this.state.json['38200CA-000009'] }); /* 国际化处理： 刷新成功*/
				this.props.table.setAllTableData(this.tableId, { rows: [] });
			}  
			break;

		case 'Delete'://批量删除
			promptBox({
				color: 'warning',                 
				title: this.state.json['38200CA-000006'],                  /* 国际化处理： 删除*/
				content: this.state.json['38200CA-000014'],             /* 国际化处理： ​​确定要删除所选数据吗？*/
				noFooter: false,                 
				noCancelBtn: false,              
				beSureBtnName: this.state.json['38200CA-000007'],           /* 国际化处理： 确定*/
				cancelBtnName: this.state.json['38200CA-000008'] ,          /* 国际化处理： 取消*/
				beSureBtnClick: ()=>{
					//获取当前选中信息数据，后台对应接收处理数据
					let deleteData = getAllCheckedData(this.props, this.tableId);
				
					if (deleteData.length == 0) {
						toast({ color: 'warning', content: this.state.json['38200CA-000015'] });/* 国际化处理： 请选中至少一行数据!*/
						return;
					}
					deleteData = JSON.parse(JSON.stringify(deleteData));
					ajax({
						url: '/nccloud/web/controlarea/ControlareaDeleteAction.do',
						data: {deleteData},
						success: (res) => {
							let { success, data } = res;
							if (success) {
								if(data.message){
									toast({
										duration:  'infinity',          
										color: data.PopupWindowStyle,         
										content: data.message,   
									})
								}
								if(data.successIndexs){//删除当前行数据
									props.table.deleteTableRowsByIndex(this.tableId, data.successIndexs);
								}
								if(data.successPKs){//删除缓存数据
									props.table.deleteCacheId(this.tableId, data.successPKs);
								}
								//列表控制按钮
								this.onSelected();
							}
						}
					});
				}
			});
			break;
		case 'resa_RelLiabilityCenter'://关联利润中心查询
			this.modalSize = 'lg'
			this.referModalTitle='关联利润中心查询'
			this.selectBtn = 'resa_RelLiabilityCenter'
			this.trueButton=false;
			this.index=this.props.cardTable.getClickRowIndex('controlarea_table').record.numberindex.value-1;
			this.source='listPage';
			relRelMenue.call(this)
			break;
		case 'resa_RelFinanceOrg'://关联财务组织查询
			this.modalSize = 'lg'
			this.referModalTitle='关联利润中心查询'
			this.selectBtn = 'resa_RelFinanceOrg'
			this.trueButton=false;
			this.index=this.props.cardTable.getClickRowIndex('controlarea_table').record.numberindex.value-1;
			this.source='listPage';
			relRelMenue.call(this)
			break;
		case 'resa_RelFactory'://关联工厂
			this.modalSize = 'lg'
			this.selectBtn = 'resa_RelFactory'
			this.referModalTitle='关联工厂查询'
			this.trueButton=false;
			this.index=this.props.cardTable.getClickRowIndex('controlarea_table').record.numberindex.value-1;
			this.source='listPage';
			relRelMenue.call(this)
			break;
		case 'resa_RelProjectOrg'://关联项目组织查询
			this.modalSize = 'lg'
			this.selectBtn = 'resa_RelProjectOrg';
			this.referModalTitle='关联项目组织查询'
			this.trueButton=false;
			this.index=this.props.cardTable.getClickRowIndex('controlarea_table').record.numberindex.value-1;
			this.source='listPage';
			relRelMenue.call(this)
			break;
        default:
            break
        
    }
}


//获取选中数据的id和billType
let getAllCheckedData = function (props, tableId) {
    let checkedData = props.table.getCheckedRows(tableId);
    let checkedObj = [];
    checkedData.forEach(val => {
        checkedObj.push({
			pk_bill: val.data.values.pk_controlarea.value,
			index : val.index
        }
        );
    });
    return checkedObj;
}

//打开弹出框
export function relRelMenue(){
	this.setState({
		modalOne: true
	})
}


//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS