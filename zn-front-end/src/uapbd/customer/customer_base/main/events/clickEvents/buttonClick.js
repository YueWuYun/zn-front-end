//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
//按钮点击事件
import { base, ajax, toast, print, output, printer, getBusinessInfo, cardCache } from 'nc-lightapp-front';
const { setDefData } = cardCache;
import manageModePlugIn from '../../../../../public/utils/ManageModeUtils';
import confirmUtil from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
import Utils from '../../../../../public/utils/index';
const { queryToastFunc } = Utils;
import getAssignOrgdata from "../../../checkAssignOrg/function/getAssignOrgdata";

const ajaxurl = {
    'batchFreeze': '/nccloud/uapbd/customer/batchFreezeCust.do',
    'printUrl': '/nccloud/uapbd/customer/mainPrint.do'
}
export default function onClickButton(props, id) {
    let { searchId, gridId, NODE_TYPE, searchId_modal, appcode } = props.config;
    let editurl = props.config.pushCardUrl;
    let { PermissionOrgIDs } = this.state.context;
    let meta, pk_orgitem;
    let pks = [];
    //获取选中行数据
    let rowsdata = props.table.getCheckedRows(gridId);
    let alldata = props.table.getAllTableData(gridId);
    //列表支持排序打印
    var tableorder = this.props.table.getSortParam(gridId);
    //不需要选中数据能操作的按钮
    let notNeedCheckBtns = ['btnAdd', 'btnRefrensh', 'btnCheck', 'guideDistrib', 'btnCheckOrgbase', 'btnPrint', 'print', 'output', 'btnGuideEdit', 'import', 'export','exportcustadd','importcustadd'];
    //需要管控模式的按钮
    let manageModebtns = ['btnListDel', 'btnDistrib', 'distrib', 'undistrib', 'btnEnable', 'listEnable', 'listDisable', 'btnFreeze', 'listFreeze', 'listUnFreeze'];
    if (!notNeedCheckBtns.includes(id)) {
        if (rowsdata.length === 0) {
            toast({ color: 'warning', title: this.state.json['10140CUST-000019'] });/* 国际化处理： 请选择数据操作！*/
            return;
        } else {
            if (manageModebtns.includes(id)) {
                let pk_org = rowsdata[0].data.values.pk_org.value;
                let pk_group = rowsdata[0].data.values.pk_group.value;
                let rem = manageModePlugIn.call(this, NODE_TYPE, pk_org, pk_group, PermissionOrgIDs, getBusinessInfo().groupId);
                if (!rem.editFlag) {
                    toast({
                        'color': 'warning',
                        'content': rem.message
                    });
                    return;
                }
            }
        }
    }
    switch (id) {
        case 'btnAdd':
            //新增
            this.beforeAddCopy(props, () => {
                props.pushTo(editurl, {
                    status: 'add',
                    appcode: props.config.appcode,
                    pagecode: this.props.config.pagecodecard,
                    id: alldata.rows.length === 0 ? '' : alldata.rows[alldata.rows.length - 1].values.pk_customer.value
                });
            });
            break;
        case 'btnListDel':
            let candeleterows = [];
            rowsdata && rowsdata.map((r) => {
                if (!!r.data.values.pk_supplier.value && r.data.values.issupplier.value) {
                    //数据是供应商不能删除过滤掉
                } else {
                    candeleterows.push(r);
                }
            });
            if (candeleterows.length === 0) {
                toast({ content: this.state.json['10140CUST-000186'], color: 'warning' });
                return;
            }
            this.setState({
                deleteRecord: candeleterows
            }, () => {
                this.DeleteDialog.showDialog();
            });
            break;
        case 'batchedit':
        case 'btnBatchEdit':
            //批量修改
            this.batchEditModal.show(rowsdata);
            break;
        case 'btnGuideEdit':
            //向导修改
            this.batchEditStepModal.show();
            break;
        case 'btnDistrib':
        case 'distrib':
            //分配
            this.assignModal.show('assign');
            break;
        case 'undistrib':
            //取消分配
            this.assignModal.show('cancelAssign');
            break;
        case 'guideDistrib':
            //向导分配
            this.assignStepModal.show();
            break;
        case 'checkByOrg':
            //已经分配组织查询
            props.modal.show('checkAssignOrgModal');
            getAssignOrgdata.call(this, props, id, rowsdata[0].data.values.pk_customer
                // , () => {
                // queryToastFunc()(param)}
            );
            break;
        case 'btnFreeze':
            let canFreezeArr = [];
            rowsdata.length > 0 && rowsdata.map((row) => {
                if (!row.data.values.frozenflag.value) {
                    canFreezeArr.push(row.data.values.pk_customer.value);
                }
            });
            canFreezeArr.length > 0 && doEnableDisableFreezeUnFreeze.call(this, canFreezeArr, id, props, 'freeze', () => {
                this.loadGridData(this.getLoadParmData(props), this.setInitializeBtns.bind(this));
            });
            canFreezeArr.length > 0 || toast({
                color: 'danger',
                content: this.state.json['10140CUST-000069']/* 国际化处理： 已经冻结的数据，无法冻结！*/
            });
            break;
        case 'listUnFreeze':

            let canUnfreezeArr = [];
            rowsdata.length > 0 && rowsdata.map((row) => {
                if (row.data.values.frozenflag.value) {
                    canUnfreezeArr.push(row.data.values.pk_customer.value);
                }
            });
            canUnfreezeArr.length > 0 && doEnableDisableFreezeUnFreeze.call(this, canUnfreezeArr, id, props, 'freeze', () => {
                this.loadGridData(this.getLoadParmData(props), this.setInitializeBtns.bind(this));
            });
            canUnfreezeArr.length > 0 || toast({
                color: 'danger',
                content: this.state.json['10140CUST-000070']/* 国际化处理： 没有冻结的数据，无法解冻！*/
            });
            break;
        case 'btnCheck':
            //按组织查看
            props.modal.show('checkByOrg');
            break;
        case 'btnCheckOrgbase':
            //查看组织档案
            props.modal.show('checkOrgbase');
            break;
        case 'btnRefrensh':
            let searchData = props.search.getAllSearchData(searchId);
            if (typeof (searchData) !== 'undefined' && searchData && searchData.conditions) {
                setDefData('searchVal', props.config.datasource, searchData);
                this.loadGridData(this.getLoadParmData(props), () => {
                    this.setInitializeBtns();
                    toast({
                        color: 'success',
                        title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                    })
                });
            } else {
                return;
            }
            break;
        case 'btnPrint':
        case 'print':
            
            if(this.state.allpks.length === 0){
                toast({ 'color': 'danger', 'content': this.state.json['10140CUST-000029'] });/* 国际化处理： 请查询打印数据！*/
                return;
            }
            if(this.state.allpks.length > 16000){
                toast({ 'color': 'danger', 'content': this.state.json['10140CUST-000191'] });/* 国际化处理： 打印数据不能超过16000条！*/
                return;
            }
            // alldata.rows.forEach((item, index) => {
            //     pks.push(item.values.pk_customer.value);
            // });

            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                ajaxurl.printUrl,
                {
                    funcode: '10140CUB',
                    nodekey: 'baselist',
                    oids: this.state.allpks,
                    userjson: `{order:${tableorder && tableorder.sortParam[0].order},field:${tableorder && tableorder.sortParam[0].field}}`,
                    appcode: '10140CUB'
                }
            );
            break;
        case 'output':
            if (alldata.rows.length === 0) {
                toast({ 'color': 'danger', 'content': this.state.json['10140CUST-000029'] });/* 国际化处理： 请查询打印数据！*/
                return;
            }
            alldata.rows.forEach((item, index) => {
                pks.push(item.values.pk_customer.value);
            });
            output({
                url: ajaxurl.printUrl,
                data: {
                    funcode: '10140CUB',  //全局集团组织打印模板相同    //功能节点编码，即模板编码
                    nodekey: 'baselist',
                    userjson: `{order:${tableorder && tableorder.sortParam[0].order},field:${tableorder && tableorder.sortParam[0].field}}`,
                    oids: pks,
                    outputType: 'output'
                }
            });
            break;
        case 'export':
            this.setState({
                billType:this.props.config.billType

            }, () => {
                this.props.modal.show('exportFileModal');
            });
            break;
        case 'btnEnable':
            let canEnableArr = [];
            rowsdata.length > 0 && rowsdata.map((row) => {
                if (row.data.values.enablestate.value != '2') {
                    canEnableArr.push(row.data.values.pk_customer.value);
                }
            });
            canEnableArr.length > 0 && doEnableDisableFreezeUnFreeze.call(this, canEnableArr, id, props, 'enable', () => {
                this.loadGridData(this.getLoadParmData(props), this.setInitializeBtns.bind(this));
            });
            canEnableArr.length > 0 || toast({
                color: 'danger',
                content: this.state.json['10140CUST-000067']/* 国际化处理： 已经启用的数据，无法启用！*/
            });
            break;
        case 'listDisable':
            let canDisableArr = [];
            rowsdata.length > 0 && rowsdata.map((row) => {
                if (row.data.values.enablestate.value == '2') {
                    canDisableArr.push(row.data.values.pk_customer.value);
                }
            });
            canDisableArr.length > 0 && doEnableDisableFreezeUnFreeze.call(this, canDisableArr, id, props, 'enable', () => {
                this.loadGridData(this.getLoadParmData(props), this.setInitializeBtns.bind(this));
            });
            canDisableArr.length > 0 || toast({
                color: 'danger',
                content: this.state.json['10140CUST-000068']/* 国际化处理： 已经停用的数据，无法停用！*/
            });
            break;
        case 'btnBatchGenerateSup':

            let returnObj = processModalContent.call(this, rowsdata);

            returnObj.cannotGenerate.length > 0 && confirmUtil.call(this, {
                'title': this.state.json['10140CUST-000095'],/* 国际化处理： 询问？*/
                'content': returnObj.modalContent,
                beSureBtnClick: () => {
                    returnObj.canGenerPk.length > 0 && ajax({
                        url: '/nccloud/uapbd/customer/batchGenerate.do',
                        data: {
                            pkcustList: returnObj.canGenerPk,
                            actionName: id
                        },
                        success: (res) => {
                            let { data } = res;
                            if (data) {
                                confirmUtil.call(this, {
                                    title: this.state.json['10140CUST-000025'],/* 国际化处理： 询问*/
                                    content: processResData.call(this, data),
                                    beSureBtnClick: () => {
                                        this.loadGridData(this.getLoadParmData(props), this.setInitializeBtns.bind(this));
                                    },
                                    cancelBtnClick: () => {
                                        this.loadGridData(this.getLoadParmData(props), this.setInitializeBtns.bind(this));
                                    }
                                });
                            } else {
                                //批量生成成功或失败返回的data都不可能为空
                                //所以正常情况不会走进这里
                                //如果走进这里可能是后台有为空的地方 return null了
                                // toast({
                                //     color: 'success',
                                //     content: this.state.json['10140CUST-000126']/* 国际化处理： 批量生成供应商成功！*/
                                // });


                            }


                        }
                    });
                }
            });
            returnObj.cannotGenerate.length > 0 || ajax({
                url: '/nccloud/uapbd/customer/batchGenerate.do',
                data: {
                    pkcustList: returnObj.canGenerPk,
                    actionName: id
                },
                success: (res) => {
                    let { data } = res;
                    if (data) {
                        confirmUtil.call(this, {
                            title: this.state.json['10140CUST-000025'],/* 国际化处理： 询问*/
                            content: processResData.call(this, data),
                            beSureBtnClick: () => {
                                this.loadGridData(this.getLoadParmData(props), this.setInitializeBtns.bind(this));

                            },
                            cancelBtnClick: () => {
                                this.loadGridData(this.getLoadParmData(props), this.setInitializeBtns.bind(this));
                            }
                        });
                    } else {
                        //批量生成成功或失败返回的data都不可能为空
                        //所以正常情况不会走进这里
                        //如果走进这里可能是后台有为空的地方 return null了
                        // toast({
                        //     color: 'success',
                        //     content: this.state.json['10140CUST-000126']/* 国际化处理： 批量生成供应商成功！*/
                        // });

                    }

                }
            });
            break;
        case 'exportcustadd'://导出模板前需清空exportIds
            let billtype = 'custaddress';
            if ('10140CUG' === this.props.config.appcode) {
                billtype = 'custaddress';

            } else if ('10140CUB' === this.props.config.appcode) {
                billtype = 'custaddress_glb';

            } else if ('10140CUO' === this.props.config.appcode) {
                billtype = 'custaddress_org';

            }
            this.setState({
                billType: billtype,
            }, () => {
                this.props.modal.show('exportFileModal');
            });
            break;
        default:
            break;
    }
}

