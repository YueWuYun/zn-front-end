//2UtDAKDSPhvEym6/R/SUhiWNI4el7BPT1XTIFxKznHU/E6ylsrlCijYL9PAcm5A8frFV3zYmCb4/
//gszychKLGw==
import {ajax,base,toast} from 'nc-lightapp-front';
import confrimUtil from '../../../../public/pubComponent/confirmUtil/confirmUtil';
/**
 * abandon function(银行账户授权列表停启用行开关改为按钮此方法废弃)
 * @param props
 * @param moduleId
 * @param key
 * @param value
 * @param changedrows
 * @param index
 * @param record
 */
export default function(props, moduleId, key, value, changedrows, index, record) {
    //props, moduleId(区域id), key(操作的键),
    //value（当前值）, changedrows（新旧值集合）
    //record（行数据）, index（当前index）
    switch (key) {
        case'enablestate':
            confrimUtil({
                title: this.state.json['10140BANKACC-000015'],/* 国际化处理： 询问？*/
                content: value ? this.state.json['10140BANKACC-000017'] : this.state.json['10140BANKACC-000016'],/* 国际化处理： 确定启用？,确定停用？*/
                beSureBtnClick: () => {
                    ajax({
                        url: '/nccloud/uapbd/bankacc/bankaccuse.do',
                        data: {
                            pk_list: [record.values.pk_bankaccuse.value],
                            enableswitch: value,
                            actionName: 'modalEnable'
                        },
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                if (data) {
                                    if (data.hasOwnProperty('message') && data.message) {

                                    } else {
                                        toast({
                                            'color': 'success',
                                            'title': this.state.json['10140BANKACC-000001']/* 国际化处理： 操作成功！*/
                                        });
                                        this.loadBankaccuseData(this.props.table.getCheckedRows(this.config.gridId));
                                    }
                                }

                            }
                        }
                    });
                }
            });
            break;
    }


}

//2UtDAKDSPhvEym6/R/SUhiWNI4el7BPT1XTIFxKznHU/E6ylsrlCijYL9PAcm5A8frFV3zYmCb4/
//gszychKLGw==