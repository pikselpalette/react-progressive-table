// @flow
import * as React from 'react';

/** @memberOf ProgressiveTable */
type Props = {
  children: React.Node,
  minimumRender: number,
  nextRenderIncrement: number
};

/** @memberOf ProgressiveTable */
type State = {
  row: number,
  minimumRender: number
};

type AsableProps = {
  as: React.ComponentType<any>,
  children: React.Node,
  [string]: any
};

const generateAsableComponent = (defaultAs: string) => {
  const AsableComponent = (props: AsableProps) => {
    const { as, ...rest } = props;
    const Component = as;

    return (
      <Component {...rest} />
    );
  };

  AsableComponent.displayName = `ProgressiveTable(${defaultAs})`;
  AsableComponent.defaultProps = {
    as: defaultAs
  };

  return AsableComponent;
};

export default class ProgressiveTable extends React.Component<Props, State> {
  static defaultProps = {
    minimumRender: 16,
    nextRenderIncrement: 1
  };

  static Row = generateAsableComponent('tr');
  static Cell = generateAsableComponent('td');
  static HeaderCell = generateAsableComponent('th');
  static Header = generateAsableComponent('thead');
  static Body = generateAsableComponent('tbody');
  static Table = generateAsableComponent('table');

  minHeight: number = 0;
  timer: TimeoutID;
  element: HTMLElement;
  currentRow: number = 0;

  state = {
    row: this.props.minimumRender,
    minimumRender: this.props.minimumRender
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      minimumRender: props.minimumRender,
      row: props.minimumRender !== state.minimumRender
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
    if (this.timer) clearTimeout(this.timer);

    if (this.state.row <= this.currentRow && this.element) {
      this.minHeight = Math.max(this.minHeight, this.element.offsetHeight);
      this.element.style.minHeight = `${this.minHeight}px`;

      this.timer = setTimeout(this.renderNextRow, 0);
    } else if (this.element) {
      this.element.style.minHeight = '0px';
      this.minHeight = this.element.offsetHeight;
    }
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  renderNextRow = (): void => {
    this.setState({ row: this.state.row + this.props.nextRenderIncrement });
  }

  setElement = (el: HTMLElement | null) => {
    if (el) this.element = el;
  };

  renderChildren(children: React.Node): React.Node {
    return React.Children.toArray(children).map((node) => {
      if (this.constructor.Row === node.type) {
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
