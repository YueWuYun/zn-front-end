//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import {refreshFun,addFun,editFun,saveFun,deleteFun,cancelFun,relRelMenue,checkSelectData} from './controlareaCom';
import { toast } from 'nc-lightapp-front';
/**
 * 表头按钮编辑时，功能定义
 * @param {*} props 
 * @param {*} id 
 */
export default function buttonClick(props, id) {
    let that=this;
	switch (id) {
		case 'Refresh'://刷新
			refreshFun(that,props,'Refresh');
			break;
		case 'resa_Add'://新增
			addFun(that,props);
			break;
		case 'resa_Edit'://修改
			editFun(that,props);
			break;
		case 'resa_Save'://保存
			saveFun(that,props);
			break;
		case 'resa_Cancel'://取消
			cancelFun(that,props);
			break;
		case 'resa_RelLiabilityCenter'://关联利润中心查询
			this.modalSize = 'lg'
			this.referModalTitle=this.state.json['38200CA-000017']//'关联利润中心查询'
			this.selectBtn = 'resa_RelLiabilityCenter'
			this.trueButton=false;
			relRelMenue.call(this)
			break;
		case 'resa_RelFinanceOrg'://关联财务组织查询
			this.modalSize = 'lg'
			this.referModalTitle=this.state.json['38200CA-000018']//'关联财务组织查询'
			this.selectBtn = 'resa_RelFinanceOrg'
			this.trueButton=false;
			relRelMenue.call(this)
			break;
		case 'resa_RelFactory'://关联工厂
			this.modalSize = 'lg'
			this.selectBtn = 'resa_RelFactory'
			this.referModalTitle=this.state.json['38200CA-000019']//'关联工厂查询'
			this.trueButton=false;
			relRelMenue.call(this)
			break;
		case 'resa_RelProjectOrg'://关联项目组织查询
			this.modalSize = 'lg'
			this.selectBtn = 'resa_RelProjectOrg';
			this.referModalTitle=this.state.json['38200CA-000020']//'关联项目组织查询'
			this.trueButton=false;
			relRelMenue.call(this)
			break;
		case 'resa_RelLiabilityBook'://关联账簿类型

			let flag=checkSelectData.call(this);
			if(flag){
				this.referModalTitle=this.state.json['38200CA-000021']//'关联账簿类型'
				this.modalSize = 'sm'
				this.selectBtn = 'resa_RelLiabilityBook'
				this.trueButton=true;
				relRelMenue.call(this)
			}else{
				toast({ color: 'warning', content: that.state.json['38200CA-000012']});/* 国际化处理： 该管控范围下利润中心已建责任核算账簿！*/
			}
			break;
		default:
			break;
	}
}
//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS