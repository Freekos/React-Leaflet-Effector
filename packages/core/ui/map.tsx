import { Model, modelView } from 'effector-factorio'
import { useUnit } from 'effector-react'
import L from 'leaflet'
import React from 'react'
import { MapContainer as LeafletContainer } from 'react-leaflet'

import { createMap } from '../map'

interface MapProps extends L.MapOptions {
	children?: React.ReactNode
	model: Model<typeof createMap>
	className?: string
}

export const Map = modelView(createMap, function Map(props: MapProps) {
	const [handleMounted, handleUnMounted] = useUnit([
		props.model.mapMounted,
		props.model.mapUnMounted
	])
	const nodeRef = React.useRef<L.Map | null>(null)

	React.useEffect(() => {
		if (!nodeRef.current) return
		handleMounted(nodeRef.current)

		return () => {
			if (!nodeRef.current) return
			handleUnMounted(nodeRef.current)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<LeafletContainer ref={nodeRef} className={props.className} {...props}>
			{props.children}
		</LeafletContainer>
	)
})
