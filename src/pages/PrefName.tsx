
import prefectureList from 'utils/dummy/prefectures.json'
import storeList from 'utils/dummy/store.json'
import { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import App from 'pages/App'

interface Prefectures {
  prefCode: number
  prefName: string
}

interface Store {
  code: string
  name: string
  postal: string
  address: string
  tel: string
  is24Hours: boolean,
  hasAtm: boolean,
  hasDrug: boolean
}
interface searchResultProps {
  stores: Store[]
}

function PrefName(): JSX.Element {
  const [data, setData] = useState<Store[]>([])
  const [prefectures, setPrefectures] = useState<Prefectures[]>([])
  const [prefName, setPrefName] = useState('')

  useEffect(() => {
    const getPrefectures = async (): Promise<void> => {
      try {
        const res: Prefectures[] = await axios.get('http://localhost:3001/prefectures')
          .then((res: AxiosResponse) => {
            return res.data
          }).catch(() => {
            return prefectureList
          })

        if (res) {
          setPrefectures(res)
        } else {
          throw new Error('都道府県が取得できませんでした')
        }
      } catch (e) {
        console.error(e)
      } finally {
        setPrefectures(prefectureList)
      }
    }

    getPrefectures()
  }, [prefectures])

  const onChangePrefName = (el: React.ChangeEvent<HTMLSelectElement>) => {
    setPrefName(el.target.value)
  }

  const search = async () => {
    try {
      const res: Store[] = await axios.get('http://localhost:3001/store').then((res: AxiosResponse) => {
        return res.data
      }).catch(() => {
        return storeList
      })

      if (prefName) {
        const arr: Store[] = res.filter((store: Store) => store.address.includes(prefName))
        setData(arr)
        return
      } else {
        throw new Error('都道府県が選択されていません')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const SearchResult: React.FC<searchResultProps> = (props) => {
    if (props.stores.length) {
      return (
        <ul>{props.stores.map((store: Store, i) =>
          <li key={i}><p>{store.name}</p><p>{store.address}</p></li>)}
        </ul>
      )
    } else {
      return (<p>お探しの店舗が見つかりませんでした。</p>)
    }
  }

  return (
    <App>
      <div className="prefName">
        <div className="formRow">
          <select
            onChange={(el: React.ChangeEvent<HTMLSelectElement>) => onChangePrefName(el)}
          >
            {prefectures.map((item, i) =>
              <option key={i} value={item.prefName}>{item.prefName}</option>)}
          </select>
          <button className="searchBtn" onClick={search}>検索</button>
        </div>
        <SearchResult stores={data} />
      </div>
    </App>
  )
}

export default PrefName
