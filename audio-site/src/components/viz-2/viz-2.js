import React from 'react';
import Kirra from '../../assets/audio/Kirra.mp3';
import * as d3 from "d3";
import play from '../../assets/images/play.png';
import pause from '../../assets/images/pause.png';

const audioElement = document.createElement('audio');
const ctx = new AudioContext();
const sourceNode = ctx.createMediaElementSource(audioElement);
const analyser = ctx.createAnalyser();
const bufferSize = analyser.frequencyBinCount
const frequencyData = new Uint8Array(bufferSize);
const colorScale = d3.scaleLinear()
                    .domain([0, 300])
                    .range(["#003366","#FF69B4"]);

const height = window.innerHeight - 100;
const width = window.innerWidth - 10;

let defs, gradient;

const requestAnimationFrame = window.requestAnimationFrame;

let rotate = 0;
let centerX = width/2;
let centerY = height/2;
let revolve = 0;

export default class Viz2 extends React.Component {

    constructor(props){

        super(props);

        this.drawVisuals = this.drawVisuals.bind(this);
        this.calcX = this.calcX.bind(this);
        this.calcY = this.calcY.bind(this);

    }

    componentDidMount(){
        this.setupVisuals();
        this.drawVisuals();
    }

    componentDidUpdate(){
        this.setupVisuals();
        this.drawVisuals();
    }

    calcX(d, i){
        return i > frequencyData.length/2 ? centerX + (1.5 * d * Math.cos(i + rotate)) : centerX - (1.5 * d * Math.cos(i + rotate));
    }

    calcY(d, i){
        return i > frequencyData.length/2 ? centerY + (1.5 * d * Math.sin(i + rotate)) : centerY - (1.5 * d * Math.sin(i + rotate));
    }

    setupAudio(){

        audioElement.src = Kirra;
        sourceNode.connect(analyser);
        analyser.connect(ctx.destination);
        analyser.getByteFrequencyData(frequencyData);

    }

    setupVisuals(){ 

        let svg = d3.select(this.node)
            .attr('width', width)
            .attr('height', height);

        svg.append("path")
            .attr("fill", "none")
            .append("opa")
                
        defs = svg.append("defs");

        gradient = defs.append("radialGradient")
            .attr("id", "radial-gradient")
        
        gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", '#003366')
            .attr("stop-opacity", 0.0);
        
        gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "#FF69B4")
            .attr("stop-opacity", 0.3);
            
        svg.selectAll('circle')
            .data(frequencyData)
            .enter()
            .append('circle')
            .style('opacity', d => 0.02)
            .attr('cx', (d, i) => width/2)
            .attr('cy', (d, i) =>  height/2);

        svg.selectAll('line')
            .data(frequencyData)
            .enter()
            .append('line')
            .attr('stroke-width', '2px')
            .attr('x1', width/2)
            .attr('y1', height/2)
            .attr('stroke-linecap', 'round');

    }

    drawVisuals(){

        requestAnimationFrame(this.drawVisuals);
    
        analyser.getByteFrequencyData (frequencyData);
        
        d3.select(this.node).selectAll('circle')
            .data(frequencyData)
            .attr('fill', (d) => colorScale(d))
            .attr('r', (d) => d * 1.5)
            .transition().duration();
 
        d3.select(this.node).selectAll('line')
            .data(frequencyData)
            .attr("stroke", "url(#radial-gradient)")
            .attr('x2', (d, i) => this.calcX(d, i))
            .attr('y2', (d, i) => this.calcY(d, i));

        rotate = rotate === 360 ? 0 : rotate += 0.02;

    }

    playKirra(){

        audioElement.src = Kirra;
        audioElement.play();

    }

    pause(){ 
        audioElement.pause();
    }
    
    render() {

        this.setupAudio();

        return (
            <div className="main">
                    <div className="buttons">
                        <div id="play">
                            <img src={play} alt="play" onClick={this.playKirra}/>
                        </div>

                        <div id="pause">
                            <img src={pause} alt='pause' onClick={this.pause}/>
                        </div>
                    </div>
                <svg ref={node => this.node = node}></svg>
            </div>

        )
    }
}