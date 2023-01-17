import { createEffect, createEvent, createStore, sample } from 'effector'
import { modelFactory } from 'effector-factorio'
import L from 'leaflet'

interface MapOptions {
	observers?: 'move' | 'zoom' | 'all'
}

export const createMap = modelFactory(function (options: MapOptions) {
	const mapMounted = createEvent<L.Map>()
	const mapUnMounted = createEvent<L.Map>()

	const mapCenterChanged = createEvent<L.LatLngLiteral>()
	const handleChangeCenter = mapCenterChanged.prepend<L.LeafletEvent>((e) => e.target.getCenter())

	const mapZoomChanged = createEvent<number>()
	const handleChangeZoom = mapZoomChanged.prepend<L.LeafletEvent>((e) => e.target.getZoom())

	const _observeMapFx = createEffect<L.Map, L.Map>()
	const _unObserveMapFx = createEffect<L.Map, L.Map>()

	const $map = createStore<L.Map | null>(null)
	const $center = createStore<L.LatLngLiteral>({ lat: 0, lng: 0 }).on(
		mapCenterChanged,
		(_, center) => center
	)
	const $zoom = createStore<number>(0).on(mapZoomChanged, (_, zoom) => zoom)

	// Logic
	sample({
		clock: mapMounted,
		target: _observeMapFx
	})
	$map.on(mapMounted, (_, map) => {
		map.on('move', handleChangeCenter)
		map.on('zoom', handleChangeZoom)
	})

	_observeMapFx.use((map) => {
		if (options.observers === 'all') {
			map.on('move', handleChangeCenter)
			map.on('zoom', handleChangeZoom)
		}
		if (options.observers === 'move') {
			map.on('move', handleChangeCenter)
		}
		if (options.observers === 'zoom') {
			map.on('zoom', handleChangeZoom)
		}

		return map
	})

	sample({
		clock: mapUnMounted,
		target: [_unObserveMapFx, $map.reinit!]
	})

	_unObserveMapFx.use((map) => {
		if (options.observers === 'all') {
			map.off('move', handleChangeCenter)
			map.off('zoom', handleChangeZoom)
		}
		if (options.observers === 'move') {
			map.off('move', handleChangeCenter)
		}
		if (options.observers === 'zoom') {
			map.off('zoom', handleChangeZoom)
		}

		return map
	})

	return { mapMounted, mapUnMounted, _observeMapFx, _unObserveMapFx, $map, $center, $zoom }
})
