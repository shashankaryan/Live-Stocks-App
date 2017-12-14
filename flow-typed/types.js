// @flow

export type Item = {
	name: string,
	price: string,
	lastUpdated: string,
}

declare var module: {
	hot: {
		accept(path: string, callback: () => void): void,
	},
}
