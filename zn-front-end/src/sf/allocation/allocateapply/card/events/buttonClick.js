/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, base, toast, print, cacheTools, cardCache, promptBox, output } from 'nc-lightapp-front';
import { card_page_id, card_table_id, base_url, printParameter, card_from_id, dataSource, app_code } from '../../cons/constant.js';
import { InnerAccoutDialog } from '../../../../../tmpub/pub/inneraccount/list/index.js';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator, showTBBMsg } from '../../../../pub/utils/SFButtonUtil.js';
// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
let { getNextId, getCurrentLastId, deleteCacheById, getCacheById, updateCache, addCache, setDefData, getDefData } = cardCache;
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index.js";
import initTemplate from './initTemplate.js';
import { setPropCache, saveMultiLangRes, loadMultiLang, createSimpleBillData } from "../../../../../tmpub/pub/util/index";
import { repaintView, setCardShouderBtnUseful, clsRowno } from '../../util/index';
let that = this;
export default function buttonClick(props, id) {
    const pk_allocateapply_h = props.form.getFormItemsValue(this.formId, 'pk_allocateapply_h').value;
    const ts = props.form.getFormItemsValue(this.formId, 'ts').value;
    const billnoe = props.form.getFormItemsValue(this.formId, 'vbillno').value;
    const billstatus = props.form.getFormItemsValue(this.formId, 'billstatus').value;
    //获取表体行所有数据
    let checkAllCardDate = this.props.cardTable.getAllRows(card_table_id, false);
    // if (props.cardTable.getVisibleRows(card_table_id).length > 0) {
    //     const checkeddata = props.cardTable.getCheckedRows(card_table_id); //获取当前选中行数据
    // }
    var id;
    const cardData = props.createMasterChildData(card_page_id, this.formId, this.tableId);//页面所有数据
    let urlExtParam = {};
    //begin 适配验证公式添加
    let saveDataForValidate = createSimpleBillData(props, card_page_id, card_from_id, card_table_id, false);
    let saveaddobjForValidate = {};
    //end
    switch (id) {
        case 'Save':
            orgVersionView(props, card_from_id);
            props.validateToSave(saveDataForValidate, this.saveBill.bind(this), saveaddobjForValidate, '');
            break
        case 'Add':
            //设置新增时显示“增行、删行、复制行” 不显示“粘贴”，防止只点击复制行后保存，然后再次新增时表体肩部按钮显示错误的问题
            this.setState({
                pasteflag: false
            });
            props.pushTo('/card', {
                pagecode: card_page_id,
                status: 'add',
                interfaceJump: 'card',
                id: props.getUrlParam('id'),
            })
            initTemplate.call(this, props);
            props.form.EmptyAllFormValue(card_from_id);
            props.cardTable.setTableData(card_table_id, { rows: [] });
            orgVersionView(props, card_from_id);
            this.toggleShow();
            break;
        case 'Edit':
            let editData = {
                pks: [pk_allocateapply_h],
                ts: ts && ts.value,
                pageid: card_page_id,
                status: 'edit',
            }
            ajax({
                url: '/nccloud/sf/allocateapply/queryPageCard.do',
                data: editData,
                success: (res) => {
                    if (res.data.head[this.formId].rows[0].values.billstatus.value === '5') {
                        if (res.data) {
                            props.pushTo("/card", {
                                status: 'edit',
                                id: this.props.getUrlParam('id')
                            });
                            if (res.data.head) {
                                this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                                //页签赋值
                                let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
                                this.setState({
                                    vbillno: vbillno.value,
                                    pasteflag: false
                                });
                                updateCache('pk_allocateapply_h', res.data.head[this.formId].rows[0].values.pk_allocateapply_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
                            }
                            if (res.data.body) {
                                this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                            }
                            this.toggleShow();
                        }
                        //设置组织不可以编辑
                        initTemplate.call(this, props);
                        this.props.resMetaAfterPkorgEdit();
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
                    } else {
                        toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000073') });/* 国际化处理： 该单据已经被他人修改，请刷新界面，重做业务。*/
                    }
                }
            });
            break;
        case 'Copy':
            //设置新增时显示“增行、删行、复制行” 不显示“粘贴”，防止只点击复制行后保存，然后再次新增时表体肩部按钮显示错误的问题
            this.setState({
                pasteflag: false
            });
            props.pushTo('/card', {
                status: 'copy',
                id: props.getUrlParam('id')
            });
            this.refresh();
            break;
        case 'Cancel':
            //考虑复制进入编辑状态后地址栏没有主键信息，故，在复制操作的时候将主键存储在局部变量id中
            promptBox({
                color: "warning",
                title: loadMultiLang(props, '36320AA-000002'),/* 国际化处理： 取消*/
                content: loadMultiLang(props, '36320AA-000009'),/* 国际化处理： 是否确认取消？*/
                beSureBtnClick: cancelConfirm.bind(this, props)
            })
            this.toggleShow();
            break;
        case 'Delete':
            // this.props.modal.show('delete');
            promptBox({
                color: "warning",
                title: loadMultiLang(this.props, '36320AA-000032'),// 国际化处理： 删除
				content: loadMultiLang(this.props, '36320AA-000033'),// 国际化处理： 确定要删除吗？
                beSureBtnClick: delconfirm.bind(this, props)
            })
            break;
        //附件管理
        case 'Enclosure':
            this.setState({
                billId: pk_allocateapply_h, //单据id
                billno: billnoe, // 单据编号
                showUploader: !this.state.showUploader,
                target: null
            })
            break;
        case 'Commit'://提交
            cardOperator(props, card_page_id, card_from_id, [card_table_id],
                'pk_allocateapply_h', base_url + 'commit.do', loadMultiLang(props, '36320AA-000048'), dataSource, commitAssign.bind(this));/* 国际化处理： 提交成功！*/
            break;
        case 'SaveCommit'://保存提交
            props.validateToSave(saveDataForValidate, saveCommitForValidate.bind(this, props), saveaddobjForValidate, '');   

            break;
        //保存新增
        case 'SaveAdd':
            orgVersionView(props, card_from_id);

            let saveaddData = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
            let saveaddobj = {};
            saveaddobj[card_table_id] = 'cardTable';
            // 验证公式
            props.validateToSave(saveaddData, saveAdd.bind(this, that, props), saveaddobj, '');
            //            saveAdd.call(this, that, props);
            break;
        case 'Uncommit'://收回     
            cardOperator(props, card_page_id, card_from_id, [card_table_id],
                'pk_allocateapply_h', base_url + 'uncommit.do', loadMultiLang(props, '36320AA-000049'), dataSource, this.toggleShow.bind(this));/* 国际化处理： 收回成功！*/
            break;
        //委托办理
        case 'Entrust':
            cardOperator(props, card_page_id, card_from_id, [card_table_id], 'pk_allocateapply_h',
                base_url + 'submit.do', loadMultiLang(props, '36320AA-000050'), dataSource, this.toggleShow.bind(this));/* 国际化处理： 委托办理成功！*/
            break;
        //取消委托
        case 'CancelEntrust':
            cardOperator(props, card_page_id, card_from_id, [card_table_id], 'pk_allocateapply_h',
                base_url + 'unsubmit.do', loadMultiLang(props, '36320AA-000002'), dataSource, this.toggleShow.bind(this));/* 国际化处理： 取消委托成功！*/
            break;
        //打印
        case 'Print':
            if (!this.props.form.getFormItemsValue(this.formId, 'pk_allocateapply_h').value) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000015') });/* 国际化处理： 操作失败，无数据!*/
                return;
            }
            print(
                printParameter.prinType,  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                printParameter.actionUrl,
                {
                    // billtype: printParameter.billtype,  //单据类型
                    // funcode: printParameter.funcode, //功能节点编码，即模板编码
                    nodekey: printParameter.nodekey,     //模板节点标识
                    // printTemplateID: printParameter.printTemplateID, //模板id
                    appcode: app_code,
                    oids: [this.props.form.getFormItemsValue(this.formId, 'pk_allocateapply_h').value]
                }
            );
            break;
        //输出    
        case 'Output':
            if (!this.props.form.getFormItemsValue(this.formId, 'pk_allocateapply_h').value) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000015') });/* 国际化处理： 操作失败，无数据!*/
                return;
            }
            output({
                url: '/nccloud/sf/allocateapply/allocateapplyprint.do',
                data: {
                    // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,  
                                //功能节点编码，即模板编码
                    appcode: app_code,
                    //模板节点标识
                    nodekey: printParameter.nodekey, 
                    oids: [this.props.form.getFormItemsValue(this.formId, 'pk_allocateapply_h').value],
                    outputType: 'output'
                }
            });
            // this.refs.printOutput.open();
            // this.setState(
            //     {
            //         outputData: {
            //             // funcode: printParameter.funcode, //功能节点编码，即模板编码
            //             // nodekey: printParameter.nodekey, //模板节点标识
            //             // printTemplateID: printParameter.printTemplateID, //模板id
            //             oids: [this.props.form.getFormItemsValue(this.formId, 'pk_allocateapply_h').value],
            //             outputType: 'output'
            //         }//打印输出使
            //     },
            //     () => {
            //         this.refs.printOutput.open();
            //     }
            // );
            break;
        //联查 内部账户余额
        case 'InsideAccount':
            let accountbalance_busitype = this.props.form.getFormItemsValue(this.formId, 'busitype');
            if (accountbalance_busitype && accountbalance_busitype.value && accountbalance_busitype.value != 2) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000016') });/* 国际化处理： 非中心上收的单据不能联查内部账户余额!*/
                return;
            }
            let InsideAccountCheckeddata = props.cardTable.getCheckedRows(card_table_id);
            if (InsideAccountCheckeddata && InsideAccountCheckeddata.length != 1) {
                toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000017') });/* 国际化处理： 请选择1条子表数据*/
                return;
            }
            let pkAccount = InsideAccountCheckeddata[0].data.values.pk_accid.value;
            this.setState({ accModalShow: true, currentpk: pkAccount })
            break;
        //联查 收款银行账户余额  pk_bankacc_r
        case 'ReceiveAccount':
            //当前选择的表体数据
            let ReceiveAccountCheckeddata = props.cardTable.getCheckedRows(card_table_id);
            let bankaccbalance_rarr = [];
            let restpk_org_r, pk_bankacc_r;
            if (this.props.form.getFormItemsValue(this.formId, 'pk_org')
                && this.props.form.getFormItemsValue(this.formId, 'pk_org').value) {
                restpk_org_r = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
            }
            if (checkAllCardDate.length > 1) {
                if (ReceiveAccountCheckeddata.length != 1) {
                    // toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028') });/* 国际化处理： 请选择一条表体数据操作！*/
                    toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000018') });/* 国际化处理： 请选择一条表体数据操作！*/
                    return;
                } else {
                    //处理选择数据
                    ReceiveAccountCheckeddata.forEach((val) => {
                        if (val.data.values.pk_bankacc_r
                            && val.data.values.pk_bankacc_r.value) {
                            pk_bankacc_r = val.data.values.pk_bankacc_r.value;
                        }
                        let bankaccbalance_rdata = {
                            // 财务组织
                            pk_org: restpk_org_r,
                            // 银行账户id
                            pk_account: pk_bankacc_r,
                        };
                        bankaccbalance_rarr.push(bankaccbalance_rdata);
                    });
                }
            } else {//当只有一行表体数据时
                if (checkAllCardDate[0].values.pk_bankacc_r
                    && checkAllCardDate[0].values.pk_bankacc_r.value) {
                    pk_bankacc_r = checkAllCardDate[0].values.pk_bankacc_r.value;
                }
                let bankaccbalance_rdata = {
                    // 财务组织
                    pk_org: restpk_org_r,
                    // 银行账户id
                    pk_account: pk_bankacc_r,
                };
                bankaccbalance_rarr.push(bankaccbalance_rdata);
            }
            this.setState({
                showOriginalData: bankaccbalance_rarr,
                showOriginal: true,
            });
            break;
        //联查 计划预算
        case 'Plan':
            let queryntbplanData = this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
            ajax({
                url: '/nccloud/sf/allocateapply/allocateapplylinkplan.do',
                data: queryntbplanData,
                success: (res) => {
                    if (res.success) {
                        if (res.data && res.data.hint) {
                            toast({ color: 'warning', content: res.data.hint });
                            return;
                        } else {
                            this.setState({
                                showNtbDetail: true,
                                ntbdata: res.data
                            });
                        }
                    }
                }
            });
            break;
        //联查回单
        case 'ReturnBill':
            let linkquerytype;
            let pk_allocateapplys = [];
            //未处理完的单据 不联查
            if (this.props.form.getFormItemsValue(this.formId, 'billstatus').value != 4) {
                toast({ color: 'info', content: loadMultiLang(props, '36320AA-000019') });/* 国际化处理： 请选择处理完毕的单据进行联查。*/
                return;
            }
            //先看是否选择了表体行
            let reBillCheckedData = props.cardTable.getCheckedRows(card_table_id);
            debugger
            if (!reBillCheckedData || reBillCheckedData.length == 0 || reBillCheckedData.length > 1) {
                //用表头进行联查
                linkquerytype = 'LinkQuery_Apply_H';
                pk_allocateapplys.push(pk_allocateapply_h);
            } else {
                if (reBillCheckedData.length != 1) {
                    toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000018') });/* 国际化处理： 请选择一条表体数据操作！*/
                    return;
                } else {
                    linkquerytype = 'LinkQuery_Apply_B';
                    pk_allocateapplys.push(reBillCheckedData[0].data.values.pk_allocateapply_b.value);
                }
            }

            urlExtParam = {
                status: 'browse',
                srcbillid: [pk_allocateapplys],
                linkquerytype: linkquerytype,//4
            };
            linkApp(props, '36K8', urlExtParam);
            break;

        //联查 审批详情
        case 'ApproveInfoInner':
            if (pk_allocateapply_h) {
                this.setState({
                    showApprove: true,
                    approveBilltype: '36K1',//单据类型
                    approveBillId: pk_allocateapply_h//单据pk
                });
            }
            break;
        //刷新
        case 'Refresh':
            this.refresh();
            break;

            /**
             * 表体肩部按钮
             */
            let pk_org;
        //table新增行
        case 'AddLine':
            pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
            //添加pk_group用于后台精度处理
            let pk_group = props.form.getFormItemsValue(this.formId, 'pk_group').value;
            //获取当前table行数
            let rownum_addline = props.cardTable.getNumberOfRows(this.tableId);
            if (pk_org) {
                // props.cardTable.addRow(this.tableId);
                //保存时需要校验一些数值 在table为null时无法赋值 故在此处复制
                //pk_org 为后台处理数据精度时需要
                props.cardTable.addRow(
                    card_table_id,
                    rownum_addline,
                    {
                        'pk_org': { value: pk_org },
                        'pk_financeorg_r': { value: pk_org },
                        'pk_group': { value: pk_group }
                    },
                    true);
                if (props.form.getFormItemsValue(this.formId, 'busitype').value === '2') {//中心下拨 给内部账户赋值
                    //先从缓存中取值
                    let accidData = getDefData('accidData', dataSource);
                    if (accidData != null) {
                        props.cardTable.setValByKeyAndIndex('table_allocateapply_01', rownum_addline, 'pk_accid',
                            { value: accidData.split(',')[0], display: accidData.split(',')[1] });
                    }
                }
                //给行号赋值
                // clsRowno(props, card_table_id);
            } else {
                toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000020') });/* 国际化处理： 请先填写财务组织！*/
            }
            break;
        //table删除行
        case 'DeleteLine':
            // pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
            // if (pk_org) {
            //     let currRows = props.cardTable.getCheckedRows(card_table_id);
            //     let currSelect = [];
            //     if (currRows && currRows.length > 0) {
            //         for (let item of currRows) {
            //             currSelect.push(item.index);
            //         }
            //     }
            //     if (currRows.length === 0) {
            //         toast({ color: 'warning', content: '未选择数据!' });
            //     }
            //     props.cardTable.delRowsByIndex(card_table_id, currSelect);
            // } else {
            //     toast({
            //         'color': 'warning',
            //         'content': '请先填写财务组织！'
            //     });
            //     return;
            // }
            BatchDelLine(props, card_table_id);
            props.button.setButtonDisabled(['DeleteLine', 'CopyLine'], true);
            break;
        //table 复制行  
        case 'CopyLine':
            pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
            if (pk_org) {
                let currRowsCopyLine = props.cardTable.getCheckedRows(card_table_id);
                if (currRowsCopyLine && currRowsCopyLine.length > 0) {
                    this.setState({ pasteflag: true }, () => {
                        this.toggleShow();
                    });
                } else {
                    toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000021') });/* 国际化处理： 未选择数据!*/
                    return;
                }
            } else {
                toast({
                    'color': 'warning',
                    'content': loadMultiLang(props, '36320AA-000020')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            // props.button.setButtonVisible(['CopyLine', 'AddLine', 'DeleteLine'], false);
            // props.button.setButtonVisible(['PasteLine', 'CencelLine'], true);
            break;
        //粘贴至末行    
        case 'CopyLastLine':
            let selectRows = props.cardTable.getCheckedRows(this.tableId);
            if (selectRows == null || selectRows.length == 0) {
                toast({
                    'color': 'warning',
                    'content': loadMultiLang(props, '36320AA-000008')/* 国际化处理： 未选中要复制的行。*/
                });
                return false;
            }
            // 粘贴末行位置index
            let copyindex = props.cardTable.getNumberOfRows(this.tableId, false);
            let selectCopyData = [];
            let selectRowCopy = JSON.parse(JSON.stringify(selectRows));
            for (let item of selectRowCopy) {
                item.data.selected = false;
                item.data.values.pk_allocateapply_b = {
                    value: null,
                    display: null
                };
                selectCopyData.push(item.data);
            }
            props.cardTable.insertRowsAfterIndex(card_table_id, selectCopyData, copyindex);
            //给行号赋值
            // clsRowno(props, card_table_id);
            this.setState({ pasteflag: false }, () => { this.toggleShow() });
            break;
        //取消粘贴行    
        case 'CancelLine':
            this.setState({ pasteflag: false }, () => { this.toggleShow() });
            break;
    }
}

/**
 * 刷新
 * @param  props 
 */
const doRefresh = function (props) {
    this.refresh();
}

/**
 * 取消确认
 * @param {*} props 
 * @param {*} pk
 */
const cancelConfirm = function (props) {
    if (props.getUrlParam('status') === 'edit') {
        // 表单返回上一次的值
        props.form.cancel(this.formId)
        // 表格返回上一次的值
        props.pushTo("/card", {
            status: 'browse',
            id: props.getUrlParam('id'),
        });
        this.setState({ showNCbackBtn: true });
        this.toggleShow();
        this.refresh();
    }
    //保存中的取消操作
    else if (props.getUrlParam('status') === 'add') {
        // props.form.EmptyAllFormValue(this.formId)
        // props.cardTable.setTableData(this.tableId, { rows: [] });
        props.pushTo("/card", {
            id: props.getUrlParam('id'),
            status: 'browse',
        });
        this.setState({ showNCbackBtn: true });
        this.toggleShow();
        this.refresh();
        //清空table所有数据
        this.props.cardTable.setTableData(this.tableId, { rows: [] });
    }
    //复制中的取消操作
    else if (props.getUrlParam('status') === 'copy') {
        props.pushTo("/card", {
            id: props.getUrlParam('id'),
            status: 'browse',
        });
        // this.toggleShow();
        this.refresh();
    }
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
const save = async function (props, callback) {
    let hasTbbMsg = false;
    //缓存
    let { addCache, updateCache } = cardCache;
    let status = props.getUrlParam('status');
    //校验必输项
    let formcheck = props.form.isCheckNow(card_from_id);
    if (!formcheck) {
        return;
    }
    let tablecheck = props.cardTable.checkTableRequired(card_table_id);
    if (!tablecheck) {
        return;
    }
    //校验单据状态
    if (status != 'add' && status != 'edit' && status != 'copy') {
        toast({
            'color': 'warning',
            'content': loadMultiLang(props, '36320AA-000022')/* 国际化处理： 只有新增、修改或复制的单据才能进行此操作。*/
        });
        return;
    }
    let url = base_url;
    // 暂时不能用
    // let pageCode=props.getSearchParam('p');
    let pageCode = card_page_id;
    const that = this;
    //新增时保存
    if (status == 'add' || status == 'copy') {
        //对主键制空
        this.props.form.setFormItemsValue(card_from_id, { 'pk_allocateapply_h': { value: null, display: null } })
        //let saveaddData = this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
        let saveaddData = createSimpleBillData(this.props, card_page_id, card_from_id, card_table_id);
        //ca签名
        console.log(saveaddData, 'sign before saveaddData');
        let result = await Sign({ isSign: true, isKey: true, data: saveaddData, isSave: true, encryptVOClassName: 'nccloud.web.sf.allocate.allocateapply.vo.AllocateApplyEncryptVO4NCC' });
        if (result.isStop) {
            return;
        }
        saveaddData = result.data;
        console.log(saveaddData, 'sign after saveaddData');
        url = url + 'save.do';
        ajax({
            url: url,
            data: saveaddData,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    let { head, body } = data;
                    if (head) {
                        that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
                        //预算提示
                        hasTbbMsg = showTBBMsg(head, card_from_id);
                    }
                    if (body) {
                        that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
                    }
                    let pk = head[card_from_id].rows[0].values.pk_allocateapply_h.value;
                    let vbillno = head[card_from_id].rows[0].values.vbillno.value;
                    that.setState({
                        vbillno: vbillno
                    });
                    //现在是add状态 保存成功后要改为browse状态
                    that.props.setUrlParam({ status: 'browse', id: pk });
                    //保存成功放到缓存中
                    addCache(pk, res.data, card_from_id, dataSource);
                    setTimeout(() => {
                        props.setUrlParam({
                            status: 'browse',
                            id: pk
                        });
                        this.status = 'browse';
                        that.toggleShow();
                        if (callback) {
                            callback(props, data);
                        } else {
                            if (!hasTbbMsg) {
                                toast({ color: 'success', content: loadMultiLang(this.props, '36320AA-000023') });/* 国际化处理： 保存成功！*/
                                return;
                            }
                        }
                    }, 0);
                }
            }
        });

    }
    //修改时保存
    else if (status == 'edit') {
        let saveaddData = this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
        console.log(saveaddData, 'sign before saveaddData');
        let result = await Sign({ isSign: true, isKey: true, data: saveaddData, encryptVOClassName: 'nccloud.web.sf.allocate.allocateapply.vo.AllocateApplyEncryptVO4NCC' });
        if (result.isStop) {
            return;
        }
        saveaddData = result.data;
        console.log(saveaddData, 'sign after saveaddData');
        url = url + 'update.do';
        ajax({
            url: url,
            data: saveaddData,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    let { head, body } = data;
                    if (head) {
                        that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
                        //预算提示
                        hasTbbMsg = showTBBMsg(head, card_from_id);
                    }
                    if (body) {
                        that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
                    }
                    let pk = head[card_from_id].rows[0].values.pk_allocateapply_h.value;
                    let vbillno = head[card_from_id].rows[0].values.vbillno.value;
                    that.setState({
                        vbillno: vbillno
                    });
                    //现在是add状态 保存成功后要改为browse状态
                    that.props.setUrlParam({ status: 'browse', id: pk });
                    //保存成功放到缓存中
                    updateCache('pk_allocateapply_h', pk, res.data, card_from_id, dataSource);
                    setTimeout(() => {
                        props.setUrlParam({
                            status: 'browse',
                            id: pk
                        });
                        this.status = 'browse';
                        that.toggleShow();
                        if (callback) {
                            callback(props, data);
                        } else {
                            if (!hasTbbMsg) {
                                toast({ color: 'success', content: loadMultiLang(this.props, '36320AA-000023') });/* 国际化处理： 保存成功！*/
                                return;
                            }
                        }
                    }, 0);
                }
            }
        });
    }
}
/**
 * 保存新增
 * @param {*} props 
 */
