/*Dil0V6apQicDWBuaRgoCte5IGIwnIXqvtB78KcWhlQPjgMHiq6wwDY0VccAMkIp8*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base } from 'nc-lightapp-front';
let { NCModal,NCButton,NCFormControl  } = base;

export default class ReasonModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "test"
        }
    }

    render() {
        return (
            <NCModal show = {
                this.props.show
            }
            onHide = {
                this.props.close
            } 
            style={{width:"520px",height:"210px"}}
            >
                <NCModal.Header closeButton={true} style={{background:"rgba(243,243,243,1)"}}>
                    <NCModal.Title style={{paddingLeft:"0px"}}>{this.props.title}</NCModal.Title>
                </NCModal.Header>

                <NCModal.Body style={{marginTop:"20px"}}>
                    <NCFormControl
                        className="demo-input"
                        onChange={this.props.onChange}
                        value={this.props.value}
                        size="sm"
                    />
                    {/* <textarea className="reasonText" style={{height:"70px",width:"330px",marginLeft:"10px",resize:"none",fontSize:"15px"}}></textarea> */}
                </NCModal.Body>

                <NCModal.Footer>
                    <NCButton shape="border" colors="primary" onClick={this.props.beSureClick}>确认</NCButton>
                    <NCButton shape="border" onClick={this.props.close}>取消</NCButton>
                </NCModal.Footer>

            </NCModal>
        );
        
    }

}
/*Dil0V6apQicDWBuaRgoCte5IGIwnIXqvtB78KcWhlQPjgMHiq6wwDY0VccAMkIp8*/