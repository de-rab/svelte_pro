import { create_deferred } from '../../../helpers.js';

let deferred;

export default {
	before_test() {
		deferred = create_deferred();
	},

	get props() {
		return { thePromise: deferred.promise };
	},

	html: 'waiting',

	test({ assert, component, target }) {
		deferred.resolve(9000);

		return deferred.promise
			.then(() => {
				assert.htmlEqual(target.innerHTML, 'resolved');

				deferred = create_deferred();

				component.thePromise = deferred.promise;

				assert.htmlEqual(target.innerHTML, 'waiting');

				deferred.reject(new Error('something broke'));

				return deferred.promise.catch(() => {});
			})
			.then(() => {
				assert.htmlEqual(target.innerHTML, 'rejected');
			});
	}
};
