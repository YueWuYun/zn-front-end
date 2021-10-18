/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print,output, promptBox } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant.js';
import { loadMultiLang,go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { listMultiOperator } from '../../busbutton/listOperation';
import { buttonVisible } from './buttonVisible.js';
let {pageCodeCard, tableId,base_url,nodekey, app_code, pageCodeList ,FixedWithDrawApplyConst,pkname} = CONSTANTS;
export default function buttonClick(props, id, text, index) {
    switch (id) {
        //头部新增
        case 'Add':
            props.pushTo('/card', {
                pagecode: pageCodeCard,
                status: 'add'
            });
            break;
        //头部删除
        case 'Delete':
            promptBox({
                color: "warning",
                title: loadMultiLang(props, '36340FDWA-000013'),/* 国际化处理： 删除*/
                content: loadMultiLang(props, '36340FDWA-000012'),/* 国际化处理： 确认要删除吗?*/
                beSureBtnClick: delBill.bind(this, props)
            });	
            break;
        //头部 复制
        case 'Copy':
            let copyData = searchdata.call(this, props)[0];
            go2CardCheck({
                props,
                url: base_url + 'FDWAgotocardcheck.do',
                pk: copyData.data.values[pkname].value,
                ts: copyData.data.values['ts'].value,
                checkTS: copyData.data.values['ts'].value ? true : false,
                fieldPK: pkname,
                //动作编码（权限检查 空则不检查）
                actionCode:null,
                //权限编码（权限检查 空则不检查）
                permissionCode:null,
                //是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
                checkSaga : false,
                //是否进行ts检查（默认检查，非操作按钮导致的跳转不用检查）
                checkTS : copyData.data.values['ts'].value ? true : false,
                go2CardFunc: () => {
                    copyBill.call(this,props,copyData);
                }
            });
            break;
        //头部 刷新
        case 'Refresh':
            this.refresh();
            break; 
        //表体 提交
        case 'Commit':
            let CommitData = searchdata.call(this, props);
            listMultiOperator(props, pageCodeList,tableId,pkname,base_url + 'FDWDWACommitAction.do', loadMultiLang(this.props, '36340FDWA-000033'),FixedWithDrawApplyConst.dataSource,true,null,(props, data) => {
                if (!data) {
                    return; 
                }   
                if (Array.isArray(data)) {
                    data = data[0]; 
                }
                let { workflow } = data;
                //有指派信息，则指派，没有则重绘界面
                if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                    this.setState({
                        assignData: data,
                        assignShow: data,
                        index: CommitData[0].index,
                        ts:  CommitData[0].data.values['ts'].value,
                        billID:  CommitData[0].data.values['pk_fwithdrawapply'].value
                    });
                }else{
                    buttonVisible.call(this, this.props);
                }
            });
            break;
        //收回
        case 'UnCommit': 
            listMultiOperator(props, pageCodeList,tableId,pkname,base_url + 'FDWDWAUnCommitAction.do', loadMultiLang(this.props, '36340FDWA-000015'),FixedWithDrawApplyConst.dataSource,true,null);/* 国际化处理： 收回*/
            buttonVisible.call(this,this.props);
            break;
        //委托办理
        case 'Consign':
            listMultiOperator(props, pageCodeList,tableId,pkname,base_url + 'FDWDWAConsignAction.do', loadMultiLang(this.props, '36340FDWA-000030'),FixedWithDrawApplyConst.dataSource,true,null);/* 国际化处理：委托办理*/
            buttonVisible.call(this,this.props);
            break;
        //取消委托
        case 'UnConsign':
            listMultiOperator(props, pageCodeList,tableId,pkname,base_url + 'FDWDWAUnConsignAction.do', loadMultiLang(this.props, '36340FDWA-000031'),FixedWithDrawApplyConst.dataSource,true,null);/* 国际化处理：取消委托*/
            break;
        //附件管理
        case 'File':
            fileMgr.call(this, props);
            break;
        // 联查审批意见
        case 'AppRoveIdea':
            let approveData = searchdata.call(this, props);
            let pk = approveData[0].data.values.pk_fwithdrawapply.value;
            if (!pk) {
                toast({ color: 'warning', content: loadMultiLang(this.props, '36340FDWA-000035') });/* 国际化处理： 选中数据主键为空！*/
            }
			this.setState({ 
                showApproveDetail: true,
                billID: pk
            })
            break;
        // 联查存单
        case 'LinkDespositBill':
            let linkData = searchdata.call(this, props);
			let depositcode = linkData[0].data.values.pk_depositreceipt.value;
			if(!depositcode){
				toast({
					color: 'warning',
					content: loadMultiLang(this.props, '36340FDWA-000010') //{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
			} else {
                // let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId };
                ajax({
                    url: '/nccloud/ifac/memberdeposit/querycardlinkaction.do',
                    data: {
                        pk:depositcode,
                        pageCode: "36341FDLQ_C01"
                    },
                    success: (res) => {
                        if (res.data) {
                            this.props.openTo('/ifac/ifacmemberbusquery/memberdepositreceipt/main/index.html#/card', 
                            {
                                srcFunCode:'36340FDWA',
                                appcode: '36341FDLQ',
                                pagecode: '36341FDLQ_C01',
                                status: 'browse',
                                islinkquery: true,
                                id:res.data,
                                scene: "linksce"
                            });
                        } 
                    }
                })
			}
            break;
        // 打印
		case 'Printbtn':
            let printData = searchdata.call(this, props);
            let pks = [];
            printData.forEach((vale) => {
                pks.push(vale.data.values.pk_fwithdrawapply.value);
            });
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                base_url + 'FDWDWAPrintaction.do',
                {
                    appcode: app_code,
                    nodekey: nodekey,//模板节点标识
                    oids: pks
                }
            );
            break;
        // 输出
        case 'Output':
            let outputData = props.table.getCheckedRows(tableId);
            let outputpks = [];
            outputData.forEach((item) => {
                outputpks.push(item.data.values.pk_fwithdrawapply.value);
            });
            output({
                url: base_url+'FDWDWAPrintaction.do',
                data: {
                    nodekey: nodekey,
                    appcode: app_code,
                    oids: outputpks,
                    outputType: 'output'
                }
            });
            break;
        }
    }
const searchdata = function(props) {
    let selectdata = props.table.getCheckedRows(tableId);
    //数据校验
    if (selectdata.length == 0) {
        toast({
            color: 'warning',
            content: loadMultiLang(this.props, '36340FDWA-000028'),/* 国际化处理： 请选中一行数据！*/
        });
        return;
    }
    return selectdata;
};
/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {
    let selectDatas = props.table.getCheckedRows(tableId);
    let billID = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkname] && selectDatas[0].data.values['pk_fwithdrawapply'].value;
    let billNO = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['vbillcode'] && selectDatas[0].data.values['vbillcode'].value;
    this.setState({
        showUploader: !this.state.showUploader,
        billID,
        billNO
    }); 
}

/** 
 * 删除数据
 */
const delBill = function (props,record) {
    listMultiOperator(props, pageCodeList,tableId,pkname,base_url + 'FDWDWADeleteaction.do', loadMultiLang(this.props, '36340FDWA-000013'),FixedWithDrawApplyConst.dataSource);/* 国际化处理： 删除*/
    buttonVisible.call(this,this.props); 
}
/**
 * 复制加载数据
 */
const copyBill = function (props,record) {
    let pk =record.data.values['pk_fwithdrawapply'].value;
    props.pushTo('/card', {
        pagecode: pageCodeCard,
        status: 'copy',
        id:pk,
        isCopy: 'copy'
    });
}

/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/