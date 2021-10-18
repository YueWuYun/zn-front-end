/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax } from 'nc-lightapp-front';
import {UFOConst} from   './UFOConstant.js';
let appcode = UFOConst.appcode;

/**
 * UFO 函数取数函数Modal
 */
class IUFOModal extends Component {
	constructor(props) {
		super(props);
        debugger;
		let { modalId, beSureBtnClickCallBack,beCancelBtnClickCallBack, funcType,isShow ,funcStr} = this.props;
	    
		this.pagecode='';
		this.formId='';
		if(funcType==UFOConst.cmprye){
			this.pagecode = UFOConst.cmprye_pg,
			this.formId=UFOConst.cmprye_form
		}
		if(funcType==UFOConst.cmprfs){
			this.pagecode = UFOConst.cmprfs_pg,
			this.formId=UFOConst.cmprfs_form
		}
		this.modalId = modalId||UFOConst.modalId; //模态框id
		this.beSureBtnClickCallBack = beSureBtnClickCallBack; //绑定确定回调事件
		this.beCancelBtnClickCallBack = beCancelBtnClickCallBack; //绑定取消回调事件
		this.funcStr = funcStr;//初始化界面数据 (注 : 暂不支持仅保留数据接收)
		this.initData(); //初始化数据
		this.funcType =funcType||UFOConst.cmprye; //默认加载 函数类型
		this.isShow = isShow || false;//是否展示 (默认不显示)
		this.pk_org='';
		this.pk_currtype='';
		this.OpponentUnit='';

		this.initTemplate.call(this,this.pagecode);
	}
	//加载模板
	initTemplate = (page) => {
			this.props.createUIDom(
			{
				pagecode: page,
				appcode: appcode
			},
			(data) => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						meta =this.modifierMeta( meta);
						this.props.meta.setMeta(meta,()=>{
							if (this.isShow) {
								//打开模态框
								this.showIUFOModal();
							} else{
								this.props.modal.close(this.modalId);
							}
						});
					}
				}
			}
		);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.isShow != nextProps.isShow) {
			this.isShow = nextProps.isShow;//更新模态框展示状态
			this.funcType = nextProps.funcType;//更新模态框类型
			if(this.funcType==UFOConst.cmprye){
				this.pagecode = UFOConst.cmprye_pg,
				this.formId=UFOConst.cmprye_form
			}
			if(this.funcType==UFOConst.cmprfs){
				this.pagecode = UFOConst.cmprfs_pg,
				this.formId=UFOConst.cmprfs_form
			}
			this.initTemplate.call(this,this.pagecode);
			// if (this.isShow) {
			// 	//打开模态框
			// 	this.showIUFOModal();
			// } else {
			// 	//关闭模态框
			// 	this.props.modal.close(this.modalId);
			// }
		}
	}
	/**
	 * 初始化数据
	 */
	initData = () => {
			//初始化ufo数据
			if(this.funcType==UFOConst.cmprye){
				this.UfoQueryVO = {
					searchItem:[
					   {code:'cashtype',name:'资金形态',value:'',position:'first'},
					   {code:'mon_account',name:'现金账户',value:'',position:'first'},
					   {code:'bankaccount',name:'银行账户',value:'',position:'first'}
					],
					otherItem:[
					   {code:'pk_busiorg',name:'业务单元',value:'',position:'middle'},
					   {code:'flag',name:'项目',value:'',position:'middle'},
					   {code:'pk_currtype',name:'发生币种',value:'',position:'middle'},
					   {code:'bank_currtype',name:'返回币种',value:'0',position:'middle'},
					   {code:'date',name:'日期',value:'',position:'last'}
					]
			   };
			   	//设置返回币种默认值
			this.props.form.setFormItemsValue(this.formId, {
				['bank_currtype']: {
					value: '0',
					display: '本币'
				}
			});
				
			}
			if(this.funcType==UFOConst.cmprfs){
                		//初始化ufo数据
		this.UfoQueryVO = {
			searchItem:[
			   {code:'source_flag',name:'业务系统',value:'',position:'first'},
			   {code:'trade_type',name:'交易类型',value:'',position:'first'},
			   {code:'trade_kind',name:'交易种类',value:'',position:'first'},
			   {code:'receivedorpay',name:'收付属性',value:'',position:'first'},
			   {code:'cash_type',name:'资金形态',value:'',position:'first'},
			   {code:'bank_type',name:'银行类别',value:'',position:'first'},
			   {code:'bankoppaccount',name:'银行档案',value:'',position:'first'},
			   {code:'cashaccount',name:'现金账户',value:'',position:'first'},
			   {code:'bankaccount',name:'银行账户',value:'',position:'first'},	
			   {code:'note_type',name:'票据类型',value:'',position:'first'},
			   {code:'pk_balatype',name:'结算方式',value:'',position:'first'},
			   {code:'Opponent_type',name:'对方类型',value:'',position:'first'},
			   {code:'Opponent_unit',name:'对方单位',value:'',position:'first'},
			   {code:'Opponent_account',name:'对方账户',value:'',position:'first'},
			   {code:'pk_customer',name:'客户',value:'',position:'first'},
			   {code:'pk_supplier',name:'供应商',value:'',position:'first'},
			   {code:'pk_dept',name:'部门',value:'',position:'first'},
			   {code:'pk_busiman',name:'人员',value:'',position:'first'},
			   {code:'pk_recproject',name:'收支项目',value:'',position:'first'},
			   {code:'pk_materiel',name:'物料',value:'',position:'first'},
			   {code:'pk_project',name:'项目',value:'',position:'first'},
			   {code:'pk_jobobjpha',name:'项目任务',value:'',position:'first'},
			   {code:'cash_item',name:'现金流量项目',value:'',position:'first'},
			   {code:'account_type',name:'账户类型',value:'',position:'first'}
			],
			otherItem:[
			   {code:'pk_busiorg',name:'业务单元',value:'',position:'middle'},
			   {code:'flag',name:'项目',value:'',position:'middle'},
			   {code:'pk_currtype',name:'发生币种',value:'',position:'middle'},
			   {code:'back_currtype',name:'返回币种',value:'0',position:'middle'},
			   {code:'start_date',name:'开始日期',value:'',position:'middle'},
			   {code:'end_date',name:'结束日期',value:'',position:'middle'},
			   {code:'direction',name:'方向',value:'',position:'middle'},
			   {code:'money_down',name:'金额下限',value:'',position:'middle'},
			   {code:'money_up',name:'金额上限',value:'',position:'last'},
			]
	   };
   
	   	   	//设置返回币种默认值
			this.props.form.setFormItemsValue(this.formId, {
				['back_currtype']: {
					value: '0',
					display: '本币'
				}
			});
	    
			}
		



	};



	closeModalClick = () => {
		//关闭模态框
		typeof this.beCancelBtnClickCallBack === 'function' && this.beCancelBtnClickCallBack();
	};

	cancelBtnClick = () => {
		//关闭模态框
		typeof this.beCancelBtnClickCallBack === 'function' && this.beCancelBtnClickCallBack();
	};

	modifierMeta = (meta) => {
        
		if(this.funcType==UFOConst.cmprye){
			 //现金账户
		meta[this.formId].items.map((item) => {
			if (item.attrcode == 'mon_account' ) {
				item.queryCondition = () => {
					return {
						pk_org: this.pk_org,
						pk_currtype:this.pk_currtype
					};
				};
			}
		});

		  //现金账户
		  meta[this.formId].items.map((item) => {
			if (item.attrcode == 'bankaccount' ) {
				item.queryCondition = () => {
					return {
						pk_org: this.pk_org,
						pk_currtype:this.pk_currtype
					};
				};
			}
		});

		}
		if(this.funcType==UFOConst.cmprfs){
//    //现金账户
meta[this.formId].items.map((item) => {
	if (item.attrcode == 'cashaccount' ) {
		item.queryCondition = () => {
			return {
				pk_org: this.pk_org,
				pk_currtype:this.pk_currtype
			};
		};
	}
});
// 	  //现金账户
  meta[this.formId].items.map((item) => {
	if (item.attrcode == 'bankaccount' ) {
		item.queryCondition = () => {
			return {
				pk_org: this.pk_org,
				pk_currtype:this.pk_currtype
			};
		};
	}
});

 //结算方式
 meta[this.formId].items.map((item) => {
	if (item.attrcode == 'pk_balatype' ) {
		item.queryCondition = () => {
			return {
				pk_org: this.pk_org
				
			};
		};
	}
});
//客户
meta[this.formId].items.map((item) => {
	if (item.attrcode == 'pk_customer' ) {
		item.queryCondition = () => {
			return {
				pk_org: this.pk_org
				
			};
		};
	}
});
	//供应商
	meta[this.formId].items.map((item) => {
		if (item.attrcode == 'pk_supplier' ) {
			item.queryCondition = () => {
				return {
					pk_org: this.pk_org
					
				};
			};
		}
	});
	//部门
				meta[this.formId].items.map((item) => {
					if (item.attrcode == 'pk_dept' ) {
						item.queryCondition = () => {
							return {
								pk_org: this.pk_org
								
							};
						};
					}
				});
	//人员
	meta[this.formId].items.map((item) => {
		if (item.attrcode == 'pk_busiman' ) {
			item.queryCondition = () => {
				return {
					pk_org: this.pk_org
					
				};
			};
		}
	});
			//对方账户
			meta[this.formId].items.map((item) => {
				if (item.attrcode == 'Opponent_account' ) {
					item.queryCondition = () => {
						return {
							pk_org: this.OpponentUnit
							
						};
					};
				}
			});


		}
      	
		return meta;
	};

	/**
	 * @param key 编辑字段
	 * @param value 编辑后的值
	 */
	afterEvent = (props, moduleId, key, value, oldValue,i) => {
	
		// 业务单元和组织 修改 将 pk全局缓存进行参照过滤 code 用于拼接公式 那么用于显示 
		if(this.funcType==UFOConst.cmprye){
			if (key == 'pk_busiorg') {
				if(value){
				 this.pk_org=i.refpk;
				}
		   }
		   if (key == 'pk_currtype') {
			   if(value){
				this.pk_currtype=i.refpk;
			   }
		  }
		   //公式用code 拼接 参照出来为PK
		   if (key == 'mon_account'||key=='bankaccount'||key=='pk_currtype'||key == 'pk_busiorg') {
				if(value){
				   this.props.form.setFormItemsValue(this.formId, {
					   [key]: {
						   value: i.refcode,
						   display: i.refname
					   }
				   });
				}
		   }

		}
	
	// 业务单元和组织 修改 将 pk全局缓存进行参照过滤 code 用于拼接公式 那么用于显示 
	if(this.funcType==UFOConst.cmprfs){
		if (key == 'pk_busiorg') {
			if(value){
			 this.pk_org=i.refpk;
			}
	   }
	   if (key == 'pk_currtype') {
		   if(value){
			this.pk_currtype=i.refpk;
		   }
	  }
	  if (key == 'Opponent_unit') {
	   if(value){
		this.OpponentUnit=i.refpk;
	   }
	}	   
	   //公式用code 拼接 参照出来为PK 将pk赋值为code
	   if (key == 'mon_account' || key=='bankaccount' || key=='pk_currtype' || key == 'pk_busiorg'|| key=='trade_type'||
		   key== 'bank_type' || key=='bankoppaccount' || key=='cashaccount' || key=='note_type' || key=='pk_balatype' ||
		   key== 'Opponent_unit' || key=='Opponent_account' || key=='pk_customer' || key=='pk_supplier' || key=='pk_dept'||
		   key== 'pk_recproject' || key=='pk_materiel' || key=='pk_project' || key=='pk_jobobjpha' || key=='cash_item'	||
		   key== 'pk_busiman'
		   ) {
			if(value){
			   this.props.form.setFormItemsValue(this.formId, {
				   [key]: {
					   value: i.refcode,
					   display: i.refname
				   }
			   });
			}
	   }

	}
	

		//拼装公式显示
		let expression = this.expressionBuild();
		this.props.form.setFormItemsValue(this.formId, { 'info': { value: expression, display: expression } });
	
	};

	//IUFO取数点击事件
	beSureBtnClick = () => {
		//必输项校验
		let flag = this.props.form.isCheckNow(this.formId);
		if (!flag) {
			return;
		}
		let expression = this.expressionBuild();
		// 获取ufoqueryVO
	
		this.props.form.setFormItemsValue('CMPRYE', { 'info': { value: expression, display: expression } });
		// 触发回调
		typeof this.beSureBtnClickCallBack === 'function' && this.beSureBtnClickCallBack.call(this, expression);
		// 关闭模态框
		typeof this.beCancelBtnClickCallBack === 'function' && this.beCancelBtnClickCallBack();
	};
   
	expressionBuild= () =>{
		let UfoQueryVO = this.getUfoQueryVO();
		let result = new String();
		result = this.funcType + '(';
		//资金形态 现金账户 银行账户 数据拼接 单据处理
		result +=this.getConditionArr(result,UfoQueryVO.searchItem);
		//其他条件的拼争
		result += this.getConditionString(result,UfoQueryVO.otherItem);
	
		// 自定义条件
		//result += this.getConditionString(UfoQueryVO.defCondition);
		// 追加末尾字符，否则在split的时候会将后面的""去掉

		result += ')';
		console.log('函数公式',result);
		
		 return result;

	}
	
	/**
	 *  获取ufoqueryVO
	 */
	getUfoQueryVO = () => {
		//需要参照编码的在编辑后事件里处理 其余再此处获取form表单的对应值
	    //查询条件
		this.UfoQueryVO.searchItem.forEach((item) => {
			item.value=this.props.form.getFormItemsValue(this.formId, item.code).value;
	    });
	    //其他条件
         this.UfoQueryVO.otherItem.forEach((ItemList) => {
			 if(ItemList.code=='date'||ItemList.code=='end_date'||ItemList.code=='start_date'){
				if(this.props.form.getFormItemsValue(this.formId, ItemList.code)
				&&this.props.form.getFormItemsValue(this.formId, ItemList.code).value){
					ItemList.value=this.props.form.getFormItemsValue(this.formId, ItemList.code).value.substr(0,10);
				}
			 }  else{
				ItemList.value=this.props.form.getFormItemsValue(this.formId, ItemList.code).value;
			 }
     });    
		return this.UfoQueryVO;
	 };

	/**
	 * 将条件转换为标准格式的String
	 * @param conditions
	 * @return
	 */
	getConditionString = (result,otherObject) => {
		let  conditions='';
		otherObject.forEach((itemList) => {
			if(itemList.value==null ||'' === itemList.value){
               if(itemList.position==='last'){
				conditions += "'" + "'";
			   }else{
				conditions += "'" + "'"+",";
			   }

			}else{

				if(itemList.position==='last'){
					conditions += "'" +itemList.value+ "'";
				   }else{
					conditions += "'"+itemList.value + "'"+",";
				   }
			}
			
	    });
		return conditions;	
	};

	/**
	 * 资金形态 现金账户 银行账户 拼接
	 * @param conditions
	 * @return
	 */
	getConditionArr = (result,searchObject) => {
		let conditionArr = '';
		  //查询条件拼装
		  searchObject.forEach((item) => {
			if(item&&item.value&&item.value!=null){
			     conditionArr+='['+item.name+'='+item.value+']'
			  }
	    });	
		return  "'" + conditionArr+"'"+ ",";
	};

	//组织切换后联动清空关联项值
	clearOrgRelatingItemValue = () => {
		// for (let key of org_filter) {
		// 	//清空表单值
		// 	this.props.form.setFormItemsValue(formId, { [key]: { value: '', display: '' } });
		// 	//清空对应IUFO数据
		// 	this.UfoQueryVO[key] = [];
		// }
	};

	/**
	 * 根据类型展示不同的模态框
	 */
	showIUFOModal = () => {
		this.props.form.setFormStatus(this.formId, 'edit');
		this.props.form.EmptyAllFormValue(this.formId);
		// 清空缓存数据

		this.initData.call(this.IUFOModal);
		
		//打开模态框
		this.props.modal.show(this.modalId);
	};

	render() {
		const { form, modal ,funcType} = this.props;
		let { createForm } = form;
		let { createModal } = modal;
		let expandForm1='';
		let expandForm2='';
		if(funcType==UFOConst.cmprfs){
			expandForm1='CMPRFS_01',
			expandForm2='CMPRFS_02'
		}
		if(funcType==UFOConst.cmprye){
            expandForm1='CMPRYE_01'
		}
		return (
			<div class="ncc-match-modal-wrapper">
				{createModal(this.modalId, {
					title:funcType ,
					content: (
						<div>
							{createForm(this.formId, {
								onAfterEvent: this.afterEvent.bind(this),
								isNoStandard: true,//取消财务组织参照自动聚焦功能,
							
								expandArr:[this.formId,expandForm1,expandForm2]
							})}
						</div>
					),
					zIndex: 280,
					beSureBtnClick: this.beSureBtnClick.bind(this),
					userControl: true,
					closeModalEve: this.closeModalClick.bind(this),
					cancelBtnClick: this.cancelBtnClick.bind(this)
				})}
			</div>
		);
	}
}

const CMPIUFOModal = createPage({
	// billinfo: {
	// 	billtype: 'form',
	// 	pagecode: pagecode,
	// 	headcode: formId
	// }
})(IUFOModal);

let CMPUFOModal = {
	GuidComponents: CMPIUFOModal//IUFO取数向导
	};
export default CMPUFOModal

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/