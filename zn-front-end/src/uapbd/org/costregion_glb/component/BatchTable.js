//T67LJ4K3S/+EAWduUav+DtyXEtrvaSicyT1/U97G2Dpq6usvIziRIcU8ku2VfnZg
import React, {Component} from "react";
import {createPage, ajax, base, toast} from 'nc-lightapp-front';


const urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do"
};
const initTemplate = (props) => {
    //请求参数
    let requestParam = {
        pagecode: '10100COSTR_costregionbatchadd',
        appcode: "10100COSTR"
    }
    //请求元数据模板
    ajax({
        url: urls["queryTemplateUrl"],
        data: requestParam,
        success: (res) => {
            let meta = res.data;
            // meta['costregion'].items.find((item) => item.attrcode === 'enablestate').visible=false;
            // meta['costregion'].items.find((item) => item.attrcode === 'layertype').disabled=true;
            // meta['costregion'].items.find((item) => item.attrcode === 'pk_org').disabled=true;
            //设置元数据
            debugger;
            props.meta.setMeta(meta);
        }
    });
};

class BatchTable extends Component {

    constructor(props) {
        super(props);
        this.config = props.config;
    };

    render() {
        let {editTable} = this.props;

        let {createEditTable} = editTable;

        return (
            <div className="nc-bill-card">
                <div className="table-wrapper">
                    {createEditTable('costregion',{...this.config,height:300,
                    adaptionHeight:true
                    })}
                </div>
            </div>
        )

    }
}

export default BatchTable = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: '10100COSTR_costregionbatchadd',
        bodycode: 'costregion'
    },

    initTemplate: initTemplate
})(BatchTable);

//T67LJ4K3S/+EAWduUav+DtyXEtrvaSicyT1/U97G2Dpq6usvIziRIcU8ku2VfnZg