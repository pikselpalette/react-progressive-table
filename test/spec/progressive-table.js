/* globals jest */
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import { Table } from 'semantic-ui-react';
import ProgressiveTable from '../../lib/progressive-table';

Enzyme.configure({ adapter: new Adapter() });

describe('ProgressiveTable', () => {
  let component;
  let instance;
  let mockProps;

  const getRequiredProps = () => ({
    minimumRender: 1
  });

  const getChildren = () => (
    <table>
      <thead>
        <tr>
          <th>Dave</th>
          <th>Jamie</th>
          <th>Joe</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>foo</td>
          <td>bar</td>
          <td>Bam</td>
        </tr>
        <tr>
          <td>whizz</td>
          <td>woop</td>
          <td>binary star system</td>
        </tr>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3m</td>
        </tr>
      </tbody>
    </table>
  );

  const setupComponent = (overrides = {}, children = getChildren()) => {
    mockProps = {
      ...getRequiredProps(),
      ...overrides
    };

    component = mount(
      <ProgressiveTable {...mockProps}>{children}</ProgressiveTable>
    );

    instance = component.instance();
  };

  beforeEach(() => {
    jest.useFakeTimers();
    setupComponent();
  });

  afterEach(() => {
    component.unmount();
  });

  const tableRows = () => component.find('tr');
  const minHeight = () => component.find('div').instance().style.minHeight;

  describe('component state', () => {
    it('has row state', () => {
      expect(component.state().row).toEqual(1);
    });

    it('has minimum render state', () => {
      expect(component.state().minimumRender).toEqual(1);
    });
  });

  describe('component structure', () => {
    const table = () => component.find(Table);
    const header = () => component.find(Table.Header);
    const headerRow = () => header().find(Table.Row);
    const headerCell = () => headerRow().find(Table.HeaderCell);
    const body = () => component.find(Table.Body);
    const bodyRow = () => body().find(Table.Row);
    const bodyCell = () => bodyRow().find(Table.Cell);

    const renderStructureTests = () => {
      it('renders the table correctly', () => {
        expect(table()).toHaveLength(1);
      });

      it('renders the header correctly', () => {
        expect(header()).toHaveLength(1);
      });

      it('renders the body correctly', () => {
        expect(body()).toHaveLength(1);
      });

      it('renders the header rows correctly', () => {
        expect(headerRow()).toHaveLength(1);
      });

      it('renders the body rows correctly', () => {
        expect(bodyRow()).toHaveLength(1);
      });

      it('renders the header cells correctly', () => {
        expect(headerCell()).toHaveLength(1);
        expect(headerCell()).toHaveText('Dave');
      });

      it('renders the body cells correctly', () => {
        expect(bodyCell()).toHaveLength(1);
        expect(bodyCell()).toHaveText('foo');
      });
    };

    describe('when setting as props to semantic-ui table elements', () => {
      beforeEach(() => {
        setupComponent(
          { minimumRender: 10 },
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Dave</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>foo</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        );
      });

      renderStructureTests();
    });

    describe('when setting as props to semantic-ui table components', () => {
      beforeEach(() => {
        setupComponent(
          { minimumRender: 10 },
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Dave</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>foo</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        );
      });

      renderStructureTests();
    });
  });

  describe('before timers have completed', () => {
    it('renders only the first minimumRender rows', () => {
      expect(tableRows()).toHaveLength(1);
    });

    it('renders all rows if minimumRender is larger than the number of rows', () => {
      setupComponent({ minimumRender: 5 });
      expect(tableRows()).toHaveLength(4);
    });

    it('has a minimum height of 0', () => {
      expect(minHeight()).toEqual('0px');
    });

    describe('when component unmounts', () => {
      beforeEach(() => {
        component.unmount();
      });

      it('clears the timer', () => {
        expect(clearTimeout).toHaveBeenCalledWith(instance.timer);
      });
    });
  });

  describe('after first timer completed', () => {
    beforeEach(() => {
      jest.runOnlyPendingTimers();
      component.update();
    });

    it('renders the second minimumRender rows', () => {
      expect(tableRows()).toHaveLength(2);
    });

    describe('after second timer completed', () => {
      let offsetHeight;

      beforeEach(() => {
        Object.defineProperty(instance.element, 'offsetHeight', {
          get: () => offsetHeight
        });
        offsetHeight = 78;
        jest.runOnlyPendingTimers();
        component.update();
      });

      it('renders the third minimumRender rows', () => {
        expect(tableRows()).toHaveLength(3);
      });

      it('sets element minHeight to its current height', () => {
        expect(minHeight()).toEqual('78px');
      });

      describe('after it re-renders because minimumRender prop changes', () => {
        beforeEach(() => {
          component.setProps({
            minimumRender: 2
          });
          component.update();
        });

        it('renders the number of rows matching minimumRender', () => {
          expect(tableRows()).toHaveLength(2);
        });
      });

      describe('after it re-renders due to new children', () => {
        beforeEach(() => {
          component.setProps({
            children: getChildren()
          });
          component.update();
        });

        it('has a minimum height of the previous tables height', () => {
          expect(minHeight()).toEqual('78px');
        });

        it('renders just the first minimumRender rows', () => {
          expect(tableRows()).toHaveLength(1);
        });

        describe('after it finishes rendering', () => {
          beforeEach(() => {
            jest.runAllTimers();
            component.update();
          });

          it('has a minimum height of 0px again', () => {
            expect(minHeight()).toEqual('0px');
          });
        });
      });

      describe('after third timer completed and no more rows to render', () => {
        beforeEach(() => {
          offsetHeight = 129;
          jest.runOnlyPendingTimers();
          component.update();
        });

        it('renders the same amount of rows', () => {
          expect(tableRows()).toHaveLength(4);
        });

        it('sets element minHeight to its current height', () => {
          expect(minHeight()).toEqual('129px');
        });
      });
    });
  });
});
