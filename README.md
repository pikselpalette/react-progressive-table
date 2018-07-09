# React Progressive Table

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/react-progressive-table.svg)](https://badge.fury.io/js/react-progressive-table)
[![Build Status](https://travis-ci.org/pikselpalette/react-progressive-table.svg?branch=master)](https://travis-ci.org/pikselpalette/react-progressive-table)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/782fe5ad443746038fcb68a299dd4916)](https://www.codacy.com/app/samboylett/react-progressive-table?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pikselpalette/react-progressive-table&amp;utm_campaign=Badge_Grade)
[![dependencies Status](https://david-dm.org/pikselpalette/react-progressive-table/status.svg)](https://david-dm.org/pikselpalette/react-progressive-table)
[![devDependencies Status](https://david-dm.org/pikselpalette/react-progressive-table/dev-status.svg)](https://david-dm.org/pikselpalette/react-progressive-table?type=dev)
[![peerDependencies Status](https://david-dm.org/pikselpalette/react-progressive-table/peer-status.svg)](https://david-dm.org/pikselpalette/react-progressive-table?type=peer)

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
    <table>
      <thead>
        <tr>
          <th>
            Foo
          </th>
          <th>
            Bar
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            53
          </td>
          <td>
            42
          </td>
        </tr>
      </tbody>
    </table>
  </ProgressiveTable>
);
```

Rendering using different table components, e.g. semantic-ui:

```jsx
import ProgressiveTable from 'react-progressive-table';
import { Table } from 'semantic-ui-react';

const MyComponent = () => (
  <ProgressiveTable tr={Table.Row}>
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            Foo
          </Table.HeaderCell>
          <Table.HeaderCell>
            Bar
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            53
          </Table.Cell>
          <Table.Cell>
            42
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </ProgressiveTable>
);
```
