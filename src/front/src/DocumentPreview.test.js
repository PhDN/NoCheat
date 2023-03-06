/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import { beforeAll, describe, expect, test } from '@jest/globals';
import { act, queryByAttribute, render, screen } from '@testing-library/react';
import "fake-indexeddb/auto";

import DocumentPreview, { isPlainText, isPdf } from './DocumentPreview';

import Blob from 'fetch-blob';
globalThis.Blob = Blob;

import { TextEncoder, TextDecoder } from 'web-encoding';
globalThis.TextDecoder = TextDecoder;
globalThis.TextEncoder = TextEncoder;
/*FileReader.prototype.readAsArrayBuffer = function(blob) {
    this.dispatchEvent(new ProgressEvent('loadstart'));
    blob.arrayBuffer().then(buffer => {
        Object.defineProperty(this, 'result', {
            configurable: true,
            get() { return buffer; }
        });
        console.log(this.result);
        this.dispatchEvent(new ProgressEvent('loadend'));
        this.dispatchEvent(new ProgressEvent('load'));
    });
};*/

const sleep = async msecs => new Promise(resolve => setTimeout(resolve, msecs));

describe('Test isPdf', () => {
    test.each`
        type
        ${'application/pdf'}
        ${'application/x-pdf'}
    `('Document of type $type is a PDF', ({type}) => {
        const blob = new Blob([], { type });
        expect(isPdf(blob)).toBe(true);
    });

    test.each`
        type
        ${'text/plain'}
        ${'appliction/json'}
        ${'appliction/x-msdos-program'}
        ${'appliction/pdf'}
        ${'application/z-pdf'}
        ${'image/png'}
        ${'image/svg+xml'}
        ${'audio/ogg'}
        ${'video/mpeg'}
    `('Document of type "$type" is not a PDF', ({type}) => {
        const blob = new Blob([], { type });
        expect(isPdf(blob)).toBe(false);
    });
});

describe('Test isPlainText', () => {
    test.each`
        type
        ${'text/plain'}
        ${'application/json'}
        ${'application/x-sh'}
        ${'application/x-csh'}
        ${'application/xhtml+xml'}
        ${'image/svg+xml'}
    `('Document of type "$type" is plain text', ({type}) => {
        const blob = new Blob([], { type });
        expect(isPlainText(blob)).toBe(true);
    });

    test.each`
        type
        ${''}
        ${'application/x-msdos-program'}
        ${'inode/directory'}
        ${'image/png'}
        ${'application/pdf'}
        ${'application/x-pdf'}
        ${'audio/ogg'}
        ${'video/mpeg'}
    `('Document of type "$type" is not plain text', ({type}) => {
        const blob = new Blob([], { type });
        expect(isPlainText(blob)).toBe(false);
    });
});

describe('Test plain text preview', () => {
    const textContents = 'Hello world!';

    test.each`
        type                    |   expected            |   centered
        ${''}                   |   ${'unknown'}        |   ${true}
        ${'text/plain'}         |   ${textContents}     |   ${false}
        ${'text/html'}          |   ${textContents}     |   ${false}
        ${'application/json'}   |   ${textContents}     |   ${false}
        ${'application/x-sh'}   |   ${textContents}     |   ${false}
        ${'image/png'}          |   ${'image/png'}      |   ${true}
    `('Mime type "$type" displays text "$expected"', async ({ type, expected, centered }) => {
        let dom;

        await act(async () => {
            dom = render(<DocumentPreview document={new Blob([textContents], { type })} />);
            await sleep(20);
        });

        const docPreviews = dom.container.getElementsByClassName('DocumentPreview');
        expect(docPreviews.length).toBe(1);
        const docPreview = docPreviews[0];

        expect(docPreview.textContent).toBe(expected);
        expect(docPreview.classList.contains('center')).toBe(centered);
    });
});
