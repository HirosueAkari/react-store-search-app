
import prefectureList from 'utils/dummy/prefectures.json'
import storeList from 'utils/dummy/store.json'
import { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'

interface Prefectures {
  prefCode: number
  prefName: string
}

interface Store {
  code: number
  name: string
  address: string
}

function PrefName(): JSX.Element {
  const [data, setData] = useState<Store[]>([])
  const [prefectures, setPrefectures] = useState<Prefectures[]>([])
  const [prefName, setPrefName] = useState('')

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

  const onChangePrefName = (el: React.ChangeEvent<HTMLSelectElement>) => {
    setPrefName(el.target.value)
  }

  const search = async () => {
    const res: Store[] = await axios.get('http://localhost:3001/store').then((res: AxiosResponse) => {
      return res.data
    }).catch(() => {
      return storeList
    })

    if (prefName) {
      const arr: Store[] = res.filter((store: Store) => store.address.includes(prefName))
      setData(arr)
      return
    }
  }

  return (
    <div className="App">
      <div className="form">
        <div className="formRow">
          <select
            onChange={(el: React.ChangeEvent<HTMLSelectElement>) => onChangePrefName(el)}
          >
            {prefectures.map((item, i) =>
              <option key={i} value={item.prefName}>{item.prefName}</option>)}
          </select>
          <button className="searchBtn" onClick={search}>検索</button>
        </div>
        <ul>{data.map((store: Store, i) => <li key={i}><p>{store.name}</p><p>{store.address}</p></li>)}</ul>
      </div>
    </div>
  )
}

export default PrefName
