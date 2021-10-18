/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import {  promptBox } from 'nc-lightapp-front';


export default function(props, id) {
	

	switch (id) {
	case 'save': //保存按钮
	  this.saveBill();
	  break;

	case 'cancel':		
	promptBox({
				color: 'warning',
	 			title:'取消', //this.state.json['36070BBM-000013'], //this.modalContent(), //取消*/
  		        content: "是否确认取消",//this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
	 			beSureBtnClick: () => {
					this.close();
	 			}
			});
	 		break;

		default:
			break;
	// 	//返回
	 }
}


/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/