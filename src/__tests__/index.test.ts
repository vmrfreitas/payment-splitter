import { createApp } from '../app';

test('hello world!', () => {
	expect(createApp()).toBeInstanceOf(Function);
});