/* globals jest */
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
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

  const setupComponent = (overrides = {}) => {
    mockProps = {
      ...getRequiredProps(),
      ...overrides
    };

    component = mount((
      <ProgressiveTable {...mockProps}>{getChildren()}</ProgressiveTable>
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
