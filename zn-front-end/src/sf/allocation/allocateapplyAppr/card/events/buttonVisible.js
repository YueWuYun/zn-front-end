/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
/**
 * 处理按钮的可见性
 * @param {*} props 界面内置对象
 */
import { card_page_id, card_from_id, card_table_id } from '../../cons/constant.js';

export default function buttonVisible(props) {
	let billValue = null;
	let status = props.getUrlParam('status');
	// 表体肩部按钮 显隐性控制
	let pasteflag = this.state.pasteflag || false;
	let flag = status === 'add' ? false : true;//是否为新增
	props.form.setFormStatus(card_from_id, status);
	props.cardTable.setStatus(card_table_id, status);

	//控制卡片翻页按钮 显隐性 这里审批不需要翻译
	this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);

	props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'Uncommit',
		'LinkedQuery', 'Enclosure', 'Print', 'Save', 'SaveAdd', 'SaveCommit', 'Cancel', 'Entrust', 'CancelEntrust', 'Refresh'], !flag);

	if (flag) {//非add
		if (status === 'copy') {//点击复制时进入此状态

			props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'Uncommit',
				'LinkedQuery', 'Enclosure', 'Print', 'Save', 'SaveAdd', 'SaveCommit', 'Cancel',
				'Entrust', 'CancelEntrust', 'Refresh'], !flag);

			props.button.setButtonVisible(['Save', 'SaveAdd', 'SaveCommit', 'Cancel', 'LinkedQuery'], flag);

			//body 按钮的显隐性控制
			props.button.setButtonVisible(
				[   // 新增行   删除行      复制行
					'AddLine', 'DeleteLine', 'CopyLine',
				],
				!pasteflag
			);
			props.button.setButtonVisible(
				['CancelLine', 'CopyLastLine'],
				pasteflag);

			//联查按钮控制 新增编辑时 不显示：回单 审批
			props.button.setButtonVisible(
				['ApproveInfoInner', 'ReturnBill'],
				pasteflag);

		} else if (status === 'browse') {// 游览
			//因为此页面为审批页面 所以不显示翻页按钮
			props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			
			if (props.getUrlParam('id')) {
				billValue = props.form.getFormItemsValue(card_from_id, 'billstatus').value;
				//游览时 所有table肩部按钮都不显示
				props.button.setButtonVisible(['AddLine', 'DeleteLine', 'CopyLine', 'CopyLastLine', 'CancelLine'], !flag);
				if (billValue === '1') {//待审批
					props.button.setButtonVisible(['Add', 'Copy', 'Uncommit', 'LinkedQuery', 'Enclosure', 'Print', 'Refresh'], flag);
					//新增标红
					props.button.setMainButton(['Add'], true);
				} else if (billValue === '2') {
					props.button.setButtonVisible(['Add', 'Copy', 'Uncommit', 'Entrust', 'LinkedQuery', 'Enclosure', 'Print', 'Refresh'], flag);
				} else if (billValue === '3') {
					props.button.setButtonVisible(['Add', 'Copy', 'CancelEntrust', 'LinkedQuery', 'Enclosure', 'Print', 'Refresh'], flag);
				} else if (billValue === '4') {//处理完毕
					props.button.setButtonVisible(['Add', 'Copy', 'LinkedQuery', 'Enclosure', 'Print','Refresh'], flag);
					//新增标红
					props.button.setMainButton(['Add'], true);
				} else if (billValue === '5') {
					props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'LinkedQuery', 'Enclosure', 'Print', 'Refresh'], flag);
				}

				//body 按钮的显隐性控制
				props.button.setButtonVisible(
					[   // 新增行   删除行      复制行
						'AddLine', 'DeleteLine', 'CopyLine', 'CopyLastLine', 'CancelLine'
					],
					pasteflag
				);

				//联查按钮控制 当从修改 -> 取消时 需要重新设置审批联查可见
				props.button.setButtonVisible(
					['ApproveInfoInner'],
					true);
				//联查按钮控制 当单据不为处理完成状态时 没有回单联查
				if (billValue === '4') {
					props.button.setButtonVisible(['ReturnBill'], true);
				} else {
					props.button.setButtonVisible(['ReturnBill'], false);
				}


			} else {//此状态 一般为新增时点击取消 只有新增按钮

				//控制卡片翻页按钮 显隐性
				props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
				//from肩部按钮 全部隐藏
				props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'Uncommit',
					'LinkedQuery', 'Enclosure', 'Print', 'Save', 'SaveAdd', 'SaveCommit', 'Cancel',
					'Entrust', 'CancelEntrust', 'Refresh'], false);
				//table肩部按钮 全部隐藏
				props.button.setButtonVisible(['AddLine', 'DeleteLine', 'CopyLine', 'CopyLastLine', 'CancelLine'], false);

				props.button.setButtonVisible('Add', true);

				//新增标红
				props.button.setMainButton(['Add'], true);
			}
		} else if (status === 'edit') {// 编辑

			props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'Uncommit',
				'LinkedQuery', 'Enclosure', 'Print', 'Save', 'SaveAdd', 'SaveCommit', 'Cancel', 'Entrust', 'CancelEntrust'], !flag);

			props.button.setButtonVisible(['Save', 'SaveAdd', 'SaveCommit', 'Cancel', 'LinkedQuery'], flag);

			//body 按钮的显隐性控制
			props.button.setButtonVisible(
				[   // 新增行   删除行      复制行
					'AddLine', 'DeleteLine', 'CopyLine',
				],
				!pasteflag
			);
			props.button.setButtonVisible(
				['CancelLine', 'CopyLastLine'],
				pasteflag);

			//联查按钮控制 新增编辑时 不显示：回单 审批
			props.button.setButtonVisible(
				['ApproveInfoInner', 'ReturnBill'],
				false);
		}
	} else {//新增

		props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'Uncommit',
			'Enclosure', 'Print', 'Entrust', 'CancelEntrust'], flag);

		//body 按钮的显隐性控制
		props.button.setButtonVisible(
			[   // 新增行   删除行      复制行
				'AddLine', 'DeleteLine', 'CopyLine',
			],
			!pasteflag
		);
		props.button.setButtonVisible(
			['CancelLine', 'CopyLastLine'],
			pasteflag);

		//联查按钮控制 新增编辑时 不显示：回单 审批
		props.button.setButtonVisible(
			['ApproveInfoInner', 'ReturnBill'],
			false);

	}
}

/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/