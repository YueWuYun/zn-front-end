/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { listSingleOperator, listMultiOperator } from '../../../../pub/utils/SFButtonUtil';
import { list_page_code, card_page_id, base_url, grid_code, dataSource ,card_from_id} from '../../cons/constant.js';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
export default function bodyButtonClick(props, key, text, record, index) {
    const pkMapTs = {};//用于del时ts校验
    const pkMap = {};//用于通用后台获取map数据结构
    const pk = record.pk_allocateapply_h.value;
    const ts = record.ts.value;
    //单据状态
    const status = record.billstatus.value;
    switch (key) {
        case 'EditInner':
            // props.pushTo('/card', {
            //     status: 'edit',
            //     id: record.pk_allocateapply_h.value,
            //     pagecode: card_page_id
            // })
            let editData = {
                pks: [record.pk_allocateapply_h.value],
                ts: record.ts && record.ts.value,
                pageid: '36320AA_C01',
                status: 'edit',
            }
            ajax({
                url: '/nccloud/sf/allocateapply/queryPageCard.do',
                data: editData,
                success: (res) => {
                    if (res.data) {
                        //待提交时可修改
                        if(res.data.head[card_from_id].rows[0].values.billstatus.value === '5'){
                            props.pushTo("/card", {
                                status: 'edit',
                                id: record.pk_allocateapply_h && record.pk_allocateapply_h.value
                            });
                        }else{
                         toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000073') });/* 国际化处理： 该单据已经被他人修改，请刷新界面，重做业务。*/
                        }

                    }
                }
            });
            break;
        case 'DeleteInner':
            this.delConfirm(record, index);
            break;
        case 'CommitInner':
            listSingleOperator(props, list_page_code, grid_code, base_url + 'commit.do', record, 'pk_allocateapply_h', index, loadMultiLang(props, '36320AA-000048'), dataSource, false, null, (props, data) => {/* 国际化处理： 提交*/
                let { workflow } = data;
                //有指派信息，则指派，没有则重绘界面
                if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                    this.setState({
                        assignData: data,
                        assignShow: data,
                        rowIndex: index,
                        ts: record['ts'].value,
                        billId: record['pk_allocateapply_h'].value
                    });
                }
            });
            break;
        case 'UncommitInner':
            listSingleOperator(props, list_page_code, grid_code, base_url + 'uncommit.do', record, 'pk_allocateapply_h', index, loadMultiLang(props, '36320AA-000049'), dataSource);/* 国际化处理： 收回*/
            break;
        case 'EntrustInner':
            listSingleOperator(props, list_page_code, grid_code, base_url + 'submit.do', record, 'pk_allocateapply_h', index,
                loadMultiLang(props, '36320AA-000050'), dataSource);/* 国际化处理： 委托办理*/
            break;
        case 'CancelEntrustInner':
            listSingleOperator(props, list_page_code, grid_code, base_url + 'unsubmit.do', record, 'pk_allocateapply_h', index,
                loadMultiLang(props, '36320AA-000051'), dataSource);/* 国际化处理： 取消委托*/
            break;
        //审批意见
        case 'ApproveInfoInner':
            if (pk) {
                this.setState({
                    showApprove: true,
                    approveBilltype: '36K1',//单据类型
                    approveBillId: pk//单据pk
                });
            }
            break;
    }
}

/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/