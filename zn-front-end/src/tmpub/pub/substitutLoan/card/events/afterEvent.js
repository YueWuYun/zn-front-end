/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';

export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	
	   //编辑金额 计算 表头金额
       if (key == 'submny') {
		if (moduleId === 'body') {
			let checkData = props.editTable.getAllRows('body');
		    let subTatalMny=parseInt(0);
	   
		 for (let item of checkData) {
		 	if (item.values.submny&&item.values.submny.value) {
				subTatalMny+=parseInt(item.values.submny.value);
		 	}
		 }
		 props.form.setFormItemsValue('head', { 'subtotalmny': { value: subTatalMny } });
		 let availablemny=props.form.getFormItemsValue('head', 'availablemny').value;
		 let unsubmny=parseInt(availablemny)-subTatalMny;
		 props.form.setFormItemsValue('head', { 'unsubtotalmny': { value:unsubmny } });

	};

		
	} 
	 if(key=='search'){
         if(value){

			let queryData = {
				pk_org: '',
				srcEvent:'2',
				keyWord:'wy',
				matching:true
			};
			ajax({
				url: '/nccloud/tmpub/pub/substitutLoan.do',
				data: queryData,
				success: (res) => {
					let {success,data} = res;
					if (success) {
						if (data) {
							this.props.editTable.setTableData(this.tableId, data[this.tableId]);
						} else {
							this.props.editTable.setTableData(this.tableId, {
								rows: []
							});
						}
					}
				}
			});





		 }
    
  


	 }


	
	
}

/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/