function doEnableDisableFreezeUnFreeze(pks, id, props, btnflag, callback) {
    let modalContent = btnflag === 'enable' ?
        id === 'listDisable' ?
            { content: this.state.json['10140CUST-000084'], title: this.state.json['10140CUST-000127'] } : { content: this.state.json['10140CUST-000086'], title: this.state.json['10140CUST-000128'] } :/* 国际化处理： 确定停用,停用成功!,确定启用,启用成功!*/
        id === 'listUnFreeze' ?
            { content: this.state.json['10140CUST-000088'], title: this.state.json['10140CUST-000129'] } : { content: this.state.json['10140CUST-000090'], title: this.state.json['10140CUST-000130'] };/* 国际化处理： 确定解冻,解冻成功!,确定冻结,冻结成功!*/
    confirmUtil.call(this, {
        title: modalContent.content,
        content: modalContent.content + this.state.json['10140CUST-000092'],/* 国际化处理： 所选数据？*/
        beSureBtnClick: () => {
            ajax({
                url: btnflag === 'enable' ?
                    '/nccloud/uapbd/customer/enableCust.do' :
                    '/nccloud/uapbd/customer/batchFreezeCust.do',
                data: {
                    pkcustList: pks,
                    actionName: id
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', title: modalContent.title });
                        callback.call(this);
                    }
                }
            });
        }
    });

}

