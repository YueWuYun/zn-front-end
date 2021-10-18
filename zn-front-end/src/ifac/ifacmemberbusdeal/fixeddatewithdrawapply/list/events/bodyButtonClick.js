/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { pageCodeCard, base_url, pageCodeList, tableId,FixedWithDrawApplyConst,pkname} from '../../cons/constant.js';
import { listSingleOperatorNoRecord } from '../../busbutton/listOperation';
import { buttonVisible } from './buttonVisible';
import {loadMultiLang,go2CardCheck } from "../../../../../tmpub/pub/util/index";
export const bodyButtonClick=function(props, key, text, record, index) {
    let pkMapTs = {};
    let pk = record.pk_fwithdrawapply&& record.pk_fwithdrawapply.value;
    let ts = record.ts && record.ts.value;
    pkMapTs[pk] = ts;
 
    switch (key) { 
        //修改
        case 'TableEdit':
            go2CardCheck({
                props,
                url: base_url + 'FDWAgotocardcheck.do',
                pk,
                ts,
                fieldPK: pkname,
                //动作编码（权限检查 空则不检查）
                actionCode:null,
                //权限编码（权限检查 空则不检查）
                permissionCode:null,
                //是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
                checkSaga : false,
                //是否进行ts检查（默认检查，非操作按钮导致的跳转不用检查）
                checkTS : ts ? true : false,
                go2CardFunc: () => {
                    ajax({
                        url: base_url + 'FDWDWAEditAction.do',
                        data: {
                            pk,
                            pkMapTs,
                            pageCode: pageCodeList
                        },
                        success: (res) => {
                            if (res) {
                                this.props.pushTo('/card', {
                                    status: 'edit',
                                    id: pk,
                                    pagecode: pageCodeCard
                                })
                            } 
                        }
                    })
                }
            });
            break;
        //删除
        case 'TableDelete':
            listSingleOperatorNoRecord(props, pageCodeList, tableId, base_url + 'FDWDWADeleteaction.do', record[pkname], record['ts'], index, loadMultiLang(this.props, '36340FDWA-000013'), FixedWithDrawApplyConst.dataSource);/* 国际化处理：  删除*/
            buttonVisible.call(this, props);
            break;
        //表体 提交
        case 'TableCommit':
            listSingleOperatorNoRecord(props, pageCodeList, tableId, base_url + 'FDWDWACommitAction.do', record[pkname], record['ts'], index, loadMultiLang(this.props, '36340FDWA-000009'), FixedWithDrawApplyConst.dataSource,true,null, (props, data) => {
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
                        index: index,
                        ts: record['ts'],
                        billID: record[pkname] 
                    }); 
                }
            });
            buttonVisible.call(this, props);
            break;
        //表体 收回
        case 'TableUnCommit':
            listSingleOperatorNoRecord(props, pageCodeList, tableId, base_url + 'FDWDWAUnCommitAction.do', record[pkname], record['ts'], index, loadMultiLang(this.props, '36340FDWA-000015'), FixedWithDrawApplyConst.dataSource);/* 国际化处理： 收回*/
            buttonVisible.call(this, props);
            break;
        // 表体 委托
        case 'TableConsign':
            listSingleOperatorNoRecord(props, pageCodeList, tableId, base_url + 'FDWDWAConsignAction.do', record[pkname], record['ts'], index, loadMultiLang(this.props, '36340FDWA-000030'), FixedWithDrawApplyConst.dataSource);/* 国际化处理： 委托*/
            buttonVisible.call(this, props);
            break;
            // 表体 取消委托
        case 'TableUnConsign':
            listSingleOperatorNoRecord(props, pageCodeList, tableId, base_url + 'FDWDWAUnConsignAction.do', record[pkname], record['ts'], index, loadMultiLang(this.props, '36340FDWA-000031'), FixedWithDrawApplyConst.dataSource);/* 国际化处理： 取消委托*/
            buttonVisible.call(this, props);
            break;
        default:
            break;
    }
}
/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/