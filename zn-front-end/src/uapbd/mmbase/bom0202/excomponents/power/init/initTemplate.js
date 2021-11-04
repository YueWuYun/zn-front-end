//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import {cardCache} from 'nc-lightapp-front';
import {
    AREA, UISTATE
} from '../../../constance';

/**
 * 列表界面初始化
 * @param {*} props
 */
export default function (props) {
    props.createUIDom(
        {
            pagecode: '50060006_power', //页面id
            appcode: '50060006' //注册按钮的id
        },
        (data) => {
            this.setState(this.state, () => {
                let meta = data.template;
                props.meta.setMeta(meta, () => {
                    this.props.editTable.setStatus(AREA.power, UISTATE.edit);
                });
                data.button && props.button.setButtons(data.button);
            });
        }
    );
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX