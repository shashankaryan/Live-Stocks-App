// @flow

export type Item = {
	name: string,
	price: string,
	lastUpdated: any,
	updateDuration: any,
}

declare var module: {
	hot: {
		accept(path: string, callback: () => void): void,
	},
}
