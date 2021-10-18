/*FQlJAOCgUwSCenFUN6ZaBVa2JcZDJqB55v/NW8IH4QAoXQG2GhrDnOdOCREmamzS*/
import { constant, requesturl }  from '../../config/config';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";

export default function onrowDoubleclick(record, index, props, e)  {
    let scene = this.props.getUrlParam("scene");
    go2CardCheck({
        props: this.props,
        url: requesturl.gotocardcheck,
        pk: record[constant.pkname].value,
        ts: record["ts"].value,
        checkTS: false,
        checkSaga: false,
        fieldPK: constant.pkname,
        go2CardFunc: () => {
            this.props.pushTo(constant.cardpath, {
                status: 'browse',
                id: record.pk_debitcontract_icdmc.value,
                scene: scene,
				islisttocard: "islisttocard"
            });
        }
    })
}
/*FQlJAOCgUwSCenFUN6ZaBVa2JcZDJqB55v/NW8IH4QAoXQG2GhrDnOdOCREmamzS*/