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
    <ProgressiveTable.Table>
      <ProgressiveTable.Header>
        <ProgressiveTable.Row>
          <ProgressiveTable.HeaderCell>Dave</ProgressiveTable.HeaderCell>
          <ProgressiveTable.HeaderCell>Jamie</ProgressiveTable.HeaderCell>
          <ProgressiveTable.HeaderCell>Joe</ProgressiveTable.HeaderCell>
        </ProgressiveTable.Row>
      </ProgressiveTable.Header>
      <ProgressiveTable.Body>
        <ProgressiveTable.Row>
          <ProgressiveTable.Cell>foo</ProgressiveTable.Cell>
          <ProgressiveTable.Cell>bar</ProgressiveTable.Cell>
          <ProgressiveTable.Cell>Bam</ProgressiveTable.Cell>
        </ProgressiveTable.Row>
        <ProgressiveTable.Row>
          <ProgressiveTable.Cell>whizz</ProgressiveTable.Cell>
          <ProgressiveTable.Cell>woop</ProgressiveTable.Cell>
          <ProgressiveTable.Cell>binary star system</ProgressiveTable.Cell>
        </ProgressiveTable.Row>
        <ProgressiveTable.Row>
          <ProgressiveTable.Cell>1</ProgressiveTable.Cell>
          <ProgressiveTable.Cell>2</ProgressiveTable.Cell>
          <ProgressiveTable.Cell>3m</ProgressiveTable.Cell>
        </ProgressiveTable.Row>
      </ProgressiveTable.Body>
    </ProgressiveTable.Table>
  );

  const setupComponent = (overrides = {}, children = getChildren()) => {
    mockProps = {
      ...getRequiredProps(),
      ...overrides
    };

    component = mount((
      <ProgressiveTable {...mockProps}>{children}</ProgressiveTable>
    ));

    instance = component.instance();
  };

  beforeEach(() => {
    jest.useFakeTimers();
    setupComponent();
  });

  afterEach(() => {
    component.unmount();
  });

  const tableRows = () => component.find(ProgressiveTable.Row);
  const minHeight = () => component.find('div').instance().style.minHeight;

  describe('asable components', () => {
    describe('when setting as props to semantic-ui table components', () => {
      const table = () => component.find(Table);
      const header = () => component.find(Table.Header);
      const headerRow = () => header().find(Table.Row);
      const headerCell = () => headerRow().find(Table.HeaderCell);
      const body = () => component.find(Table.Body);
      const bodyRow = () => body().find(Table.Row);
      const bodyCell = () => bodyRow().find(Table.Cell);

      beforeEach(() => {
        setupComponent({ minimumRender: 10 }, (
          <ProgressiveTable.Table as={Table}>
            <ProgressiveTable.Header as={Table.Header}>
              <ProgressiveTable.Row as={Table.Row}>
                <ProgressiveTable.HeaderCell as={Table.HeaderCell}>Dave</ProgressiveTable.HeaderCell>
              </ProgressiveTable.Row>
            </ProgressiveTable.Header>
            <ProgressiveTable.Body as={Table.Body}>
              <ProgressiveTable.Row as={Table.Row}>
                <ProgressiveTable.Cell as={Table.Cell}>foo</ProgressiveTable.Cell>
              </ProgressiveTable.Row>
            </ProgressiveTable.Body>
          </ProgressiveTable.Table>
        ));
      });

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
      beforeEach(() => {
        Object.defineProperty(instance.element, 'offsetHeight', {
          get: () => 78
        });
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
          jest.runOnlyPendingTimers();
          component.update();
        });

        it('renders the same amount of rows', () => {
          expect(tableRows()).toHaveLength(4);
        });
      });
    });
  });
});
