// @flow
import * as React from 'react';

/** @memberOf ProgressiveTable */
type Props = {
  children: React.Node,
  minimumRender: number,
  nextRenderIncrement: number,
  tr: React.ElementType
};

/** @memberOf ProgressiveTable */
type State = {
  children: React.Node,
  row: number,
  minimumRender: number
};

export default class ProgressiveTable extends React.Component<Props, State> {
  static defaultProps = {
    minimumRender: 16,
    nextRenderIncrement: 1,
    tr: 'tr'
  };

  minHeight: number = 0;

  timer: TimeoutID;

  element: HTMLElement;

  currentRow: number = 0;

  state = {
    row: this.props.minimumRender,
    minimumRender: this.props.minimumRender,
    children: this.props.children
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      children: props.children,
      minimumRender: props.minimumRender,
      row:
        props.minimumRender !== state.minimumRender ||
        props.children !== state.children
          ? props.minimumRender
          : state.row
    };
  }

  componentDidMount() {
    this.shouldRenderNextRow();
  }

  componentDidUpdate() {
    this.shouldRenderNextRow();
  }

  shouldRenderNextRow() {
    clearTimeout(this.timer);

    if (this.state.row <= this.currentRow) {
      this.minHeight = Math.max(this.minHeight, this.element.offsetHeight);
      this.element.style.minHeight = `${this.minHeight}px`;

      this.timer = setTimeout(this.renderNextRow, 0);
    } else {
      this.element.style.minHeight = '0px';
      this.minHeight = this.element.offsetHeight;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  renderNextRow = (): void => {
    this.setState({ row: this.state.row + this.props.nextRenderIncrement });
  };

  setElement = (el: HTMLElement | null) => {
    this.element = ((el: any): HTMLElement);
  };

  renderChildren(children: React.Node): React.Node {
    return React.Children.toArray(children).map((node) => {
      if (!node || !node.type) return node;

      if (this.props.tr === node.type) {
        return this.currentRow++ < this.state.row ? node : null;
      }

      return React.cloneElement(
        node,
        node.props,
        node.props && this.renderChildren(node.props.children)
      );
    });
  }

  render(): React.Node {
    this.currentRow = 0;

    return (
      <div ref={this.setElement}>
        {this.renderChildren(this.props.children)}
      </div>
    );
  }
}
