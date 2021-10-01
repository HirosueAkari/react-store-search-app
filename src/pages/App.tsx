import 'App.scss'
import storeList from 'utils/dummy/store.json'
import prefectureList from 'utils/dummy/prefectures.json'
import { useState, useEffect } from 'react'
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

function App(): JSX.Element {
  const [data, setData] = useState<Store[]>([])
  const [prefectures, setPrefectures] = useState<Prefectures[]>([])
  const [storeName, setStoreName] = useState('')
  const [prefName, setPrefName] = useState('')
  const [freeWord, setFreeWord] = useState('')
  const [address, setAddress] = useState('')

  const search = async () => {
    const res: Store[] = await axios.get('http://localhost:3001/store').then((res: AxiosResponse) => {
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

    if (address) {
      const arr: Store[] = res.filter((store: Store) => {
        return store.address === address
      })
      setData(arr)
      return
    }

    if (freeWord) {
      const arr: Store[] = res.filter((store: Store) => store.address.includes(freeWord) || store.name.includes(freeWord))
      setData(arr)
      return
    }
  }

  useEffect(() => {
    const getPrefectures = async (): Promise<void> => {
      const res: Prefectures[] = await axios.get('http://localhost:3001/prefectures')
        .then((res: AxiosResponse) => {
          return res.data
        }).catch(() => {
          return prefectureList
        })

      setPrefectures(res)
    }

    getPrefectures()
  }, [prefectures])

  const onChangeStoreName = (el: React.ChangeEvent<HTMLInputElement>) => {
    setStoreName(el.target.value)
  }

  const onChangeFreeWord = (el: React.ChangeEvent<HTMLInputElement>) => {
    setFreeWord(el.target.value)
  }

  const onChangeAddress = (el: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(el.target.value)
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
            onChange={(el: React.ChangeEvent<HTMLInputElement>) => onChangeStoreName(el)}
          />
        </div>
      </div>
      <div className="form">
        <div className="formRow">
          <p>住所</p>
          <input
            type="text"
            onChange={(el: React.ChangeEvent<HTMLInputElement>) => onChangeAddress(el)}
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
      <div className="form">
        <div className="formRow">
          <p>フリーワード</p>
          <input
            type="text"
            onChange={(el: React.ChangeEvent<HTMLInputElement>) => onChangeFreeWord(el)}
          />
        </div>
      </div>
      <button className="searchBtn" onClick={search}>検索</button>

      <ul>{data.map((store: Store, i) => <li key={i}><p>{store.name}</p><p>{store.address}</p></li>)}</ul>

    </div>
  )
}

export default App;
