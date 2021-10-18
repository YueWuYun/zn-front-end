/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import { Component } from 'react';
import { createPage, toast } from 'nc-lightapp-front';
import { HeaderList, deepClone } from '../../commom';
import './index.less';

class CmpCard extends Component {
    constructor(props) {
        super(props);
        this.state ={
            formData: {
                pk_bankaccids: [],
                pk_cashaccids: []
            }
        }
    }

    componentDidMount() {
        this.props.onRef(this);
        if(this.props.busireconData && this.props.busireconData.value) {
            this.initialData(this.props.busireconData.value);
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.busireconData && nextProps.busireconData.value){//渲染数据
            if(nextProps.busireconData!== this.props.busireconData){
                this.initialData(nextProps.busireconData.value);
            }
        }
    }

    //传入的数据
    initialData = (data) => {
        let formData= {
            pk_bankaccids: [],
            pk_cashaccids: []
        };
        data= typeof data=== 'string' ? JSON.parse(data) : data;
        if (data.bankAccMap) {
            for (let item of Object.keys(data.bankAccMap)) {
                formData.pk_bankaccids.push({refpk: item, refname: data.bankAccMap[item]})
            }
        }
        if (data.cashAccMap) {
            for (let item of Object.keys(data.cashAccMap)) {
                formData.pk_cashaccids.push({refpk: item, refname: data.cashAccMap[item]})
            }
        }
        this.setState({formData});
    }

    getAllFiledAndValues = () => {
        let formData= deepClone(this.state.formData);
        formData.pk_bankaccids= (formData.pk_bankaccids && formData.pk_bankaccids.length) ? formData.pk_bankaccids.map(item => item.refpk) : null;
        formData.pk_cashaccids= (formData.pk_cashaccids && formData.pk_cashaccids.length) ? formData.pk_cashaccids.map(item => item.refpk) : null;
        return formData;
    }

    //表单必输项校验
    checkCondition =() => {
        let { formData }= this.state;
        let isContinue= (formData['pk_bankaccids'].length > 0) || (formData['pk_cashaccids'].length > 0);
        if (!isContinue) {
            toast({color: 'warning', content: this.props.json['200260-0666']});
        }
        return isContinue;
    }

    onChange = (val, name) => {
        let { formData }= this.state;
        switch(name) {
            case 'pk_bankaccids':
                formData[name]= val;
                val.length && (formData['pk_cashaccids']= []);
                break;
            case 'pk_cashaccids':
                formData[name]= val;
                val.length && (formData['pk_bankaccids']= []);
                break;
        }
        this.setState({formData});
    }

    configContent = () => {
        let { formData }= this.state;
        return [
            {
                label: this.props.json['200260-0667'],
                type: 'refer',
                value: formData.pk_bankaccids.map(item => item.refname || item).join(','),
                config: {
                    name: 'pk_bankaccids',
                    placeholder: this.props.json['200260-0667'],
                    refName: this.props.json['200260-0667'],
                    queryTreeUrl: '/nccloud/uapbd/ref/BankaccSubUseTreeRef.do',
                    queryGridUrl: '/nccloud/uapbd/ref/BankaccSubUseGridRef.do',
                    refType: 'gridTree',
                    refCode:'uapbd.refer.pub.BankaccSubUseTreeGridRef',
                    isMultiSelectedEnabled: true,
                    value: formData.pk_bankaccids,
                    queryCondition: {
                        pk_org: this.props.pk_org
                    }
                }
            },
            {
                label: this.props.json['200260-0668'],
                type: 'refer',
                value: formData.pk_cashaccids.map(item => item.refname || item).join(','),
                config: {
                    placeholder: this.props.json['200260-0668'],
                    refName: this.props.json['200260-0668'],
                    name: 'pk_cashaccids',
                    queryGridUrl: this.props.nodetype!== 'group' ? '/nccloud/uapbd/sminfo/CashAccountGridRef.do' : '/nccloud/cmp/refer/CashAccountGridRef.do',
                    refType: 'grid',
                    refCode: 'uapbd.refer.sminfo.CashAccountGridRef',
                    // columnConfig: {[{name: [ this.lang('0003'), this.lang('0004') ],code: [ 'refcode', 'refname' ]}]},
                    isMultiSelectedEnabled: true,
                    value: formData.pk_cashaccids,
                    queryCondition: {
                        pk_org: this.props.pk_org
                    }
                }
            }
        ];
    }
    
    render () {
        let { status }= this.props;
        
        return (
            <div className="glaccount-bank">
                <HeaderList
                    configList={this.configContent()} 
                    status={['add', 'edit'].includes(status) ? 'eidt' : 'browse'} 
                    showType="more-column" 
                    onChange={this.onChange.bind(this)}
                />
            </div>
        )
    }
}

CmpCard = createPage({
})(CmpCard);


export default function (props = {}) {
    let conf = {};
    return <CmpCard  {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/