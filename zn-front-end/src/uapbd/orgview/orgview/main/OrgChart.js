//UrnV8/PEtESLb1uxT2mMUPozJ8WrK3X6eBZ7DITYAE3XIOTcA2/d4BJyZQaMEAXI

import React, { Component,Fragment } from 'react';
import { base,toast } from 'nc-lightapp-front';
import {component} from '../../../public/platwapper/index.js';
const { NCButton,NCSelect } = component
let { NCModal,NCFormControl,NCInputNumber  } = base;
let maxDeep = 0,
    maxlen = 0,
    nodeArr = [],
    picWidth = 0,
    picHeight = 0;
/*
    构建树节点
*/
function TreeNodeTop({treedata,parentNode,nodeStyle,direction,maxTier}){
  var childsNode = [];

  if(!treedata) return;
  //赋值
  this.nodeStyle = deepObj(nodeStyle);
  this.width = nodeStyle.width;
  this.height = nodeStyle.height;
  this.parentNode = parentNode;
  this.text = treedata.name;
  this.code = treedata.code;
  this.data = treedata;
  treedata.tier = parentNode? parentNode.tier + 1 : 0;

    //判断节点是否有子元素
    if(treedata.children && treedata.children.length > 0){
      //递归
      childsNode = treedata.children.map(function(child){
          return new TreeNodeTop({treedata:child,parentNode:treedata,nodeStyle:nodeStyle,direction,maxTier});
      });

      //根据第一个子节点和最后一个子节点判断当前节点的x坐标
      switch (direction){
        case 'top':
          this.y = treedata.tier * (this.height + nodeStyle.spanceY) + 50;
          this.x = (childsNode[childsNode.length - 1].x + childsNode[0].x)/2;
          break;
        case 'left':
          this.y = (childsNode[childsNode.length - 1].y + childsNode[0].y)/2;
          this.x = treedata.tier * (this.width + nodeStyle.spanceX) + 50;
          break;
        default:
          break;
      }
      //有子元素，设个按钮
      this.btnBoole = treedata.tier < maxTier? true : false;
  }else{
    switch (direction){
      case 'top':
        this.y = treedata.tier * (this.height + nodeStyle.spanceY) + 50;
        //记录最大深度（用来设置canvas的height）
        maxDeep = maxDeep > this.y? maxDeep : this.y;
        this.x = maxlen + 50;
        //记录最大宽度（用来设置x和canvas的width）
        maxlen = maxlen + nodeStyle.width+ nodeStyle.spanceX;
        break;
      case 'left':
        this.x = treedata.tier * (this.width + nodeStyle.spanceX) + 50;
        //记录最大深度（用来设置canvas的height）
        maxDeep = maxDeep > this.x? maxDeep : this.x;
        this.y = maxlen + 50;
        //记录最大宽度（用来设置x和canvas的width）
        maxlen = maxlen + nodeStyle.height+ nodeStyle.spanceY;
        break;
      default:
        break;
    }
      
  }
  //赋值
  this.childsNode = childsNode;
  nodeArr.push(this);
}

function deepObj(source){
  let result = {};
  for(let key in source){
      result[key] = typeof source[key] === 'object'? this.deepObj(source[key]) : source[key];
  }
  return result;
}

