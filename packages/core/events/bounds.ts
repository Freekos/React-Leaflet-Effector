import { attach, createEffect, Store } from 'effector'
import L from 'leaflet'

interface BoundsEventsOptions {
	map: Store<L.Map | null>
}

export function createBoundsEvents(options: BoundsEventsOptions) {
	const _boundsSettleFx = createEffect(function <
		T extends 'fitBounds' | 'setMaxBounds' | 'flyToBounds' | 'panToBounds'
	>({
		type,
		map,
		bounds,
		options
	}: {
		type: T
		map: L.Map
		bounds: L.LatLngBoundsExpression
		options?: T extends 'panToBounds' ? L.PanOptions : L.FitBoundsOptions
	}) {
		if (type === 'fitBounds') {
			map.fitBounds(bounds, options)
		}
		if (type === 'setMaxBounds') {
			map.setMaxBounds(bounds)
		}
		if (type === 'flyToBounds') {
			map.flyToBounds(bounds, options)
		}
		if (type === 'panToBounds') {
			map.panInsideBounds(bounds, options)
		}

		return map
	})

	const setFitBoundsFx = attach({
		source: options.map,
		effect: _boundsSettleFx,
		mapParams: (
			{ bounds, options }: { bounds: L.LatLngBoundsExpression; options?: L.FitBoundsOptions },
			map
		): {
			type: 'fitBounds'
			map: L.Map
			bounds: L.LatLngBoundsExpression
			options?: L.FitBoundsOptions
		} => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'fitBounds', map, bounds, options }
		}
	})

	const setMaxBoundsFx = attach({
		source: options.map,
		effect: _boundsSettleFx,
		mapParams: (
			{ bounds }: { bounds: L.LatLngBoundsExpression },
			map
		): { type: 'setMaxBounds'; map: L.Map; bounds: L.LatLngBoundsExpression } => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'setMaxBounds', map, bounds }
		}
	})

	const setFlyToBoundsFx = attach({
		source: options.map,
		effect: _boundsSettleFx,
		mapParams: (
			{ bounds, options }: { bounds: L.LatLngBoundsExpression; options?: L.FitBoundsOptions },
			map
		): {
			type: 'flyToBounds'
			map: L.Map
			bounds: L.LatLngBoundsExpression
			options?: L.FitBoundsOptions
		} => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'flyToBounds', map, bounds, options }
		}
	})

	const setPanToBoundsFx = attach({
		source: options.map,
		effect: _boundsSettleFx,
		mapParams: (
			{ bounds, options }: { bounds: L.LatLngBoundsExpression; options?: L.PanOptions },
			map
		): {
			type: 'panToBounds'
			map: L.Map
			bounds: L.LatLngBoundsExpression
			options?: L.PanOptions
		} => {
			if (!map) throw new Error('Map is not mounted')

			return { type: 'panToBounds', map, bounds, options }
		}
	})

	const removeBoundsFx = attach({
		source: options.map,
		effect: _boundsSettleFx,
		mapParams: (
			params: void,
			map
		): { type: 'setMaxBounds'; map: L.Map; bounds: L.LatLngBounds } => {
			if (!map) throw new Error('Map is not mounted')
			const bounds = L.latLngBounds(L.latLng(0, 0), L.latLng(0, 0))

			return { type: 'setMaxBounds', map, bounds }
		}
	})

	const setBoundsFx = attach({
		source: options.map,
		effect: _boundsSettleFx,
		mapParams: (
			params: void,
			map
		): { type: 'setMaxBounds'; map: L.Map; bounds: L.LatLngBoundsExpression } => {
			if (!map) throw new Error('Map is not mounted')
			const bounds = map.getBounds()

			return { type: 'setMaxBounds', map, bounds }
		}
	})

	return {
		_boundsSettleFx,
		setFitBoundsFx,
		setMaxBoundsFx,
		setFlyToBoundsFx,
		setPanToBoundsFx,
		setBoundsFx,
		removeBoundsFx
	}
}
