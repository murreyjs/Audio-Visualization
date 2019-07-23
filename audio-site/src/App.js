import React from 'react';
import Tabs from './components/tabs/tabs';
import Viz1Page from './pages/viz-1-page/viz-1-page';
import Viz2Page from './pages/viz-2-page/viz-2-page';
import AboutMe from './pages/about-me/about-me';

class App extends React.Component {

  render() {
    return (
      <div>
        <Tabs>
          <div label="About Me">
            <AboutMe></AboutMe>
          </div>
          <div label="Time">
            <Viz1Page></Viz1Page>
          </div>
          <div label="Breathing Planet">
            <Viz2Page></Viz2Page>
          </div>
          <div label="MiniMixer">
            
          </div>
        </Tabs>
      </div>
    )
  }
}

export default App;