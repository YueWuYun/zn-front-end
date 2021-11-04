//mPbPxvOAyHBKkzIqkctLdHFMXKgqaRTtRxLOuBwUUHbAfFpRmsHrNSQHKsYRy5jr
import { Component } from 'react';
import { createPage, ajax, base ,toast} from 'nc-lightapp-front';

/**
 * 科目表与科目控制规则的详细信息
 */
class Accctrlruleform extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState(
            this.state,
            () => {
                this.setCardTab();
            }
        );
    }

    setCardTab(){
        let nodeData = this.props['nodeData'];
        if(!nodeData && !nodeData['isChar'])return;

        let cardTableData = {};
        if(nodeData['isChar']){
            this.props.form.EmptyAllFormValue('accchart');
            this.props.form.setAllFormValue({'accchart' : nodeData['value']['accchart']['accchart']});
            //核算账簿
            this.setCardtable(cardTableData,nodeData,'accchart_book');
            //预留规则
            this.setCardtable(cardTableData,nodeData,'accchart_rule');
        }else{
            //科目控制规则
            this.props.form.EmptyAllFormValue('accctrlrule');
            this.props.form.setAllFormValue({'accctrlrule' : nodeData['value']['accctrlrule']['accctrlrule']});
            //科目
            this.setCardtable(cardTableData,nodeData,'accctrlrule_account');
            //预留规则
            this.setCardtable(cardTableData,nodeData,'accctrlrule_rule');
            //可细化组织
            this.setCardtable(cardTableData,nodeData,'accctrlrule_org');
        }
        this.props.cardTable.setMulTablesData(cardTableData);
    }

    setCardtable(cardTableData,nodeData,areaStr){
        nodeData['value'][areaStr] && nodeData['value'][areaStr][areaStr] 
            ? cardTableData[areaStr] = nodeData['value'][areaStr][areaStr]
            : cardTableData[areaStr] = {rows: []};
    }

    render(){
        const {form,button,cardTable} = this.props;
        const {createForm} = form;//创建表单，需要引入这个
        const {createCardTable} = cardTable;
        const {createButtonApp} = button;
        
        let dom = this.props['nodeData']['isChar'] ?
            <div className="nc-bill-card">
                <div className="card-area">
                    {createForm("accchart", {})}
                </div>
                <div className="nc-bill-table-area">
                    {createCardTable("accchart_rule", {showIndex: true,showCheck: false})}
                </div>
                <div className="nc-bill-table-area">
                    {createCardTable("accchart_book", {showIndex: true,showCheck: false})}
                </div>
            </div> : 
            <div className="nc-bill-card">
                <div className="card-area">
                    {createForm("accctrlrule", {})}
                </div>
                <div className="nc-bill-table-area">
                    {createCardTable("accctrlrule_account", {showIndex: true,showCheck: false})}
                </div>
                <div className="nc-bill-table-area">
                    {createCardTable("accctrlrule_rule", {showIndex: true,showCheck: false})}
                </div>
                <div className="nc-bill-table-area">
                    {createCardTable("accctrlrule_org", {showIndex: true,showCheck: false})}
                </div>
            </div>;

        return (
            <div  id='nc-bill-card'>
                {dom}
			</div>
        );
    }
}
export default Accctrlruleform;

//mPbPxvOAyHBKkzIqkctLdHFMXKgqaRTtRxLOuBwUUHbAfFpRmsHrNSQHKsYRy5jr