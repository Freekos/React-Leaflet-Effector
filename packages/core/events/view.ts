import { attach, createEffect, Store } from 'effector'

interface ViewEventsOptions {
	map: Store<L.Map | null>
}

export function createViewEvents(options: ViewEventsOptions) {
	const _viewSettleFx = createEffect(function <T extends 'view' | 'fly'>({
		type,
		map,
		center,
		zoom,
		options
	}: {
		type: T
		map: L.Map
		center: L.LatLngExpression
		zoom: number
		options?: L.ZoomPanOptions
	}) {
		if (type === 'view') {
			map.setView(center, zoom, options)
		}
		if (type === 'fly') {
			map.flyTo(center, zoom, options)
		}

		return map
	})

	const setViewFx = attach({
		source: options.map,
		effect: _viewSettleFx,
		mapParams: (
			{
				center,
				zoom,
				options
			}: { center: L.LatLngExpression; zoom: number; options?: L.ZoomPanOptions },
			map
		): {
			type: 'view'
			map: L.Map
			center: L.LatLngExpression
			zoom: number
			options?: L.ZoomPanOptions
		} => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'view', map, center, zoom, options }
		}
	})

	const setFlyToFx = attach({
		source: options.map,
		effect: _viewSettleFx,
		mapParams: (
			{
				center,
				zoom,
				options
			}: { center: L.LatLngExpression; zoom: number; options?: L.ZoomPanOptions },
			map
		): {
			type: 'fly'
			map: L.Map
			center: L.LatLngExpression
			zoom: number
			options?: L.ZoomPanOptions
		} => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'fly', map, center, zoom, options }
		}
	})

	return { _viewSettleFx, setViewFx, setFlyToFx }
}
