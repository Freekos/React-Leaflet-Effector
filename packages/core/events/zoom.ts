import { attach, createEffect, Store } from 'effector'

interface ZoomEventsOptions {
	map: Store<L.Map | null>
}

export function createZoomEvents(options: ZoomEventsOptions) {
	const _zoomSettleFx = createEffect(function <T extends 'zoom' | 'zoomIn' | 'zoomOut'>({
		type,
		map,
		value,
		options
	}: {
		type: T
		map: L.Map
		value: number
		options: L.ZoomOptions
	}) {
		if (type === 'zoom') {
			map.setZoom(value, options)
		}
		if (type === 'zoomIn') {
			map.zoomIn(value, options)
		}
		if (type === 'zoomOut') {
			map.zoomOut(value, options)
		}

		return map
	})

	const setZoomFx = attach({
		source: options.map,
		effect: _zoomSettleFx,
		mapParams: (
			{ zoom, options }: { zoom: number; options: L.ZoomOptions },
			map
		): { type: 'zoom'; map: L.Map; value: number; options: L.ZoomOptions } => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'zoom', map, value: zoom, options }
		}
	})

	const setZoomInFx = attach({
		source: options.map,
		effect: _zoomSettleFx,
		mapParams: (
			{ delta, options }: { delta: number; options: L.ZoomOptions },
			map
		): { type: 'zoomIn'; map: L.Map; value: number; options: L.ZoomOptions } => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'zoomIn', map, value: delta, options }
		}
	})

	const setZoomOutFx = attach({
		source: options.map,
		effect: _zoomSettleFx,
		mapParams: (
			{ delta, options }: { delta: number; options: L.ZoomOptions },
			map
		): { type: 'zoomOut'; map: L.Map; value: number; options: L.ZoomOptions } => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'zoomOut', map, value: delta, options }
		}
	})

	return { _zoomSettleFx, setZoomFx, setZoomInFx, setZoomOutFx }
}
