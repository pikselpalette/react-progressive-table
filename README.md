# React Progressive Table

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/react-progressive-table.svg)](https://badge.fury.io/js/react-progressive-table)
[![Build Status](https://travis-ci.org/pikselpalette/react-progressive-table.svg?branch=master)](https://travis-ci.org/pikselpalette/react-progressive-table)

This component lets you render tables progressively, row by row. Useful for speeding up responsiveness when rendering large tables.

## Installation

```sh
npm i --save react-progressive-table
```

## Usage

As a standard table:

```jsx
import ProgressiveTable from 'react-progressive-table';

const MyComponent = () => (
  <ProgressiveTable>
    <ProgressiveTable.Table>
      <ProgressiveTable.Header>
        <ProgressiveTable.Row>
          <ProgressiveTable.HeaderCell>
            Foo
          </ProgressiveTable.HeaderCell>
          <ProgressiveTable.HeaderCell>
            Bar
          </ProgressiveTable.HeaderCell>
        </ProgressiveTable.Row>
      </ProgressiveTable.Header>
      <ProgressiveTable.Body>
        <ProgressiveTable.Row>
          <ProgressiveTable.Cell>
            53
          </ProgressiveTable.Cell>
          <ProgressiveTable.Cell>
            42
          </ProgressiveTable.Cell>
        </ProgressiveTable.Row>
      </ProgressiveTable.Body>
    </ProgressiveTable.Table>
  </ProgressiveTable>
);
```

Rendering using different table components, e.g. semantic-ui:

```jsx
import ProgressiveTable from 'react-progressive-table';
import { Table } from 'semantic-ui-react';

const MyComponent = () => (
  <ProgressiveTable>
    <ProgressiveTable.Table as={Table}>
      <ProgressiveTable.Header as={Table.Header>>
        <ProgressiveTable.Row as={Table.Row}>
          <ProgressiveTable.HeaderCell as={Table.HeaderCell}>
            Foo
          </ProgressiveTable.HeaderCell>
          <ProgressiveTable.HeaderCell as={Table.HeaderCell}>
            Bar
          </ProgressiveTable.HeaderCell>
        </ProgressiveTable.Row>
      </ProgressiveTable.Header>
      <ProgressiveTable.Body as={Table.Body}>
        <ProgressiveTable.Row as={Table.Row}>
          <ProgressiveTable.Cell as={Table.Cell}>
            53
          </ProgressiveTable.Cell>
          <ProgressiveTable.Cell as={Table.Cell}>
            42
          </ProgressiveTable.Cell>
        </ProgressiveTable.Row>
      </ProgressiveTable.Body>
    </ProgressiveTable.Table>
  </ProgressiveTable>
);
```