function processModalContent(rowsdata) {

    let canGenerate = [];
    let cannotGenerate = [];
    let canGenerPk = [];

    let modalContent = `${this.state.json['10140CUST-000131']}，${this.state.json['10140CUST-000132']}，${this.state.json['10140CUST-000133']}：\r\n`/* 国际化处理： 所选客户已是客商,不能重复生成,本次操作将不处理以下客户*/
    rowsdata.map((item) => {
        if (!item.data.values.pk_supplier.value) {
            canGenerate.push(item.data);
            canGenerPk.push(item.data.values.pk_customer.value);
        } else {
            cannotGenerate.push(item.data);
            modalContent += `${this.state.json['10140CUST-000134']} [${item.data.values.code.value}],${this.state.json['10140CUST-000135']} [${item.data.values.name.value}]\r\n`;/* 国际化处理： 客户编码,客户名称*/
        }
    });
    modalContent += `${this.state.json['10140CUST-000136']}${canGenerate.length}${this.state.json['10140CUST-000137']}？\r\n`;/* 国际化处理： 是否处理余下,条记录*/

    return {
        modalContent: modalContent,
        cannotGenerate: cannotGenerate,
        canGenerPk: canGenerPk,
        canGenerate: canGenerate,
    }

}

function processResData(data) {
    let { returnValue, errorLogResult, totalNum } = data;
    let { errorMessagegNum, errorLog, errorMsgs } = errorLogResult;
    let headContent = `${errorLog.operationtype}${this.state.json['10140CUST-000138']}，${this.state.json['10140CUST-000139']}${totalNum}${this.state.json['10140CUST-000140']}，${this.state.json['10140CUST-000141']}${errorMessagegNum}${this.state.json['10140CUST-000142']}`/* 国际化处理： 部分成功,共处理了,条数据,其中,条处理失败*/
    let bodyContent = ``;
    for (let i = 0; i < errorMessagegNum; i++) {
        bodyContent += ` ${errorMsgs[i].errormsg}`
    }
    return (
        <div>
            <p>{headContent}</p>
            <p>{bodyContent}</p>
        </div>
    )
}


//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS