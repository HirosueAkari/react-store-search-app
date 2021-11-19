import { DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import { useState, useCallback } from 'react'

interface value {
  lat: number
  lng: number
}

interface Props {
  origin: value
  destination: value
}

export default function Direction({ origin, destination }: Props): JSX.Element | null {
  const [currentDirection, setCurrentDirection] = useState<google.maps.DirectionsResult>()

  const directionsCallback = useCallback((googleResponse) => {
    if (googleResponse) {
      if (currentDirection) {
        if (!currentDirection.geocoded_waypoints) return

        if (
          googleResponse.status === "OK" &&
          googleResponse.geocoded_waypoints.length !==
          currentDirection.geocoded_waypoints.length
        ) {
          console.log("ルートが変更されたのでstateを更新する");
          setCurrentDirection(googleResponse);
        } else {
          console.log("前回と同じルートのためstateを更新しない");
        }
      } else {
        if (googleResponse.status === "OK") {
          console.log("初めてルートが設定されたため、stateを更新する");
          setCurrentDirection(googleResponse);
        } else {
          console.log("前回と同じルートのためstateを更新しない");
        }
      }
    }
  }, [currentDirection])

  return (
    <>
      <DirectionsService
        options={{
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        }}
        callback={directionsCallback}
      />
      {currentDirection !== null && (
        <DirectionsRenderer
          options={{
            directions: currentDirection,
          }}
        />
      )}
    </>
  )
}
