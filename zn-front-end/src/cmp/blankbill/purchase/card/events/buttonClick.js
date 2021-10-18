/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, print, deepClone, promptBox,output } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
import { pageInfoClick } from './pageInfoClick';
let { getCurrentLastId, updateCache, addCache, getNextId, deleteCacheById } = cardCache;
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const {APPCODE, CARD__PAGECODE, CARD_TABLECODE, CARD_FORMCODE, PRINT_FUNCODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG, PKNOTETYPE } = BILL_FIELD
const { BBP_CACHEKEY } = BBP_CONST
const { SAVE, DELETE, PRINT } = REQUEST_URL;
const {
	ADD_GROUP,
	ADD_BTN,
	EDIT_BTN,
	DELETE_BTN,
	PRINT_BTN,
	OUTPUT_BTN,
	SAVE_GROUP,
	SAVE_BTN,
	SAVEADD_BTN,
	CANCEL_BTN,
	REFRESH_BTN
} = BTN;
export default function(props, id) {
	let that = this;
	let org_val = props.form.getFormItemsValue(this.formId, PK_ORG).value;
	let last_pk = props.form.getFormItemsValue(this.formId, PK_NAME).value;
	let org_display = props.form.getFormItemsValue(this.formId, PK_ORG).display;
	// let pagecodes = props.form.getFormItemsValue(this.formId, 'trade_type').value;
	let CardData = props.createMasterChildData(CARD__PAGECODE, this.formId, this.tableId);

	switch (id) {
		case SAVE_BTN: //保存按钮

		let CardSaveData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
		let saveObj = {};
		saveObj[this.tableId] = 'cardTable';
		props.validateToSave(CardSaveData, this.saveBill.bind(this), saveObj, '');
			//this.saveBill();
			break;
		case ADD_BTN: //新增按钮
			props.pushTo('/card', { status: 'add', pagecode: CARD__PAGECODE, id: this.props.getUrlParam('id') });
			that.pageShow();
			break;
		//保存新增
		case SAVEADD_BTN:
			let CardData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			 let saveAddObj = {};
			 saveAddObj[this.tableId] = 'cardTable';
			 props.validateToSave(CardData,  saveadd.bind(this,props,CardData), saveAddObj, '');
			//校验表单必输字段

		

			break;
		case EDIT_BTN:
			// ajax({
			// 	url: '/nccloud/cmp/paybills/dataAuthority.do',
			// 	data: { pk: last_pk, pageid: CARD__PAGECODE },
			// 	success: (res) => {
			// 		this.props.pushTo('/card', { status: 'edit', id: props.getUrlParam('id'), pagecode: CARD__PAGECODE });
			// 		this.pageShow();
			// 	}
			// });
			this.props.pushTo('/card', { status: 'edit', id: props.getUrlParam('id'), pagecode: CARD__PAGECODE });
			this.pageShow();
			break;
		case 'saveBtn': //保存按钮
			
			ajax({
				url: SAVE,
				data: CardData,
				success: (res) => {
					let pk_paybill = null;
					let page_code = null;
					if (res.success) {
						if (res.data) {
							toast({
								color: 'success',
								content: this.state.json['36070BBP-000005']
							}); /* 国际化处理： 保存成功*/
							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								pk_paybill = res.data.head[this.formId].rows[0].values[PK_NAME].value;
								// page_code = res.data.head[this.formId].rows[0].values.trade_type.value;
							}
							this.billno = billno;
							if (res.data.body && res.data.body[this.tableId]) {
								this.props.editTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						}
					}
					props.pushTo('/card', { status: 'browse', id: pk_paybill, pagecode: CARD__PAGECODE });
					that.pageShow();
				}
			});
			break;

		case DELETE_BTN:
			promptBox(
				{
					color: 'warning',
					hasCloseBtn: false,
					title:this.state.json['36070BBP-000002'], //删除/,
					content: this.state.json['36070BBP-000004'], /* 国际化处理： 确定要删除吗?*/
					beSureBtnClick: this.delConfirm
					//beSureBtnClickDelete.call(this, props, data);
				} // 确定按钮点击调用函数,非必
			);

			break;

		case CANCEL_BTN:
			let current_pk = this.props.getUrlParam('id');

			promptBox({
				color: 'warning',
				hasCloseBtn: false,
				title: this.state.json['36070BBP-000008'], //this.modalContent(), // 确认取消*/
				content: this.state.json['36070BBP-000003'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认取消*/
				// beSureBtnName: this.props.MutiInit.getIntl("36070BBPCOMP") && this.props.MutiInit.getIntl("36070BBPCOMP").get('36070BBP-000039'),        // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: this.props.MutiInit.getIntl("36070BBPCOMP") && this.props.MutiInit.getIntl("36070BBPCOMP").get('36070BBP-000038'),
				beSureBtnClick: () => {
					if (!current_pk) {
						current_pk = getCurrentLastId(BBP_CACHEKEY);
					}
					if (current_pk) {
						if (!this.getCacheDataById.call(this, current_pk)) {
							this.props.pushTo('/card', { pagecode: CARD__PAGECODE, status: 'browse', id: current_pk });
							this.pageShow();
						}
					} else {
						this.billno = '';
						this.billId = '';
						this.props.setUrlParam({
							status: 'browse'
						});
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
						that.toggleShow();
					}
				}
			});
			break;

		//打印
		case PRINT_BTN:
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				PRINT,
				{
					//billtype: 'D5', //单据类型
					//funcode: '36070PBM', //功能节点编码，即模板编码
					nodekey: PRINT_FUNCODE, //模板节点标识
					//printTemplateID: '1001Z610000000004R6L', //模板id
					appcode: APPCODE,
					oids: [ this.props.form.getFormItemsValue(this.formId, PK_NAME).value ]
				}
			);
			break;
		//输出	
		case OUTPUT_BTN:
			output({
				url: PRINT,
				data: {
					nodekey: PRINT_FUNCODE,
					appcode: APPCODE,
					oids: [this.props.form.getFormItemsValue(this.formId, PK_NAME).value],
					outputType: 'output'
				}
			});
			break;

		//刷新按钮
		case REFRESH_BTN:
			that.pageShow();
			break;
		
		default:
			break;
		//返回
	}
}

