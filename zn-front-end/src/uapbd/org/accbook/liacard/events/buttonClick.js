//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax,toast,base,print,output,getBusinessInfo,cardCache,promptBox } from 'nc-lightapp-front';
// import ShareInGroup from '../../shareingroup/index';
// import ShareJGroup from '../../sharejgroup/index';
// import UserMigrate from '../../usermigrate/index';
import UploadImg from '../../../../public/packages/uploadImg';
import Utils from '../../../../public/utils';
const { addCache,updateCache,getCurrentLastId,getNextId,deleteCacheById  } = cardCache;

export default function buttonClick(props, id) {
	let businessInfo = getBusinessInfo();
	let cur_pk_group = businessInfo.groupId;
	let data = props.form.getAllFormValue("liabilitybook_card");
	let status = props.getUrlParam('status');
	let pk_accountingbook = data.rows[0].values.pk_accountingbook.value;
	//let cuserid = data.rows[0].values.cuserid.value;
	// let user_code = data.rows[0].values.user_code.value;
	// let user_name = data.rows[0].values.user_name.value;
	let pk_org = data.rows[0].values.pk_org.value;
	//let pk_group = data.rows[0].values.pk_group.value;
	// let cur_pk_group = pk_group;
	switch (id) {
		case 'add':
			let adddata = { status: 'add'};
			let that = this;
			ajax({
				data:adddata,
				url: '/nccloud/riaam/user/usercardqry.do',
				success: function (res) {
					let { success, data } = res;
					if (res.success) {
						that.props.form.setAllFormValue({'user':data.user.user});
						that.props.form.setFormStatus('user','add');
						that.props.table.setAllTableData('shareorglist', data.shareorglist&&data.shareorglist.shareorglist?data.shareorglist.shareorglist:{rows:[]});
						that.props.table.setAllTableData('userGroup', data.userGroup&&data.userGroup.userGroup?data.userGroup.userGroup:{rows:[]});
						that.props.button.setButtonsVisible({
							add:false,
							edit:false,
							del:false,
							save:true,
							saveandadd:true,
							cancel:true,
							copy:false,
							auxiliary: false,
							print_third:false,
							disrole:false,
							resetuserpsw:false,
							qmpicture:false,
							lock:false,
							unLock:false,
							enable:false,
							disable:false
						});
						that.props.setUrlParam({status:'add'})
						that.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
					}
				},
				error: function (res) {
					toast({content:res.message,color:'danger'});
				}
			});
			break;
		case 'liaedit':
			
				if(pk_accountingbook!=null&&""!=pk_accountingbook){
					props.form.setFormStatus('liabilitybook_card', 'edit');
					props.setUrlParam({status:'edit'})
					props.button.setButtonsVisible({
						add:false,
						edit:false,
						del:false,
						save:true,
						saveandadd:false,
						cancel:true,
						auxiliary: false,
						print_third:false,
						disrole:false,
						resetuserpsw:false,
						qmpicture:false,
						copy:false,
						lock:false,
						unLock:false,
						enable:false,
						disable:false
					});
					props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
				}else{
					toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
				}
			
			break;
		case 'liadel':
			
			if(props.form.isCheckNow('liabilitybook_card')){
				let that = this;
				let data = props.form.getAllFormValue("liabilitybook_card");
				data.areacode= 'liabilitybook_card';
				let padata = {
                    'model':data,
                    'pageid':'101001CB_libbookcard',
					
                }
					promptBox({
						color:'warning',
						title: this.state.json['1880000025-000002'],/* 国际化处理： 确认删除*/
						content:this.state.json['1880000025-000003'],/* 国际化处理： 是否要删除所选数据？*/
						beSureBtnClick: () => {
							let that = this;
							
							ajax({
								url: '/nccloud/uapbd/accbook/liaSave.do',
								data:{
									padata:padata,
									liapk:data.rows[0].values.pk_accountingbook.value,
									pk_accountingbook:data.rows[0].values.pk_accountingbook.value
								},
								success: function (res) {
									let { success, data } = res;
									if (res.success) {
										if(data.error!=null){
											that.setState({
												backbtnstatus: ''
											})
											toast({content:data.error,color:'danger'});
										}else{
											that.props.form.setAllFormValue({'liabilitybook_card':data.liabilitybook_card});
											if('add'==that.props.getUrlParam('status')){
												data.liabilitybook_card.rows[0].values.showflag = {value:res.data.isShow};
												addCache(data.liabilitybook_card.rows[0].values.pk_accountingbook.value,data.liabilitybook_card,'liabilitybook_card','uapbd.org.accbook.liacache',data.liabilitybook_card.rows[0].values);
												that.props.addUrlParam({id:data.liabilitybook_card.rows[0].values.pk_accountingbook.value,status:'browse'})
											}else if('edit'==that.props.getUrlParam('status')){
												updateCache('pk_accountingbook',data.liabilitybook_card.rows[0].values.pk_accountingbook.value,data.user.user,'liabilitybook_card','uapbd.org.accbook.liacache',data.liabilitybook_card.rows[0].values);
												that.props.setUrlParam({status:'browse'})
											}
											that.props.form.setFormStatus('liabilitybook_card', 'browse');
											that.props.button.setButtonsVisible({
												add:true,
												edit:true,
												del:true,
												save:false,
												saveandadd:false,
												cancel:false,
												auxiliary: true,
												print:true,
												disrole:true,
												resetuserpsw:true,
												qmpicture:true,
												copy:true
											});
											// that.props.button.setButtonVisible('enable','3'===data.user.user.rows[0].values.enablestate.value?true:false);
											// that.props.button.setButtonVisible('disable','3'===data.user.user.rows[0].values.enablestate.value?false:true);
											// that.props.button.setButtonVisible('unLock',data.user.user.rows[0].values.islocked.value?true:false);
											// that.props.button.setButtonVisible('lock',data.user.user.rows[0].values.islocked.value?false:true);
											// that.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
											that.setState({
												backbtnstatus: ''
											})
											toast({color:'success'});
										}
									}
								},
								error:function(res){
									toast({content:res.message,color:'danger'});
								}
							});
						}
					})
				}else{
					toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
				}
			
			break;
		case 'copy':
			if(cuserid!=null&&""!=cuserid){
				setTimeout(() => {
					props.table.setAllTableData('userGroup', {rows: []});
					props.table.setAllTableData('shareorglist', {rows: []});
				},0)
				this.setState({
					iscopy:true
				})
				props.button.setButtonsVisible({
					// back:false,
					add:false,
					edit:false,
					del:false,
					save:true,
					saveandadd:true,
					cancel:true,
					auxiliary: false,
					print_third:false,
					disrole:false,
					resetuserpsw:false,
					qmpicture:false,
					copy:false,
					lock:false,
					unLock:false,
					enable:false,
					disable:false
				});
				props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
				props.form.setFormItemsValue('user',{
					'user_password':{value:null},
					'cuserid':{value:null,display:null},
					'creator':{value:null,display:null},
					'creationtime':{value:null},
					'modifier':{value:null,display:null},
					'modifiedtime':{value:null},
					'disabledate':{value:null},
					'enablestate':{value:'2',display:this.state.json['1880000025-000004']},/* 国际化处理： 已启用*/
				});
				if(cur_pk_group!=pk_group){
					props.form.setFormItemsValue('user',{
						'pk_org':{value:null,display:null},
						'pk_group':{value:null,display:null},
						'pk_usergroupforcreate':{value:null,display:null},
					})
				}
				props.form.setFormStatus('user', 'add');
			}else{
				toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
			}			
			break;
		case 'liasave':
			if(props.form.isCheckNow('liabilitybook_card')){
				let that = this;
				let data = props.form.getAllFormValue("liabilitybook_card");
				data.areacode= 'liabilitybook_card';
				let padata = {
                    'model':data,
                    'pageid':'101001CB_libbookcard',
					
                }
				ajax({
					data:{
						padata:padata,
						liapk:data.rows[0].values.pk_accountingbook.value,
						pk_accountingbook:data.rows[0].values.pk_accountingbook.value
					},
					url: '/nccloud/uapbd/accbook/liaSave.do',
					success: function (res) {
						let { success, data } = res;
						if (res.success) {
							if(data.error!=null){
								that.setState({
									backbtnstatus: ''
								})
								toast({content:data.error,color:'danger'});
							}else{
								that.props.form.setAllFormValue({'liabilitybook_card':data.liabilitybook_card});
								if('add'==that.props.getUrlParam('status')){
									data.liabilitybook_card.rows[0].values.showflag = {value:res.data.isShow};
									addCache(data.liabilitybook_card.rows[0].values.pk_accountingbook.value,data.liabilitybook_card,'liabilitybook_card','uapbd.org.accbook.liacache',data.liabilitybook_card.rows[0].values);
									that.props.addUrlParam({id:data.liabilitybook_card.rows[0].values.pk_accountingbook.value,status:'browse'})
								}else if('edit'==that.props.getUrlParam('status')){
									updateCache('pk_accountingbook',data.liabilitybook_card.rows[0].values.pk_accountingbook.value,data.liabilitybook_card,'liabilitybook_card','uapbd.org.accbook.liacache',data.liabilitybook_card.rows[0].values);
									that.props.setUrlParam({status:'browse'})
								}
								that.props.form.setFormStatus('liabilitybook_card', 'browse');
								that.props.button.setButtonsVisible({
									add:true,
									edit:true,
									del:true,
									save:false,
									saveandadd:false,
									cancel:false,
									auxiliary: true,
									print:true,
									disrole:true,
									resetuserpsw:true,
									qmpicture:true,
									copy:true
								});
								// that.props.button.setButtonVisible('enable','3'===data.user.user.rows[0].values.enablestate.value?true:false);
								// that.props.button.setButtonVisible('disable','3'===data.user.user.rows[0].values.enablestate.value?false:true);
								// that.props.button.setButtonVisible('unLock',data.user.user.rows[0].values.islocked.value?true:false);
								// that.props.button.setButtonVisible('lock',data.user.user.rows[0].values.islocked.value?false:true);
								// that.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
								that.setState({
									backbtnstatus: ''
								})
								toast({color:'success'});
							}
						}
					},
					error:function(res){
						toast({content:res.message,color:'danger'});
					}
				});
			}	
			break;
		case 'saveandadd':
			if(props.form.isCheckNow('user')){
				let data1 = props.form.getAllFormValue("user");
				let that = this;
				ajax({
					data:{data1},
					url: '/nccloud/riaam/user/saveandadd.do',
					success: function (res) {
						let { success, data } = res;
						if (success) {
							if(data.error!=null){
								toast({content:data.error,color:'danger'});
							}else{
								that.props.form.setAllFormValue({'user':data.user.user});
								data.user.user.rows[0].values.showflag = {value:res.data.isShow};
								addCache(data.user.user.rows[0].values.cuserid.value,data1,'user','uap.rbac.user.usercache',data1.rows[0].values);
								that.props.form.setFormItemsValue('user',{
									'cuserid':{value:null,display:null}
								});
								that.props.form.setFormStatus('user', 'add');
								that.props.table.setAllTableData('userGroup',{rows:[]});
								that.props.table.setAllTableData('shareorglist',{rows:[]})
								toast({color:'success'});
							}
						}
					},
					error:function(res){
						toast({content:res.message,color:'danger'});
					}
				});
			}
			break;
		case 'liacancel':
			promptBox({
				color:'warning',
				title: this.state.json['1880000025-000005'],/* 国际化处理： 取消*/
				content:this.state.json['1880000025-000006'],/* 国际化处理： 确定要取消吗*/
				beSureBtnClick:() => {
					let that = this;
					that.setState({
						backbtnstatus: ''
					})
					if(pk_accountingbook!=null){
						let data = { pk: pk_accountingbook, pageid: '101001CB_liabookcard' ,bookproperties :'2'};
						
						ajax({
							data:data,
							url: '/nccloud/uapbd/accbook/queryBypk.do',
							success: function (res) {
								let { success, data } = res;
								if (res.success) {
									if(res.data.msg!=null){
										toast({content:res.data.msg,color:'danger'});
										return;
									}
									that.props.form.setAllFormValue({ ["liabilitybook_card"]: res.data.form.liabilitybook_card});
									
									// that.props.button.setButtonDisabled('disrole',data.isShow);
									// that.props.table.setAllTableData('shareorglist', data.shareorglist&&data.shareorglist.shareorglist?data.shareorglist.shareorglist:{rows:[]});
									// that.props.table.setAllTableData('userGroup', data.userGroup&&data.userGroup.userGroup?data.userGroup.userGroup:{rows:[]});
									// that.props.button.setButtonVisible('enable','3'===data.user.user.rows[0].values.enablestate.value?true:false);
									// that.props.button.setButtonVisible('disable','3'===data.user.user.rows[0].values.enablestate.value?false:true);
									// that.props.button.setButtonVisible('unLock',data.user.user.rows[0].values.islocked.value?true:false);
									// that.props.button.setButtonVisible('lock',data.user.user.rows[0].values.islocked.value?false:true);
								}
							},
							error: function (res) {
								toast({content:res.message,color:'danger'});
							}
						});
					}
					that.props.form.cancel('liabilitybook_card');
					that.props.form.setFormStatus('liabilitybook_card', 'browse');
					// that.props.button.setButtonVisible({
					// 	add:true,
					// 	edit:true,
					// 	del:true,
					// 	save:false,
					// 	saveandadd:false,
					// 	cancel:false,
					// 	auxiliary: true,
					// 	print:true,
					// 	disrole:true,
					// 	resetuserpsw:true,
					// 	qmpicture:true,
					// 	copy:true
					// });
					that.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);	
				}
			})
			break;
		case 'disrole':
			if(!this.state.istoprocessuser){
				props.openTo('/nccloud/resources/uap/rbac/role/main/',{
					appcode:'10120YHQXFP',
					pagecode:'10120USRPERM_list',
					cuserid:cuserid,
					user_name:user_name
				});
			}else{
				toast({content:this.state.json['1880000025-000007'],color:'warning'});/* 国际化处理： 待处理用户不能分配权限！*/
			}
			break;
		case 'resetuserpsw':
			if(cur_pk_group!=pk_group){
				toast({content:this.state.json['1880000025-000000'],color:'warning'});/* 国际化处理： 共享用户，不可被修改*/
			}else{
				if(cuserid!=null&&""!=cuserid){
					promptBox({
						color:'warning',
						title: this.state.json['1880000025-000008'],/* 国际化处理： 密码重置*/
						content:this.state.json['1880000025-000009'],/* 国际化处理： 该操作会重置已选用户密码，确定执行此操作吗？*/
						beSureBtnClick: () => {
							var that = this;
							let data = {cuserid:cuserid}
							ajax({
								data:data,
								url: '/nccloud/riaam/user/resetpsw.do',
								success: function (res) {
									let { success, data } = res;
									if (success) {
										// props.modal.show('newpsw',{
										// 	title:that.state.json['1880000025-000008'],/* 国际化处理： 密码重置*/
										// 	content:data,
										// 	rightBtnName : that.state.json['1880000025-000010'],/* 国际化处理： 关闭*/
										// 	leftBtnName : that.state.json['1880000025-000011'],/* 国际化处理： 复制*/
										// 	beSureBtnClick: () => {
										// 		if(data=="受系统参数控制，不可以直接显示密码，请到邮件或消息查收")
										// 		return;
										// 		Utils.copyToClipboard(data.split(':')[1])
										// 	}
										// });
										promptBox({
											color:'success',
											title: that.state.json['1880000025-000008'],/* 国际化处理： 密码重置*/
											content:data,
											cancelBtnName : that.state.json['1880000025-000010'],/* 国际化处理： 关闭*/
											beSureBtnName : that.state.json['1880000025-000011'],/* 国际化处理： 复制*/
											beSureBtnClick: () => {
												if(data=="受系统参数控制，不可以直接显示密码，请到邮件或消息查收")
												return;
												Utils.copyToClipboard(data.split(':')[1])
											}
										})
										
									}
								},
								error: function (res) {
									toast({content:res.message,color:'danger'});
								}
							})
						}
					});	
				}else{
					toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
				}
			}
			break;
		case 'groupinnershare':
			if(cuserid!=null&&""!=cuserid){
				props.modal.show('groupinnershare', {
					title: this.state.json['1880000025-000012'],/* 国际化处理： 集团内共享*/
					//content: <ShareInGroup cuserid={cuserid} pk_org={pk_org}  getreforg={this.getreforg.bind(this)} getusergroup={this.getusergroup.bind(this)}/>,
					beSureBtnClick: () => {
						let that = this;
						let data ={
							cuserid : cuserid,
							rightdata : that.state.user_usergroup,
							pk_org : that.state.reforg
						}
						ajax({
							data:data,
							url: '/nccloud/riaam/user/shareinnersave.do',
							success: function (res) {
								let { success, data } = res;
								if (success) {
									that.props.table.setAllTableData('userGroup', data.usergroup&&data.usergroup['userGroup']?data.usergroup['userGroup']:{rows:[]});
									toast({color:'success'});
								}
							},
							error: function (res) {
								toast({content:res.message,color:'danger'});
							}
						})
					}
				});
			}else{
				toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
			}
			break;
		case 'groupjshare':
			if(cuserid!=null&&""!=cuserid){
				let that = this;
				props.modal.show('groupjshare', {
					title: this.state.json['1880000025-000013'],/* 国际化处理： 集团间共享*/
					//content: <ShareJGroup cuserid={cuserid} getgroup={that.getgroup.bind(this)} />,
					beSureBtnClick: () => {						
						let data ={
							cuserid : cuserid,
							rightdata : that.state.user_group,
						}
						ajax({
							data:data,
							url: '/nccloud/riaam/user/savesharegrp.do',
							success: function (res) {
								let { success, data } = res;
								if (success) {
									toast({color:'success'});
									that.props.table.setAllTableData('shareorglist', data.shareorglist&&data.shareorglist['shareorglist']?data.shareorglist['shareorglist']:{rows:[]});
								}
							},
							error: function (res) {
								toast({content:res.message,color:'danger'});
							}
						})
					}
				});
			}else{
				toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
			}
			break;
		case 'usermigrate':
			if(cur_pk_group!=pk_group){
				toast({content:this.state.json['1880000025-000000'],color:'warning'});/* 国际化处理： 共享用户，不可被修改*/
			}else{
				if(cuserid!=null&&""!=cuserid){
					props.modal.show('usermigrate', {
						title: this.state.json['1880000025-000014'],/* 国际化处理： 用户调动*/
						//content: <UserMigrate getusermigrate={this.getusermigrate.bind(this)}/>,
						beSureBtnClick: () => {
							props.modal.show('modal',{
								title:this.state.json['1880000025-000015'],/* 国际化处理： 确认移动*/
								content:<div className="nc-theme-common-font-c">{this.state.json['1880000025-000016']}</div>,/* 国际化处理： 调动后，是否将该用户的所有权限（包括被委派角色、委托和受托权限、特殊权限以及共享集团等）全部被取消？*/								
								leftBtnName:this.state.json['1880000025-000017'],/* 国际化处理： 是*/
								rightBtnName:this.state.json['1880000025-000018'],/* 国际化处理： 否*/
								beSureBtnClick:()=>{
									let that = this;
									let data = {
										key:that.state.usermigrate.key,
										value:that.state.usermigrate.value,
										cuserid:cuserid
									}
									if(data.key!=null&&data.value!=null){
										ajax({
											data:data,
											url: '/nccloud/riaam/user/usermigrate.do',
											success: function (res) {
												toast({color:'success'});
											},
											error: function (res) {
												toast({content:res.message,color:'danger'});
											}
										})
									}else if(data.key=="outer"){
										toast({content:this.state.json['1880000025-000019'],color:'warning'});/* 国际化处理： 请选择将调动的集团*/
									}else {
										toast({content:this.state.json['1880000025-000020'],color:'warning'});/* 国际化处理： 请选择将调动的用户组*/
									}
								},
								cancelBtnClick:()=>{
									let that = this;
									if(that.state.usermigrate.key=="inner"){
										let data = {
											key:that.state.usermigrate.key,
											value:that.state.usermigrate.value,
											cuserid:cuserid
										}
										if(data.key!=null&&data.value!=null){
											ajax({
												data:data,
												url: '/nccloud/riaam/user/usermigrate.do',
												success: function (res) {
													toast({color:'success'});
												},
												error: function (res) {
													toast({content:res.message,color:'danger'});
												}
											})
										}else if(data.key=="outer"){
											toast({content:this.state.json['1880000025-000019'],color:'warning'});/* 国际化处理： 请选择将调动的集团*/
										}else {
											toast({content:this.state.json['1880000025-000020'],color:'warning'});/* 国际化处理： 请选择将调动的用户组*/
										}
									}
								}
							})
							
						}
					});
				}else{
					toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
				}
			}
			break;		
		case 'print_third':
			if(cuserid!=null&&""!=cuserid){
				print(
					'pdf',
					'/nccloud/riaam/user/userlistprint.do',
					{
						funcode:'10120USRM',
						appcode:'10120USRM',
						nodekey:'user_card_print',
						oids:[cuserid],
					}
				)
			}else{
				toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
			}
			break;
		case 'preview':
			if(cuserid!=null&&""!=cuserid){
				print(
					'pdf',
					'/nccloud/riaam/user/userlistprint.do',
					{
						funcode:'10120USRM',
						appcode:'10120USRM',
						nodekey:'user_card_print',
						oids:cuserid,
					},
					false
				) 
			}else{
				toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
			}
			break;
		case 'output'://输出
			if(cuserid!=null&&""!=cuserid){
				let outputdata = {
					funcode:'10120USRM',
					appcode:'10120USRM',
					nodekey:'user_card_print',
					oids:[cuserid],
					outputType: 'output'
				}
				output({
					url:'/nccloud/riaam/user/userlistprint.do',
					data:outputdata,
				});
			}else{
				toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
			}
			break;
		case 'lock':
			if(cur_pk_group==pk_group){
				if(cuserid==null){
					toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
				}else{
					let that = this;
					ajax({
						data:{
							cuserid:cuserid,
							isLock:true
						},
						url: '/nccloud/riaam/user/saveislock.do',
						success: function (res) {
							props.form.setFormItemsValue('user',{'islocked':{value:true,display:that.state.json['1880000025-000017']}});/* 国际化处理： 是*/
							let data = props.form.getAllFormValue("user");
							props.button.setButtonVisible('unLock',true);
							props.button.setButtonVisible('lock',false)
							updateCache('cuserid',data.rows[0].values.cuserid.value,data,'user','uap.rbac.user.usercache',data.rows[0].values);
							toast({color:'success'});
						},
						error: function (res) {
							toast({content:res.message,color:'danger'});
						}
					})
				}
			}else{
				toast({content:this.state.json['1880000025-000000'],color:'warning'});/* 国际化处理： 共享用户，不可被修改*/
			}
			break;
		case 'unLock':
			if(cur_pk_group==pk_group){
				if(cuserid==null){
					toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
				}else{
					let that = this;
					ajax({
						data:{
							cuserid:cuserid,
							isLock:false
						},
						url: '/nccloud/riaam/user/saveislock.do',
						success: function (res) {
							props.form.setFormItemsValue('user',{'islocked':{value:false,display:that.state.json['1880000025-000018']}});/* 国际化处理： 否*/
							let data = props.form.getAllFormValue("user");
							props.button.setButtonVisible('unLock',false);
							props.button.setButtonVisible('lock',true)
							updateCache('cuserid',data.rows[0].values.cuserid.value,data,'user','uap.rbac.user.usercache',data.rows[0].values);
							toast({color:'success'});
						},
						error: function (res) {
							toast({content:res.message,color:'danger'});
						}
					})
				}
			}else{
				toast({content:this.state.json['1880000025-000000'],color:'warning'});/* 国际化处理： 共享用户，不可被修改*/
			}
			break;
		case 'enable':
			if(cur_pk_group==pk_group){
				if(cuserid==null){
					toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
				}else{
					let that = this;
					ajax({
						data:{
							cuserid:cuserid,
							enablestate:'3'
						},
						url: '/nccloud/riaam/user/enableuser.do',
						success: function (res) {
							props.form.setFormItemsValue('user',{'enablestate':{value:'2',display:that.state.json['1880000025-000004']}});/* 国际化处理： 已启用*/
							let data = props.form.getAllFormValue("user");
							props.button.setButtonVisible('disable',true);
							props.button.setButtonVisible('enable',false)
							updateCache('cuserid',data.rows[0].values.cuserid.value,data,'user','uap.rbac.user.usercache',data.rows[0].values);
							toast({color:'success'});
						},
						error: function (res) {
							toast({content:res.message,color:'danger'});
						}
					})
				}
			}else{
				toast({content:this.state.json['1880000025-000000'],color:'warning'});/* 国际化处理： 共享用户，不可被修改*/
			}
			break;
		case 'disable':
			if(cur_pk_group==pk_group){
				if(cuserid==null){
					toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
				}else{
					let that = this;
					ajax({
						data:{
							cuserid:cuserid,
							enablestate:'2'
						},
						url: '/nccloud/riaam/user/enableuser.do',
						success: function (res) {
							props.form.setFormItemsValue('user',{'enablestate':{value:'3',display:that.state.json['1880000025-000021']}});/* 国际化处理： 已停用*/
							let data = props.form.getAllFormValue("user");
							updateCache('cuserid',data.rows[0].values.cuserid.value,data,'user','uap.rbac.user.usercache',data.rows[0].values);
							props.button.setButtonVisible('disable',false);
							props.button.setButtonVisible('enable',true);
							toast({color:'success'});
						},
						error: function (res) {
							toast({content:res.message,color:'danger'});
						}
					})
				}
			}else{
				toast({content:this.state.json['1880000025-000000'],color:'warning'});/* 国际化处理： 共享用户，不可被修改*/
			}
		default:
			break;
	}
	
}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS