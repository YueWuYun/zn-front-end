/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, print, output, deepClone, promptBox } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
import { pageInfoClick } from '../events/pageInfoClick';
let { getCurrentLastId, updateCache, addCache, getNextId, deleteCacheById } = cardCache;
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import {  linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, CARD__PAGECODE, CARD_FORMCODE, CARD_TABLECODE, BODY_EDIT_CODE, PRINT_NODEKEY} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYBYIDS, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
const {
	ADD_GROUP,
	ADD_BTN,
	EDIT_BTN,
	DELETE_BTN,
	PRINT_BTN,
	PRINT_GROUP,
	OUTPUT_BTN,
	EDIT_INNER_BTN,
	DELETE_INNER_BTN,
	SAVE_GROUP,
	SAVE_BTN,
	SAVEADD_BTN,
	CANCEL_BTN,
	REFRESH_BTN
} = BTN
export default function(props, id) {
	let that = this;
	let org_val = props.form.getFormItemsValue(CARD_FORMCODE, PK_ORG).value;
	let last_pk = props.form.getFormItemsValue(CARD_FORMCODE, PK_NAME).value;
	let org_display = props.form.getFormItemsValue(CARD_FORMCODE, PK_ORG).display;
	let CardData = props.createMasterChildData(CARD__PAGECODE, CARD_FORMCODE, CARD_TABLECODE);

	switch (id) {
		case SAVE_BTN: //保存按钮
		let CardSaveData = props.createMasterChildData(this.pageId, CARD_FORMCODE, CARD_TABLECODE);
		let saveObj = {};
		saveObj[CARD_TABLECODE] = 'cardTable';
		props.validateToSave(CardSaveData, this.saveBill.bind(this), saveObj, '');
		
		//this.saveBill();
			break;
		case ADD_BTN: //新增按钮
			props.pushTo('/card', { status: 'add', pagecode: CARD__PAGECODE, id: this.props.getUrlParam('id') });
			that.pageShow();
			break;
		//保存新增
		case SAVEADD_BTN:
			let CardData = props.createMasterChildData(this.pageId, CARD_FORMCODE, CARD_TABLECODE);
			let saveAddObj = {};
		    saveAddObj[CARD_TABLECODE] = 'cardTable';
		    props.validateToSave(CardData, saveadd.bind(this,props,CardData), saveAddObj, '');
			break;
		case EDIT_BTN:
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
								content: this.state.json['36070BBR-000006']
							}); /* 国际化处理： 保存成功*/
							if (res.data.head && res.data.head[CARD_FORMCODE]) {
								this.props.form.setAllFormValue({ [CARD_FORMCODE]: res.data.head[CARD_FORMCODE] });
								pk_paybill = res.data.head[CARD_FORMCODE].rows[0].values.pk_paybill.value;
								page_code = res.data.head[CARD_FORMCODE].rows[0].values.trade_type.value;
							}
							this.billno = billno;
							if (res.data.body && res.data.body[CARD_TABLECODE]) {
								this.props.editTable.setTableData(CARD_TABLECODE, res.data.body[CARD_TABLECODE]);
							}
						}
					}
					props.pushTo('/card', { status: 'browse', id: pk_paybill, pagecode: CARD__PAGECODE, });
					that.pageShow();
				}
			});
			break;
			// 删除
		case DELETE_BTN:
			promptBox({
					color: 'warning',
					title: this.state.json['36070BBR-000009'], // 弹框表头信息/* 国际化处理： 确认删除*/
					hasCloseBtn: false,
					content: this.state.json['36070BBR-000010'], //弹框内容 /* 国际化处理： 确认删除所选数据吗?*/
					beSureBtnClick: this.delConfirm
				});
			break;
			// 取消
		case CANCEL_BTN:
			let current_pk = this.props.getUrlParam('id');
			promptBox({
				color: 'warning',
				hasCloseBtn: false,
				title: this.state.json['36070BBR-000011'], //this.modalContent(), //取消*/
				content: this.state.json['36070BBR-000012'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确定要取消吗?*/
				beSureBtnClick: () => {
					if (!current_pk) {
						current_pk = getCurrentLastId(BBR_CONST.paybillCacheKey);
					}
					if (current_pk) {
						if (!this.getCacheDataById.call(this, current_pk)) {
							this.props.pushTo('/card', {pagecode: CARD__PAGECODE, status: 'browse', id: current_pk });
							this.pageShow();
						}
					} else {
						this.billno = '';
						this.billId = '';
						this.props.setUrlParam({
							status: 'browse'
						});
						this.props.form.EmptyAllFormValue(CARD_FORMCODE);
						this.props.cardTable.setTableData(CARD_TABLECODE, { rows: [] });
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
					nodekey: PRINT_NODEKEY, //模板节点标识
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
					nodekey: PRINT_NODEKEY,
					appcode: APPCODE,
					oids: [ this.props.form.getFormItemsValue(this.formId, PK_NAME).value ],
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
	}
}

//页面返回
function cannel_linkto(props, url, pk) {
	let id = props.form.getFormItemsValue(CARD_FORMCODE, 'pk_paybill').value;
	if (pk) {
		id = pk;
	}
	props.pushTo('/card', { pagecode: CARD__PAGECODE,status: 'browse', id: id });
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
function saveadd(props){


	let flag = props.form.isCheckNow(CARD_FORMCODE);
	if (!props.cardTable.checkTableRequired(CARD_TABLECODE)) {
		return;
	}
	if (!flag) {
		return;
	}
	let cacheFlag = true;
	//let flag = props.form.isCheckNow(CARD_FORMCODE);
	if (this.props.getUrlParam('status') === 'edit') {
		cacheFlag = false;
	}
	if (flag) {
		ajax({
			url: SAVE,
			data: CardData,
			success: (res) => {
				let pk_paybill = null;
				if (res.success) {
					if (res.data) {
						let bill_pk = res.data.head[CARD_FORMCODE].rows[0].values[PK_NAME].value;
						if (res.data.body && res.data.body[CARD_TABLECODE]) {	
							let body=res.data.body;
							 body[CARD_TABLECODE] = this.props.cardTable.updateDataByRowId(
								CARD_TABLECODE,
								res.data.body[CARD_TABLECODE]
							);
							if (body&&body[CARD_TABLECODE]) {
								res.data.body = body;
							}
						}
						toast({
							color: 'success',
							content: this.state.json['36070BBR-000006']
						}); /* 国际化处理： 保存成功*/
						//加入缓存
						if (cacheFlag) {
							addCache(
								bill_pk,
								res.data,
								CARD_FORMCODE,
								BBR_CACHEKEY
							);
						} else {
							// 更新缓存
							updateCache(
								PK_NAME,
								bill_pk,
								res.data,
								CARD_FORMCODE,
								BBR_CACHEKEY
							);
						}
						props.setUrlParam({
							status: 'add',
							pagecode: CARD__PAGECODE
						});
						this.pageShow();
					}
				}
			}
		});
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/