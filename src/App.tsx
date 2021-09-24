import './App.scss'
import storeList from 'utils/dummy/store.json'
import prefectureList from 'utils/dummy/prefectures.json'
import { useState, useEffect } from "react"
import axios, { AxiosResponse } from 'axios'

interface Store {
  code: number
  name: string
  address: string
}

interface Prefectures {
  prefCode: number
  prefName: string
}

function App() {
  const [data, setData] = useState<Store[]>([])
  const [prefectures, setPrefectures] = useState<Prefectures[]>([])
  const [storeName, setStoreName] = useState('')
  const [prefName, setPrefName] = useState('')

  const search = async () => {
    const res = await axios.get('http://localhost:3001/store').then((res: AxiosResponse) => {
      return res.data
    }).catch(() => {
      return storeList
    })

    if (storeName) {
      const arr: Store[] = res.filter((store: Store) => store.name.includes(storeName))
      setData(arr)
      return
    }

    if (prefName) {
      const arr: Store[] = res.filter((store: Store) => store.address.includes(prefName))
      setData(arr)
      return
    }
  }

  useEffect(() => {
    const f = async () => {
      const res: Prefectures[] = await axios.get('http://localhost:3001/prefectures').then((res: AxiosResponse) => {
        return res.data
      }).catch(() => {
        return prefectureList
      })

      setPrefectures(res)
    }

    f()
  }, [prefectures])

  const onChangeValue = (el: React.ChangeEvent<HTMLInputElement>) => {
    setStoreName(el.target.value)
  }

  const onChangeSearchData = (el: React.ChangeEvent<HTMLSelectElement>) => {
    setPrefName(el.target.value)
  }

  return (
    <div className="App">
      <div className="form">
        <div className="formRow">
          <p>店名</p>
          <input
            type="text"
            onChange={(el: React.ChangeEvent<HTMLInputElement>) => onChangeValue(el)}
          />
        </div>
      </div>
      <div className="form">
        <div className="formRow">
          <p>都道府県</p>
          <select
            onChange={(el: React.ChangeEvent<HTMLSelectElement>) => onChangeSearchData(el)}
          >
            {prefectures.map((item, i) =>
              <option key={i} value={item.prefName}>{item.prefName}</option>)}
          </select>
        </div>
      </div>
      <button className="searchBtn" onClick={search}>検索</button>
      <ul>{data.map((store: Store, i) => <li key={i}>{store.name}</li>)}</ul>
    </div>
  )
}

export default App;
