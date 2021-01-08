import React from 'react'
import ReactDOM from 'react-dom'

// const element = (
//   <div id="foo">
//     <a>bar</a>
//     <b />
//   </div>
// )

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => 
        typeof child === 'object'
          ? child
          : createTextElement(child)
      )
    }
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

const isProperty = key => key !== "children"

function render (ele, container) {
  // console.info(ele, container)
  const dom = ele.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(ele.type)
  
  Object.keys(ele.props)
    .filter(isProperty)
    .forEach(name => dom[name] = ele.props[name]);

  ele.props.children.forEach(element => {
    render(element, dom)
  });
  container.appendChild(dom)
}

const Dedoo = {
  createElement,
  render
};

// const element = Dedoo.createElement(
//   'div',
//   { id: 'foo'},
//   React.createElement('span', null, 'this is span'),
//   Dedoo.createElement("b")
// )

/** @jsx Dedoo.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)

const container = document.getElementById("root")
// ReactDOM.render(element, container);
Dedoo.render(element, container)

