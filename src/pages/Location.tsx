import App from 'pages/App'
import { useState } from 'react'
import { Button } from '@material-ui/core'
import Geocode from "react-geocode"
import { makeStyles, createStyles } from "@material-ui/core/styles"

export default function Conditions(): JSX.Element {
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()
  const [localLocation, setLocalLocation] = useState<string>('')

  const styles = makeStyles(() =>
    createStyles({
      searchBtn: {
        backgroundColor: '#3f51b5',
        color: '#FFF'
      }
    })
  )

  const getCurrentLocation = () => {
    const option = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => success(position),
      () => ({}),
      option
    )
  }

  const success = (location: GeolocationPosition) => {
    setLatitude(location.coords.latitude)
    setLongitude(location.coords.longitude)
    const lat: number = location.coords.latitude
    const lon: number = location.coords.longitude

    Geocode.setApiKey('AIzaSyA-7S1CFzW0z10dZ72KrpvbX2qdZxktgY4')
    Geocode.setLanguage('ja')
    Geocode.setRegion('ja')

    Geocode.fromLatLng(String(lat), String(lon)).then((res) => {
      setLocalLocation(res.result[0].formatted_address)
    })
  }

  return (
    <App>
      <div className="location">
        <div className="btn-wrapper">
          <Button className={styles().searchBtn} onClick={getCurrentLocation}>現在地を取得</Button>
        </div>
        <div>
          <p>緯度：{latitude}</p>
          <p>経度：{longitude}</p>
          <p>現在地：{localLocation}</p>
        </div>
      </div>
    </App>
  )
}
