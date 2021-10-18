/*0i95nAg/z6TbL4YNVym0bN7CFa2VDSG70OFTwtLMpB1qWz7oD5W5kdVY+BDhVLOZ*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-提交指派二次提交按钮
 * @param {*} props  
 */
export const submitAssginBtn = function (record, index) {

    let tsmap = {
        'ts': record.ts.value,
        'pk': record.pk_cruexchange.value,
        'index': index,
        'param': this.getAssginUsedr//提交指派使用
    }
    if(!this.getAssginUsedr){
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000081')    // 提示内容,非必输/* 国际化处理： '请选择指派人'!*/
        });
        return;
    }
    let listTsmap = [];//ts的list类型
    listTsmap.push(tsmap);
    let data = {
        'pk': record.pk_cruexchange.value,
        'pageid': this.pageCode,
        'ts': record.ts.value,
        'listObjTsmap': listTsmap
    };
    ajax({
        url: Templatedata.buttonclick_assginsubmit,
        data: data,
        success: (res) => {
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList, appointmap } = res.data;
            BatchToast.call(this,'COMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
            //加载更新缓存数据
            if (gridList != null && gridList.length > 0) {
                let gridRows = res.data.gridList;
                gridRows.forEach((val) => {
                    let test = val.index;
                    let value = val.rows.values;
                    let updateDataArr = [{
                        index: index,
                        data: { values: val.rows.values }
                    }];
                    this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
                });
            }
            //数据清空
            this.setState({
                record: null,
                index: null
            });
             //关闭指派框
             this.setState({
                compositedisplay: false
            })
        }
    });
}

/*0i95nAg/z6TbL4YNVym0bN7CFa2VDSG70OFTwtLMpB1qWz7oD5W5kdVY+BDhVLOZ*/