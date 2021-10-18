/*0i95nAg/z6TbL4YNVym0bN7CFa2VDSG70OFTwtLMpB1qWz7oD5W5kdVY+BDhVLOZ*/
import { ajax, toast } from 'nc-lightapp-front';
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句

/**
 * [收款]-提交指派
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const submitAssginBtn = function () {
    let submitData01 = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (submitData01.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000093') });/* 国际化处理： 请选择数据,进行提交!*/
        return
    }
    if (!this.getAssginUsedr) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000113')   // 提示内容,非必输/* 国际化处理： 请选择指派人!*/
        });
        return;
    }
    let submitdataArr01 = [];
    let listTsmap = [];//ts的list类型
    //处理选择数据
    submitData01.forEach((val) => {
        submitdataArr01.push(val.data.values.pk_recbill.value);//主键数组
        let tsmap = {
            'pk': val.data.values.pk_recbill.value,
            'ts': val.data.values.ts.value,
            'index': val.index,
            'param': this.getAssginUsedr//提交指派使用
        }
        listTsmap.push(tsmap);
    });
    //自定义请求数据
    let submitassgindata = {
        'pks': submitdataArr01,
        'pageid': this.pageId,
        'listObjTsmap': listTsmap//提价指派自定义的类型
    };

    ajax({
        url: '/nccloud/cmp/recbill/listsubmiassgin.do',
        data: submitassgindata,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList } = res.data;
            if (success) {
                BatchToast.call(this, 'COMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                debugger
                //加载更新缓存数据
                if (gridList != null && gridList.length > 0) {
                    let gridRows = res.data.gridList;
                    
                    //begin tm tangleic 20200219 提交支持预算交互异常信息输出
                    api.comm.showTbbMsg({ props: this.props, row: res.data.gridList[0].rows[0] });
                    //end tm tangleic
                    
                    gridRows.forEach((val) => {
                        let table_index = Math.round(val.index);//格式化：防止index传递过来是1.0,2.0等格式
                        let value = val.rows.values;
                        let submitUpdateDataArr = [{
                            index: table_index,
                            data: { values: val.rows.values }//自定义封装数据
                        }];
                        this.props.table.updateDataByIndexs(this.tableId, submitUpdateDataArr);
                    });
                }
                //关闭指派框
                this.setState({
                    compositedisplay: false
                });

            }
        }
    });
}

/*0i95nAg/z6TbL4YNVym0bN7CFa2VDSG70OFTwtLMpB1qWz7oD5W5kdVY+BDhVLOZ*/