// import './module/0_Review';

// import './module/1_createElementFn';

// import './module/2_render';

// import './module/3_concurrentMode';

// import './module/4_fibers';

// import './module/5_renderCommitPhases';

// import './module/6_reconciliation';

// import './module/7_functionComponents';
import ReactDOM from 'react-dom';
import Dedoo from './Dedoo';

/**@jsx Dedoo.createElement */
const Element = () => {
  const [state, setState] = Dedoo.useState(1);
  return (
    <div id='foo'>
      <a>bar</a>
      <p>你好</p>
      <p>{state}</p>
      <h1>123123</h1>
      {/* <button onClick={() => {
        setState(c => c + 1)
      }}>点击</button> */}
      <button onClick={() => {
        setState(123123);
      }}>点击</button>
      <b/>
    </div>
  )
}

const element = <Element name="foo" />

const container = document.getElementById('root');
Dedoo.render(element, container);

import './ttt';

import React, {
  useState
} from 'react';
