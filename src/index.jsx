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
const element = (
  <div id='foo'>
    <a>bar</a>
    <b/>
  </div>
)

const container = document.getElementById('root');
Dedoo.render(element, container);
