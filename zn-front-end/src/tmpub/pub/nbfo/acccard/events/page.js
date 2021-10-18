/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/
import { ajax, cardCache, toast } from 'nc-lightapp-front';
import { buttonVisible } from './buttonVisible';
import { baseReqUrl, javaUrl, accCard, btnLimit } from '../../cons/constant.js';
import { tabButtonClick } from './tabButtonClick';
import { setEditStatus, clearAll, add } from './buttonClick';
let { getCacheById, updateCache, getNextId, deleteCacheById } = cardCache;

/**
 * 
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
	getCardData.call(this, pks);
	props.setUrlParam(pks);
}

/**
 * 
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCardData(id, isFirst = false, isRefresh = false, type) {
	let cardData = getCacheById(id, this.dataSource);
	if (cardData && !isRefresh) {
		//有缓存且不是刷新按钮
		this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
		this.props.cardTable.setTableData(this.tableId, cardData.bodys[this.tableId] || { rows: [] });
		buttonVisible.call(this, this.props);
		if (this.props.getUrlParam('status') !== 'browse') {
			billHeadVisible.call(this, false, true, cardData.head[this.formId].rows[0].values.name.value);
		} else if (this.props.getUrlParam('status') === 'browse') {
			billHeadVisible.call(this, true, true, cardData.head[this.formId].rows[0].values.name.value);
		}
		return;
	}
	ajax({
		url: `${baseReqUrl}${javaUrl.accCardQuery}.do`,
		data: {
			pk: id,
			pageCode: this.pageId
		},
		success: (res) => {
			let { success, data } = res;
			this.setState({
				acc: {
					name: data.head.head.rows[0].values.accname.value&&data.head.head.rows[0].values.accname.value
				}
			});
			if (success) {
				if (this.props.getUrlParam('status') === 'browse') {
					billHeadVisible.call(this, true, true, data.head[this.formId].rows[0].values.name.value);
					this.setState({ showPagination: true });
				} else if (this.props.getUrlParam('status') !== 'browse') {
					billHeadVisible.call(this, false, true, data.head[this.formId].rows[0].values.name.value);
					this.setState({ showPagination: false });
				}
				if (data && data.head) {
					this.props.form.setAllFormValue({ [this.formId]: data.head[this.formId] });
				}
				if (data && data.bodys) {
					this.props.cardTable.setTableData(this.tableId, data.bodys[this.tableId] || { rows: [] });
					this.setState({ bodyData: data.bodys[this.tableId] });
				}
				buttonVisible.call(this, this.props);
				updateCache(this.primaryId, id, data, this.formId, this.dataSource);
				if (type && type === 'saveAdd') {
					add.call(this, this.props);
				}
			}
		},
		error: (res) => {
			toast({ color: 'danger', content: res.message && res.message.message });
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
		}
	});
}

/**
 * 单据标题设置
 * @param {*} backBtnFlag       是否显示返回按钮，默认否
 * @param {*} billCodeFlag      是否显示单据号，默认否
 * @param {*} billCode          要显示的单据号，默认为空
 */
export function billHeadVisible(backBtnFlag = false, billCodeFlag = false, billCode = '') {
	//设置状态
	this.props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: backBtnFlag, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
		showBillCode: billCodeFlag, //控制显示单据号：true为显示,false为隐藏 ---非必传
		billCode: billCode //修改单据号---非必传
	});
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
	let id = props.getUrlParam('id');
	props.setUrlParam({ status: 'browse' });
	if (id) {
		props.form.cancel(this.formId);
		setEditStatus.call(this, 'browse');
		let name = this.props.form.getFormItemsValue(this.formId, 'name').value;
		buttonVisible.call(this, this.props);
		billHeadVisible.call(this, true, true, name);
	} else {
		props.form.EmptyAllFormValue(this.formId);
		props.form.setFormItemsValue(this.formId, {
			nonbankfininstitution: {
				value: this.props.getUrlParam('nonbankPk'),
				display: this.props.getUrlParam('nonbankName')
			}
		});
		setEditStatus.call(this, 'browse');
		buttonVisible.call(this, this.props);
		billHeadVisible.call(this, true, false);
	}
}

/**
 * 按钮操作
 * @param {*} path       接口地址
 * @param {*} content    toast弹框显示内容
 */
export function btnOperation(path, content) {
	let pk = this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
	ajax({
		url: `${baseReqUrl}${path}.do`,
		data: { pks: [ pk ], pageCode: this.pageId },
		success: (res) => {
			if (res.success) {
				toast({ color: 'success', content });
				if (path === javaUrl.accListDelete) {
					// 获取下一条数据的id
					let nextId = getNextId(pk, this.dataSource);
					//删除缓存
					deleteCacheById(this.primaryId, pk, this.dataSource);
					if (nextId) {
						getCardData.call(this, nextId);
						this.props.getUrlParam({ id: nextId });
					} else {
						// 删除的是最后一个的操作
						this.props.setUrlParam({ id: '' });
						setEditStatus.call(this, 'browse');
						clearAll.call(this, this.props);
						billHeadVisible.call(this, true);
						buttonVisible.call(this, this.props);
					}
				} else {
					updateCache(this.primaryId, pk, res.data, this.formId, this.dataSource);
					getCardData.call(this, this.props.form.getFormItemsValue(this.formId, 'pk_nonbankacc').value);
				}
			}
		}
	});
}

//获取列表肩部信息
export function getTableHead() {
	return (
		<div className="shoulder-definition-area">
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: accCard.tableHead,
					buttonLimit: btnLimit,
					onButtonClick: tabButtonClick.bind(this),
					popContainer: document.querySelector('.header-button-area')
				})}
			</div>
		</div>
	);
}

/*THKCOjNyYOubQLqLOpp8uhdTYmbuscGOgulyf0cHWws=*/