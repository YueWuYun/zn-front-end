/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { constant } from "../cons/constant.js";
const { pagecode1, appcode, formId } = constant;
export default function () {
    this.props.createUIDom(
        {
            pagecode: pagecode1,
            appcode: appcode
        },
        (data) => {
            if (data) {
                if (data.template) {
                    let meta = data.template;
                    if (data.button) {
                        this.props.button.setButtons(data.button);
                    }
                    meta = modifyMeta.call(this, meta);
                    this.props.meta.setMeta(meta);

                }
            }
        }
    );
}

function modifyMeta (meta)  {
    meta[formId].items.map((item) => {
        //票据类型 参照过滤
        if (item.attrcode === 'fbmbilltype') {
            //会计期间参照过滤
            item.queryCondition = () => {
                    return { noteclass: 2 };
            };
        }
        item.colnum='4'
    });
    return meta;
};
/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/