//页面返回
function cannel_linkto(props, url, pk) {
	let id = props.form.getFormItemsValue(this.formId, 'pk_paybill').value;
	if (pk) {
		id = pk;
	}
	props.pushTo('/card', {pagecode: CARD__PAGECODE, status: 'browse', id: id });
	// props.linkTo(card_page_url, {
	// 	status: 'browse',
	// 	id: id

	// });
	this.pageShow();
}

//构建请求数据
function dataBuild(pk, ts, pageid) {
	let pkMapTs = {};
	let pkName = 'pk_paybill';
	pkMapTs[pk] = ts;
	let data = {
		pkMapTs,
		pageid,
		pk
	};
	return data;
}
function saveadd(props,CardData){

	let flag = props.form.isCheckNow(this.formId);
	if (!props.cardTable.checkTableRequired(this.tableId)) {
		return;
	}
	if (!flag) {
		return;
	}
	let cacheFlag = true;
	//let flag = props.form.isCheckNow(this.formId);
	let save_url = SAVE;
	if (this.props.getUrlParam('status') === 'edit') {
		cacheFlag = false;
	}
	if (flag) {
		ajax({
			url: save_url,
			data: CardData,
			success: (res) => {
				let pk_paybill = null;
				if (res.success) {
					if (res.data) {
						let bill_pk = res.data.head[this.formId].rows[0].values[PK_NAME].value;
						if (res.data.body && res.data.body[this.tableId]) {	
							let body=res.data.body;
							 body[CARD_TABLECODE] = this.props.cardTable.updateDataByRowId(
								this.tableId,
								res.data.body[this.tableId]
							);
							if (body&&body[CARD_TABLECODE]) {
								res.data.body = body;
							}
						}

						toast({
							color: 'success',
							content: this.state.json['36070BBP-000005']
						}); /* 国际化处理： 保存成功*/
						//加入缓存
						if (cacheFlag) {
							addCache(
								bill_pk,
								res.data,
								CARD_FORMCODE,
								BBP_CACHEKEY
							);
						} else {
							// 更新缓存
							updateCache(
								BILL_FIELD.PK,
								bill_pk,
								res.data,
								CARD_FORMCODE,
								BBP_CACHEKEY
							);
						}
							props.setUrlParam({
								status: 'add',
								pagecode: CARD__PAGECODE,
								id: bill_pk
							});
							this.pageShow();
					}
				}
			}
		});
	}


}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/