type DedooNode = () => void;

type SelfElementType = 'TEXT_ELEMENT';
type DedooElementType = keyof HTMLElementTagNameMap | DedooNode | SelfElementType;

interface DedooElement {
  type: DedooElementType
  props?: {
    [props: string]: any;
    children: any[];
  };
}
