/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { pageCodeCard, app_id, base_url,pkname, pageCodeList, gotocardcheck, tableId,dataSource} from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import { deleteCacheData, getNextId, deleteCacheDataForList } from '../../../../../tmpub/pub/util/cache';
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';
import { listSingleOperatorNoRecord } from '../../busbutton/listOperation';
import {loadMultiLang,go2CardCheck} from "../../../../../tmpub/pub/util/index";
export const bodyButtonClick=function(props, key, text, record, index) {
    let pkMapTs = {};
    let pk = record.pk_fixeddatewithdraw && record.pk_fixeddatewithdraw.value;
    let ts = record.ts && record.ts.value;
    let extParam;
    let frozen=record.saga_frozen.value;
    pkMapTs[pk] = ts;
    switch (key) {
        //修改
        case 'EditTableBtn':
            ajax({
                url: base_url + 'FDWDWEditAction.do',
                data: {
                    pk,
                    pageCode: pageCodeList
                },
                success: (res) => {
                    if (res) {
                        go2CardCheck({
                            props,
                            url: gotocardcheck,
                            pk: record[pkname].value,
                            ts: record["ts"].value,
                            checkTS: record["ts"].value ? true : false,
                            fieldPK: pkname,
                            go2CardFunc: () => {
                                props.pushTo('/card', {
                                    pagecode: pageCodeCard,
                                    status: 'edit',
                                    id:pk
                                });
                            }
                        })
                    }
                }
            })
            // props.pushTo('/card', {
            //     pagecode: pageCodeCard,
            //     status: 'edit', 
            //     id:pk
            // });
        // }
            break; 
        //删除
        case 'DeleteTableBtn':
            extParam={btncode:"DeleteTableBtn",pageCode:"36140NDSR_L01"};
            // listSingleOperator(props, pageCodeList, tableId, base_url + 'FDWDWDeleteaction.do', record, pkname, index, loadMultiLang(this.props, '36140NDSR-000063'), dataSource,null,extParam);/* 国际化处理： 删除成功！*/
            //author:fanyzhc begin
            listSingleOperatorNoRecord(props, pageCodeList, tableId, base_url + 'FDWDWDeleteaction.do', record[pkname], record['ts'], index, loadMultiLang(this.props, '36140NDSR-000063')/* 国际化处理： 删除成功*/, dataSource);
            //end
            break;
        //表体 记账
        case 'TallyTableBtn':
            extParam={btncode:"TallyTableBtn",pageCode:"36140NDSR_L01"};
            listSingleOperator(props, pageCodeList, tableId, base_url + 'FDWDWTallyAction.do', record, pkname, index, loadMultiLang(this.props, '36140NDSR-000067'), dataSource,null,extParam);/* 国际化处理： 记账成功！*/
            break;
        //表体 取消记账
        case 'UnTallyTableBtn':
            extParam={btncode:"UnTallyTableBtn",pageCode:"36140NDSR_L01"};
            listSingleOperator(props, pageCodeList, tableId, base_url + 'FDWDWUnTallyAction.do', record, pkname, index, loadMultiLang(this.props, '36140NDSR-000068'), dataSource,null,extParam);/* 国际化处理： 取消记账成功！*/
            break;
        default:
            break;
    }
}

/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/