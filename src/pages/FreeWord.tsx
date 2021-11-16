import { useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import storeList from 'utils/dummy/store.json'
import Button from '@material-ui/core/Button'
import App from 'pages/App'

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

const INIT = 0
const WORD_NOT_INPUT = 1
const RESULT_NOT_FOUND = 2

export default function FreeWord(): JSX.Element {
  const [data, setData] = useState<Store[]>()
  const [freeWord, setFreeWord] = useState('')
  const [errCode, setErrCode] = useState<number>(INIT)

  const onChangeFreeWord = (el: React.ChangeEvent<HTMLInputElement>) => {
    setFreeWord(el.target.value)
  }

  const search = async () => {
    try {
      const res: Store[] = await axios.get('http://localhost:3001/store').then((res: AxiosResponse) => {
        return res.data
      }).catch(() => {
        return storeList
      })

      if (freeWord) {
        const arr: Store[] = res.filter((store: Store) => store.address.includes(freeWord) || store.name.includes(freeWord))
        setData(arr)
        return
      } else {
        setErrCode(WORD_NOT_INPUT)
        throw new Error('検索内容が入力されていません。')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const SearchResult: React.FC<searchResultProps> = (props) => {
    if (props.stores.length) {
      setErrCode(INIT)
      return (
        <ul>{props.stores.map((store: Store, i) =>
          <li key={i}><p>{store.name}</p><p>{store.address}</p></li>)}
        </ul>
      )
    } else {
      setErrCode(RESULT_NOT_FOUND)
      return null
    }
  }

  const ErrMsg = () => {
    switch (errCode) {
      case WORD_NOT_INPUT:
        return (<p>検索内容が入力されていません。</p>)
      case RESULT_NOT_FOUND:
        return (<p>お探しの店舗が見つかりませんでした。</p>)
      default:
        return null
    }
  }

  return (
    <App>
      <div className="freeWord">
        <div className="formRow">
          <input
            type="text"
            onChange={(el: React.ChangeEvent<HTMLInputElement>) => onChangeFreeWord(el)}
          />
          <Button className="searchBtn" onClick={search}>検索</Button>
        </div>
        {data && <SearchResult stores={data} />}
        <ErrMsg />
      </div>
    </App>
  )
}
