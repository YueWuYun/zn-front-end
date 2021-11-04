//v+2jR/qlAPdhB6+bvGcGNZFqZt7YFlt9p1r+rDllnx01vGGQmbZsNEFWDYf9rT+F
import React, { Component,Fragment } from 'react'
import {typeColor,lineMess,coodr,width,height} from './canvasData'


export class Canvas extends Component {
  constructor(props){
      super()
      this.state = {}
      this.phonyData = props.viewData;
      this.labels = [{
        textMess: {
            text: this.phonyData.NO_CLOSED,
            x: 895,
            y: 30,
            color: '#ccc',
            font: '26px Georgia'
        },
        labelMess: { x: 860, y: 30, FillColor: '#519DFF', StrokeColor: '#FFFFFF' }
    }, {
        textMess: {
            text: this.phonyData.PART_CLOSED,
            x: 1035,
            y: 30,
            color: '#ccc',
            font: '26px Georgia'
        },
        labelMess: { x: 1000, y: 30, FillColor: '#CCEAFF', StrokeColor: '#FFFFFF' }
    }, {
        textMess: {
            text: this.phonyData.CLOSED,
            x: 1195,
            y: 30,
            color: '#ccc',
            font: '26px Georgia'
        },
        labelMess: { x: 1160, y: 30, FillColor: '#FFFFFF', StrokeColor: '#07ABDE' }
    }, {
        textMess: {
            text: this.phonyData.PART_SETTLED,
            x: 1345,
            y: 30,
            color: '#ccc',
            font: '26px Georgia'
        },
        labelMess: { x: 1310, y: 30, FillColor: '#F87321', StrokeColor: '#FFFFFF' }
    }, {
        textMess: {
            text: this.phonyData.SETTLED,
            x: 1510,
            y: 30,
            color: '#ccc',
            font: '26px Georgia'
        },
        labelMess: { x: 1475, y: 30, FillColor: '#FFFFFF', StrokeColor: '#F87321' }
    }];
  }
  componentDidMount(){
    let mycanvas = this.refs.mycanvas;
    this.ctx = mycanvas.getContext("2d");

    this.datas = this.processData(this.phonyData); 
    this.lineArr = this.generateLine(this.phonyData);
    //画长方形
    this.datas.map((data)=>{
        this.calculate(data);
    });
    //画线
    this.lineArr.map((line)=>{
        this.drawLine(line);
    });
    //画标题
    this.drawTielt();
    //画注解
    this.labels.map((label) =>{
        this.drawText(label.textMess);
        this.drawLabel(label.labelMess);
    })
  }
  calculate(data){
    //画长方形
    this.ctx.beginPath();
    this.ctx.fillStyle = data.FillColor;
    this.ctx.fillRect(data.x,data.y,width,height);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;   
    this.ctx.strokeStyle = data.BorderColor;
    this.ctx.strokeRect(data.x,data.y,width,height);
    this.ctx.stroke();
    //画文字
    this.drawText({
        text:data.moduleName,
        x:data.x + width/2,
        y:data.y + height/2,
        color:data.FontColor,
        font:'600 26px MicrosoftYaHei',
        textAlign:'center',
        textBaseline:'middle'
    });
  }
  //画文字
  drawText({text,x,y,color,font,textAlign = 'left',textBaseline = 'top'}){
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.textAlign = textAlign;
    this.ctx.textBaseline = textBaseline;
    this.ctx.font = font;
    this.ctx.fillText(text,x,y);
    this.ctx.stroke();
  }
  //画线
  drawLine(line){
    let mess = lineMess[line[0]];
    if(!mess || !mess[line[1]]) return;
    let startX = mess.x,
        startY = mess.y,
        endX = mess[line[1]].x,
        endY = mess[line[1]].y;

    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#B2B2B2';
    this.ctx.moveTo(startX,startY);
    this.ctx.lineTo(endX,endY);
    this.ctx.stroke();

    let radians = Math.atan((endY-startY)/(endX-startX));
    radians+=((endX>=startX)?90:-90)*Math.PI/180;

    this.drawTriangle({endX,endY},radians);
  }
  //画箭头
  drawTriangle({endX,endY},radians){
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(endX,endY);
    this.ctx.rotate(radians);
    this.ctx.moveTo(0,0);
    this.ctx.lineTo(5,10);
    this.ctx.lineTo(-5,10);
    this.ctx[ 'fill' + 'Style'] = '#B2B2B2';
    this.ctx.closePath();

    this.ctx.fill();
    this.ctx.restore();
    this.ctx.stroke();
  }
  //画标题
  drawTielt(){
    this.ctx.lineWidth = 1;
    this.drawText({
        text:this.phonyData.PeriodName + ' ' + this.phonyData.Period,
        x:20,
        y:30,
        color:'#ccc',
        font:'600 26px Serif'
    });
  }
  //画注解
  drawLabel(labelMess){
    this.ctx.beginPath();
    this.ctx.fillStyle = labelMess.FillColor;
    this.ctx.fillRect(labelMess.x,labelMess.y,25,25);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;   
    this.ctx.strokeStyle = labelMess.StrokeColor;
    this.ctx.strokeRect(labelMess.x,labelMess.y,25,25);
    this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.strokeStyle = labelMess.bottomColor;
    // this.ctx.moveTo(labelMess.x,labelMess.y);
    // this.ctx.lineTo(labelMess.x,labelMess.y + 25);
    // this.ctx.lineTo(labelMess.x + 25,labelMess.y + 25);
    // this.ctx.closePath();
    // this.ctx.fillStyle = labelMess.bottomColor;
    // this.ctx.fill();
    // this.ctx.stroke();

    // this.ctx.beginPath();
    // this.ctx.moveTo(labelMess.x,labelMess.y);
    // this.ctx.lineTo(labelMess.x + 25,labelMess.y);
    // this.ctx.lineTo(labelMess.x + 25,labelMess.y + 25);
    // this.ctx.closePath();
    // this.ctx.fillStyle = labelMess.topColor;
    // this.ctx.fill();

    // this.ctx.beginPath();
    // this.ctx.strokeStyle = '#1E69DA';
    // this.ctx.strokeRect(labelMess.x,labelMess.y,25,25);
    // this.ctx.stroke();
  }
  //处理2个模块之间父子级的关系
  generateLine(phonyData){
    let modulesRelation = phonyData.modulesRelation;
    let lineArr = [];
    for(let rela in modulesRelation){
        lineArr.push(rela.split('='));
    }
    return lineArr;
  }
  //给每个模块数据增加坐标。及类型颜色等
  processData(phonyData){
    let modules = phonyData.modules,
        datas = [];
    for(let mod in modules){
        datas.push({...modules[mod],...typeColor[modules[mod].closedType],...coodr[mod]});
    }

    return datas;
  }
  render() {
    return (
      <Fragment>
        <canvas ref = 'mycanvas' 
            width="1600" height="1000px" 
            style={{width:'800px'}}></canvas>
      </Fragment>
    )
  }
}

export default Canvas

//v+2jR/qlAPdhB6+bvGcGNZFqZt7YFlt9p1r+rDllnx01vGGQmbZsNEFWDYf9rT+F