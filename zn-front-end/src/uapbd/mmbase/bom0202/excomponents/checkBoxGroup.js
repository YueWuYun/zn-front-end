//CJpCuYgdzntBeaHfjMfDPCtzBCnRR0CbKR+xn6vwIa1TfOaAMuUV+wvwdeFImYL1
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base } from 'nc-lightapp-front';
import './CheckBoxGroup.less';

const {NCCheckbox} = base;

export default class CheckBoxGroup extends Component{
    constructor(props) {
        super(props);
        this.disabled = props.disabled;
        this.items = props.items;
        this.checkedValue = props.checkedValue;
        let checkModel = props.checkModel;
        this.state = {
            checkModel : checkModel
        };
    }

    render (){
        let checkboxs = [];
        if(this.disabled){
            this.items.forEach((item,index)=>{
                checkboxs.push(<span className="check-item"><NCCheckbox disabled={true} checked={this.state.checkModel[item.id]?true:false}>{item.name}</NCCheckbox></span>);
            });
        }else{
            this.items.forEach((item,index)=>{
                checkboxs.push(<span className="check-item"><NCCheckbox disabled={false} onChange={(e)=>{this.state.checkModel[item.id]=e;this.setState(this.state)}} checked={this.state.checkModel[item.id]?true:false} defaultChecked={this.state.checkModel[item.id]?true:false}>{item.name}</NCCheckbox></span>);
            });
        } 
        

        return (
            
            <div className="checkbox-group-main">{checkboxs}</div>
        );
    }
}

//CJpCuYgdzntBeaHfjMfDPCtzBCnRR0CbKR+xn6vwIa1TfOaAMuUV+wvwdeFImYL1