import './App.css'
import * as db from 'neo4j-driver'

function App() {
  const driver = db.driver('bolt://localhost:7687', db.auth.basic('neo4j', 'tesseract'))
  const serverInfo=driver.getServerInfo()
  console.log(serverInfo)
  return (
    <>
   Text.
    </>
  )
}

export default App
