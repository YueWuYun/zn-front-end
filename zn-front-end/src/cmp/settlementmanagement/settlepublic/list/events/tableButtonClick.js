/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import {Templatedata} from "../../config/Templatedata";//配置的id和area信息



let table_id = Templatedata.list_tableid;

export default function tableButtonClick(props, key, text, record, index) {
   
   let that = this;
    switch (key) {
        case 'nextBtn':
        // 下一步操作
        let pk_settle = record.pk_settlement.value;
        
        //let callback = this.state.url;
        //callback+= `?pk_settle=${pk_settle}&src=settlement`;  
        // paybills      0001Z61000000001PJBL 36070PBR
        // src        recbills 
        //let url = `/nccloud/resources/cmp/billmanagement/paybill/card/index.html`;
        let url = that.state.url;
        let appcode = that.state.appcode;
        let pagecode = that.state.pagecode;
        if (!url || !appcode || !pagecode) {
            // 此处需要确定如果没有传回调页面,页面编码，小应用编码该如何提示
            //url = `/nccloud/resources/cmp/billmanagement/paybill/card/index.html`;
            toast({ color: 'warning', 
                content: `${this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000061')}，${this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000062')}! appcode=${appcode};pagecode=${pagecode};callback=${url}` });/* 国际化处理： 传参不完整,请检查*/
        }

        // 进行跳转前，校验一下是否是已经跳转过的
        let data = {
            pk:pk_settle
        }
        ajax({
            url: Templatedata.linksettlevalidate,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    // 返回成功即校验通过，否则抛出异常
                    let param = {
                        pk_settle : pk_settle,
                        src : 'settlement',
                        status:'add',
                        appcode:appcode,
                        pagecode:pagecode
                    }
                    props.openTo(url, param);
                }
            }
        });
        break;
    }
}


/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/