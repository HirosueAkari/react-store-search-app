import App from 'pages/App'
import { useState } from 'react'
import { Button } from '@material-ui/core'
import Geocode from "react-geocode"
// import storeList from 'utils/dummy/store.json'
import geoStoreList from 'utils/dummy/geoStore.json'
import { makeStyles, createStyles } from "@material-ui/core/styles"

interface Store {
  code: string
  name: string
  postal: string
  address: string
  tel: string
  is24Hours: boolean
  hasAtm: boolean
  hasDrug: boolean
  // [key: string]: string | number
  // 上記にすると、boolean型の値に影響がでるのはなぜ
}

interface geoStore extends Store {
  latitude?: number, // 任意じゃないと動かないのはなぜ
  longitude?: number  // 任意じゃないと動かないのはなぜ
  distance?: number
}

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
    const key: string | undefined = process.env.REACT_APP_GOOGLE_MAP_API_KEY

    Geocode.setApiKey(String(key))
    Geocode.setLanguage('ja')
    Geocode.setRegion('ja')

    Geocode.fromLatLng(String(lat), String(lon)).then((res) => {
      setLocalLocation(res.results[0].formatted_address)
      // addStoreGeoCode()
    }).then(() => {
      geoStoreList.forEach((data: geoStore) => {
        if (data.latitude && data.longitude) {
          const distance = getDistance(lat, lon, data.latitude, data.longitude)
          data.distance = distance
        } else {
          return
        }
      })
    })
  }

  // const addStoreGeoCode = () => {
  //   storeList.forEach((data: geoStore) => {
  //     Geocode.fromAddress(data.address).then((res) => {
  //       const { lat, lng } = res.results[0].geometry.location
  //       data.latitude = lat
  //       data.longitude = lng
  //     })
  //   })
  // }

  const getDistance = (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    let distance: number = 0
    const R = Math.PI / 180

    if ((Math.abs(fromLat - toLat) < 0.00001) && (Math.abs(fromLng - toLng) < 0.00001)) {
      distance = 0
    } else {
      fromLat *= R
      fromLng *= R
      toLat *= R
      toLng *= R

      distance = 6371 * Math.acos(Math.cos(fromLat) * Math.cos(toLat) * Math.cos(toLng - fromLng) + Math.sin(fromLat) * Math.sin(toLat))
    }
    console.log(distance)
    return distance
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
