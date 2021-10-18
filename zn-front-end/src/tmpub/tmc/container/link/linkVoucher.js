/*J3PoAJHhMhSr3u/XmkvgtYcCaAA1AqSDXiOoWEtWBFjrEyDkNd9iyF4II+tupUac*/
import { ajax, toast, cacheTools } from 'nc-lightapp-front';
import { CARD } from '../../../pub/interestrate/cons/constant';
//联查凭证跳转路径
const VoucherDataConst = {
    pagecode: '10170410_1017041001',
    appcode: '10170410'
};

/**
 * 联查凭证
 *
 * @param {*} voucherArr - 联查凭证需要的数据，pk_group/pk_org/relationID组成的数组
 */
export function linkVoucher(voucherArr, url){
    let { appcode, pagecode } = VoucherDataConst;
    ajax({
        url: url || this.API_URL.linkVoucher,
        data: {
            appcode,
            pagecode
        },
        success: (res) => {
            let { data } = res;
            if(data){
                let srccode = `${this.appcode}_LinkVouchar`;
                cacheTools.set(srccode, voucherArr);
                this.props.openTo(data, {
                    status:'browse', 
                    appcode,
                    pagecode,
                    scene:srccode,
                    name: this.state.json['TMCPUB-000055']/* 国际化处理： 联查凭证*/
                });
            }
        }
    });
}

// 凭证联查单据
export function voucherLinkBill (url) {
    let cachekey = [];
    //缓存中的key为’cachekey’,
    cachekey = cacheTools.get('cachekey');
    if(cachekey && cachekey.length > 0){
        ajax({
            url: url || this.API_URL.voucherlink,
            data: {
                operatingLogVO: cachekey,
                pageCode: this.pageId
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        let rowlenght = data[this.tableId].rows;
                        if (rowlenght.length == 1) {
                            let record = rowlenght[0];
                            //1条数据跳转到卡片页面
                            this.props.pushTo("/card",{
                                status: 'browse',
                                id: record.values[this.primaryId] && record.values[this.primaryId].value,
                                scene: "linksce",
                                pageCode: CARD.page_id
                            });
                        } else {
                            //多条数据跳转到列表页面
                            this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                        }
                    } else {
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                    }
                }
            }
        });
    }
}   

/*J3PoAJHhMhSr3u/XmkvgtYcCaAA1AqSDXiOoWEtWBFjrEyDkNd9iyF4II+tupUac*/