//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high, base, ajax, pageTo } from 'nc-lightapp-front';

const { PopRefer, MultiLangWrapper } = high.Refer;
const { NCButton: Button, NCTable: Table, NCModal: Modal } = base;

class FreeCustRefer extends PopRefer {
    constructor(props) {
        super(props);
    }

    renderPopoverBottomExtend = () => {
        return <div>
            <Button onClick={this.onAddClick.bind(this)}>{this.props.multiLang['refer-000545']}</Button>
        </div>;
    };

    onAddClick() {

        let customSupplier = '';

        if (typeof this.props.queryCondition === 'function') {
            customSupplier = this.props.queryCondition().customSupplier;
        } else if (typeof this.props.queryCondition === 'object') {
            customSupplier = this.props.queryCondition.customSupplier;
        }

        pageTo.openTo('/uapbd/customer/freecust/main/index.html',
            {
                appcode: '10140FCG',
                pagecode: '10140FCG_freecustom',
                pk_customsupplier: customSupplier
            }
        )
    }
}

export default function (props = {}) {
    var conf = {
        multiLang: {
            domainName: 'uapbd',
            currentLocale: 'zh-CN',
            moduleId: 'refer_uapbd',
        },
        refType: 'grid',
        refName: 'refer-000542',
        placeholder: 'refer-000542',
        refCode: 'uapbd.refer.customer.FreeCustGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/FreeCustGridRef.do',
        columnConfig: [{ name: ['refer-000002', 'refer-000003', 'refer-000543', 'refer-000033', 'refer-000544'], code: ['refcode', 'refname', 'address', 'plinkman', 'linkphone'] }],
        isMultiSelectedEnabled: false,
        isHasDisabledData: false
    };

    return <FreeCustReferWrapper {...conf} {...props} />
}
const FreeCustReferWrapper = MultiLangWrapper(FreeCustRefer)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65