//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax,toast,base,print,output,getBusinessInfo ,promptBox } from 'nc-lightapp-front';
// import ShareInGroup from '../../shareingroup/index';
// import ShareJGroup from '../../sharejgroup/index';
// import UserMigrate from '../../usermigrate/index';
import Utils from './../../../../public/utils'
const {NCFormControl,NCForm,NCDiv,NCInput }=base;
const NCFormItem = NCForm.NCFormItem;



export default function buttonClick(props, id) {
	let businessInfo = getBusinessInfo();
	let cur_pk_group = businessInfo.groupId;
	let data = props.table.getClickRowIndex('accbooklist');
	
	let pk_org ;
	let pk_group;
	let deleteData1;
	if(data!=null){
		
		pk_org = data.record.pk_org.value;
		pk_group = data.record.pk_group.value;
	}
	// let cur_pk_group = pk_group;
	//打印需要的参数
	let nodekey = "user_list_print";
	let userdata = props.table.getAllTableData('accbooklist').rows;
	let rows = userdata.map(item => item.values);
	let values = rows.map(item => item.pk_accountingbook);
	let pks = values.map(item => item.value);
	let selectedRows = [];
        
	let rowsdata = props.table.getCheckedRows('accbooklist');
	rowsdata.map((ele) => {
		selectedRows.push(ele.data);
		ele.data.index = ele.index;
	});
	
	
	switch (id) {	
		case 'accAdd':
			// props.linkTo('/nccloud/resources/uap/rbac/user/edit/index.html', {
			// 	pagecode:'10120RESPADMIN_card',
			// 	status: 'add',
			// });
			props.pushTo('/acccard', {
				status: 'add',
				pagecode: '101001CB_accbookcard',
			});
			break;
		case 'liaAdd':
			
			props.pushTo('/liacard', {
				status: 'add',
				pagecode: '101001CB_libbookcard',
			});
			break;	
		case 'btnDel':

		
		
			if (selectedRows.length < 1) {
				toast({color: 'danger', content: this.state.json['10100ACB-000024']});/* 国际化处理： 请选择1条数据操作！*/
				return;
			}
			let accDelData = [];
			let liaDelData = [];
			for(let a=0;a<selectedRows.length;a++){
				if(selectedRows[a].values.bookproperties.value==1){
					accDelData.push(selectedRows[a]);
				}else if(selectedRows[a].values.bookproperties.value==2){
					liaDelData.push(selectedRows[a]);
				}
			}
			let accdeleteData = getDeleteData(accDelData);
			let liadeleteData = getDeleteData(liaDelData);
			let deleteDAta = getDeleteData(selectedRows);
			deleteData1=deleteDAta;
			
				promptBox({
					color:'warning',
					title: this.state.json['10100ACB-000046'],/* 国际化处理： 删除*/
					content: this.state.json['10100ACB-000028'],/* 国际化处理： 确定删除所选数据？*/
					beSureBtnClick: () => {
						//this.delRows(props,deleteData);
						ajax({
							url: '/nccloud/uapbd/accbook/accDelete.do',
							data: {accdeleteData:accdeleteData,liadeleteData:liadeleteData,deleteDAta:deleteDAta},
							success: (res) => {
								let {success, data} = res;
								if (success) {
									let indexArr=[];
									let pks = []
									deleteData1.gridModel.rows.forEach((val) => {
										indexArr.push(val.index);
										pks.push(val.values.pk_accountingbook.value);
									});
								
										props.table.deleteTableRowsByIndex("accbooklist", indexArr,true);
								
									
									//this.afterDel(pks);
									toast({color: 'success', title: this.state.json['10100ACB-000022']});/* 国际化处理： 删除成功！*/
								} else {
									toast({color: 'danger', title: this.state.json['10100ACB-000023']});/* 国际化处理： 删除失败！*/
								}
							}
						});

					}
				});
			

			
			break;
		case 'enable':
		

				if (selectedRows.length !== 1) {
					toast({color: 'danger', content: "请选择1条数据操作"});/* 国际化处理： 请选择1条数据操作！*/
					return;
				};
				if(selectedRows[0].values.bookproperties.value==1){
					let oriData = selectedRows.length>0?Utils.clone(selectedRows[0].values):[];
					let type='0';
					this.state.disableData = Utils.clone(oriData);
					this.state.checkData = Utils.clone(oriData);
					this.state.curDataValues = selectedRows[0].values;
					this.state.enableopr=type=='0'?true:false;
					this.setState(this.state,()=>{
			
						let msg = type=='0'?this.state.json['10100ACB-000034']:this.state.json['10100ACB-000035'];/* 国际化处理： 启用成功！,停用成功！*/
			
						let enabledata = {
							pageid: '101001CB_accbook',
							model: {
								areacode: 'accbooklist',
								pageinfo: {},
								rows: []
							},
							userjson:JSON.stringify({
								'enable' :type,
								'listShow':this.state.listShow?"0":"1"
							})
						};
						//添加原来修改前的数据
						enabledata.model.rows.push(selectedRows[0]);  
						enabledeletepre('/nccloud/uapbd/accbook/accpreEnable.do',enabledata).then(()=>{
							
								props.modal.show('enableaccModal', {
									title : this.state.enableopr?this.state.json['10100ACB-000042']:this.state.json['10100ACB-000043'],//标题/* 国际化处理： 财务核算账簿启用,财务核算账簿停用*/
									beSureBtnClick: () => {
										//添加停启用面板操作后的数据
										enabledata.model.rows.push({values:this.state.checkData});
										accenableAjax(enabledata,msg);
									},
									cancelBtnClick:()=>{
										props.modal.close('enableaccModal');
									}
								});
						})
					});
				}else if(selectedRows[0].values.bookproperties.value==2){
					
					let oriData = selectedRows.length>0?Utils.clone(selectedRows[0].values):[];
					let type='0';
					this.state.disableData = Utils.clone(oriData);
					this.state.checkData = Utils.clone(oriData);
					this.state.curDataValues = selectedRows[0].values;
					this.state.enableopr=type=='0'?true:false;
					this.setState(this.state,()=>{
			
						let msg = type=='0'?this.state.json['10100LB-000016']:this.state.json['10100LB-000017'];/* 国际化处理： 启用成功！,停用成功！*/
			
						let enabledata = {
							pageid: '101001CB_accbook',
							model: {
								areacode: 'accbooklist',
								pageinfo: {},
								rows: []
							},
							userjson:JSON.stringify({
								'enable' :type,
								'listShow':this.state.listShow?"0":"1"
							})
						};
						//添加原来修改前的数据
						enabledata.model.rows.push(selectedRows[0]);
						enabledeletepre('/nccloud/uapbd/accbook/validateliabook.do',enabledata).then(()=>{
			
							props.modal.show('enableliaModal', {
								title : this.state.enableopr?this.state.json['10100LB-000018']:this.state.json['10100LB-000019'],//标题/* 国际化处理： 财务核算账簿启用,财务核算账簿停用*/
								 beSureBtnClick: () => {
								// 	//添加停启用面板操作后的数据
								// 	if(selectedRows[0].values['liabilityenablestate'].value != this.state.checkData['liabilityenablestate'].value &&  (selectedRows[0].values.pk_factorchart==null||selectedRows[0].values.pk_factorchart.value==null||selectedRows[0].values.pk_factorchart.value=="")){
								// 		toast({content:this.state.json['10100LB-000040'],color:'warning'})/* 国际化处理： 要素表为空，不允许启用利润中心会计账簿*/
								// 	}else if(selectedRows[0].values['liabilityenablestate'].value != this.state.checkData['liabilityenablestate'].value&&(selectedRows[0].values['pk_liabilityperiod']==null||selectedRows[0].values['pk_liabilityperiod'].value==null||selectedRows[0].values['pk_liabilityperiod'].value=="")){
								// 		toast({content:this.state.json['10100LB-000041'],color:'warning'})/* 国际化处理： 选中启用的账簿对应的期间或科目表不能为空*/
								// 	}
								// 	else if(selectedRows[0].values['materialenablestate'].value != this.state.checkData['materialenablestate'].value&&(selectedRows[0].values['pk_materialperiod']==null||selectedRows[0].values['pk_materialperiod'].value==null||selectedRows[0].values['pk_materialperiod'].value=="")){
								// 		toast({content:this.state.json['10100LB-000042'],color:'warning'})/* 国际化处理： 选中启用的账簿对应的期间不能为空*/
								// 	}
								// 	else if(selectedRows[0].values['productcostenablestate'].value != this.state.checkData['productcostenablestate'].value&&(selectedRows[0].values['pk_productcostperiod']==null||selectedRows[0].values['pk_productcostperiod'].value==null||selectedRows[0].values['pk_productcostperiod'].value=="")){
								// 		toast({content:this.state.json['10100LB-000042'],color:'warning'})/* 国际化处理： 选中启用的账簿对应的期间不能为空*/
								// 	}else if(selectedRows[0].values['liabilityenablestate'].value == this.state.checkData['liabilityenablestate'].value&&selectedRows[0].values['materialenablestate'].value == this.state.checkData['materialenablestate'].value&&selectedRows[0].values['productcostenablestate'].value == this.state.checkData['productcostenablestate'].value){
								// 		toast({content:this.state.enableopr?this.state.json['10100LB-000043']:this.state.json['10100LB-000044'],color:'warning'})/* 国际化处理： 请选择需要启用的核算账簿！,请选择需要停用的核算账簿！*/
								// 	}
								// 	else{
										enabledata.model.rows.push({values:this.state.checkData});
										liaenableAjax(enabledata,msg);
								 	},
								// },
								cancelBtnClick:()=>{
									props.modal.close('enableliaModal');
								}
							});
						})
					});
				}
				
			
			break;
		case 'output'://输出
			if(pks!=null&&pks.length>0){
				let outputdata = {
					funcode:'10120USRM',
					appcode:'10120USRM',
					nodekey:nodekey,
					oids:pks,
					outputType: 'output'
				}
				output({
					url:'/nccloud/riaam/user/userlistprint.do',
					data:outputdata
				}); 
			}else{
				toast({content: this.state.json['1880000025-000028'], color: 'warning'});/* 国际化处理： 不存在输出的数据！*/
			}
			break;
		case 'export'://输出
			this.setState({},()=>{
				this.props.modal.show("exportFileModal")
			})
			break;

		default:
			break;
			
	}

	
	function getDeleteData(selectedRows){
        return {
            'pageid': '101001CB_accbook',
            'gridModel': {
                'pageinfo': {},
                'areacode': 'accbooklist',
                'rows': selectedRows
            }
        }
	}
	function enabledeletepre(url,enabledata){
        var p = new Promise(function(resolve, reject){
            ajax({
                url: url,
                data: enabledata,
                success: (res) => {
                    resolve(res);
                }
            });
        });
        return p;
	}
	
	function accenableAjax(enabledata,msg){
        ajax({
            url: '/nccloud/uapbd/accbook/accEnable.do',
            data: {enabledata:enabledata},
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if(res.data.status=='0'){
                        // if(this.state.listShow){
                            let oriRows = this.props.table.getAllTableData("accbooklist").rows;
                            oriRows[enabledata.model.rows[0].index] = res.data.rows[0];
                            this.props.table.setAllTableData("accbooklist",{rows:oriRows});
                            this.updateButtonStatus();
                        // }else{
                            // this.props.form.setAllFormValue({[formId]:{rows:res.data.rows}});
                            // this.setButtonVisible(res.data.rows,true);
                        // }
                        this.props.modal.close('enableModal');
                        toast({color: 'success', title: msg});
                    }else if(res.data.status=='1'){
                        toast({color: 'warning', content: res.data.msg});
                    }
                }
            }
        });
	}

	function liaenableAjax(enabledata,msg){
        ajax({
            url: '/nccloud/uapbd/accbook/liaEnable.do',
            data: enabledata,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if(res.data.status=='0'){
                        // if(this.state.listShow){
                            let oriRows = this.props.table.getAllTableData("accbooklist").rows;
                            oriRows[enabledata.model.rows[0].index] = res.data.rows[0];
                            this.props.table.setAllTableData("accbooklist",{rows:oriRows});
                            this.updateButtonStatus();
                        // }else{
                            // this.props.form.setAllFormValue({[formId]:{rows:res.data.rows}});
                            // this.setButtonVisible(res.data.rows,true);
                        // }
                        this.props.modal.close('enableModal');
                        toast({color: 'success', title: msg});
                    }else if(res.data.status=='1'){
                        toast({color: 'warning', content: res.data.msg});
                    }
                }
            }
        });
	}
	function  getvalecheckdatapk(type){
        let data = this.props.table.getCheckedRows("accbooklist");
        let params = {type:type,info:data.map((v)=>{
                let id = v.data.values[pk_accountingbook].value;
                let ts = v.data.values.ts.value;
                return {
                    id,ts
                }
            })};
        return params;
    }
	
		
}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS