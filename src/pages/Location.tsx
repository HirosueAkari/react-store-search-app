import App from 'pages/App'
import { useState, useRef, useCallback } from 'react'
import { Button } from '@material-ui/core'
import Geocode from "react-geocode"
import storeList from 'utils/dummy/store.json'
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api"
import Direction from '../components/Direction'
interface Store {
  code: string
  name: string
  postal: string
  address: string
  tel: string
  is24Hours: boolean
  hasAtm: boolean
  hasDrug: boolean
  latitude: number
  longitude: number
  // [key: string]: string | number
  // 上記にすると、boolean型の値に影響がでるのはなぜ
}

interface distanceStore extends Store {
  distance?: number //任意でないとエラーになるのはなぜ
}

interface searchResultProps {
  stores: distanceStore[]
}

export default function Location(): JSX.Element {
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()
  const [localLocation, setLocalLocation] = useState<string>('')
  const [data, setData] = useState<distanceStore[]>()
  const [errCode, setErrorCode] = useState<number>()
  const [resultData, setResultData] = useState<distanceStore[]>([])

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

    try {
      if (!navigator.geolocation) {
        throw new Error('現在地取得できない端末です')
      }

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => success(position),
        (error: GeolocationPositionError) => fail(error),
        option
      )
    } catch (e) {
      console.error(e)
    }
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
      storeList.forEach((data: distanceStore) => {
        if (data.latitude && data.longitude) {
          const distance = getDistance(lat, lon, data.latitude, data.longitude)
          data.distance = distance
        } else {
          return
        }
      })
    }).then(() => {
      storeList.sort((a: distanceStore, b: distanceStore) => {
        if (a.distance && b.distance) {
          return (a.distance < b.distance) ? -1 : 1
        } else return 0
      })
      setData(storeList)
    }).then(() => {
      const arr = storeList.filter((store: distanceStore) => store.distance && store.distance < 10)
      setResultData(arr)
    })
  }

  const fail = (e: GeolocationPositionError) => {
    setErrorCode(e.code)
  }

  const ErrMsg = () => {
    const errmsg = [
      '原因不明のエラーです',
      '位置情報の取得が許可されませんでした。',
      '位置情報が取得できませんでした',
      'タイムアウトしました'
    ]

    if (errCode !== undefined) return (<p>{errmsg[errCode]}</p>)

    return null
  }

  // const addStoreGeoCode = () => {
  //   storeList.forEach((data: distanceStore) => {
  //     Geocode.fromAddress(data.address).then((res) => {
  //       const { lat, lng } = res.results[0].geometry.location
  //       data.latitude = lat
  //       data.longitude = lng
  //     })
  //   })
  // }

  /*
  * 現在地から店舗リストにある店舗までの距離を計算する
  * 地球を半径6,371kmの球体としたときの計算
  * @param formLat 現在地の緯度
  * @param fromLng 現在地の経度
  * @param toLat 店舗の緯度
  * @param toLng 店舗の経度
  */
  const getDistance = (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    let distance: number = 0
    const R: number = Math.PI / 180 // ラジアンを求める計算（Math.PI: 円周率）

    if ((Math.abs(fromLat - toLat) < 0.00001) && (Math.abs(fromLng - toLng) < 0.00001)) {
      distance = 0
    } else {
      fromLat *= R
      fromLng *= R
      toLat *= R
      toLng *= R

      distance =
        6371 * Math.acos(Math.cos(fromLat) * Math.cos(toLat) * Math.cos(toLng - fromLng) +
          Math.sin(fromLat) * Math.sin(toLat))
    }

    return Math.floor(distance * 10) / 10
  }

  const SearchResult: React.FC<searchResultProps> = (props) => {
    if (props.stores.length) {
      return (
        <ul className="store-list">{props.stores.map((store: distanceStore, i) =>
          <li key={i}>
            <p>{store.name}</p><p>{store.address}</p><p>{store.distance}km</p>
          </li>)}
        </ul>
      )
    } else {
      return (<p>お近くの店舗が見つかりませんでした。</p>)
    }
  }

  const GoogleMapComponent = () => {
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: 'AIzaSyA-7S1CFzW0z10dZ72KrpvbX2qdZxktgY4',
    });

    const mapRef: React.MutableRefObject<undefined> = useRef();
    const onMapLoad = useCallback((map) => {
      mapRef.current = map;
    }, []);

    if (loadError) return (<p>Error</p>);
    if (!isLoaded) return (<p>Loading...</p>);
    if (!latitude) return null
    if (!longitude) return null
    if (resultData.length === 0) return null

    const center = {
      lat: latitude,
      lng: longitude
    }

    return (
      <GoogleMap
        id="map"
        mapContainerStyle={{
          height: "500px",
          width: "700px",
        }}
        zoom={15}
        center={center}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
        onLoad={onMapLoad}
      >
        <Marker position={center} />
        {/* {resultData.map((data: distanceStore, i) =>
          <Marker key={i} position={{ lat: data.latitude, lng: data.longitude }} />
        )} */}
        <Direction origin={center} destination={{ lat: resultData[0].latitude, lng: resultData[0].longitude }} />
      </GoogleMap>
    )
  }

  return (
    <App>
      <div className="location">
        <div className="left">
          <div className="btn-wrapper">
            <Button className={styles().searchBtn} onClick={getCurrentLocation}>現在地を取得</Button>
          </div>
          <div>
            <p>緯度：{latitude}</p>
            <p>経度：{longitude}</p>
            <p>現在地：{localLocation}</p>
          </div>
          <ErrMsg />
          {data && <SearchResult stores={data.filter((store: distanceStore) => store.distance && store.distance < 10)} />}
        </div>
        <div className="right">
          <GoogleMapComponent />
        </div>
      </div>
    </App>
  )
}
