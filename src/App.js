import './App.css';
import {useState} from "react";
import ASN1 from '@lapo/asn1js';

const Base64 = require('@lapo/asn1js/base64')

function App() {

  const [drag, setDrag] = useState(false)
  const [render, setRender] = useState(false)
  const [index, setIndex] = useState(0)
  const [isActive, setIsActive] = useState(0)
  const certUsers = []

  const getInfoUsers = () => {
    if (localStorage.length !== 0) {
      Object.keys(localStorage).forEach(key => {
        let certData = localStorage.getItem(key)
        let t = certData.substring(certData.indexOf('base64,') + 7)
        let result = ASN1.decode(Base64.unarmor(t))
        let commonName = result.sub[0].sub[5].sub[3].sub[0].sub[1].content()
        let organizationName = result.sub[0].sub[5].sub[0].sub[0].sub[1].content()
        let serialNumber = result.sub[0].sub[5].sub[4].sub[0].sub[1].content()
        let cn = result.sub[0].sub[3].sub[2].sub[0].sub[1].content()
        let userInfo = {commonName, organizationName, serialNumber, cn}
        certUsers.push(userInfo)
      })
    }
  }

  const dragStartHandler = (e) => {
    e.preventDefault()
    setDrag(true)
  }
  const dragLeaveHandler = (e) => {
    e.preventDefault()
    setDrag(false)
  }
  const onDropHandler = (e) => {
    e.preventDefault()
    let files = [...e.dataTransfer.files]
    files.forEach(file => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = function () {
        console.log(reader.error);
      };
      reader.onload = function () {
        localStorage.setItem(file.name, reader.result)
      }
      setDrag(false)
    })
  }
  const newIndexCert = (newIndex) => {
    setIndex(newIndex)
  }
  getInfoUsers()
  return (
      <main className={'container'}>
        <div className={'form'}>
          <div className={'list'}>
            {certUsers[0]
                ? certUsers.map((u, index) => {
                  return <div className={`userInfo ${isActive === index
                      ? 'active'
                      : null}`}
                              key={index} onClick={() => {
                    newIndexCert(index)
                    setIsActive(index)
                  }}>{u.commonName}
                  </div>
                })
                : <div>Завантажте сертифікат</div>}
          </div>
          <button onClick={() => {setRender(render ? false : true)}}>Оновити данні</button>
        </div>
        <div className={'info'}>
          {certUsers[0]
              ? <div>
                <div><b>Common name:</b>{certUsers[index].commonName}</div>
                <div><b>Organization:</b>{certUsers[index].organizationName}</div>
                <div><b>Issuer CN:</b>{certUsers[index].cn}</div>
                <div><b>Serial Number:</b>{certUsers[index].serialNumber}</div>
              </div>
              : <div>
                Завантажте сертифікат
              </div>}
        </div>
        <div className={'dragDrop'}>
          {drag
              ? <div
                  onDragStart={e => dragStartHandler(e)}
                  onDragLeave={e => dragLeaveHandler(e)}
                  onDragOver={e => dragStartHandler(e)}
                  onDrop={e => onDropHandler(e)}
                  className={'drop'}>Відпустіть файли, щоб їх завантажити</div>
              : <div
                  onDragStart={e => dragStartHandler(e)}
                  onDragLeave={e => dragLeaveHandler(e)}
                  onDragOver={e => dragStartHandler(e)}
                  className={'drop'}
              >Перетянгіть файли в це поле, щоб їх завантажити</div>}
          <div id={'result'}>
          </div>
        </div>
      </main>
  );
}

export default App;
