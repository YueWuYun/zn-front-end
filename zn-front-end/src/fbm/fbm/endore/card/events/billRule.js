/*++ItUpydul4vQOSJJV8OSWOOF/JGxNlxKFhUeLqrL3iqhgF3HGlKFdqg4WR34L0a*/
import { URI, CARD } from './../../cons/constant';
import { doAjax } from '../../utils/commonUtil';
import { pk_orgAfterEdit } from './afterEvent';
import { setHeadItemProp } from '../../utils/commonUtil';
/**
 * 初始化单据信息，加载业务数据规则
 * @param {*} status // 页面状态
 * @param {*} data  // 单据数据
 */
export function billInitDataRule(status, data) {
	switch (status) {
		case 'browse':
			formBrowse.call(this, data);
			break;
		case 'add':
			formAdd.call(this);
			break;
		case 'edit':
			formEdit.call(this, data);
			break;
		case 'copy':
			formCopy.call(this);
			break;
		default:
			break;
	}
}

/**
 * 浏览 无data浏览态 有data浏览态
 * @param {*} data  单据数据
 */
const formBrowse = function (data) {
	// // 设置画面为浏览态
	// setEditStatus.call(this, 'browse');
	if (!data) {
		// 如果没有单据数据传入，将清空主表所有数据
		this.props.form.EmptyAllFormValue(CARD.formHeadCode);
		// // 将卡片页按钮全部隐藏
		// this.props.button.hideButtonsByAreas(CARD.formHeadCode);
	}
};

/**
 * 新增 无数据编辑态
 */
const formAdd = function () {
	// 将清空主表所有数据
	this.props.form.EmptyAllFormValue(CARD.formHeadCode);
	// 如果设置了默认的财务组织，默认带出财务组织，界面字段可编辑；
	if (this.state.curr_pk_org) {
		let pk_org = {
			value: this.state.curr_pk_org,
			display: this.state.curr_orgname
		};
		let pk_org_v = {
			value: this.state.curr_pk_org_v,
			display: this.state.curr_orgname_v
		}
		this.props.form.setFormItemsValue(CARD.formHeadCode, {
			pk_org, pk_org_v
		});
		// this.props.resMetaAfterPkorgEdit();
		// 主动调用编辑后事件，带出默认财务组织的相关信息。
		pk_orgAfterEdit.call(this, CARD.formHeadCode, 'pk_org', pk_org, null, true);
	} else {
		// 未设置默认财务组织，财务组织字段可编辑，其他字段置灰，不可编辑
		this.props.initMetaByPkorg();
		this.props.form.setFormItemsDisabled(this.formHeadId, { 'pk_org': false });
	}
};
/**
 * 编辑 有数据编辑态
 * @param {*} status 单据状态
 * @param {*} data 单据数据
 */
const formEdit = function (data) {
	if (data) {
		let id = this.props.getUrlParam('id');
		// 查询要修改的id对应的数据
		let getDataCallback = function (res) {
			if (res.data.head) {
				// 设置新数据
				this.props.form.setAllFormValue({
					[CARD.formHeadCode]: res.data && res.data.head[CARD.formHeadCode]
				});
				// 如果是修改，要设置财务组织和单据编号不可编辑(必须在设置新数据之后再进行此步骤)
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'pk_org': true, 'vbillno': true });
				// 先把网银标志设为不可编辑，票据为电票时才能编辑
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'onlinebankflag': true });
				// 先把同行标志设为不可编辑，勾选网银后才能编辑
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'issamebank': true });
				// 先把背书单位账户设为不可编辑，勾选网银后才能编辑
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'endorserbankacc': true });
				// 先把被背书单位账户设为不可编辑，勾选网银后才能编辑
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'endorseebankacc': true });
				// 勾选网银后才能编辑
				this.props.form.setFormItemsDisabled(this.formId, {
					'banksubcompany': true
				});
				if (!res.data.userjson) {
					return;
				}
				let userJsonObj =  JSON.parse(res.data.userjson);
				if (userJsonObj && userJsonObj.ISEBILL && 'true' == userJsonObj.ISEBILL){
					// 是电票，设置网银可编辑
					this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'onlinebankflag': false });
					let onlinebankflag = this.props.form.getFormItemsValue(CARD.formHeadCode, 'onlinebankflag') &&
					this.props.form.getFormItemsValue(CARD.formHeadCode, 'onlinebankflag').value;
					if (onlinebankflag) {
						// 勾选网银后才能编辑同行标志设
						this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'issamebank': false });
						// 勾选网银后才能编辑背书单位账户
						this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'endorserbankacc': false });
						// 勾选网银后才能编辑被背书单位账户
						this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'endorseebankacc': false });
						// 接口行,勾选网银后才能编辑
						this.props.form.setFormItemsDisabled(CARD.formHeadCode, {
							'banksubcompany': false
						});
					}
				}
			}
		};
		let cardData = { pk: id };
		doAjax.call(this, cardData, URI.endoreCardMainQuery, getDataCallback);
	}
};

