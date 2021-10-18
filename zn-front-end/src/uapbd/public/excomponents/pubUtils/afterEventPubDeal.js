import { toast } from 'nc-lightapp-front';
/**
 * 编辑后事件的处理逻辑
 * hanzhhm
 */



//错误处理信息
let errorDeal = function(that, res,key,changedrows) {
	//后台抛错之后将值渲染回去
	if(!changedrows ||Object.keys(changedrows).length ==0){
		changedrows ={
			value : null,
			display:null
		}
	}
	let str = String(res);
	let content = str.substring(6, str.length);
	that.props.form.setFormItemsValue(that.formId, { [key]: changedrows });
	toast({ color: 'danger', content: content });
};


export {errorDeal};