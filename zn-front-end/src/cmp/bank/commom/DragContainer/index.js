/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import './index.less';

export default class DragContainer extends Component {
    static defaultProps= {
        type: 'horizon',
        percent: '50%'
    };

	constructor(props) {
        super(props);
        this.state= {
            styleObj: {
                horizon: 'width',
                vertical: 'height'
            }
        };
        this.mouseDown = false;
	}

	componentDidMount() {
        this.check(this.props.type);
    }
    
	componentWillReceiveProps(nextProps) {
        if (nextProps.type!== this.props.type) {
            this.check(nextProps.type);
        }
	}
    
    check =(type) => {
        if (type=== 'horizon') {
            this.clientWid = this.divDom.clientWidth;
        } else {
            this.clientHei = this.divDom.clientHeight;
        }
        this.onMouseDown(type); 
    }

	onMouseDown = type => {
        document.documentElement.onmousemove = (e) => {
            e.stopPropagation();
            if (type=== 'horizon') {
                if (this.mouseDown) {
                    let wid = this.clientWid + (e.x - this.beginX);
                    if (wid >= this.box.clientWidth - 20 || wid <= 50) {
                        this.divDom.style.width = this.divDom.clientWidth + 'px';
                    } else {
                        this.divDom.style.width = wid + 'px';
                    }
                }
            } else {
                if (this.mouseDown) {
                    let hei = this.clientHei + (e.y - this.beginY);
                    if (hei >= this.box.clientHeight - 20 || hei <= 50) {
                        this.divDom.style.height = this.divDom.clientHeight + 'px';
                    } else {
                        this.divDom.style.height = hei + 'px';
                    }
                }
            }
		};
		document.documentElement.onmouseup = (e) => {
            this.mouseDown = false;
			if (type=== 'horizon') {
			    this.clientWid = this.divDom.clientWidth;
            } else {
                this.clientHei = this.divDom.clientHeight;
            }
		};
		this.spanDom.onmousedown = (e) => {
			if (type=== 'horizon') {
                this.beginX = e.x;
            } else {
                this.beginY = e.y;
            }
            this.mouseDown = true;
		};
	}

	render() {
        let { Dom1, Dom2, type, size }= this.props;
        let { styleObj }= this.state;
        const changeColor = obj => {
            return window.top.nccColor==='black' ? obj : {};
        }
		return (
			<div 
                className={`drag-container ${type=== 'vertical' ? 'vertical' : 'horizon'}`}
                style={changeColor({backgroundColor: '#27272a'})}
				ref={(box) => {
					this.box = box;
				}}
			>
				<div
					className="drag-container-dom1"
					style={{ height: '100%', [styleObj[type]]: size }}
					ref={(div) => {
						this.divDom = div;
					}}
				>
					{Dom1}
				</div>
				<div
					ref={(span) => {
						this.spanDom = span;
					}}
					className="drag-container-seperate"
				>
					<div className="drag-container-seperate-lines" />
				</div>
				<div className="drag-container-dom2">{Dom2}</div>
			</div>
		);
	}
}

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/