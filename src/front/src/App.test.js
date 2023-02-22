/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import { expect, test } from '@jest/globals';
import { queryByAttribute, render, screen } from '@testing-library/react';
import "fake-indexeddb/auto";

import App from './App';

test('Input ID and label for match', () => {
    const dom = render(<App />);

    const label = dom.container.getElementsByTagName('label')?.[0];
    expect(label).not.toBeFalsy();
    expect(queryByAttribute('id', dom.container, label.htmlFor)).not.toBeNull();
});