export default class OrgChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      direction:'top',
      nodeStyle:{
        width:116,
        height:54,
        lineWidth:2,
        linecolor:`#B2B2B2`,
        borderColor:'white',
        borderWidth:0.1,
        bgcolor:`#CCEAFF`,
        font:'600 13px MicrosoftYaHei',
        fontName:'12px MicrosoftYaHei',
        fontSize:'12',
        fontFormat:'MicrosoftYaHei',
        fontColor:'#0063D4',
        textAlign:'center',
        textBaseline:'middle',
        btnR:8,
        spanceX:35,
        spanceY:53
      },
      setStyle:{
        width:116,
        height:54,
        spanceX:35,
        spanceY:53,
        tier:10,
        zoom:100,
        direction:'top'
      },
      tier:10,
      zoom:100,
      maxlen:0,
      maxDeep:0,
      moveNode:false,
      setModalShow:false
    }
    this.datas = props.data || {};
    this.handleSelectClick = this.handleSelectClick.bind(this);
    this.handleMaxTier = this.handleMaxTier.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleSetWidth = this.handleSetWidth.bind(this);
    this.handleSetHeight = this.handleSetHeight.bind(this);
    this.handleSpacY = this.handleSpacY.bind(this);
    this.handleSpacX = this.handleSpacX.bind(this);
    this.hanldShowSetModal = this.hanldShowSetModal.bind(this);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.handleCanvasMouseDown = this.handleCanvasMouseDown.bind(this);
    this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this);
    this.handleCanvasMouseUp = this.handleCanvasMouseUp.bind(this);
    this.handleFont = this.handleFont.bind(this);
  }

  componentDidMount(){
    const canvas = this.refs.view;
    this.ctx = canvas.getContext("2d");
  }

  componentWillReceiveProps(newProps) {
    this.lang = newProps.data.lang;
    if(Object.keys(newProps.data).length == 0) return;
    if(newProps.data.name === this.datas.name && newProps.data.children.length === this.datas.children.length) return;

    this.datas = newProps.data;
    if(!this.datas.children || this.datas.children.length === 0){
      this.ctx.clearRect(0,0,this.state.canvaWidth,this.state.canvaHeight);
      return;
    } 
    //测试大数据量
    // let chilobj = this.deepObj(newProps.data.children[0]); 
    // for(let i = 0;i < 1000;i++){
    //   newProps.data.children.push(chilobj);
    // }

    this.initTreeNode();
    if(this.state.canvaWidth === 31000 || this.state.canvaHeight === 31000){
      if(document.getElementsByClassName('toast-mask-modal demo--demo').length > 0) return false;
      toast({title:this.lang&&this.lang['ORGVIEW-003001'],content:this.lang&&this.lang['ORGVIEW-003002'],color:'warning',duration:0.2});//'机构数量过多'
    }
  }
  
   //画树
   calculate({treenode,parentNode,clickXY}){
    let nodeStyle = treenode.nodeStyle;
    picWidth = picWidth > treenode.x + nodeStyle.width? picWidth : treenode.x + nodeStyle.width;
    picHeight = picHeight > treenode.y + nodeStyle.height? picHeight : treenode.y + nodeStyle.height;
    if(treenode.x < 3100 || treenode.y < 3100){
       //画线
      this.drawLine({treenode,parentNode});
      //画长方形
      this.drawRectangle({treenode,nodeStyle});
      //画文字
      this.drawText({treenode,nodeStyle});
    } 

    
    if(clickXY && this.pointInsideCircle(clickXY,treenode.btnXY,nodeStyle.btnR)){
      treenode.btnBoole = !treenode.btnBoole;
      clickXY = null;
    }

   
    //递归，根据按钮状态判断是否显示子元素
    if(treenode.btnBoole){
        treenode.childsNode.map((child)=> this.calculate({
          treenode:child,
          parentNode:treenode,
          clickXY
        }));
    }
    if(treenode.childsNode && treenode.childsNode.length !== 0){
      this.drawBtn(treenode,nodeStyle);
    }
  
  }
  //canvas点击
  handleCanvasClick(e){
    var nodeStyle = this.state.nodeStyle;
    let x = e.pageX -  (e.target.getBoundingClientRect().x || 16);
    let y = e.pageY - (e.target.getBoundingClientRect().y || 206);
    this.ctx.clearRect(0,0,this.state.canvaWidth,this.state.canvaHeight);
    this.drawBg();
    this.nodes.map(node =>{
      this.calculate({
        treenode:node,
        clickXY:{x,y}
      });
    });
    
    //this.calculate({treenode:this.node,clickXY:{x,y}});
  }
  handleSelectClick(e){
    let setStyle = this.state.setStyle;
    setStyle.direction = e;
    //设置canvas的width和height
    this.setState(setStyle);
  }
  handleMaxTier(e){
    let setStyle = this.state.setStyle;
    setStyle.tier = Number(e);
    this.setState(setStyle);
  }
  handleZoom(e){
    let setStyle = this.state.setStyle;
    setStyle.zoom = e;
    this.setState(setStyle);
  }
  handleCanvasMouseDown(e){
    var downXY = {
        x:(e.pageX - (e.target.getBoundingClientRect().x || 16))* 100 / this.state.zoom,
        y:(e.pageY - (e.target.getBoundingClientRect().y || 206))* 100 / this.state.zoom
    };
    if(this.prev){
      this.prev.nodeStyle.fontColor = this.state.nodeStyle.fontColor;
      this.prev.nodeStyle.borderColor = this.state.nodeStyle.borderColor;
      this.prev.nodeStyle.borderWidth = this.state.nodeStyle.borderWidth;
    }
    for(let node of nodeArr){
      let index = false;
      if(this.pointInsideRectangle(downXY,node,{x:node.x + node.width,y:node.y + node.height})){
        index = true;
        node.nodeStyle.fontColor = 'black';
        node.nodeStyle.borderColor = '#0096FF';
        node.nodeStyle.borderWidth = 2;
        this.setState({
          moveNode:{
            downXY,
            node,
            initXY:{
              x:node.x,
              y:node.y
            }
          }
        });
        this.prev = node;
        this.props.setSelectNode(node);
        break;
      }
      if(!index){
        this.props.setSelectNode(null);
      }
    }
  }
  handleCanvasMouseMove(e){
    if(!this.state.moveNode) return false;
    let moveX = (e.pageX - (e.target.getBoundingClientRect().x || 16))* 100 / this.state.zoom;
    let moveY = (e.pageY - (e.target.getBoundingClientRect().y || 206))* 100 / this.state.zoom;
    let moveNode = this.state.moveNode;

    moveNode.node.x = moveNode.initXY.x + moveX - moveNode.downXY.x;
    moveNode.node.y = moveNode.initXY.y + moveY - moveNode.downXY.y;
    this.ctx.clearRect(0,0,this.state.canvaWidth,this.state.canvaHeight);
    this.drawBg();
    picWidth = 0;
    picHeight = 0;
    this.nodes.map(node =>{
      this.calculate({
        treenode:node
      });
    });
  }
  handleCanvasMouseUp(){
    // let moveNode = this.state.moveNode;
    // //向orgview传递实际的高度和宽度（用于截图下载图片）
    // if(this.state.moveNode){
    //   this.picWidth = this.picWidth > moveNode.node.x + this.state.nodeStyle.width + 50? this.picWidth : moveNode.node.x + this.state.nodeStyle.width + 50;
    //   this.picHeight = this.picHeight > moveNode.node.y + this.state.nodeStyle.height + 50? this.picHeight : moveNode.node.y + this.state.nodeStyle.height + 50;
    //   
    // }
    this.props.getCanvasWH(picWidth + 50,picHeight + 50);
    this.setState({
      moveNode:false
    });
  }
  handleSetWidth(e){
    let setStyle = this.state.setStyle;
    setStyle.width = Number(e);
    this.setState(setStyle);
  }
  handleSetHeight(e){
    let setStyle = this.state.setStyle;
    setStyle.height = Number(e);
    this.setState(setStyle);
  }
  handleFont(e){
    let nodeStyle = this.state.nodeStyle;
    nodeStyle.fontSize = e;
    nodeStyle.font = Number(nodeStyle.fontSize) + 1 + 'px' + ' ' + nodeStyle.fontFormat;
    nodeStyle.font = 600 + ' ' + String(nodeStyle.font);
    nodeStyle.fontName = nodeStyle.fontSize + 'px' + ' ' + nodeStyle.fontFormat;
    this.setState(nodeStyle,this.drawNode);
  }
  handleSpacY(e){
    let setStyle = this.state.setStyle;
    setStyle.spanceY = Number(e);
    this.setState(setStyle);
  }
  handleSpacX(e){
    let setStyle = this.state.setStyle;
    setStyle.spanceX = Number(e);
    this.setState(setStyle);
  }
  hanldShowSetModal(){
    this.setState({
      setModalShow:true
    });
  }
  hanldHideSetModal(){
    let setStyle = this.state.setStyle;
    let nodeStyle = this.state.nodeStyle; 
    nodeStyle = {...nodeStyle,...setStyle};
    this.setState({nodeStyle},() =>{
      this.initTreeNode()
    });
    this.props.hanldHideSetModal();
  }
  
   //画按钮
   drawBtn(treeNode,nodeStyle = this.state.nodeStyle){
    treeNode.btnXY = {
      x:0,
      y:0
    };
    switch (this.state.direction){
      case 'top':
      treeNode.btnXY.x = treeNode.x + nodeStyle.width/2;
      treeNode.btnXY.y = treeNode.y + nodeStyle.height + nodeStyle.btnR;
        break;
      case 'left':
      treeNode.btnXY.x = treeNode.x + nodeStyle.width + nodeStyle.btnR;
      treeNode.btnXY.y = treeNode.y + nodeStyle.height/2;
        break;
      default:
        break;
    }

    //画按钮
    this.ctx.save(); 
    this.ctx.beginPath();
    this.ctx.lineWidth = nodeStyle.lineWidth;
    this.ctx.fillStyle = '#1CA1FD';
    this.ctx.arc(treeNode.btnXY.x,treeNode.btnXY.y,nodeStyle.btnR,0,2*Math.PI);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white';
    this.ctx.moveTo(treeNode.btnXY.x - nodeStyle.btnR + 4,treeNode.btnXY.y);
    this.ctx.lineTo(treeNode.btnXY.x + nodeStyle.btnR - 4,treeNode.btnXY.y);
    if(!treeNode.btnBoole){
      this.ctx.moveTo(treeNode.btnXY.x,treeNode.btnXY.y - nodeStyle.btnR + 4);
      this.ctx.lineTo(treeNode.btnXY.x,treeNode.btnXY.y + nodeStyle.btnR - 4);
    }
    this.ctx.stroke();
    this.ctx.restore(); 
  }
  //画文字
  drawText({treenode,nodeStyle = this.state.nodeStyle}){

    //设置文字的样式
    this.ctx.save(); 
    this.ctx.beginPath();
    this.ctx.font = this.state.nodeStyle.font;
    this.ctx.textAlign = nodeStyle.textAlign;
    // this.ctx.textBaseline = nodeStyle.textBaseline;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = nodeStyle.fontColor;
    this.ctx.fillText(this.textIntercept(treenode.code),treenode.x + nodeStyle.width/2,treenode.y + nodeStyle.height/2 - nodeStyle.fontSize/2 - 2);
    this.ctx.font = this.state.nodeStyle.fontName;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.textIntercept(treenode.text),treenode.x + nodeStyle.width/2,treenode.y + nodeStyle.height/2 + nodeStyle.fontSize/2 + 2);
    this.ctx.stroke();
    this.ctx.restore(); 
  }
  drawBg(){
    this.ctx.save(); 
    this.ctx.beginPath();
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0,0,this.state.canvaWidth,this.state.canvaHeight);
    this.ctx.restore(); 
  }
  //判断字的长度，超出部分。。。
  textIntercept(text){
    if(Number(this.ctx.measureText(text).width) > this.state.nodeStyle.width){ 
      for(let i = 1;i < text.length; i++){
          if(Number(this.ctx.measureText(text.substring(0,text.length - i) + '...').width) < this.state.nodeStyle.width){
            text = text.substring(0,text.length - i) + '...';
            break;
          }
      }
    }
    return text;
  }
  //画长方形
  drawRectangle({treenode,nodeStyle = this.state.nodeStyle}){
    this.ctx.save(); 
    this.ctx.beginPath();
    //画长方形   
    this.ctx.fillStyle = nodeStyle.bgcolor;
    this.ctx.fillRect(treenode.x,treenode.y,this.state.nodeStyle.width,this.state.nodeStyle.height);
    this.ctx.lineWidth = nodeStyle.borderWidth;
    this.ctx.strokeStyle = nodeStyle.borderColor;
    this.ctx.strokeRect(treenode.x,treenode.y,nodeStyle.width,nodeStyle.height);
    this.ctx.stroke();
    this.ctx.restore(); 
  }
  drawLine({treenode,parentNode,nodeStyle = this.state.nodeStyle}){
    if(!parentNode) return;
    let {linXY1,linXY2,linXY3,linXY4} = this.lineCount({treenode,parentNode});
    
    this.ctx.save(); 
    this.ctx.beginPath();
    this.ctx.strokeStyle = nodeStyle.linecolor;
    this.ctx.moveTo(linXY1.x,linXY1.y);
    this.ctx.lineTo(linXY2.x,linXY2.y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(linXY2.x,linXY2.y);
    this.ctx.lineTo(linXY3.x,linXY3.y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(linXY3.x,linXY3.y);  
    this.ctx.lineTo(linXY4.x,linXY4.y);
    this.ctx.stroke();
    this.ctx.restore(); 
  }
  //计算canvas的width,height  
  canvaWH(direction){
    let canvaWidth = 0,
        canvaHeight = 0;
    let myBrowser = this.myBrowser();
    let maxLen = myBrowser === 'Chrome'? 31000 : 8300;
    let canvasParentWidth = parseInt(this.getCurrentStyle(this.refs.orgchart).width),
        canvasParentHeight = parseInt(this.getCurrentStyle(this.refs.orgchart).height);
    switch (direction){
      case 'top':
        canvaWidth = maxlen - this.state.nodeStyle.spanceX + 100;
        canvaHeight = maxDeep + this.state.nodeStyle.height + 50;
        break;
      case 'left':
        canvaWidth = maxDeep + this.state.nodeStyle.width + 50;
        canvaHeight = maxlen - this.state.nodeStyle.spanceY + 100;
        break;
      default:
        break;
    }
    //限制canvas的最大宽高，超过canvas就挂了
    canvaWidth = canvaWidth > maxLen? maxLen :canvaWidth;
    canvaHeight = canvaHeight > maxLen? maxLen :canvaHeight;

    //向orgview传递实际的高度和宽度（用于截图下载图片）
    this.props.getCanvasWH(canvaWidth,canvaHeight);
    this.picWidth = canvaWidth;
    this.picHeight = canvaHeight;
    //设置最小的宽高，不然没法拖动
    if(canvaWidth < 1500){
      canvaWidth = 1500
    }
    if(canvaHeight < 480){
      canvaHeight = 480
    }

    maxlen = 0;
    maxDeep = 0;    
    return { canvaWidth,canvaHeight };
  }
  lineCount({treenode,parentNode,nodeStyle = this.state.nodeStyle}){
    var linXY1,linXY2,linXY3,linXY4,tans,pointP,pointC;
     
    switch (this.state.direction){
      case 'top':
        //起始点的坐标
        pointP = [parentNode.x + nodeStyle.width/2,parentNode.y + nodeStyle.height + nodeStyle.btnR*2];
     
        if(treenode.y > pointP[1]){
          pointC = [treenode.x + nodeStyle.width/2,treenode.y];
          linXY2 = {
              x: pointP[0],
              y: pointP[1] + (pointC[1] - pointP[1])/2
          };
          linXY3 = {
              x: pointC[0],
              y: linXY2.y
          };
        }else if(treenode.y - pointP[1] < 5 && pointP[1] - treenode.y  < treenode.height/2){
          pointC = [treenode.x + treenode.width,treenode.y + treenode.height/2];
          linXY2 = {
              x: pointP[0],
              y: pointC[1]
          };
          linXY3 = {
              x: pointC[0],
              y: pointC[1]
          };
        }else if(pointP[1] - treenode.y  >= treenode.height/2){
          pointC = [treenode.x + treenode.width/2,treenode.y + treenode.height];
          linXY2 = {
              x: pointP[0],
              y: pointP[1] 
          };
          linXY3 = {
              x: pointC[0],
              y: linXY2.y
          };
        }

        linXY1 = {
            x: pointP[0],
            y: pointP[1]
        };
        linXY4 = {
            x: pointC[0],
            y: pointC[1]
        };
        break;
      case 'left':
      //起始点的坐标
        pointP = [parentNode.x + nodeStyle.width + nodeStyle.btnR*2 + nodeStyle.lineWidth,parentNode.y + nodeStyle.height/2];
        tans = (treenode.x - nodeStyle.width - parentNode.x)/2;
        if(treenode.x > pointP[0]){
          pointC = [treenode.x,treenode.y + nodeStyle.height/2];
          linXY2 = {
              x: pointP[0] + (pointC[0] - pointP[0])/2,
              y: pointP[1] 
          };
          linXY3 = {
              x: linXY2.x,
              y: pointC[1]
          };
        }else if(treenode.x - pointP[0] < 5 && pointP[0] - treenode.x  < treenode.width/2){
          pointC = [treenode.x + treenode.width/2,treenode.y + treenode.height];
          linXY2 = {
              x: pointC[0],
              y: pointP[1]
          };
          linXY3 = {
              x: pointC[0],
              y: pointC[1]
          };
        }else if(pointP[0] - treenode.x  >= treenode.width/2){
          pointC = [treenode.x + treenode.width,treenode.y + treenode.height/2];
          linXY2 = {
              x: pointP[0],
              y: pointP[1] 
          };
          linXY3 = {
              x: linXY2.x,
              y: pointC[1]
          };
        }
        else{
          linXY2 = {
              x:linXY1.x + tans,
              y:linXY1.y 
          };
          linXY3 = {
              x:linXY2.x,
              y: treenode.y + nodeStyle.height/2  
          };
        }
        
        linXY1 = {
            x: pointP[0],
            y: pointP[1]
        };
        linXY4 = {
            x: pointC[0],
            y: pointC[1]
        };
        break;
      default:
        break;
    }
    return {linXY1,linXY2,linXY3,linXY4};
  }
  /**
   * 
   * @param {*} point 测试坐标
   * @param {*} circle 圆心坐标
   * @param {*} r 半径
   * 返回true为真，false为假
   */
  pointInsideCircle(point, circle, r) {  
    if (r===0 || !point || !circle) return false  
    var dx = circle.x - point.x * 100 / this.state.zoom; 
    var dy = circle.y - point.y * 100 / this.state.zoom; 
    return dx * dx + dy * dy <= r * r;  
  } 
  /**
   * 
   * @param {*} point 测试坐标
   * @param {*} react1 左上角坐标
   * @param {*} react2 右下角坐标
   * 返回true为真，false为假
   */
  pointInsideRectangle(point,react1,react2){
    let bol1 = point.x > react1.x && point.x < react2.x;
    let bol2 = point.y > react1.y && point.y < react2.y;
    return bol1 && bol2;
  }
  /**
   * 初始化树节点，并重新画出来
   */
  initTreeNode(){
    maxlen = 0;
    maxDeep = 0;
    nodeArr = [];
    this.nodes = [];
    this.datas.children.map(data =>{
      this.nodes.push(new TreeNodeTop({
        treedata:data,
        nodeStyle:this.state.nodeStyle,
        direction:this.state.direction,
        maxTier:this.state.tier
      }))
    });
    this.setState(this.canvaWH(this.state.direction),()=>{
      this.ctx.clearRect(0,0,this.state.canvaWidth,this.state.canvaHeight);

      this.drawBg();

      this.nodes.map(node =>{
        this.calculate({
          treenode:node
        });
      });
      
    });
  }
  drawNode(){
    this.ctx.clearRect(0,0,this.state.canvaWidth,this.state.canvaHeight);
    this.drawBg();
    this.nodes.map(node =>{
      this.calculate({
        treenode:node
      });
    });
  }
  // 参数node：将要获取其计算样式的元素节点
  getCurrentStyle(node) {
    var style = null;
    
    if(window.getComputedStyle) {
        style = window.getComputedStyle(node, null);
    }else{
        style = node.currentStyle;
    }
    
    return style;
  }
  cancleNodeStyle(){
    this.setState(this.saveCanvasStyle,()=>{
      //this.initTreeNode()
      this.drawNode();
    });
    this.props.hanldHideSetModal();
  }
  saveStyle(){
    let saveCanvasStyle = this.deepObj(this.state);
    this.saveCanvasStyle = saveCanvasStyle;
  }
  deepObj(source){
    let result = source instanceof Array? [] : {};
    for(let key in source){
        result[key] = typeof source[key] === 'object'? this.deepObj(source[key]) : source[key];
    }
    return result;
  }
  myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1; //判断是否Chrome浏览器
    if (isIE) {
        var IE5 = IE55 = IE6 = IE7 = IE8 = false;
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        IE55 = fIEVersion == 5.5;
        IE6 = fIEVersion == 6.0;
        IE7 = fIEVersion == 7.0;
        IE8 = fIEVersion == 8.0;
        if (IE55) {
            return "IE55";
        }
        if (IE6) {
            return "IE6";
        }
        if (IE7) {
            return "IE7";
        }
        if (IE8) {
            return "IE8";
        }
    }//isIE end
    if (isFF) {
        return "FF";
    }
    if (isOpera) {
        return "Opera";
    }
    if (isChrome) {
        return "Chrome";
    }
  }
  render(){
    return (
      <div style={{width:'100%',height:'100%'}} ref = 'orgchart'>
        <canvas 
          ref = 'view' 
          id="view"   
          width = {this.state.canvaWidth} 
          height = {this.state.canvaHeight} 
          style={{
            width:this.state.canvaWidth * this.state.zoom/100,
            height:this.state.canvaHeight * this.state.zoom/100
          }}
            onClick = {this.handleCanvasClick} 
            onMouseDown = {this.handleCanvasMouseDown}
            onMouseMove = {this.handleCanvasMouseMove}
            onMouseUp = {this.handleCanvasMouseUp}
            >
        </canvas>
        <NCModal fieldid='orgchart' className = 'setModal' onEntered = {this.saveStyle.bind(this)} show = {this.props.setModalShow} onHide = {this.props.hanldHideSetModal} size = 'lg'>
          <NCModal.Header closeButton>
              <NCModal.Title>{this.lang&&this.lang['ORGVIEW-003003']}</NCModal.Title>
          </NCModal.Header>
          <NCModal.Body className="nc-theme-common-font-c">
            <div className = 'setModalTd'>
              <span className='setName'>{this.lang&&this.lang['ORGVIEW-003004']}</span>
                <div className = 'setContent'>
                  <NCSelect fieldid='orgchartselect' onChange={this.handleSelectClick} defaultValue={this.state.setStyle.direction}>
                    <NCSelect.NCOption value="top">{this.lang&&this.lang['ORGVIEW-003005']}</NCSelect.NCOption>
                    <NCSelect.NCOption value="left">{this.lang&&this.lang['ORGVIEW-003006']}</NCSelect.NCOption>
                  </NCSelect> 
                </div>
            </div>
            <div className = 'setModalTd'>
              <span className='setName'>{this.lang&&this.lang['ORGVIEW-003007']}</span>
                <div className = 'setContent'>
                  <NCInputNumber 
                    fieldid = {'inputnum'}
                    value={this.state.setStyle.tier}
                    onChange={this.handleMaxTier}
                    />
                </div>
            </div>
            <div className = 'setModalTd'>
              <span className='setName'>{this.lang&&this.lang['ORGVIEW-003008']}</span>
                <div className = 'setContent'>
                  <NCInputNumber 
                    fieldid = {'inputnumview'}
                    // min = {this.state.setStyle.fontSize * 2 + 10}
                    value={this.state.setStyle.height}
                    onChange={this.handleSetHeight}
                    />
                </div>
            </div>
            <div className = 'setModalTd'>
              <span className='setName'>{this.lang&&this.lang['ORGVIEW-003009']}</span>
                <div className = 'setContent'>
                <NCInputNumber 
                    fieldid = {'inputnumkao'}
                    // min = {this.state.setStyle.fontSize * 2}
                    value={this.state.setStyle.width}
                    onChange={this.handleSetWidth}
                    />
                </div>
            </div>
            <div className = 'setModalTd'>
              <span className='setName'>{this.lang&&this.lang['ORGVIEW-003010']}</span>
                <div className = 'setContent'>
                <NCInputNumber 
                    fieldid = {'inputnumspany'}
                    value={this.state.setStyle.spanceY}
                    onChange={this.handleSpacY}
                    />
                </div>
            </div>
            <div className = 'setModalTd'>
              <span className='setName'>{this.lang&&this.lang['ORGVIEW-003011']}</span>
                <div className = 'setContent'>
                <NCInputNumber 
                    fieldid = {'inputnumspanx'}
                    value={this.state.setStyle.spanceX}
                    onChange={this.handleSpacX}
                    />
                </div>
            </div>
            <div className = 'setModalTd'>
              <span className='setName'>{this.lang&&this.lang['ORGVIEW-003012']}</span>
                <div className = 'setContent'>
                <NCInputNumber 
                    fieldid = {'inputnumzoom'}
                    value={this.state.setStyle.zoom}
                    onChange={this.handleZoom}
                    />
                </div>
            </div>
            <div className = 'setModalTd'>
              <span className='setName'>{this.lang&&this.lang['ORGVIEW-003013']}</span>
                <div className = 'setContent'>
                <NCInputNumber 
                    fieldid = {'inputnumtext'}
                    max={this.state.nodeStyle.height /2 - 10}
                    value={this.state.nodeStyle.fontSize}
                    onChange={this.handleFont}
                    />
                </div>
            </div>
          </NCModal.Body>
          <NCModal.Footer style={{height:'auto'}}>
              <span className = 'toastTest'>{this.lang&&this.lang['ORGVIEW-003014']}</span>
              <NCButton fieldia='orgchartbut1' className = 'button-primary' onClick={this.hanldHideSetModal.bind(this)}>{this.lang&&this.lang['ORGVIEW-003015']}</NCButton>
              <NCButton fieldia='orgchartbut1' onClick={this.cancleNodeStyle.bind(this)}>{this.lang&&this.lang['ORGVIEW-003016']}</NCButton>
          </NCModal.Footer>
        </NCModal> 
    </div>
    );
  }
}

//UrnV8/PEtESLb1uxT2mMUPozJ8WrK3X6eBZ7DITYAE3XIOTcA2/d4BJyZQaMEAXI