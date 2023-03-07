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
        ${'text/javascript'}
        ${'text/x-c'}
        ${'text/x-fortran'}
        ${'text/x-java-source'}
        ${'text/x-h'}
        ${'application/javascript'}
        ${'application/x-javascript'}
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
        ${'application/book'}
        ${'application/pdf'}
        ${'application/postscript'}
        ${'application/x-bzip2'}
        ${'application/x-msdos-program'}
        ${'application/x-pdf'}
        ${'audio/aiff'}
        ${'audio/midi'}
        ${'audio/ogg'}
        ${'image/png'}
        ${'inode/directory'}
        ${'video/mpeg'}
        ${'text/x-audiosoft-intra'}
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
