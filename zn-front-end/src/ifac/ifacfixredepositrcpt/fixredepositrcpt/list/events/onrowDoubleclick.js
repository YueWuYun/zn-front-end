/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGYFViyO/M7dZ6Q1LEonIeWo*/
import { constant, requesturl }  from '../../config/config';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";

export default function onrowDoubleclick(record, index, props, e)  {
    let scene = this.props.getUrlParam("scene");
    go2CardCheck({
        props,
        url: requesturl.gotocardcheck,
        pk: record[constant.pkname].value,
        ts: record["ts"].value,
        checkTS: false,
        fieldPK: constant.pkname,
        go2CardFunc: () => {
            props.pushTo(constant.cardpath, {
                status: 'browse',
                id: record.pk_fixredepositrcpt.value,
                scene: scene,
				islisttocard: "islisttocard"
            });
        }
    })

}
/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGYFViyO/M7dZ6Q1LEonIeWo*/