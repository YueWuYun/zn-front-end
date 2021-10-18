/*XXGqwRtbBdezhloLmdB6GSpdJPuKzeniaOemHxyFZDXnmJlecLvnvzr/pfNJpfe3*/
import { constant } from "../cons/constant.js";
const { pagecode3, appcode, formId } = constant;
export default function (props) {
    this.props.createUIDom(
        {
            pagecode: pagecode3,
            appcode: appcode
        },
        (data) => {
            if (data) {
                if (data.template) {
                    let meta = data.template;
                    meta = modifyMeta.call(this, meta);
                    this.props.meta.setMeta(meta);
                    if (data.button) {
                        this.props.button.setButtons(data.button);
                    }
                }
            }
        }
    );
}

function modifyMeta(meta) {
    meta[formId].items.map((item) => {
        item.colnum = '4';
        //票据类型 参照过滤
        if (item.attrcode === 'fbmbilltype') {
            //会计期间参照过滤
            item.queryCondition = () => {
                return { noteclass: 2 };
            };
        }
    });
    return meta;
};
/*XXGqwRtbBdezhloLmdB6GSpdJPuKzeniaOemHxyFZDXnmJlecLvnvzr/pfNJpfe3*/