const saveAdd = async function (that, props) {
    if (props.getUrlParam('status') === 'copy') {
        props.form.setFormItemsValue(card_from_id, { pk_allocateapply_h: null });
        props.form.setFormItemsValue(card_from_id, { ts: null });
    }
    let hasTbbMsg = false;
    let saveaddflag = props.form.isCheckNow(card_from_id);
    if (!saveaddflag) {
        return;
    }
    //table必输项校验
    let saveaddtableflag = this.props.cardTable.checkTableRequired(this.tableId);
    if (saveaddflag && saveaddtableflag) {
        let saveaddBeforePk = props.form.getFormItemsValue(card_from_id, 'pk_allocateapply_h');
        //let saveaddData = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
        let saveaddData = createSimpleBillData(props, card_page_id, card_from_id, card_table_id);
        console.log(saveaddData, 'sign before saveaddData');
        let result = await Sign({
            isSign: true, isKey: true, data: saveaddData, isSave: true,
            encryptVOClassName: 'nccloud.web.sf.allocate.allocateapply.vo.AllocateApplyEncryptVO4NCC'
        });
        if (result.isStop) {
            return;
        }
        saveaddData = result.data;
        console.log(saveaddData, 'sign after saveaddData');
        ajax({
            url: '/nccloud/sf/allocateapply/save.do',
            data: saveaddData,
            success: (res) => {
                if (res.success) {
                    if (res.data) {
                        if (res.data.head) {
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                            //预算提示
                            hasTbbMsg = showTBBMsg(res.data.head, card_from_id);
                            //页签赋值  保存新增时 不需要页签赋值
                            // let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
                            // this.setState({
                            //     vbillno: vbillno && vbillno.value
                            // });
                            if (saveaddBeforePk && saveaddBeforePk.value) {
                                updateCache('pk_allocateapply_h', res.data.head[this.formId].rows[0].values.pk_allocateapply_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
                            } else {
                                addCache(res.data.head[this.formId].rows[0].values.pk_allocateapply_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
                            }
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                        }
                        // 清空表单form所有数据
                        this.props.form.EmptyAllFormValue(card_from_id);
                        this.setState({
                            vbillno: '',
                            pasteflag: false
                        });
                        //清空table所有数据
                        this.props.cardTable.setTableData(card_table_id, { rows: [] });
                        //单据有主组织，新增时,将其他字段设置为不可编辑.
                        //                        this.props.initMetaByPkorg();
                        //把所有table中字段不可以编辑，直到选择org之后
                        //                        this.props.cardTable.setStatus(card_table_id, 'browse');
                        //设置组织可以编辑
                        //                        this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
                        this.props.setUrlParam({
                            status: 'add',
                            from: 'card',
                            interfaceJump: 'card'
                        });
                        //this.toggleShow();
                        this.componentDidMount();
                        if (!hasTbbMsg) {
                            toast({ color: 'success', content: loadMultiLang(this.props, '36320AA-000070') });/* 国际化处理： 新增保存成功！*/
                            return;
                        }
                    }
                }
            }
        });
    }


}

/**
 * 保存提交
 * @param {*} props 
 */
const saveCommitForValidate = function (props) {
    save.call(this, props, () => {
        cardOperator(props, card_page_id, card_from_id, [card_table_id], 'pk_allocateapply_h', base_url + 'commit.do', loadMultiLang(props, '36320AA-000011'), dataSource, commitAssign.bind(this));/* 国际化处理： 保存提交成功！*/
    })
  }

/**
 * 提交指派
 * @param {*} props 
 * @param {*} data 
 */
const commitAssign = function (props, data) {
    let { workflow } = data;
    //有指派信息，则指派，没有则重绘界面
    if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
        this.setState({ assignData: data, assignShow: data });
    } else {
        doRefresh.call(this, props)
    }
}

/**
 * 表格展开新增 给内部账户赋值
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} index 
 */
export const modelAddLineProcess = function (props, moduleId, index) {
    if (props.form.getFormItemsValue(this.formId, 'busitype').value === '2') {//中心下拨 给内部账户赋值
        index = index + 1;
        let flag = false;
        //先从缓存中取值
        let accidData = getDefData('accidData', dataSource);
        if (accidData != null) {
            props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_accid',
                { value: accidData.split(',')[0], display: accidData.split(',')[1] });
        }
    }
    //侧拉编辑时给pk_org,pk_group赋值，计算本币时需要用到 
    props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_org',
                { value:  props.form.getFormItemsValue(this.formId, 'pk_org').value});
    props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_group',
                { value:  props.form.getFormItemsValue(this.formId, 'pk_group').value}); 
}

//删除单据
export const delconfirm = function () {
		let { getNextId, deleteCacheById } = cardCache;
		let pkMapTs = {};
		let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_allocateapply_h').value;
		let ts = this.props.form.getFormItemsValue(card_from_id, 'ts').value;
		let backid = this.props.getUrlParam("id");
		pkMapTs[pk] = ts;
		ajax({
			url: base_url + 'batchdelete.do',
			data: {
				pkMapTs
			},
			success: () => {
				//删除成功
				let backnextId = getNextId(backid, dataSource);
				deleteCacheById('pk_allocateapply_h', backid, dataSource);
				if (backnextId) {
					this.props.setUrlParam({
						status: 'browse',
						id: backnextId
					});
					this.refresh();
				} else {
					this.props.pushTo("/card", {
						id: '',
						status: 'browse',
					});
					this.setState({ showNCbackBtn: true ,vbillno: null});
					this.toggleShow();
					this.refresh();
				}
				toast({ color: 'success', content: loadMultiLang(this.props, '36320AA-000028') });/* 国际化处理： 删除成功*/
			}
		});
	};
/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/