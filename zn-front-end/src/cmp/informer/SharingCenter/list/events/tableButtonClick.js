/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, searchId, pagecode } from '../constants';
import { busiOperate } from './busiOperate';
let { NCMessage } = base;
export default function tableButtonClick(props, key, text, record, index) {
    let pks = [];
    pks.push(record.pk_informer.value);
    let url;
    let data = {
        pks: pks,
        ts: record.ts.value,
        pageid: pagecode
    };
    let context = {
        data: data,
        index: index
    }
    switch (key) {
        // 取消发布
        case 'Lcancelpublish':
            url = '/nccloud/cmp/informer/informerunpublish.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000001'), "inner", context);/* 国际化处理： 取消发布，成功！*/
            break;
        //不生单
        case 'Lungenerate':
            url = '/nccloud/cmp/informer/informerungenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000006'), "inner", context);/* 国际化处理： 不生单，成功！*/
            break;
        //恢复生单
        case 'Lregenerate':
            url = '/nccloud/cmp/informer/informerrecgenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000007'), "inner", context);/* 国际化处理： 恢复生单，成功！*/
            break;
        //发布
        case 'Lpublish':
            url = '/nccloud/cmp/informer/informerpublish.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000002'), "inner", context);/* 国际化处理： 发布，成功！*/
            break;
        //明细
        case 'Ldetail':
            props.pushTo("/card", {
                status: 'browse',
                from: 'list',
                id: record.pk_informer.value
            });
            break;
    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/