import React from 'react';
import Beat2 from '../../assets/audio/BEAT2.wav';
import * as d3 from "d3";

const audioElement = document.createElement('audio');
const ctx = new AudioContext();
const sourceNode = ctx.createMediaElementSource(audioElement);
const analyser = ctx.createAnalyser();
const bufferSize = analyser.frequencyBinCount
const frequencyData = new Uint8Array(bufferSize);
const colorScale = d3.scaleLinear()
                    .domain([0, 4])
                    .range(["#003366","#FF69B4"]);

const lf0 = d3.line()
                .x(function(d, i){ return width/4 + i/1.5 })
                .y(function(d, i){ return d })

const lf1 = d3.line()
                .x(function(d, i){ return width/4 + i/1.5 + 50})
                .y(function(d, i){ return d + 50})

const lf2 = d3.line()
                .x(function(d, i){ return width/4 + i/1.5 + 100})
                .y(function(d, i){ return d + 100})

const lf3 = d3.line()
                .x(function(d, i){ return width/4 + i/1.5 + 150})
                .y(function(d, i){ return d + 150})

const lf4 = d3.line()
                .x(function(d, i){ return width/4 + i/1.5 + 200})
                .y(function(d, i){ return d + 200})

let t = d3.transition().duration(10000).ease(d3.easeBounce);

const height = window.innerHeight - 100;
const width = window.innerWidth - 10;
// const rectwidth = width/frequencyData.length

const requestAnimationFrame = window.requestAnimationFrame;

let count = 0;
let playing = false;
let then = Date.now();
let fpsInterval = 1000 / 20.9;

export default class Viz2 extends React.Component {

    constructor(props){

        super(props);

        this.drawVisuals = this.drawVisuals.bind(this);

    }

    componentDidMount(){
        this.setupVisuals();
        this.drawVisuals();
    }

    componentDidUpdate(){
        this.setupVisuals();
        this.drawVisuals();
    }

    setupAudio(){

        audioElement.src = Beat2;
        sourceNode.connect(analyser);
        analyser.connect(ctx.destination);
        analyser.getByteTimeDomainData(frequencyData);

    }

    setupVisuals(){ 

        then = Date.now();

        d3.select(this.node)
            .attr('width', width)
            .attr('height', height);

    }

    drawVisuals(){

        requestAnimationFrame(this.drawVisuals);

        let now = Date.now();
        let elapsed = now - then;

        if(elapsed > fpsInterval) {

            then = now - (elapsed % fpsInterval);
            analyser.getByteTimeDomainData (frequencyData);

            // console.log(frequencyData);
            switch(count){
                case 0: 
                    d3.select(this.node).append('path')
                        .attr('d', lf0(frequencyData))
                        .style('opacity', 0.9)
                        .attr('stroke', 'black')
                        .attr('fill', colorScale(count))
                        .transition(t)
                        .style('opacity', 0.1)
                        .attr('fill', '#000066')
                        .remove();
                    break;
                case 1: 
                    d3.select(this.node).append('path')
                        .attr('d', lf1(frequencyData))
                        .style('opacity', 0.9)
                        .attr('stroke', 'black')
                        .attr('fill', colorScale(count))
                        .transition(t)
                        .style('opacity', 0.1)
                        .attr('fill', '#000066')
                        .remove();
                    break;
                case 2: 
                    d3.select(this.node).append('path')
                        .attr('d', lf2(frequencyData))
                        .style('opacity', 0.9)
                        .attr('stroke', 'black')
                        .attr('fill', colorScale(count))
                        .transition(t)
                        .style('opacity', 0.1)
                        .attr('fill', '#000066')
                        .remove();
                    break;
                case 3: 
                    d3.select(this.node).append('path')
                        .attr('d', lf3(frequencyData))
                        .style('opacity', 0.9)
                        .attr('stroke', 'black')
                        .attr('fill', colorScale(count))
                        .transition(t)
                        .style('opacity', 0.1)
                        .attr('fill', '#000066')
                        .remove();
                    break;
                case 4: 
                    d3.select(this.node).append('path')
                        .attr('d', lf4(frequencyData))
                        .style('opacity', 0.9)
                        .attr('stroke', 'black')
                        .attr('fill', colorScale(count))
                        .transition(t)
                        .style('opacity', 0.1)
                        .attr('fill', '#000066')
                        .remove();
                    break;
            }
    
            count = count == 4 ? 0 : count+1


        }
    


    }

    playBeat2(){

        audioElement.src = Beat2;
        audioElement.play();
        playing = true;

    }

    pause(){ 
        audioElement.pause();
        playing = false;
    }
    
    render() {

        this.setupAudio();

        return (
            <div className="main">
                <div className='buttons'>
                    <div id="play">
                        <button onClick={this.playBeat2}>play Beat2</button>
                    </div>

                    <div id="pause">
                        <button onClick={this.pause}>pause</button>
                    </div>
                </div>
                <svg id='viz' ref={node => this.node = node}></svg>
            </div>

        )
    }
}