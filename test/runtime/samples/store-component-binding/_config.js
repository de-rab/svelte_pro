import { Store } from '../../../../store.js';

const store = new Store({
	name: 'world'
});

export default {
	store,

	html: `
		<h1>Hello world!</h1>
		<input>
	`,

	ssrHtml: `
		<h1>Hello world!</h1>
		<input value=world>
	`,

	test(assert, component, target, window) {
		const input = target.querySelector('input');
		const event = new window.Event('input');

		const changeRecord = [];
		store.on('state', ({ changed, current }) => {
			changeRecord.push({ changed, current });
		});

		input.value = 'everybody';
		input.dispatchEvent(event);

		assert.equal(store.get().name, 'everybody');
		assert.htmlEqual(target.innerHTML, `
			<h1>Hello everybody!</h1>
			<input>
		`);

		assert.deepEqual(changeRecord, [
			{
				current: { name: 'everybody' },
				changed: { name: true }
			}
		]);
	}
};