/**
 * 复制
 * 
 * @param {*} status 
 * @param {*} id 
 */
const formCopy = function () {
	// 复制选中单据 财务组织 背书单位 背书单位账号
	let oldId = this.props.getUrlParam('oldId');
	copyFormValues.call(this, oldId);
};

/**
 * 复制选中单据 财务组织 背书单位 背书单位账户
 * @param {*} id
 */
const copyFormValues = function (id) {
	// 查询要复制的id对应的数据
	let getDataCallback = function (res) {
		if (res.data.head) {
			let values = res.data.head[CARD.formHeadCode].rows[0].values;
			let pk_org = values['pk_org']; // 财务组织
			let endorserbankacc = values['endorserbankacc']; // 背书单位账户
			// 将单据状态转变为编辑态 将源 单据 id 删除
			// this.props.setUrlParam({
			// 	status: 'edit',
			// 	id: null
			// });
			// 清空旧数据
			this.props.form.EmptyAllFormValue(CARD.formHeadCode);
			// 设置 财务组织 字段的值
			this.props.form.setFormItemsValue(CARD.formHeadCode, {
				pk_org
			});
			// 类似财务组织字段编辑后事件
			let copyReqData = this.props.createHeadAfterEventData(CARD.pageCode, CARD.formHeadCode, '', CARD.formHeadCode, 'pk_org', pk_org);
			let copyCallback = function (res) {
				// 设置新数据
				this.props.form.setAllFormValue({
					[CARD.formHeadCode]: res.data.card && res.data.card.head[CARD.formHeadCode]
				});
				// 设置 复制的背书单位账号 字段的值
				this.props.form.setFormItemsValue(CARD.formHeadCode, {
					endorserbankacc
				});
				// 如果是复制，要设置财务组织不可编辑(必须在设置新数据之后再进行此步骤)
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'pk_org': true });
				// 先把网银标志设为不可编辑，票据为电票时才能编辑
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'onlinebankflag': true });
				// 先把同行标志设为不可编辑，勾选网银后才能编辑
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'issamebank': true });
				// 先把背书单位账户设为不可编辑，勾选网银后才能编辑
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'endorserbankacc': true });
				// 先把被背书单位账户设为不可编辑，勾选网银后才能编辑
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { 'endorseebankacc': true });
				// 接口行,勾选网银后才能编辑
				this.props.form.setFormItemsDisabled(this.formId, {
					'banksubcompany': true
				});
				// 控制字段的编辑性
				let fieldsEditable = res.data.fieldsEditable;
				if (fieldsEditable) {
					let items = [];
					Object.keys(fieldsEditable).forEach(function(key) {
						items.push({
							itemName: key,
							editable: fieldsEditable[key]
						});
					});
					setHeadItemProp.call(this, this.props, CARD.formHeadCode, items);
				}
			}
			doAjax.call(this, copyReqData, URI.afterEvent, copyCallback);

		}
	};
	let cardData = { pk: id };
	doAjax.call(this, cardData, URI.endoreCardMainQuery, getDataCallback);
};

/*++ItUpydul4vQOSJJV8OSWOOF/JGxNlxKFhUeLqrL3iqhgF3HGlKFdqg4WR34L0a*/