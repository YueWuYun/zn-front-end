/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, toast, cardCache, print, output, promptBox } from 'nc-lightapp-front';
import { baseReqUrl, javaUrl, printData, card } from '../../cons/constant.js';
const {pageCode, form02} = card;
import { interestBill } from '../../util/util';
import initTemplate from './initTemplate';
import { buttonVisible } from './buttonVisible';
import { getCardData } from './page';
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
let { getCacheById, updateCache, addCache } = cardCache;
import { linkContract } from '../../../public/listHeadBtnClick';
import { COMMON_BTN } from '../../../../public/cons/constant';
const {
    ADD_BTN,
    EDIT_BTN,
    COPY_BTN,
    DELETE_BTN,
    SUBMIT_BTN,
    UNSUBMIT_BTN,
    ENTRUST_BTN,
    UNENTRUST_BTN,
    ENCLOSURE_BTN,
    APPROVALOPINION_BTN,
    DEBITCONTRACT_BTN,
    CONTRACT_BTN,
    PRINT_BTN,
    OUTPUT_BTN,
    REFRESH_BTN,
    SAVE_BTN,
    SAVEADD_BTN,
    SAVESUBMIT_BTN,
    CANCEL_BTN} = COMMON_BTN
/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick (props, id) {
    // 当前单据的pk
    let pk= props.form.getFormItemsValue(this.formId, this.primaryId) && props.form.getFormItemsValue(this.formId, this.primaryId).value;
    
    switch (id) {
        //头部 新增
        case ADD_BTN:
                let adddata = {pk: null};
                ajax({
                    url: `${baseReqUrl}${javaUrl.addpermission}.do`,
                    data: adddata,
                    success: (res) => {
                        if (res.success) {
                            add.call(this, props, 'add');
                        }
                    }
                });
            break;
        case COPY_BTN:
            // copy.call(this, props , pk );
            this.props.pushTo("/card", {
                status: "copy",
                id: pk,
                pagecode: this.pageId
            });
            initTemplate.call(this, props);
            // props.setUrlParam({status:'copy'})
            break;
        //头部保存
        case SAVE_BTN:
            saveBill.call(this, props, 'save');
            break;
        //头部保存提交
        case SAVESUBMIT_BTN:
            saveBill.call(this, props, 'commit');
            break;
        //头部保存新增
        case SAVEADD_BTN:
            saveBill.call(this, props, 'add');
            break;
        //头部修改
        case EDIT_BTN:
			let querydata = {pk: pk};
			ajax({
				url: `${baseReqUrl}${javaUrl.editpermission}.do`,
				data: querydata,
				success: (res) => {
					if (res.success) {
                        edit.call(this, props, 'edit');
					}
				}
			});
            break;
        //头部删除
        case DELETE_BTN:
            promptBox({
                color: "warning",
                title: this.state.json['36362IDA-000005'],/* 国际化处理： 删除*/
                content: this.state.json['36362IDA-000006'],/* 国际化处理： 确定要删除吗?*/
                beSureBtnClick: this.btnOperation.bind(this, javaUrl.delete, this.state.json['36362IDA-000007'])/* 国际化处理： 删除成功!*/
            });
            break;
        // 头部 取消
        case CANCEL_BTN:
            promptBox({
                color: "warning",
                title: this.state.json['36362IDA-000008'],/* 国际化处理： 取消*/
                content: this.state.json['36362IDA-000009'],/* 国际化处理： 确定要取消吗?*/
                beSureBtnClick: cancel.bind(this, props)
            });
            break;
        //头部 提交
        case SUBMIT_BTN:
            this.btnOperation(javaUrl.commit, this.state.json['36362IDA-000017'], pk);/* 国际化处理： 提交成功!*/
            break;
        //头部 收回
        case UNSUBMIT_BTN:
            this.btnOperation(javaUrl.uncommit, this.state.json['36362IDA-000010'], pk);/* 国际化处理： 收回成功!*/
            break;
        //头部 委托办理
        case ENTRUST_BTN:
            this.btnOperation(javaUrl.entrust, this.state.json['36362IDA-000028'], pk);/* 国际化处理： 委托办理成功!*/
            break;
        //头部 取消委托
        case UNENTRUST_BTN:
            this.btnOperation(javaUrl.unentrust, this.state.json['36362IDA-000029'], pk);/* 国际化处理： 取消委托成功!*/
            break;
        //头部 审批详情
        case APPROVALOPINION_BTN:
            this.billInfo= {billId: pk};
            this.setState({showApproveDetail: true});
            break;
        //头部 联查--借款合同 
        case DEBITCONTRACT_BTN: 
            let pk_debitapply = props.form.getFormItemsValue(this.formId, this.primaryId) && props.form.getFormItemsValue(this.formId, this.primaryId).value;
            props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                id: pk_debitapply,
                status: "browse",
                appcode: "36362IDC",
                pagecode: "36362IDC_C01",
                pageType: 'apply',
                scene: "linksce"
            });
            break;
            // 联查--贷款合同
        case CONTRACT_BTN: 
            linkContract.call(this, props, pk);
            break;    
        //头部 打印
        case PRINT_BTN:
            print(
                'pdf', 
                `${baseReqUrl}${javaUrl.print}.do`,
                {
                    ...printData,
                    oids: [pk]
                }
            );
            break;
        //头部 输出
        case OUTPUT_BTN:
            output({
                url: `${baseReqUrl}${javaUrl.print}.do`,
                data: {
                    ...printData,
                    outputType: 'output',
                    oids: [pk],
                }
            });
            break;
        //头部 附件
        case ENCLOSURE_BTN:
            fileMgr.call(this);
            break;
        //头部 刷新
        case REFRESH_BTN:
            getCardData.call(this,this.cardUrl, props.getUrlParam('id'), true, true);
            break;
        default:
            break;
    }
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
function add (props, status) {
    props.setUrlParam({status});
    props.initMetaByPkorg();
    clearAll.call(this, props);
    initTemplate.call(this, props);
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit (props, type) {
    props.setUrlParam({status: type});
    buttonVisible.call(this, props);
    setEditStatus.call(this, type);
    orgVersionView(this.props, this.formId);//组织版本视图
    props.resMetaAfterPkorgEdit();
    props.form.setFormItemsDisabled(this.formId, {pk_org:true});
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel (props) {
    let id= props.getUrlParam('id');
    props.setUrlParam({status: 'browse'});
    if (id) {
        getCardData.call(this, this.cardUrl, id, false, true);
        setEditStatus.call(this, 'browse');
        buttonVisible.call(this, props);
    } else {
        clearAll.call(this, props);
    }
}

/**
 * 保存
 * @param {*} props  页面内置对象
 * @param {*} type   save保存、add保存新增、commit保存提交
 */
function saveBill (props, type) {
    let flagForm = this.props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
    if (!flagForm) {
        return;
    }
    let data = this.props.createExtCardData(this.pageId, this.formId);
    //console.log(data, this.props.meta.getMeta(), 'data');
    let billdata = props.form.getAllFormValue(this.formId);
	let validateData = {
		pageid: pageCode,
		model: {
			areacode: form02,
			rows: billdata.rows,
			areaType: 'form'
		}
	}
    let saveobj = {};
	saveobj[this.formId] = 'form';
    props.validateToSave(validateData, () => saveOperation.call(this, props, data, type), saveobj, ''); 
}

function saveOperation (props, data, type) {
    let isAdd= this.props.getUrlParam('status') === 'add' || this.props.getUrlParam('status') === 'copy';
    ajax({
        url: `${baseReqUrl}${javaUrl.save}.do`,
        data,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    let id= res.data.head[this.formId].rows[0].values[this.primaryId].value;
                    let ts= res.data.head[this.formId].rows[0].values.ts.value;
                    this.idTs= {id, ts};
                    toast({ color: 'success', content: this.state.json['36362IDA-000011'] });/* 国际化处理： 保存成功*/
                    // 缓存
                    if (isAdd) {
                        addCache(id, res.data, this.formId, this.dataSource);
                        addCache(id, res.data, this.formId, this.cache);
                    } else {
                        updateCache(this.primaryId, id, res.data, this.formId, this.dataSource);
                        updateCache(this.primaryId, id, res.data, this.formId, this.cache);
                    }
                    if (type=== 'add') {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        buttonVisible.call(this, this.props);
                        let addqdata = {pk: null};
                        ajax({
                            url: `${baseReqUrl}${javaUrl.addpermission}.do`,
                            data: addqdata,
                            success: (res) => {
                                if (res.success) {
                                    props.setUrlParam({
                                        id,// zhengwei_保存新增之后取消，页面没有加载上一条数据
                                        status: 'add'
                                    });
                                    add.call(this, props, 'add');
                                }else{
                                    props.setUrlParam({
                                        id,
                                        status: 'browse'
                                    });
                                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                                    buttonVisible.call(this, this.props);
                                }
                            }
                        });
                    } else if (type=== 'commit') {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        this.btnOperation(javaUrl.commit, this.state.json['36362IDA-000017'], res.data.head[this.formId].rows[0].values[this.primaryId].value);/* 国际化处理： 提交成功!*/
                    }  else {
                        props.setUrlParam({
                            id,
                            status: 'browse'
                        });
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        buttonVisible.call(this, this.props);
                    }
                }
            }
        }
    });  
}

/**
 * 清空所有的数据
 * @param {*} props  页面内置对象
 */
export function clearAll (props) {
    props.form.EmptyAllFormValue(this.formId);
    buttonVisible.call(this, props);
    orgVersionView(this.props, this.formId);//组织版本视图
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 */
export function setEditStatus (status) {
    this.props.form.setFormStatus(this.formId, status);
}

/**
 * 附件管理
 */
function fileMgr () {
    let billId= this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    let billNo= this.props.form.getFormItemsValue(this.formId, 'applycode').value;
    this.showUploader= !this.showUploader;
    this.billInfo= {billId, billNo};
    this.forceUpdate();
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/