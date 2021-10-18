/*3qjakgBz8U307oLILQl1l72w9BJ4DtIjUaRzz6O2Yv4NyCXP4yv6crg9F10pvXMK*/
import { ajax } from 'nc-lightapp-front';
import { btnOperation } from './btnOperation';

/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 */
export function listBodyBtnClick (key, record) {
    let pk = record[this.primaryId] && record[this.primaryId].value;
    let ts = record['ts'] && record['ts'].value;
    let pkMapTs = new Map();
    //主键与tsMap
    if (pk && ts) {
        pkMapTs.set(pk, ts);
    }
    switch (key) {
        case 'edit':  //修改
            editBill.call(this, pk, record);
            break;
        case 'delete':  //删除
            this.setState({showToast: false});
            btnOperation.call(this, {pks: [pk], pkMapTs: pkMapTs}, this.javaUrl.delete, this.state.json['36010PUBLIC-000010'])/* 国际化处理： 删除成功!*/
            break;
        case 'start':  //启用
            this.setState({showToast: false});
            btnOperation.call(this, {pks: [pk], pkMapTs: pkMapTs}, this.javaUrl.start, this.state.json['36010PUBLIC-000008'])/* 国际化处理： 启用成功!*/
            break;
        case 'stop':  //停用
            this.setState({showToast: false});
            btnOperation.call(this, {pks: [pk], pkMapTs: pkMapTs}, this.javaUrl.stop, this.state.json['36010PUBLIC-000009'])/* 国际化处理： 停用成功!*/
            break;
        default:
            break;
    }
}

function editBill(pk, record) {
    ajax({
        url: `${this.baseUrl}${this.javaUrl.checkRef}.do`,
        data: {pks: [pk]},
        success: (res) => {
            if( res.data[0] ) {
                promptBox({
                    color: 'warning', 
                    title: this.state.json['36010PUBLIC-000030'],/* 国际化处理： 修改*/
                    content: this.state.json['36010PUBLIC-000031'],/* 国际化处理： 该条数据已被引用，是否继续修改?*/
                    beSureBtnClick: () => {
                        this.props.pushTo('/card', {
						    status: 'edit',
						    id: record[this.primaryId].value,
						    pagecode: this.card.pageCode,
                            editStatus: 'edit',
                            sysMark: record.advanceddata.value
						});
                    }
                })
            } else {
                this.props.pushTo('/card', {
                    status: 'edit',
                    id: record[this.primaryId].value,
                    pagecode: this.card.pageCode,
                    editStatus: 'edit',
                    sysMark: record.advanceddata.value
                });
            }
        }
    });
}

/*3qjakgBz8U307oLILQl1l72w9BJ4DtIjUaRzz6O2Yv4NyCXP4yv6crg9F10pvXMK*/