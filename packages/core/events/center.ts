import { attach, createEffect, Store } from 'effector'

interface CenterEventsOptions {
	map: Store<L.Map | null>
}

export function createCenterEvents(options: CenterEventsOptions) {
	const _centerSettleFx = createEffect(function <T extends 'center' | 'panTo'>({
		type,
		map,
		center,
		options
	}: {
		type: T
		map: L.Map
		center: L.LatLngExpression
		options: L.PanOptions
	}) {
		if (type === 'panTo') {
			map.panTo(center, options)
		}

		return map
	})

	const setCenterFx = attach({
		source: options.map,
		effect: _centerSettleFx,
		mapParams: (
			{ center, options }: { center: L.LatLngExpression; options: L.PanOptions },
			map
		): { type: 'center'; map: L.Map; center: L.LatLngExpression; options: L.PanOptions } => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'center', map, center, options }
		}
	})

	return { _centerSettleFx, setCenterFx }
}
