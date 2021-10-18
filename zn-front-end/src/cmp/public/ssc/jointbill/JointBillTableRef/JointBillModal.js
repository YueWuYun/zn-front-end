/*PWvxHjk2FhrI4fjF0FpSLj5dEcCFTajVxwdsez8Np4nyW8+Qt4L47yv9foEhjD3H*/
import React, {Component} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import { initTemplate} from './events';

const {NCModal} = base;

class JointBillModal extends Component {

    constructor(props) {
        super(props);
        initTemplate.call(this, props);
        this.checkModule= false; // 校验是否安装增值税模块标识
        this.state = {
            isShow:false
        }
    }

    componentWillReceiveProps(nextProps) {
        let multiLang = this.props.MutiInit.getIntl(2011);
        if (nextProps.show && !this.checkModule) {
            ajax({
                url: '/nccloud/sscrp/rpbill/SSCSysPvinvInitCheckAction.do',
                data: {},
                success: (res) => {
                    console.log('验证是否安装', res);
                    this.checkModule = true;
                    if (res.data) {
                        this.setState({ isShow: true });
                    } else {
                        this.setState({ isShow: false });
                        toast({ content: multiLang && multiLang.get('2011-0002'), color: 'danger' });
                    }
                }
            });
        }
    }


    query() {
        if (this.props.show) {
            ajax({
                url: '/nccloud/pvinv/mc201/InvoiceBillQueryAction.do',
                data: this.props.billCode,
                success: (res) => {
                    console.log('res', res);
                    if (res.data != null) {
                        this.props.editTable.setTableData('pvinv_invoicebill', res.data['pvinv_invoicebill']);
                    } else {
                        this.props.editTable.setTableData('pvinv_invoicebill', { rows: [] });
                    }
                }
            })
        }
    }

    render() {
        let {show} = this.props;
        const { createEditTable } = this.props.editTable;
        let multiLang = this.props.MutiInit.getIntl(2011);
        return (
            <div>
                <NCModal show = {this.state.isShow ? show:this.state.isShow} size="xlg" onEnter={this.query.bind(this)} >
                    <NCModal.Header closeButton={true} onHide={(e)=>this.props.close()}>
                        <NCModal.Title>{multiLang && multiLang.get('2011-0001')}</NCModal.Title>
                    </NCModal.Header>
                        {createEditTable('pvinv_invoicebill', {
                            showIndex: true,
                            showTotal:true,
                            noTotalCol:['vinvcode','vinvnum','bauthen']
                        })}
                </NCModal>
            </div>
        )
    }
}
let JointBillModalDom = createPage({
    mutiLangCode: '2011'
})(JointBillModal);
export default JointBillModalDom

/*PWvxHjk2FhrI4fjF0FpSLj5dEcCFTajVxwdsez8Np4nyW8+Qt4L47yv9foEhjD3H*/