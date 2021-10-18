/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, searchId, pagecode, formId_org, oid, table_orgs } from '../constants';
let { NCMessage } = base;
export default function tableButtonClick(props, key, text, record, index) {
    let pks = [];
    let pk = record.pk_informerrelease.value;
    pks.push(pk);
    let that = this;
    switch (key) {
        // 取消发布
        case 'Lcancelpublish':
            ajax({
                url: '/nccloud/cmp/informer/cardunpublish.do',
                data: {
                    pks: pks,
                    pageid: ''
                },
                success: (res) => {
                    let { data } = res;
                    let tabledata = props.table.getAllTableData(tableId);
                    // if(tabledata.rows.length>1){
                        that.getdata();                        
                        if (data.errormessage) {
                            toast({ color: 'warning', content: data.errormessage });
                        }else{
                            toast({ content: props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000004'), color: 'success' });/* 国际化处理： 取消发布成功*/
                        }
                    // }                  
                }               
            });
            break;
    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/