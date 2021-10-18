/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, print, toast, promptBox } from 'nc-lightapp-front';
let { NCMessage } = base;
let tableid = 'table';

export default function buttonClick(props, id) {
	switch (id) {
		case 'add'://新增
			props.pushTo("/card", {
				status: "add",
				from: 'list'
			});
			break;
		case "delete"://删除
			const selectedData = props.table.getCheckedRows(tableid);
			if (selectedData.length == 0) {
				toast({ content: this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000001'), color: 'warning' });/* 国际化处理： 请选择数据！*/
				return;
			}
			let content;
			if (selectedData.length == 1) {
				content = this.props.MutiInit.getIntl('360701BCS') &&
					this.props.MutiInit.getIntl('360701BCS').get('360701BCS-000012');
			} else if (selectedData.length > 1) {
				content = this.props.MutiInit.getIntl('360701BCS') &&
					this.props.MutiInit.getIntl('360701BCS').get('360701BCS-000011');
			}
			promptBox({
				color: "warning",
				title: this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000010'),/* 国际化处理： 提示*/
				content: content,
				beSureBtnClick: this.delConfirm
			});
			break;
		case "refresh"://刷新
			ajax({
				url: '/nccloud/cmp/billmanagement/conferquery.do',
				data: {
					pageid: '360701BCS_L01'
				},
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data && data[tableid]) {
							this.props.table.setAllTableData(tableid, data[tableid]);
							// toast({
							// 	content: this.state.json['360701BCS-000018'],/* 国际化处理： 刷新成功！*/
							// 	color: 'success'
							// })
							toast({ content: this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000018'), color: 'success' });
						} else {
							this.props.table.setAllTableData(tableid, { rows: [] });
						}
					}
				}
			});
			break;
		case "print"://打印
			let printData = props.table.getCheckedRows(tableid);
			if (printData.length == 0) {
				toast({ content: this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000001'), color: 'warning' });/* 国际化处理： 请选择数据！*/
				return;
			}
			let pks = [];
			printData.forEach((val) => {
				pks.push(val.data.values.pk_bconfer.value);
			});

			print(
				'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				'/nccloud/cmp/pub/print.do',
				{
					appcode: '360701BCS',
					nodekey: '360701BCS', //模板节点标识
					oids: pks,// 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
					userjson: 'nccloud.pub.cmp.informer.print.datasource.ConferPrintDataSource'
				}
			);
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/