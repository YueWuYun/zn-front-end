/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { pageCodeCard,base_url, pageCodeList,tableId,FixedWithDrawConst,pkname} from '../../cons/constant.js';
import {  loadMultiLang,go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { buttonVisible } from './buttonVisible';
import { listSingleOperatorNoRecord } from '../../busbutton/listOperation';
export const bodyButtonClick=function(props, key, text, record, index) {
    let extParam;
    let pkMapTs = {};
    let pk = record.pk_fixeddatewithdraw && record.pk_fixeddatewithdraw.value;
    let ts = record.ts && record.ts.value;
    pkMapTs[pk] = ts;

    switch (key) {
        //修改
        case 'EditTableBtn':
            let pk = record[pkname].value;
            go2CardCheck({
                props, 
                url: base_url + 'FDWgotocardcheck.do',
                pk,
                ts,
                fieldPK: pkname,
                actionCode:null,
                permissionCode:null,
                checkSaga : true,
                checkTS : ts ? true : false,
                go2CardFunc: () => {
                    ajax({
                        url: base_url + 'FDWDWEditAction.do',
                        data: {
                            pk,
                            pageCode: pageCodeList
                        },
                        success: (res) => {
                            if (res) {
                                props.pushTo('/card', {
                                    pagecode: pageCodeCard,
                                    status: 'edit',
                                    id:pk
                                });
                            }
                        }
                    })
                }
            });
            break;
        //删除 
        case 'DeleteTableBtn':
            listSingleOperatorNoRecord(props, pageCodeList, tableId, base_url + 'FDWDWDeleteaction.do', record[pkname], record['ts'], index, loadMultiLang(this.props, '36340FDW-000015')/* 国际化处理： 删除*/, FixedWithDrawConst.dataSource);
            buttonVisible.call(this, props);
            break;
        //表体 提交
        case 'CommitTableBtn':
            extParam={btncode:"CommitTableBtn",pagecode:"36340FDW_L01"};
            listSingleOperatorNoRecord(props, pageCodeList, tableId, base_url + 'FDWDWCommitAction.do', record[pkname], record['ts'], index, loadMultiLang(this.props, '36340FDW-000011')/* 国际化处理： 提交*/, FixedWithDrawConst.dataSource, true, extParam, (props, data) => {
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
                        billID: record[pkname],
                        extParam:extParam
                    });
                }
            });
            buttonVisible.call(this, props);
            break;
        //表体 收回
        case 'UnCommitTableBtn':
            extParam={btncode:"UnCommitTableBtn",pagecode:"36340FDW_L01"};
            listSingleOperatorNoRecord(props, pageCodeList, tableId, base_url + 'FDWDWUnCommitAction.do', record[pkname], record['ts'], index, loadMultiLang(this.props, '36340FDW-000017')/* 国际化处理： 收回*/, FixedWithDrawConst.dataSource, null, extParam);
            buttonVisible.call(this, props);
            break;
        // 表体 退回
        case 'BackTableBtn':
            // 基础组件中的模态框打开
            this.setState({ record: record, index: index }, () => {
                this.setState({ tableshowModal: true });
            });
            break;
        default:
            break;
    }
    
}

/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/