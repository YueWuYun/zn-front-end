/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { toast,promptBox } from 'nc-lightapp-front';

export default function buttonClick(props, id) {
	let self = this;

	switch (id) {
		//完成结账
		case 'settleAccountBtn':
			let settleAData = props.table.getCheckedRows(this.tableId);
			if (settleAData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000000') });/* 国际化处理： 请选择单条数据，进行结账处理!*/
				return;
			}
			promptBox({
				color: "warning", 
				content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000012'),/* 国际化处理： 确定要完成结账这些记录吗?*/
				beSureBtnClick: this.settleConfirm.bind(this)
			  })
			break;
		//取消结账
		case 'unSettleAccountBtn':
			let un_settleAData = props.table.getCheckedRows(this.tableId);
			if (un_settleAData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000001') });/* 国际化处理： 请选择单条数据，进行取消结账处理!*/
				return;
			}
			promptBox({
				color: "warning", 
				content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000013'),/* 国际化处理： 确定要取消结账这些记录吗?*/
				beSureBtnClick: this.unsettleConfirm.bind(this)
			  })
			break;

		//刷新
		case 'refreshBtn':
			this.refresh();
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/