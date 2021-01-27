type DedooNode = () => void;

type FiberDom = HTMLElement | Text;

type SelfElementType = 'TEXT_ELEMENT';
type DedooElementType = keyof HTMLElementTagNameMap | DedooNode | SelfElementType;

type FiberEffectTag = 'UPDATE' | 'DELETE' | 'ADD';

interface DedooElementProps {
  [props: string]: any;
  children: DedooElement[];
};
interface DedooElement {
  type: DedooElementType
  props: DedooElementProps | null;
}

interface DedooFiber extends DedooElement {
  dom: FiberDom | null;
  parent: DedooFiber;
  sibling?: DedooFiber | null;
  child?: DedooFiber | null;
  alternate: DedooFiber | null;
  effectTag: FiberEffectTag;
}

type FiberNextWork = DedooFiber | null;
