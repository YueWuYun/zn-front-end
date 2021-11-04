//sd2YXpchPbc0A8nu/S+aHvcjph4iM0L5BiohlbA5rh1slHJJNmdMRepMzy/xOZhw
import React,{Component} from 'react';
import {high} from 'nc-lightapp-front';
const {NCUploader} = high;
export default class AttachmentMng extends Component{

    constructor(props){
        super(props);
        this.state = {
            show:false,
            pk_supplier:null,
            mdid:null,
        }
    }

    showAttachMng = (config)=>{

        this.setState(Object.assign(config,{show:true}));
    }

    render(){
        return(
            <div id='portalContainter02'>
            {this.state.show && <NCUploader
                billId={'uapbd/'+this.state.mdid+'/'+this.state.pk_supplier}
                placement={'bottom_right'}
                multiple={true}
                onHide={()=>{
                    this.setState({show:false});
                }}
            />}
            </div>
        )
    }
}

//sd2YXpchPbc0A8nu/S+aHvcjph4iM0L5BiohlbA5rh1slHJJNmdMRepMzy/xOZhw