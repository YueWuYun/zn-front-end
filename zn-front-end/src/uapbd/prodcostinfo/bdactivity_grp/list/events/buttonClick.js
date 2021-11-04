//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS

import { ajax,base,toast ,promptBox} from 'nc-lightapp-front';
let { Message } = base;

export default function buttonClick(props, id) {
	switch (id) {
		case 'Add'://新增
			if(props.editTable.getStatus(this.tableId)!='edit'){
				props.editTable.setStatus(this.tableId,'edit');
			}
			this.addLine(true);
			this.toggleShow();
			break;
		case 'Delete'://删除
			let status = props.editTable.getStatus(this.tableId);
			if(status == 'edit'){
				let checkData = props.editTable.getCheckedRows(this.tableId);
				if(checkData.length == 0){
					toast({ color: 'warning', content: this.state.json['10140ACTG-000002'] });/* 国际化处理： 请至少选择一条要删除的数据!*/
				}
				let delindex = [];
				checkData.forEach(item => {
					delindex.push(item.index);
				});
				if(delindex.length >0){
					props.editTable.deleteTableRowsByIndex(this.tableId,delindex);
				}	
			}else{
				promptBox({
					color: 'warning',                 
					title: this.state.json['10140ACTG-000009'],                  /* 国际化处理： 删除*/
					content: this.state.json['10140ACTG-000011'],             /* 国际化处理： ​​确定要删除所选数据吗？*/
					noFooter: false,                 
					noCancelBtn: false,              
					beSureBtnName: this.state.json['10140ACTG-000007'],           /* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140ACTG-000008'] ,          /* 国际化处理： 取消*/
					beSureBtnClick: ()=>{
						//浏览态直接去调用保存的逻辑
						this.save();
					}
				});	
			}
			
            break;
		case 'Edit'://修改
			props.editTable.setStatus(this.tableId,'edit');
			this.toggleShow();
			break;
		//打印
		case 'Print':
				this.onPrint();
				break;
		// 输出
		case 'Output':
				this.onOutput();
				break;   
		// 启用
		case 'Enable':
				this.enableFun('batch');
				break; 
		// 禁用
		case 'Disable':
				this.disableFun('batch');
				break; 
		case 'Refresh'://刷新
			this.getTableData(id);
            break;
        case 'Save'://保存
			this.save();
            break;
		case 'Cancel'://取消
			promptBox({
				color: 'warning',                 
				title: this.state.json['10140ACTG-000007'],                  /* 国际化处理： 取消*/
				content: this.state.json['10140ACTG-000010'],             /* 国际化处理： ​确定要取消吗？*/
				noFooter: false,                 
				noCancelBtn: false,              
				beSureBtnName: this.state.json['10140ACTG-000007'],           /* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140ACTG-000008'] ,          /* 国际化处理： 取消*/
				beSureBtnClick: ()=>{
					props.editTable.cancelEdit(this.tableId);
					this.toggleShow();
				} 
			});
            break;

        default:
            break;    
    }
		
	
}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS