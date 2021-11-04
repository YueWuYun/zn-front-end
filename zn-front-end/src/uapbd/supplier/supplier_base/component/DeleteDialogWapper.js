//MURDd9Mp4bSePe2EViRoa77jYJwxiOi5HJYdVArfistwndoaYRe1hsGS9ABpTaPz
import {base} from 'nc-lightapp-front';
import DeleteDialog from './DeleteDialog';
const {NCModal} = base;

import './Common.less';

export default class DeleteDialogWapper extends DeleteDialog{

    constructor(props){
        super(props);
        this.state = {
            ...this.state
        }
    }

    render(){
        let {showDialog , style, header, showFooter,body} = this.state;
        var id = Date.now() + Math.random();
        let indexInfo = { id, zIndex:style.dialogZIndex };
        return (

            <NCModal
                show = {showDialog}
                onHide = {this.close}
                className={`prompt-box ${id}`}
                backdrop={"static"}
                indexInfo={indexInfo}
                ref={NCModal => (this.NCModal = NCModal)}
                fieldid="simpleConfirm"
                resizable={this.state.resizable || false}
            >
                <NCModal.Header closeButton>
                    <NCModal.Title>{header.dialogTitle}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <NCModal.Title fieldid="null">
                        <span className={"iconfont icon-zhuyi1 warning"} /> 
                        {body.renderContentTitle() || '删除'}
                    </NCModal.Title>
                    <div className="prompt-box-body-content">{body.renderDialogContent()}</div>
                </NCModal.Body>
                {showFooter && <NCModal.Footer>{this.renderFooterButtons()}</NCModal.Footer>}
            </NCModal>



            

        )

    }


}
//MURDd9Mp4bSePe2EViRoa77jYJwxiOi5HJYdVArfistwndoaYRe1hsGS9ABpTaPz